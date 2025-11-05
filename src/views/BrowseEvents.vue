<template>
  <div class="browse-events-page">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Dynamic Wave Background-->
    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="#bb1814" stroke-width="2" opacity="0.6">
          <animate attributeName="d" values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150" dur="3s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180" dur="4s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate attributeName="d" values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120" dur="5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate attributeName="d" values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate attributeName="d" values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60" dur="4.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="0.8" opacity="0.3">
          <animate attributeName="d" values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240" dur="6s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate attributeName="d" values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <!-- Header -->
        <div class="welcome-section mb-5">
          <h1 class="display-5 fw-bold mb-2">UPCOMING EVENTS</h1>
          <p class="text-muted">Discover live music performances happening in Singapore</p>
        </div>

        <!-- Filter Section -->
        <div class="card shadow-sm mb-5 filter-card">
          <div class="card-body">
            <h5 class="card-title mb-3">FILTER EVENTS</h5>
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
                <input type="date" class="form-control custom-date-input" v-model="filters.customDate" />
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
                <input type="text" class="form-control" v-model="filters.location" placeholder="Search by Venue" />
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

            <div class="mt-3 d-flex gap-3 justify-content-center">
              <button class="btn btn-primary" @click="applyFilters">APPLY FILTERS</button>
              <button class="btn btn-secondary" @click="clearFilters">CLEAR</button>
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

        <!-- View Toggle Buttons -->
        <div class="custom-tab-bar mb-4">
          <button class="tab-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
            GRID VIEW
          </button>
          <button class="tab-btn" :class="{ active: viewMode === 'map' }" @click="viewMode = 'map'">
            MAP VIEW
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
        <div v-else>
          <!-- No Events Message -->
          <div v-if="!isLoading && displayedEvents.length === 0" class="text-center py-5">
            <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
            <p class="text-muted">No events found matching your criteria.</p>
          </div>
          <!-- Events Grid -->
          <div v-else class="row g-4">
            <div v-for="event in displayedEvents" :key="event.id" class="col-12 col-md-6 col-lg-4">
              <EventCard :event="event" @interest-changed="handleInterestChange" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import {
  collection,
  getDocs,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore'
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
        'Indie',
        'Jazz',
        'Electronic',
        'Rock',
        'Pop',
        'Hip Hop',
        'R&B',
        'Folk',
        'Classical',
        'Metal',
        'Alternative',
        'Soul',
        'Blues',
        'Punk',
        'Reggae',
        'Country',
        'K-Pop',
        'EDM',
        'Funk',
        'Gospel',
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
    await this.checkIfInterested()
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
    handleInterestChange({ eventId, interested, count }) {
      // Update displayedEvents and allEvents for that event
      const updateList = (list) => {
        const evt = list.find((ev) => ev.id === eventId)
        if (evt) {
          evt.interestedCount = count
        }
      }
      updateList(this.displayedEvents)
      updateList(this.allEvents)
    },
    async checkIfInterested() {
      try {
        const user = auth.currentUser
        if (!user) return

        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          this.isInterested = userData.interestedEvents?.includes(this.$route.params.id) || false
        }
      } catch (error) {
        console.error('Error checking interest:', error)
      }
    },
    async markInterested() {
      if (this.isProcessing) return

      try {
        const user = auth.currentUser
        if (!user) {
          this.$router.push('/login')
          return
        }

        this.isProcessing = true
        const eventId = this.$route.params.id

        if (this.isInterested) {
          // Remove interest
          await updateDoc(doc(db, 'users', user.uid), {
            interestedEvents: arrayRemove(eventId),
          })

          await updateDoc(doc(db, 'events', eventId), {
            interestedCount: increment(-1),
          })

          this.isInterested = false
          this.event.interestedCount = Math.max(0, (this.event.interestedCount || 0) - 1)
        } else {
          // Add interest
          await updateDoc(doc(db, 'users', user.uid), {
            interestedEvents: arrayUnion(eventId),
          })

          await updateDoc(doc(db, 'events', eventId), {
            interestedCount: increment(1),
          })

          this.isInterested = true
          this.event.interestedCount = (this.event.interestedCount || 0) + 1
        }
      } catch (error) {
        console.error('Error updating interest:', error)
        alert('Failed to update interest. Please try again.')
      } finally {
        this.isProcessing = false
      }
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
  background: #191717;
  color: #fff;
  font-family: 'Poppins', sans-serif;
}

.content-wrapper {
  margin-top: 65px;
  padding-bottom: 40px;
}

.welcome-section h1 {
  color: #fff;
  font-weight: 700;
  font-size: 2.3rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-top: 2rem;
}

.welcome-section p {
  color: #d4d5db;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}


.card {
  border: none;
  border-radius: 14px;
  background: #232326;
  box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.3);
}

.card-title {
  color: #fff;
  font-weight: 700;
}

.form-label {
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.45rem;
}

/* Filter buttons */
.btn-primary {
  background: #bb1814;
  color: #fff;
  border-radius: 22px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  padding: 8px 24px;
  letter-spacing: 0.4px;
  cursor: pointer;
  box-sizing: border-box;
}

.btn-primary:hover {
  background: #6E0B0B;
  color: white;
  transform: none;
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid #bb1814;
  color: white;
  border-radius: 22px;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 8px 24px;
  letter-spacing: 0.4px;
  cursor: pointer;
  box-sizing: border-box;
  transform: none;
}

.btn-secondary:hover {
  background-color: #bb1814;
  color: white;
}

/* Badge for event count */
.badge.bg-primary {
  background-color: #bb1814 !important;
  color: #fff;
  font-size: 1rem;
}

/* Toggle tab styles */
.btn-group .btn {
  background: #232326;
  color: #fff;
  border: 1px solid #232326;
}

.btn-group .btn.active,
.btn-group .btn:focus,
.btn-group .btn:hover {
  background: #bb1814;
  color: #fff;
  border: 1px solid #bb1814;
  box-shadow: 0 2px 8px 0 rgba(187, 24, 20, 0.12);
}

.text-muted {
  color: #b0b1ba !important;
}

input::placeholder {
  color: #767683 !important;
  opacity: 1;
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 80px;
  }

  .welcome-section h1 {
    font-size: 2rem;
    padding-top: 1rem;
  }

  .welcome-section p {
    font-size: 0.85rem;
  }
}

::-webkit-scrollbar {
  width: 8px;
  background: #232326;
}

::-webkit-scrollbar-thumb {
  background: #25272a;
  border-radius: 14px;
}

.card.filter-card {
  background: rgba(35, 35, 38, 0.3) !important;
}

.card.filter-card .form-select,
.card.filter-card .form-control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  padding: 12px 16px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  outline: none !important;
  box-shadow: none !important;
  box-sizing: border-box;
  position: relative;
  transform: none !important;
}

.card.filter-card .form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23bb1814' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 16px;
  background-color: rgba(255, 255, 255, 0.1);
}

.card.filter-card .form-select:focus,
.card.filter-card .form-select:active {
  outline: none !important;
  border-color: #bb1814;
  background-color: rgba(255, 255, 255, 0.15);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23bb1814' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 16px;
  box-shadow: none !important;
  transform: none !important;
  position: relative;
  top: 0 !important;
  left: 0 !important;
}

.card.filter-card .form-control:focus {
  outline: none !important;
  border-color: #bb1814;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: none !important;
  transform: none !important;
}

.card.filter-card .form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.card.filter-card .custom-date-input::-webkit-calendar-picker-indicator {
  filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
  cursor: pointer;
}

.card.filter-card .form-select:disabled,
.card.filter-card .form-control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card.filter-card .form-select option {
  background: #232326;
  color: #fff;
  padding: 0.5rem;
  border: none;
}

.custom-tab-bar {
  display: flex;
  align-items: flex-end;
  position: relative;
  background: transparent;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1 1 auto;
  background: transparent;
  border: none;
  outline: none;
  font-weight: 700;
  color: #fff;
  padding: 18px 0 15px 0;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  transition:
    color 0.13s,
    background 0.13s;
  z-index: 2;
}

.tab-btn.active {
  background: #bb1814;
  color: #fff;
  border-radius: 16px 16px 0 0;
  position: relative;
  box-shadow: none;
}

.custom-tab-bar::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: #bb1814;
  z-index: 1;
}

/* Optional: space between tabs */
.tab-btn:not(:last-child) {
  margin-right: 28px;
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

.browse-events-page::before {
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
</style>
