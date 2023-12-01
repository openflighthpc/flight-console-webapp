import React from 'react';

import Blurb from './Blurb';
import {
  Footer
} from 'flight-webapp-components';

function UnauthenticatedDashboard() {
  return (
    <>
      <div className="centernav unauthenticated">
        <div className='contents'>
          <Blurb />
          <p
            className='tagline'
          >
            Sign in above to start interacting with your console and gain access to your HPC
            environment.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UnauthenticatedDashboard;
