// import * as io from 'socket.io-client'
import React, { useEffect, useRef } from 'react';
import { FitAddon } from 'xterm-addon-fit'
import { Terminal as XTerm } from 'xterm'

import 'xterm/css/xterm.css';
import './Terminal.css';

function Terminal() {
  const terminalContainer = useRef(null);

  useEffect(() => {
    const term = new XTerm();
    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon)
    term.open(terminalContainer.current);
    term.focus();
    fitAddon.fit()

    term.prompt = () => {
      term.write('\r\n$ ');
    };

    term.writeln('Welcome to xterm.js');
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    term.writeln('Type some keys and commands to play around.');
    term.writeln('');
    term.prompt();

    term.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === 13) {
        term.prompt();
      } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        if (term._core.buffer.x > 2) {
          term.write('\b \b');
        }
      } else if (printable) {
        term.write(e.key);
      }
    });


  }, [ ]);

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
