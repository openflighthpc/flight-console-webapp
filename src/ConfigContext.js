import React from 'react';
import useFetch from 'use-http';

import Spinner from './Spinner';
import { DefaultErrorMessage } from './ErrorBoundary';

const initialState = null;
const Context = React.createContext(initialState);

function Provider({ children }) {
  const { error, loading, data, } = useFetch(
    process.env.REACT_APP_CONFIG_FILE,
    []
  );

  if (loading) {
    return <Spinner text="Loading..." />;
  } else if (error) {
    return <DefaultErrorMessage />;
  } else {
    return (
      <Context.Provider value={data}>
        {children}
      </Context.Provider>
    );
  }
}

export {
  Context,
  Provider,
}
