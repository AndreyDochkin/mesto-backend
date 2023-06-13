const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest ');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((allCards) => res.status(200).send({ data: allCards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, createdAt: Date.now(),
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданны невалидные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      next(new NotFoundError('Карточка не найдена'));
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        return next(new Forbidden('Нельзя удалить чужую карточку'));
      }
      return Card.deleteOne({ _id: req.params.cardId });
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданны невалидные данные'));
      } else {
        next(err);
      }
    });
};

const updateLike = (req, res, next, updateParam) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, updateParam, { new: true })
    .orFail(() => {
      next(new NotFoundError('Карточка не найдена'));
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const addLike = (req, res, next) => {
  const updateParam = { $addToSet: { likes: req.user._id } };
  updateLike(req, res, next, updateParam);
};

const deleteLike = (req, res, next) => {
  const updateParam = { $pull: { likes: req.user._id } };
  updateLike(req, res, next, updateParam);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
