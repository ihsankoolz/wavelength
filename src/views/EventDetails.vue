<!-- EventDetails.vue -->
<template>
  <div class="event-details-page">
    <!-- Navigation Bar -->
    <NavigationBar />
    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path id="wave1" fill="none" stroke="#B51414" stroke-width="2" opacity="0.6">
          <animate
            attributeName="d"
            values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                    M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                    M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave2" fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                    M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                    M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave3" fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                    M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                    M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave4" fill="none" stroke="#B51414" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                    M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                    M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave5" fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate
            attributeName="d"
            values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                    M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                    M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave6" fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate
            attributeName="d"
            values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                    M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                    M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave7" fill="none" stroke="#B51414" stroke-width="0.8" opacity="0.3">
          <animate
            attributeName="d"
            values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                    M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                    M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave8" fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                    M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                    M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
    <!-- Loading State -->
    <div v-if="loading" class="content-wrapper">
      <div class="container text-center py-5">
        <div class="loading-spinner" role="status">
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading event details...</p>
      </div>
    </div>

    <!-- Event Not Found -->
    <div v-else-if="!event" class="content-wrapper">
      <div class="container text-center py-5">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Event Not Found</h3>
        <p class="error-message">This event may have been removed.</p>
        <router-link to="/events" class="btn btn-primary-custom"> Browse All Events </router-link>
      </div>
    </div>

    <!-- Event Details -->
    <div v-else class="content-wrapper">
      <div class="container py-4">
        <!-- EVENT TITLE AND ARTIST -->
        <div class="mb-3">
          <h1 class="event-title-header mb-2">{{ event.title }}</h1>
          <div class="d-flex align-items-center mb-2">
            <img
              :src="artist?.profileImage || defaultImage"
              :alt="event.artistName"
              class="artist-profile-header"
            />
            <span class="artist-header-name ms-2 fw-bold">{{ event.artistName }}</span>
          </div>

          <div class="event-desc">
            <p>{{ event.description }}</p>
          </div>

          <!-- Prominent Interest Count -->
          <div class="interest-count-display">
            <div class="interest-count-main">
              <span class="interest-number">{{ event.interestedCount || 0 }}</span>
              <span class="interest-label">people interested</span>
            </div>
          </div>

          <div class="d-flex align-items-center justify-content-between mb-4 meta-action-bar">
            <div>
              <div class="event-datetime fw-bold mb-1">Date: {{ formatDate(event.date) }}</div>
              <div class="event-venue fw-bold">Venue: {{ event.venue }}</div>
            </div>

            <div class="text-center">
              <button
                class="btn btn-interest-header"
                :class="{ active: isInterested }"
                @click="markInterested"
                :disabled="isProcessing"
              >
                <i v-if="isInterested" class="bi bi-check-circle-fill me-2"></i>
                {{ isInterested ? 'INTERESTED' : "I'M INTERESTED" }}
              </button>
            </div>
          </div>

          <!-- <div class="event-desc mb-2">
        {{ event.description || 'No description provided.' }}
      </div>
      <div class="event-datetime-location mb-4 fw-bold">
        Date: {{ formatDate(event.date) }} <br>
        Venue: {{ event.venue }}
      </div>
      <button
        class="btn btn-interest-header"
        :class="{ active: isInterested }"
        @click="markInterested"
        :disabled="isProcessing"
      >
        I'M INTERESTED
      </button> -->
        </div>
        <!-- MAIN CARD ROW -->
        <div class="row">
          <div class="col-12 col-lg-8 mb-4">
            <!-- Big map and address -->
            <div class="event-map-card">
              <div class="map-container">
                <EventMap :location="event.location" :title="event.venue" size="large" />
              </div>
              <div class="map-details">
                <div class="address-label">Address: {{ event.location }}</div>
                <button class="btn btn-directions" @click="getDirections">GET DIRECTIONS</button>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <!-- TICKETS and SHARE -->
            <div class="event-action-card mb-4">
              <div class="card-content">
                <div class="card-header-text">GET THE TICKETS</div>
                <div class="card-subtitle">Get {{ event.title }} tickets here:</div>
                <a
                  v-if="event.ticket"
                  :href="event.ticket"
                  target="_blank"
                  class="btn btn-ticket w-100 mb-3"
                >
                  PURCHASE TICKETS
                </a>
              </div>
            </div>
            <div class="event-action-card">
              <div class="card-content">
                <div class="card-header-text">SHARE THIS EVENT</div>
                <div class="card-subtitle">Spread the word!</div>
                <button class="btn btn-share w-100" @click="shareEvent">SHARE EVENT</button>
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
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'
import EventMap from '@/components/EventMap.vue'
import NavigationBar from '@/components/NavigationBar.vue'

export default {
  name: 'EventDetails',
  components: {
    EventMap,
    NavigationBar,
  },
  data() {
    return {
      event: null,
      artist: null,
      loading: true,
      isInterested: false,
      isProcessing: false,
      defaultImage: 'https://ui-avatars.com/api/?name=Artist&size=200&background=667eea&color=fff',
    }
  },
  async mounted() {
    await this.loadEvent()
    await this.fetchArtistData()
    await this.checkIfInterested()
  },
  methods: {
    async loadEvent() {
      try {
        const eventId = this.$route.params.id
        const eventDoc = await getDoc(doc(db, 'events', eventId))

        if (eventDoc.exists()) {
          this.event = {
            id: eventDoc.id,
            ...eventDoc.data(),
          }
        }
      } catch (error) {
        console.error('Error loading event:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchArtistData() {
      try {
        if (this.event && this.event.artistId) {
          const artistDoc = await getDoc(doc(db, 'artists', this.event.artistId))
          if (artistDoc.exists()) {
            this.artist = artistDoc.data()
          }
        }
      } catch (error) {
        console.error('Failed to fetch artist data:', error)
      }
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

    formatDate(date) {
      if (!date) return 'TBA'

      const eventDate = date.toDate ? date.toDate() : new Date(date)

      return eventDate.toLocaleDateString('en-SG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
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

    getDirections() {
      const address = encodeURIComponent(this.event.location)
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
    },

    shareEvent() {
      if (navigator.share) {
        navigator
          .share({
            title: this.event.title,
            text: `Check out ${this.event.title} by ${this.event.artistName}!`,
            url: window.location.href,
          })
          .catch((err) => console.log('Share failed:', err))
      } else {
        // Fallback: copy link
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    },
  },
  watch: {
    // Watch for route changes (when navigating from one event to another)
    '$route.params.id': {
      handler(newId, oldId) {
        if (newId && newId !== oldId) {
          // Reset state
          this.loading = true
          this.event = null
          this.artist = null
          this.isInterested = false

          // Reload data for new event
          this.loadEvent()
          this.fetchArtistData()
          this.checkIfInterested()
        }
      },
      immediate: false,
    },
  },
}
</script>

<style scoped>
.content-wrapper {
  margin-top: 65px;
  padding-bottom: 40px;
}
.event-details-page {
  min-height: 100vh;
  background: #191717;
  position: relative;
}

.event-title-header {
  color: #fff;
  font-weight: 700;
  font-size: 2.1rem;
  margin-bottom: 0.6rem;
  letter-spacing: 1px;
}

.artist-profile-header {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #fff;
  background: #fff;
  box-shadow: none;
  margin-right: 8px;
}

.artist-header-name {
  color: #fff;
  font-size: 1.12rem;
}

.event-desc {
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
  font-size: 1.1rem;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 0.4rem;
}

.event-datetime-location {
  color: #fff;
  font-size: 1.03rem;
  margin-bottom: 0.9rem;
}

.btn-interest-header {
  background: #bb1814;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 25px;
  border: none;
  padding: 12px 24px;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-interest-header:hover:not(:disabled) {
  background: #960f0c;
  color: #fff;
  transform: scale(1.02);
}

.btn-interest-header:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-interest-header.active {
  background: #4a4a4a;
  color: #fff;
}

.btn-interest-header.active:hover:not(:disabled) {
  background: #3a3a3a;
}

/* Prominent Interest Count Display */
.interest-count-display {
  text-align: center;
  margin: 20px 0 30px 0;
  padding: 20px;
  background: rgba(187, 24, 20, 0.1);
  border: 2px solid rgba(187, 24, 20, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.interest-count-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.interest-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #bb1814;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(187, 24, 20, 0.3);
}

.interest-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card {
  border-radius: 16px;
  background: #fff;
}

/* Dark Theme Event Cards */
.event-map-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(187, 24, 20, 0.1);
}

.event-map-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(187, 24, 20, 0.3);
  box-shadow: 0 12px 40px rgba(187, 24, 20, 0.15);
}

.map-container {
  position: relative;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

.map-container iframe {
  border: none !important;
  border-radius: 16px 16px 0 0 !important;
}

.map-details {
  padding: 20px;
}

.address-label {
  color: #fff;
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 15px;
  letter-spacing: 0.3px;
}

.event-action-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(187, 24, 20, 0.1);
}

.event-action-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(187, 24, 20, 0.3);
  box-shadow: 0 12px 40px rgba(187, 24, 20, 0.15);
}

.card-content {
  padding: 24px;
}

.card-header-text {
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.card-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 16px;
  line-height: 1.4;
}

.btn-directions {
  background: #bb1814;
  color: #fff;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  padding: 12px 24px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(187, 24, 20, 0.3);
}

.btn-directions:hover {
  background: #a30c0e;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(187, 24, 20, 0.4);
}

.btn-ticket {
  background: linear-gradient(135deg, #bb1814 0%, #a30c0e 100%);
  color: #fff;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  padding: 14px 0;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(187, 24, 20, 0.3);
}

.btn-ticket:hover {
  background: linear-gradient(135deg, #a30c0e 0%, #8b0a0c 100%);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(187, 24, 20, 0.4);
}

.btn-share {
  background: linear-gradient(135deg, #bb1814 0%, #a30c0e 100%);
  color: #fff;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  padding: 14px 0;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(187, 24, 20, 0.3);
}

.btn-share:hover {
  background: linear-gradient(135deg, #a30c0e 0%, #8b0a0c 100%);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(187, 24, 20, 0.4);
}

.container {
  max-width: 900px;
}

@media (max-width: 768px) {
  .event-title-header {
    font-size: 1.3rem;
  }
  .container {
    max-width: 100%;
    padding: 0 1.35rem;
  }

  .meta-action-bar {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 20px;
  }

  .btn-interest-header {
    align-self: stretch;
    width: 100%;
  }

  .interest-number {
    font-size: 2rem;
  }

  .interest-label {
    font-size: 1rem;
  }
}

.meta-action-bar {
  background: transparent;
}

.event-datetime,
.event-venue {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.event-desc {
  color: #fff;
  background: none;
  margin: 0.85rem 0 0.8rem 0; /* no left margin, add spacing below only if desired */
  padding: 0; /* ensure no left padding */
}

.event-desc p {
  margin: 0;
  padding: 0;
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

.event-details-page::before {
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

/* Loading and Error States */
.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(187, 24, 20, 0.2);
  border-top: 3px solid #bb1814;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-top: 20px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.8;
}

.error-title {
  color: #fff;
  font-weight: 600;
  margin-bottom: 15px;
}

.error-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.btn-primary-custom {
  background: linear-gradient(135deg, #bb1814 0%, #a30c0e 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(187, 24, 20, 0.3);
}

.btn-primary-custom:hover {
  background: linear-gradient(135deg, #a30c0e 0%, #8b0a0c 100%);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(187, 24, 20, 0.4);
  text-decoration: none;
}
</style>
