<!-- NavigationBar.vue -->
<template>
  <nav class="main-navbar navbar navbar-expand-lg navbar-dark fixed-top">
    <div class="container-fluid px-4">
      <!-- Logo -->
      <router-link to="/home" class="navbar-brand d-flex align-items-center">
        <img src="/assets/logo1.png" alt="Wavelength" class="navbar-logo" />
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

      <!-- Navigation Content -->
      <div class="collapse navbar-collapse" :class="{ show: mobileMenuOpen }">
        <!-- Left Side - Search Bar -->
        <div class="navbar-left me-auto">
          <div class="search-container position-relative">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Search artists, events..."
                v-model="searchQuery"
                @input="handleSearch"
                @focus="searchFocused = true"
                @blur="handleBlur"
              />
            </div>

            <!-- Search Results Dropdown -->
            <div
              v-if="showSearchResults"
              class="search-results-dropdown position-absolute w-100 mt-2"
              @mousedown.prevent
            >
              <!-- Loading State -->
              <div v-if="searchLoading" class="search-result-item text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span class="ms-2">Searching...</span>
              </div>

              <!-- Results -->
              <div v-else-if="hasResults">
                <!-- Artists Section -->
                <div v-if="searchResults.artists.length > 0" class="search-section">
                  <div class="search-section-header">
                    <i class="bi bi-music-note-beamed me-2"></i>Artists
                  </div>
                  <div
                    v-for="artist in searchResults.artists"
                    :key="artist.id"
                    class="search-result-item"
                    @click="navigateToArtist(artist.id)"
                  >
                    <img
                      :src="artist.profileImage || defaultAvatar"
                      :alt="artist.artistName"
                      class="result-avatar"
                    />
                    <div class="result-info">
                      <div class="result-title">{{ artist.artistName }}</div>
                      <div class="result-subtitle">
                        {{ artist.genres?.slice(0, 2).join(', ') || 'Artist' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Events Section -->
                <div v-if="searchResults.events.length > 0" class="search-section">
                  <div class="search-section-header">
                    <i class="bi bi-calendar-event me-2"></i>Events
                  </div>
                  <div
                    v-for="event in searchResults.events"
                    :key="event.id"
                    class="search-result-item"
                    @click="navigateToEvent(event.id)"
                  >
                    <div class="result-icon">
                      <i class="bi bi-calendar3"></i>
                    </div>
                    <div class="result-info">
                      <div class="result-title">{{ event.title }}</div>
                      <div class="result-subtitle">
                        {{ event.venue }} • {{ formatDate(event.date) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Results -->
              <div
                v-else-if="searchQuery.trim().length > 0"
                class="search-result-item text-center py-3 text-muted"
              >
                <i class="bi bi-search me-2"></i>No results found for "{{ searchQuery }}"
              </div>

              <!-- Empty State -->
              <div v-else class="search-result-item text-center py-3 text-muted">
                <i class="bi bi-search me-2"></i>Start typing to search...
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Nav Links & User Menu -->
        <div class="navbar-right d-flex align-items-center gap-3">
          <!-- Navigation Links -->
          <ul class="navbar-nav mb-0 d-flex flex-row align-items-center gap-2">
            <li class="nav-item">
              <router-link
                to="/home"
                class="nav-link"
                :class="{ active: isActive('/home') }"
                @click="mobileMenuOpen = false"
              >
                <i class="bi bi-house-door"></i>
                <span class="ms-1">Home</span>
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
                <span class="ms-1">Events</span>
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
                <span class="ms-1">My Waves</span>
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                to="/my-music"
                class="nav-link"
                :class="{ active: isActive('/my-music') }"
                @click="mobileMenuOpen = false"
              >
                <i class="bi bi-music-note-list"></i>
                <span class="ms-1">My Songs</span>
              </router-link>
            </li>

            <!-- Artist-Only Links -->
            <li v-if="userType === 'artist'" class="nav-item">
              <router-link
                to="/artist/analytics"
                class="nav-link"
                :class="{ active: isActive('/artist/analytics') }"
                @click="mobileMenuOpen = false"
              >
                <i class="bi bi-bar-chart-line"></i>
                <span class="ms-1">My Analytics</span>
              </router-link>
            </li>
          </ul>

          <!-- Notification Bell -->
          <NotificationBell />

          <!-- User Dropdown -->
          <div class="dropdown">
            <button
              class="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center p-0"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <!-- User Avatar -->
              <img :src="userAvatar" :alt="userName" class="user-avatar" />
            </button>

            <!-- Dropdown Menu -->
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li v-if="currentUserId">
                <router-link
                  :to="userType === 'artist' ? '/artist/dashboard' : `/profile/${currentUserId}`"
                  class="dropdown-item"
                >
                  <i class="bi bi-person"></i> My Profile
                </router-link>
              </li>
              <li v-if="currentUserId">
                <router-link
                  :to="
                    userType === 'artist'
                      ? '/artist/edit-profile'
                      : `/edit-profile/${currentUserId}`
                  "
                  class="dropdown-item"
                >
                  <i class="bi bi-pencil"></i> Edit Profile
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
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
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'
import NotificationBell from './NotificationBell.vue'

export default {
  name: 'NavigationBar',
  components: {
    NotificationBell,
  },
  data() {
    return {
      userName: '',
      userAvatar: '',
      userType: 'fan',
      currentUserId: '',
      mobileMenuOpen: false,
      defaultAvatar: 'https://ui-avatars.com/api/?name=User&size=128&background=667eea&color=fff',
      // Search state
      searchQuery: '',
      searchLoading: false,
      searchFocused: false,
      searchResults: {
        artists: [],
        events: [],
      },
      searchTimeout: null,
    }
  },
  computed: {
    showSearchResults() {
      return this.searchFocused && (this.searchQuery.trim().length > 0 || this.searchLoading)
    },
    hasResults() {
      return this.searchResults.artists.length > 0 || this.searchResults.events.length > 0
    },
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
    },

    // Search functionality
    handleSearch() {
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // Debounce search - wait 300ms after user stops typing
      this.searchTimeout = setTimeout(() => {
        this.performSearch()
      }, 300)
    },

    async performSearch() {
      const query = this.searchQuery.trim().toLowerCase()

      if (query.length === 0) {
        this.searchResults = { artists: [], events: [] }
        return
      }

      this.searchLoading = true

      try {
        // Search artists
        const artistsRef = collection(db, 'artists')
        const artistsSnapshot = await getDocs(artistsRef)

        const artists = artistsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((artist) => {
            const name = artist.artistName?.toLowerCase() || ''
            const genres = artist.genres?.map((g) => g.toLowerCase()).join(' ') || ''
            return name.includes(query) || genres.includes(query)
          })
          .slice(0, 5) // Limit to 5 results

        // Search events
        const eventsRef = collection(db, 'events')
        const eventsSnapshot = await getDocs(eventsRef)

        const events = eventsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((event) => {
            const title = event.title?.toLowerCase() || ''
            const venue = event.venue?.toLowerCase() || ''
            const location = event.location?.toLowerCase() || ''
            const genres = event.genres?.map((g) => g.toLowerCase()).join(' ') || ''
            return (
              title.includes(query) ||
              venue.includes(query) ||
              location.includes(query) ||
              genres.includes(query)
            )
          })
          .slice(0, 5) // Limit to 5 results

        this.searchResults = { artists, events }
      } catch (error) {
        console.error('Search error:', error)
        this.searchResults = { artists: [], events: [] }
      } finally {
        this.searchLoading = false
      }
    },

    handleBlur() {
      // Delay hiding results to allow click events to fire
      setTimeout(() => {
        this.searchFocused = false
      }, 300)
    },

    navigateToArtist(artistId) {
      console.log('Navigating to artist:', artistId)
      this.searchFocused = false
      this.searchQuery = ''
      this.searchResults = { artists: [], events: [] }
      this.$router.push(`/artist/${artistId}`)
    },

    navigateToEvent(eventId) {
      console.log('Navigating to event:', eventId)
      this.searchFocused = false
      this.searchQuery = ''
      this.searchResults = { artists: [], events: [] }
      this.$router.push(`/events/${eventId}`)
    },

    formatDate(date) {
      if (!date) return ''
      const dateObj = date.toDate ? date.toDate() : new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    },
  },
  watch: {
    // Close mobile menu when route changes
    $route() {
      this.mobileMenuOpen = false
    },
  },
}
</script>

<style scoped>
.main-navbar {
  background: var(--color-background-darker) !important;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  z-index: 1050;
}

.navbar-logo {
  height: 40px;
  width: auto;
  transition: transform 0.3s ease;
}

.navbar-logo:hover {
  transform: scale(1.05);
}

/* Navbar Layout */
.navbar-left {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 500px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Navigation Links */
.nav-link {
  color: var(--color-text-primary) !important;
  font-weight: 600;
  padding: 0.5rem 1rem !important;
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-link:hover {
  color: var(--color-primary-red) !important;
}

.nav-link.active {
  color: var(--color-primary-red) !important;
  font-weight: 700;
}

.nav-link i {
  font-size: 1.1rem;
  display: none;
}

/* User Avatar */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: var(--color-primary-red);
}

.user-name {
  font-weight: 500;
  margin-left: 0.5rem;
  color: var(--color-text-primary);
}

/* Dropdown Menu */
.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  background: var(--color-background-darker);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  margin-top: 0.5rem !important;
  min-width: 200px;
}

.dropdown-item {
  color: var(--color-text-primary);
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.dropdown-item.text-danger {
  color: var(--color-primary-red) !important;
}

.dropdown-item.text-danger:hover {
  background-color: rgba(220, 20, 60, 0.1);
}

.dropdown-divider {
  border-color: var(--color-border);
}

.dropdown-item i {
  margin-right: 0.75rem;
  width: 20px;
}

/* Search Bar Styles */
.search-container {
  width: 100%;
  max-width: 450px;
  z-index: 1060;
}

.search-container .input-group-text {
  background-color: white;
  border: none;
  padding: 0.65rem 1rem;
  border-radius: 25px 0 0 25px;
}

.search-container .form-control {
  background-color: white;
  border: none;
  padding: 0.65rem 1rem 0.65rem 0;
  border-radius: 0 25px 25px 0;
  font-size: 0.9rem;
  color: var(--color-text-dark);
}

.search-container .form-control::placeholder {
  color: #999;
}

.search-container .form-control:focus {
  box-shadow: none;
  outline: none;
}

.search-container .input-group-text i {
  color: #999;
  font-size: 1rem;
}

.input-group {
  border-radius: 25px;
  overflow: hidden;
}

/* Search Results Dropdown */
.search-results-dropdown {
  background: var(--color-background-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1061;
}

.search-section {
  border-bottom: 1px solid var(--color-border-light);
}

.search-section:last-child {
  border-bottom: none;
}

.search-section-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-primary-red);
  background-color: #f8f9fa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.search-result-item {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: var(--color-text-dark);
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f3f5;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f8f9fa;
  padding-left: 1.25rem;
}

.result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: 0.8rem;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mobile Styles */
@media (max-width: 991px) {
  .navbar-logo {
    height: 40px;
  }

  .navbar-collapse {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    border-radius: 12px;
    margin-top: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .navbar-left {
    width: 100%;
    margin-bottom: 1rem;
  }

  .navbar-right {
    width: 100%;
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem !important;
  }

  .navbar-right .navbar-nav {
    flex-direction: column !important;
    width: 100%;
    gap: 0.5rem !important;
  }

  .nav-link {
    padding: 0.75rem 1rem !important;
    width: 100%;
  }

  .search-container {
    width: 100%;
  }

  .search-results-dropdown {
    position: fixed !important;
    left: 1rem;
    right: 1rem;
    width: auto !important;
    max-height: 60vh;
  }

  .dropdown-menu {
    position: static !important;
    transform: none !important;
    width: 100%;
    margin-top: 0.5rem !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

@media (max-width: 768px) {
  .search-container {
    width: 100%;
  }
}

/* Navbar Toggler */
.navbar-toggler {
  border: 2px solid white;
  padding: 0.35rem 0.6rem;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  width: 20px;
  height: 20px;
}

/* Animation for mobile menu */
.navbar-collapse {
  transition: all 0.3s ease-in-out;
}
</style>
