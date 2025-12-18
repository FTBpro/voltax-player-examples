# Voltax React SPA Demo

A minimal React + Vite project that showcases three common integration patterns:

1. A route with a single player instance.
2. A second route that reuses the exact same player container to demonstrate SPA-friendly reuse.
3. A route with two players (hero + sidebar) that coexist on the same page and are controlled independently.

## Getting started

Before running `yarn dev`, [point `react-spa-demo.test` at `127.0.0.1`](../README.md#local-testing-domain-react-spa-demotest). The Voltax embed checks the page origin, so serving the demo from a custom domain instead of `localhost` mimics production behavior (cookie scope, ad tags, analytics, etc.). See the “Local testing domain” section below for detailed steps.

## Local testing domain (`react-spa-demo.test`)

Add the following line to your hosts file so the browser can resolve the custom domain to your local dev server:

```
127.0.0.1 react-spa-demo.test
```

### Why this is required
- Many Voltax features (ads, targeting, analytics, cookies) rely on the page’s first-party domain; `localhost` behaves differently.
- The app hardcodes `react-spa-demo.test` in API calls and deep links so changing the hosts entry keeps everything in sync.

### macOS / Linux steps
1. Open `/etc/hosts` with elevated privileges, e.g. `sudo nano /etc/hosts`.
2. Append `127.0.0.1 react-spa-demo.test` on its own line and save the file.
3. Flush DNS if necessary with `sudo dscacheutil -flushcache` (macOS) or `sudo systemd-resolve --flush-caches` (Linux).
4. Run `ping react-spa-demo.test` to confirm it resolves to `127.0.0.1`.

### Windows steps
1. Launch Notepad as Administrator and open `C:\Windows\System32\drivers\etc\hosts` (choose “All Files” in the file picker).
2. Add the `127.0.0.1 react-spa-demo.test` line, save, and close the editor.
3. Flush DNS with `ipconfig /flushdns` from an elevated Command Prompt or PowerShell window.
4. `ping react-spa-demo.test` should now respond from `127.0.0.1`.

Once the entry is present you can keep it indefinitely—it simply maps the custom dev domain back to your local machine.

After setting the hosts file, you can now run the project locally using the following commands - 

```bash
cd react-spa-demo
yarn install
yarn dev
```

Then open `http://react-spa-demo.test:5173/` and use the sidebar links to switch between the single-player and multi-player pages.

** Note that you have to **disable the ad-blocker** on this domain for the player to run

## Project structure

- `STNEmbed` renders the actual embed markup (a `<div>` with a script tag after it).
- `VoltaxPlayerLifecycle` resolves the instantiated player via `window.voltax`, calls `injectPlayer` when the route is active, and automatically calls `destroyPlayer()` when the component unmounts.
- `PlayerCard` wires the embed + lifecycle together and exposes optional actions (e.g., an explicit “Destroy player” button). On the single/shared routes it is rendered once in `App.jsx` so it persists while the user navigates; the pages just show/hide the shared container via CSS.

Controller cleanup handles route unmounts automatically (e.g., when leaving the multi-player page), but the UI also includes an explicit “Destroy player” button to show the manual teardown hook.

The example reuses the guidance described in [`SPA_INTEGRATION.md`](../SPA_INTEGRATION.md).
