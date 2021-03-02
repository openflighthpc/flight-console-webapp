import React from 'react';

import { DashboardLogo } from 'flight-webapp-components';

import ClusterOverview from './ClusterOverview';

function UnauthenticatedDashboard() {
  return (
    <div>
      <DashboardLogo />
      <p>
        Flight Console Service allows you to access an interactive terminal
        console session running on your cluster from the comfort of your
        browser.
      </p>

      <p>
        To start interacting with your console and gain access to your HPC
        environment sign in above.
      </p>

      <div className="card-deck">
        <ClusterOverview />
      </div>
    </div>
  );
}


export default UnauthenticatedDashboard;
