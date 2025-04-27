<template>
  <div class="post-list">
    <h2>Latest Posts</h2>
    <div v-if="posts.length === 0" class="empty-state">
      No posts available. Be the first to create a post!
    </div>
    <div v-else class="posts-container">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card"
        @click="$emit('post-selected', post)"
      >
        <h3>{{ post.title }}</h3>
        <p class="post-meta">By {{ post.author }} on {{ formatDate(post.date) }}</p>
        <p class="comment-count">{{ post.comments.length }} comments</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Post } from '@/models/Post'

export default defineComponent({
  name: 'PostList',
  props: {
    posts: {
      type: Array as PropType<Post[]>,
      required: true,
    },
  },
  emits: ['post-selected'],
  setup() {
    const formatDate = (date: Date): string => {
      return new Date(date).toLocaleDateString()
    }

    return { formatDate }
  },
})
</script>

<style scoped>
.post-card {
  cursor: pointer;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.post-card:hover {
  background-color: #f5f5f5;
}

.post-meta {
  font-size: 0.9em;
  color: #666;
}

.comment-count {
  font-size: 0.8em;
  color: #4caf50;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}
</style>
