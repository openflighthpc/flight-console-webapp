import { Link } from "react-router-dom";

import { DashboardLogo } from 'flight-webapp-components';

import { CardFooter } from './CardParts';

function AuthenticatedDashboard() {
  return (
    <div>
      <DashboardLogo />
      <div className="card-deck">
        <div className="card">
          <div className="card-body fa-background fa-background-terminal">
            <h5 className="card-title text-center">
              Connect to your terminal console
            </h5>
            <p className="card-text">
              You can connect to your terminal console by clicking on the
              button below.
            </p>
          </div>
          <CardFooter>
            <Link
              className="btn btn-success btn-block"
              to="/terminal"
            >
              <i className="fa fa-desktop mr-1"></i>
              <span>Connect to terminal</span>
            </Link>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedDashboard;
