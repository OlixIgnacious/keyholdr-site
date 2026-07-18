# keyholdr-site

Marketing site for Keyholdr — a native menu bar / system tray vault for API
keys. macOS is on the [Mac App Store](https://apps.apple.com/in/app/keyholdr/id6789253781?mt=12);
[Keyholdr for Windows](https://github.com/OlixIgnacious/keyholdr-windows) is
source-available.

Deployed via GitHub Pages: https://olixignacious.github.io/keyholdr-site/

## Local preview

```sh
python3 -m http.server
```

Then open http://localhost:8000.

## Structure

- `index.html` / `index.css` / `index.js` — landing page
- `docs.html` — documentation: architecture, install (Homebrew, direct
  download, Mac App Store), shortcuts, full CLI reference, env var naming,
  and an MCP bridge guide for wiring Keyholdr into Claude Desktop/Code
- `support.html` — FAQ and contact
- `privacy.html` — shared privacy policy for both apps
