# Bootstrapping the player once

### Single Player Per Page

Place the embed markup in your root layout or any component that renders once (app shell, document template, etc.). **Important:** The `<script>` tag must sit inside each player container for the embed to work. A single global script cannot attach to multiple containers with the current embed contract.

#### How to Mount the Embed

Use the STN-provided `<div class="s2nPlayer">` container plus the script. This is useful when partners already rely on STN tooling.

```html
<div class="s2nPlayer k-UMLCTPqWAN"></div>
<script async defersrc="https://embed.sendtonews.com/player3/embedcode.js?fk=UMLCTPqWAN"
></script>
```

For SPAs, create the script element imperatively so that you can assign `externalID` / `isPlayerControlled` before inserting it (React/Vue code excerpt):

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

Single-page apps often need a stable handle to the instantiated player, even though the DOM nodes around it may be torn down and recreated. Assign a unique `externalID` to each container and mirror that value on the script element before you append it to the DOM:

```javascript
const script = document.createElement('script');
script.async = true;
script.defer = true;
script.src = 'https://embed.sendtonews.com/player3/embedcode.js?fk=...';
script.externalID = 'homepage-hero';
script.isPlayerControlled = true;
container.after(script);
```

* **`externalID`** – Provides a stable identifier that Voltax registers inside `window.voltax.getPlayersByExternalID('<externalID>')`. Use it to look up the same player instance after route transitions without querying the DOM.
* **`isPlayerControlled`** – Set to `true` when the host app manages lifecycle (calling `injectPlayer` and `destroyPlayer`). This prevents the embed from auto-attaching to a removed container and lets the SPA decide when to render or tear down the player.

Both properties are read-only when the player is first created; if you need to change them, destroy the instance and mount a fresh embed with the new settings.

### Multiple Embed Containers Per Page

If you need two players at the same time, give each one its own container **and its own script tag**. This ensures the player associates with the correct parent:

```html
<!-- Hero player -->
<div id="hero-player" class="s2nPlayer k-somePlayerKey"></div>
<script async defer src="https://embed.sendtonews.com/player3/embedcode.js?fk=somePlayerKey">
</script>

<!-- Sidebar player -->
<div id="sidebar-player" class="s2nPlayer k-somePlayerKey2"></div>
<script async defer src="https://embed.sendtonews.com/player3/embedcode.js?fk=somePlayerKey2">
</script>

```

Each container becomes a unique entry in `window.voltax.players`, so the SPA code can manage them independently. Loading the script once per container preserves the `document.currentScript` contract used by the embed loader.