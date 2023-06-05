const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest ');
const UnhandledError = require('../errors/UnhandledError');
const NotFoundError = require('../errors/NotFoundError');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((allCards) => res.status(200).send({ data: allCards }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequest('Переданны невалидные данные');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, createdAt: Date.now(),
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        throw new BadRequest('Переданны невалидные данные');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail((err) => {
      next(new NotFoundError('Deleted card not found'));
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequest('Переданны невалидные данные');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail((err) => {
      next(new NotFoundError('Карточка не найдена'));
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        throw new BadRequest('Переданны невалидные данные');
      }
      throw new UnhandledError('На сервере произошла ошибка');
    })
    .catch((err) => next(err));
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail((err) => {
      next(new NotFoundError('Карточка не найдена'));
    })
    .then((card) => res.status(200).send({ data: card }))
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
  getAllCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
