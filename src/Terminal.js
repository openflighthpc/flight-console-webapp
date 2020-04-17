import 'xterm/css/xterm.css';
import * as io from 'socket.io-client'
import React, { useEffect, useRef } from 'react';
import { FitAddon } from 'xterm-addon-fit'
import { Terminal as XTerm } from 'xterm'

import './Terminal.css';
import useEventListener from './useEventListener';
import { useInitializeSession } from './api';
import { useToast } from './ToastContext';

const terminalOptions = {
  cursorBlink: true,
  scrollback: 10000,
  tabStopWidth: 8,
  bellStyle: "sound",
};

function useTerminal(containerRef) {
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
  const { get: initializeSession, response } = useInitializeSession();
  const { addToast } = useToast();

  useEventListener(window, 'resize', () => {
    const term = termRef.current;
    const socket = socketRef.current;
    const fitAddon = fitAddonRef.current;
    if (term != null && socket != null && fitAddon != null) {
      fitAddon.fit();
      socket.emit('resize', { cols: term.cols, rows: term.rows })
    }
  });

  useEffect(() => {
    if (containerRef.current == null) { return; }

    const term = new XTerm();
    const fitAddon = new FitAddon();
    termRef.current = term;
    fitAddonRef.current = fitAddon;

    term.setOption('cursorBlink', terminalOptions.cursorBlink)
    term.setOption('scrollback', terminalOptions.scrollback)
    term.setOption('tabStopWidth', terminalOptions.tabStopWidth)
    term.setOption('bellStyle', terminalOptions.bellStyle)
    term.loadAddon(fitAddon)
    term.open(containerRef.current);
    term.focus();
    fitAddon.fit()

    initializeSession().then(() => {
      if (response.ok) {
        const socket = io.connect("http://localhost:2222", {
          path: '/ssh/socket.io',
        });
        socketRef.current = socket;

        term.onData(function (data) {
          socket.emit('data', data)
        })

        socket.on('data', function (data) {
          term.write(data)
        })

        socket.on('connect', function () {
          socket.emit('geometry', term.cols, term.rows)
        })

        socket.on('ssherror', function (data) {
          addToast(sshErrorToast({
            message: data,
          }));
        })

        term.onTitleChange(function (title) {
          document.title = `Flight Console: ${title}`;
        })
      }
    })

    // XXX dispose function.

    // We're expecting `response` to change and don't want to re-run the hook
    // when it does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ containerRef, initializeSession ]);
}

function Terminal() {
  const terminalContainer = useRef(null);
  useTerminal(terminalContainer);

  return (
    <div
      id="terminal-container"
      className="terminal full-height"
      ref={terminalContainer}
    >
    </div>
  );
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

export default Terminal;
