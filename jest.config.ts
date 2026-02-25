import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'components',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
      },
      moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server.test.js'],
    },
  ],
};

export default config;
