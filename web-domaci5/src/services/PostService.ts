import type { Post, CreatePostData, Comment, CreateCommentData } from '@/models/Post'
import api from './api'

class PostService {
  // Fetch sve posts
  async getPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>('/posts')
    return response.data
  }

  // Fetch 1 preko id
  async getPostById(postId: number): Promise<Post> {
    const response = await api.get<Post>(`/posts/${postId}`)
    return response.data
  }

  // pravi novi
  async createPost(postData: Omit<CreatePostData, 'author'>): Promise<Post> {
    // uzima ime authora sa bekenda
    const response = await api.post<Post>('/posts', postData)
    return response.data
  }

  // novi comment
  async addCommentToPost(
    postId: number,
    comment: Omit<CreateCommentData, 'author' | 'postId'>,
  ): Promise<Comment> {
    const response = await api.post<Comment>(`/posts/${postId}/comments`, comment)
    return response.data
  }
}

export default new PostService()
