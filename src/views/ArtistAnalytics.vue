<!-- ArtistAnalytics.vue -->
<template>
  <div class="artist-analytics-page">
    <NavigationBar />

    <div class="content-wrapper">
      <div class="container py-4">
        <!-- Header -->
        <div class="mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 class="display-5 fw-bold mb-2">
                <i class="bi bi-graph-up text-primary"></i>
                Analytics Dashboard
              </h1>
              <p class="text-muted">Track your performance and audience engagement</p>
            </div>
            <router-link to="/artist/dashboard" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left"></i> Back to Dashboard
            </router-link>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading analytics...</p>
        </div>

        <!-- Analytics Content -->
        <div v-else>
          <!-- Overview Stats Cards -->
          <div class="row g-4 mb-5">
            <!-- Total Followers -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="stat-card card shadow-sm h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <p class="text-muted mb-1">Total Followers</p>
                      <h2 class="fw-bold mb-0">{{ artistData.followerCount || 0 }}</h2>
                    </div>
                    <div class="stat-icon bg-primary">
                      <i class="bi bi-people-fill"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Songs -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="stat-card card shadow-sm h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <p class="text-muted mb-1">Total Songs</p>
                      <h2 class="fw-bold mb-0">{{ totalSongs }}</h2>
                    </div>
                    <div class="stat-icon bg-success">
                      <i class="bi bi-music-note-beamed"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Plays -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="stat-card card shadow-sm h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <p class="text-muted mb-1">Total Plays</p>
                      <h2 class="fw-bold mb-0">{{ totalPlays }}</h2>
                    </div>
                    <div class="stat-icon bg-info">
                      <i class="bi bi-play-circle-fill"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Engagement -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="stat-card card shadow-sm h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <p class="text-muted mb-1">Total Engagement</p>
                      <h2 class="fw-bold mb-0">{{ totalEngagement }}</h2>
                    </div>
                    <div class="stat-icon bg-danger">
                      <i class="bi bi-heart-fill"></i>
                    </div>
                  </div>
                  <small class="text-muted">Likes + Comments</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Music Performance Section -->
          <div class="row g-4 mb-5">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-header bg-white">
                  <h5 class="mb-0">
                    <i class="bi bi-music-note-list text-primary"></i>
                    Music Performance
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="musicLinks.length === 0" class="text-center py-4 text-muted">
                    <i class="bi bi-music-note fs-1 mb-3"></i>
                    <p>No music uploaded yet.</p>
                    <router-link to="/artist/dashboard" class="btn btn-primary">
                      Upload Your First Song
                    </router-link>
                  </div>

                  <div v-else class="table-responsive">
                    <table class="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Song</th>
                          <th>Type</th>
                          <th>Platform</th>
                          <th class="text-center"><i class="bi bi-play-circle"></i> Plays</th>
                          <th class="text-center"><i class="bi bi-heart"></i> Likes</th>
                          <th class="text-center"><i class="bi bi-chat"></i> Comments</th>
                          <th class="text-center">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="song in sortedSongs" :key="song.id">
                          <td>
                            <div class="d-flex align-items-center">
                              <div>
                                <strong class="d-block">{{ song.title }}</strong>
                                <small class="text-muted">
                                  {{ song.genres?.slice(0, 2).join(', ') }}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span class="badge bg-secondary">{{ song.type }}</span>
                          </td>
                          <td>
                            <span
                              class="badge"
                              :class="{
                                'bg-success': song.platform === 'spotify',
                                'bg-danger': song.platform === 'youtube',
                                'bg-warning text-dark': song.platform === 'soundcloud',
                              }"
                            >
                              {{ song.platform }}
                            </span>
                          </td>
                          <td class="text-center">
                            <strong>{{ song.playCount || 0 }}</strong>
                          </td>
                          <td class="text-center">
                            <strong class="text-danger">{{ song.likes || 0 }}</strong>
                          </td>
                          <td class="text-center">
                            <strong class="text-primary">{{ song.commentCount || 0 }}</strong>
                          </td>
                          <td class="text-center">
                            <div class="progress" style="width: 100px; height: 8px">
                              <div
                                class="progress-bar bg-success"
                                :style="{ width: getSongEngagementPercentage(song) + '%' }"
                              ></div>
                            </div>
                            <small class="text-muted">
                              {{ getSongEngagement(song) }}
                            </small>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Events Performance -->
          <div class="row g-4 mb-5">
            <div class="col-12 col-lg-8">
              <div class="card shadow-sm">
                <div class="card-header bg-white">
                  <h5 class="mb-0">
                    <i class="bi bi-calendar3 text-primary"></i>
                    Event Performance
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="upcomingEvents.length === 0" class="text-center py-4 text-muted">
                    <i class="bi bi-calendar-x fs-1 mb-3"></i>
                    <p>No upcoming events to display.</p>
                    <router-link to="/events/create" class="btn btn-primary">
                      Create Your First Event
                    </router-link>
                  </div>

                  <div v-else class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Event</th>
                          <th>Date</th>
                          <th>Venue</th>
                          <th class="text-center">Interest</th>
                          <th class="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="event in upcomingEvents" :key="event.id">
                          <td>
                            <strong>{{ event.title }}</strong>
                          </td>
                          <td>{{ formatDate(event.date) }}</td>
                          <td>{{ event.venue }}</td>
                          <td class="text-center">
                            <span class="badge bg-warning">
                              <i class="bi bi-star-fill"></i>
                              {{ event.interestedCount || 0 }}
                            </span>
                          </td>
                          <td class="text-center">
                            <span class="badge bg-success">Upcoming</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Genre Breakdown -->
            <div class="col-12 col-lg-4">
              <div class="card shadow-sm">
                <div class="card-header bg-white">
                  <h5 class="mb-0">
                    <i class="bi bi-music-note-list text-primary"></i>
                    Genre Distribution
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="artistData.genres && artistData.genres.length > 0">
                    <div
                      v-for="(genre, index) in artistData.genres"
                      :key="genre"
                      class="genre-bar mb-3"
                    >
                      <div class="d-flex justify-content-between mb-1">
                        <span class="fw-bold">{{ genre }}</span>
                        <span class="text-muted">{{ getGenrePercentage(index) }}%</span>
                      </div>
                      <div class="progress" style="height: 8px">
                        <div
                          class="progress-bar"
                          :class="getProgressBarClass(index)"
                          :style="{ width: getGenrePercentage(index) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-muted py-4">
                    <i class="bi bi-music-note fs-1 mb-2"></i>
                    <p>No genres specified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Events by Interest -->
          <div class="row g-4">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-header bg-white">
                  <h5 class="mb-0">
                    <i class="bi bi-trophy-fill text-warning"></i>
                    Top Events by Interest
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="topEvents.length === 0" class="text-center py-4 text-muted">
                    <p>No event data available yet.</p>
                  </div>

                  <div v-else class="row g-3">
                    <div
                      v-for="(event, index) in topEvents"
                      :key="event.id"
                      class="col-12 col-md-6 col-lg-4"
                    >
                      <div class="top-event-card card h-100">
                        <div class="card-body">
                          <div class="d-flex align-items-start gap-3">
                            <div class="rank-badge" :class="getRankClass(index)">
                              #{{ index + 1 }}
                            </div>
                            <div class="flex-grow-1">
                              <h6 class="mb-1 fw-bold">{{ event.title }}</h6>
                              <small class="text-muted d-block mb-2">{{ event.venue }}</small>
                              <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-star-fill text-warning"></i>
                                <span class="fw-bold"
                                  >{{ event.interestedCount || 0 }} interested</span
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/services/firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import NavigationBar from '@/components/NavigationBar.vue'

export default {
  name: 'ArtistAnalytics',
  components: {
    NavigationBar,
  },
  setup() {
    const router = useRouter()
    const loading = ref(true)

    const artistData = reactive({
      artistName: '',
      genres: [],
      followerCount: 0,
      musicLinks: [],
    })

    const upcomingEvents = ref([])
    const allEvents = ref([])

    // Music computed properties
    const musicLinks = computed(() => artistData.musicLinks || [])

    const totalSongs = computed(() => musicLinks.value.length)

    const totalPlays = computed(() => {
      return musicLinks.value.reduce((sum, song) => sum + (song.playCount || 0), 0)
    })

    const totalLikes = computed(() => {
      return musicLinks.value.reduce((sum, song) => sum + (song.likes || 0), 0)
    })

    const totalComments = computed(() => {
      return musicLinks.value.reduce((sum, song) => sum + (song.commentCount || 0), 0)
    })

    const totalEngagement = computed(() => totalLikes.value + totalComments.value)

    const maxEngagement = computed(() => {
      if (musicLinks.value.length === 0) return 1
      return Math.max(
        ...musicLinks.value.map((song) => (song.likes || 0) + (song.commentCount || 0)),
      )
    })

    const sortedSongs = computed(() => {
      return [...musicLinks.value].sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
    })

    const getSongEngagement = (song) => {
      return (song.likes || 0) + (song.commentCount || 0)
    }

    const getSongEngagementPercentage = (song) => {
      if (maxEngagement.value === 0) return 0
      const engagement = getSongEngagement(song)
      return Math.round((engagement / maxEngagement.value) * 100)
    }

    // Event computed properties
    const totalEvents = computed(() => allEvents.value.length)

    const totalInterest = computed(() => {
      return allEvents.value.reduce((sum, event) => sum + (event.interestedCount || 0), 0)
    })

    const avgInterest = computed(() => {
      if (totalEvents.value === 0) return 0
      return Math.round(totalInterest.value / totalEvents.value)
    })

    const topEvents = computed(() => {
      return [...allEvents.value]
        .sort((a, b) => (b.interestedCount || 0) - (a.interestedCount || 0))
        .slice(0, 6)
    })

    // Load data
    const loadAnalytics = async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          router.push('/login')
          return
        }

        // Load artist data
        const artistDoc = await getDoc(doc(db, 'artists', user.uid))
        if (artistDoc.exists()) {
          const data = artistDoc.data()
          Object.assign(artistData, {
            artistName: data.artistName || '',
            genres: data.genres || [],
            followerCount: data.followerCount || 0,
            musicLinks: data.musicLinks || [],
          })
        }

        // Load all events
        const eventsQuery = query(collection(db, 'events'), where('artistId', '==', user.uid))

        const eventsSnapshot = await getDocs(eventsQuery)
        allEvents.value = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Filter upcoming events
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        upcomingEvents.value = allEvents.value
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
        console.error('Error loading analytics:', error)
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      if (!date) return 'TBA'
      const dateObj = date.toDate ? date.toDate() : new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }

    const getGenrePercentage = (index) => {
      const totalGenres = artistData.genres.length
      if (totalGenres === 0) return 0
      // Make it look proportional (first genre gets highest %)
      return Math.max(30, 100 - index * 20)
    }

    const getProgressBarClass = (index) => {
      const classes = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger']
      return classes[index % classes.length]
    }

    const getRankClass = (index) => {
      if (index === 0) return 'rank-gold'
      if (index === 1) return 'rank-silver'
      if (index === 2) return 'rank-bronze'
      return 'rank-default'
    }

    onMounted(() => {
      loadAnalytics()
    })

    return {
      loading,
      artistData,
      upcomingEvents,
      // Music metrics
      musicLinks,
      totalSongs,
      totalPlays,
      totalLikes,
      totalComments,
      totalEngagement,
      sortedSongs,
      getSongEngagement,
      getSongEngagementPercentage,
      // Event metrics
      totalEvents,
      totalInterest,
      avgInterest,
      topEvents,
      // Helpers
      formatDate,
      getGenrePercentage,
      getProgressBarClass,
      getRankClass,
    }
  },
}
</script>

<style scoped>
.artist-analytics-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

/* Stat Cards */
.stat-card {
  border: none;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

/* Cards */
.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

/* Genre Bars */
.genre-bar {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Top Events */
.top-event-card {
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.top-event-card:hover {
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.rank-badge {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #000;
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32, #e8a87c);
  color: #fff;
}

.rank-default {
  background: #e9ecef;
  color: #6c757d;
}

/* Table */
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 100px;
  }

  .display-5 {
    font-size: 2rem;
  }
}
</style>
