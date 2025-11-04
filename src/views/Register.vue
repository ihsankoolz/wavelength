<!-- register.vue -->
<template>
  <div class="auth-wrapper" @mousemove="handleMouseMove">
    <!-- Cursor Trail Effect -->
    <div class="cursor-trail" :style="cursorTrailStyle"></div>

    <!-- Floating Music Particles -->
    <div class="music-particles">
      <div v-for="n in 15" :key="'particle-' + n" class="music-note" :style="getParticleStyle(n)">
        {{ getMusicSymbol(n) }}
      </div>
    </div>

    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="#bb1814" stroke-width="2" opacity="0.6">
          <animate
            attributeName="d"
            values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate
            attributeName="d"
            values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate
            attributeName="d"
            values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="0.8" opacity="0.3">
          <animate
            attributeName="d"
            values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>

    <div class="content-wrapper auth-split">
      <!-- LEFT / Brand Section -->
      <div class="auth-left d-flex flex-column justify-content-between align-items-start">
        <div>
          <router-link to="/">
            <img src="/assets/logo1.png" alt="Wavelength" class="auth-logo logo-3d" />
          </router-link>
          <div class="tagline-split mt-5">
            <span class="animated-text">
              <span
                v-for="(letter, index) in welcomeText"
                :key="index"
                class="letter"
                :style="{ animationDelay: `${index * 0.05}s` }"
                >{{ letter === ' ' ? '\u00A0' : letter }}</span
              >
            </span>
          </div>
        </div>
      </div>

      <!-- RIGHT / Form Section -->
      <div class="auth-right d-flex flex-column justify-content-center">
        <div class="form-card glass-card py-4" :class="{ shake: showError }">
          <h2 class="text-white font-weight-bold mb-4 text-center signup-title">SIGN UP</h2>
          <!-- Type toggle -->
          <div class="toggle-row mb-5 d-flex justify-content-center">
            <button
              class="toggle-btn toggle-enhanced"
              :class="userType === 'fan' ? 'selected' : 'outline'"
              type="button"
              @click="userType = 'fan'"
            >
              <span class="toggle-icon">🎵</span>
              MUSIC FAN
            </button>
            <button
              class="toggle-btn toggle-enhanced ml-3"
              :class="userType === 'artist' ? 'selected' : 'outline'"
              type="button"
              @click="userType = 'artist'"
            >
              <span class="toggle-icon">🎤</span>
              ARTIST
            </button>
          </div>

          <!-- Error with animation -->
          <transition name="error-slide">
            <div v-if="errorMessage" class="alert alert-danger py-2 error-alert">
              {{ errorMessage }}
            </div>
          </transition>

          <!-- Registration Form -->
          <form @submit.prevent="register" autocomplete="off">
            <!-- Display Name Input with Floating Label -->
            <div class="mb-4 input-group-enhanced">
              <div class="input-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  class="icon-pulse"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                type="text"
                v-model="displayName"
                class="form-control input-enhanced"
                required
                autocomplete="off"
                @focus="nameFocused = true"
                @blur="nameFocused = false"
              />
              <label class="floating-label" :class="{ active: displayName || nameFocused }"
                >Display Name</label
              >
              <div class="input-underline"></div>
            </div>

            <!-- Email Input with Floating Label -->
            <div class="mb-4 input-group-enhanced">
              <div class="input-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  class="icon-pulse"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                type="email"
                v-model="email"
                class="form-control input-enhanced"
                required
                autocomplete="off"
                @focus="emailFocused = true"
                @blur="emailFocused = false"
              />
              <label class="floating-label" :class="{ active: email || emailFocused }"
                >Email Address</label
              >
              <div class="input-underline"></div>
            </div>

            <!-- Password Input with Floating Label -->
            <div class="mb-5 input-group-enhanced">
              <div class="input-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  :class="{ 'icon-shake': passwordFocused }"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="form-control input-enhanced"
                required
                minlength="6"
                autocomplete="off"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              />
              <label class="floating-label" :class="{ active: password || passwordFocused }"
                >Password (min 6 chars)</label
              >
              <div class="password-toggle" @click="showPassword = !showPassword">
                <svg
                  v-if="!showPassword"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </div>
              <div class="input-underline"></div>
            </div>

            <button
              type="submit"
              class="main-btn btn-block mb-3 btn-enhanced"
              :disabled="isLoading"
              @click="createRipple"
            >
              <span class="btn-shine"></span>
              <span v-if="isLoading" class="btn-content">
                <span class="spinner"></span>
                Creating Account...
              </span>
              <span v-else class="btn-content">CREATE ACCOUNT</span>
            </button>
          </form>

          <div class="text-center mt-3 login-row">
            ALREADY HAVE AN ACCOUNT?
            <router-link to="/login" class="login-link">LOG IN</router-link>
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
      isLoading: false,
      showPassword: false,
      nameFocused: false,
      emailFocused: false,
      passwordFocused: false,
      showError: false,
      cursorX: 0,
      cursorY: 0,
      animatedStats: { artists: 0, fans: 0 },
      welcomeText: "DISCOVER SINGAPORE'S LOCAL MUSIC",
    }
  },
  computed: {
    cursorTrailStyle() {
      return {
        background: `radial-gradient(circle at ${this.cursorX}px ${this.cursorY}px, rgba(213, 34, 34, 0.15) 0%, transparent 50%)`,
      }
    },
  },
  mounted() {
    // Animate stats
    let artistCount = 0
    let fanCount = 0
    const artistTarget = 500
    const fanTarget = 2000

    const interval = setInterval(() => {
      if (artistCount < artistTarget) {
        artistCount += 10
        this.animatedStats.artists = Math.min(artistCount, artistTarget)
      }
      if (fanCount < fanTarget) {
        fanCount += 40
        this.animatedStats.fans = Math.min(fanCount, fanTarget)
      }
      if (artistCount >= artistTarget && fanCount >= fanTarget) {
        clearInterval(interval)
      }
    }, 30)
  },
  methods: {
    handleMouseMove(e) {
      this.cursorX = e.clientX
      this.cursorY = e.clientY
    },
    getParticleStyle(n) {
      const size = 20 + Math.random() * 15
      const left = Math.random() * 100
      const duration = 8 + Math.random() * 7
      const delay = Math.random() * 5
      return {
        fontSize: `${size}px`,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `-${delay}s`,
        opacity: 0.3 + Math.random() * 0.3,
      }
    },
    getMusicSymbol(n) {
      const symbols = ['♪', '♫', '♬', '♩', '♭', '♯', '𝄞']
      return symbols[n % symbols.length]
    },
    createRipple(e) {
      const button = e.currentTarget
      const ripple = document.createElement('span')
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + 'px'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.classList.add('ripple')

      button.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    },
    async register() {
      this.errorMessage = ''
      this.showError = false

      if (this.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters'
        this.showError = true
        setTimeout(() => {
          this.showError = false
        }, 500)
        return
      }

      this.isLoading = true

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)

        const user = userCredential.user

        await setDoc(doc(db, 'users', user.uid), {
          email: this.email,
          userType: this.userType,
          displayName: this.displayName,
          profileImage: '',
          preferences: {
            genres: [],
            location: 'Singapore',
          },
          createdAt: new Date(),
          lastActive: new Date(),
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
              instagram: '',
            },
            musicLinks: [],
            followerCount: 0,
            verified: false,
            createdAt: new Date(),
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
          this.errorMessage =
            'This email is already registered. If you deleted your account, please contact support to fully remove it from the system, or use the login page instead.'
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'Invalid email address'
        } else if (error.code === 'auth/weak-password') {
          this.errorMessage = 'Password is too weak. Please use at least 6 characters.'
        } else {
          this.errorMessage = 'Registration failed. Please try again.'
        }

        this.showError = true
        setTimeout(() => {
          this.showError = false
        }, 500)
      }

      this.isLoading = false
    },
  },
}
</script>

<style scoped>
/* Cursor Trail */
.cursor-trail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  transition: background 0.15s ease;
}

/* Music Particles */
.music-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.music-note {
  position: absolute;
  bottom: -50px;
  color: rgba(213, 34, 34, 0.4);
  animation: float-up linear infinite;
  font-weight: 600;
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.content-wrapper {
  position: relative;
  z-index: 1;
}
.auth-wrapper {
  min-height: 100vh;
  background: #191717;
  position: relative;
  font-family: 'Poppins', sans-serif;
}

.wave-svg {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100vw;
  height: 300px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
  overflow: hidden;
}

.wave-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}

.auth-wrapper::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(ellipse at center, rgba(187, 24, 20, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse at 30% 50%, rgba(199, 53, 53, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(187, 24, 20, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.auth-split {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
}
.auth-left {
  flex: 1 1 50%;
  min-width: 330px;
  background: transparent;
  color: #fff;
  padding: 42px 0 42px 68px;
  position: relative;
  overflow: hidden;
  z-index: 2;
}
.auth-logo {
  width: 136px;
  margin-top: 18px;
  margin-bottom: 48px;
  transition: transform 0.4s ease;
}

.logo-3d {
  transition: transform 0.5s ease;
}

.logo-3d:hover {
  transform: perspective(500px) rotateY(10deg) rotateX(-5deg) scale(1.05);
}

.tagline-split {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: 0.5px;
  margin-bottom: 0;
  text-shadow: none;
}

/* Animated Welcome Text */
.animated-text {
  display: inline-block;
}

.letter {
  display: inline-block;
  opacity: 0;
  animation: letter-fade-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes letter-fade-in {
  0% {
    opacity: 0;
    transform: translateY(30px) rotateX(-90deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

/* Mini Stats */
.stats-mini {
  display: flex;
  gap: 40px;
}

.stat-mini-item {
  opacity: 0;
  animation: slide-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.8s;
}

.stat-mini-item:nth-child(2) {
  animation-delay: 1s;
}

.stat-mini-value {
  font-size: 2rem;
  font-weight: 700;
  color: #d52222;
  margin-bottom: 4px;
}

.stat-mini-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-right {
  flex: 1 1 50%;
  padding: 0;
  background: #b71c1c;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 330px;
  border-radius: 24px 0 0 24px;
}
.form-card {
  background: transparent;
  width: 100%;
  margin: 0 auto;
  color: #fff;
  border: none;
  border-radius: 0;
  padding: 10px 6rem;
}

/* Glassmorphism Card */
.glass-card {
  background: rgba(183, 28, 28, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
}

.glass-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

/* Shake Animation */
.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  80% {
    transform: translateX(4px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-8px);
  }
  40%,
  60% {
    transform: translateX(8px);
  }
}

.signup-title {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 2rem;
}
.toggle-row {
  gap: 16px;
  justify-content: center !important;
  margin-bottom: 3rem;
}
.toggle-btn {
  min-width: 150px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 2rem;
  padding: 0.8rem 2rem;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  outline: none;
  margin-right: 1.2rem;
  position: relative;
  overflow: hidden;
}

.toggle-enhanced {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.toggle-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.toggle-btn:hover .toggle-icon {
  transform: scale(1.2) rotate(10deg);
}

.toggle-btn.selected {
  background: #fff;
  color: #b71c1c;
  border: 3px solid #fff;
  transform: scale(1.05);
}

.toggle-btn.selected .toggle-icon {
  animation: bounce-icon 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounce-icon {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.toggle-btn.outline {
  background: transparent;
  color: #fff;
}
.toggle-btn:last-child {
  margin-right: 0;
}

/* Error Alert with Animation */
.error-alert {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
}

.error-slide-enter-active {
  animation: error-slide-in 0.3s ease;
}

.error-slide-leave-active {
  animation: error-slide-out 0.3s ease;
}

@keyframes error-slide-in {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes error-slide-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Enhanced Input Groups */
.input-group-enhanced {
  position: relative;
  margin-bottom: 2rem;
}

.input-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  z-index: 2;
}

.input-group-enhanced:focus-within .input-icon {
  color: #fff;
}

.icon-pulse {
  animation: icon-pulse 2s ease infinite;
}

@keyframes icon-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.icon-shake {
  animation: icon-shake 0.5s ease;
}

@keyframes icon-shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.input-enhanced {
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  color: #fff;
  font-size: 1rem;
  padding: 12px 0 12px 35px;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
}

.input-enhanced:focus {
  background: transparent;
  border-bottom: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.input-enhanced::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.floating-label {
  position: absolute;
  left: 35px;
  top: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.floating-label.active {
  top: -20px;
  left: 0;
  font-size: 0.8rem;
  color: #fff;
  font-weight: 600;
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.8));
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.input-group-enhanced:focus-within .input-underline {
  width: 100%;
}

/* Password Toggle */
.password-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.password-toggle:hover {
  color: #fff;
  transform: translateY(-50%) scale(1.1);
}

.password-toggle svg {
  transition: transform 0.3s ease;
}

.password-toggle:active svg {
  transform: rotateY(180deg);
}

/* Enhanced Button */
.btn-enhanced {
  position: relative;
  background: #fff;
  color: #b71c1c;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 1rem;
  padding: 1rem;
  border: none;
  width: 100%;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.btn-enhanced:active {
  transform: translateY(0);
}

.btn-enhanced:disabled {
  background: rgba(255, 255, 255, 0.5);
  color: rgba(183, 28, 28, 0.5);
  cursor: not-allowed;
  transform: none;
}

.btn-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(213, 34, 34, 0.2), transparent);
  transform: rotate(45deg);
  animation: shine 3s linear infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(183, 28, 28, 0.3);
  border-top: 2px solid #b71c1c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Ripple Effect */
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(183, 28, 28, 0.4);
  transform: scale(0);
  animation: ripple-animation 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.input-lg.form-control {
  border-radius: 0;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  background: transparent;
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem 0;
  width: 100%;
  outline: none;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}
.input-lg.form-control::placeholder {
  color: rgba(255, 255, 255, 0.9);
  font-weight: normal;
}
.input-lg.form-control:focus {
  background: transparent;
  box-shadow: none;
  border-bottom: 3px solid #fff;
}
.input-lg.form-control:disabled {
  color: #ccc;
}
.main-btn {
  background: #fff;
  color: #b71c1c;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 1rem;
  padding: 1rem;
  border: none;
  width: 100%;
  transition:
    background 0.2s,
    color 0.2s;
}
.main-btn:disabled {
  background: #f4f4f4 !important;
  color: #c9a8a8 !important;
}
.login-row {
  color: #fff;
  font-weight: normal;
  font-size: 1rem;
  margin-top: 2rem;
  letter-spacing: 0.1px;
}
.login-link {
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  margin-left: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.login-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #fff;
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.login-link:hover {
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.login-link:hover::after {
  width: 100%;
}

.alert-danger {
  background: #a12121;
  border: none;
  color: #fff;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 24px;
}
@media (max-width: 991px) {
  .auth-split {
    flex-direction: column;
  }
  .auth-left,
  .auth-right {
    min-width: unset;
    border-radius: 0 !important;
  }
  .auth-right {
    border-radius: 0;
  }
  .form-card {
    padding: 2rem 3rem;
  }
}
@media (max-width: 600px) {
  .signup-title {
    font-size: 2rem;
  }
  .auth-logo {
    width: 110px;
  }
  .tagline-split {
    font-size: 1.1rem;
  }
  .toggle-btn {
    min-width: 100px;
    font-size: 1rem;
  }
}
</style>
