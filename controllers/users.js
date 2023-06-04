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
  User.create({ name, about, avatar})
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Error creating user' }));
};

module.exports = { getAllUsers, getUserById, createUser };