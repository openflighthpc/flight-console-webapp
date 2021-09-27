import { useRef } from 'react';
import { useHistory } from "react-router-dom"

function useRequestedDirectory() {
  const history = useHistory();
  const dirRef = useRef(new URLSearchParams(history.location.search).get('dir'));

  return {
    requestedDir: dirRef.current,
    clearSearchParams: () => {
      if (dirRef.current != null) {
        // Deliberately use `window.history` and `window.location` instead of
        // `history` and location provided by react-router in order to avoid a
        // re-rendering.
        //
        // Due to (possible) idiosyncrasies in
        // react-router/react-transition-group, using `history` would result
        // in a new page being animated in with the now incorrect search
        // params, which would result in the wrong directory being displayed.
        //
        // There may be a better way of avoiding this.
        const url = new URL(window.location);
        url.searchParams.delete('dir');
        window.history.pushState({}, '', url);
      }
    },
  };
}

export default useRequestedDirectory;
