module.exports = {
  launch: {
    //headless: false,
  },
  server: {
    command: "PORT=19292 NODE_ENV=test node server.js",
    port: 19292,
  },
};
