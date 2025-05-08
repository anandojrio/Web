// src/services/PostService.ts

import axios from 'axios'
import type { Post, CreatePostData, Comment, CreateCommentData } from '../models/Post'

const API_BASE_URL = 'http://localhost:8080/api' // Adjust if needed

class PostService {
  // Fetch all posts
  async getPosts(): Promise<Post[]> {
    const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`)
    return response.data
  }

  // Fetch a single post by ID (with comments)
  async getPostById(postId: number): Promise<Post> {
    const response = await axios.get<Post>(`${API_BASE_URL}/posts/${postId}`)
    return response.data
  }

  // Create a new post
  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await axios.post<Post>(`${API_BASE_URL}/posts`, postData)
    return response.data
  }

  // Add a comment to a post
  async addCommentToPost(postId: number, comment: CreateCommentData): Promise<Comment> {
    const response = await axios.post<Comment>(`${API_BASE_URL}/posts/${postId}/comments`, comment)
    return response.data
  }
}

export default new PostService()
