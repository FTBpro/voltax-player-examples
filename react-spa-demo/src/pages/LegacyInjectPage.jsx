import { STNLegacyInject } from '../components/STNLegacyInject';
import { VoltaxPlayerLifecycle } from '../components/VoltaxPlayerLifecycle';
import { destroyPlayerByExternalID } from '../utils/playerUtils';

export function LegacyInjectPage() {
  const externalID = "demo-legacy-inject-player";
  const containerId = "legacy-inject-container";

  return (
    <div>
      <h2>Legacy Inject Page</h2>
      <div className="player-grid">
        <section className="player-card" id={containerId}>
          <header>
            <h3>Legacy Inject Player</h3>
            <p>Old Legacy Inject Embed</p>
          </header>
          <STNLegacyInject
            externalID={externalID}
            containerId={containerId}
          />
          <VoltaxPlayerLifecycle externalID={externalID} containerId={containerId} destroyOnUnmount={false} />
          <div className="controls">
            <button type="button" onClick={() => destroyPlayerByExternalID(externalID)}>
              Destroy player
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
