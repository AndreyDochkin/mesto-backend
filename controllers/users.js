const mongoose = require('mongoose');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const UnhandledError = require('../errors/UnhandledError');
const NotFoundError = require('../errors/NotFoundError');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((allUsers) => res.status(200).send({ data: allUsers }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(err.message);
      }
      throw new UnhandledError(err.message);
    })
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(err.message);
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFoundError(err.message);
      }
      throw new UnhandledError(err.message);
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(err.message);
      }
      throw new UnhandledError(err.message);
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(err.message);
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFoundError(err.message);
      }
      throw new UnhandledError(err.message);
    })
    .catch((err) => next(err));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(err.message);
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFoundError(err.message);
      }
      throw new UnhandledError(err.message);
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
