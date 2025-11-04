<!-- ArtistAnalytics.vue -->
<template>
  <div class="artist-analytics-page">
    <NavigationBar />

    <!-- Wave Background -->
    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="#bb1814" stroke-width="2" opacity="0.6">
          <animate
            attributeName="d"
            values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate
            attributeName="d"
            values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate
            attributeName="d"
            values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="0.8" opacity="0.3">
          <animate
            attributeName="d"
            values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
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
        <!-- Header -->
        <div class="welcome-section mb-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 class="display-5 fw-bold mb-2">MY ANALYTICS</h1>
              <p class="header-subtitle">TRACK YOUR PERFORMANCE AND AUDIENCE ENGAGEMENT</p>
            </div>
            <router-link to="/artist/dashboard" class="btn-back-dashboard">
              <i class="bi bi-arrow-left"></i> Back to Dashboard
            </router-link>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-white">Loading analytics...</p>
        </div>

        <!-- Analytics Content -->
        <div v-else>
          <!-- Overview Stats Cards -->
          <div class="row g-4 mb-5">
            <!-- Total Followers -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="stat-card h-100">
                <div class="stat-card-body">
                  <div class="stat-icon-small">
                    <i class="bi bi-people-fill"></i>
                  </div>
                  <p class="stat-label">TOTAL FOLLOWERS</p>
                  <h2 class="stat-value">{{ artistData.followerCount || 0 }}</h2>
                </div>
              </div>
            </div>

            <!-- Total Songs -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="stat-card h-100">
                <div class="stat-card-body">
                  <div class="stat-icon-small">
                    <i class="bi bi-music-note-beamed"></i>
                  </div>
                  <p class="stat-label">TOTAL SONGS</p>
                  <h2 class="stat-value">{{ totalSongs }}</h2>
                </div>
              </div>
            </div>

            <!-- Total Plays -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="stat-card h-100">
                <div class="stat-card-body">
                  <div class="stat-icon-small">
                    <i class="bi bi-play-circle-fill"></i>
                  </div>
                  <p class="stat-label">TOTAL PLAYS</p>
                  <h2 class="stat-value">{{ totalPlays }}</h2>
                </div>
              </div>
            </div>

            <!-- Total Engagement -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="stat-card h-100">
                <div class="stat-card-body">
                  <div class="stat-icon-small">
                    <i class="bi bi-heart-fill"></i>
                  </div>
                  <p class="stat-label">TOTAL ENGAGEMENT</p>
                  <h2 class="stat-value">{{ totalEngagement }}</h2>
                </div>
              </div>
            </div>
          </div>

          <!-- Music Performance Section -->
          <div class="row g-4 mb-5">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-music-note-list"></i>
                    Music Performance
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="musicLinks.length === 0" class="text-center py-4">
                    <i class="bi bi-music-note fs-1 mb-3"></i>
                    <p>No music uploaded yet. Add your first track!</p>
                    <router-link to="/artist/my-music" class="btn btn-primary">
                      Upload Music
                    </router-link>
                  </div>

                  <div v-else class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Song</th>
                          <th>Type</th>
                          <th>Platform</th>
                          <th class="text-center"><i class="bi bi-play-circle"></i> Plays</th>
                          <th class="text-center"><i class="bi bi-heart"></i> Likes</th>
                          <th class="text-center"><i class="bi bi-chat"></i> Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="song in paginatedSongs" :key="song.id">
                          <td>
                            <div class="d-flex align-items-center">
                              <div>
                                <strong class="d-block">{{ song.title }}</strong>
                                <small>
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
                            <strong>{{ song.likes || 0 }}</strong>
                          </td>
                          <td class="text-center">
                            <strong>{{ song.commentCount || 0 }}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Pagination Controls -->
                    <div
                      v-if="totalPages > 1"
                      class="pagination-container d-flex justify-content-center align-items-center mt-4"
                    >
                      <button
                        class="btn-pagination"
                        :disabled="currentPage === 1"
                        @click="changePage(currentPage - 1)"
                      >
                        <i class="bi bi-chevron-left"></i>
                      </button>

                      <button
                        v-for="page in totalPages"
                        :key="page"
                        class="btn-pagination"
                        :class="{ active: currentPage === page }"
                        @click="changePage(page)"
                      >
                        {{ page }}
                      </button>

                      <button
                        class="btn-pagination"
                        :disabled="currentPage === totalPages"
                        @click="changePage(currentPage + 1)"
                      >
                        <i class="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Events Performance -->
          <div class="row g-4 mb-5">
            <div class="col-12 col-lg-8">
              <div class="card shadow-sm">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-calendar3"></i>
                    Event Performance
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="upcomingEvents.length === 0" class="text-center py-4">
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
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-music-note-list"></i>
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
                        <span>{{ getGenrePercentage(index) }}%</span>
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
                  <div v-else class="text-center py-4">
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
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-trophy-fill"></i>
                    Top Events by Interest
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="topEvents.length === 0" class="text-center py-4">
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

    // Pagination for music
    const currentPage = ref(1)
    const songsPerPage = 5

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

    // Pagination computed properties
    const totalPages = computed(() => {
      return Math.ceil(sortedSongs.value.length / songsPerPage)
    })

    const paginatedSongs = computed(() => {
      const start = (currentPage.value - 1) * songsPerPage
      const end = start + songsPerPage
      return sortedSongs.value.slice(start, end)
    })

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

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
      paginatedSongs,
      currentPage,
      totalPages,
      changePage,
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
  font-family: 'Poppins', sans-serif;
  background: #191717;
  min-height: 100vh;
  width: 100%;
  color: white;
  position: relative;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  margin-top: 65px;
  padding-bottom: 40px;
}

/* Dynamic Wave Background */
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

.artist-analytics-page::before {
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

/* Header Section */
.welcome-section h1 {
  color: #fff;
  font-weight: 700;
  font-size: 2.3rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-top: 2rem;
}

.header-subtitle {
  color: #b0b1ba;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.btn-back-dashboard {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 22px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.btn-back-dashboard:hover {
  border-color: #bb1814;
  color: #bb1814;
  transform: translateY(-2px);
}

/* Stat Cards */
.stat-card {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  transition: all 0.3s ease;
  padding: 1.5rem;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(187, 24, 20, 0.5);
}

.stat-card-body {
  position: relative;
}

.stat-icon-small {
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bb1814;
  font-size: 1.3rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.stat-value {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

/* Cards */
.card {
  background: rgba(35, 35, 38, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  color: white;
}

.card-header {
  background: rgba(187, 24, 20, 0.2);
  border-bottom: 1px solid rgba(187, 24, 20, 0.3);
  padding: 1rem 1.5rem;
  border-radius: 16px 16px 0 0;
}

.card-header h5 {
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.card-header i {
  color: #bb1814;
}

.card-body {
  padding: 1.5rem;
}

.text-muted {
  color: rgba(255, 255, 255, 0.6) !important;
}

small {
  color: rgba(255, 255, 255, 0.6);
}

/* Table Styles */
.table {
  color: white;
  margin-bottom: 0;
  background: transparent;
}

.table thead th {
  background: transparent;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(187, 24, 20, 0.3);
  padding: 1rem;
}

.table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  background: transparent;
}

.table-hover tbody tr:hover {
  background-color: rgba(187, 24, 20, 0.1);
  cursor: default;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
  color: white;
  background: transparent;
}

.table tbody td strong {
  color: white;
}

.table tbody td small {
  color: rgba(255, 255, 255, 0.6);
}

/* Badge Styles */
.badge {
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.bg-secondary {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white;
}

.badge.bg-success {
  background: rgba(29, 185, 84, 0.9) !important;
  color: white;
}

.badge.bg-danger {
  background: rgba(187, 24, 20, 0.9) !important;
  color: white;
}

.badge.bg-warning {
  background: rgba(255, 193, 7, 0.9) !important;
  color: #000;
}

/* Progress Bars */
.progress {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, #bb1814, #d32f2f);
  transition: width 0.6s ease;
}

.progress-bar.bg-primary {
  background: linear-gradient(90deg, #bb1814, #d32f2f);
}

.progress-bar.bg-success {
  background: linear-gradient(90deg, #1db954, #1ed760);
}

.progress-bar.bg-info {
  background: linear-gradient(90deg, #17a2b8, #20c9e0);
}

.progress-bar.bg-warning {
  background: linear-gradient(90deg, #ffc107, #ffcd39);
}

.progress-bar.bg-danger {
  background: linear-gradient(90deg, #bb1814, #d32f2f);
}

/* Genre Bars */
.genre-bar {
  animation: fadeIn 0.5s ease-in;
}

.genre-bar span {
  color: white;
  font-size: 0.9rem;
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
  background: rgba(35, 35, 38, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.top-event-card:hover {
  border-color: #bb1814;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(187, 24, 20, 0.3);
}

.top-event-card .card-body {
  padding: 1.25rem;
}

.top-event-card h6 {
  color: white;
  font-size: 1rem;
}

.top-event-card small {
  color: rgba(255, 255, 255, 0.6);
}

.top-event-card span {
  color: white;
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
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #bb1814 0%, #8b1410 100%);
  border: none;
  border-radius: 25px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  padding: 0.75rem 1.5rem;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #d41e1e 0%, #9f1612 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(187, 24, 20, 0.3);
}

/* Empty States */
.text-center i.bi {
  color: rgba(255, 255, 255, 0.5);
}

.text-center p {
  color: rgba(255, 255, 255, 0.7);
}

.table-responsive {
  background: transparent;
}

/* Icon Colors */
.text-primary {
  color: #bb1814 !important;
}

.text-danger {
  color: #bb1814 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.bi-star-fill {
  color: #ffc107;
}

/* Pagination */
.pagination-container {
  gap: 0.5rem;
}

.btn-pagination {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-pagination:hover:not(:disabled) {
  background: rgba(187, 24, 20, 0.2);
  border-color: #bb1814;
  color: white;
}

.btn-pagination.active {
  background: linear-gradient(135deg, #bb1814, #8b1410);
  border-color: #bb1814;
  color: white;
}

.btn-pagination:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-pagination i {
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 80px;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }

  .header-subtitle {
    font-size: 0.85rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .btn-back-dashboard {
    font-size: 0.85rem;
    padding: 8px 16px;
  }

  .table {
    font-size: 0.85rem;
  }

  .table thead th,
  .table tbody td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 576px) {
  .welcome-section .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }

  .btn-back-dashboard {
    width: 100%;
    text-align: center;
  }

  .stat-value {
    font-size: 1.8rem;
  }
}
</style>
