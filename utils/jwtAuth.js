require('dotenv').config();

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const checkToken = (token) => jwt.verify(token, JWT_SECRET);

const signToken = (id) => jwt.sign({ _id: id }, JWT_SECRET, { expiresIn: '7d' });

module.exports = {
  checkToken,
  signToken,
};
