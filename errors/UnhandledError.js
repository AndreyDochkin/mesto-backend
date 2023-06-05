const { UNHANDLED_ERROR } = require('../utils/status_codes');

class UnhandledError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnhandledError';
    this.statusCode = UNHANDLED_ERROR;
  }
}
module.exports = UnhandledError;
