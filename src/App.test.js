import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from './App';

async function renderApp() {
  const utils = render(<App />);
  expect(utils.getByText('Loading...')).toBeInTheDocument();
  await waitFor(
    () => expect(utils.queryByText('Loading...')).toBeNull()
  );
  return utils;
}

test('renders without crashing', async () => {
  const { queryByText } = await renderApp();
  expect(queryByText('An error has occurred')).toBeNull();
});
