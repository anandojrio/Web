<template>
  <div class="container my-5 fun-container" style="max-width: 500px">
    <h1 class="text-center display-4 mb-4 title-fun">
      {{ mode === 'login' ? 'Login to Your Account' : 'Register a New Account' }}
    </h1>

    <ul class="nav nav-tabs mb-4 justify-content-center">
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
          :class="{ active: mode === 'login' }"
          @click.prevent="mode = 'login'"
          >Login</a
        >
      </li>
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
          :class="{ active: mode === 'register' }"
          @click.prevent="mode = 'register'"
          >Register</a
        >
      </li>
    </ul>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="form-control"
          required
          autocomplete="username"
          placeholder="Enter your username"
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          required
          autocomplete="current-password"
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" class="btn btn-primary w-100">
        {{ mode === 'login' ? 'Login' : 'Register' }}
      </button>

      <div v-if="error" class="alert alert-danger mt-3" role="alert">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const mode = ref<'login' | 'register'>('login')
const username = ref('')
const password = ref('')
const error = ref('')
const authStore = useAuthStore()

async function onSubmit() {
  error.value = ''
  try {
    if (mode.value === 'login') {
      await authStore.login(username.value, password.value)
      router.push({ name: 'posts' }) // Only redirect after successful login
    } else {
      await authStore.register(username.value, password.value)
      mode.value = 'login'
      username.value = ''
      password.value = ''
      error.value = 'Registration successful! Please login.'
      // Do NOT redirect to posts after registration, let user login
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    error.value = e.response?.data || 'An error occurred. Please try again.'
  }
}
</script>

<style scoped>
.title-fun {
  font-family: 'Roboto', sans-serif;
  color: #1e3a8a;
  text-shadow: 2px 2px 4px rgba(30, 58, 138, 0.4);
  letter-spacing: 2px;
  font-size: 30px;
}

.fun-container {
  background: #e0e7ff;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.3);
  padding: 2rem;
  margin-bottom: 2rem;
  font-family: 'Roboto', sans-serif;
  color: #1e293b;
}

.btn-primary {
  background-color: #1b58bb;
  border-color: #3b82f6;
}

.btn-primary:hover {
  background-color: #1e3a8a;
  border-color: #2563eb;
}

.nav-link {
  cursor: pointer;
  color: #1e3a8a;
  font-weight: 500;
}

.nav-link.active {
  background-color: #1b58bb;
  color: white !important;
  border-radius: 0.25rem;
}

.form-label {
  font-weight: 500;
}
</style>
