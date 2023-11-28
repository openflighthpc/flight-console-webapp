import React from 'react';

import Blurb from './Blurb';
import ClusterOverview from './ClusterOverview';

function UnauthenticatedDashboard() {
  return (
    <div>
      <ClusterOverview className="mt-2 mb-2" />
      <Blurb />
      <p>
        To start interacting with your console and gain access to your HPC
        environment sign in above.
      </p>
    </div>
  );
}

export default UnauthenticatedDashboard;
