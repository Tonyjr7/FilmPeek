export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'services/**/*.js',
    'models/**/*.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
  forceExit: true,
  detectOpenHandles: true,
};
