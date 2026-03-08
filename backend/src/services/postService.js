const Post = require('../models/Post');
const pool = require('../config/db');

class PostService {
  mapRowToPost(row) {
    return new Post({
      id: row.id,
      title: row.title,
      content: row.content,
      authorId: row.author_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }

  async getAllPosts() {
    const [rows] = await pool.query('SELECT * FROM posts');
    return rows.map(row => this.mapRowToPost(row));
  }

  async findPostById(postId) {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ? LIMIT 1', [postId]);
    return rows[0] ? this.mapRowToPost(rows[0]) : null;
  }

  async createPost(postData) {
    const { title, content, authorId } = postData;
    const [result] = await pool.query(
      'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)',
      [title, content, authorId]
    );

    return this.findPostById(result.insertId);
  }

  async updatePost(postId, authorId, updateData) {
    const existingPost = await this.findPostById(postId);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (existingPost.authorId !== authorId) {
      throw new Error('You do not have permission to modify this post');
    }

    const title = updateData.title || existingPost.title;
    const content = updateData.content || existingPost.content;

    await pool.query(
      'UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, postId]
    );

    return this.findPostById(postId);
  }

  async deletePost(postId, authorId) {
    const existingPost = await this.findPostById(postId);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (existingPost.authorId !== authorId) {
      throw new Error('You do not have permission to delete this post');
    }

    await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
    return existingPost;
  }
}

module.exports = new PostService();
