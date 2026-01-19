# Zoom Timer App - Project Overview

## 📊 Architecture Diagram

```mermaid
graph TD
    ZDC["Zoom Desktop Client"]
    WEBVIEW["Zoom Timer App (WebView)"]
    REACT["React App Component"]
    TAB["Tab Navigation<br/>(Timer/Stopwatch)"]
    COMPONENTS["Timer/Stopwatch Components<br/>UI Elements"]
    KEYBOARD["KeyboardShortcutsManager<br/>- Enter/Return: Start/Pause<br/>- Esc: Cancel<br/>- Arrow Keys: Add/Subtract"]
    MANAGERS["Managers & Services"]
    TIMER_M["TimerManager<br/>- Timer logic<br/>- State management<br/>- Time calculations"]
    STOPWATCH_M["StopwatchManager<br/>- Elapsed time tracking<br/>- Start/Pause/Reset"]
    ZOOM_SDK["ZoomSDKService<br/>- Virtual foreground<br/>- Dynamic indicator<br/>- Media monitoring<br/>- Meeting context"]
    ZOOM_API["Zoom Apps SDK"]
    VF["Virtual Foreground<br/>(Video Display)"]
    DI["Dynamic Indicator<br/>(Meeting Window)"]
    ME["Media Events<br/>(Video/Audio)"]
    
    ZDC --> WEBVIEW
    WEBVIEW --> REACT
    REACT --> TAB
    REACT --> COMPONENTS
    REACT --> KEYBOARD
    REACT --> MANAGERS
    MANAGERS --> TIMER_M
    MANAGERS --> STOPWATCH_M
    MANAGERS --> ZOOM_SDK
    ZOOM_SDK --> ZOOM_API
    ZOOM_API --> VF
    ZOOM_API --> DI
    ZOOM_API --> ME
```

## 🔄 Data Flow

```mermaid
graph TD
    USER["User Interaction<br/>- Set timer duration<br/>- Click buttons<br/>- Toggle options<br/>- Use keyboard shortcuts"]
    TIMER_C["Timer Component"]
    STOPWATCH_C["Stopwatch Component"]
    KEYBOARD_H["Keyboard Handler<br/>(KeyboardManager)"]
    TIMER_M["TimerManager/<br/>StopwatchManager<br/>(Business Logic)<br/>- Calculate time<br/>- Manage state<br/>- Trigger callbacks"]
    UI_UPDATE["UI Update<br/>- Display<br/>- Buttons"]
    ZOOM_SERVICE["ZoomSDKService<br/>- Virtual FG<br/>- Indicator<br/>- Media Events"]
    ZOOM_FEATURES["Zoom Meeting Features<br/>- Show timer to all<br/>- Display video overlay<br/>- Sync with participants"]
    
    USER --> TIMER_C
    USER --> STOPWATCH_C
    USER --> KEYBOARD_H
    TIMER_C --> TIMER_M
    STOPWATCH_C --> TIMER_M
    KEYBOARD_H --> TIMER_M
    TIMER_M --> UI_UPDATE
    TIMER_M --> ZOOM_SERVICE
    ZOOM_SERVICE --> ZOOM_FEATURES
```

## 🗂️ File Organization

```mermaid
mindmap
  root((ZoomTimer))
    Configuration Files
      package.json
      tsconfig.json
      webpack.config.js
      .gitignore
      .env.example
      manifest.json
      zoomapp.json
    src
      index.ts
      index.css
      components
        App.tsx
        App.css
        Timer.tsx
        Timer.css
        Stopwatch.tsx
        Stopwatch.css
      services
        ZoomSDKService.ts
      utils
        TimerManager.ts
        StopwatchManager.ts
        KeyboardShortcutsManager.ts
    public
      index.html
    dist
      bundle.js
      main.css
    Documentation
      README.md
      QUICKSTART.md
      DEPLOYMENT_GUIDE.md
      MARKETPLACE_CONFIG.md
      CONTRIBUTING.md
    License
      LICENSE
```

## 🔌 Component Interactions

### Timer Component Flow
```mermaid
graph TD
    TC["TimerComponent"]
    STATE["State<br/>- hours, minutes, seconds<br/>- soundEnabled, showToAll"]
    TM["Creates: TimerManager"]
    MOUNT["On Mount<br/>- Initialize with values<br/>- Set tick callback<br/>- Set complete callback"]
    START["Click Start<br/>timerManager.start()"]
    PAUSE["Click Pause<br/>timerManager.pause()"]
    RESUME["Click Resume<br/>timerManager.resume()"]
    RESET["Click Reset<br/>timerManager.reset()"]
    CANCEL["Click Cancel<br/>timerManager.stop()"]
    PRESET["Select Preset<br/>init with preset values"]
    OPTIONS["Toggle Options<br/>update state flags"]
    TICK["onTick<br/>Update display, show in Zoom"]
    COMPLETE["onComplete<br/>Play alarm, clear indicator"]
    
    TC --> STATE
    TC --> TM
    TC --> MOUNT
    TC --> START
    TC --> PAUSE
    TC --> RESUME
    TC --> RESET
    TC --> CANCEL
    TC --> PRESET
    TC --> OPTIONS
    START --> TICK
    PAUSE --> TICK
    RESUME --> TICK
    TM --> COMPLETE
```

### Zoom SDK Integration Flow
```mermaid
mindmap
  root((ZoomSDKService))
    Initialize
      Import @zoom/appssdk
      Create ZoomApp instance
      Set initialized flag
    Virtual Foreground
      Timer Display
        Generate timer image
        Call setVirtualForeground
    Dynamic Indicator
      Meeting Window
        Format time string
        Call setDynamicIndicator
    Media Monitoring
      Listen for onMyMediaChange
      Adjust timer dimensions
    Context
      getMeetingContext
      Get participant info
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

```mermaid
graph LR
    DEV["Developer Workspace<br/>- Source<br/>- Config<br/>- Assets"]
    BUILD["Build Pipeline<br/>- npm build<br/>- Webpack<br/>- Minify"]
    SERVER["Server Deployment<br/>- Node.js<br/>- Express<br/>- HTTPS"]
    MARKET["Zoom Marketplace<br/>- Published<br/>- Installable<br/>- Updateable"]
    
    DEV --> BUILD
    BUILD --> SERVER
    SERVER --> MARKET
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

```mermaid
mindmap
  root((User Data))
    Device Local Only
      No server storage
        Timer values
        Stopwatch elapsed time
        Settings - audio, show all
    Zoom Meeting Context
      Shared within meeting
        Dynamic indicator - timer display
        Virtual foreground - video overlay
        Participant sync
```

---

**This architecture ensures:**
✓ Modular, maintainable code
✓ Clean separation of concerns
✓ Easy testing and debugging
✓ Scalable for future enhancements
✓ Secure data handling
✓ Optimal performance
