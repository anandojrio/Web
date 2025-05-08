import { createRouter, createWebHistory } from 'vue-router'
import PostsView from '@/views/PostsView.vue'
import NewPostView from '@/views/NewPostView.vue'
import PostDetailView from '@/views/PostDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'posts',
    component: PostsView,
  },
  { path: '/newpost', name: 'newpost', component: NewPostView },
  { path: '/:id', name: 'postdetail', component: PostDetailView },
  // ... other routes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
