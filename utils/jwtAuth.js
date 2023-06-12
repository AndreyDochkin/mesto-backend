require('dotenv').config();

const jwt = require('jsonwebtoken');

const checkToken = (token) => jwt.verify(token, `${process.env.JWT_SECRET}`);

const signToken = (id) => jwt.sign({ _id: id }, `${process.env.JWT_SECRET}`, { expiresIn: '7d' });

const decodeToken = (token) => jwt.decode(token, `${process.env.JWT_SECRET}`);

module.exports = {
  checkToken,
  signToken,
  decodeToken,
};
