const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/', '<rootDir>/src/'],
  testMatch: [
    '**/test/**/**.ts',
    '!**/test/server.ts',
    '!**/test/setup.ts',
    '!**/test/**/endpoint.ts',
    '!**/test/utils.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  globalSetup: '<rootDir>/test/setup.ts',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/**.ts',
    '!**/src/index.ts',
    '!**/src/passport/**.ts',
    '!**/src/router/auth/google.ts',
    '!**/src/router/auth/utils.ts',
    '!**/src/router/file/utils.ts',
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
