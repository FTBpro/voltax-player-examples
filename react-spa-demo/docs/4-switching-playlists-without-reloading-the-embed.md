# Switching Playlists Without Reloading the Embed

Once you have a player instance, you can change its playlist/content on the fly. The runtime exposes [`player.replacePlayerContent({ playerKey })`](https://developer.voltax.io/docs/methods#vplayerreplaceplayercontentoptions--playerkey-string--void), which is what the React demo uses for the playlist selector controls. Example:

```js
const [player] = window.voltax.getPlayersByExternalID('shared-hero-player') || [];
player?.replacePlayerContent(
  {
    playerKey: 'hyuHqOUVYz-5524964-15676',
  }
);
```

You can call this from route hooks or UI event handlers whenever the SPA needs to switch content without reinstantiating the embed.

The React demo exposes a playlist selector using this API (see [`react-spa-demo/src/components/PlayerCard.jsx`](https://github.com/FTBpro/voltax-player-examples/blob/main/react-spa-demo/src/components/PlayerCard.jsx)).