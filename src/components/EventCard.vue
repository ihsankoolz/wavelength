<!-- eventcard.vue component -->
<template>
  <div class="event-card">
    <!-- Red Header with Event Title -->
    <div class="event-header">
      {{ event.title }}
    </div>

    <!-- Event Body -->
    <div class="event-body">
      <!-- Artist Info & Details -->
      <div class="event-info" @click="viewDetails">
        <img :src="artist?.profileImage || defaultImage" :alt="artist?.artistName" class="event-artist-photo" />
        <div class="event-info-text">
          <h5 class="event-artist-name">{{ event.artistName }}</h5>
          <p class="event-venue">{{ event.venue || event.location }}</p>
        </div>

        <!-- Date Box on Right -->
        <div class="event-date-box">
          <div class="date-day">{{ formatEventDay(event.date) }}</div>
          <div class="date-month">{{ formatEventMonth(event.date) }}</div>
        </div>
      </div>

      <!-- Genres as plain text -->
      <p class="event-genres-text" v-if="event.genres && event.genres.length > 0">
        {{ event.genres.join(', ') }}
      </p>

      <!-- Map Preview -->
      <div class="event-map-preview" @click.stop>
        <EventMap :location="event.location" :title="event.venue || event.title" size="small" />
      </div>

      <!-- Interested Count -->
      <p class="interested-count">
        {{ event.interestedCount || 0 }}
        {{ (event.interestedCount || 0) === 1 ? 'Other' : 'Others' }} Interested
      </p>

      <!-- I'm Interested Button -->
      <button class="btn-interested" :class="{ 'btn-interested-active': isInterested }" @click.stop="toggleInterest"
        :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <span v-else-if="isInterested" class="me-2">✓</span>
        {{ loading ? 'Updating...' : isInterested ? 'INTERESTED' : "I'M INTERESTED" }}
      </button>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import {
  markEventInterested,
  unmarkEventInterested,
  isUserInterestedInEvent,
} from '@/utils/userInteractions'
import EventMap from '@/components/EventMap.vue'

export default {
  name: 'EventCard',
  components: {
    EventMap,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isInterested: false,
      loading: false,
      artist: null,
      defaultImage: 'https://ui-avatars.com/api/?name=Artist&size=200&background=667eea&color=fff',
    }
  },
  async mounted() {
    await this.checkInterestStatus()
    await this.fetchArtistData()
  },
  methods: {
    async checkInterestStatus() {
      try {
        const user = auth.currentUser
        if (user && this.event.id) {
          this.isInterested = await isUserInterestedInEvent(user.uid, this.event.id)
        }
      } catch (error) {
        console.error('Error checking interest status:', error)
      }
    },

    async fetchArtistData() {
      try {
        if (this.event.artistId) {
          const artistDoc = await getDoc(doc(db, 'artists', this.event.artistId))
          if (artistDoc.exists()) {
            this.artist = artistDoc.data()
          }
        }
      } catch (error) {
        console.error('Failed to fetch artist data:', error)
      }
    },

    async toggleInterest() {
      const user = auth.currentUser
      if (!user) {
        alert('Please log in to mark events as interested')
        return
      }

      this.loading = true

      try {
        if (this.isInterested) {
          // Remove interest
          const result = await unmarkEventInterested(user.uid, this.event.id)
          if (result.success) {
            this.isInterested = false
            // Update local count
            if (this.event.interestedCount > 0) {
              this.event.interestedCount--
            }
            this.$emit('interest-changed', {
              eventId: this.event.id,
              interested: false,
              count: this.event.interestedCount,
            })
          }
        } else {
          // Add interest
          const result = await markEventInterested(user.uid, this.event.id)
          if (result.success) {
            this.isInterested = true
            // Update local count
            this.event.interestedCount = (this.event.interestedCount || 0) + 1
            this.$emit('interest-changed', {
              eventId: this.event.id,
              interested: true,
              count: this.event.interestedCount,
            })
          }
        }
      } catch (error) {
        console.error('Error toggling interest:', error)
        alert('Failed to update interest. Please try again.')
      } finally {
        this.loading = false
      }
    },

    formatEventDay(date) {
      const eventDate = date?.toDate ? date.toDate() : new Date(date)
      return eventDate.getDate()
    },

    formatEventMonth(date) {
      const eventDate = date?.toDate ? date.toDate() : new Date(date)
      const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ]
      return months[eventDate.getMonth()]
    },

    viewDetails() {
      this.$router.push(`/events/${this.event.id}`)
    },
  },
}
</script>

<style scoped>
/* Event Card */
.event-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-family: 'Poppins', sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(187, 24, 20, 0.3);
  border-color: #bb1814;
}

/* Red Header */
.event-header {
  background: #bb1814;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 1rem 1.25rem;
  text-align: center;
  letter-spacing: 0.5px;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Event Body */
.event-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Event Info Section */
.event-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.event-artist-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #bb1814;
  flex-shrink: 0;
}

.event-info-text {
  flex: 1;
  min-width: 0;
}

.event-artist-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.3rem;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-venue {
  font-size: 0.85rem;
  color: #b0b1ba;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Date Box on Right */
.event-date-box {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #bb1814 0%, #960f0c 100%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(187, 24, 20, 0.3);
}

.event-date-box .date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  font-family: 'Poppins', sans-serif;
}

.event-date-box .date-month {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
  text-transform: uppercase;
  font-family: 'Poppins', sans-serif;
}

/* Event Genres as Plain Text */
.event-genres-text {
  font-size: 0.9rem;
  font-weight: 400;
  color: #b0b1ba;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}

/* Map Preview */
.event-map-preview {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
}

.event-map-preview :deep(iframe),
.event-map-preview :deep(div) {
  position: absolute;
  top: -32px;
  left: 0;
  width: 100%;
  height: calc(100% + 80px);
}

/* Interested Count */
.interested-count {
  font-size: 0.9rem;
  color: #b0b1ba;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

/* I'm Interested Button */
.btn-interested {
  width: 100%;
  background: #bb1814;
  color: #fff;
  border: 2px solid #bb1814;
  border-radius: 22px;
  padding: 8px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
}

.btn-interested:hover {
  background: #6e0b0b;
  border: 2px solid #6e0b0b;
  color: white;
  transform: none;
}

.btn-interested.btn-interested-active {
  background: transparent;
  border: 2px solid #bb1814;
}

.btn-interested.btn-interested-active:hover:not(:disabled) {
  background: #bb1814;
  color: white;
}

.btn-interested:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}

/* Responsive Styles - Remove all the responsive sizing */
@media (max-width: 768px) {
  .event-info {
    gap: 0.75rem;
  }
}
</style>