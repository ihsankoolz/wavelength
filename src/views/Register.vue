<!-- register.vue -->
<template>
    <div class="auth-wrapper">
        <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-12 col-sm-10 col-md-8 col-lg-5">
            
            <!-- Logo Section -->
            <div class="text-center text-white mb-4">
                <router-link to="/">
                    <img src="/assets/logo1.png" alt="Wavelength" class="auth-logo">
                </router-link>
                <p class="tagline">Discover Singapore's Local Music</p>
            </div>

            <!-- Register Card -->
            <div class="card shadow">
                <div class="card-body p-4">
                <h3 class="text-center mb-4">Create Account</h3>

                <!-- Error Alert -->
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                </div>

                <!-- Register Form -->
                <form @submit.prevent="register">
                    
                    <!-- User Type Selection -->
                    <div class="mb-4">
                    <label class="form-label fw-bold">I am a...</label>
                    <div class="row g-2">
                        <div class="col-6">
                        <input 
                            type="radio" 
                            class="btn-check" 
                            id="fan" 
                            value="fan"
                            v-model="userType"
                        >
                        <label class="btn btn-outline-primary w-100 py-3" for="fan">
                            <i class="bi bi-person fs-3 d-block mb-1"></i>
                            <small>Music Fan</small>
                        </label>
                        </div>
                        <div class="col-6">
                        <input 
                            type="radio" 
                            class="btn-check" 
                            id="artist" 
                            value="artist"
                            v-model="userType"
                        >
                        <label class="btn btn-outline-primary w-100 py-3" for="artist">
                            <i class="bi bi-music-note fs-3 d-block mb-1"></i>
                            <small>Artist</small>
                        </label>
                        </div>
                    </div>
                    </div>

                    <!-- Display Name -->
                    <div class="mb-3">
                    <label for="displayName" class="form-label">Display Name</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="displayName"
                        v-model="displayName"
                        required
                        placeholder="Your name"
                    >
                    </div>

                    <!-- Email -->
                    <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input 
                        type="email" 
                        class="form-control" 
                        id="email"
                        v-model="email"
                        required
                        placeholder="you@example.com"
                    >
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input 
                        type="password" 
                        class="form-control" 
                        id="password"
                        v-model="password"
                        required
                        placeholder="Min. 6 characters"
                    >
                    <small class="text-muted">Must be at least 6 characters</small>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2 mb-3" :disabled="isLoading">
                    <span v-if="isLoading">Creating account...</span>
                    <span v-else>Create Account</span>
                    </button>
                </form>

                <!-- Login Link -->
                <div class="text-center">
                    <p class="mb-0">
                    Already have an account? 
                    <router-link to="/login" class="text-decoration-none">Sign in here</router-link>
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
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'

export default {
    name: 'Register',
    data() {
        return {
        displayName: '',
        email: '',
        password: '',
        userType: 'fan',
        errorMessage: '',
        isLoading: false
    }
  },
  methods: {
    async register() {
        this.errorMessage = ''

        if (this.password.length < 6) {
            this.errorMessage = 'Password must be at least 6 characters'
            return
        }

        this.isLoading = true

        try {
            const userCredential = await createUserWithEmailAndPassword(
            auth, 
            this.email, 
            this.password
            )
            
            const user = userCredential.user

            await setDoc(doc(db, 'users', user.uid), {
            email: this.email,
            userType: this.userType,
            displayName: this.displayName,
            profileImage: '',
            preferences: {
                genres: [],
                location: 'Singapore'
            },
            createdAt: new Date(),
            lastActive: new Date()
            })

            if (this.userType === 'artist') {
            await setDoc(doc(db, 'artists', user.uid), {
                userId: user.uid,
                artistName: this.displayName,
                bio: '',
                genres: [],
                location: 'Singapore',
                socialLinks: {
                spotify: '',
                youtube: '',
                instagram: ''
                },
                musicLinks: [],
                followerCount: 0,
                verified: false,
                createdAt: new Date()
            })
            }

            if (this.userType === 'fan') {
            this.$router.push('/onboarding')
            } else {
            this.$router.push('/artist/setup')
            }

        } catch (error) {
            console.error('Registration error:', error)
            
            if (error.code === 'auth/email-already-in-use') {
            this.errorMessage = 'Email already in use'
            } else if (error.code === 'auth/invalid-email') {
            this.errorMessage = 'Invalid email address'
            } else {
            this.errorMessage = 'Registration failed. Please try again.'
            }
        }

        this.isLoading = false
        }
    }
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

.btn-outline-primary {
    color: #667eea;
    border-color: #667eea;
}

.btn-outline-primary:hover {
    background-color: #667eea;
    border-color: #667eea;
}

.btn-check:checked + .btn-outline-primary {
    background-color: #667eea;
    border-color: #667eea;
}
.auth-logo {
  width: 280px;
  max-width: 90%;
  height: auto;
}

.tagline {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}
</style>