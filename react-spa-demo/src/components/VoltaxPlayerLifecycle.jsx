import { useEffect, useRef } from 'react';
import { getPlayerByExternalID } from '../utils/playerUtils';

const POLL_INTERVAL = 300;

export function VoltaxPlayerLifecycle({ externalID, containerId, destroyOnUnmount = false }) {
  const playerRef = useRef(null);

  useEffect(() => {  
    let pollId;
    let isCancelled = false;

    const resolvePlayer = () => {
      const player = getPlayerByExternalID(externalID);

      if (player) {
        playerRef.current = player;
        player?.injectPlayer(document.querySelector(`#${containerId}`));
        return true;
      }

      return false;
    };

    if (!resolvePlayer()) {
      pollId = window.setInterval(() => {
        if (!isCancelled && resolvePlayer()) {
          window.clearInterval(pollId);
        }
      }, POLL_INTERVAL);
    }

    return () => {
      isCancelled = true;

      if (pollId) {
        window.clearInterval(pollId);
      }

      if (destroyOnUnmount) {
        (playerRef.current || getPlayerByExternalID(externalID))?.destroyPlayer?.();
      }
      playerRef.current = null;

    };
  }, [destroyOnUnmount, externalID]);

  return null;
}
