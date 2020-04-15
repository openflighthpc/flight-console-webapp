import Dashboard from './Dashboard';
import TerminalPage from './TerminalPage';

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
]

export default routes;
