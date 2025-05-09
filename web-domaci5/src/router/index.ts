import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import PostsView from '@/views/PostsView.vue'
import NewPostView from '@/views/NewPostView.vue'
import PostDetailView from '@/views/PostDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthView, // Login/Register page is the root page
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsView,
  },
  {
    path: '/newpost',
    name: 'newpost',
    component: NewPostView,
  },
  {
    path: '/posts/:id',
    name: 'postdetail',
    component: PostDetailView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('user')

  // All routes except "/" are protected
  const isAuthPage = to.path === '/'
  const isProtected = !isAuthPage

  if (isProtected && !loggedIn) {
    // Not logged in, trying to access a protected route
    return next({ name: 'auth' })
  }
  if (isAuthPage && loggedIn) {
    // Logged in, trying to access login/register page
    return next({ name: 'posts' })
  }
  next()
})

export default router
