import useFetch from 'use-http';
import { useLocation } from "react-router-dom";

export function useInitializeSession() {
  var path
  const dir = new URLSearchParams(useLocation().search).get('dir')
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
