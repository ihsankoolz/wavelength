<template>
    <div class="container mt-5">

        <!-- Navigation Bar -->
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="/assets/logo1.png" alt="Wavelength" class="navbar-logo">
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="ms-auto d-flex gap-2">
                    <button @click="goToProfile" class="btn btn-outline-light">Profile</button>
                </div>
            </div>
        </div>
        </nav>

        <div class="welcome-message">
            <h1>Welcome to Wavelength!</h1>
            <p>You are logged in as: {{ userEmail }}</p>
            <button @click="logout" class="btn btn-danger">Logout</button>
        </div>
    </div>
</template>

<script>
import { signOut } from 'firebase/auth'
import { auth, db } from '@/services/firebase'
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore'
import ArtistCard from '@/components/ArtistCard.vue'
import EventCard from '@/components/EventCard.vue'

export default {
  name: 'FanHomepage',
  components: {
    ArtistCard,
    EventCard
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
        // Get events where date is in the future
        const eventsSnapshot = await getDocs(collection(db, 'events'))
        
        const now = new Date()
        this.upcomingEvents = eventsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(event => {
            // Filter events that haven't happened yet
            const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
            return eventDate > now
          })
          .sort((a, b) => {
            // Sort by date (earliest first)
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
            return dateA - dateB
          })
          .slice(0, 6) // Only show first 6 events
      } catch (error) {
        console.error('Error loading events:', error)
      }
    },

    getRecommendedArtists() {
      if (this.userGenres.length === 0) {
        // If no genres selected, return all artists
        return this.allArtists.slice(0, 8)
      }

      // Recommendation algorithm:
      // 1. Score each artist based on genre matches
      // 2. Sort by score (highest first)
      // 3. Return top artists

      const scoredArtists = this.allArtists.map(artist => {
        let score = 0
        
        // +1 point for each matching genre
        if (artist.genres && Array.isArray(artist.genres)) {
          artist.genres.forEach(artistGenre => {
            if (this.userGenres.includes(artistGenre)) {
              score += 1
            }
          })
        }

        return { ...artist, score }
      })

      // Sort by score (highest first), then by follower count
      return scoredArtists
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score
          }
          return (b.followerCount || 0) - (a.followerCount || 0)
        })
        .slice(0, 8) // Top 8 artists
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

.content-wrapper {
  margin-top: 80px;
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
    margin-top: 70px;
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