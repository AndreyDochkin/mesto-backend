const { BAD_REQUEST } = require('../utils/status_codes');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequest';
    this.statusCode = BAD_REQUEST;
  }
}
module.exports = BadRequest;
