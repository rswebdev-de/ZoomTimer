/**
 * StopwatchManager - Manages stopwatch functionality
 */

export type StopwatchState = 'idle' | 'running' | 'paused';

export interface StopwatchStatus {
  state: StopwatchState;
  elapsedSeconds: number;
  displayText: string;
}

export class StopwatchManager {
  private state: StopwatchState = 'idle';
  private elapsedSeconds: number = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private onTickCallback: ((status: StopwatchStatus) => void) | null = null;

  /**
   * Start the stopwatch
   */
  public start(): void {
    if (this.state === 'running') return;

    this.state = 'running';
    this.tick();
  }

  /**
   * Pause the stopwatch
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
   * Resume the stopwatch
   */
  public resume(): void {
    if (this.state !== 'paused') return;

    this.state = 'running';
    this.tick();
  }

  /**
   * Reset the stopwatch
   */
  public reset(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.state = 'idle';
    this.elapsedSeconds = 0;
    this.notifyTick();
  }

  /**
   * Get current stopwatch status
   */
  public getStatus(): StopwatchStatus {
    return {
      state: this.state,
      elapsedSeconds: this.elapsedSeconds,
      displayText: this.formatTime(this.elapsedSeconds),
    };
  }

  /**
   * Set callback for stopwatch tick
   */
  public onTick(callback: (status: StopwatchStatus) => void): void {
    this.onTickCallback = callback;
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
      this.elapsedSeconds++;
      this.notifyTick();
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
}

export default StopwatchManager;
