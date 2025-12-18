# SPA Integration Guide

Modern partners frequently mount the Voltax embed inside a client‑side router. This guide captures the best practices that keep the experience smooth for both the site and the player. A working implementation that applies every recommendation here lives in [`./react-spa-demo`](react-spa-demo), so feel free to read the code alongside the guidelines.

## TL;DR for a simple scenario of - a single player per page

    ** Note that the following is the most recommended method to use the player **
    Keeping it in the dom for the entire lifetime of the app and reusing the instance will:

    - Improve **performance** of the app -
      - Reduce network calls
      - Reduce memory usage
    - Improve monetization and revenue.

- Inject the embed snippet once and keep the embed's `<div>` with the script tag after it in the DOM for the lifetime of the shell layout.
- Read the instantiated player via `window.voltax` instead of re‑adding `<script src="https://embed.sendtonews.com/player3/embedcode.js">` on every route change.
- Use the public APIs (`injectPlayer`, `destroyPlayer` and event listeners) to control lifecycle instead of reloading scripts per route.
- Optional: call `player.destroyPlayer()` before removing the container entirely (e.g., when leaving the SPA or tearing down the host app).
- Need a concrete implementation? Use the [React SPA demo](react-spa-demo) in this repository for a working project that reuses these ideas.
- Important: once a player instance is created its configuration (data attributes, script query params, etc.) is frozen—changing the DOM after boot will not update the player. Destroy the instance and render a fresh embed container if you need different config.

## 1. Bootstrapping the player once 

### A single player per page

Place the embed markup in your root layout or any component that renders once (app shell, document template, etc.). **Important:** the `<script>` tag must sit after each player container for the embed to work. A single global script cannot attach to multiple containers with the current embed contract.

#### Two ways to mount the embed

1. **STN embed form** – use the STN-provided `<div class="s2nPlayer">` container plus the script. This is useful when partners already rely on STN tooling.

   ```html
   <div
     class="s2nPlayer k-UMLCTPqWAN"
   ></div>
   <script
     async
     defer
     src="https://embed.sendtonews.com/player3/embedcode.js?fk=UMLCTPqWAN"
   ></script>
   ```

   For SPAs, create the script element imperatively so you can assign `externalID` / `isPlayerControlled` before inserting it (React/Vue code excerpt):

   ```javascript
   const script = document.createElement('script');
   script.async = true;
   script.defer = true;
   script.src = 'https://embed.sendtonews.com/player3/embedcode.js?fk=...';
   script.externalID = 'homepage-hero';
   script.isPlayerControlled = true;
   container.after(script);
   ```

<br />

Do **not** recreate any of these snippets on each client-side navigation. Reloading the script repeatedly spawns extra player instances, adds network cost, and can leave detached MutationObservers on the page.

### `externalID` and controlled players

Single-page apps often need a stable handle to the instantiated player even though the DOM nodes around it may be torn down and recreated. Assign a unique `externalID` to each container and mirror that value on the script element before you append it to the DOM:

```javascript
const script = document.createElement('script');
script.async = true;
script.defer = true;
script.src = 'https://embed.sendtonews.com/player3/embedcode.js?fk=...';
script.externalID = 'homepage-hero';
script.isPlayerControlled = true;
container.after(script);
```

* **`externalID`** – provides a stable identifier that Voltax registers inside `window.voltax.getPlayersByExternalID('<externalID>')`. Use it to look up the same player instance after route transitions without querying the DOM.
* **`isPlayerControlled`** – set to `true` when the host app manages lifecycle (calling `injectPlayer` and `destroyPlayer`). This prevents the embed from auto-attaching to a removed container and lets the SPA decide when to render or tear down the player.

Both properties are read only when the player is first created; if you need to change them, destroy the instance and mount a fresh embed with the new settings.

### Multiple embed containers per page

If you need two players at the same time, give each one its own container **and its own script tag**. This ensures the player associates with the correct parent:

```html
<!-- Hero player -->
<div
	id="hero-player"
  class="s2nPlayer k-somePlayerKey"
></div>
<script
  async
  defer
  src="https://embed.sendtonews.com/player3/embedcode.js?fk=somePlayerKey">
</script>

<!-- Sidebar player -->
<div
	id="sidebar-player"
  class="s2nPlayer k-somePlayerKey2"
></div>
<script
  async
  defer
  src="https://embed.sendtonews.com/player3/embedcode.js?fk=somePlayerKey2">
</script>

```

Each container becomes a unique entry in `window.voltax.players`, so the SPA code can manage them independently. Loading the script once per container preserves the `document.currentScript` contract used by the embed loader.

## 2. Accessing the player instance

When the script finishes booting it exposes a runtime API:

```js
const player = window.voltax.getPlayersByExternalID('<YOUR_EXTERNAL_ID>')?.[0];
// Alternatively: window.voltax.getAllPlayersOnPage()
```

To detect when Voltax finishes instantiating a player, listen for the global [`voltaxPlayerLoaded` custom event](https://developer.voltax.io/docs/obtaining-an-existing-player-instance#waiting-for-the-voltaxplayerloadedevent) . It fires with the `externalID` so you can filter to the instance you care about before interacting with the API (e.g., attaching `ready` listeners):

```js
window.addEventListener('voltaxPlayerLoaded', ({ detail }) => {
  if (detail.externalID !== '<YOUR_EXTERNAL_ID>') {
    return;
  }

  const player = window.voltax.getPlayersByExternalID(detail.externalID)?.[0];
  player?.on('ready', () => {
    // cache the player reference or attach analytics here
  });
});
```

The React demo wraps this pattern inside [`react-spa-demo/src/utils/playerUtils.js`](react-spa-demo/src/utils/playerUtils.js) for reuse.

### Switching playlists without reloading the embed

e you have a player instance, you can change its playlist/content on the fly. The runtime exposes [`player.replacePlayerContent({ playerKey })`](https://developer.voltax.io/docs/methods#vplayerreplaceplayercontentoptions--playerkey-string--void) , which is what the React demo uses for the playlist selector controls. Example:

```js
const [player] = window.voltax.getPlayersByExternalID('shared-hero-player') || [];
player?.replacePlayerContent(
  {
    playerKey: 'hyuHqOUVYz-5524964-15676',
  }
);
```

You can call this from route hooks or UI event handlers whenever the SPA needs to switch content without reinstantiating the embed.

The React demo exposes a playlist selector using this API (see [`react-spa-demo/src/components/PlayerCard.jsx`](react-spa-demo/src/components/PlayerCard.jsx)).

## 3. Handling route changes

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

This mirrors the approach in [`react-spa-demo/src/components/VoltaxPlayerLifecycle.jsx`](react-spa-demo/src/components/VoltaxPlayerLifecycle.jsx), where the lifecycle helper resolves the player by `externalID` and passes the current container into `injectPlayer()` whenever the route changes.

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

## 4. Cleaning up when the host app unmounts

If your SPA ever removes the player container (e.g., switching to a page that should not contain video) call:

```js
player.destroyPlayer();
```

This stops observers, ads, and timers so the page will not do extra work while the player is hidden. When you need it again, put the embed div back and the script will rebuild the instance automatically.

## 5. Troubleshooting & performance checklist

- **One player per page shell** – multiple embeds are supported, but on SPAs most partners only need one global player. Reuse it.
- **Avoid forced reflows** – keep the container in the DOM and use CSS to hide/show it instead of unmounting/remounting on every route.
- **Reuse `window.voltax`** – storing the reference avoids repeated DOM queries and lets you subscribe to events such as `videoChange`, `adLoaded`, etc.
- **Network hygiene** – initialize the player once per route and reuse the existing instance when possible instead of re-downloading the entire player bundle on every navigation.

Following the above steps should remove the confusion around SPA usage and prevent the degraded performance that was observed when the script was reloaded on every navigation.

## 6. Working with multiple players

Some partners intentionally render more than one Voltax player on the same route (e.g., a hero player plus a sidebar player). The SPA guidelines stay the same with a couple of extra tips:

- Each embed div gets its own instance inside `window.voltax.players`. Use `window.voltax.getPlayersByExternalID('hero-player-id')` or `getAllPlayersOnPage()` to grab a specific instance and store the reference alongside the React/Vue component that owns it.
- When a route change requires only one of the players to remain visible, use `player.injectPlayer()` / `player.destroyPlayer()` to control each instance independently.
- If you dynamically unmount one of the players (e.g., conditional rendering), call `player.destroyPlayer()` for that instance before removing its container from the DOM to stop observers, timers, and ad requests for that player only.
