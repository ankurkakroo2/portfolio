module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.module\\.sass$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { configFile: './babel.jest.config.js' }],
  },
}
