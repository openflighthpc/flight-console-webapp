import React from 'react';

import Terminal from './Terminal';

function TerminalPage() {
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
                      XXX Add title; add toolbar buttons.
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0" style={{ backgroundColor: "#000" }}>
              <Terminal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default TerminalPage;
