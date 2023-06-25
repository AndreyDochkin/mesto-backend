require('dotenv').config();

const {
  NODE_ENV,
  JWT_SECRET_PRODUCTION,
  PORT = '3000',
  MONGO_URI = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

const JWT_SECRET = NODE_ENV === 'production' ? JWT_SECRET_PRODUCTION : 'dev-secret';

module.exports = {
  JWT_SECRET,
  PORT,
  MONGO_URI,
};
