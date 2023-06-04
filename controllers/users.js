const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .then((allUsers) => res.status(200).send({ data: allUsers }))
    .catch(err => res.status(500).send({ message: 'Error getting all users' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Error getting user' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Error creating user' }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Error update user' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Error update user avatar' }));
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
