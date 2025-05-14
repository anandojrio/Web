<template>
  <div>
    <button class="btn btn-primary" @click="handleLogout">Logout</button>
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
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service'

const router = useRouter()
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error',
})

//notifikacija
function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value.message = message
  toast.value.type = type
  toast.value.show = true
  setTimeout(() => (toast.value.show = false), 2000)
}

function handleLogout() {
  AuthService.logout()
  showToast('Logged out successfully!', 'success')
  setTimeout(() => {
    router.push({ name: 'auth' })
  }, 800) // short delay so toast is visible
}
</script>

<style scoped>
.btn-primary {
  background-color: #1b58bb;
  border-color: #3b82f6;
  margin-right: 50px;
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
