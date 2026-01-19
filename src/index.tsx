import React from 'react';
import ReactDOM from 'react-dom/client';
import AppComponent from './components/App';
import zoomSDKService from './services/ZoomSDKService';
import KeyboardShortcutsManager from './utils/KeyboardShortcutsManager';
import './index.css';

// Initialize Zoom SDK
async function initializeApp() {
  try {
    await zoomSDKService.initialize();
    console.log('Zoom SDK initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize Zoom SDK:', error);
    // App can still work without SDK in development mode
  }

  // Initialize keyboard shortcuts
  const keyboardManager = new KeyboardShortcutsManager();
  keyboardManager.register();

  // Render React app
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<React.StrictMode><AppComponent /></React.StrictMode>);

  // Cleanup on beforeunload
  window.addEventListener('beforeunload', () => {
    keyboardManager.unregister();
  });
}

// Start the app
initializeApp();
