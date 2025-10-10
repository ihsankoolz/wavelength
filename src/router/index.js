import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/services/firebase'

// Import views
import Landing from '@/views/Landing.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Home from '@/views/Home.vue'
import UserProfile from '@/views/UserProfile.vue'
import EditProfile from '@/views/EditProfile.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  
  // Protected routes (need login)
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:id',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-profile/:id',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true }
  },
  
  // TODO: Add more routes here
  // {
  //   path: '/onboarding',
  //   name: 'Onboarding',
  //   component: () => import('@/views/Onboarding.vue'),
  //   meta: { requiresAuth: true }
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Smooth scroll for anchor links
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Route guards
router.beforeEach((to, from, next) => {
  const user = auth.currentUser

  // If page needs auth and user NOT logged in
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } 
  // If user IS logged in and tries to go to login/register
  else if (to.meta.requiresGuest && user) {
    next('/home')
  }
  // Everything else
  else {
    next()
  }
})

export default router