const express = require('express');
const { getProfile, updateProfile, changePassword, deleteAllUsers } = require('../controllers/userController');
const authMiddleware = require('../utils/auth');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// API delete all users - WARNING: This API is for demo purposes only
router.delete('/all', deleteAllUsers);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', changePassword);

module.exports = router;
