const express = require('express');
const router = express.Router();
const messageBoardController = require('../controllers/messageBoard');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

router.get('/', messageBoardController.messageBoard_get);

router.post('/', checkUser, messageBoardController.messageBoard_post);

module.exports = router;
