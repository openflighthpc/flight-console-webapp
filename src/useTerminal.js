import 'xterm/css/xterm.css';
import * as io from 'socket.io-client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import mkDebug from 'debug';
import { FitAddon } from 'xterm-addon-fit'
import { Terminal as XTerm } from 'xterm'

import { ConfigContext, useEventListener } from 'flight-webapp-components';

import './Terminal.css';
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
  const { get: initializeSession, response } = useInitializeSession();
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
      socket.emit('resize', { cols: term.cols, rows: term.rows })
    }
  }

  useEventListener(window, 'resize', resizeTerminal);

  useEffect(() => {
    if (containerRef.current == null) { return; }

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

    return function disponse() {
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
    initializeSession().then(() => {
      if (response.ok) {
        const [ url, params ] = buildSocketIOParams(config);
        debug('initializing socket: %s %o', url, params);
        const socket = io.connect(url, params);
        socketRef.current = socket;
        updateTerminalState(term, 'connected');

        term.onData(function (data) {
          socket.emit('data', data)
        })

        socket.on('data', function (data) {
          term.write(data)
        })

        socket.on('connect', function () {
          socket.emit('geometry', term.cols, term.rows)
        })

        socket.on('shutdownCountdownUpdate', function (secondsRemaining) {
          // XXX Do something here.
          console.log('secondsRemaining:', secondsRemaining);  // eslint-disable-line no-console
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
          // if (!errorExists) {
          //   status.style.backgroundColor = 'red'
          //   status.innerHTML =
          //     'WEBSOCKET SERVER DISCONNECTED: ' + err
          // }
          debug('socket disconnected: %s', err);
          socket.io.reconnection(false);
          updateTerminalState(term, 'disconnected');
        })

        socket.on('error', function (err) {
          // There has been an error with the socket.  This is a transport
          // error not an application error.
          debug('socket error: %s', err);
          addToast(sshErrorToast({ message: err }));
          updateTerminalState(term, 'error');
        })

        term.onTitleChange((title) => {
          let fullTitle;
          if (/^\s*$/.test(title)) {
            fullTitle = 'Flight Console';
          } else {
            fullTitle = `Flight Console: ${title}`;
          }
          document.title = fullTitle;
          setTitle(fullTitle);
        });

      } else {
        debug('session initialization failed');
        addToast(sshErrorToast({ message: 'Internal server error' }));
        updateTerminalState(term, 'disconnected');
      }
    })
  }

  function onDisconnect() {
    debug('disconnecting');
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }

  function onReconnect() {
    debug('reconnecting');
    termRef.current.reset();
    connect();
    termRef.current.focus();
  }

  function focus() {
    termRef.current.focus();
  }

  return { focus, onDisconnect, onReconnect, resizeTerminal, terminalState, title };
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

export default useTerminal;
