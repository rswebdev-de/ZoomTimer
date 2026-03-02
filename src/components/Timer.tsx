import React, { useState, useEffect, useRef } from 'react';
import TimerManager, { TimerStatus } from '../utils/TimerManager';
import zoomSDKService from '../services/ZoomSDKService';
import './Timer.css';

export const PRESET_TIMERS = [
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
  { label: '1 hour', seconds: 3600 },
];

interface TimerComponentProps {
  onComplete?: () => void;
}

export const TimerComponent: React.FC<TimerComponentProps> = ({ onComplete }) => {
  const [timerManager] = useState(() => new TimerManager());
  const [status, setStatus] = useState<TimerStatus | null>(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showToAll, setShowToAll] = useState(false);

  // Use refs to avoid stale closures in callbacks
  const soundEnabledRef = useRef(soundEnabled);
  const showToAllRef = useRef(showToAll);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    showToAllRef.current = showToAll;
  }, [showToAll]);

  useEffect(() => {
    timerManager.init(hours, minutes, seconds);

    timerManager.onTick((status) => {
      setStatus(status);
      if (status.state === 'running') {
        zoomSDKService.setDynamicIndicator(status.displayText);
        if (showToAllRef.current) {
          zoomSDKService.setVirtualForeground(
            createTimerImageData(status.displayText)
          );
        }
      }
    });

    timerManager.onComplete(() => {
      if (soundEnabledRef.current) {
        playAudio();
      }
      zoomSDKService.removeDynamicIndicator();
      if (showToAllRef.current) {
        zoomSDKService.removeVirtualForeground();
      }
      if (onComplete) {
        onComplete();
      }
    });

    return () => {
      timerManager.stop();
    };
  }, []);

  const createTimerImageData = (displayText: string): ImageData => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.roundRect(0, 0, canvas.width, canvas.height, 8);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const playAudio = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  const handleStart = () => {
    if (status?.state === 'idle') {
      timerManager.init(hours, minutes, seconds);
    }
    if (status?.state === 'paused') {
      timerManager.resume();
    } else {
      timerManager.start();
    }
  };

  const handlePause = () => {
    timerManager.pause();
  };

  const handleReset = () => {
    timerManager.reset(hours, minutes, seconds);
  };

  const handleCancel = () => {
    timerManager.stop();
    zoomSDKService.removeDynamicIndicator();
    if (showToAllRef.current) {
      zoomSDKService.removeVirtualForeground();
    }
  };

  const handlePreset = (presetSeconds: number) => {
    const h = Math.floor(presetSeconds / 3600);
    const m = Math.floor((presetSeconds % 3600) / 60);
    const s = presetSeconds % 60;

    setHours(h);
    setMinutes(m);
    setSeconds(s);
    timerManager.init(h, m, s);
  };

  const handleHourChange = (delta: number) => {
    const newHours = Math.max(0, hours + delta);
    setHours(newHours);
    timerManager.init(newHours, minutes, seconds);
  };

  const handleMinuteChange = (delta: number) => {
    const newMinutes = Math.max(0, Math.min(59, minutes + delta));
    setMinutes(newMinutes);
    timerManager.init(hours, newMinutes, seconds);
  };

  const handleSecondChange = (delta: number) => {
    const newSeconds = Math.max(0, Math.min(59, seconds + delta));
    setSeconds(newSeconds);
    timerManager.init(hours, minutes, newSeconds);
  };

  const isRunning = status?.state === 'running';
  const isPaused = status?.state === 'paused';

  return (
    <div className="timer-container">
      <h2>Timer</h2>

      <div className="timer-display">
        <div className="time-input">
          <div className="time-unit">
            <button
              onClick={() => handleHourChange(1)}
              className="increment-btn"
              disabled={isRunning}
            >
              ▲
            </button>
            <input
              type="number"
              value={String(hours).padStart(2, '0')}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                setHours(val);
                timerManager.init(val, minutes, seconds);
              }}
              disabled={isRunning}
              className="time-input-field"
            />
            <button
              onClick={() => handleHourChange(-1)}
              className="decrement-btn"
              disabled={isRunning}
            >
              ▼
            </button>
            <label>Hours</label>
          </div>

          <div className="separator">:</div>

          <div className="time-unit">
            <button
              onClick={() => handleMinuteChange(1)}
              className="increment-btn"
              disabled={isRunning}
            >
              ▲
            </button>
            <input
              type="number"
              value={String(minutes).padStart(2, '0')}
              onChange={(e) => {
                const val = Math.min(59, parseInt(e.target.value, 10) || 0);
                setMinutes(val);
                timerManager.init(hours, val, seconds);
              }}
              disabled={isRunning}
              className="time-input-field"
            />
            <button
              onClick={() => handleMinuteChange(-1)}
              className="decrement-btn"
              disabled={isRunning}
            >
              ▼
            </button>
            <label>Minutes</label>
          </div>

          <div className="separator">:</div>

          <div className="time-unit">
            <button
              onClick={() => handleSecondChange(1)}
              className="increment-btn"
              disabled={isRunning}
            >
              ▲
            </button>
            <input
              type="number"
              value={String(seconds).padStart(2, '0')}
              onChange={(e) => {
                const val = Math.min(59, parseInt(e.target.value, 10) || 0);
                setSeconds(val);
                timerManager.init(hours, minutes, val);
              }}
              disabled={isRunning}
              className="time-input-field"
            />
            <button
              onClick={() => handleSecondChange(-1)}
              className="decrement-btn"
              disabled={isRunning}
            >
              ▼
            </button>
            <label>Seconds</label>
          </div>
        </div>

        <div className="large-timer-display">{status?.displayText || '00:00:00'}</div>
      </div>

      <div className="preset-buttons">
        {PRESET_TIMERS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset.seconds)}
            className="preset-btn"
            disabled={isRunning}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="controls">
        {!isRunning ? (
          <button onClick={handleStart} className="btn btn-primary">
            {isPaused ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button onClick={handlePause} className="btn btn-secondary">
            Pause
          </button>
        )}
        <button onClick={handleReset} className="btn btn-secondary">
          Reset
        </button>
        <button onClick={handleCancel} className="btn btn-danger">
          Cancel
        </button>
      </div>

      <div className="options">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
          <span>Audio alarm</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showToAll}
            onChange={(e) => setShowToAll(e.target.checked)}
          />
          <span>Show timer to all</span>
        </label>
      </div>
    </div>
  );
};

export default TimerComponent;
