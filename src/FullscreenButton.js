import React, { useEffect, useRef, useState } from 'react';

import useEventListener from './useEventListener';

function FullscreenButton({ callback }) {
  const [isFullscreen, setFullscreen] = useState(false);
  const callbackRef = useRef(callback);

  useEventListener(window, 'keydown', function handleKeypress(e) {
    if (!(e.ctrlKey || e.shiftKey || e.altKey) && e.code === "F11") {
      document.documentElement.requestFullscreen();
      e.preventDefault();
    }
  });

  useEffect(() => {
    document.onfullscreenchange = function ( event ) { 
      if (document.fullscreenElement == null) {
        setFullscreen(false);
        if (typeof callbackRef.current === 'function') {
          callbackRef.current(false);
        }
      } else {
        setFullscreen(true);
        if (typeof callbackRef.current === 'function') {
          callbackRef.current(true);
        }
      }
    }; 
    document.onfullscreenchange();

    return () => { document.onfullscreenchange = null; };
  }, [setFullscreen]);

  return (
    <button
      className="btn btn-light btn-sm mr-1"
      onClick={() => {
        isFullscreen ?
          document.exitFullscreen() :
          document.documentElement.requestFullscreen() ;
      }}
    >
      <i className={`fa ${isFullscreen ? 'fa-compress' : 'fa-expand'} mr-1`}></i>
      <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
    </button>
  );
}

export default FullscreenButton;
