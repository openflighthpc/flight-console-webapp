import React from 'react';
import ReactDOM from 'react-dom';
import 'flight-webapp-components/dist/styles/page-transitions.css'
import 'flight-webapp-components/dist/styles/flight-webapp-components.css'
import 'flight-webapp-components/dist/styles/fullscreen.css'
import 'flight-webapp-components/dist/styles/fa-background.css'

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
