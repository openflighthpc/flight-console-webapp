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
  let host = '';
  let currentDir = '';
  let fileManagerLocation = '../files';
  if (title.includes(':')) {
    [ host, currentDir ] = title.split(':', 2);
    if ( currentDir.startsWith('~/') ) {
      fileManagerLocation += '?dir=' + currentDir.split('~/', 2)[1];
    } else if ( currentDir.startsWith('/') ) {
      fileManagerLocation += '?dir=' + currentDir;
    }
  }
  
  return (
    <div className="overflow-auto">
      <div className="row no-gutters">
        <div className="col">
          <div className="card-header toolbar text-light">
            <div className="row no-gutters">
              <div className="col">
                <div className="d-flex align-items-center">
                  <h5 className="flex-grow-1 mb-0">
                    <span className="font-weight-bolder">{host} - </span>
                    {currentDir}
                  </h5>
                  <Toolbar
                    terminalState={terminalState}
                    onRefresh={onRefresh}
                    onFullscreenChange={onFullscreenChange}
                    onReconnect={onReconnect}
                    onZenChange={onZenChange}
                    fileManagerLocation={fileManagerLocation}
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
  fileManagerLocation
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
  
  const ToFilesBtn = terminalState === 'connected' ? (
    <a
      className="link white-text ml-2 mr-3"
      href={fileManagerLocation}
    >
      <i
        className="fa-regular fa-file-lines"
        title="Manage files"
      ></i>
    </a>
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
      {ToFilesBtn}
      {refreshBtn}
      {reconnectBtn}
    </div>
  );
}

export default TerminalLayout;
