// index.js
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
import BrowseEvents from '@/views/BrowseEvents.vue'
import CreateEvent from '@/views/CreateEvent.vue'
import EventDetails from '@/views/EventDetails.vue'
import PublicArtistProfile from '@/views/PublicArtistProfile.vue'
import MyInterests from '@/views/MyInterests.vue'
import MyMusic from '@/views/MyMusic.vue'

const routes = [
  // Public routes - Landing page for new visitors
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: { requiresGuest: true }, // ✅ Redirect logged-in users to /home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },

  // Protected routes (need login)
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    meta: { requiresAuth: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:id',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/edit-profile/:id',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/artist/edit-profile',
    name: 'EditArtistProfile',
    component: () => import('@/views/EditArtistProfile.vue'),
    meta: { requiresAuth: true, requiresArtist: true },
  },
  {
    path: '/artist/dashboard',
    name: 'ArtistDashboard',
    component: () => import('@/views/ArtistDashboard.vue'),
    meta: { requiresAuth: true, requiresArtist: true }, // Extra protection for artists only
  },
  // Add this to your routes array in index.js
  {
    path: '/artist/setup',
    name: 'ArtistSetup',
    component: () => import('@/views/ArtistSetup.vue'),
    meta: { requiresAuth: true, requiresArtist: true },
  },
  {
    path: '/artist/analytics',
    name: 'ArtistAnalytics',
    component: () => import('@/views/ArtistAnalytics.vue'),
    meta: { requiresAuth: true, requiresArtist: true },
  },
  {
    path: '/artist/:id',
    name: 'PublicArtistProfile',
    component: PublicArtistProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/events',
    name: 'BrowseEvents',
    component: () => import('@/views/BrowseEvents.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/events/create',
    name: 'CreateEvent',
    component: () => import('@/views/CreateEvent.vue'),
    meta: { requiresAuth: true, requiresArtist: true }, // Only artists
  },
  {
    path: '/events/edit/:id',
    name: 'EditEvent',
    component: () => import('@/views/EditEvent.vue'),
    meta: { requiresAuth: true, requiresArtist: true }, // Only artists can edit
  },
  {
    path: '/events/:id',
    name: 'EventDetails',
    component: () => import('@/views/EventDetails.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-interests',
    name: 'MyInterests',
    component: MyInterests,
    meta: { requiresAuth: true },
  },
  {
    path: '/my-music',
    name: 'MyMusic',
    component: MyMusic,
    meta: { requiresAuth: true },
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
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
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
      reject,
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
  } else if (to.meta.requiresArtist && user) {
    const { doc, getDoc } = await import('firebase/firestore')
    const { db } = await import('@/services/firebase')

    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.data()

    if (userData?.userType !== 'artist') {
      next('/home')
    } else {
      // Check if artist setup is completed
      const artistDoc = await getDoc(doc(db, 'artists', user.uid))
      const artistData = artistDoc.data()

      // If trying to access dashboard but setup not completed
      if (to.name === 'ArtistDashboard' && !artistData?.profileSetupCompleted) {
        next('/artist/setup')
      }
      // If trying to access setup but already completed
      // ONLY redirect to setup if dashboard is accessed but setup not completed
      // ALLOW access to setup page even if already completed (for editing)
      else if (to.name === 'ArtistDashboard' && !artistData?.profileSetupCompleted) {
        next('/artist/setup')
      } else {
        next() // Allow access to both setup and dashboard
      }
    }
  } else {
    next()
  }
})

export default router
