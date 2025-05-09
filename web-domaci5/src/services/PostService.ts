// src/services/PostService.ts
import type { Post, CreatePostData, Comment, CreateCommentData } from '@/models/Post'
import api from './api'

class PostService {
  // Fetch all posts
  async getPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>('/posts')
    return response.data
  }

  // Fetch one post by ID
  async getPostById(postId: number): Promise<Post> {
    const response = await api.get<Post>(`/posts/${postId}`)
    return response.data
  }

  // Create a new post
  async createPost(postData: Omit<CreatePostData, 'author'>): Promise<Post> {
    // Don't send 'author' from frontend, backend sets it from JWT
    const response = await api.post<Post>('/posts', postData)
    return response.data
  }

  // Add a new comment to a post
  async addCommentToPost(
    postId: number,
    comment: Omit<CreateCommentData, 'author' | 'postId'>,
  ): Promise<Comment> {
    // Only send { content }
    const response = await api.post<Comment>(`/posts/${postId}/comments`, comment)
    return response.data
  }
}

export default new PostService()
