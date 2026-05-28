# SPA Integration Guide

Modern partners frequently mount the Voltax embed inside a client‑side router. This guide captures the best practices to keep the experience smooth for both the site and the player. A working implementation that applies every recommendation here lives in [`./react-spa-demo`](https://github.com/FTBpro/voltax-player-examples), so feel free to read the code alongside the guidelines.

## For an In-Depth Explanation and Examples -

* **Bootstrapping the player once** - How to use the player as a single instance on the page, or with multiple instances, and what to pay attention to.
* **Accessing the player instance** - How to get the right player instance and use it to destroy, inject, or load the player with new content.
* **Handling route changes** - How to use the same player instance on route changes instead of recreating it and re-downloading the script on each route.
* **Cleanup, Troubleshooting & Notes** - When and how to destroy the player instance, what went wrong, some general do's-and-don'ts, and a note on using multiple players per page.

<br />

## TL;DR for a Simple Scenario - Single Player Per Page

<Callout icon="📘" theme="info">
  Note: The following is the most recommended method to use the player.\
  Keeping it in the dom for the entire lifetime of the app and reusing the instance will:

  * Improve **performance** of the app -
    * Reduce network calls
    * Reduce memory usage
  * Improve monetization and revenue.
</Callout>

* Inject the embed snippet once and keep the embed's `<div>` with the script tag after it in the DOM for the lifetime of the shell layout.
* Read the instantiated player via `window.voltax` instead of re‑adding `<script src="https://players.voltaxservices.io/players/<orgID>/<propertyID>/embed">` (`<script src="https://embed.sendtonews.com/player3/embedcode.js">` in Old Legacy) on every route change. 
* Use the [public APIs](https://developer.voltax.io/docs/methods) (`injectPlayer`, `destroyPlayer` and event listeners) to control lifecycle instead of reloading scripts per route.
* Optional: Call `player.destroyPlayer()` before removing the container entirely (e.g., when leaving the SPA or tearing down the host app).
* Need a concrete implementation? Use the [React SPA demo](https://github.com/FTBpro/voltax-player-examples) in this repository for a working project that reuses these ideas.
* Important: Once a player instance is created, its configuration (data attributes, script query params, etc.) is frozen—changing the DOM after boot will not update the player. Destroy the instance and render a fresh embed container if you need a different config.

<br />