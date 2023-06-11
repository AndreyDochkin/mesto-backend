const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth');
const {
  validateUserBody,
  validateLoginBody,
  validateAvatarBody,
  validateUserId,
} = require('../middlewares/validateJoi');

const {
  getAllUsers,
  getUserById,
  createUser,
  getCurrentUser,
  updateUserData,
  updateUserAvatar,
  loginUser,
} = require('../controllers/users');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateLoginBody, loginUser);

router.use(auth);

router.get('/users', getAllUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', validateUserId, getUserById);
router.patch('/users/me', updateUserData);
router.patch('/users/me/avatar', validateAvatarBody, updateUserAvatar);

module.exports = router;
