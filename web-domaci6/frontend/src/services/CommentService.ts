import axios from 'axios'
import { Comment, CreateCommentData } from '@/models/Post'

const API_URL = 'http://localhost:8080/api'

export default {
  //prikaz svih
  async getComments(postId: number): Promise<Comment[]> {
    const response = await axios.get<Comment[]>(`${API_URL}/posts/${postId}/comments`)
    return response.data
  },

  //novi komentar
  async createComment(postId: number, comment: CreateCommentData): Promise<Comment> {
    const response = await axios.post<Comment>(`${API_URL}/posts/${postId}/comments`, comment)
    return response.data
  },
}
