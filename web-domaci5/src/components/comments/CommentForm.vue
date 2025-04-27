<template>
  <div class="comment-form">
    <h4>Add a Comment</h4>
    <form @submit.prevent="submitComment">
      <div class="form-group">
        <label for="comment-author">Your Name:</label>
        <input id="comment-author" v-model="form.author" type="text" required />
      </div>

      <div class="form-group">
        <label for="comment-content">Your Comment:</label>
        <textarea id="comment-content" v-model="form.content" rows="3" required></textarea>
      </div>

      <button type="submit">Submit Comment</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { CreateCommentData } from '@/models/Comment'

export default defineComponent({
  name: 'CommentForm',
  emits: ['comment-added'],
  setup(_, { emit }) {
    const form = reactive<CreateCommentData>({
      author: '',
      content: '',
    })

    const submitComment = () => {
      emit('comment-added', { ...form })

      // Reset form
      form.author = ''
      form.content = ''
    }

    return {
      form,
      submitComment,
    }
  },
})
</script>

<style scoped>
.comment-form {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

button {
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
