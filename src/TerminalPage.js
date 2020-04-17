import React, { useRef } from 'react';

import Terminal, { useTerminal } from './Terminal';
import TerminalLayout from './TerminalLayout';

function TerminalPage() {
  const terminalContainer = useRef(null);
  const { onDisconnect, onReconnect, terminalState, title } =
    useTerminal(terminalContainer);

  return (
    <TerminalLayout
      onDisconnect={onDisconnect}
      onReconnect={onReconnect}
      terminalState={terminalState}
      title={title}
    >
      <Terminal ref={terminalContainer} />
    </TerminalLayout>
  );

}

export default TerminalPage;
