# voltax-player-examples

### Integration Guides
- [SPA integration best practices](/react-spa-demo/docs/spa-integration-guide.md) – end-to-end tips for mounting Voltax once inside a SPA shell.

### Examples
- [React SPA demo](react-spa-demo) – an app that implements every recommendation from the guide.

### Local testing domain (`react-spa-demo.test`)
The demo app expects to be served from `http://react-spa-demo.test:5173/` so that the Voltax embed sees a realistic first-party origin (important for cookies, ads, and analytics that behave differently on `localhost`). Point that custom hostname at `127.0.0.1` before you start the dev server so the browser can resolve it.

**macOS / Linux**
1. Open `/etc/hosts` with elevated privileges, e.g. `sudo nano /etc/hosts`.
2. Append this line on its own: `127.0.0.1 react-spa-demo.test`.
3. Save the file, then flush DNS with `sudo dscacheutil -flushcache` (macOS) or `sudo systemd-resolve --flush-caches` (Linux) if needed.
4. Verify with `ping react-spa-demo.test`—it should resolve to `127.0.0.1`.

**Windows**
1. Open Notepad as Administrator and load `C:\Windows\System32\drivers\etc\hosts` (you may need to change the file filter to “All Files”).
2. Add the same line: `127.0.0.1 react-spa-demo.test`.
3. Save, then run `ipconfig /flushdns` in an elevated Command Prompt or PowerShell session.
4. Confirm via `ping react-spa-demo.test`; the response should come from `127.0.0.1`.

Once the entry is present you can keep it indefinitely—it simply maps the custom dev domain back to your local machine.

After setting the hosts file, you can now run the project locally using the following commands - 

```bash
cd react-spa-demo
yarn install
yarn dev
```
