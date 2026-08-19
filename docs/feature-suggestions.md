# Feature Suggestions

Ideas discussed but not yet implemented. Recorded here for future scoping.

## 1. Host-controlled, synced timer

**Problem**: Today every participant who opens the app runs their own independent
timer. "Sound alarm to participants" only reaches participants who already have
the app open, since `sendMessage`/`onMessage` is peer-to-peer between running
app instances, not a meeting-wide broadcast.

**Idea**: Make the timer a single shared countdown controlled by the meeting
host/co-host. Participants get a read-only view synced to the host's timer
instead of running their own.

**Decisions already made when this was scoped:**
- Host detection: use the Zoom meeting role (host/co-host), not "whoever clicks
  Start first."
- Participant experience: fully read-only — no Start/Pause/Reset/Cancel,
  presets, or time inputs. Just the synced countdown display.

**What it would take:**
- Re-add the `getUserContext` capability (removed in the guidelines audit) to
  read `role` and determine host/co-host.
- A small sync protocol over `sendMessage`: host broadcasts
  `{ action: 'start' | 'pause' | 'resume' | 'reset' | 'cancel', endAt, remainingSeconds }`
  on every control action.
- Late-joiner support: a participant who opens the app mid-countdown needs a
  `requestSync` message on mount, answered by the host with the current state.
- Participant UI changes to disable/hide all timer controls for non-hosts.
- Each participant's own "Audio alarm" / "30-second pre-warning" checkboxes
  would keep deciding locally whether *they* hear a sound once the synced
  countdown reaches zero/30s remaining — this removes the dependency on a
  one-shot `sendMessage` alarm signal arriving at exactly the right instant.
- Updated tests (`Timer.test.tsx`, `TimerManager`) and docs
  (`README.md`, `docs/manual.md`) to reflect the new host/participant model.

**Still does not solve**: a participant who never opens the app at all still
won't hear anything — that limitation is a hard constraint of the Zoom Apps
SDK, not something sync can work around.

**Status**: not started. Requires product buy-in on the host/participant model
change before implementation.

---

## 2. Prompt participants to open the app

**Idea**: Use `zoomSdk.sendAppInvitationToAllParticipants()` to send an
invitation dialog to everyone in the meeting when the host starts a timer with
"Sound alarm to participants" enabled, nudging them to open the app so a later
alarm broadcast can actually reach them.

**Caveats:**
- Participants must manually accept the invitation — Zoom does not allow an
  app to force-open itself on someone else's client.
- Requires declaring the `sendAppInvitationToAllParticipants` capability.
- Does not guarantee the alarm is heard, only improves the odds.

**Status**: not started.
