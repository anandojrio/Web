<template>
  <div class="container my-5">
    <h2 class="text-center mb-4 title-fun">Create a New Post</h2>
    <form @submit.prevent="handleSubmit" class="fun-container">
      <div class="mb-3">
        <label for="author" class="form-label">Author</label>
        <input
          id="author"
          v-model="author"
          type="text"
          class="form-control"
          placeholder="Enter your name"
        />
      </div>
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="form-control"
          placeholder="Enter post title"
        />
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">Content</label>
        <textarea
          id="content"
          v-model="content"
          rows="4"
          class="form-control"
          placeholder="Write your post here..."
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Save Post</button>
    </form>

    <!-- Toast Notification -->
    <!-- potvrda -->
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
import { ref } from 'vue'
import { useRouter, isNavigationFailure, NavigationFailureType } from 'vue-router'
import PostService from '@/services/PostService'

const author = ref('')
const title = ref('')
const content = ref('')
const router = useRouter()

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
})

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value.message = message
  toast.value.type = type
  toast.value.show = true
  setTimeout(() => (toast.value.show = false), 800)
}

// klik na dugme
async function handleSubmit() {
  // fali podatak
  if (!author.value.trim() || !title.value.trim() || !content.value.trim()) {
    showToast('Popunite sva polja!', 'error')
    return
  }

  try {
    await PostService.createPost({
      author: author.value,
      title: title.value,
      content: content.value,
    })

    // USPESNO
    showToast('Post has been saved successfully!', 'success')

    // mali delay da bi se procitao toast
    setTimeout(() => {
      router.push({ name: 'posts' }).catch((error) => {
        if (!isNavigationFailure(error, NavigationFailureType.duplicated)) {
          showToast('Navigation case problem. Please try again.', 'error')
          console.error(error)
        }
      })
    }, 400)
  } catch (error) {
    showToast('Neuspesno cuvanje posta. Molimo pokusajte opet.', 'error')
    console.error(error)
  }
}
</script>

<style scoped>
.mb-3 {
  font-size: 25px;
  color: #1e3a8a;
}

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
  font-size: 50px;
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
