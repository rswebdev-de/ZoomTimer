import React, { useState } from 'react';
import TimerComponent from './Timer';
import StopwatchComponent from './Stopwatch';
import zoomSDKService from '../services/ZoomSDKService';
import './App.css';

export const AppComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'stopwatch'>('timer');

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-row">
          <h1>Zoom Timer App</h1>
          <button
            className="close-btn"
            onClick={() => zoomSDKService.closeApp()}
            aria-label="Close app"
          >
            &times;
          </button>
        </div>
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            Timer
          </button>
          <button
            className={`tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setActiveTab('stopwatch')}
          >
            Stopwatch
          </button>
        </div>
      </div>

      <div className="app-content">
        {activeTab === 'timer' && <TimerComponent />}
        {activeTab === 'stopwatch' && <StopwatchComponent />}
      </div>
    </div>
  );
};

export default AppComponent;
