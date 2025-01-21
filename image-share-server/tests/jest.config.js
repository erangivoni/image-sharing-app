module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest', // Process .ts files with ts-jest
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts$', // Look for .test.ts or .spec.ts files
};
