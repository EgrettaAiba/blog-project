export default {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js"
  ],
};
collectCoverageFrom: [
  "src/**/*.js",
  "!src/server.js",
  "!src/index.js",
  "!src/migrations/**",
  "!src/seeders/**",
  "!src/validators/**",
  "!src/cache/**",
  "!src/middleware/upload.js"
]
