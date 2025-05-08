// src/models/Post.ts

export interface Comment {
  id: number
  postId: number
  author: string
  content: string
  date: string // ISO string format
}

export interface Post {
  id: number
  title: string
  author: string
  content: string
  date: string // ISO string format
  comments: Comment[]
}

// For creating a new post (without id, date, comments)
export interface CreatePostData {
  title: string
  author: string
  content: string
}

export interface CreateCommentData {
  postId: number
  author: string
  content: string
}
