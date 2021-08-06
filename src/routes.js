import { NotFound } from 'flight-webapp-components';

import Dashboard from './Dashboard';
import TerminalPage from './TerminalPage';
import UnconfiguredDashboard from './UnconfiguredDashboard';

const routes = [
  {
    path: '/terminal',
    name: 'Terminal',
    Component: TerminalPage,
    authenticated: true,
    sideNav: false,
  },
  {
    path: '/',
    name: 'Home',
    Component: Dashboard,
    sideNav: true,
  },
  {
    name: 'Not found',
    Component: NotFound,
    sideNav: true
  },
]

const unconfiguredRoutes = [
  {
    path: '/',
    name: 'Home',
    Component: UnconfiguredDashboard,
    sideNav: true,
  },
];

export {
  routes,
  unconfiguredRoutes,
};
