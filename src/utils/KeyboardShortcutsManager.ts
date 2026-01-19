/**
 * KeyboardShortcutsManager - Handles keyboard shortcuts for timer app
 */

export type KeyboardCallback = (action: string) => void;

export class KeyboardShortcutsManager {
  private listeners: Map<string, Set<KeyboardCallback>> = new Map();
  private registered: boolean = false;

  /**
   * Register keyboard event listener
   */
  public register(): void {
    if (this.registered) return;

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.registered = true;
  }

  /**
   * Unregister keyboard event listener
   */
  public unregister(): void {
    if (!this.registered) return;

    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.registered = false;
  }

  /**
   * Subscribe to a keyboard action
   */
  public on(action: string, callback: KeyboardCallback): void {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Set());
    }
    this.listeners.get(action)!.add(callback);
  }

  /**
   * Unsubscribe from a keyboard action
   */
  public off(action: string, callback: KeyboardCallback): void {
    if (this.listeners.has(action)) {
      this.listeners.get(action)!.delete(callback);
    }
  }

  /**
   * Handle keyboard events
   *
   * Keyboard Shortcuts:
   * - Enter (Windows) or Return (macOS): Start, pause, and resume
   * - Esc: Cancel timer
   * - Up arrow: Add time
   * - Down arrow: Remove time
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const { code, key } = event;

    // Start/Pause/Resume: Enter or Return
    if (code === 'Enter' || key === 'Return') {
      event.preventDefault();
      this.notify('togglePlayPause');
    }

    // Cancel: Escape
    if (code === 'Escape' || key === 'Escape') {
      event.preventDefault();
      this.notify('cancel');
    }

    // Add time: Up arrow
    if (code === 'ArrowUp') {
      event.preventDefault();
      this.notify('addTime');
    }

    // Remove time: Down arrow
    if (code === 'ArrowDown') {
      event.preventDefault();
      this.notify('subtractTime');
    }
  }

  /**
   * Notify all listeners for an action
   */
  private notify(action: string): void {
    if (this.listeners.has(action)) {
      this.listeners.get(action)!.forEach((callback) => {
        callback(action);
      });
    }
  }
}

export default KeyboardShortcutsManager;
