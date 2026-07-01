const zoomSdk = {
  config: jest.fn().mockResolvedValue({ version: '0.16' }),
  setDynamicIndicator: jest.fn().mockResolvedValue({}),
  removeDynamicIndicator: jest.fn().mockResolvedValue({}),
  getDynamicIndicator: jest.fn().mockResolvedValue(null),
  setVirtualForeground: jest.fn().mockResolvedValue({ imageId: 'mock-id' }),
  removeVirtualForeground: jest.fn().mockResolvedValue({}),
  getMeetingContext: jest.fn().mockResolvedValue({}),
  getUserContext: jest.fn().mockResolvedValue({}),
  onMyMediaChange: jest.fn(),
  closeApp: jest.fn().mockResolvedValue({}),
  showNotification: jest.fn().mockResolvedValue({}),
  postMessage: jest.fn().mockResolvedValue({ message: 'Success' }),
  onMessage: jest.fn(),
};

export default zoomSdk;
