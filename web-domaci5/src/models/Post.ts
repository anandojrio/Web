// src/models/Post.ts

export interface Comment {
  id: number
  postId: number
  author: string
  content: string
  date: string
}

export interface Post {
  id: number
  title: string
  author: string
  content: string
  date: string
  comments: Comment[]
}

export interface CreatePostData {
  title: string
  author: string
  content: string
}

export interface CreateCommentData {
  content: string
}
