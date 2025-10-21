<!-- MyInterests.vue page -->
 <template>
  <div class="my-interests-page">
    <NavigationBar />

    <div class="content-wrapper">
      <div class="container py-4">
        
        <!-- Header -->
        <div class="text-center mb-5">
          <h1 class="display-5 fw-bold mb-2">
            <i class="bi bi-heart-fill text-danger"></i>
            My Interests
          </h1>
          <p class="text-muted">Events you're interested in and artists you follow</p>
        </div>

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
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3>
                <i class="bi bi-star-fill text-warning"></i>
                Interested Events
              </h3>
              <span class="badge bg-primary">{{ interestedEvents.length }}</span>
            </div>

            <!-- No Interested Events -->
            <div v-if="interestedEvents.length === 0" class="card shadow-sm">
              <div class="card-body text-center py-5">
                <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
                <p class="text-muted">You haven't marked any events as interested yet.</p>
                <router-link to="/events" class="btn btn-primary">
                  Browse Events
                </router-link>
              </div>
            </div>

            <!-- Events Grid -->
            <div v-else class="row g-4">
              <div 
                v-for="event in interestedEvents" 
                :key="event.id"
                class="col-12 col-md-6 col-lg-4"
              >
                <EventCard :event="event" />
              </div>
            </div>
          </section>

          <!-- Following Artists Section -->
          <section>
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3>
                <i class="bi bi-people-fill text-primary"></i>
                Following
              </h3>
              <span class="badge bg-primary">{{ followingArtists.length }}</span>
            </div>

            <!-- No Following Artists -->
            <div v-if="followingArtists.length === 0" class="card shadow-sm">
              <div class="card-body text-center py-5">
                <i class="bi bi-person-x fs-1 text-muted mb-3"></i>
                <p class="text-muted">You're not following any artists yet.</p>
                <router-link to="/home" class="btn btn-primary">
                  Discover Artists
                </router-link>
              </div>
            </div>

            <!-- Artists Grid -->
            <div v-else class="row g-4">
              <div 
                v-for="artist in followingArtists" 
                :key="artist.id"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <ArtistCard :artist="artist" />
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

export default {
  name: 'MyInterests',
  components: {
    NavigationBar,
    EventCard,
    ArtistCard
  },
  data() {
    return {
      loading: true,
      interestedEvents: [],
      followingArtists: []
    }
  },
  async mounted() {
    await this.loadUserInterests()
  },
  methods: {
    async loadUserInterests() {
      try {
        const user = auth.currentUser
        if (!user) {
          this.$router.push('/login')
          return
        }

        // Get user's interested events and following artists
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const interestedEventIds = userData.interestedEvents || []
          const followingArtistIds = userData.followingArtists || []

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
          const eventsQuery = query(
            collection(db, 'events'),
            where('__name__', 'in', batch)
          )
          
          const eventsSnapshot = await getDocs(eventsQuery)
          eventsSnapshot.docs.forEach(doc => {
            events.push({
              id: doc.id,
              ...doc.data()
            })
          })
        }

        // Filter for upcoming events only
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        this.interestedEvents = events
          .filter(event => {
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
          const artistsQuery = query(
            collection(db, 'artists'),
            where('__name__', 'in', batch)
          )
          
          const artistsSnapshot = await getDocs(artistsQuery)
          artistsSnapshot.docs.forEach(doc => {
            artists.push({
              id: doc.id,
              ...doc.data()
            })
          })
        }

        this.followingArtists = artists

      } catch (error) {
        console.error('Error loading following artists:', error)
      }
    }
  }
}
</script>

<style scoped>
.my-interests-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 100px;
}

.content-wrapper {
  padding-bottom: 40px;
}

h3 {
  color: #2c3e50;
  font-weight: 600;
}

.card {
  border: none;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .my-interests-page {
    padding-top: 80px;
  }

  .display-5 {
    font-size: 2rem;
  }
}
</style>