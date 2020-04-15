import React, { useContext } from 'react';
import styled from 'styled-components'
import { Link } from "react-router-dom";

import Logo from './png_trans_logo-navbar.png';
import { Context as CurrentUserContext } from './CurrentUserContext';
import { Context as ConfigContext } from './ConfigContext';

function BrandBar({ className }) {
  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white border-bottom ${className}`}>
      <Link
        className="navbar-brand"
        to="/"
      >
        <img
          src={Logo}
          alt="openflightHPC Logo"
          height="75">
        </img>
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <NavItems />
        </ul>
        <ul className="navbar-nav">
          <UserNavItems />
        </ul>
        <div className="my-2 my-lg-0">
          <a href="https://github.com/openflighthpc">
            <span className="fa fa-3x fa-github"></span>
          </a>
        </div>
      </div>

    </nav>
  );
}

function NavItems() {
  const { currentUser } = useContext(CurrentUserContext);
  if (currentUser == null) { return null; }

  return (
    <>
    <li className="nav-item">
      <Link
        className="nav-link nav-menu-button"
        to="/sessions"
      >
        My sessions
      </Link>
    </li>
    <li className="nav-item">
      <Link
        className="nav-link nav-menu-button"
        to="/sessions/new"
      >
        Launch new session
      </Link>
    </li>
    </>
  );
}

function UserNavItems() {
  const { currentUser, actions } = useContext(CurrentUserContext);
  const { clusterName } = useContext(ConfigContext);
  if (currentUser == null) { return null; }

  return (
    <>
    <li className="nav-item">
      <span className="nav-link nav-menu-text">
        {currentUser.username} ({clusterName})
      </span>
    </li>
    <li className="nav-item">
      <button
        className="btn btn-link nav-link nav-menu-button"
        onClick={actions.signOut}
      >
        Sign out
      </button>
    </li>
    </>
  );
}

export default styled(BrandBar)`
  a:first-child {
    padding-left: 4rem;
  }
  a:last-child {
    padding-right: 4rem;
  }

  li {
    padding-top: 1rem;
  }

`;
