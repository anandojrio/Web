<template>
  <div class="post-form">
    <h2>Create New Post</h2>
    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label for="title">Title:</label>
        <input id="title" v-model="form.title" type="text" required />
      </div>

      <div class="form-group">
        <label for="author">Your Name:</label>
        <input id="author" v-model="form.author" type="text" required />
      </div>

      <div class="form-group">
        <label for="content">Content:</label>
        <textarea id="content" v-model="form.content" rows="6" required></textarea>
      </div>

      <button type="submit">Publish Post</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import PostService from '@/services/PostService'
import { CreatePostData } from '@/models/Post'

export default defineComponent({
  name: 'PostForm',
  emits: ['post-created'],
  setup(_, { emit }) {
    const form = reactive<CreatePostData>({
      title: '',
      author: '',
      content: '',
    })

    const submitPost = async () => {
      try {
        const newPost = await PostService.createPost(form)
        emit('post-created', newPost)

        // Reset form
        form.title = ''
        form.author = ''
        form.content = ''
      } catch (error) {
        console.error('Error creating post:', error)
      }
    }

    return {
      form,
      submitPost,
    }
  },
})
</script>

<style scoped>
.post-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
