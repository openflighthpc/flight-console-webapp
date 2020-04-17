import React from 'react';

import FullscreenButton from './FullscreenButton';

function TerminalLayout({
  children,
  onFullscreenChange,
  onDisconnect,
  onReconnect,
  terminalState,
  title,
}) {
  return (
    <div className="overflow-auto">
      <div className="row no-gutters">
        <div className="col">
          <div className="card border-primary">
            <div className="card-header bg-primary text-light">
              <div className="row no-gutters">
                <div className="col">
                  <div className="d-flex align-items-center">
                    <h5 className="flex-grow-1 mb-0">
                      {title}
                    </h5>
                    <Toolbar
                      terminalState={terminalState}
                      onDisconnect={onDisconnect}
                      onFullscreenChange={onFullscreenChange}
                      onReconnect={onReconnect}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0" style={{ backgroundColor: "#000" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function Toolbar({
  onDisconnect,
  onFullscreenChange,
  onReconnect,
  terminalState,
}) {
  const disconnectBtn = terminalState === 'connected' ? (
    <button
      className="btn btn-secondary btn-sm mr-1"
      onClick={onDisconnect}
    >
      <i className="fa fa-times mr-1"></i>
      <span>Disconnect</span>
    </button>
  ) : null;

  const reconnectBtn = terminalState === 'disconnected' ? (
    <button
      className="btn btn-secondary btn-sm mr-1"
      onClick={onReconnect}
    >
      <i className="fa fa-bolt mr-1"></i>
      <span>Reconnect</span>
    </button>
  ) : null;

  const fullscreenBtn = terminalState === 'connected' ?
    <FullscreenButton callback={onFullscreenChange} /> :
    null;

  return (
    <div className="btn-toolbar" style={{ minHeight: '31px' }}>
      {fullscreenBtn}
      {disconnectBtn}
      {reconnectBtn}
    </div>
  );
}

export default TerminalLayout;
