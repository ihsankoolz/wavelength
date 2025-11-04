<!-- MyInterests.vue page -->
<template>
  <div class="my-interests-page">
    <NavigationBar />

    <!-- Dynamic Wave Background -->
    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path id="wave1" fill="none" stroke="#B51414" stroke-width="2" opacity="0.6">
          <animate attributeName="d" values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                    M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                    M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150" dur="3s" repeatCount="indefinite" />
        </path>
        <path id="wave2" fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                    M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                    M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180" dur="4s" repeatCount="indefinite" />
        </path>
        <path id="wave3" fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate attributeName="d" values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                    M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                    M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120" dur="5s" repeatCount="indefinite" />
        </path>
        <path id="wave4" fill="none" stroke="#B51414" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                    M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                    M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path id="wave5" fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate attributeName="d" values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                    M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                    M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path id="wave6" fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate attributeName="d" values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                    M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                    M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60" dur="4.5s" repeatCount="indefinite" />
        </path>
        <path id="wave7" fill="none" stroke="#B51414" stroke-width="0.8" opacity="0.3">
          <animate attributeName="d" values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                    M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                    M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240" dur="6s" repeatCount="indefinite" />
        </path>
        <path id="wave8" fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate attributeName="d" values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                    M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                    M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
    <div class="content-wrapper">
      <div class="container py-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading your interests...</p>
        </div>

        <!-- Main Content -->
        <div v-else>
          <!-- Interested Events Section -->
          <section class="mb-5">
            <div class="welcome-section mb-4">
              <h1 class="display-5 fw-bold mb-2">INTERESTED EVENTS</h1>
              <p class="text-muted">You are interested in
                <span>{{ interestedEvents.length }}</span> event{{ interestedEvents.length !== 1 ? 's' : '' }}
              </p>
            </div>

            <!-- No Interested Events -->
            <div v-if="interestedEvents.length === 0" class="text-center py-5">
              <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
              <h2 class="h4 mb-3 text-white">No interested events yet</h2>
              <p class="text-muted mb-4">Start exploring and mark events you're interested in!</p>
              <router-link to="/events" class="btn btn-primary">
                Browse Events
              </router-link>
            </div>

            <!-- Events Carousel -->
            <div v-else class="carousel-container">
              <button v-if="currentEventPage > 0" @click="previousEventPage" class="carousel-arrow left"
                aria-label="Previous events">
                <i class="bi bi-chevron-left"></i>
              </button>

              <div class="artists-carousel">
                <div class="artists-grid-carousel" :style="{ transform: `translateX(-${currentEventPage * 100}%)` }">
                  <div v-for="(page, pageIndex) in paginatedInterestedEvents" :key="`event-page-${pageIndex}`"
                    class="carousel-page artists-page">
                    <div class="row g-3 pt-3 pb-3">
                      <div v-for="event in page" :key="event.id" class="col-lg-3 col-md-4 col-sm-6 col-12">
                        <EventCard :event="event" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button v-if="currentEventPage < totalEventPages - 1" @click="nextEventPage" class="carousel-arrow right"
                aria-label="Next events">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </section>

          <!-- Artist Discovery Network Section -->
          <section>
            <h2 class="genre-heading mb-2">ARTIST DISCOVERY NETWORK</h2>
            <div class="header-subtitle text-muted mb-4">
              Explore artists similar to those you follow -
              <span>{{ followingArtists.length }}</span> artist{{
                followingArtists.length !== 1 ? 's' : ''
              }}
              in your network
            </div>

            <!-- Network Graph -->
            <div class="network-graph-section overflow-x-auto mb-3 mb-sm-4 mb-md-5">
              <ArtistNetworkGraph v-if="!loading && allArtists.length > 0" :userId="userId" :allArtists="allArtists"
                :userPreferences="userPreferences" :height="graphHeight" />

              <!-- Loading State -->
              <div v-else-if="loading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-white">Building your artist network...</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import NavigationBar from '@/components/NavigationBar.vue'
import EventCard from '@/components/EventCard.vue'
import ArtistNetworkGraph from '@/components/ArtistNetworkGraph.vue'

export default {
  name: 'MyInterests',
  components: {
    NavigationBar,
    EventCard,
    ArtistNetworkGraph,
  },
  data() {
    return {
      loading: true,
      userId: '',
      interestedEvents: [],
      followingArtists: [],
      allArtists: [],
      userPreferences: {
        followingArtists: [],
        preferredGenres: [],
        likedSongs: [],
      },
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
      currentEventPage: 0,
      eventsPerPage: 4,
    }
  },
  computed: {
    paginatedInterestedEvents() {
      const pages = []
      let startIndex = 0

      while (startIndex < this.interestedEvents.length) {
        const endIndex = Math.min(startIndex + this.eventsPerPage, this.interestedEvents.length)
        pages.push(this.interestedEvents.slice(startIndex, endIndex))
        startIndex = endIndex
      }
      return pages
    },
    totalEventPages() {
      return this.paginatedInterestedEvents.length
    },
    graphHeight() {
      // Responsive height based on window width (Bootstrap breakpoints)
      const width = this.windowWidth
      
      // Extra small devices (portrait phones, less than 576px)
      if (width < 576) {
        return 400
      }
      // Small devices (landscape phones, 576px and up)
      else if (width < 768) {
        return 450
      }
      // Medium devices (tablets, 768px and up)
      else if (width < 992) {
        return 500
      }
      // Large devices (desktops, 992px and up)
      else if (width < 1200) {
        return 550
      }
      // Extra large devices (large desktops, 1200px and up)
      else {
        return 600
      }
    },
  },
  async mounted() {
    await this.loadUserInterests()
    await this.loadAllArtists()
    
    // Add window resize listener for responsive height
    if (typeof window !== 'undefined') {
      this.handleResize = () => {
        this.windowWidth = window.innerWidth
      }
      window.addEventListener('resize', this.handleResize)
    }
  },
  beforeUnmount() {
    // Remove resize listener
    if (typeof window !== 'undefined' && this.handleResize) {
      window.removeEventListener('resize', this.handleResize)
    }
  },
  methods: {
    async loadUserInterests() {
      try {
        const user = auth.currentUser
        if (!user) {
          this.$router.push('/login')
          return
        }

        this.userId = user.uid

        // Get user's interested events and following artists
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()
          const interestedEventIds = userData.interestedEvents || []
          const followingArtistIds = userData.followingArtists || []

          // Set user preferences for network graph
          this.userPreferences = {
            followingArtists: followingArtistIds,
            preferredGenres: userData.preferredGenres || [],
            likedSongs: userData.likedSongs || [],
          }

          // Load interested events
          if (interestedEventIds.length > 0) {
            await this.loadInterestedEvents(interestedEventIds)
          }

          // Load following artists
          if (followingArtistIds.length > 0) {
            await this.loadFollowingArtists(followingArtistIds)
          }
        }
      } catch (error) {
        console.error('Error loading user interests:', error)
        alert('Failed to load your interests')
      } finally {
        this.loading = false
      }
    },

    async loadAllArtists() {
      try {
        const artistsSnapshot = await getDocs(collection(db, 'artists'))
        this.allArtists = artistsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      } catch (error) {
        console.error('Error loading all artists:', error)
      }
    },

    async loadInterestedEvents(eventIds) {
      try {
        const events = []

        // Load each event (Firestore doesn't support WHERE IN with more than 10 items)
        // So we batch them
        const batches = []
        for (let i = 0; i < eventIds.length; i += 10) {
          batches.push(eventIds.slice(i, i + 10))
        }

        for (const batch of batches) {
          const eventsQuery = query(collection(db, 'events'), where('__name__', 'in', batch))

          const eventsSnapshot = await getDocs(eventsQuery)
          eventsSnapshot.docs.forEach((doc) => {
            events.push({
              id: doc.id,
              ...doc.data(),
            })
          })
        }

        // Filter for upcoming events only
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        this.interestedEvents = events
          .filter((event) => {
            const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
            return eventDate >= now
          })
          .sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
            return dateA - dateB
          })
      } catch (error) {
        console.error('Error loading interested events:', error)
      }
    },

    async loadFollowingArtists(artistIds) {
      try {
        const artists = []

        // Load each artist in batches of 10
        const batches = []
        for (let i = 0; i < artistIds.length; i += 10) {
          batches.push(artistIds.slice(i, i + 10))
        }

        for (const batch of batches) {
          const artistsQuery = query(collection(db, 'artists'), where('__name__', 'in', batch))

          const artistsSnapshot = await getDocs(artistsQuery)
          artistsSnapshot.docs.forEach((doc) => {
            artists.push({
              id: doc.id,
              ...doc.data(),
            })
          })
        }

        this.followingArtists = artists
      } catch (error) {
        console.error('Error loading following artists:', error)
      }
    },

    nextEventPage() {
      if (this.currentEventPage < this.totalEventPages - 1) {
        this.currentEventPage++
      }
    },

    previousEventPage() {
      if (this.currentEventPage > 0) {
        this.currentEventPage--
      }
    },
  },
}
</script>

<style scoped>
.my-interests-page {
  min-height: 100vh;
  background: #19181c;
  padding-top: 95px;
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

.my-interests-page::before {
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

.content-wrapper {
  padding-bottom: 40px;
  position: relative;
  z-index: 1;
}

/* Welcome Section (matching BrowseEvents.vue) */
.welcome-section h1 {
  color: #fff;
  letter-spacing: 1px;
  font-size: 2.3rem;
}

.welcome-section p {
  color: #d4d5db;
  font-size: 1.1rem;
}

/* Genre Heading */
.genre-heading {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.header-subtitle {
  color: #b0b1ba;
  font-size: 1.1rem;
  font-weight: 400;
}

.text-muted {
  color: #b0b1ba !important;
}

.card {
  border: none;
  border-radius: 12px;
  background: #2a2a2a;
}

.card-body {
  color: #999;
}

.badge {
  background-color: #b51414 !important;
}

.btn-primary {
  background: #bb1814;
  border: none;
  border-radius: 25px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transform: none;
}

.btn-primary:hover {
  background: #960f0c;
}

.spinner-border {
  color: #b51414 !important;
}

/* Carousel Container */
.carousel-container {
  position: relative;
  padding: 0;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  color: #000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
}

.carousel-container:hover .carousel-arrow {
  opacity: 1;
  pointer-events: auto;
}

.carousel-arrow:hover {
  background: #bb1814;
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.carousel-arrow.left {
  left: -25px;
}

.carousel-arrow.right {
  right: -25px;
}

.carousel-arrow i {
  font-size: 1.5rem;
}

.artists-carousel {
  overflow: hidden;
  width: 100%;
}

.artists-grid-carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-page.artists-page {
  min-width: 100%;
  width: 100%;
  flex-shrink: 0;
}

/* Network Graph Section */
.network-graph-section {
  width: 100%;
}
</style>
