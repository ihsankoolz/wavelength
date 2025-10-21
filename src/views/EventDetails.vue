<!-- EventDetails.vue -->
 <template>
  <div class="event-details-page">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Loading State -->
    <div v-if="loading" class="content-wrapper">
      <div class="container text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading event details...</p>
      </div>
    </div>

    <!-- Event Not Found -->
    <div v-else-if="!event" class="content-wrapper">
      <div class="container text-center py-5">
        <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
        <h3>Event Not Found</h3>
        <p class="text-muted">This event may have been removed.</p>
        <router-link to="/events" class="btn btn-primary">
          Browse All Events
        </router-link>
      </div>
    </div>

    <!-- Event Details -->
    <div v-else class="content-wrapper">
      <div class="container py-4">
        <div class="row">
          
          <!-- Main Event Info -->
          <div class="col-12 col-lg-8 mb-4">
            <div class="card shadow-lg border-0">
              <div class="card-body p-4 p-md-5">
                
                <!-- Event Title -->
                <h1 class="display-4 fw-bold mb-3">{{ event.title }}</h1>

                <!-- Artist Name -->
                <div class="mb-4">
                  <h4 class="text-primary mb-0">
                    <i class="bi bi-music-note-beamed"></i>
                    {{ event.artistName }}
                  </h4>
                </div>

                <!-- Event Meta Info -->
                <div class="event-meta mb-4">
                  <div class="meta-item">
                    <i class="bi bi-calendar3 text-primary"></i>
                    <strong>Date:</strong> {{ formatDate(event.date) }}
                  </div>
                  <div class="meta-item">
                    <i class="bi bi-building text-primary"></i>
                    <strong>Venue:</strong> {{ event.venue }}
                  </div>
                  <div class="meta-item">
                    <i class="bi bi-geo-alt text-primary"></i>
                    <strong>Location:</strong> {{ event.location }}
                  </div>
                  <div class="meta-item">
                    <i class="bi bi-people text-primary"></i>
                    <strong>Interested:</strong> {{ event.interestedCount || 0 }} people
                  </div>
                </div>

                <!-- Genres -->
                <div class="mb-4">
                  <h6 class="mb-2">Genres:</h6>
                  <div class="d-flex flex-wrap gap-2">
                    <span 
                      v-for="genre in event.genres" 
                      :key="genre"
                      class="badge bg-primary"
                      style="font-size: 0.9rem; padding: 0.5rem 1rem;"
                    >
                      {{ genre }}
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <div class="mb-4">
                  <h5 class="mb-3">About This Event</h5>
                  <p class="text-muted" style="font-size: 1.1rem; line-height: 1.8;">
                    {{ event.description || 'No description provided.' }}
                  </p>
                </div>

                <!-- MAP section -->
                <div class="mb-4">
                  <h5 class="mb-3">
                    <i class="bi bi-map"></i> Event Location
                  </h5>
                  <EventMap 
                    :location="event.location" 
                    :title="event.venue"
                    size="large"
                  />
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2 d-md-flex">
                  <button 
                    class="btn btn-primary btn-lg flex-fill"
                    @click="markInterested"
                    :disabled="isInterested"
                  >
                    <i class="bi" :class="isInterested ? 'bi-star-fill' : 'bi-star'"></i>
                    {{ isInterested ? 'You\'re Interested!' : 'Mark as Interested' }}
                  </button>
                  <button 
                    class="btn btn-outline-primary btn-lg"
                    @click="getDirections"
                  >
                    <i class="bi bi-map"></i> Get Directions
                  </button>
                </div>

              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-12 col-lg-4">
            
            <!-- Artist Info Card -->
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <h5 class="card-title">About the Artist</h5>
                <p class="mb-3">
                  <strong>{{ event.artistName }}</strong>
                </p>
                <router-link 
                  :to="`/artist/${event.artistId}`" 
                  class="btn btn-outline-primary w-100"
                >
                  View Artist Profile
                </router-link>
              </div>
            </div>

            <!-- Share Card -->
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title">Share This Event</h5>
                <p class="text-muted small">Spread the word!</p>
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-secondary" @click="shareEvent">
                    <i class="bi bi-share"></i> Share Event
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import EventMap from '@/components/EventMap.vue'
import NavigationBar from '@/components/NavigationBar.vue'

export default {
  name: 'EventDetails',
  components: {
    EventMap,
    NavigationBar
  },
  data() {
    return {
      event: null,
      loading: true,
      isInterested: false
    }
  },
  async mounted() {
    await this.loadEvent()
  },
  methods: {
    async loadEvent() {
      try {
        const eventId = this.$route.params.id
        const eventDoc = await getDoc(doc(db, 'events', eventId))
        
        if (eventDoc.exists()) {
          this.event = {
            id: eventDoc.id,
            ...eventDoc.data()
          }
        }
      } catch (error) {
        console.error('Error loading event:', error)
      } finally {
        this.loading = false
      }
    },

    formatDate(date) {
      if (!date) return 'TBA'
      
      const eventDate = date.toDate ? date.toDate() : new Date(date)
      
      return eventDate.toLocaleDateString('en-SG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    markInterested() {
      // TODO: Implement interested functionality with Firestore
      this.isInterested = true
      alert('Marked as interested! (Feature will be fully implemented soon)')
    },

    getDirections() {
      const address = encodeURIComponent(this.event.location)
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
    },

    shareEvent() {
      if (navigator.share) {
        navigator.share({
          title: this.event.title,
          text: `Check out ${this.event.title} by ${this.event.artistName}!`,
          url: window.location.href
        }).catch(err => console.log('Share failed:', err))
      } else {
        // Fallback: copy link
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    }
  }
}
</script>

<style scoped>
.event-details-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-logo {
  height: 80px;
  width: auto;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

.card {
  border-radius: 12px;
}

.event-meta {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 1.1rem;
}

.meta-item i {
  font-size: 1.3rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.btn-outline-light {
  border: 2px solid white;
  color: white;
}

.btn-outline-light:hover {
  background: white;
  color: #667eea;
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 100px;
  }
  
  .display-4 {
    font-size: 2rem;
  }
}
</style>