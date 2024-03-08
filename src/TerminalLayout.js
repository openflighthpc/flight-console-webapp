import { FullscreenButton } from 'flight-webapp-components';

function TerminalLayout({
  children,
  onRefresh,
  onFullscreenChange,
  onReconnect,
  onZenChange,
  terminalState,
  title,
}) {
  return (
    <div className="overflow-auto">
      <div className="row no-gutters">
        <div className="col">
          <div className="card-header toolbar text-light">
            <div className="row no-gutters">
              <div className="col">
                <div className="d-flex align-items-center">
                  <h5 className="flex-grow-1 mb-0">
                    {title}
                  </h5>
                  <Toolbar
                    terminalState={terminalState}
                    onRefresh={onRefresh}
                    onFullscreenChange={onFullscreenChange}
                    onReconnect={onReconnect}
                    onZenChange={onZenChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


function Toolbar({
  onRefresh,
  onFullscreenChange,
  onReconnect,
  onZenChange,
  terminalState,
}) {
  const refreshBtn = terminalState === 'connected' ? (
    <i
      className="fa fa-arrows-rotate ml-2 link white-text"
      title="Refresh"
      onClick={onRefresh}
    ></i>
  ) : null;

  const reconnectBtn = terminalState === 'disconnected' ? (
    <i
      className="fa fa-bolt ml-2 link white-text"
      title="Reconnect"
      onClick={onReconnect}
    ></i>
  ) : null;

  const fullscreenBtn = terminalState === 'connected' ?
    <FullscreenButton
      onFullscreenChange={onFullscreenChange}
      onZenChange={onZenChange}
    /> :
    null;

  return (
    <div className="btn-toolbar">
      {fullscreenBtn}
      {refreshBtn}
      {reconnectBtn}
    </div>
  );
}

export default TerminalLayout;
