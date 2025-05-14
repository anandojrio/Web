<template>
  <div class="container my-5 fun-container">
    <!-- NASLOV -->
    <h1 class="text-center display-4 mb-4 title-fun">Welcome to the Public Blog!</h1>
    <div class="row">
      <div class="col-12 fun-container">
        <div v-for="post in posts" :key="post.id" class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h5 class="card-title mb-1">{{ post.title }}</h5>
              <small class="text-muted">{{ formatRelativeTime(post.date) }}</small>
            </div>
            <!-- PRVIH 400 RECI PREVIEW-->
            <p class="card-text mb-1">
              {{ post.content.length > 400 ? post.content.slice(0, 400) + '...' : post.content }}
            </p>

            <!-- DETALJI O JEDNOJ SE OTVARAJU -->
            <a class="card-link" @click.prevent="goToPost(post.id)">More...</a>
          </div>
        </div>
        <!-- PRAVLJENJE NOVOG POSTA SE POKRECE -->
        <div class="d-flex justify-content-end mt-2">
          <button class="btn btn-primary" @click="goToNewPost">New Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PostService from '@/services/PostService'
import type { Post } from '@/models/Post'
import { useRouter } from 'vue-router'
import { formatRelativeTime } from '@/utils/time'

const posts = ref<Post[]>([])
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
  setTimeout(() => (toast.value.show = false), 3000)
}

//na pokretanju se ucitaju svi postovi
onMounted(async () => {
  const user = localStorage.getItem('user')
  if (!user) {
    showToast('Please log in to access this page.', 'error')
    setTimeout(() => {
      router.push({ name: 'auth' })
    }, 800)
  }
  posts.value = await PostService.getPosts()
})

// new post page
function goToNewPost() {
  router.push({ name: 'newpost' })
}

// detail page
function goToPost(id: number) {
  router.push({ name: 'postdetail', params: { id } })
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
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.3);
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
</style>
