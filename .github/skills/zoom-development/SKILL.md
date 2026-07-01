---
name: zoom-development
description: >
  Zoom Developer Platform guidance for the ZoomTimer project. Use when building
  with the Zoom Apps SDK, Zoom REST API, OAuth, webhooks, WebSockets, Meeting SDK,
  Video SDK, Plugin SDK, RTMS, Team Chat, or any other Zoom platform product.
  Covers in-meeting apps, SDK capabilities, postMessage/onMessage, virtual
  foreground, dynamic indicators, authentication, and routing to all Zoom skills.
  Triggers: zoom apps sdk, in-meeting app, postMessage, virtual foreground,
  dynamic indicator, zoom api, zoom oauth, zoom webhook, zoom sdk, zoom meeting,
  zoom timer, zoom integration.
---

# Zoom Development — ZoomTimer Project

This skill provides Zoom Developer Platform guidance scoped to the ZoomTimer
project, which is a **Zoom Apps SDK** app (`@zoom/appssdk`) running inside the
Zoom client. It acts as a local hub and routes to the official Zoom platform
skills at [github.com/zoom/skills](https://github.com/zoom/skills).

---

## Project Context

| Item | Value |
|------|-------|
| SDK | `@zoom/appssdk` (Zoom Apps SDK) |
| Framework | React + TypeScript |
| Running context | Inside Zoom client (in-meeting app) |
| Primary SDK version | `0.16` |
| Key capabilities | `setDynamicIndicator`, `setVirtualForeground`, `postMessage`, `onMessage`, `showNotification`, `closeApp` |

---

## Skill Routing

Use the table below to pick the right upstream skill from
[github.com/zoom/skills](https://github.com/zoom/skills). Install or reference
the relevant `SKILL.md` for deep guidance.

| I want to... | Zoom skill |
|---|---|
| Build or extend an in-meeting app (this project) | **[zoom-apps-sdk](https://github.com/zoom/skills/blob/main/skills/zoom-apps-sdk/SKILL.md)** |
| Call Zoom REST APIs (schedule meetings, list users, etc.) | **[zoom-rest-api](https://github.com/zoom/skills/blob/main/skills/rest-api/SKILL.md)** |
| Receive real-time event notifications (HTTP push) | **[zoom-webhooks](https://github.com/zoom/skills/blob/main/skills/webhooks/SKILL.md)** |
| Receive low-latency event notifications (WebSocket) | **[zoom-websockets](https://github.com/zoom/skills/blob/main/skills/websockets/SKILL.md)** |
| Embed a Zoom meeting in an external app | **[zoom-meeting-sdk](https://github.com/zoom/skills/blob/main/skills/meeting-sdk/SKILL.md)** |
| Build a custom video session product | **[zoom-video-sdk](https://github.com/zoom/skills/blob/main/skills/video-sdk/SKILL.md)** |
| Build a native macOS/Windows companion that controls Zoom Workplace | **[zoom-plugin-sdk](https://github.com/zoom/skills/blob/main/skills/plugin-sdk/SKILL.md)** |
| Access live audio, video, or transcripts from a meeting | **[zoom-rtms](https://github.com/zoom/skills/blob/main/skills/rtms/SKILL.md)** |
| Transcribe uploaded or stored media files | **[scribe](https://github.com/zoom/skills/blob/main/skills/scribe/SKILL.md)** |
| Summarize transcripts into recaps or action items | **[summarizer](https://github.com/zoom/skills/blob/main/skills/summarizer/SKILL.md)** |
| Translate plain text or text files | **[translator](https://github.com/zoom/skills/blob/main/skills/translator/SKILL.md)** |
| Build or extend Team Chat apps and bots | **[zoom-team-chat](https://github.com/zoom/skills/blob/main/skills/team-chat/SKILL.md)** |
| Build Virtual Agent web/mobile experiences | **[virtual-agent](https://github.com/zoom/skills/blob/main/skills/virtual-agent/SKILL.md)** |
| Build Contact Center apps or channel integrations | **[contact-center](https://github.com/zoom/skills/blob/main/skills/contact-center/SKILL.md)** |
| Build Zoom Phone integrations (Smart Embed, APIs, webhooks) | **[phone](https://github.com/zoom/skills/blob/main/skills/phone/SKILL.md)** |
| Add pre-built UI components to a Video SDK app | **[zoom-ui-toolkit](https://github.com/zoom/skills/blob/main/skills/ui-toolkit/SKILL.md)** |
| Enable collaborative browsing for support | **[zoom-cobrowse-sdk](https://github.com/zoom/skills/blob/main/skills/cobrowse-sdk/SKILL.md)** |
| Implement OAuth (PKCE, S2S, auth code, implicit) | **[zoom-oauth](https://github.com/zoom/skills/blob/main/skills/oauth/SKILL.md)** |
| Build AI-driven tool workflows over meetings, Team Chat, Docs | **[zoom-mcp](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/SKILL.md)** |
| Build a Rivet-based server integration | **[rivet-sdk](https://github.com/zoom/skills/blob/main/skills/rivet-sdk/SKILL.md)** |
| Run preflight diagnostics before Meeting/Video SDK joins | **[probe-sdk](https://github.com/zoom/skills/blob/main/skills/probe-sdk/SKILL.md)** |
| General / cross-product guidance | **[zoom-general](https://github.com/zoom/skills/blob/main/skills/general/SKILL.md)** |

---

## Zoom Apps SDK Quick Reference (Primary for this project)

### SDK Initialization Pattern

```typescript
import zoomSdk from '@zoom/appssdk';

await zoomSdk.config({
  version: '0.16',
  capabilities: ['setDynamicIndicator', 'setVirtualForeground', /* ... */],
});
```

Always call `config()` before any other SDK method. List every capability the app
uses.

### Capability Decision Matrix

| Goal | Capability | Notes |
|------|-----------|-------|
| Show countdown in host's meeting UI | `setDynamicIndicator` | Host-only; visible in title bar area |
| Show overlay on host's video tile | `setVirtualForeground` | Requires `ImageData`; host camera must be on |
| Broadcast a message to all participant app instances | `postMessage` | Participants must have the app open to receive |
| Receive messages from host | `onMessage` | `event.payload` is a `JSONObject` |
| Show an in-meeting notification | `showNotification` | Type: `info \| success \| warning \| error` |
| Close the app programmatically | `closeApp` | Cleans up indicator and foreground first |

### postMessage / onMessage Pattern

`postMessage` broadcasts a `JSONObject` payload to every participant who has the
app open. This is the **only** SDK mechanism for triggering an action (e.g., playing
a sound) on a participant's device — it requires the participant to have the app
running.

```typescript
// Host broadcasts an event
await zoomSdk.postMessage({ type: 'alarm' });

// Participant's app instance receives it
zoomSdk.onMessage((event) => {
  if (event.payload.type === 'alarm') {
    playAudio();
  }
});
```

Add both `'postMessage'` and `'onMessage'` to the `capabilities` array in `config()`.

---

## APIs vs MCP Routing

| Goal | Route |
|------|-------|
| Deterministic automation, configuration, reporting | **zoom-rest-api** |
| AI-agent tool discovery, dynamic tool workflows | **zoom-mcp** |
| Enterprise AI with stable core + AI tool layer | **zoom-rest-api + zoom-mcp** |

Source: https://developers.zoom.us/docs/mcp/library/resources/apis-vs-mcp/

---

## Common Use Cases in this Project

| Task | Skills needed |
|------|---------------|
| Extend in-meeting timer/stopwatch features | zoom-apps-sdk |
| Add OAuth-gated features | zoom-apps-sdk + zoom-oauth |
| Post-meeting recording or transcript workflows | zoom-webhooks + zoom-rest-api |
| Add AI summarization of meeting time | summarizer + zoom-rest-api |
| Real-time transcription during meeting | zoom-rtms + zoom-webhooks |

---

## SDK Version Policy

- Current configured version: `0.16`
- Check [npm `@zoom/appssdk`](https://www.npmjs.com/package/@zoom/appssdk) for latest
- See [zoom-general sdk-upgrade-workflow](https://github.com/zoom/skills/blob/main/skills/general/references/sdk-upgrade-workflow.md) before bumping the version

---

## Resources

- **Zoom Developer docs**: https://developers.zoom.us/
- **Zoom Apps SDK npm**: https://www.npmjs.com/package/@zoom/appssdk
- **Zoom App Marketplace**: https://marketplace.zoom.us/
- **Developer forum**: https://devforum.zoom.us/
- **Zoom skills repo**: https://github.com/zoom/skills
- **zoom-apps-sdk skill**: https://github.com/zoom/skills/blob/main/skills/zoom-apps-sdk/SKILL.md
- **zoom-general skill (hub)**: https://github.com/zoom/skills/blob/main/skills/general/SKILL.md
