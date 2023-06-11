require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest ');
const UnhandledError = require('../errors/UnhandledError');
const NotFoundError = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');

const MONGO_DUMPLICATE_KEY = 11000;

const { JWT_SECRET } = process.env;
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

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
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
  User.findOne({ email })
    .orFail(() => {
      next(new Unauthorized('Пользователь не найден'));
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, matched]) => {
      if (!matched) {
        throw new UnhandledError('Неверный пароль');
      }
      console.log(JWT_SECRET);
      res.status(200).send({ user });
      //TODO make token
    })
    .catch((err) => {
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
  updateUserData,
  updateUserAvatar,
  loginUser,
};
