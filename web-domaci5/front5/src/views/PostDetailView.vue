<template>
  <div class="container my-5">
    <div v-if="post" class="fun-container">
      <h2 class="mb-1 title-fun">{{ post.title }}</h2>
      <div class="mb-2 text-muted small">
        {{ formatRelativeTime(post.date) }}<br />
        {{ post.author }}
      </div>
      <div class="mb-4">{{ post.content }}</div>

      <h4 class="mt-4 mb-3">Comments</h4>
      <div v-if="post.comments && post.comments.length">
        <div v-for="(comment, idx) in post.comments" :key="idx" class="mb-3">
          <strong>{{ comment.author }}</strong>
          <div class="text-muted small">{{ formatRelativeTime(comment.date) }}</div>
          <div>{{ comment.content }}</div>
        </div>
      </div>
      <div v-else class="text-muted mb-3">No comments yet.</div>

      <form @submit.prevent="submitComment" class="mt-4">
        <h5 class="mb-3">New comment</h5>
        <div class="mb-2">
          <input v-model="commentAuthor" type="text" class="form-control" placeholder="Name" />
        </div>
        <div class="mb-2">
          <textarea
            v-model="commentContent"
            class="form-control"
            placeholder="Comment"
            rows="2"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Comment</button>
      </form>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      :class="[
        'toast align-items-center show position-fixed bottom-0 end-0 m-4',
        toast.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white',
      ]"
      style="z-index: 1055; min-width: 250px"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ toast.message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="toast.show = false"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostService from '@/services/PostService'
import { formatRelativeTime } from '@/utils/time'

const route = useRoute()
const postId = Number(route.params.id)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const post = ref<any>(null)
const commentAuthor = ref('')
const commentContent = ref('')

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
})

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value.message = message
  toast.value.type = type
  toast.value.show = true
  setTimeout(() => (toast.value.show = false), 3000)
}

async function fetchPost() {
  post.value = await PostService.getPostById(postId)
}

onMounted(fetchPost)

async function submitComment() {
  if (!commentAuthor.value.trim() || !commentContent.value.trim()) {
    showToast('Molimo Vas da popunite i ime i zeljeni komentar!', 'error')
    return
  }
  try {
    const postId = Number(post.value.id)
    const newComment = {
      postId,
      author: commentAuthor.value,
      content: commentContent.value,
    } // This matches CreateCommentData

    await PostService.addCommentToPost(postId, newComment)
    showToast('Komentar dodat!', 'success')
    commentAuthor.value = ''
    commentContent.value = ''
    await fetchPost() // Reload comments
  } catch (error) {
    showToast('Neuspesno sacuvan komentar. Pokusajte ponovo.', 'error')
    console.error(error)
  }
}
</script>

<style scoped>
.card-title {
  font-weight: bold;
}

.card-link {
  color: #1e3a8a;
}

.title-fun {
  font-family: 'Roboto', sans-serif;
  color: #1e3a8a; /* Dark blue */
  text-shadow: 2px 2px 4px rgba(30, 58, 138, 0.4); /* subtle blue shadow */
  letter-spacing: 2px;
}

.fun-container {
  background: #e0e7ff; /* Light blue background */
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.3); /* Soft blue shadow */
  padding: 2rem;
  margin-bottom: 2rem;
  font-family: 'Roboto', sans-serif;
  color: #1e293b; /* Dark slate blue text */
}

.btn-primary {
  background-color: #1b58bb;
  border-color: #3b82f6;
}

.btn-primary:hover {
  background-color: #1e3a8a;
  border-color: #2563eb;
}
.toast {
  opacity: 1;
  transition: opacity 0.5s;
}
</style>
