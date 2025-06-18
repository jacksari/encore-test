// jest.config.ts
import type { Config } from 'jest';

// import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;


// const config: Config = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testMatch: ['**/__tests__/**/*.spec.ts'],
// };

// export default config;
