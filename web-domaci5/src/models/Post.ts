import { Comment } from './Comment'

export interface Post {
  id: number
  title: string
  author: string
  content: string
  date: Date
  comments: Comment[]
}

export interface CreatePostData {
  title: string
  author: string
  content: string
}
