# Quick Start Guide - Zoom Timer App

## 📋 Overview

The Zoom Timer App is a fully-featured marketplace application that enables users to manage meeting time effectively with timer and stopwatch functionality integrated directly into Zoom meetings.

## 🚀 Getting Started (5 minutes)

### Prerequisites
- Node.js 16+ and npm
- Zoom desktop client v5.14.10 or higher
- Zoom account (free or paid)

### Installation & Setup

1. **Clone or navigate to the project:**
   ```bash
   cd /Users/A760323/Development/Zoom/ZoomTimer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   App will open at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📱 Features at a Glance

### Timer
- ⏱️ Set custom hours, minutes, seconds
- 🎯 Quick preset buttons (1, 5, 10, 15, 30 min, 1 hour)
- ⏸️ Start, pause, and resume controls
- 🔔 Optional audio alarm
- 👥 Show timer to all participants
- ⌨️ Keyboard shortcuts

### Stopwatch
- ▶️ Start/pause/resume tracking
- 🔄 Reset functionality
- ⏲️ Accurate elapsed time display

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| **Enter/Return** | Start/Pause/Resume |
| **Esc** | Cancel Timer |
| **Up Arrow** | Add 1 minute |
| **Down Arrow** | Remove 1 minute |

## 🏗️ Project Structure

```
ZoomTimer/
├── src/
│   ├── components/          # React UI components
│   │   ├── App.tsx         # Main app component
│   │   ├── Timer.tsx       # Timer component
│   │   ├── Stopwatch.tsx   # Stopwatch component
│   │   └── *.css           # Component styles
│   ├── services/           # Zoom SDK integration
│   │   └── ZoomSDKService.ts
│   ├── utils/              # Utility functions
│   │   ├── TimerManager.ts
│   │   ├── StopwatchManager.ts
│   │   └── KeyboardShortcutsManager.ts
│   ├── index.ts            # Entry point
│   └── index.css           # Global styles
├── public/
│   └── index.html          # HTML template
├── dist/                   # Built files
├── package.json            # Project dependencies
├── webpack.config.js       # Build configuration
├── manifest.json           # Zoom marketplace manifest
├── zoomapp.json           # Zoom app configuration
└── README.md              # Full documentation
```

## 📝 Key Files Explained

- **[src/index.ts](src/index.ts)** - Application entry point, initializes Zoom SDK and React
- **[src/components/App.tsx](src/components/App.tsx)** - Main app with tab navigation
- **[src/utils/TimerManager.ts](src/utils/TimerManager.ts)** - Core timer logic
- **[src/utils/StopwatchManager.ts](src/utils/StopwatchManager.ts)** - Stopwatch logic
- **[src/services/ZoomSDKService.ts](src/services/ZoomSDKService.ts)** - Zoom SDK integration
- **[manifest.json](manifest.json)** - Marketplace metadata
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions

## 🧪 Development

### Build Commands
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Production build
npm run start    # Start production server
npm test         # Run tests (when configured)
```

### Testing the App
1. Start the dev server
2. Open `http://localhost:3000` in your browser
3. Test timer and stopwatch features
4. Try keyboard shortcuts

### Zoom Integration Testing
1. Open Zoom Desktop Client
2. Go to Apps tab
3. Load the app from your development server
4. Test in a real or practice meeting

## 📦 Technologies Used

- **React 18** - UI Framework
- **TypeScript** - Type-safe code
- **Webpack 5** - Module bundler
- **Zoom Apps SDK** - Zoom integration
- **CSS3** - Styling

## 🔐 Security & Data

- ✅ No personal data collection
- ✅ Uses Zoom's `zoomapp:inmeeting` scope
- ✅ Data stays on user's device
- ✅ No external API calls required

## 🚢 Deployment

### Quick Deploy
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions on:
- Local development
- Zoom Marketplace submission
- Cloud deployment (AWS, Vercel, Heroku)
- Self-hosted setup

### Marketplace Submission Checklist
- [ ] Build passes without errors
- [ ] All features tested
- [ ] Icon and screenshots ready
- [ ] Manifest configured
- [ ] Environment variables set
- [ ] Documentation complete

## 🐛 Troubleshooting

### App not loading?
- Check browser console for errors
- Verify Node.js version (16+)
- Clear browser cache
- Restart dev server

### Zoom SDK errors?
- Ensure Zoom client v5.14.10+
- Check app URL in manifest
- Verify internet connection
- Review [Zoom SDK docs](https://developers.zoom.us/docs/zoom-sdk/)

### Keyboard shortcuts not working?
- Ensure app has focus
- Check browser permissions
- Try in Zoom meeting context

## 📚 Documentation

- [README.md](README.md) - Full feature documentation
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment
- [MARKETPLACE_CONFIG.md](MARKETPLACE_CONFIG.md) - Marketplace setup
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## 🤝 Support

- Official Zoom support: https://support.zoom.com/hc/
- Zoom Developer docs: https://developers.zoom.us/docs/
- GitHub Issues: (Create in your repository)

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 🎯 Next Steps

1. **Customize** - Add your branding and configs
2. **Test** - Thoroughly test in Zoom meetings
3. **Deploy** - Follow DEPLOYMENT_GUIDE.md
4. **Monitor** - Set up logging and analytics
5. **Iterate** - Gather feedback and improve

---

**Ready to deploy?** → See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Have questions?** → Check [CONTRIBUTING.md](CONTRIBUTING.md) or create an issue
