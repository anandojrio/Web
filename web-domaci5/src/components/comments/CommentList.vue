<template>
  <div class="comment-list">
    <div v-if="comments.length === 0" class="empty-comments">
      No comments yet. Be the first to comment!
    </div>
    <div v-else>
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p class="comment-meta">{{ comment.author }} on {{ formatDate(comment.date) }}</p>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Comment } from '@/models/Comment'

export default defineComponent({
  name: 'CommentList',
  props: {
    comments: {
      type: Array as PropType<Comment[]>,
      required: true,
    },
  },
  setup() {
    const formatDate = (date: Date): string => {
      return new Date(date).toLocaleDateString()
    }

    return { formatDate }
  },
})
</script>

<style scoped>
.comment {
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.comment-meta {
  font-size: 0.8em;
  color: #666;
  margin-bottom: 5px;
}

.comment-content {
  margin: 0;
}

.empty-comments {
  font-style: italic;
  color: #666;
  padding: 10px 0;
}
</style>
