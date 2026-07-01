# Zoom Timer App

A Zoom Apps SDK timer and stopwatch that runs inside Zoom meetings. Built with React 18, TypeScript, and Express.

## Features

- **Timer** -- custom duration or presets (1, 5, 10, 15, 30 min, 1 hour), start/pause/resume/cancel
- **Stopwatch** -- elapsed time tracking with start/pause/resume/reset
- **Audio alarm** -- plays a tone locally when the timer ends
- **30-second pre-warning** -- optional toggle; plays a distinct two-beep sound 30 seconds before the timer ends
- **Show timer to all** -- renders the countdown as a virtual foreground overlay on your video tile via `setVirtualForeground`
- **Sound alarm to participants** -- optional toggle; broadcasts an alarm signal via `postMessage` so participant app instances play the alarm sound locally (requires participants to have the app open)
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

The app calls `zoomSdk.config()` on startup to declare capabilities. The `configResponse.runningContext` is stored so in-meeting-only features can be gated correctly, and `configResponse.unsupportedApis` is logged as a warning when the user's Zoom client does not support a declared capability.

The SDK is initialized with a 3-second timeout — if `zoomSdk.config()` does not respond (e.g., when opened in a browser outside Zoom), the app renders in browser preview mode rather than hanging.

Declared capabilities:

| Capability | Purpose |
|---|---|
| `setVirtualForeground` / `removeVirtualForeground` | Overlay timer on host's video tile |
| `setDynamicIndicator` / `removeDynamicIndicator` | Meeting window countdown label |
| `postMessage` | Broadcast alarm/warning signal to participant app instances |
| `onMessage` | Receive alarm/warning signal and play sound on participant side |
| `showNotification` | In-app notifications |
| `closeApp` | Close the app panel |

The server sets the 4 OWASP headers Zoom requires on all HTML responses (`Strict-Transport-Security`, `X-Content-Type-Options`, `Content-Security-Policy`, `Referrer-Policy`). Without these, the Zoom client blocks the app from rendering.

## Docker

Two compose files:

| File | Purpose |
|---|---|
| `docker-compose.yml` | Base -- app service definition + Dev additions -- ngrok tunnel + nginx reverse proxy |
| `docker-compose.production.yml` | Prod hardening -- `restart: always`, resource limits, log rotation, removed Dev additions |

### Development

```bash
cp .env.example .env
# fill in NGROK_AUTHTOKEN and NGROK_DOMAIN
docker compose --profile dev up --build -d
```

or

```bash
npm run docker:dev:up
```

| Service | URL |
|---|---|
| App (direct) | `http://localhost:3000` |
| Reverse proxy | `http://localhost:8080${PUBLIC_URL}/` |
| ngrok HTTPS | `https://<NGROK_DOMAIN>` |
| ngrok inspector | `http://localhost:4040` |

#### Stop Development Containers

```bash
docker compose --profile dev down
```

or

```bash
npm run docker:dev:down
```

### Production

Combine the base with the production overlay. This skips the dev override and applies `restart: always`, resource limits (0.5 CPU / 256 MB), and log rotation.

```bash
docker compose -f docker-compose.yml -f docker-compose.production.yml up --build -d
```

With a subdirectory prefix:

```bash
PUBLIC_URL=/apps/timer docker compose -f docker-compose.yml -f docker-compose.production.yml up --build -d
```

or 

```bash
echo PUBLIC_URL=/apps/timer >> .env
docker compose -f docker-compose.yml -f docker-compose.production.yml up --build -d
```

or 

```bash
echo PUBLIC_URL=/apps/timer >> .env
npm run docker:prod:up
```

Place the container behind your own reverse proxy that terminates TLS -- Zoom requires HTTPS for the Home URL.

#### Stop Production Container

```bash
docker compose -f docker-compose.yml -f docker-compose.production.yml down
```

or 

```bash
npm run docker:prod:down
```

### CI/CD

```bash
# Build
docker compose -f docker-compose.yml -f docker-compose.production.yml build

# Tag and push to your registry
docker tag zoomtimer-zoom-timer-app registry.example.com/zoom-timer-app:latest
docker push registry.example.com/zoom-timer-app:latest

# Deploy on the production host
docker compose -f docker-compose.yml -f docker-compose.production.yml pull
docker compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

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
