# Accessing the Player Instance

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

The React demo wraps this pattern inside [`react-spa-demo/src/utils/playerUtils.js`](https://github.com/FTBpro/voltax-player-examples/blob/main/react-spa-demo/src/utils/playerUtils.js) for reuse.