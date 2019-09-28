module.exports = class InvalidArgument extends Error {
  constructor(key, message) {
    super(message);
    this.key = key;
    Error.captureStackTrace(this, InvalidArgument);
  }
};
