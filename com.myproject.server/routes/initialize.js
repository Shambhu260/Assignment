const express = require('express');
const router = express.Router();
const initializeController = require('../controllers/Initialize');

// set tag
router.get('/initialize', initializeController.init);

module.exports = router;
