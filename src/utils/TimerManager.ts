/**
 * TimerManager - Manages timer state and logic
 */

export type TimerState = 'idle' | 'running' | 'paused';

export interface TimerSettings {
  hours: number;
  minutes: number;
  seconds: number;
  soundEnabled: boolean;
  showToAll: boolean;
}

export interface TimerStatus {
  state: TimerState;
  remainingSeconds: number;
  totalSeconds: number;
  displayText: string;
}

export class TimerManager {
  private state: TimerState = 'idle';
  private remainingSeconds: number = 0;
  private totalSeconds: number = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private onTickCallback: ((status: TimerStatus) => void) | null = null;
  private onCompleteCallback: ((settings: TimerSettings) => void) | null = null;

  /**
   * Initialize timer with hours, minutes, seconds
   */
  public init(hours: number, minutes: number, seconds: number): void {
    if (this.state === 'running') {
      this.stop();
    }

    this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
    this.remainingSeconds = this.totalSeconds;
    this.state = 'idle';
    this.notifyTick();
  }

  /**
   * Start the timer
   */
  public start(): void {
    if (this.state === 'running') return;
    if (this.remainingSeconds <= 0) return;

    this.state = 'running';
    this.tick();
  }

  /**
   * Pause the timer
   */
  public pause(): void {
    if (this.state !== 'running') return;
    this.state = 'paused';
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Resume the timer
   */
  public resume(): void {
    if (this.state !== 'paused') return;
    this.state = 'running';
    this.tick();
  }

  /**
   * Stop/Cancel the timer
   */
  public stop(): void {
    this.state = 'idle';
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.remainingSeconds = 0;
    this.notifyTick();
  }

  /**
   * Reset timer to initial values
   */
  public reset(hours: number, minutes: number, seconds: number): void {
    this.stop();
    this.init(hours, minutes, seconds);
  }

  /**
   * Add time to the timer (in seconds)
   */
  public addTime(seconds: number): void {
    if (this.remainingSeconds + seconds >= 0) {
      this.remainingSeconds += seconds;
      this.totalSeconds += seconds;
      this.notifyTick();
    }
  }

  /**
   * Subtract time from the timer (in seconds)
   */
  public subtractTime(seconds: number): void {
    if (this.remainingSeconds - seconds >= 0) {
      this.remainingSeconds -= seconds;
      this.totalSeconds -= seconds;
      this.notifyTick();
    }
  }

  /**
   * Get current timer status
   */
  public getStatus(): TimerStatus {
    return {
      state: this.state,
      remainingSeconds: this.remainingSeconds,
      totalSeconds: this.totalSeconds,
      displayText: this.formatTime(this.remainingSeconds),
    };
  }

  /**
   * Set callback for timer tick
   */
  public onTick(callback: (status: TimerStatus) => void): void {
    this.onTickCallback = callback;
  }

  /**
   * Set callback for timer completion
   */
  public onComplete(callback: (settings: TimerSettings) => void): void {
    this.onCompleteCallback = callback;
  }

  /**
   * Format seconds to HH:MM:SS
   */
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map((val) => String(val).padStart(2, '0'))
      .join(':');
  }

  /**
   * Internal tick handler
   */
  private tick(): void {
    this.intervalId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.notifyTick();
      } else {
        this.complete();
      }
    }, 1000);
  }

  /**
   * Notify tick callback
   */
  private notifyTick(): void {
    const status = this.getStatus();
    if (this.onTickCallback) {
      this.onTickCallback(status);
    }
  }

  /**
   * Handle timer completion
   */
  private complete(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.state = 'idle';
    this.notifyTick();

    // Trigger completion callback
    if (this.onCompleteCallback) {
      this.onCompleteCallback({
        hours: 0,
        minutes: 0,
        seconds: 0,
        soundEnabled: false,
        showToAll: false,
      });
    }
  }
}

export default TimerManager;
