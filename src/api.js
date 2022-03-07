import useFetch from 'use-http';

export function useInitializeSession(dir) {
  let path
  if (dir) {
    path = `/ssh/host?dir=${dir}`;
  } else {
    path = "/ssh/host";
  }

  return useFetch(path);
}

export function useInstallSshKey() {
  return useFetch("/ssh/authorized_key", { method: 'put' });
}
