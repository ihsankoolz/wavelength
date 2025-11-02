<!-- EventDetails.vue -->
<template>
  <div class="event-details-page">
    <!-- Navigation Bar -->
    <NavigationBar />
<div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path id="wave1" fill="none" stroke="#B51414" stroke-width="2" opacity="0.6">
          <animate attributeName="d" 
            values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150"
            dur="3s" repeatCount="indefinite"/>
        </path>
        <path id="wave2" fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" 
            values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180"
            dur="4s" repeatCount="indefinite"/>
        </path>
        <path id="wave3" fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate attributeName="d" 
            values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120"
            dur="5s" repeatCount="indefinite"/>
        </path>
        <path id="wave4" fill="none" stroke="#B51414" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" 
            values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90"
            dur="2.5s" repeatCount="indefinite"/>
        </path>
        <path id="wave5" fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate attributeName="d" 
            values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210"
            dur="3.5s" repeatCount="indefinite"/>
        </path>
        <path id="wave6" fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate attributeName="d" 
            values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60"
            dur="4.5s" repeatCount="indefinite"/>
        </path>
        <path id="wave7" fill="none" stroke="#B51414" stroke-width="0.8" opacity="0.3">
          <animate attributeName="d" 
            values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240"
            dur="6s" repeatCount="indefinite"/>
        </path>
        <path id="wave8" fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate attributeName="d" 
            values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100"
            dur="2s" repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
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
        <router-link to="/events" class="btn btn-primary"> Browse All Events </router-link>
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
          :src="event.artistProfileImage || defaultImage"
          :alt="event.artistName"
          class="artist-profile-header"
        />
        <span class="artist-header-name ms-2 fw-bold">{{ event.artistName }}</span>
      </div>
      
<div class="event-desc">
  <p>{{ event.description }}</p>
</div>

<div class="d-flex align-items-center justify-content-between mb-4 meta-action-bar">
  <div>
    <div class="event-datetime fw-bold mb-1">
      Date: {{ formatDate(event.date) }}
    </div>
    <div class="event-venue fw-bold">
      Venue: {{ event.venue }}
    </div>
    <div class="event-interest-count fw-bold ">
        {{ event.interestedCount || 0 }} people interested
    </div>
    
  </div>
  
  <div class="text-center">
    <button
      class="btn btn-interest-header"
      :class="{ active: isInterested }"
      @click="markInterested"
      :disabled="isProcessing"
    >
     
       {{ isInterested ? 'IM INTERESTED' : 'Mark as Interested' }}
    </button>
    <div>
      
    </div>
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
        <div class="card shadow-sm border-0 mb-3">
          <div class="card-body">
            <EventMap :location="event.location" :title="event.venue" size="large" />
            <div class="mt-3 fw-bold">
              Address: {{ event.location }}
            </div>
            <button class="btn btn-directions" @click="getDirections">GET DIRECTIONS</button>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <!-- TICKETS and SHARE -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="mb-3"><b>GET THE TICKETS</b></div>
            <div class="mb-2">Get {{ event.title }} tickets here:</div>
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
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="mb-2"><b>SHARE THIS EVENT</b></div>
            <div class="text-muted small mb-2">Spread the word!</div>
            <button class="btn btn-share w-100" @click="shareEvent">
              SHARE EVENT
            </button>
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
      loading: true,
      isInterested: false,
      isProcessing: false,
    }
  },
  async mounted() {
    await this.loadEvent()
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
          this.isInterested = false

          // Reload data for new event
          this.loadEvent()
          this.checkIfInterested()
        }
      },
      immediate: false,
    },
  },
}
</script>

<style>
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(ellipse at center, rgba(181, 20, 20, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse at 30% 50%, rgba(199, 53, 53, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(181, 20, 20, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

.wave-svg {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100vw;
  height: 300px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: -1;
   opacity: 0.6; /* slightly more opacity */
  overflow: visible; /* ensure not clipped */
}
.wave-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

<style scoped>

.content-wrapper {
  margin-top: 65px;
  padding-bottom: 40px;
}
.event-details-page {
  min-height: 100vh;
  background: #19181c;
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
  background: rgba(255,255,255,0.07);
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
  font-weight: 600;
  font-size: 1.17rem;
  border-radius: 22px;
  border: none;
  padding: 8px 28px;
  letter-spacing: 0.5px;
  margin-top: 8px;
  margin-bottom: 22px;
  transition: all 0.2s;
}
.btn-interest-header.active, .btn-interest-header:hover {
  background: #a30c0e;
  color: #fff;
}

.card {
  border-radius: 16px;
  background: #fff;
}

.btn-ticket {
  background: #bb1814;
  color: #fff;
  border-radius: 22px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  padding: 8px 0;
  letter-spacing: 0.4px;
}
.btn-ticket:hover {
  background: #a30c0e;
}

.btn-share {
  background: #bb1814;
  color: #fff;
  border-radius: 22px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  padding: 8px 0;
  letter-spacing: 0.4px;
  margin-bottom: 0.5rem;
}
.btn-share:hover {
  background: #a30c0e;
}

.btn-directions {
  background: #bb1814;
  color: #fff;
  border-radius: 22px;
  font-size: 1.08rem;
  font-weight: 600;
  border: none;
  padding: 8px 22px;
  letter-spacing: 0.3px;
  margin-top: 10px;
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
}

.meta-action-bar {
  background: transparent;
}

.event-datetime,
.event-venue,
.event-interest-count {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.btn-interest-header {
  background: #bb1814;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 22px;
  border: none;
  padding: 10px 28px;
  letter-spacing: 0.5px;
  margin-left: 40px;
  white-space: nowrap;
  box-shadow: none;
  transition: all 0.18s;
}
.btn-interest-header.active,
.btn-interest-header:hover {
  background: #a30c0e;
  color: #fff;
}


.event-desc {
  color: #fff;
  background: none;
  margin: 0.85rem 0 0.8rem 0; /* no left margin, add spacing below only if desired */
  padding: 0;           /* ensure no left padding */
  
}

.event-desc p {
  margin: 0;
  padding: 0;
}


</style>

