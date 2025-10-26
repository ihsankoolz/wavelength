<!-- BrowseEvents.vue -->
<template>
  <div class="browse-events-page">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <!-- Header -->
        <div class="welcome-section mb-5">
          <h1 class="display-5 fw-bold mb-2">🎪 Upcoming Events</h1>
          <p class="text-muted">Discover live music performances happening in Singapore</p>
        </div>

        <!-- Filter Section -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3"><i class="bi bi-funnel"></i> Filter Events</h5>
            <div class="row g-3">
              <!-- Date Range Filter -->
              <div class="col-md-3">
                <label class="form-label">Time Period:</label>
                <select class="form-select" v-model="filters.dateRange">
                  <option value="all">All Upcoming</option>
                  <option value="today">Today</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                  <option value="custom">Custom Date</option>
                </select>
              </div>

              <!-- Custom Date (shows only if custom selected) -->
              <div class="col-md-3" v-if="filters.dateRange === 'custom'">
                <label class="form-label">Custom Date:</label>
                <input type="date" class="form-control" v-model="filters.customDate" />
              </div>

              <!-- Genre Filter -->
              <div class="col-md-3">
                <label class="form-label">Genre:</label>
                <select class="form-select" v-model="filters.genre">
                  <option value="">All Genres</option>
                  <option v-for="genre in allGenres" :key="genre" :value="genre">
                    {{ genre }}
                  </option>
                </select>
              </div>

              <!-- Location Filter -->
              <div class="col-md-3">
                <label class="form-label">Location:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="filters.location"
                  placeholder="Search by venue or area"
                />
              </div>

              <!-- Sort By -->
              <div class="col-md-3">
                <label class="form-label">Sort By:</label>
                <select class="form-select" v-model="filters.sortBy">
                  <option value="date">Date (Earliest First)</option>
                  <option value="dateDesc">Date (Latest First)</option>
                  <option value="popularity">Popularity (Most Interest)</option>
                  <option value="newest">Newest Added</option>
                </select>
              </div>
            </div>

            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-primary" @click="applyFilters">
                <i class="bi bi-search"></i> Apply Filters
              </button>
              <button class="btn btn-secondary" @click="clearFilters">
                <i class="bi bi-x-circle"></i> Clear
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading events...</p>
        </div>

        <!-- Results Header -->
        <div v-else class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="mb-0">Available Events</h5>
          <span class="badge bg-primary fs-6">{{ displayedEvents.length }} events</span>
        </div>

        <!-- No Events Message -->
        <div v-if="!isLoading && displayedEvents.length === 0" class="text-center py-5">
          <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
          <p class="text-muted">No events found matching your criteria.</p>
          <button class="btn btn-outline-primary" @click="clearFilters">Clear Filters</button>
        </div>

        <!-- ADD THIS: View Toggle Buttons -->
        <div class="btn-group mb-4" role="group">
          <button
            type="button"
            class="btn btn-outline-primary"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <i class="bi bi-grid-3x3-gap"></i> Grid View
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            :class="{ active: viewMode === 'map' }"
            @click="viewMode = 'map'"
          >
            <i class="bi bi-map"></i> Map View
          </button>
        </div>

        <!-- Map View -->
        <div v-if="viewMode === 'map'" class="mb-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title"><i class="bi bi-map"></i> Event Discovery Map</h5>
              <p class="text-muted">Click on markers to see event details</p>
              <!-- FIX: Add :key to force re-render when switching views -->
              <DiscoveryMap :key="mapKey" :events="displayedEvents" />
            </div>
          </div>
        </div>

        <!-- Events Grid -->
        <div v-else class="row g-4">
          <div v-for="event in displayedEvents" :key="event.id" class="col-12 col-md-6 col-lg-4">
            <EventCard :event="event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import NavigationBar from '@/components/NavigationBar.vue'
import EventCard from '@/components/EventCard.vue'
import DiscoveryMap from '@/components/DiscoveryMap.vue'

export default {
  name: 'BrowseEvents',
  components: {
    EventCard,
    DiscoveryMap,
    NavigationBar,
  },
  data() {
    return {
      userName: '',
      allEvents: [],
      displayedEvents: [],
      filters: {
        dateRange: 'all',
        customDate: '',
        genre: '',
        location: '',
        sortBy: 'date',
      },
      allGenres: [
        'Pop',
        'Rock',
        'Hip Hop',
        'R&B',
        'Electronic',
        'Jazz',
        'Classical',
        'Country',
        'Indie',
        'Folk',
        'Metal',
        'Punk',
        'Reggae',
        'Blues',
        'Alternative',
        'K-Pop',
        'Mandopop',
        'Cantopop',
      ],
      isLoading: true,
      viewMode: 'grid',
      mapKey: 0, // FIX: Add key for map re-rendering
    }
  },
  watch: {
    // FIX: Watch viewMode and increment mapKey to force map re-render
    viewMode(newMode) {
      if (newMode === 'map') {
        this.mapKey++
      }
    },
  },
  async mounted() {
    await this.loadEvents()
  },
  methods: {
    // async loadUserData() {
    //   try {
    //     const user = auth.currentUser
    //     if (!user) {
    //       this.$router.push('/login')
    //       return
    //     }

    //     // Get user data
    //     const { doc, getDoc } = await import('firebase/firestore')
    //     const userDoc = await getDoc(doc(db, 'users', user.uid))
    //     if (userDoc.exists()) {
    //       this.userName = userDoc.data().displayName
    //     }
    //   } catch (error) {
    //     console.error('Error loading user data:', error)
    //   }
    // },

    async loadEvents() {
      try {
        this.isLoading = true

        // Get all events from Firestore
        const eventsSnapshot = await getDocs(
          query(collection(db, 'events'), orderBy('date', 'asc')),
        )

        const now = new Date()
        now.setHours(0, 0, 0, 0)

        // Filter for upcoming events only
        this.allEvents = eventsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((event) => {
            // Handle Firestore Timestamp
            const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
            return eventDate >= now
          })

        this.displayedEvents = [...this.allEvents]
      } catch (error) {
        console.error('Error loading events:', error)
        alert('Failed to load events')
      } finally {
        this.isLoading = false
      }
    },

    applyFilters() {
      let filtered = [...this.allEvents]
      const now = new Date()
      now.setHours(0, 0, 0, 0)

      // Filter by date range
      if (this.filters.dateRange !== 'all') {
        filtered = filtered.filter((event) => {
          const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)

          switch (this.filters.dateRange) {
            case 'today':
              return (
                eventDate.getFullYear() === now.getFullYear() &&
                eventDate.getMonth() === now.getMonth() &&
                eventDate.getDate() === now.getDate()
              )

            case 'thisWeek':
              const weekEnd = new Date(now)
              weekEnd.setDate(now.getDate() + 7)
              return eventDate >= now && eventDate <= weekEnd

            case 'thisMonth':
              return (
                eventDate.getFullYear() === now.getFullYear() &&
                eventDate.getMonth() === now.getMonth()
              )

            case 'custom':
              if (this.filters.customDate) {
                const filterDate = new Date(this.filters.customDate)
                return (
                  eventDate.getFullYear() === filterDate.getFullYear() &&
                  eventDate.getMonth() === filterDate.getMonth() &&
                  eventDate.getDate() === filterDate.getDate()
                )
              }
              return true

            default:
              return true
          }
        })
      }

      // Filter by genre
      if (this.filters.genre) {
        filtered = filtered.filter((event) => {
          return event.genres?.includes(this.filters.genre)
        })
      }

      // Filter by location
      if (this.filters.location) {
        const locationQuery = this.filters.location.toLowerCase()
        filtered = filtered.filter((event) => {
          return (
            event.venue?.toLowerCase().includes(locationQuery) ||
            event.location?.toLowerCase().includes(locationQuery)
          )
        })
      }

      // Sort results
      filtered.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
        const createdA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
        const createdB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)

        switch (this.filters.sortBy) {
          case 'date':
            return dateA - dateB // Earliest first

          case 'dateDesc':
            return dateB - dateA // Latest first

          case 'popularity':
            return (b.interestedCount || 0) - (a.interestedCount || 0) // Most popular first

          case 'newest':
            return createdB - createdA // Newest added first

          default:
            return dateA - dateB
        }
      })

      this.displayedEvents = filtered
    },

    clearFilters() {
      this.filters = {
        dateRange: 'all',
        customDate: '',
        genre: '',
        location: '',
        sortBy: 'date',
      }
      this.displayedEvents = [...this.allEvents]
    },

    // async logout() {
    //   try {
    //     await signOut(auth)
    //     this.$router.push('/login')
    //   } catch (error) {
    //     console.error('Logout error:', error)
    //   }
    // }
  },
}
</script>

<style scoped>
.browse-events-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 100px;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }
}
</style>
