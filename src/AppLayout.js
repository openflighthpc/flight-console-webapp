import { useContext } from 'react';
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import {
  AnimatedRouter,
  AuthenticatedRoute,
  BrandBar,
  ConfigContext,
  Footer,
} from 'flight-webapp-components';

import NavItems from './NavItems';
import styles from './AppLayout.module.css';
import { routes, unconfiguredRoutes } from './routes';

function AppLayout() {
  const { unconfigured } = useContext(ConfigContext);

  return (
    <>
    <BrandBar
      className="brandbar"
      navItems={<NavItems includeHome={false} />}
    />
    <div
      id="main"
    >
      <div id="toast-portal" className={styles.ToastPortal}></div>
      <div className="content">
        <AnimatedRouter
          AuthenticatedRoute={AuthenticatedRoute}
          Redirect={Redirect}
          Route={Route}
          Switch={Switch}
          exact={!unconfigured}
          routes={unconfigured ? unconfiguredRoutes : routes}
          useLocation={useLocation}
          fullscreen={true}
        />
      </div>
    </div>
    <Footer />
    </>
  );
}

export default AppLayout;
