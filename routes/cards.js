const express = require('express');

const router = express.Router();

const {
  validateCardBody,
  validateCardId,
} = require('../middlewares/validateJoi');

const {
  getAllCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', validateCardBody, createCard);
router.delete('/cards/:cardId', validateCardId, deleteCard);
router.put('/cards/:cardId/likes', validateCardId, addLike);
router.delete('/cards/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
