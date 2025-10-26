<!-- login.vue -->
<template>
  <div class="auth-wrapper">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-sm-10 col-md-8 col-lg-5">
          <!-- Logo Section -->
          <div class="text-center text-white mb-4">
            <router-link to="/">
              <img src="/assets/logo1.png" alt="Wavelength" class="auth-logo" />
            </router-link>
            <p class="tagline">Discover Singapore's Local Music</p>
          </div>

          <!-- Login Card -->
          <div class="card shadow">
            <div class="card-body p-4">
              <h3 class="text-center mb-4">Sign In</h3>

              <!-- Error Alert -->
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>

              <!-- Login Form -->
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    required
                    placeholder="••••••••"
                  />
                </div>

                <button type="submit" class="btn btn-primary w-100 py-2 mb-3" :disabled="isLoading">
                  <span v-if="isLoading">Signing in...</span>
                  <span v-else>Sign In</span>
                </button>
              </form>

              <!-- Register Link -->
              <div class="text-center">
                <p class="mb-0">
                  Don't have an account?
                  <router-link to="/register" class="text-decoration-none"
                    >Register here</router-link
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false,
    }
  },
  methods: {
    async login() {
      this.errorMessage = ''
      this.isLoading = true

      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password)

        const user = userCredential.user

        // Check if user document exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (!userDoc.exists()) {
          // User exists in Firebase Auth but not in Firestore
          // This happens when someone manually deletes from Firestore
          await auth.signOut()
          this.errorMessage = 'Account data not found. Please contact support or register again.'
          this.isLoading = false
          return
        }

        const userData = userDoc.data()

        // Update last active
        await updateDoc(doc(db, 'users', user.uid), {
          lastActive: new Date(),
        })

        if (userData.userType === 'artist') {
          this.$router.push('/artist/dashboard')
        } else {
          this.$router.push('/home')
        }
      } catch (error) {
        console.error('Login error:', error)
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          this.errorMessage = 'Invalid email or password'
        } else if (error.code === 'auth/too-many-requests') {
          this.errorMessage = 'Too many failed attempts. Please try again later.'
        } else {
          this.errorMessage = 'Login failed. Please try again.'
        }
      }

      this.isLoading = false
    },
  },
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle i {
  font-size: 40px;
  color: #667eea;
}

.card {
  border: none;
  border-radius: 12px;
}

.btn-primary {
  background-color: #667eea;
  border-color: #667eea;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #5568d3;
  border-color: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
}

.auth-logo {
  width: 400px;
  max-width: 90%;
  height: auto;
}

.tagline {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}
</style>
