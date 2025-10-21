<!-- NavigationBar.vue -->
<template>
  <nav class="main-navbar navbar navbar-expand-lg navbar-dark fixed-top">
    <div class="container-fluid px-4">
      
      <!-- Logo -->
      <router-link to="/home" class="navbar-brand d-flex align-items-center">
        <img src="/assets/logo1.png" alt="Wavelength" class="navbar-logo">
      </router-link>

      <!-- Mobile Toggle Button -->
      <button 
        class="navbar-toggler" 
        type="button" 
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Links -->
      <div class="collapse navbar-collapse" :class="{ show: mobileMenuOpen }">
        
        <!-- Left Side Nav Links -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link 
              to="/home" 
              class="nav-link"
              :class="{ active: isActive('/home') }"
              @click="mobileMenuOpen = false"
            >
              <i class="bi bi-house-door"></i>
              <span class="ms-2">Home</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link 
              to="/events" 
              class="nav-link"
              :class="{ active: isActive('/events') }"
              @click="mobileMenuOpen = false"
            >
              <i class="bi bi-calendar-event"></i>
              <span class="ms-2">Events</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link 
              to="/my-interests" 
              class="nav-link"
              :class="{ active: isActive('/my-interests') }"
              @click="mobileMenuOpen = false"
            >
              <i class="bi bi-heart"></i>
              <span class="ms-2">My Interests</span>
            </router-link>
          </li>

          <!-- Artist-Only Links -->
          <li v-if="userType === 'artist'" class="nav-item">
            <router-link 
              to="/artist/dashboard" 
              class="nav-link"
              :class="{ active: isActive('/artist/dashboard') }"
              @click="mobileMenuOpen = false"
            >
              <i class="bi bi-speedometer2"></i>
              <span class="ms-2">Dashboard</span>
            </router-link>
          </li>
        </ul>

        <!-- Right Side - User Menu -->
        <div class="d-flex align-items-center gap-3">
          
          <!-- User Info & Dropdown -->
          <div class="dropdown">
            <button 
              class="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <!-- User Avatar -->
              <img 
                :src="userAvatar" 
                :alt="userName"
                class="user-avatar me-2"
              >
              <span class="user-name d-none d-lg-inline">{{ userName }}</span>
            </button>

            <!-- Dropdown Menu -->
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <router-link :to="`/profile/${currentUserId}`" class="dropdown-item">
                  <i class="bi bi-person"></i> My Profile
                </router-link>
              </li>
              <li>
                <router-link :to="`/edit-profile/${currentUserId}`" class="dropdown-item">
                  <i class="bi bi-pencil"></i> Edit Profile
                </router-link>
              </li>
              <li v-if="userType === 'artist'">
                <router-link to="/events/create" class="dropdown-item">
                  <i class="bi bi-plus-circle"></i> Create Event
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button @click="handleLogout" class="dropdown-item text-danger">
                  <i class="bi bi-box-arrow-right"></i> Logout
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default {
  name: 'NavigationBar',
  data() {
    return {
      userName: '',
      userAvatar: '',
      userType: 'fan',
      currentUserId: '',
      mobileMenuOpen: false,
      defaultAvatar: 'https://ui-avatars.com/api/?name=User&size=128&background=667eea&color=fff'
    }
  },
  async mounted() {
    await this.loadUserData()
  },
  methods: {
    async loadUserData() {
      try {
        const user = auth.currentUser
        if (!user) {
          this.$router.push('/login')
          return
        }

        this.currentUserId = user.uid

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          this.userName = userData.displayName || 'User'
          this.userType = userData.userType || 'fan'
          
          // If artist, get artist profile image
          if (this.userType === 'artist') {
            const artistDoc = await getDoc(doc(db, 'artists', user.uid))
            if (artistDoc.exists()) {
              this.userAvatar = artistDoc.data().profileImage || this.defaultAvatar
            } else {
              this.userAvatar = this.defaultAvatar
            }
          } else {
            // For fans, use default avatar with their name
            this.userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userName)}&size=128&background=667eea&color=fff`
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        this.userAvatar = this.defaultAvatar
      }
    },

    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path)
    },

    async handleLogout() {
      try {
        await signOut(auth)
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        alert('Failed to logout. Please try again.')
      }
    }
  },
  watch: {
    // Close mobile menu when route changes
    '$route'() {
      this.mobileMenuOpen = false
    }
  }
}
</script>

<style scoped>
.main-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  padding: 0.75rem 0;
  z-index: 1050;
}

.navbar-logo {
  height: 70px;
  width: auto;
  transition: transform 0.3s ease;
}

.navbar-logo:hover {
  transform: scale(1.05);
}

/* Navigation Links */
.nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  margin: 0 0.25rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white !important;
  transform: translateY(-2px);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.25);
  color: white !important;
  font-weight: 600;
}

.nav-link i {
  font-size: 1.2rem;
}

/* User Avatar */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.user-name {
  font-weight: 500;
  margin-left: 0.5rem;
}

/* Dropdown Menu */
.dropdown-toggle::after {
  margin-left: 0.5rem;
}

.dropdown-menu {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-top: 0.5rem !important;
  min-width: 200px;
}

.dropdown-item {
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  padding-left: 1.5rem;
}

.dropdown-item i {
  margin-right: 0.75rem;
  width: 20px;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
  color: #dc3545 !important;
}

.dropdown-divider {
  margin: 0.5rem 0;
}

/* Mobile Styles */
@media (max-width: 991px) {
  .navbar-logo {
    height: 60px;
  }

  .navbar-collapse {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    border-radius: 12px;
    margin-top: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .nav-link {
    margin: 0.25rem 0;
    padding: 0.75rem 1rem !important;
  }

  .dropdown-menu {
    position: static !important;
    transform: none !important;
    width: 100%;
    margin-top: 1rem !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .user-name {
    display: inline !important;
  }
}

/* Navbar Toggler */
.navbar-toggler {
  border: 2px solid white;
  padding: 0.5rem 0.75rem;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* Animation for mobile menu */
.navbar-collapse {
  transition: all 0.3s ease-in-out;
}
</style>
