import useFetch from 'use-http';

export function useInitializeSession(dir) {
  let path
  if (dir) {
    path = `/ssh/host/127.0.0.1?dir=${dir}`;
  } else {
    path = "/ssh/host/127.0.0.1";
  }

  return useFetch(path);
}

export function useInstallSshKey() {
  return useFetch("/ssh/authorized_key", { method: 'put' });
}
