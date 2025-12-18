import { PLAYER_KEYS } from '../constants/playerKeys';
import { PlayerCard } from '../components/PlayerCard';
import { destroyPlayerByExternalID } from '../utils/playerUtils';

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
          defaultPlayerKey={PLAYER_KEYS[0].id}
          onDestroy={() => destroyPlayerByExternalID('demo-main-hero-player')}
        />
        <PlayerCard
          title="Sidebar Player"
          description="Secondary placement"
          externalID="demo-sidebar-player"
          defaultPlayerKey={PLAYER_KEYS[1].id}
          onDestroy={() => destroyPlayerByExternalID('demo-sidebar-player')}
        />
      </div>
      <div className="note">
        Both players have their own container and the script. When you leave
        this route the lifecycle helpers tear down each instance via `destroyPlayer()`.
      </div>
    </div>
  );
}
