import { Link } from 'react-router-dom';
import { NotFound } from 'flight-webapp-components';

import Dashboard from './Dashboard';
import UnconfiguredDashboard from './UnconfiguredDashboard';

const notFoundRoute = {
  name: 'Not found',
  Component: () => (
    <NotFound
      homeLink={
        <Link
          className="btn btn-link"
          to="/"
        >
          <span>Move Along...</span>
        </Link>
      }
    />
  ),
  key: 'notfound',
};
const routes = [
  {
    path: '/',
    name: 'Console',
    Component: Dashboard,
    authenticated: true,
  },
  notFoundRoute,
]

const unconfiguredRoutes = [
  {
    path: '/',
    name: 'Home',
    Component: UnconfiguredDashboard,
  },
  notFoundRoute,
];

export {
  routes,
  unconfiguredRoutes,
};
