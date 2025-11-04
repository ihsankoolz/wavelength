<template>
  <nav class="navbar-custom navbar navbar-expand-lg fixed-top">
    <div class="container-fluid">
      <!-- Logo and Search Bar -->
      <div class="d-flex align-items-center logo-search-container">
        <router-link to="/home" class="logo-container">
          <img src="/assets/logo1.png" alt="Wavelength" class="navbar-logo" />
        </router-link>
        <div class="search-bar d-none d-lg-flex position-relative">
          <i class="bi bi-search search-icon"></i>
          <input
            type="text"
            class="form-control"
            placeholder="Search artists, events..."
            v-model="searchQuery"
            @input="handleSearch"
            @focus="searchFocused = true"
            @blur="handleBlur"
          />

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

      <!-- Navigation Links and Icons -->
      <div class="d-flex align-items-center">
        <ul class="nav-links d-none d-lg-flex">
          <li>
            <router-link
              to="/home"
              :class="{ active: isActive('/home') }"
              @click="mobileMenuOpen = false"
            >
              HOME
            </router-link>
          </li>
          <li>
            <router-link
              to="/events"
              :class="{ active: isActive('/events') }"
              @click="mobileMenuOpen = false"
            >
              EVENTS
            </router-link>
          </li>
          <li>
            <router-link
              to="/my-interests"
              :class="{ active: isActive('/my-interests') }"
              @click="mobileMenuOpen = false"
            >
              MY WAVES
            </router-link>
          </li>
          <li>
            <router-link
              to="/my-music"
              :class="{ active: isActive('/my-music') }"
              @click="mobileMenuOpen = false"
            >
              MY SONGS
            </router-link>
          </li>
          <!-- Artist-Only Links -->
          <li v-if="userType === 'artist'">
            <router-link
              to="/artist/analytics"
              :class="{ active: isActive('/artist/analytics') }"
              @click="mobileMenuOpen = false"
            >
              MY ANALYTICS
            </router-link>
          </li>
        </ul>

        <div class="nav-icons d-none d-lg-flex">
          <!-- Notification Bell -->
          <NotificationBell />

          <!-- User Dropdown -->
          <div class="dropdown">
            <button
              class="dropdown-toggle profile-dropdown-btn"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="profile-icon-nav">
                <img :src="userAvatar" :alt="userName" />
              </div>
            </button>

            <!-- Dropdown Menu -->
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li v-if="currentUserId">
                <router-link
                  :to="userType === 'artist' ? '/artist/dashboard' : `/profile/${currentUserId}`"
                  class="dropdown-item"
                >
                  Profile
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
                  Edit Profile
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <button @click="handleLogout" class="dropdown-item">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Mobile Toggle Button -->
      <button
        class="navbar-toggler d-lg-none ms-2"
        type="button"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Mobile Menu -->
      <div class="collapse navbar-collapse d-lg-none" :class="{ show: mobileMenuOpen }">
        <div class="mobile-search-bar mb-3">
          <div class="search-bar position-relative">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="form-control"
              placeholder="Search artists, events..."
              v-model="searchQuery"
              @input="handleSearch"
              @focus="searchFocused = true"
              @blur="handleBlur"
            />
            <!-- Mobile Search Results Dropdown -->
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
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
              to="/home"
              class="nav-link"
              :class="{ active: isActive('/home') }"
              @click="mobileMenuOpen = false"
            >
              HOME
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/events"
              class="nav-link"
              :class="{ active: isActive('/events') }"
              @click="mobileMenuOpen = false"
            >
              EVENTS
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/my-interests"
              class="nav-link"
              :class="{ active: isActive('/my-interests') }"
              @click="mobileMenuOpen = false"
            >
              MY WAVES
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/my-music"
              class="nav-link"
              :class="{ active: isActive('/my-music') }"
              @click="mobileMenuOpen = false"
            >
              MY SONGS
            </router-link>
          </li>
          <li v-if="userType === 'artist'" class="nav-item">
            <router-link
              to="/artist/analytics"
              class="nav-link"
              :class="{ active: isActive('/artist/analytics') }"
              @click="mobileMenuOpen = false"
            >
              MY ANALYTICS
            </router-link>
          </li>
        </ul>
        <div class="mobile-nav-icons d-flex align-items-center justify-content-between mt-3">
          <NotificationBell />
          <div class="dropdown">
            <button
              class="dropdown-toggle profile-dropdown-btn"
              type="button"
              id="userDropdownMobile"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="profile-icon-nav">
                <img :src="userAvatar" :alt="userName" />
              </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdownMobile">
              <li v-if="currentUserId">
                <router-link
                  :to="userType === 'artist' ? '/artist/dashboard' : `/profile/${currentUserId}`"
                  class="dropdown-item"
                >
                  Profile
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
                  Edit Profile
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <button @click="handleLogout" class="dropdown-item">Logout</button>
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
            // For fans, use their profile image if available, otherwise use generated avatar
            if (userData.profileImage && userData.profileImage.trim() !== '') {
              this.userAvatar = userData.profileImage
            } else {
              this.userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userName)}&size=128&background=667eea&color=fff`
            }
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
    $route(to, from) {
      this.mobileMenuOpen = false
      // Reload user data when coming from edit profile pages
      if (
        from &&
        (from.path.includes('/edit-profile') || from.path.includes('/artist/edit-profile'))
      ) {
        this.loadUserData()
      }
    },
  },
}
</script>

<style scoped>
/* Navigation Bar */
.navbar-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(51, 51, 51, 0.5);
  z-index: 1000;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.navbar-custom.scrolled {
  background-color: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(51, 51, 51, 0.5);
}

.navbar-custom .container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-search-container {
  gap: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  text-decoration: none;
}

.navbar-logo {
  height: 50px;
  width: auto;
  display: block;
}

/* Search Bar */
.search-bar {
  width: 350px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
}

.search-bar .search-icon {
  position: absolute;
  left: 15px;
  color: #bb1814;
  font-size: 16px;
  z-index: 2;
  pointer-events: none;
  transition: all 0.3s ease;
}

.search-bar input {
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  padding: 12px 20px 12px 45px;
  color: #fff;
  font-size: 14px;
  width: 100%;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.search-bar input::placeholder {
  color: #b0b1ba;
  font-weight: 400;
}

.search-bar input:focus {
  outline: none;
  border-color: #bb1814;
  box-shadow: 0 0 0 3px rgba(187, 24, 20, 0.3);
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
}

.search-bar input:focus + .search-icon {
  color: #bb1814;
  transform: scale(1.1);
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-links li {
  display: flex;
  align-items: center;
}

.nav-links a {
  color: #ffffff;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.nav-links a:hover,
.nav-links a.active {
  color: #b51414;
}

/* Nav Icons */
.nav-icons {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-left: 1.5rem;
}

.nav-icons i {
  font-size: 20px;
  color: #ffffff;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.nav-icons i:hover {
  color: #b51414;
}

/* Notification Bell Icon */
.nav-icons :deep(.notification-bell) {
  color: #ffffff !important;
}

.nav-icons :deep(.notification-bell:hover),
.nav-icons :deep(.notification-bell.active) {
  color: #b51414 !important;
  background: rgba(181, 20, 20, 0.1) !important;
}

.nav-icons :deep(.notification-bell i) {
  color: inherit;
}

/* Profile Dropdown */
.profile-dropdown-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-dropdown-btn:focus {
  box-shadow: none;
  outline: none;
}

.profile-dropdown-btn::after {
  display: none;
}

.profile-icon-nav {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #b51414;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.profile-dropdown-btn:hover .profile-icon-nav {
  transform: scale(1.1);
}

.profile-icon-nav img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dropdown Menu */
.dropdown-menu {
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.dropdown-item {
  color: #ffffff;
  padding: 0.6rem 1.5rem;
  font-size: 14px;
  transition:
    background-color 0.3s,
    color 0.3s;
  text-decoration: none;
  display: block;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #b51414;
  color: #ffffff;
}

.dropdown-divider {
  background-color: #333;
  margin: 0.5rem 0;
}

/* Search Results Dropdown */
.search-results-dropdown {
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  border: 2px solid rgba(187, 24, 20, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1061;
  top: calc(100% + 8px) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.search-results-dropdown::-webkit-scrollbar {
  width: 6px;
}

.search-results-dropdown::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.search-results-dropdown::-webkit-scrollbar-thumb {
  background: #bb1814;
  border-radius: 3px;
}

.search-results-dropdown::-webkit-scrollbar-thumb:hover {
  background: #d41e1e;
}

.search-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-section:last-child {
  border-bottom: none;
}

.search-section-header {
  padding: 0.75rem 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  color: #bb1814;
  background: rgba(187, 24, 20, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Poppins', sans-serif;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-result-item {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'Poppins', sans-serif;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: rgba(187, 24, 20, 0.15);
  transform: translateX(5px);
  border-left: 3px solid #bb1814;
}

.result-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #bb1814;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.result-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #bb1814 0%, #8b1410 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(187, 24, 20, 0.4);
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.result-subtitle {
  font-size: 0.8rem;
  color: #b0b1ba;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Loading and Empty States */
.search-result-item.text-center {
  color: #b0b1ba;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
}

.search-result-item.text-center:hover {
  background: none;
  transform: none;
  border-left: none;
}

.spinner-border-sm {
  color: #bb1814 !important;
}

.text-primary {
  color: #bb1814 !important;
}

/* Navbar Toggler */
.navbar-toggler {
  border: 1px solid #ffffff;
  background-color: transparent;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* Mobile Menu Styles */
.navbar-collapse {
  border-top: 1px solid #333;
  margin-top: 1rem;
  padding-top: 1rem;
  transition: all 0.3s ease-in-out;
}

.navbar-nav .nav-link {
  color: #ffffff;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
  padding: 0.5rem 0;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active {
  color: #b51414;
}

.mobile-search-bar {
  padding: 0 1rem;
}

.mobile-search-bar .search-bar {
  width: 100%;
  max-width: 100%;
}

.mobile-nav-icons {
  padding: 0 1rem;
  gap: 1.5rem;
}

.nav-icon-mobile {
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;
  transition: color 0.3s;
}

.nav-icon-mobile:hover {
  color: #b51414;
}

/* Mobile Notification Bell Icon */
.mobile-nav-icons :deep(.notification-bell) {
  color: #ffffff !important;
}

.mobile-nav-icons :deep(.notification-bell:hover),
.mobile-nav-icons :deep(.notification-bell.active) {
  color: #b51414 !important;
  background: rgba(181, 20, 20, 0.1) !important;
}

.mobile-nav-icons :deep(.notification-bell i) {
  color: inherit;
}

/* Responsive Styles */
@media (max-width: 991.98px) {
  .navbar-custom {
    padding: 1rem;
  }

  .nav-links {
    gap: 1rem;
    font-size: 12px;
  }

  .search-bar {
    width: 100%;
  }

  .logo-search-container {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .navbar-custom {
    flex-wrap: wrap;
  }

  .search-bar {
    order: 3;
    width: 100%;
    margin-top: 1rem;
  }

  .nav-links {
    order: 2;
  }

  .search-results-dropdown {
    position: fixed !important;
    left: 1rem;
    right: 1rem;
    top: auto !important;
    width: auto !important;
    max-height: 60vh;
    margin-top: 0.5rem;
    transform: none !important;
  }

  .dropdown-menu {
    position: static !important;
    transform: none !important;
    width: 100%;
    margin-top: 0.5rem !important;
    border: 2px solid rgba(187, 24, 20, 0.3);
    background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  }

  .dropdown-item {
    color: #fff;
  }

  .dropdown-item:hover {
    background-color: #bb1814;
    color: #fff;
  }
}

@media (min-width: 992px) {
  .navbar-collapse.d-lg-none {
    display: none !important;
  }
}
</style>
