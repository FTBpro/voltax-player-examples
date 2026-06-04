import { PLAYER_KEYS } from '../constants/contentIDs';
import { PlayerCard } from '../components/PlayerCard';
import { destroyPlayerByExternalID } from '../utils/playerUtils';

export function LegacyEmbedPage() {
  return (
    <div>
      <h2>Legacy Embed Page</h2>
      <div className="player-grid">
        <PlayerCard
            title="LegacyHero Player"
            description="Legacy Embed Player"
            externalID="demo-legacy-hero-player"
            defaultContentID={PLAYER_KEYS[0].id}
            onDestroy={() => destroyPlayerByExternalID('demo-main-hero-player')}
            // orgID={SHARED_PLAYER.orgID}
            // propertyID={SHARED_PLAYER.propertyID}
            playlistIDs={PLAYER_KEYS}
            isLegacy={true}
          />
        </div>
      </div>
  );
}
