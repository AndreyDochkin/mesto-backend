require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequest = require('../errors/BadRequest ');
const UnhandledError = require('../errors/UnhandledError');
const NotFoundError = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');

const { signToken } = require('../utils/jwtAuth');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const MONGO_DUMPLICATE_KEY = 11000;

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((allUsers) => res.status(200).send({ data: allUsers }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequest('Идентификатор пользователя невалидный');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
};

const getUser = (req, res, next, id) => {
  User.findById(id)
    .orFail((err) => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequest('Идентификатор пользователя невалидный');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
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
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(200).send({
          name, about, avatar, email,
        }))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            throw new BadRequest('Переданны невалидные данные');
          }

          if (err.code === MONGO_DUMPLICATE_KEY) {
            throw new Conflict('Пользователь с таким email уже существует');
          }

          throw new UnhandledError('На сервере произошла ошибка');
        })
        .catch((err) => next(err));
    });
};

const updateUser = (req, res, next, newData) => {
  const { user } = req;
  User.findByIdAndUpdate(user._id, newData, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((updatedUser) => res.status(200).send({ data: updatedUser }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        throw new BadRequest('Переданы невалидные данные');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
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
        next(new Unauthorized('Неверный пароль'));
      }
      // const token = signToken(user._id);
      const token = jwt.sign({ _id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {

      res.status(500).send({
        message: 'ЛОГИН ОШИБКА ',
        error: err.message,
        stack: err.stack,
      });

      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequest('Переданны невалидные данные');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
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
