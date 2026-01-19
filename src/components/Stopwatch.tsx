import React, { useState, useEffect } from 'react';
import StopwatchManager, { StopwatchStatus } from '../utils/StopwatchManager';
import './Stopwatch.css';

interface StopwatchComponentProps {
  onComplete?: () => void;
}

export const StopwatchComponent: React.FC<StopwatchComponentProps> = ({
  onComplete,
}) => {
  const [stopwatchManager] = useState(() => new StopwatchManager());
  const [status, setStatus] = useState<StopwatchStatus | null>(null);

  useEffect(() => {
    stopwatchManager.onTick((status) => {
      setStatus(status);
    });

    setStatus(stopwatchManager.getStatus());

    return () => {
      stopwatchManager.reset();
    };
  }, []);

  const handleStart = () => {
    if (status?.state === 'idle' || status?.state === 'paused') {
      if (status.state === 'idle') {
        stopwatchManager.reset();
        stopwatchManager.start();
      } else {
        stopwatchManager.resume();
      }
    } else {
      stopwatchManager.start();
    }
  };

  const handlePause = () => {
    stopwatchManager.pause();
  };

  const handleReset = () => {
    stopwatchManager.reset();
  };

  const isRunning = status?.state === 'running';
  const isPaused = status?.state === 'paused';

  return (
    <div className="stopwatch-container">
      <h2>Stopwatch</h2>

      <div className="stopwatch-display">
        <div className="large-stopwatch-display">
          {status?.displayText || '00:00:00'}
        </div>
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
      </div>
    </div>
  );
};

export default StopwatchComponent;
