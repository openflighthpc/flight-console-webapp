import 'xterm/css/xterm.css';
import * as io from 'socket.io-client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import mkDebug from 'debug';
import { FitAddon } from 'xterm-addon-fit'
import { Terminal as XTerm } from 'xterm'

import { ConfigContext, useEventListener, utils } from 'flight-webapp-components';

import './Terminal.css';
import useRequestedDirectory from './useRequestedDirectory';
import { missingSSHConfigurationToast } from './InstallSshConfiguration';
import { useInitializeSession } from './api';
import { useToast } from './ToastContext';

const debug = mkDebug('flight:Terminal');
const terminalOptions = {
  cursorBlink: true,
  scrollback: 10000,
  tabStopWidth: 8,
  bellStyle: "sound",
};

function buildSocketIOParams(config) {
  const apiUrl = new URL(config.apiRootUrl, window.location.origin);
  const wsUrl = new URL(config.apiRootUrl, window.location.origin);
  wsUrl.pathname = '';
  let path = '/ssh/socket.io';
  if (apiUrl.pathname !== '/') {
    path = `${apiUrl.pathname}${path}`;
  }

  return [ wsUrl.toString(), { path } ];
}

function useTerminal(containerRef) {
  const config = useContext(ConfigContext);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
  const shutdownMessageShown = useRef(false);
  const { requestedDir } = useRequestedDirectory();
  const { get: initializeSession, response } = useInitializeSession(requestedDir);
  const { addToast } = useToast();
  // Possible states are `uninitialized`, `connected`, `disconnected`.
  const [ terminalState, setTerminalState ] = useState('uninitialized');
  const [ title, setTitle ] = useState('');

  function resizeTerminal() {
    const term = termRef.current;
    const socket = socketRef.current;
    const fitAddon = fitAddonRef.current;
    if (term != null && socket != null && fitAddon != null) {
      fitAddon.fit();
      debug('resizing terminal: %s %s', term.cols, term.rows);
      socket.emit('resize', { cols: term.cols, rows: term.rows })
    }
  }

  useEventListener(window, 'resize', resizeTerminal);

  useEffect(() => {
    if (containerRef.current == null) { return; }

    debug('initializing terminal');
    const term = new XTerm();
    const fitAddon = new FitAddon();
    termRef.current = term;
    fitAddonRef.current = fitAddon;

    term.setOption('scrollback', terminalOptions.scrollback)
    term.setOption('tabStopWidth', terminalOptions.tabStopWidth)
    term.setOption('bellStyle', terminalOptions.bellStyle)
    term.loadAddon(fitAddon)
    term.open(containerRef.current);
    term.focus();
    fitAddon.fit()
    connect();

    return function dispose() {
      debug('disposing');
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      term.dispose();
    }

    // We're expecting `response` to change and don't want to re-run the hook
    // when it does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ containerRef, initializeSession ]);

  function updateTerminalState(term, state) {
    setTerminalState(state);
    if (state === 'connected') {
      term.setOption('cursorBlink', terminalOptions.cursorBlink);
    } else {
      term.setOption('cursorBlink', false);
    }
  }

  function connect() {
    const term = termRef.current;
    debug('initializing session');
    return initializeSession().then((responseBody) => {
      const recoverable = response.status === 422 && response.data.errors.every((e) => {
        return e.recoverable;
      })
      if (recoverable) {
        addRecoverableToast(responseBody, requestedDir, addToast);
      }

      if (response.ok || recoverable) {
        const [ url, params ] = buildSocketIOParams(config);
        debug('initializing socket: %s %o', url, params);
        const socket = io.connect(url, params);
        socketRef.current = socket;
        shutdownMessageShown.current = false;
        updateTerminalState(term, 'connected');

        term.onData(function (data) {
          socket.emit('data', data)
        })

        socket.on('data', function (data) {
          term.write(data)
        })

        socket.on('connect', function () {
          debug('socket connected');
        })

        // Wait until the socket and its SSH connection/shell hit known states
        // and then configure the shell geometry.
        socket.on('status', function (data) {
          debug('status %s', data);
          if (data.startsWith('SOCKET CONFIGURED')) {
            debug('emitting geometry: cols=%d rows=%d', term.cols, term.rows);
            socket.emit('geometry', term.cols, term.rows);
          }
          if (data.startsWith('SSH SHELL ESTABLISHED')) {
            resizeTerminal();
          }
        });

        socket.on('shutdownCountdownUpdate', function (secondsRemaining) {
          debug('server is shutting down in %s seconds', secondsRemaining);
          if (!shutdownMessageShown.current) {
            shutdownMessageShown.current = true;
            addToast(serverShutdownToast({ secondsRemaining }));
          }
        });

        socket.on('ssherror', function (data) {
          debug('ssherror %s', data);
          if (data.startsWith('401 UNAUTHORIZED')) {
            // The web session with the API server has not been initialized.
            // The server has disconnected the socket.

          } else if (data.startsWith('SSH EXEC ERROR')) {
            // The SSH process couldn't be started. The socket.io socket is
            // still good.
            addToast(sshErrorToast({ message: 'SSH EXEC ERROR' }));
            updateTerminalState(term, 'disconnected');

          } else if (data.startsWith('WEBSOCKET ERROR')) {
            // The SSH connection to the host wasn't successful. The socket.io
            // socket has been disconnected by the server.
            addToast(sshErrorToast({ message: 'WEBSOCKET ERROR' }));

          } else if (data.startsWith('SSH CONN ERROR')) {
            // There has been an error with the SSH connection; the socket.io
            // socket is still good.
            addToast(sshErrorToast({ message: 'SSH CONN ERROR' }));
            updateTerminalState(term, 'disconnected');

          } else if (data.startsWith('SSH CONN CLOSE')) {
            // The SSH connection has been closed.  Presumably by the user
            // themselves. The socket.io socket is still good.
            updateTerminalState(term, 'disconnected');

          } else if (data.startsWith('SSH CONN END BY HOST')) {
            // The SSH connection has been closed by the host. The socket.io
            // socket is still good.
            addToast(sshErrorToast({ message: 'SSH CONN END BY HOST' }));
            updateTerminalState(term, 'disconnected');

          } else if (data.startsWith('SSH STREAM CLOSE')) {
            // The SSH stream has been closed; the server has closed the SSH
            // connection.  The socket.io socket is still good.
            // addToast(sshErrorToast({ message: 'SSH STREAM CLOSE' }));
            updateTerminalState(term, 'disconnected');

          } else if (data.startsWith('SSH SOCKET ERROR')) {
            // A socket.io error has been reported. The server has closed the
            // SSH connection.  A socket.io error will likely be reported here
            // too.

          } else if (data.startsWith('SSH CLIENT SOCKET DISCONNECT')) {
            // The client has disconnected; the server has closed the SSH
            // connection.  This will be dealt with by the disconnect handler.
          }
          addToast(sshErrorToast({ message: data }));
        })

        socket.on('disconnect', function (err) {
          debug('socket disconnected: %s', err);
          socket.io.reconnection(false);
          updateTerminalState(term, 'disconnected');
        })

        socket.on('error', function (err) {
          // There has been an error with the socket.  This is a transport
          // error not an application error.
          debug('socket error: %s', err.toString());
          addToast(sshErrorToast(err));
          updateTerminalState(term, 'error');
        })

        term.onTitleChange((title) => {
          let terminalTitle;
          let appTitle = 'Flight Console';
          if (/^\s*$/.test(title)) {
            terminalTitle = appTitle;
            document.title = appTitle;
          } else {
            terminalTitle = title;
            document.title = `${appTitle}: ${title}`;
          }
          setTitle(terminalTitle);
        });

      } else {
        const code = utils.errorCode(responseBody);
        if ( code === 'Missing SSH Configuration' ) {
          debug('session missing SSH configuration');
          addToast(missingSSHConfigurationToast(onReconnect));
          updateTerminalState(term, 'disconnected');
        } else {
          debug('session initialization failed');
          addToast(sshErrorToast({ message: code || 'Unexpected error' }));
          updateTerminalState(term, 'disconnected');
        }
      }
    })
  }

  function onDisconnect() {
    debug('disconnecting');
    if (socketRef.current) {
      document.exitFullscreen();
      socketRef.current.disconnect();
    }
  }

  function onReconnect() {
    debug('reconnecting');
    termRef.current.reset();
    if (fitAddonRef.current != null) { fitAddonRef.current.fit(); }
    connect();
    termRef.current.focus();
  }

  function focus() {
    termRef.current.focus();
  }

  return { focus, onDisconnect, onReconnect, resizeTerminal, terminalState, title };
}

function addRecoverableToast(responseBody, requestedDir, addToast) {
  const code = utils.errorCode(responseBody);

  let body;
  if (code === 'Unexpected SFTP STDOUT' && requestedDir == null) {
    // An initial directory hasn't been requested, but it won't work if they
    // ever do.
    body = (
      <>
      <p>
        We have detected that your current shell setup does not support
        setting the initial directory.  This means that links to OpenFlight
        Console from other OpenFlight Websuite applications may not work.
      </p>
      <p>
        This is typically because a profile script (e.g.{' '}
        <code>.bashrc</code>) has printed to Standard Output within a{' '}
        <i>non-interactive login shell</i>.
      </p>
      </>
    );
  } else if (code === 'Unexpected SFTP STDOUT') {
    body = (
      <>
      <p>
        Cannot open the requested directory as your current shell setup does
        not support setting the initial directory.
      </p>
      <p>
        This is typically because a profile script (e.g.{' '}
        <code>.bashrc</code>) has printed to Standard Output within a{' '}
        <i>non-interactive login shell</i>.
      </p>
      </>
    );
  } else if (code === "Missing Directory") {
    body = (
      <p>
        Cannot open the requested directory as it does not exist!
      </p>
    )
  } else if (code === "Not A Directory") {
    body = (
      <p>
        Cannot open the requested directory as it is not a directory!
      </p>
    )
  } else if (code === "Permission Denied") {
    body = (
      <p>
        You have insufficient permissions to open the requested directory!
      </p>
    );
  } else if (code === "Invalid Characters") {
    body = (
      <p>
        Cannot open the requested directory as it contains invalid
        characters. Please contact us if your believe this to be an
        error.
      </p>
    )
  }

  if (body) {
    addToast({
      body,
      icon: 'warning',
      header: 'Initial directory switching disabled',
    });
  }
}

function sshErrorToast({ message }) {
  let body = (
    <div>
      <p>
        Unfortunately there has been a problem connecting to your terminal
        console session.  Please try again and, if problems persist, help us
        to more quickly rectify the problem by contacting us and letting us
        know.
      </p>
      <p>
        The error reported is <code>{message}</code>.
      </p>
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Connection failed',
  };
}

function serverShutdownToast({ secondsRemaining }) {
  let body = (
    <div>
      <p>
        The Flight Console API will shutdown shortly.  Please save your work
        as your terminal session will terminate when the server is shutdown.
      </p>
      <p>
        When the Flight Console API has restarted you can click the
        "Reconnect" button to start a new terminal session.
      </p>
    </div>
  );

  return {
    body,
    icon: 'danger',
    header: 'Console API shutting down',
  };
}

export default useTerminal;
