const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../middleware/validators');
const validateRequest = require('../middleware/validateRequest');

// Register route with validation
router.post('/register', registerValidator, validateRequest, register);

// Login route with validation
router.post('/login', loginValidator, validateRequest, login);

module.exports = router;