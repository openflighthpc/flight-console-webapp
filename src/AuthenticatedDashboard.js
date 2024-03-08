import classNames from "classnames";
import {useRef} from "react";

import useTerminal from "./useTerminal";
import TerminalLayout from "./TerminalLayout";

function AuthenticatedDashboard() {
  const terminalContainer = useRef(null);
  const { focus, onRefresh, onReconnect, resizeTerminal, terminalState, title } =
    useTerminal(terminalContainer);

  return (
    <>
      <div
        className="centernav col-12 fullscreen"
      >
        <TerminalLayout
          onRefresh={onRefresh}
          onFullscreenChange={focus}
          onReconnect={onReconnect}
          onZenChange={resizeTerminal}
          terminalState={terminalState}
          title={title}
        >
          <div
            id="terminal-container"
            className={
              classNames("terminal fullscreen-content bg-black", {
                'terminal-connected': terminalState === 'connected',
                'terminal-disconnected': terminalState !== 'connected',
              })
            }
            ref={terminalContainer}
          />
        </TerminalLayout>
      </div>
    </>
  );
}

export default AuthenticatedDashboard;
