<template>
  <div class="post-detail">
    <button class="back-button" @click="$emit('close')">← Back to posts</button>

    <article class="post">
      <h2>{{ post.title }}</h2>
      <p class="post-meta">By {{ post.author }} on {{ formatDate(post.date) }}</p>

      <div class="post-content">
        {{ post.content }}
      </div>
    </article>

    <section class="comments-section">
      <h3>Comments ({{ post.comments.length }})</h3>

      <comment-list :comments="post.comments" />

      <comment-form @comment-added="handleCommentAdded" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Post } from '@/models/Post'
import { CreateCommentData } from '@/models/Comment'
import CommentList from '@/components/comment/CommentList.vue'
import CommentForm from '@/components/comment/CommentForm.vue'
import CommentService from '@/services/CommentService'

export default defineComponent({
  name: 'PostDetail',
  components: {
    CommentList,
    CommentForm,
  },
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  emits: ['close', 'comment-added'],
  setup(props, { emit }) {
    const formatDate = (date: Date): string => {
      return new Date(date).toLocaleDateString()
    }

    const handleCommentAdded = async (commentData: CreateCommentData) => {
      try {
        const comment = await CommentService.createComment(props.post.id, commentData)
        emit('comment-added', props.post.id, comment)
      } catch (error) {
        console.error('Error adding comment:', error)
      }
    }

    return {
      formatDate,
      handleCommentAdded,
    }
  },
})
</script>

<style scoped>
.back-button {
  margin-bottom: 20px;
  background-color: #f0f0f0;
  color: #333;
}

.post {
  margin-bottom: 30px;
}

.post-meta {
  color: #666;
  font-style: italic;
  margin-bottom: 20px;
}

.post-content {
  line-height: 1.6;
  margin-bottom: 30px;
}

.comments-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}
</style>
