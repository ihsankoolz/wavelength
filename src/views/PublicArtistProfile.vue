<!-- public artist profile.vue -->
 <template>
  <div class="public-artist-profile">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Loading State -->
    <div v-if="loading" class="content-wrapper">
      <div class="container text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading artist profile...</p>
      </div>
    </div>

    <!-- Artist Not Found -->
    <div v-else-if="!artist" class="content-wrapper">
      <div class="container text-center py-5">
        <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
        <h3>Artist Not Found</h3>
        <p class="text-muted">This artist profile doesn't exist or has been removed.</p>
        <router-link to="/home" class="btn btn-primary">
          Back to Home
        </router-link>
      </div>
    </div>

    <!-- Artist Profile Content -->
    <div v-else class="content-wrapper">
      <div class="container py-4">
        
        <!-- Artist Header -->
        <div class="artist-header text-center mb-5">
          <div class="position-relative d-inline-block mb-3">
            <img 
              :src="artist.profileImage || defaultImage" 
              :alt="artist.artistName"
              class="artist-avatar"
            >
            <div v-if="artist.verified" class="verified-badge-large">
              <i class="bi bi-patch-check-fill"></i>
            </div>
          </div>
          
          <h1 class="display-4 fw-bold mb-2">{{ artist.artistName }}</h1>
          <p class="lead text-muted mb-3">{{ artist.bio || 'No bio available' }}</p>
          
          <!-- Genres -->
          <div class="mb-4">
            <span 
              v-for="genre in artist.genres" 
              :key="genre"
              class="badge bg-primary me-2 mb-2"
              style="font-size: 1rem; padding: 0.5rem 1rem;"
            >
              {{ genre }}
            </span>
          </div>

          <!-- Stats & Follow Button -->
          <div class="d-flex justify-content-center align-items-center gap-4 mb-4">
            <div class="stat-item">
              <i class="bi bi-people fs-4 text-primary"></i>
              <span class="ms-2 fw-bold">{{ artist.followerCount || 0 }} followers</span>
            </div>
            <button 
              class="btn btn-primary btn-lg"
              @click="toggleFollow"
              :disabled="followLoading"
            >
              <span v-if="followLoading" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi" :class="isFollowing ? 'bi-check-circle-fill' : 'bi-plus-circle'"></i>
              {{ isFollowing ? 'Following' : 'Follow' }}
            </button>
          </div>

          <!-- Social Links -->
          <div v-if="hasSocialLinks" class="social-links">
            <a 
              v-if="artist.socialLinks?.spotify" 
              :href="artist.socialLinks.spotify" 
              target="_blank"
              class="btn btn-success btn-sm me-2"
            >
              <i class="bi bi-spotify"></i> Spotify
            </a>
            <a 
              v-if="artist.socialLinks?.youtube" 
              :href="artist.socialLinks.youtube" 
              target="_blank"
              class="btn btn-danger btn-sm me-2"
            >
              <i class="bi bi-youtube"></i> YouTube
            </a>
            <a 
              v-if="artist.socialLinks?.instagram" 
              :href="artist.socialLinks.instagram" 
              target="_blank"
              class="btn btn-outline-dark btn-sm"
            >
              <i class="bi bi-instagram"></i> Instagram
            </a>
          </div>
        </div>

        <!-- Tabs Section -->
        <div class="row">
          <div class="col-12">
            <ul class="nav nav-tabs nav-justified mb-4" role="tablist">
              <li class="nav-item">
                <button 
                  class="nav-link"
                  :class="{ active: activeTab === 'music' }"
                  @click="activeTab = 'music'"
                >
                  <i class="bi bi-music-note-beamed"></i> Music
                </button>
              </li>
              <li class="nav-item">
                <button 
                  class="nav-link"
                  :class="{ active: activeTab === 'events' }"
                  @click="activeTab = 'events'"
                >
                  <i class="bi bi-calendar-event"></i> Events
                </button>
              </li>
              <li class="nav-item">
                <button 
                  class="nav-link"
                  :class="{ active: activeTab === 'about' }"
                  @click="activeTab = 'about'"
                >
                  <i class="bi bi-info-circle"></i> About
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">

            <!-- Music Tab -->
            <div v-if="activeTab === 'music'" class="tab-content-section">
              <div class="card shadow-sm mb-4">
                <div class="card-body p-4">
                  
                  <!-- Latest Single -->
                  <div v-if="artist.latestSingle || artist.youtubeVideoUrl" class="mb-5">
                    <h4 class="mb-3">
                      <i class="bi bi-music-note text-success"></i>
                      {{ artist.latestSingle || 'Latest Single' }}
                    </h4>
                    <div v-if="artist.youtubeVideoUrl" class="video-wrapper">
                      <iframe 
                        :src="getYouTubeEmbedUrl(artist.youtubeVideoUrl)"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        class="youtube-iframe"
                      ></iframe>
                    </div>
                    <div v-else class="alert alert-info">
                      <i class="bi bi-music-note"></i> No video available yet
                    </div>
                  </div>

                  <!-- Latest Album -->
                  <div v-if="artist.latestAlbum || artist.spotifyTrackUrl">
                    <h4 class="mb-3">
                      <i class="bi bi-disc text-success"></i>
                      {{ artist.latestAlbum || 'Latest Album' }}
                    </h4>
                    <div v-if="artist.spotifyTrackUrl" class="spotify-wrapper">
                      <iframe 
                        :src="getSpotifyEmbedUrl(artist.spotifyTrackUrl)"
                        width="100%" 
                        height="352" 
                        frameborder="0" 
                        allowtransparency="true" 
                        allow="encrypted-media"
                        class="spotify-iframe"
                      ></iframe>
                    </div>
                    <div v-else class="alert alert-info">
                      <i class="bi bi-disc"></i> No tracks available yet
                    </div>
                  </div>

                  <!-- No Music Message -->
                  <div v-if="!artist.latestSingle && !artist.latestAlbum && !artist.youtubeVideoUrl && !artist.spotifyTrackUrl" class="text-center py-5">
                    <i class="bi bi-music-note-list fs-1 text-muted mb-3"></i>
                    <p class="text-muted">This artist hasn't uploaded any music yet.</p>
                  </div>

                </div>
              </div>
            </div>

            <!-- Events Tab -->
            <div v-if="activeTab === 'events'" class="tab-content-section">
              <!-- Loading Events -->
              <div v-if="loadingEvents" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-3">Loading events...</p>
              </div>

              <!-- No Events -->
              <div v-else-if="artistEvents.length === 0" class="text-center py-5">
                <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
                <p class="text-muted">No upcoming events scheduled.</p>
              </div>

              <!-- Events List -->
              <div v-else class="row g-4">
                <div 
                  v-for="event in artistEvents" 
                  :key="event.id"
                  class="col-12 col-md-6"
                >
                  <EventCard :event="event" />
                </div>
              </div>
            </div>

            <!-- About Tab -->
            <div v-if="activeTab === 'about'" class="tab-content-section">
              <div class="card shadow-sm">
                <div class="card-body p-5">
                  <h4 class="mb-4">About {{ artist.artistName }}</h4>
                  
                  <div v-if="artist.aboutSection" class="about-text mb-4">
                    <p style="font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap;">
                      {{ artist.aboutSection }}
                    </p>
                  </div>
                  <div v-else class="alert alert-info">
                    <i class="bi bi-info-circle"></i> No additional information available.
                  </div>

                  <!-- Artist Stats -->
                  <div class="stats-grid mt-4">
                    <div class="stat-box">
                      <i class="bi bi-calendar3 text-primary fs-4"></i>
                      <div>
                        <div class="fw-bold">Member Since</div>
                        <div class="text-muted">{{ formatDate(artist.createdAt) }}</div>
                      </div>
                    </div>
                    <div class="stat-box">
                      <i class="bi bi-music-note-list text-primary fs-4"></i>
                      <div>
                        <div class="fw-bold">Genres</div>
                        <div class="text-muted">{{ artist.genres?.length || 0 }} genres</div>
                      </div>
                    </div>
                    <div class="stat-box">
                      <i class="bi bi-calendar-event text-primary fs-4"></i>
                      <div>
                        <div class="fw-bold">Upcoming Events</div>
                        <div class="text-muted">{{ artistEvents.length }} events</div>
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
import { auth, db } from '@/services/firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore' // ⭐ Removed orderBy import
import EventCard from '@/components/EventCard.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import { followArtist, unfollowArtist, isUserFollowingArtist } from '@/utils/userInteractions'

export default {
  name: 'PublicArtistProfile',
  components: {
    EventCard,
    NavigationBar
  },
  data() {
    return {
      artist: null,
      artistEvents: [],
      loading: true,
      loadingEvents: false,
      activeTab: 'music',
      isFollowing: false,
      followLoading: false,
      defaultImage: 'https://ui-avatars.com/api/?name=Artist&size=300&background=667eea&color=fff' // ⭐ FIXED
    }
  },
  computed: {
    hasSocialLinks() {
      const links = this.artist?.socialLinks || {}
      return links.spotify || links.youtube || links.instagram
    }
  },
  async mounted() {
    await this.loadArtistProfile()
    await this.loadArtistEvents()
    await this.checkFollowStatus()
  },
  methods: {
    async loadArtistProfile() {
      try {
        const artistId = this.$route.params.id
        
        const artistDoc = await getDoc(doc(db, 'artists', artistId))
        
        if (artistDoc.exists()) {
          this.artist = {
            id: artistDoc.id,
            ...artistDoc.data()
          }
          console.log('Artist loaded:', this.artist.artistName)
        } else {
          console.warn('Artist not found:', artistId)
        }
      } catch (error) {
        console.error('Error loading artist:', error)
      } finally {
        this.loading = false
      }
    },

    async loadArtistEvents() {
      if (!this.artist) return
      
      try {
        this.loadingEvents = true
        
        // ⭐ FIXED: Removed orderBy to avoid index requirement
        const eventsQuery = query(
          collection(db, 'events'),
          where('artistId', '==', this.artist.id)
        )
        
        const eventsSnapshot = await getDocs(eventsQuery)
        console.log(`Raw events found: ${eventsSnapshot.docs.length}`)
        
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        // Filter for upcoming events and sort client-side
        this.artistEvents = eventsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(event => {
            const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
            return eventDate >= now
          })
          .sort((a, b) => {
            // ⭐ Client-side sorting
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
            return dateA - dateB
          })

        console.log(`✅ ${this.artistEvents.length} upcoming events for ${this.artist.artistName}`)

      } catch (error) {
        console.error('Error loading artist events:', error)
      } finally {
        this.loadingEvents = false
      }
    },

    async checkFollowStatus() {
      try {
        const user = auth.currentUser
        if (user && this.artist) {
          this.isFollowing = await isUserFollowingArtist(user.uid, this.artist.id)
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
      }
    },

    getSpotifyEmbedUrl(url) {
      if (!url) return null
      return url.replace('open.spotify.com/', 'open.spotify.com/embed/')
    },

    getYouTubeEmbedUrl(url) {
      if (!url) return null
      let videoId = ''
      
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0]
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0]
      }
      
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    },

    formatDate(timestamp) {
      if (!timestamp) return 'Unknown'
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      
      return date.toLocaleDateString('en-SG', { 
        year: 'numeric', 
        month: 'long'
      })
    },

    async toggleFollow() {
      const user = auth.currentUser
      if (!user) {
        alert('Please log in to follow artists')
        return
      }

      this.followLoading = true

      try {
        if (this.isFollowing) {
          // Unfollow
          const result = await unfollowArtist(user.uid, this.artist.id)
          if (result.success) {
            this.isFollowing = false
            // Update local count
            if (this.artist.followerCount > 0) {
              this.artist.followerCount--
            }
          }
        } else {
          // Follow
          const result = await followArtist(user.uid, this.artist.id)
          if (result.success) {
            this.isFollowing = true
            // Update local count
            this.artist.followerCount = (this.artist.followerCount || 0) + 1
          }
        }
      } catch (error) {
        console.error('Error toggling follow:', error)
        alert('Failed to update follow status. Please try again.')
      } finally {
        this.followLoading = false
      }
    }
  }
}
</script>

<style scoped>
.public-artist-profile {
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

.btn-outline-light {
  border: 2px solid white;
  color: white;
}

.btn-outline-light:hover {
  background: white;
  color: #667eea;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

/* Artist Header */
.artist-header {
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.artist-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #667eea;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.verified-badge-large {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.verified-badge-large i {
  color: #667eea;
  font-size: 2rem;
}

.stat-item {
  font-size: 1.1rem;
}

.social-links a {
  text-decoration: none;
}

/* Tabs */
.nav-tabs {
  border-bottom: 3px solid #667eea;
}

.nav-tabs .nav-link {
  border: none;
  color: #666;
  font-weight: 600;
  padding: 15px 20px;
  font-size: 1.1rem;
}

.nav-tabs .nav-link.active {
  background-color: #667eea;
  color: white;
  border-radius: 10px 10px 0 0;
}

.nav-tabs .nav-link:hover {
  color: #667eea;
}

/* Tab Content */
.tab-content-section {
  animation: fadeIn 0.3s ease-in;
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

/* Music Embeds */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
}

.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.spotify-wrapper {
  border-radius: 12px;
  overflow: hidden;
  background: #1db954;
}

.spotify-iframe {
  border-radius: 12px;
}

/* About Section */
.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #495057;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 100px;
  }

  .artist-avatar {
    width: 150px;
    height: 150px;
  }

  .display-4 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>