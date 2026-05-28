# Handling Route Changes

When a SPA navigates between routes, keep the existing player container mounted and use the runtime API to re-attach or tear down the instance as needed:

1. During navigation, call [`player.injectPlayer()`](https://developer.voltax.io/docs/methods#vplayerinjectplayertargetcontainer) after you confirm the player is still needed and the container remains in the DOM.
2. When leaving a route that should not host the player anymore, call [`player.destroyPlayer()`](https://developer.voltax.io/docs/methods#/vplayerdestroyplayer) so observers, timers, and ad requests stop immediately.

If a SPA needs the player to appear in different visual locations, give each route its own placeholder container and re-inject the existing instance into whichever element is active. The `injectPlayer(targetElement)` API accepts a DOM node—keep the script-loaded instance alive, then call `injectPlayer()` with the target container each time the route changes instead of relying on CSS tricks.

```js
const [player] = window.voltax.getPlayersByExternalID('shared-hero-player') || [];
const sharedPageContainer = document.querySelector('#shared-player-card');
const defaultPageContainer = document.querySelector('#shared-player-parking');

if (player) {
  const target = isOnSharedPage ? sharedPageContainer : defaultPageContainer;
  player.injectPlayer(target);
}
```

This mirrors the approach in [`react-spa-demo/src/components/VoltaxPlayerLifecycle.jsx`](https://github.com/FTBpro/voltax-player-examples/blob/main/react-spa-demo/src/components/VoltaxPlayerLifecycle.jsx), where the lifecycle helper resolves the player by `externalID` and passes the current container into `injectPlayer()` whenever the route changes.

### Example: React controller component (lifecycle only)

```jsx
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

```

The polling ensures React's lifecycle does not race the embed loader—once the player appears in `window.voltax` the helper reinjects it. Pass `destroyOnUnmount` when a component should fully tear down its instance (see `react-spa-demo/src/components/VoltaxPlayerLifecycle.jsx`).

Mount this lifecycle helper wherever you handle routing (e.g., inside a page component). The effect ensures the player is reinjected on navigation and automatically cleaned up when the route unmounts.