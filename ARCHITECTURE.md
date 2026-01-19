# Zoom Timer App - Project Overview

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Zoom Desktop Client                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Zoom Timer App (WebView)                    │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │           React App Component                 │    │   │
│  │  │  ┌──────────────────────────────────────┐    │    │   │
│  │  │  │     Tab Navigation (Timer/Stopwatch)│    │    │   │
│  │  │  └──────────────────────────────────────┘    │    │   │
│  │  │  ┌──────────────────────────────────────┐    │    │   │
│  │  │  │    Timer Component / Stopwatch Comp  │    │    │   │
│  │  │  │  ┌────────────────────────────────┐ │    │    │   │
│  │  │  │  │   UI Elements (Buttons, Input)│ │    │    │   │
│  │  │  │  │   - Time Input Fields         │ │    │    │   │
│  │  │  │  │   - Control Buttons           │ │    │    │   │
│  │  │  │  │   - Preset Buttons            │ │    │    │   │
│  │  │  │  │   - Options (Audio, Show All) │ │    │    │   │
│  │  │  │  └────────────────────────────────┘ │    │    │   │
│  │  │  └──────────────────────────────────────┘    │    │   │
│  │  │                                              │    │   │
│  │  │  ┌────────────────────────────────────┐    │    │   │
│  │  │  │   KeyboardShortcutsManager        │    │    │   │
│  │  │  │   - Enter/Return: Start/Pause    │    │    │   │
│  │  │  │   - Esc: Cancel                  │    │    │   │
│  │  │  │   - Arrow Keys: Add/Subtract     │    │    │   │
│  │  │  └────────────────────────────────────┘    │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                     │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │       Managers & Services                 │    │   │
│  │  │  ┌──────────────────────────────────┐    │    │   │
│  │  │  │   TimerManager                  │    │    │   │
│  │  │  │   - Timer logic                 │    │    │   │
│  │  │  │   - State management            │    │    │   │
│  │  │  │   - Time calculations           │    │    │   │
│  │  │  └──────────────────────────────────┘    │    │   │
│  │  │  ┌──────────────────────────────────┐    │    │   │
│  │  │  │   StopwatchManager              │    │    │   │
│  │  │  │   - Elapsed time tracking       │    │    │   │
│  │  │  │   - Start/Pause/Reset logic     │    │    │   │
│  │  │  └──────────────────────────────────┘    │    │   │
│  │  │  ┌──────────────────────────────────┐    │    │   │
│  │  │  │   ZoomSDKService                │    │    │   │
│  │  │  │   - Virtual foreground          │    │    │   │
│  │  │  │   - Dynamic indicator           │    │    │   │
│  │  │  │   - Media change monitoring     │    │    │   │
│  │  │  │   - Meeting context             │    │    │   │
│  │  │  └──────────────────────────────────┘    │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ▲                                     │
│                         │ Zoom Apps SDK                       │
└─────────────────────────┼─────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   Virtual Foreground  Dynamic Indicator  Media Events
   (Video Display)     (Meeting Window)   (Video/Audio)
```

## 🔄 Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    User Interaction (UI)                          │
│  - Set timer duration                                            │
│  - Click buttons (Start/Pause/Resume/Cancel)                     │
│  - Toggle options (Audio/Show to All)                            │
│  - Use keyboard shortcuts                                        │
└───────────┬────────────────────────────────────────────┬─────────┘
            │                                            │
            ▼                                            ▼
    ┌─────────────────┐                       ┌──────────────────┐
    │ Timer Component │                       │ Keyboard Handler │
    │ Stopwatch Comp  │                       │ (KeyboardManager)│
    └────────┬────────┘                       └────────┬─────────┘
             │                                        │
             └──────────────┬───────────────────────┘
                            │
                            ▼
        ┌─────────────────────────────────┐
        │   TimerManager /               │
        │   StopwatchManager             │
        │   (Business Logic)             │
        │   - Calculate time             │
        │   - Manage state               │
        │   - Trigger callbacks          │
        └────────────┬────────────────────┘
                     │
         ┌───────────┴─────────────┐
         │                         │
         ▼                         ▼
    ┌─────────────┐          ┌─────────────────┐
    │  UI Update  │          │  ZoomSDKService │
    │  - Display  │          │  - Virtual FG   │
    │  - Buttons  │          │  - Indicator    │
    └─────────────┘          │  - Media Events │
                             └─────────────────┘
                                     │
                                     ▼
                            Zoom Meeting Features
                            - Show timer to all
                            - Display video overlay
                            - Sync with participants
```

## 🗂️ File Organization

```
ZoomTimer/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── webpack.config.js           # Build configuration
│   ├── .gitignore                  # Git ignore rules
│   ├── .env.example                # Environment template
│   ├── manifest.json               # Marketplace manifest
│   └── zoomapp.json               # Zoom app configuration
│
├── 📁 src/                          # Source code
│   ├── index.ts                    # App entry point
│   ├── index.css                   # Global styles
│   │
│   ├── 📁 components/              # React components
│   │   ├── App.tsx                # Main app (tabs)
│   │   ├── App.css                # App styles
│   │   ├── Timer.tsx              # Timer UI
│   │   ├── Timer.css              # Timer styles
│   │   ├── Stopwatch.tsx          # Stopwatch UI
│   │   └── Stopwatch.css          # Stopwatch styles
│   │
│   ├── 📁 services/               # External integrations
│   │   └── ZoomSDKService.ts      # Zoom SDK wrapper
│   │
│   └── 📁 utils/                  # Utility classes
│       ├── TimerManager.ts        # Timer business logic
│       ├── StopwatchManager.ts    # Stopwatch logic
│       └── KeyboardShortcutsManager.ts
│
├── 📁 public/                       # Static assets
│   └── index.html                 # HTML template
│
├── 📁 dist/                        # Built files (generated)
│   ├── bundle.js                  # Bundled JavaScript
│   ├── main.css                   # Bundled CSS
│   └── ...
│
├── 📚 Documentation
│   ├── README.md                  # Main documentation
│   ├── QUICKSTART.md              # Quick start guide
│   ├── DEPLOYMENT_GUIDE.md        # Deployment instructions
│   ├── MARKETPLACE_CONFIG.md      # Marketplace setup
│   └── CONTRIBUTING.md            # Contributing guidelines
│
└── 📄 License & Info
    └── LICENSE                    # MIT License
```

## 🔌 Component Interactions

### Timer Component Flow
```
TimerComponent
├── State: hours, minutes, seconds, soundEnabled, showToAll
├── Creates: TimerManager instance
├── On Mount:
│   ├── Initialize TimerManager with time values
│   ├── Set tick callback (update display)
│   └── Set complete callback (play sound, notify)
│
├── User Actions:
│   ├── Click Start → timerManager.start()
│   ├── Click Pause → timerManager.pause()
│   ├── Click Resume → timerManager.resume()
│   ├── Click Reset → timerManager.reset()
│   ├── Click Cancel → timerManager.stop()
│   ├── Select Preset → init with preset values
│   └── Toggle Options → update state flags
│
└── Callbacks:
    ├── onTick → Update display, show in Zoom
    └── onComplete → Play alarm, clear indicator
```

### Zoom SDK Integration Flow
```
ZoomSDKService
├── Initialize
│   ├── Import @zoom/appssdk
│   ├── Create ZoomApp instance
│   └── Set initialized flag
│
├── Virtual Foreground (Timer Display)
│   ├── Generate timer image
│   └── Call setVirtualForeground()
│
├── Dynamic Indicator (Meeting Window)
│   ├── Format time string
│   └── Call setDynamicIndicator(label, color)
│
├── Media Monitoring
│   ├── Listen for onMyMediaChange
│   └── Adjust timer dimensions
│
└── Context
    ├── getMeetingContext()
    └── Get participant info
```

## 🎯 Key Features & Implementation

| Feature | Manager | Method | Zoom SDK |
|---------|---------|--------|----------|
| **Timer** | TimerManager | start/pause/resume/stop | - |
| **Stopwatch** | StopwatchManager | start/pause/reset | - |
| **Time Display** | Both | getStatus() | - |
| **Audio Alarm** | Component | playAudio() (Web Audio API) | - |
| **Video Overlay** | ZoomSDKService | setVirtualForeground() | ✓ |
| **Meeting Indicator** | ZoomSDKService | setDynamicIndicator() | ✓ |
| **Keyboard Shortcuts** | KeyboardShortcutsManager | handleKeyDown() | - |
| **Show to All** | Component | UI state flag | ✓ (via indicator) |

## 🚀 Deployment Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  Developer  │      │   Build      │      │   Server     │
│  Workspace  │─────▶│  Pipeline    │─────▶│   Deployment │
│             │      │              │      │              │
│ - Source    │      │ - npm build  │      │ - Node.js    │
│ - Config    │      │ - Webpack    │      │ - Express    │
│ - Assets    │      │ - Minify     │      │ - HTTPS      │
└─────────────┘      └──────────────┘      └──────────────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │   Zoom       │
                                            │   Marketplace│
                                            │              │
                                            │ - Published  │
                                            │ - Installable│
                                            │ - Updateable │
                                            └──────────────┘
```

## 📈 Performance Considerations

| Aspect | Optimization | Target |
|--------|--------------|--------|
| **Bundle Size** | Webpack minification | < 500KB |
| **Initial Load** | Code splitting | < 2s |
| **Timer Accuracy** | setInterval (1000ms) | ±100ms |
| **UI Responsiveness** | React optimization | 60 FPS |
| **Memory** | Cleanup on unmount | < 50MB |
| **CPU** | Efficient re-renders | Minimal |

## 🔐 Security Model

```
User Data
    │
    ├─ Device Local Only (No server storage)
    │  ├── Timer values
    │  ├── Stopwatch elapsed time
    │  └── Settings (audio, show all)
    │
    └─ Zoom Meeting Context (Shared within meeting)
       ├── Dynamic indicator (timer display)
       ├── Virtual foreground (video overlay)
       └── Participant sync
```

---

**This architecture ensures:**
✓ Modular, maintainable code
✓ Clean separation of concerns
✓ Easy testing and debugging
✓ Scalable for future enhancements
✓ Secure data handling
✓ Optimal performance
