import React, { useRef } from 'react';
import classNames from 'classnames';

import useTerminal from './useTerminal';
import TerminalLayout from './TerminalLayout';

function TerminalPage() {
  const terminalContainer = useRef(null);
  const { focus, onDisconnect, onReconnect, terminalState, title } =
    useTerminal(terminalContainer);

  return (
    <TerminalLayout
      onDisconnect={onDisconnect}
      onFullscreenChange={focus}
      onReconnect={onReconnect}
      terminalState={terminalState}
      title={title}
    >
      <div
        id="terminal-container"
        className={
          classNames("terminal full-height", {
            'terminal-connected': terminalState === 'connected',
            'terminal-disconnected': terminalState !== 'connected',
          })
        }
        ref={terminalContainer}
      />
    </TerminalLayout>
  );

}

export default TerminalPage;
