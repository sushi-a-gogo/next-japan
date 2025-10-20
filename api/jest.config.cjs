/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {}, // disable Babel since you’re pure JS ESM
  verbose: true,
  roots: ["<rootDir>/routes"], // or wherever your tests live
};
