import useFetch from 'use-http';

export function useInitializeSession() {
  return useFetch("/ssh/host/127.0.0.1");
}
