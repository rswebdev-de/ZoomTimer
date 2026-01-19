# Zoom Timer App

A Zoom Marketplace Timer App that allows users to set timers and use stopwatch functionality during Zoom meetings.

## Features

- **Timer Functionality**
  - Set custom hours, minutes, and seconds
  - Preset timer options
  - Start, pause, and resume capabilities
  - Audio alarm when timer expires
  - Option to show timer to all participants

- **Stopwatch Functionality**
  - Start/Pause functionality
  - Reset to clear timing
  - Track task durations

- **Keyboard Shortcuts**
  - Enter/Return: Start, pause, and resume
  - Esc: Cancel timer
  - Up/Down arrows: Add or remove time

- **Meeting Integration**
  - Display timer in participant's video tile
  - Show timer indicator in meeting window
  - Virtual foreground display of timer
  - Dynamic indicator for all participants

## Requirements

- Zoom account
- Zoom desktop client for Windows or macOS (5.14.10 or higher)
- URL allowlist: https://timer.zoomapp.cloud/

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy to Zoom Marketplace

## Development

To start development:

```bash
npm run dev
```

This will start the webpack dev server on `http://localhost:3000`

## Architecture

- **src/index.ts** - Main entry point
- **src/components/** - React components
- **src/utils/** - Utility functions
- **src/services/** - Zoom SDK integration
- **public/** - Static assets

## Zoom SDK Integration

The app uses the following Zoom Apps SDK methods:

- `setVirtualForeground` - Display timer in user's video
- `removeVirtualForeground` - Remove virtual background
- `onMyMediaChange` - Monitor video settings changes
- `setDynamicIndicator` - Display timer in meeting window

## Data Security

This application does not share any personal data. The app uses the `zoomapp:inmeeting` scope to operate within meetings.

## License

MIT
