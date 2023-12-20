const mongoose = require('mongoose');
const { isURL, isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'User',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'User description',
  },
  avatar: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
    validate: {
      validator: isURL,
      message: 'Invalid avatar URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
