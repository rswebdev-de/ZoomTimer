# Zoom Timer App

A Zoom Apps SDK timer and stopwatch that runs inside Zoom meetings. Built with React 18, TypeScript, and Express.

## Features

- **Timer** -- custom duration or presets (1, 5, 10, 15, 30 min, 1 hour), start/pause/resume/cancel, optional audio alarm
- **Stopwatch** -- elapsed time tracking with start/pause/resume/reset
- **Show to all participants** -- renders the timer as a virtual foreground overlay on your video tile via `setVirtualForeground`
- **Dynamic indicator** -- displays the countdown in the Zoom meeting window via `setDynamicIndicator`

## Requirements

- Node.js 18+
- Zoom desktop client for Windows or macOS (v5.14.10+)

## Development

```bash
npm install
npm run dev       # webpack dev server on http://localhost:3000
npm test          # run all tests
npm run build     # production webpack build
```

## Project Structure

```
src/
  index.tsx                  # entry point, initializes Zoom SDK + React
  components/
    App.tsx                  # tab navigation (Timer / Stopwatch)
    Timer.tsx                # timer UI, Zoom SDK integration
    Stopwatch.tsx            # stopwatch UI
  services/
    ZoomSDKService.ts        # singleton wrapper around @zoom/appssdk
  utils/
    TimerManager.ts          # timer state machine (idle/running/paused)
    StopwatchManager.ts      # stopwatch state machine
    KeyboardShortcutsManager.ts  # keyboard event handler (not currently wired up)
public/
  index.html                 # HTML shell
server.js                    # Express production server with OWASP headers
```

## Zoom SDK Integration

The app calls `zoomSdk.config()` on startup to declare capabilities:

- `setVirtualForeground` / `removeVirtualForeground` -- overlay timer on video tile
- `setDynamicIndicator` / `removeDynamicIndicator` / `getDynamicIndicator` -- meeting window label
- `onMyMediaChange` -- react to video/audio changes
- `getMeetingContext` / `getUserContext` -- meeting and participant info
- `showNotification` -- in-app notifications
- `closeApp` -- close the app panel

The server sets the 4 OWASP headers Zoom requires on all HTML responses (`Strict-Transport-Security`, `X-Content-Type-Options`, `Content-Security-Policy`, `Referrer-Policy`). Without these, the Zoom client blocks the app from rendering.

## Docker

Build and run:

```bash
docker build -t zoom-timer-app .
docker run -p 3000:3000 -e NODE_ENV=production -e PORT=3000 zoom-timer-app
```

Or with docker-compose:

```bash
docker compose up --build
```

The container exposes port 3000. Place it behind a reverse proxy (nginx, Caddy, etc.) that terminates TLS -- Zoom requires HTTPS for the Home URL.

## Zoom Marketplace Registration

App registration happens entirely through the [Zoom Marketplace portal](https://marketplace.zoom.us/), not through config files in this repo.

1. Create a **General App** at marketplace.zoom.us
2. Set the **Home URL** to your deployed HTTPS endpoint
3. Add scope `zoomapp:inmeeting`
4. Configure an **OAuth Redirect URL** and add your domain to the **OAuth allow list**
5. Note the generated **Client ID** and **Client Secret** (only needed if you add a backend OAuth flow)

This app is client-side only -- `zoomSdk.config()` handles authentication within the Zoom client's WebView. No backend auth flow is implemented. For Marketplace publication, Zoom's review team may require adding the full OAuth authorization flow.

## Data Security

- No personal data is collected or transmitted
- Timer/stopwatch state exists only in browser memory
- Uses only the `zoomapp:inmeeting` scope
- No external API calls

## License

MIT
