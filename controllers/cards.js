const Card = require('../models/card');

const getAllCards = (req, res) => {
  Card.find({})
    .then((allCards) => res.status(200).send({ data: allCards }))
    .catch((err) => res.status(500).send({ message: 'Error getting all cards' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner, createdAt: Date.now() })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Error deleting card' }));
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }))
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Error delete like card' }))
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
