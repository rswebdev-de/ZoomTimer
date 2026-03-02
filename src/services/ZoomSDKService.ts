/**
 * ZoomSDKService - Integration with Zoom Apps SDK
 * Refactored according to official Zoom SDK documentation
 */

import zoomSdk, { DynamicIndicatorOptions } from '@zoom/appssdk';

export class ZoomSDKService {
  private initialized: boolean = false;

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
          'getDynamicIndicator',
          'setVirtualForeground',
          'removeVirtualForeground',
          'getMeetingContext',
          'getUserContext',
          'onMyMediaChange',
          'closeApp',
          'showNotification',
        ],
      });

      console.log('Zoom SDK configured successfully:', configResponse);
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
   * Get current dynamic indicator
   */
  public async getDynamicIndicator(): Promise<any> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return null;
    }

    try {
      const indicator = await zoomSdk.getDynamicIndicator();
      return indicator;
    } catch (error) {
      console.error('Failed to get dynamic indicator:', error);
      return null;
    }
  }

  /**
   * Listen to media changes (video on/off, audio muted/unmuted)
   */
  public onMediaChange(callback: (event: any) => void): void {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      zoomSdk.onMyMediaChange((event: any) => {
        console.log('Media changed:', event);
        callback(event);
      });
    } catch (error) {
      console.error('Failed to setup media change listener:', error);
    }
  }

  /**
   * Get meeting context
   */
  public async getMeetingContext(): Promise<any> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return null;
    }

    try {
      const context = await zoomSdk.getMeetingContext();
      return context;
    } catch (error) {
      console.error('Failed to get meeting context:', error);
      return null;
    }
  }

  /**
   * Get user context
   */
  public async getUserContext(): Promise<any> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return null;
    }

    try {
      const context = await zoomSdk.getUserContext();
      return context;
    } catch (error) {
      console.error('Failed to get user context:', error);
      return null;
    }
  }

  /**
   * Show notification to user
   */
  public async showNotification(options: {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
  }): Promise<void> {
    if (!this.initialized) {
      console.warn('Zoom SDK not initialized');
      return;
    }

    try {
      await (zoomSdk as any).showNotification(options);
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
      await zoomSdk.closeApp();
      console.log('App closed');
    } catch (error) {
      console.error('Failed to close app:', error);
    }
  }
}

export default new ZoomSDKService();
