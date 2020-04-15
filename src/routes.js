import Dashboard from './Dashboard';

// We need this to prevent the route for `/sessions/:id` from matching the
// string `/sessions/new`.
// const uuidRegExp = '\\b[0-9a-f]{8}\\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\\b[0-9a-f]{12}\\b'

const routes = [
  // {
  //   path: '/sessions/new',
  //   name: 'Launch new session',
  //   Component: DesktopsPage,
  //   authenticated: true,
  //   sideNav: true,
  // },
  // {
  //   path: `/sessions/:id(${uuidRegExp})`,
  //   name: 'Session',
  //   Component: SessionPage,
  //   authenticated: true,
  //   sideNav: false,
  // },
  // {
  //   path: '/sessions',
  //   name: 'Sessions',
  //   Component: SessionsPage,
  //   authenticated: true,
  //   sideNav: true,
  // },
  {
    path: '/',
    name: 'Home',
    Component: Dashboard,
    sideNav: true,
  },
]

export default routes;
