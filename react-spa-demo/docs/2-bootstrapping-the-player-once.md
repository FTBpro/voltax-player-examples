# Bootstrapping the player once

### Single Player Per Page

Place the embed markup in your root layout or any component that renders once (app shell, document template, etc.). **Important:** The `<script>` tag must sit inside each player container for the embed to work. A single global script cannot attach to multiple containers with the current embed contract.

#### How to Mount the Embed / Inject
Use the STN-provided `<div class="s2nPlayer">` container plus the script. 

**Embed vs Inject:**
* **Embed:** The embed is used to embed a specific content on the page (playlist, video etc.).
* **Inject:** The inject is used without a specific content, the content will be loaded according to the playlist ID set on the player configuration targeted for this domain/property/device etc.

#### Modern Embed - Recommended
```html
<div class="s2nPlayer" data-content-id="YOUR_CONTENT_ID"></div>​
<script async defer src="https://players.voltaxservices.io/players/<orgID>/<propertyID>/embed"></script>​
```

#### Modern Inject - Recommended
```html
<div class="s2nPlayer"></div>
<script async defer src="https://players.voltaxservices.io/players/<orgID>/<propertyID>/code"></script>
```

#### Old Legacy Embed
```html
<div class="s2nPlayer k-UMLCTPqWAN"></div>
<script async defersrc="https://embed.sendtonews.com/player3/embedcode.js?fk=UMLCTPqWAN"
></script>
```

For SPAs, create the script element imperatively so that you can assign `externalID` / `isPlayerControlled` before inserting it (React/Vue code excerpt):

#### Modern Embed / Inject Script Creation - Recommended
```javascript
const script = document.createElement('script');
script.async = true;
script.defer = true;
// Use '/embed' for Embed, or '/code' for Inject
script.src = 'https://players.voltaxservices.io/players/<orgID>/<propertyID>/embed';
script.externalID = 'homepage-hero';
script.isPlayerControlled = true;

container.dataset.contentId = "YOUR_CONTENT_ID";
 // or directly in the html tag like so 
 // <div class="s2nPlayer" data-content-id="YOUR_CONTENT_ID">
container.after(script);
```

<br />

Note that if you are still using the **old legacy embed code**, the src value in the above exmaple should be changed accordingly like so - 
```javascript
script.src = 'https://embed.sendtonews.com/player3/embedcode.js?fk=...';
```

Do **not** recreate any of these snippets on each client-side navigation. Reloading the script repeatedly spawns extra player instances, adds network cost, and can leave detached MutationObservers on the page.

### `externalID` and controlled players

Single-page apps often need a stable handle to the instantiated player, even though the DOM nodes around it may be torn down and recreated. Assign a unique `externalID` to each container and mirror that value on the script element before you append it to the DOM:

```javascript
const script = document.createElement('script');
script.async = true;
script.defer = true;
// Use '/embed' for Embed, or '/code' for Inject
script.src = 'https://players.voltaxservices.io/players/<orgID>/<propertyID>/embed';
script.externalID = 'homepage-hero';
script.isPlayerControlled = true;

container.dataset.contentId = "YOUR_CONTENT_ID";
 // or directly in the html tag like so 
 // <div class="s2nPlayer" data-content-id="YOUR_CONTENT_ID">
container.after(script);
```

* **`externalID`** – Provides a stable identifier that Voltax registers inside `window.voltax.getPlayersByExternalID('<externalID>')`. Use it to look up the same player instance after route transitions without querying the DOM.
* **`isPlayerControlled`** – Set to `true` when the host app manages lifecycle (calling `injectPlayer` and `destroyPlayer`). This prevents the embed from auto-attaching to a removed container and lets the SPA decide when to render or tear down the player.

Both properties are read-only when the player is first created; if you need to change them, destroy the instance and mount a fresh embed with the new settings.

### Multiple Embed Containers Per Page

If you need two players at the same time, give each one its own container **and its own script tag**. This ensures the player associates with the correct parent:

```html
<!-- Hero player -->
<div id="hero-player" class="s2nPlayer" data-content-id="YOUR_CONTENT_ID"></div>
<!-- Use /embed for Embed, or /code for Inject -->
<script async defer src="https://players.voltaxservices.io/players/<orgID>/<propertyID>/embed">
</script>

<!-- Sidebar player -->
<div id="sidebar-player" class="s2nPlayer" data-content-id="YOUR_OTHER_CONTENT_ID">></div>
<script async defer src="https://players.voltaxservices.io/players/<orgID>/<propertyID>/embed">
</script>

```

Each container becomes a unique entry in `window.voltax.players`, so the SPA code can manage them independently. Loading the script once per container preserves the `document.currentScript` contract used by the embed loader.