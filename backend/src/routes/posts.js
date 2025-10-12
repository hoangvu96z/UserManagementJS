const express = require('express');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const authMiddleware = require('../utils/auth');

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
