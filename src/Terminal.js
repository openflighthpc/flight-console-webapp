import 'xterm/css/xterm.css';
import * as io from 'socket.io-client'
import React, { useEffect, useRef } from 'react';
import { FitAddon } from 'xterm-addon-fit'
import { Terminal as XTerm } from 'xterm'

import './Terminal.css';
import { useInitializeSession } from './api';

function useTerminal(containerRef) {
  const { get: initializeSession, response } = useInitializeSession();

  useEffect(() => {
    if (containerRef.current == null) { return; }

    const term = new XTerm();
    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon)
    term.open(containerRef.current);
    term.focus();
    fitAddon.fit()

    initializeSession().then(() => {
      if (response.ok) {
        const socket = io.connect("http://localhost:2222", {
          path: '/ssh/socket.io',
        });

        term.onData(function (data) {
          socket.emit('data', data)
        })

        socket.on('data', function (data) {
          term.write(data)
        })

        socket.on('connect', function () {
          socket.emit('geometry', term.cols, term.rows)
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

export default Terminal;
