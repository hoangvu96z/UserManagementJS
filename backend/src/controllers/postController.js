const postService = require('../services/postService');

const validatePostPayload = ({ title, content }) => {
  if (!title || !content) {
    return 'Title and content are required';
  }

  if (title.length > 120) {
    return 'Title must be 120 characters or less';
  }

  if (content.length > 5000) {
    return 'Content must be 5000 characters or less';
  }

  return null;
};

const getPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.findPostById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const validationError = validatePostPayload({ title, content });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const post = await postService.createPost({
      title: title.trim(),
      content: content.trim(),
      authorId: req.user.id
    });

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const validationError = validatePostPayload({ title, content });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updatedPost = await postService.updatePost(id, req.user.id, {
      title: title.trim(),
      content: content.trim()
    });

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    if (error.message === 'Post not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'You do not have permission to modify this post') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await postService.deletePost(id, req.user.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (error.message === 'Post not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'You do not have permission to delete this post') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
