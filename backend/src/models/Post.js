class Post {
  constructor({ title, content, authorId }) {
    this.id = Date.now().toString();
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      authorId: this.authorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toDatabase() {
    return this.toJSON();
  }
}

module.exports = Post;
