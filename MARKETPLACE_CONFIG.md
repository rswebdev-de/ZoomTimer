# Zoom Timer App - Marketplace Configuration

## Overview
The Zoom Timer App is a marketplace application designed for the Zoom platform to help users manage time in meetings effectively.

## Key Features

### Timer Functionality
- Set custom hours, minutes, and seconds
- Preset timer options (1, 5, 10, 15, 30 minutes, 1 hour)
- Start, pause, and resume capabilities
- Cancel/reset functionality
- Audio alarm notification
- Display timer to all participants option

### Stopwatch Functionality
- Start/pause/resume tracking
- Reset to clear timing
- Track task durations in meetings

### User Interface
- Intuitive tabbed interface
- Clear time input controls with increment/decrement buttons
- Large, easy-to-read timer display
- Responsive design for various screen sizes

### Keyboard Shortcuts
- **Enter/Return**: Start, pause, and resume timer
- **Esc**: Cancel timer
- **Up Arrow**: Add time to timer
- **Down Arrow**: Subtract time from timer

### Integration with Zoom
- Uses Zoom Apps SDK for in-meeting functionality
- Virtual foreground display of timer
- Dynamic indicator showing timer in meeting window
- Monitors video settings changes

## Installation

1. Sign in to the Zoom Marketplace
2. Search for "Timer"
3. Click "Add" to install the app
4. The app will appear under the Apps section of the Zoom desktop client

## Usage

### Setting a Timer
1. Open the Timer app in the desktop client or during a meeting
2. Click the Timer tab
3. Enter the desired hours, minutes, and seconds using your keyboard or the up/down toggle buttons
4. (Optional) Toggle the audio alarm icon to enable/disable sound notification
5. (Optional) Toggle the "Show timer to all" option to display timer to all participants
6. Click "Start" to begin the timer

### Using the Stopwatch
1. Open the Timer app in the desktop client or during a meeting
2. Click the Stopwatch tab
3. Click "Start" to begin tracking time
4. Click "Pause" to temporarily stop
5. Click "Reset" to clear the timing

## System Requirements

- Zoom Account
- Zoom desktop client for Windows or macOS (5.14.10 or higher)
- Network allowlist: `https://timer.zoomapp.cloud/`

## Data Security

- The application does not share any personal data
- Uses `zoomapp:inmeeting` scope for meeting functionality
- Only accesses necessary Zoom SDK methods for timer display

## Zoom SDK Methods Used

- `setVirtualForeground` - Display timer in user's video
- `removeVirtualForeground` - Remove virtual background
- `onMyMediaChange` - Monitor video settings changes
- `setDynamicIndicator` - Display timer indicator in meeting window
- `getMeetingContext` - Get meeting information
- `closeApp` - Close the application

## Support

For issues or feature requests, visit:
https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0068677

## Version History

### v1.0.0
- Initial release
- Timer functionality with custom durations and presets
- Stopwatch functionality
- Keyboard shortcuts support
- Audio alarm
- Meeting participant visibility
- Zoom SDK integration
