export interface Comment {
  id: number
  postId: number
  author: string
  content: string
  date: Date
}

export interface CreateCommentData {
  author: string
  content: string
}
