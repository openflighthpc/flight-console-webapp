import React from 'react';

import { DashboardLogo } from 'flight-webapp-components';

import ClusterOverview from './ClusterOverview';

function UnauthenticatedDashboard() {
  return (
    <div>
      <DashboardLogo />
      <ClusterOverview className="mt-2 mb-2" />
      <p>
        Flight Console Service allows you to access an interactive terminal
        console session running on your cluster from the comfort of your
        browser.
      </p>

      <p>
        To start interacting with your console and gain access to your HPC
        environment sign in above.
      </p>
    </div>
  );
}


export default UnauthenticatedDashboard;
