<!-- MyInterests.vue page -->
<template>
  <div class="my-interests-page">
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
            <div class="mb-2">
              <div class="header">
                <i class="bi bi-star-fill text-warning"></i>
                Interested Events
              </div>
            </div>
            <div class="header-subtitle mb-4">
              You are interested in
              <span class="highlight-number">{{ interestedEvents.length }}</span> event{{
                interestedEvents.length !== 1 ? 's' : ''
              }}
            </div>

            <!-- No Interested Events -->
            <div v-if="interestedEvents.length === 0" class="card shadow-sm">
              <div class="card-body text-center py-5">
                <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
                <p class="text-muted">You haven't marked any events as interested yet.</p>
                <router-link to="/events" class="btn btn-primary"> Browse Events </router-link>
              </div>
            </div>

            <!-- Events Grid -->
            <div v-else class="horizontal-scroll">
              <div class="d-flex gap-3">
                <div
                  v-for="event in interestedEvents"
                  :key="event.id"
                  class="flex-shrink-0 event-card-container"
                >
                  <EventCard :event="event" />
                </div>
              </div>
            </div>
          </section>

          <!-- Artist Discovery Network Section -->
          <section>
            <div class="mb-2">
              <div class="header">
                <i class="bi bi-diagram-3-fill text-primary"></i>
                ARTIST DISCOVERY NETWORK
              </div>
            </div>
            <div class="header-subtitle mb-4">
              Explore artists similar to those you follow -
              <span class="highlight-number">{{ followingArtists.length }}</span> artist{{
                followingArtists.length !== 1 ? 's' : ''
              }}
              in your network
            </div>

            <!-- Network Graph -->
            <div class="network-graph-section">
              <ArtistNetworkGraph
                v-if="!loading && allArtists.length > 0"
                :userId="userId"
                :allArtists="allArtists"
                :userPreferences="userPreferences"
                :height="600"
              />

              <!-- Loading State -->
              <div v-else-if="loading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-white">Building your artist network...</p>
              </div>
            </div>

            <!-- Following Artists List (Compact View Below Graph) -->
            <div v-if="followingArtists.length > 0" class="mt-4">
              <div class="mb-3">
                <h6 class="text-white">
                  <i class="bi bi-people-fill"></i>
                  Artists You Follow
                </h6>
              </div>
              <div class="horizontal-scroll">
                <div class="d-flex gap-3">
                  <div
                    v-for="artist in followingArtists"
                    :key="artist.id"
                    class="flex-shrink-0 artist-card-container"
                  >
                    <ArtistCard :artist="artist" />
                  </div>
                </div>
              </div>
            </div>

            <!-- No Following Artists -->
            <div v-else class="card shadow-sm mt-3">
              <div class="card-body text-center py-5">
                <i class="bi bi-person-x fs-1 text-muted mb-3"></i>
                <p class="text-muted">You're not following any artists yet.</p>
                <p class="text-muted small">
                  Follow artists to see personalized recommendations in the network graph
                </p>
                <router-link to="/home" class="btn btn-primary"> Discover Artists </router-link>
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
import ArtistCard from '@/components/ArtistCard.vue'
import ArtistNetworkGraph from '@/components/ArtistNetworkGraph.vue'

export default {
  name: 'MyInterests',
  components: {
    NavigationBar,
    EventCard,
    ArtistCard,
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
    }
  },
  async mounted() {
    await this.loadUserInterests()
    await this.loadAllArtists()
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
  },
}
</script>

<style scoped>
.my-interests-page {
  min-height: 100vh;
  background: #19181c;
  padding-top: 100px;
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

.header {
  color: #fff;
  letter-spacing: 1px;
  font-size: 2.3rem;
  font-weight: 700;
  font-family: 'Poppins', Arial, Helvetica, sans-serif;
}

.header-subtitle {
  color: #b0b1ba;
  font-size: 1.1rem;
  font-weight: 400;
}

.header-subtitle .highlight-number {
  font-weight: 700;
  font-size: 1.3rem;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.text-muted {
  color: #999 !important;
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
  background: #b51414;
  border: none;
}

.btn-primary:hover {
  background: #a01828;
}

.spinner-border {
  color: #b51414 !important;
}

@media (max-width: 768px) {
  .my-interests-page {
    padding-top: 80px;
  }

  .header {
    font-size: 1.8rem;
  }
}

.horizontal-scroll {
  overflow-x: auto;
  overflow-y: visible;
  padding: 10px 0;
  min-height: 350px;
}

.horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background-color: #b51414;
  border-radius: 4px;
}

.horizontal-scroll::-webkit-scrollbar-track {
  background: #2a2a2a;
}

/* Event cards - wider for content */
.event-card-container {
  width: 300px;
}

/* Artist cards - narrower, matching ArtistCard design */
.artist-card-container {
  width: 250px;
}

/* Network Graph Section */
.network-graph-section {
  margin-bottom: 2rem;
}

.network-graph-section h6 {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
