module.exports = {
  launch: {
    headless: true,
  },
  server: {
    launchTimeout: 10000,
    command: "npm run build; PORT=19292 NODE_ENV=test npm start",
    port: 19292,
  },
};
