import { Button, ButtonToolbar } from 'reactstrap';

import { useInstallSshKey } from './api';
import { useToast } from './ToastContext';

export function InstallSshConfiguration({ reconnect, toggle }) {
  const { addToast } = useToast();
  const { loading, put, response } = useInstallSshKey();

  const installSshKey = () => {
    put().then((responseBody) => {
      if (response.ok) {
        reconnect();
      } else {
        addToast(installationError());
      }
      toggle();
    });
  }

  return (
    <div>
      <p>
        An SSH key needs to be installed for Flight Console to function
        correctly.
      </p>
      <p>
        Installing the SSH key allows Flight Console to provide you with
        secure access to your terminal.  If you do not install the key Flight
        Console will not function.
      </p>
      <ButtonToolbar className="justify-content-end">
        <Button
          color="secondary"
          size="sm"
          onClick={toggle}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="ml-2"
          color="primary"
          size="sm"
          onClick={installSshKey}
          disabled={loading}
        >
          {
            loading ? 'Installing...' : 'Install SSH key'
          }
        </Button>
      </ButtonToolbar>
    </div>
  );
}

export function missingSSHConfigurationToast(reconnect) {
  console.log('reconnect:', reconnect);  // eslint-disable-line no-console
  return {
    body: <InstallSshConfiguration reconnect={reconnect} />,
    icon: 'info',
    header: 'SSH configuration required',
  };
}

function installationError() {
  const body = (
    <p>
      Unfortunately there has been a problem handling your request. Please
      try again and, if problems persist, help us to more quickly rectify
      the problem by contacting us and letting us know what you were trying
      to do when the error occurred.
    </p>
  );

  return {
    body,
    icon: 'danger',
    header: 'SSH configuration failed',
  }
}
