import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import PostsView from '@/views/PostsView.vue'
import NewPostView from '@/views/NewPostView.vue'
import PostDetailView from '@/views/PostDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthView, //prvo otvara login/register
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

// Navigation guard da ne bi mogao druge stranice ako nije ulogovan
router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('user')

  // sve rute osim auth moraju biti verifikovane
  const isAuthPage = to.path === '/'
  const isProtected = !isAuthPage

  if (isProtected && !loggedIn) {
    // prosledjuje na /auth ako je izlogovan
    return next({ name: 'auth' })
  }
  if (isAuthPage && loggedIn) {
    // upravo zavrsio logovanje -> redirect na listu svih postova
    return next({ name: 'posts' })
  }
  next()
})

export default router
