# Cleanup, Troubleshooting & Notes

## Cleaning Up When the Host App Unmounts

If your SPA ever removes the player container (e.g., switching to a page that should not contain video) call:

```js
player.destroyPlayer();
```

This stops observers, ads, and timers, so the page will not do extra work while the player is hidden. When you need it again, put the embed div back, and the script will rebuild the instance automatically.

<br />

## Troubleshooting & performance checklist

* **One Player Per Page Shell** – Multiple embeds are supported, but on SPAs, most partners only need one global player. Reuse it.
* **Avoid Forced Reflows** – Keep the container in the DOM and use CSS to hide/show it instead of unmounting/remounting on every route.
* **Reuse `window.voltax`** – Storing the reference avoids repeated DOM queries and lets you subscribe to events such as `videoChange`, `adLoaded`, etc.
* **Network hygiene** – Initialize the player once per route and reuse the existing instance when possible, instead of re-downloading the entire player bundle on every navigation.

Following the above steps should remove the confusion around SPA usage and prevent the degraded performance that was observed when the script was reloaded on every navigation.

<br />

## A Note on Working with Multiple Players

Some partners intentionally render more than one Voltax player on the same route (e.g., a hero player plus a sidebar player). The SPA guidelines stay the same, with a couple of extra tips:

* Each embed div gets its own instance inside `window.voltax.players`. Use `window.voltax.getPlayersByExternalID('hero-player-id')` or `getAllPlayersOnPage()` to grab a specific instance and store the reference alongside the React/Vue component that owns it.
* When a route change requires only one of the players to remain visible, use `player.injectPlayer()` / `player.destroyPlayer()` to control each instance independently.
* If you dynamically unmount one of the players (e.g., conditional rendering), call `player.destroyPlayer()` for that instance, before removing its container from the DOM to stop observers, timers, and ad requests for that player only.