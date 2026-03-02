import React from 'react';
import ReactDOM from 'react-dom/client';
import AppComponent from './components/App';
import zoomSDKService from './services/ZoomSDKService';
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

  // Render React app
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<React.StrictMode><AppComponent /></React.StrictMode>);
}

// Start the app
initializeApp();
