import axios from 'axios'
import { Comment, CreateCommentData } from '@/models/Comment'

const API_URL = 'http://localhost:5173/api'

export default {
  async getComments(postId: number): Promise<Comment[]> {
    const response = await axios.get<Comment[]>(`${API_URL}/posts/${postId}/comments`)
    return response.data
  },

  async createComment(postId: number, comment: CreateCommentData): Promise<Comment> {
    const response = await axios.post<Comment>(`${API_URL}/posts/${postId}/comments`, comment)
    return response.data
  },
}
