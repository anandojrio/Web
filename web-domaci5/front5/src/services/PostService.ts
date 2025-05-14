import axios from 'axios'
import type { Post, CreatePostData, Comment, CreateCommentData } from '../models/Post'

const API_BASE_URL = 'http://localhost:8080/api' //pocetna

class PostService {
  // fetch sve postove
  async getPosts(): Promise<Post[]> {
    const response = await axios.get<Post[]>(`${API_BASE_URL}/posts`)
    return response.data
  }

  // fetch detalja jednog
  async getPostById(postId: number): Promise<Post> {
    const response = await axios.get<Post>(`${API_BASE_URL}/posts/${postId}`)
    return response.data
  }

  // novi post
  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await axios.post<Post>(`${API_BASE_URL}/posts`, postData)
    return response.data
  }

  // novi komentar
  async addCommentToPost(postId: number, comment: CreateCommentData): Promise<Comment> {
    const response = await axios.post<Comment>(`${API_BASE_URL}/posts/${postId}/comments`, comment)
    return response.data
  }
}

export default new PostService()
