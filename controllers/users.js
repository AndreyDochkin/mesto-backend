require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequest = require('../errors/BadRequest ');
const NotFoundError = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');

const { signToken } = require('../utils/jwtAuth');

const MONGO_DUMPLICATE_KEY = 11000;

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((allUsers) => res.status(200).send({ data: allUsers }))
    .catch(next);
};

const getUser = (req, res, next, id) => {
  User.findById(id)
    .orFail(() => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Идентификатор пользователя невалидный'));
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  getUser(req, res, next, userId);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  getUser(req, res, next, _id);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Переданны невалидные данные'));
      }
      if (err.code === MONGO_DUMPLICATE_KEY) {
        next(new Conflict('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

const updateUser = (req, res, next, newData) => {
  const { user } = req;
  User.findByIdAndUpdate(user._id, newData, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы невалидные данные'));
      }
      next(err);
    });
};

const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  updateUser(req, res, next, { name, about });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUser(req, res, next, { avatar });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      next(new Unauthorized('Пользователь не найден'));
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, matched]) => {
      if (!matched) {
        return next(new Unauthorized('Неверный пароль'));
      }
      const token = signToken(user._id);
      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getCurrentUser,
  updateUserData,
  updateUserAvatar,
  loginUser,
};
