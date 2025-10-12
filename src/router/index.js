import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Import views
import Landing from '@/views/Landing.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Home from '@/views/Home.vue'
import UserProfile from '@/views/UserProfile.vue'
import EditProfile from '@/views/EditProfile.vue'
import Onboarding from '@/views/Onboarding.vue'

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
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    meta: { requiresAuth: true }
  },
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
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

// Function to get current auth state
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe() // Stop listening after we get the result
        resolve(user)
      },
      reject
    )
  })
}

// Route guards - now waits for Firebase
router.beforeEach(async (to, from, next) => {
  // Wait for Firebase to finish checking auth state
  const user = await getCurrentUser()

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