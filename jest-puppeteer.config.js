module.exports = {
  launch: {
    headless: true,
  },
  server: {
    launchTimeout: 30000,
    command: "PORT=19292 NODE_ENV=test npm start",
    port: 19292,
  },
};
