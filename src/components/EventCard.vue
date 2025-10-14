<!-- eventcard.vue component -->
<template>
  <div class="event-card">
    <div class="card h-100 shadow-sm">
      <div class="card-body">
        <!-- Event Title -->
        <h5 class="card-title mb-3">{{ event.title }}</h5>

        <!-- Artist -->
        <p class="event-detail mb-2">
          <i class="bi bi-music-note text-primary"></i>
          <strong>{{ event.artistName }}</strong>
        </p>

        <!-- Date & Time -->
        <p class="event-detail mb-2">
          <i class="bi bi-calendar3 text-primary"></i>
          {{ formatDate(event.date) }}
        </p>

        <!-- Venue -->
        <p class="event-detail mb-3">
          <i class="bi bi-geo-alt text-primary"></i>
          {{ event.venue }}
        </p>

        <!-- Small Map preview -->
        <div class="mt-3 event-card-map">
          <EventMap 
            :location="event.location" 
            :title="event.venue"
            size="small"
          />
        </div>

        <!-- Genre Tags -->
        <div class="genres mb-3">
          <span 
            v-for="genre in event.genres?.slice(0, 3)" 
            :key="genre"
            class="badge bg-light text-dark me-1"
          >
            {{ genre }}
          </span>
        </div>

        <!-- Interested Count -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <small class="text-muted">
            <i class="bi bi-people"></i> {{ event.interestedCount || 0 }} interested
          </small>
        </div>

        <!-- Action Buttons -->
        <div class="d-grid gap-2">
          <button class="btn btn-outline-primary btn-sm" @click="markInterested">
            <i class="bi bi-star"></i> I'm Interested
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventMap from '@/components/EventMap.vue'

export default {
  name: 'EventCard',
  components: {
    EventMap
  },
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return 'TBA'
      
      // Handle Firestore Timestamp
      const eventDate = date.toDate ? date.toDate() : new Date(date)
      
      const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      
      return eventDate.toLocaleDateString('en-SG', options)
    },
    viewDetails() {
      this.$router.push(`/events/${this.event.id}`)
    },
    markInterested() {
      // TODO: Implement interested functionality
      console.log('Interested in event:', this.event.title)
      alert(`Marked interested in "${this.event.title}"! (Feature coming soon)`)
    },
    getDirections() {
      const address = encodeURIComponent(this.event.location)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
    }
  }
}
</script>

<style scoped>
.event-card {
  transition: transform 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
}

.card {
  border: none;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.2rem;
}

.event-card-map {
  border-radius: 8px;
  overflow: hidden;
}

.event-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.event-detail i {
  font-size: 1.1rem;
}

.genres .badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
}

.btn-outline-primary {
  border-color: #667eea;
  color: #667eea;
  font-weight: 500;
}

.btn-outline-primary:hover {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
}
</style>