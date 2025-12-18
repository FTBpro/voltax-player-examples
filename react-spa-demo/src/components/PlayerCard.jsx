import { useEffect, useMemo, useState } from 'react';
import { PLAYER_KEYS } from '../constants/playerKeys';
import { replacePlayerContentByExternalID } from '../utils/playerUtils';
import { STNEmbed } from './STNEmbed';
import { VoltaxPlayerLifecycle } from './VoltaxPlayerLifecycle';

export function PlayerCard({
  title,
  description,
  externalID,
  defaultPlayerKey,
  onDestroy,
  containerId,
  playerKeys = PLAYER_KEYS,
}) {



  const destroyOnUnmount = !!onDestroy;
  const fallbackContentId = useMemo(
    () => defaultPlayerKey || playerKeys?.[0]?.id || '',
    [defaultPlayerKey, playerKeys],
  );
  const [selectedContentId, setSelectedContentId] = useState(fallbackContentId);

  useEffect(() => {
    setSelectedContentId(fallbackContentId);
  }, [fallbackContentId]);

  const handlePlaylistChange = event => {
    const nextContentId = event.target.value;
    setSelectedContentId(nextContentId);
    replacePlayerContentByExternalID(externalID, { playerKey: nextContentId });
  };

  return (
    <section className="player-card" id={containerId}>
      <header>
        <h3>{title}</h3>
        <p>{description}</p>
      </header>
      <STNEmbed
        externalID={externalID}
        containerId={containerId}
        playerKey={defaultPlayerKey}
        destroyOnUnmount={destroyOnUnmount}
      />
      <VoltaxPlayerLifecycle externalID={externalID} containerId={containerId} destroyOnUnmount={destroyOnUnmount} />
      {(playerKeys?.length || onDestroy) && (
        <div className="controls">
          {playerKeys?.length ? (
            <label>
              Player Key
              <div className="description">switch between different playlists</div>
              <select value={selectedContentId} onChange={handlePlaylistChange}>
                {playerKeys.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label} ({id})
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {onDestroy && (
            <button type="button" onClick={onDestroy}>
              Destroy player
            </button>
          )}
        </div>
      )}
    </section>
  );
}
