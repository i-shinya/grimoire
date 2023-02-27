/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  moduleDirectories: ["dist", "node_modules", "../node_modules"],
};
