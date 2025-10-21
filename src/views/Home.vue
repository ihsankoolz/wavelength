<!-- home.vue -->
<template>
  <div class="fan-homepage">
    
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">

        <!-- Welcome Header -->
        <div class="welcome-section mb-5">
          <h1 class="display-5 fw-bold mb-2">Welcome back, {{ userName }}! 👋</h1>
          <p class="text-muted">Discover new artists and events in Singapore's local music scene</p>
        </div>

        <!-- Search Bar -->
        <div class="search-section mb-5">
          <div class="row">
            <div class="col-12 col-md-8 col-lg-6 mx-auto">
              <div class="input-group input-group-lg">
                <span class="input-group-text bg-white">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search for artists..."
                  v-model="searchQuery"
                  @input="searchArtists"
                >
              </div>
              
              <!-- Genre Filter Pills -->
              <div class="genre-filters mt-3 d-flex flex-wrap gap-2 justify-content-center">
                <button 
                  v-for="genre in userGenres" 
                  :key="genre"
                  class="btn btn-sm btn-outline-primary"
                  :class="{ active: selectedGenreFilter === genre }"
                  @click="filterByGenre(genre)"
                >
                  {{ genre }}
                </button>
                <button 
                  v-if="selectedGenreFilter"
                  class="btn btn-sm btn-secondary"
                  @click="clearGenreFilter"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading recommendations...</p>
        </div>

        <!-- Content (only show when not loading) -->
        <div v-else>

          <!-- Recommended Artists Section -->
          <section class="recommended-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 class="h3 mb-1">🎯 Recommended For You</h2>
                <p class="text-muted mb-0">Based on your favorite genres: {{ userGenres.join(', ') }}</p>
              </div>
            </div>

            <!-- No recommendations message -->
            <div v-if="recommendedArtists.length === 0" class="text-center py-5">
              <i class="bi bi-music-note-list fs-1 text-muted mb-3"></i>
              <p class="text-muted">No artists found matching your genres yet.</p>
              <p class="text-muted small">Check back soon as more artists join!</p>
            </div>

            <!-- Artist Cards Grid -->
            <div v-else class="row g-4">
              <div 
                v-for="artist in displayedArtists" 
                :key="artist.id"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <ArtistCard :artist="artist" />
              </div>
            </div>
          </section>

          <!-- Upcoming Events Section -->
          <section class="events-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 class="h3 mb-1">🎪 Upcoming Events</h2>
                <p class="text-muted mb-0">Don't miss these shows happening in Singapore</p>
              </div>
              <router-link to="/events" class="btn btn-outline-primary btn-sm">
                View All Events
              </router-link>
            </div>

            <!-- No events message -->
            <div v-if="upcomingEvents.length === 0" class="text-center py-5">
              <i class="bi bi-calendar-event fs-1 text-muted mb-3"></i>
              <p class="text-muted">No upcoming events yet.</p>
            </div>

            <!-- Event Cards Grid -->
            <div v-else class="row g-4">
              <div 
                v-for="event in upcomingEvents" 
                :key="event.id"
                class="col-12 col-md-6 col-lg-4"
              >
                <EventCard :event="event" />
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { signOut } from 'firebase/auth'
import { auth, db } from '@/services/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import NavigationBar from '@/components/NavigationBar.vue'
import ArtistCard from '@/components/ArtistCard.vue'
import EventCard from '@/components/EventCard.vue'

export default {
  name: 'FanHomepage',
  components: {
    ArtistCard,
    EventCard,
    NavigationBar
  },
  data() {
    return {
      userName: '',
      userGenres: [],
      allArtists: [],
      recommendedArtists: [],
      displayedArtists: [],
      upcomingEvents: [],
      searchQuery: '',
      selectedGenreFilter: null,
      isLoading: true
    }
  },
  async mounted() {
    await this.loadUserData()
    await this.loadArtists()
    await this.loadEvents()
    this.isLoading = false
  },
  methods: {
    async loadUserData() {
      try {
        const user = auth.currentUser
        if (!user) {
          this.$router.push('/login')
          return
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          this.userName = userData.displayName
          this.userGenres = userData.preferences?.genres || []
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    },

    async loadArtists() {
      try {
        const artistsSnapshot = await getDocs(collection(db, 'artists'))
        this.allArtists = artistsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Run recommendation algorithm
        this.recommendedArtists = this.getRecommendedArtists()
        this.displayedArtists = this.recommendedArtists
      } catch (error) {
        console.error('Error loading artists:', error)
      }
    },

    async loadEvents() {
      try {
        const eventsSnapshot = await getDocs(collection(db, 'events'))
        
        const now = new Date()
        this.upcomingEvents = eventsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(event => {
            const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
            return eventDate > now
          })
          .sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
            return dateA - dateB
          })
          .slice(0, 6)
      } catch (error) {
        console.error('Error loading events:', error)
      }
    },

    getRecommendedArtists() {
      if (this.userGenres.length === 0) {
        return this.allArtists.slice(0, 8)
      }

      const scoredArtists = this.allArtists.map(artist => {
        let score = 0
        
        if (artist.genres && Array.isArray(artist.genres)) {
          artist.genres.forEach(artistGenre => {
            if (this.userGenres.includes(artistGenre)) {
              score += 1
            }
          })
        }

        return { ...artist, score }
      })

      return scoredArtists
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score
          }
          return (b.followerCount || 0) - (a.followerCount || 0)
        })
        .slice(0, 8)
    },

    searchArtists() {
      if (!this.searchQuery.trim()) {
        this.displayedArtists = this.recommendedArtists
        return
      }

      const query = this.searchQuery.toLowerCase()
      this.displayedArtists = this.allArtists.filter(artist => {
        const nameMatch = artist.artistName?.toLowerCase().includes(query)
        const genreMatch = artist.genres?.some(genre => 
          genre.toLowerCase().includes(query)
        )
        return nameMatch || genreMatch
      })
    },

    filterByGenre(genre) {
      this.selectedGenreFilter = genre
      this.searchQuery = ''
      
      this.displayedArtists = this.allArtists.filter(artist => {
        return artist.genres?.includes(genre)
      })
    },

    clearGenreFilter() {
      this.selectedGenreFilter = null
      this.displayedArtists = this.recommendedArtists
    },

    goToProfile() {
      const user = auth.currentUser
      if (user) {
        this.$router.push(`/profile/${user.uid}`)
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}
</script>

<style scoped>
.fan-homepage {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand {
  color: white !important;
  text-decoration: none;
}

.navbar-logo {
  height: 80px;
  width: auto;
}

.btn-outline-light {
  border: 2px solid white;
  color: white;
}

.btn-outline-light:hover {
  background: white;
  color: #667eea;
}

.btn-light {
  background: white;
  color: #667eea;
}

.btn-light:hover {
  background: #f8f9fa;
  color: #667eea;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

.welcome-section h1 {
  color: #2c3e50;
}

.search-section .input-group {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 12px;
  overflow: hidden;
}

.search-section .form-control {
  border: none;
  padding: 0.75rem 1rem;
}

.search-section .form-control:focus {
  box-shadow: none;
}

.search-section .input-group-text {
  border: none;
  color: #667eea;
}

.genre-filters .btn {
  border-radius: 20px;
  font-size: 0.875rem;
}

.genre-filters .btn.active {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
}

.section-header h2 {
  color: #2c3e50;
  font-weight: 600;
}

.section-header p {
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 100px;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }
}
</style>