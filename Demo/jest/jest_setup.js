

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// expo-media-library mock
jest.mock('expo-media-library', () => ({
requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true, accessPrivileges: 'all', canAskAgain: true })),
getAssetsAsync: jest.fn(() => Promise.resolve({ assets: [] })),
getAssetInfoAsync: jest.fn(() => Promise.resolve({})),
}));