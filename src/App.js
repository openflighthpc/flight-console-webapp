import { BrowserRouter as Router } from "react-router-dom";

import {
  FetchProvider,
  BrandingProvider,
  DataProvider,
  EnvironmentProvider,
  ConfigProvider,
  CurrentUserProvider,
} from 'flight-webapp-components';

import * as Toast from './ToastContext';
import AppLayout from './AppLayout';

console.log('DataProvider:', DataProvider);  // eslint-disable-line no-console

function App() {
  return (
    <div className="App">
      <DataProvider>
        <BrandingProvider>
          <EnvironmentProvider>
            <ConfigProvider>
              <Router basename={process.env.REACT_APP_MOUNT_PATH}>
                <CurrentUserProvider>
                  <FetchProvider>
                    <Toast.Provider>
                      <Toast.Container />
                      <AppLayout />
                    </Toast.Provider>
                  </FetchProvider>
                </CurrentUserProvider>
              </Router>
            </ConfigProvider>
          </EnvironmentProvider>
        </BrandingProvider>
      </DataProvider>
    </div>
  );
}

export default App;
