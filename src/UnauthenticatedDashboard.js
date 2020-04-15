import React from 'react';

import ClusterOverviewCard from './ClusterOverviewCard';
import Logo from './png_trans_logo.png';
import SignInCard from './SignInCard';

function UnauthenticatedDashboard() {
  return (
    <div>
      <img
        src={Logo}
        alt="OpenflightHPC Logo"
        className="center"
        width="100%"
      >
      </img>

      <p>
        Flight Console Service allows you to access an interactive terminal
        console session running on your cluster from the comfort of your
        browser.
      </p>

      <p>
        To start interacting with your console and gain access to your HPC
        environment sign in below.
      </p>

      <div className="card-deck">
        <ClusterOverviewCard />
        <SignInCard />
      </div>
    </div>
  );
}


export default UnauthenticatedDashboard;
