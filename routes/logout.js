const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logout');

router.get('/', logoutController.logout_get);

module.exports = router;
