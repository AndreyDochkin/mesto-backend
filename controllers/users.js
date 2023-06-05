const mongoose = require('mongoose');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest ');
const UnhandledError = require('../errors/UnhandledError');
const NotFoundError = require('../errors/NotFoundError');

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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequest('Переданны невалидные данные');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail((err) => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        throw new BadRequest('Переданны невалидные данные');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail((err) => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
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
  updateUser,
  updateAvatar,
};
