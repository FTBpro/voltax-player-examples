import { useEffect, useMemo, useState } from 'react';
import { PLAYLIST_IDS } from '../constants/contentIDs';
import { replacePlayerContentByExternalID } from '../utils/playerUtils';
import { STNEmbed } from './STNEmbed';
import { STNLegacyEmbed } from './STNLegacyEmbed';
import { VoltaxPlayerLifecycle } from './VoltaxPlayerLifecycle';

export function PlayerCard({
  isLegacy = false,
  title,
  description,
  externalID,
  defaultContentID,
  onDestroy,
  containerId,
  playlistIDs = PLAYLIST_IDS,
  orgID,
  propertyID,
}) {
  const destroyOnUnmount = !!onDestroy;
  const fallbackContentId = useMemo(
    () => defaultContentID || playlistIDs?.[0]?.id || '',
    [defaultContentID, playlistIDs],
  );
  const [selectedContentId, setSelectedContentId] = useState(fallbackContentId);

  useEffect(() => {
    setSelectedContentId(fallbackContentId);
  }, [fallbackContentId]);

  const handlePlaylistChange = event => {
    const nextContentId = event.target.value;
    setSelectedContentId(nextContentId);
    replacePlayerContentByExternalID(externalID, nextContentId);
  };

  return (
    <section className="player-card" id={containerId}>
      <header>
        <h3>{title}</h3>
        <p>{description}</p>
      </header>
      {isLegacy ? (
        <STNLegacyEmbed
          externalID={externalID}
          containerId={containerId}
          playerKey={defaultContentID}
          destroyOnUnmount={destroyOnUnmount}
        />
      ) : (
        <STNEmbed
          externalID={externalID}
          containerId={containerId}
          contentID={defaultContentID}
          orgID={orgID}
          propertyID={propertyID}
          destroyOnUnmount={destroyOnUnmount}
        />
      )}
      <VoltaxPlayerLifecycle externalID={externalID} containerId={containerId} destroyOnUnmount={destroyOnUnmount} />
      {(playlistIDs?.length || onDestroy) && (
        <div className="controls">
          {playlistIDs?.length ? (
            <label>
              Playlist ID
              <div className="description">switch between different playlists</div>
              <select value={selectedContentId} onChange={handlePlaylistChange}>
                {playlistIDs.map(({ id, label }) => (
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
