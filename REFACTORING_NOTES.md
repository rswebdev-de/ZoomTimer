# Zoom SDK Refactoring Notes

## Overview
The `ZoomSDKService` has been refactored to align with the official Zoom Apps SDK documentation (v0.16.36).

## Key Changes

### 1. SDK Initialization
**Before:**
```typescript
const { ZoomApp } = await import('@zoom/appssdk');
this.zoomApp = new ZoomApp();
```

**After:**
```typescript
import zoomSdk from '@zoom/appssdk';

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
```

**Reason:** The official SDK requires calling `zoomSdk.config()` to declare and authorize all capabilities before using any APIs.

### 2. Virtual Foreground
**Before:**
```typescript
await this.zoomApp.setVirtualForeground({ imageUrl: imageUrl });
```

**After:**
```typescript
await zoomSdk.setVirtualForeground({ imageData: imageData });
```

**Reason:** The official API expects an `ImageData` object (from Canvas API), not a URL. This provides better control over the image rendering.

**Return Value:** Now returns an `imageId` string that uniquely identifies the image for future reference.

### 3. Dynamic Indicator
**Before:**
```typescript
await this.zoomApp.setDynamicIndicator({ label: displayText, color: '#1C73E8' });
```

**After:**
```typescript
await zoomSdk.setDynamicIndicator({ 
  label: displayText, 
  color: '#1C73E8',
  ttl: ttl // optional time-to-live
});
```

**Reason:** The new API supports optional TTL (time-to-live) parameter for indicator expiration.

### 4. Removing Dynamic Indicator
**Before:**
```typescript
await this.zoomApp.setDynamicIndicator({ label: '' });
```

**After:**
```typescript
await zoomSdk.removeDynamicIndicator();
```

**Reason:** Dedicated method for removing indicators is more explicit and cleaner.

### 5. New Methods Added
- `getDynamicIndicator()` - Get current indicator state
- `getUserContext()` - Get user information
- `showNotification()` - Display notifications to user
- Proper TTL support on `setDynamicIndicator()`

### 6. Class Structure Simplification
- Removed `getApp()` method (no longer needed)
- Simplified internal state management
- Removed need for storing `zoomApp` instance

## API Compatibility

### Capabilities Declaration
All APIs used must be declared in the `config()` capabilities array:

```typescript
capabilities: [
  'setDynamicIndicator',      // Set meeting indicator
  'removeDynamicIndicator',   // Remove indicator
  'getDynamicIndicator',      // Get current indicator
  'setVirtualForeground',     // Set video overlay
  'removeVirtualForeground',  // Remove video overlay
  'getMeetingContext',        // Get meeting info
  'getUserContext',           // Get user info
  'onMyMediaChange',          // Listen to media changes
  'closeApp',                 // Close application
  'showNotification',         // Show notifications
]
```

## Error Handling
- All methods check `isInitialized()` before execution
- Comprehensive error logging for debugging
- Graceful degradation on SDK unavailability

## Usage Example
```typescript
// Initialize
const zoomSDKService = new ZoomSDKService();
await zoomSDKService.initialize();

// Use APIs
await zoomSDKService.setDynamicIndicator('Timer: 5:30', 600); // 10-minute TTL
await zoomSDKService.showNotification({
  type: 'success',
  title: 'Timer',
  message: 'Time is up!'
});
```

## Testing Recommendations
1. Verify SDK initialization with proper capabilities
2. Test dynamic indicator display in actual meeting
3. Test virtual foreground with Canvas-generated ImageData
4. Test event listeners for media changes
5. Verify error handling when SDK is unavailable

## Resources
- [Official Zoom SDK Documentation](https://appssdk.zoom.us/classes/ZoomSdk.ZoomSdk.html)
- [Zoom Apps Development Guide](https://developers.zoom.us/docs/zoom-apps/)
- [Release Notes](https://github.com/zoom/appssdk/releases)

## Migration Status
✅ All method signatures updated  
✅ Type safety maintained  
✅ Error handling improved  
✅ Documentation updated  
⚠️  Components using `setVirtualForeground()` may need ImageData conversion logic  
