/**
 * ZoomSDKService - Integration with Zoom Apps SDK
 * Refactored according to official Zoom SDK documentation
 */

import zoomSdk, { DynamicIndicatorOptions, JSONObject, RunningContext } from '@zoom/appssdk';

export class ZoomSDKService {
  private initialized: boolean = false;
  private runningContext: RunningContext | null = null;

  /**
   * Initialize and configure Zoom SDK
   * Must be called before using any other SDK methods
   */
  public async initialize(): Promise<void> {
    try {
      const configResponse = await zoomSdk.config({
        version: '0.16',
        capabilities: [
          'setDynamicIndicator',
          'removeDynamicIndicator',
          'setVirtualForeground',
          'removeVirtualForeground',
          'closeApp',
          'showNotification',
          'postMessage',
          'onMessage',
        ],
      });

      this.runningContext = configResponse.runningContext;
      if (configResponse.unsupportedApis.length > 0) {
        console.warn('Unsupported APIs in this Zoom client version:', configResponse.unsupportedApis);
      }
      console.log('Zoom SDK configured successfully. Running context:', this.runningContext);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Zoom SDK:', error);
      throw error;
    }
  }

  /**
   * Check if SDK is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the running context returned by config() (e.g. 'inMeeting', 'inMainClient').
   */
  public getRunningContext(): RunningContext | null {
    return this.runningContext;
  }

  /**
   * Returns true when the app is running inside an active meeting or immersive view.
   * In-meeting-only capabilities (setDynamicIndicator, setVirtualForeground) should
   * be guarded with this check.
   */
  public isInMeeting(): boolean {
    return this.runningContext === 'inMeeting' || this.runningContext === 'inImmersive';
  }

  /**
   * Set virtual foreground image
   * @param imageData - ImageData object to display as foreground
   */
  public async setVirtualForeground(imageData: ImageData): Promise<string | null> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return null;
    }

    try {
      const response = await zoomSdk.setVirtualForeground({
        imageData: imageData,
      });
      console.log('Virtual foreground set with ID:', (response as any).imageId);
      return (response as any).imageId;
    } catch (error) {
      console.error('Failed to set virtual foreground:', error);
      return null;
    }
  }

  /**
   * Remove virtual foreground
   */
  public async removeVirtualForeground(): Promise<void> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      await zoomSdk.removeVirtualForeground();
      console.log('Virtual foreground removed');
    } catch (error) {
      console.error('Failed to remove virtual foreground:', error);
    }
  }

  /**
   * Set dynamic indicator (timer display in meeting)
   * @param displayText - Text to display as indicator
   */
  public async setDynamicIndicator(
    displayText: string,
  ): Promise<void> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      const options: DynamicIndicatorOptions = {
        text: displayText,
        textColor: '#1C73E8',
      };
      await zoomSdk.setDynamicIndicator(options);
      console.log('Dynamic indicator set:', displayText);
    } catch (error) {
      console.error('Failed to set dynamic indicator:', error);
    }
  }

  /**
   * Remove dynamic indicator
   */
  public async removeDynamicIndicator(): Promise<void> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      await zoomSdk.removeDynamicIndicator();
      console.log('Dynamic indicator removed');
    } catch (error) {
      console.error('Failed to remove dynamic indicator:', error);
    }
  }

  /**
   * Broadcast a message to all participants who have the app open.
   * Participants receive it via the onMessage event.
   */
  public async postMessage(payload: JSONObject): Promise<void> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      await zoomSdk.postMessage(payload);
    } catch (error) {
      console.error('Failed to post message:', error);
    }
  }

  /**
   * Listen for messages broadcast from the host app instance.
   */
  public onMessage(callback: (event: { timestamp: number; payload: JSONObject }) => void): void {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      zoomSdk.onMessage(callback);
    } catch (error) {
      console.error('Failed to register message listener:', error);
    }
  }

  /**
   * Show notification to user.
   * Note: The SDK's NotificationOptions type has a declaration conflict in its
   * .d.ts file; the narrow cast here is intentional and safe.
   */
  public async showNotification(options: {
    type: 'info' | 'warning' | 'error';
    title: string;
    message: string;
  }): Promise<void> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      await (zoomSdk.showNotification as unknown as (o: typeof options) => Promise<void>)(options);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  /**
   * Close app
   */
  public async closeApp(): Promise<void> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      await zoomSdk.removeDynamicIndicator();
      await zoomSdk.removeVirtualForeground();
      await zoomSdk.closeApp();
      console.log('App closed');
    } catch (error) {
      console.error('Failed to close app:', error);
    }
  }
}

export default new ZoomSDKService();
