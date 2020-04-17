import React, { useContext } from 'react';

import UnauthenticatedDashboard from './UnauthenticatedDashboard';
import AuthenticatedDashboard from './AuthenticatedDashboard';
import { Context as CurrentUserContext } from './CurrentUserContext';
import useDocumentTitle from './useDocumentTitle';

function Dashboard() {
  const { currentUser } = useContext(CurrentUserContext);
  useDocumentTitle('Flight Console');

  if (currentUser == null) { 
    return (
      <UnauthenticatedDashboard />
    );
  } else {
    return (
      <AuthenticatedDashboard />
    );
  }
}


export default Dashboard;
