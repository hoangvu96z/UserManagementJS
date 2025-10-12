const fs = require('fs').promises;
const path = require('path');
const Post = require('../models/Post');

const POSTS_FILE = path.join(__dirname, '../../data/posts.json');

class PostService {
  async getAllPosts() {
    try {
      const data = await fs.readFile(POSTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async savePosts(posts) {
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
  }

  async findPostById(postId) {
    const posts = await this.getAllPosts();
    return posts.find(post => post.id === postId);
  }

  async createPost(postData) {
    const post = new Post(postData);
    const posts = await this.getAllPosts();
    posts.push(post.toDatabase());
    await this.savePosts(posts);
    return post.toJSON();
  }

  async updatePost(postId, authorId, updateData) {
    const posts = await this.getAllPosts();
    const index = posts.findIndex(post => post.id === postId);

    if (index === -1) {
      throw new Error('Post not found');
    }

    if (posts[index].authorId !== authorId) {
      throw new Error('You do not have permission to modify this post');
    }

    posts[index] = {
      ...posts[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await this.savePosts(posts);
    return posts[index];
  }

  async deletePost(postId, authorId) {
    const posts = await this.getAllPosts();
    const index = posts.findIndex(post => post.id === postId);

    if (index === -1) {
      throw new Error('Post not found');
    }

    if (posts[index].authorId !== authorId) {
      throw new Error('You do not have permission to delete this post');
    }

    const [deletedPost] = posts.splice(index, 1);
    await this.savePosts(posts);
    return deletedPost;
  }
}

module.exports = new PostService();
