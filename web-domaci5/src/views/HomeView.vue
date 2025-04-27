<template>
  <div class="home">
    <div class="action-button">
      <button @click="showPostForm = !showPostForm">
        {{ showPostForm ? 'Cancel' : 'New Post' }}
      </button>
    </div>

    <post-form v-if="showPostForm" @post-created="handlePostCreated" />

    <div v-if="selectedPost">
      <post-detail
        :post="selectedPost"
        @close="selectedPost = null"
        @comment-added="handleCommentAdded"
      />
    </div>

    <post-list v-else :posts="posts" @post-selected="selectPost" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PostService from '@/services/PostService'
import PostList from '@/components/post/PostList.vue'
import PostDetail from '@/components/post/PostDetail.vue'
import PostForm from '@/components/post/PostForm.vue'
import type { Post } from '@/models/Post'
import type { Comment } from '@/models/Comment'

const posts = ref<Post[]>([])
const selectedPost = ref<Post | null>(null)
const showPostForm = ref(false)

const loadPosts = async () => {
  try {
    posts.value = await PostService.getPosts()
  } catch (error) {
    console.error('Error loading posts:', error)
  }
}

const selectPost = (post: Post) => {
  selectedPost.value = post
}

const handlePostCreated = (post: Post) => {
  posts.value.unshift(post)
  showPostForm.value = false
}

const handleCommentAdded = (postId: number, comment: Comment) => {
  if (selectedPost.value && selectedPost.value.id === postId) {
    selectedPost.value.comments.push(comment)
  }

  const postIndex = posts.value.findIndex((p) => p.id === postId)
  if (postIndex !== -1) {
    posts.value[postIndex].comments.push(comment)
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.action-button {
  margin-bottom: 20px;
  text-align: right;
}

button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
