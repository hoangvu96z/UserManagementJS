const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../utils/auth');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', updateProfile);

module.exports = router;
