/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {},
  verbose: true,
  clearMocks: true,
  moduleFileExtensions: ["js", "json"],
  roots: ["<rootDir>/routes"],
  setupFilesAfterEnv: ["<rootDir>/setUpTests.js"],
};
