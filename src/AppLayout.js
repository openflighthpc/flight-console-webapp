import React from 'react';

import AnimatedRouter from './AnimatedRouter';
import BrandBar from './BrandBar';
import Footer from './Footer';

function AppLayout() {
  return (
    <>
    <BrandBar />
    <div
      className="container-fluid"
      id="main"
    >
      <div id="toast-portal"></div>
      <div className="content">
        <AnimatedRouter sideNav={SideNav} />
      </div>
    </div>
    <Footer />
    </>
  );
}

function SideNav() {
  return (
    <div className="col-sm-2 sidenav"></div>
  );
}

export default AppLayout;
