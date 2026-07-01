import React from 'react';
import ReactDOM from 'react-dom/client';
import AppComponent from './components/App';
import zoomSDKService from './services/ZoomSDKService';
import './index.css';

// Zoom Apps SDK may hang without throwing when opened outside the Zoom client.
// Race against a 3-second timeout so the app always renders (browser preview mode).
const BROWSER_PREVIEW_TIMEOUT_MS = 3000;

async function initializeApp() {
  const timeoutPromise = new Promise<void>((_, reject) =>
    setTimeout(
      () => reject(new Error('Zoom SDK initialization timed out — running in browser preview mode')),
      BROWSER_PREVIEW_TIMEOUT_MS,
    ),
  );

  try {
    await Promise.race([zoomSDKService.initialize(), timeoutPromise]);
    console.log('Zoom SDK initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize Zoom SDK:', error);
    // App renders without SDK — features requiring an active meeting are no-ops
  }

  // Render React app
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<React.StrictMode><AppComponent /></React.StrictMode>);
}

// Start the app
initializeApp();
