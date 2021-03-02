import useFetch from 'use-http';

export function useInitializeSession() {
  return useFetch("/ssh/host/127.0.0.1");
}

export function useInstallSshKey() {
  return useFetch("/ssh/authorized_key", { method: 'put' });
}
