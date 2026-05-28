import { PLAYLIST_IDS } from '../constants/contentIDs';
import { PlayerCard } from '../components/PlayerCard';
import { destroyPlayerByExternalID } from '../utils/playerUtils';
import { SHARED_PLAYER } from '../constants/sharedPlayer';

export function MultiPlayerPage() {
  return (
    <div>
      <h2>Multiple Players Page</h2>
      <p>
        This route renders two independent embeds (hero + sidebar). Each one has its own player
        name so we can control them individually through the API.
      </p>
      <div className="player-grid">
        <PlayerCard
          title="Hero Player"
          description="Primary placement"
          externalID="demo-main-hero-player"
          defaultContentID={PLAYLIST_IDS[0].id}
          onDestroy={() => destroyPlayerByExternalID('demo-main-hero-player')}
          orgID={SHARED_PLAYER.orgID}
          propertyID={SHARED_PLAYER.propertyID}
        />
        <PlayerCard
          title="Sidebar Player"
          description="Secondary placement"
          externalID="demo-sidebar-player"
          defaultContentID={PLAYLIST_IDS[1].id}
          onDestroy={() => destroyPlayerByExternalID('demo-sidebar-player')}
          orgID={SHARED_PLAYER.orgID}
          propertyID={SHARED_PLAYER.propertyID}
        />
      </div>
      <div className="note">
        Both players have their own container and the script. When you leave
        this route the lifecycle helpers tear down each instance via `destroyPlayer()`.
      </div>
    </div>
  );
}
