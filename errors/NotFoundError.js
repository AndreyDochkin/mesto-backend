const { NOT_FOUND } = require('../utils/status_codes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = NOT_FOUND;
  }
}
module.exports = NotFoundError;
