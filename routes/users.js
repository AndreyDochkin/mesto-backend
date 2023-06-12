const express = require('express');

const router = express.Router();

const {
  validateUserData,
  validateAvatarBody,
  validateUserId,
} = require('../middlewares/validateJoi');

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', validateUserId, getUserById);
router.patch('/users/me', validateUserData, updateUserData);
router.patch('/users/me/avatar', validateAvatarBody, updateUserAvatar);

module.exports = router;
