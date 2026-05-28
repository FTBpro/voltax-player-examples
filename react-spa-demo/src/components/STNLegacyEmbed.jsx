import { useEffect, useRef } from 'react';
import { getPlayerByExternalID, getPlayerInstanceByExternalID, getEmbedSrc } from '../utils/playerUtils';

export function STNLegacyEmbed({
  externalID,
  playerKey,
  containerId,
}) {
  const containerRef = useRef(null);
  const hasLoadedScriptRef = useRef(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return undefined;
    }

    const player = getPlayerByExternalID(externalID);
    if (player) {
      playerRef.current = player;
    }

    if (!playerRef.current && !hasLoadedScriptRef.current) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.externalID = externalID;
      script.isPlayerControlled = true;
      script.src = `${getEmbedSrc(null, null, true)}?fk=${playerKey}`;
      container.after(script);
      hasLoadedScriptRef.current = true;
    } else if (playerRef.current) {
      playerRef.current.injectPlayer(containerRef.current);
    }

    if(!playerRef.current) {
      getPlayerInstanceByExternalID(externalID, player => {
        playerRef.current = player;
      });
    }

  }, [externalID]);


  return (
    <div 
      className={`s2nPlayer k-${playerKey}`}
      id={containerId}
      ref={containerRef}
    />
  );
}


