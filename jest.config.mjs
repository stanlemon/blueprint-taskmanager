import config from "@stanlemon/webdev/jest.config.js";

config.collectCoverageFrom = ["src/**/*.{js,jsx}", "web/js/**/*.{js,jsx}"];
config.coveragePathIgnorePatterns = [
  "/node_modules/",
  "/src/db/migrations/",
  "/web/js/components/elements/",
];

export default config;
