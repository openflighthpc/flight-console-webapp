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
  let fileManagerLocation = '../files';
  if (title.includes(':~/')) {
    fileManagerLocation += '?dir=' + title.split(':~/', 2)[1];
  } else if (title.includes(':/')) {
    fileManagerLocation += '?dir=' + title.split(':', 2)[1];
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
                    {title}
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
  
  const ToFilesBtn = terminalState === 'connected' ? (
    <i
      title="files" className='mr-2'
    >
      <a
        className="fa-regular fa-file-lines ml-2 link white-text"
        href={fileManagerLocation}
      >
      </a>
    </i>
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
    </div>
  );
}

export default TerminalLayout;
