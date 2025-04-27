import axios from 'axios'
import { Post, CreatePostData } from '@/models/Post'

const API_URL = 'http://localhost:5173/api'

export default {
  async getPosts(): Promise<Post[]> {
    const response = await axios.get<Post[]>(`${API_URL}/posts`)
    return response.data
  },

  async getPost(id: number): Promise<Post> {
    const response = await axios.get<Post>(`${API_URL}/posts/${id}`)
    return response.data
  },

  async createPost(post: CreatePostData): Promise<Post> {
    const response = await axios.post<Post>(`${API_URL}/posts`, post)
    return response.data
  },
}
