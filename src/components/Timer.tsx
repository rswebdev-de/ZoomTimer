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
  const [soundToAll, setSoundToAll] = useState(false);
  const [preWarning, setPreWarning] = useState(false);

  // Use refs to avoid stale closures in callbacks
  const soundEnabledRef = useRef(soundEnabled);
  const showToAllRef = useRef(showToAll);
  const soundToAllRef = useRef(soundToAll);
  const preWarningRef = useRef(preWarning);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    showToAllRef.current = showToAll;
  }, [showToAll]);

  useEffect(() => {
    soundToAllRef.current = soundToAll;
  }, [soundToAll]);

  useEffect(() => {
    preWarningRef.current = preWarning;
  }, [preWarning]);

  useEffect(() => {
    timerManager.init(hours, minutes, seconds);

    timerManager.onTick((status) => {
      setStatus(status);
      if (status?.state === 'running') {
        zoomSDKService.setDynamicIndicator(status.displayText);
        if (showToAllRef.current) {
          zoomSDKService.setVirtualForeground(
            createTimerImageData(status.displayText)
          );
        } else {
          zoomSDKService.removeVirtualForeground();
        }
      } else if (status?.state === 'idle') {
        zoomSDKService.removeDynamicIndicator();
        if (showToAllRef.current) {
          zoomSDKService.removeVirtualForeground();
        }
      }
    });

    timerManager.onComplete(() => {
      if (soundEnabledRef.current) {
        playAudio();
      }
      if (soundToAllRef.current) {
        zoomSDKService.postMessage({ type: 'alarm' });
      }
      zoomSDKService.removeDynamicIndicator();
      if (showToAllRef.current) {
        zoomSDKService.removeVirtualForeground();
      }
      if (onComplete) {
        onComplete();
      }
    });

    timerManager.onWarning(() => {
      if (preWarningRef.current) {
        if (soundEnabledRef.current) {
          playWarningAudio();
        }
        if (soundToAllRef.current) {
          zoomSDKService.postMessage({ type: 'warning' });
        }
      }
    });

    zoomSDKService.onMessage((event) => {
      const type = (event.payload as { type?: string }).type;
      if (type === 'alarm') {
        playAudio();
      } else if (type === 'warning') {
        playWarningAudio();
      }
    });

    // Browsers suspend AudioContext until a user gesture occurs inside this
    // document. Participants who never click anything in the panel would
    // otherwise have their alarm silently swallowed, so unlock it eagerly.
    const unlockAudioContext = () => {
      getAudioContext().resume().catch(() => undefined);
    };
    document.addEventListener('pointerdown', unlockAudioContext);
    document.addEventListener('keydown', unlockAudioContext);

    return () => {
      timerManager.stop();
      document.removeEventListener('pointerdown', unlockAudioContext);
      document.removeEventListener('keydown', unlockAudioContext);
    };
  }, []);

  const getAudioContext = (): AudioContext => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

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
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const playAudio = () => {
    try {
      const audioContext = getAudioContext();
      // A message-triggered play has no gesture of its own; resume in case the
      // earlier unlock listener hasn't fired yet on this participant's page.
      audioContext.resume().catch(() => undefined);
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

  const playWarningAudio = () => {
    try {
      const audioContext = getAudioContext();
      audioContext.resume().catch(() => undefined);
      for (let i = 0; i < 2; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        const beepStart = audioContext.currentTime + i * 0.35;
        gainNode.gain.setValueAtTime(0.2, beepStart);
        gainNode.gain.exponentialRampToValueAtTime(0.01, beepStart + 0.25);
        oscillator.start(beepStart);
        oscillator.stop(beepStart + 0.25);
      }
    } catch (error) {
      console.error('Failed to play warning audio:', error);
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

  return (
    <div className="timer-container">
      <h2>Timer</h2>

      <div className="timer-display">
        <div className="time-input">
          <div className="time-unit">
            <button
              onClick={() => handleHourChange(1)}
              className="increment-btn"
              disabled={status?.state === 'running'}
            >
              ▲
            </button>
            <input
              type="text"
              min="0"
              value={String(hours).padStart(2, '0')}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                setHours(val);
                timerManager.init(val, minutes, seconds);
              }}
              disabled={status?.state === 'running'}
              className="time-input-field"
            />
            <button
              onClick={() => handleHourChange(-1)}
              className="decrement-btn"
              disabled={status?.state === 'running'}
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
              disabled={status?.state === 'running'}
            >
              ▲
            </button>
            <input
              type="text"
              min="0"
              max="59"
              value={String(minutes).padStart(2, '0')}
              onChange={(e) => {
                const val = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
                setMinutes(val);
                timerManager.init(hours, val, seconds);
              }}
              disabled={status?.state === 'running'}
              className="time-input-field"
            />
            <button
              onClick={() => handleMinuteChange(-1)}
              className="decrement-btn"
              disabled={status?.state === 'running'}
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
              disabled={status?.state === 'running'}
            >
              ▲
            </button>
            <input
              type="text"
              min="0"
              max="59"
              value={String(seconds).padStart(2, '0')}
              onChange={(e) => {
                const val = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
                setSeconds(val);
                timerManager.init(hours, minutes, val);
              }}
              disabled={status?.state === 'running'}
              className="time-input-field"
            />
            <button
              onClick={() => handleSecondChange(-1)}
              className="decrement-btn"
              disabled={status?.state === 'running'}
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
            disabled={status?.state === 'running'}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="controls">
        {status?.state !== 'running' ? (
          <button onClick={handleStart} className="btn btn-primary">
            {status?.state === 'paused' ? 'Resume' : 'Start'}
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

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={soundToAll}
            onChange={(e) => setSoundToAll(e.target.checked)}
          />
          <span>Sound alarm to participants</span>
        </label>
        {soundToAll && (
          <p className="option-hint">
            Only participants who have this app open will hear the alarm.
          </p>
        )}

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={preWarning}
            onChange={(e) => setPreWarning(e.target.checked)}
          />
          <span>30-second pre-warning</span>
        </label>
      </div>
    </div>
  );
};

export default TimerComponent;
