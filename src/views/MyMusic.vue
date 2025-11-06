<template>
  <div class="my-music-page">
    <NavigationBar />

    <!-- Dynamic Wave Background -->
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

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <!-- Header -->
        <div class="welcome-section mb-5">
          <h1 class="display-5 fw-bold mb-2">MY MUSIC</h1>
          <p class="text-muted">Your saved songs collection</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading your music...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="savedSongs.length === 0" class="text-center py-5">
          <i class="bi bi-music-note-list fs-1 text-muted mb-3"></i>
          <h2 class="h4 mb-3 text-white">No saved songs yet</h2>
          <p class="text-muted mb-4">Start exploring and heart songs you love!</p>
          <router-link to="/home" class="btn btn-primary"> Discover Music </router-link>
        </div>

        <!-- Saved Songs Carousel -->
        <div v-else class="carousel-container px-2 px-sm-0">
          <button
            v-if="currentSongPage > 0"
            @click="previousSongPage"
            class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 start-0 translate-middle-y shadow z-3 ms-2 ms-md-0"
            aria-label="Previous songs"
          >
            <i class="bi bi-chevron-left fs-5"></i>
          </button>

          <div class="artists-carousel">
            <div
              class="artists-grid-carousel"
              :style="{ transform: `translateX(-${currentSongPage * 100}%)` }"
            >
              <div
                v-for="(page, pageIndex) in paginatedSavedSongs"
                :key="`song-page-${pageIndex}`"
                class="carousel-page artists-page"
              >
                <div
                  class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2 g-sm-3 g-lg-4 pt-2 pt-sm-3 pb-2 pb-sm-3"
                >
                  <div v-for="song in page" :key="song.key" class="col">
                    <div class="song-card">
                      <!-- Embedded Player at Top -->
                      <div class="player-container">
                        <!-- Spotify Embed -->
                        <iframe
                          v-if="song.platform === 'spotify'"
                          :src="`https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator`"
                          width="100%"
                          height="232"
                          frameborder="0"
                          allowtransparency="true"
                          allow="encrypted-media"
                          loading="lazy"
                          style="min-height: 232px"
                        ></iframe>

                        <!-- SoundCloud Embed -->
                        <iframe
                          v-else-if="song.platform === 'soundcloud'"
                          width="100%"
                          height="232"
                          scrolling="no"
                          frameborder="no"
                          allow="autoplay"
                          :src="`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                            song.url,
                          )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`"
                          loading="lazy"
                        ></iframe>

                        <!-- YouTube Embed -->
                        <iframe
                          v-else-if="song.platform === 'youtube'"
                          width="100%"
                          height="232"
                          :src="`https://www.youtube.com/embed/${song.youtubeId}`"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                          loading="lazy"
                        ></iframe>

                        <!-- Fallback Link -->
                        <a
                          v-else
                          :href="song.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="song-link"
                        >
                          🎵 Open {{ song.platform }} →
                        </a>
                      </div>

                      <!-- Bottom Section: Artist Info, Genre Tags, and Stats -->
                      <div
                        class="song-footer d-flex justify-content-between align-items-center gap-2 w-100"
                      >
                        <!-- Left: image, details (with ellipsis!) -->
                        <div class="d-flex align-items-center gap-3 flex-grow-1 min-width-0">
                          <img
                            :src="song.artistPhoto || '/default-avatar.png'"
                            :alt="song.artistName"
                            class="artist-photo-bottom"
                          />
                          <div class="song-details min-width-0 overflow-hidden">
                            <div class="song-title-bottom text-truncate">{{ song.title }}</div>
                            <router-link
                              :to="`/artist/${song.artistId}`"
                              class="artist-name-bottom text-truncate"
                            >
                              {{ song.artistName }}
                            </router-link>
                            <small class="added-date">Added {{ formatDate(song.savedAt) }}</small>
                          </div>
                        </div>
                        <!-- Right: Like/Comment buttons -->
                        <div
                          class="song-stats d-flex flex-row align-items-center gap-2 flex-shrink-0 ms-2"
                        >
                          <button
                            @click="handleUnlike(song)"
                            class="stat-button liked"
                            :disabled="unlikingInProgress[song.key]"
                          >
                            <span class="icon">❤️</span>
                            <span class="count">{{ song.likes || 0 }}</span>
                          </button>
                          <button @click.stop="openSongDetail(song)" class="stat-button">
                            <span class="icon">💬</span>
                            <span class="count">{{ song.commentCount || 0 }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="currentSongPage < totalSongPages - 1"
            @click="nextSongPage"
            class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 end-0 translate-middle-y shadow z-3 me-2 me-md-0"
            aria-label="Next songs"
          >
            <i class="bi bi-chevron-right fs-5"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Song Detail Modal (combines embed + comments) -->
    <SongDetailModal
      :show="showSongDetailModal"
      :song="selectedSongForDetail"
      @close="closeSongDetailModal"
      @comment-posted="handleDetailCommentPosted"
    />
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { toggleSongLike } from '@/utils/musicInteractions'
import NavigationBar from '@/components/NavigationBar.vue'
import SongDetailModal from '@/components/SongDetailModal.vue'

export default {
  name: 'MyMusic',
  components: {
    NavigationBar,
    SongDetailModal,
  },

  data() {
    return {
      loading: true,
      savedSongs: [],
      unlikingInProgress: {},

      // Song Detail Modal (combines embed + comments)
      showSongDetailModal: false,
      selectedSongForDetail: null,

      auth,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
      currentSongPage: 0,
    }
  },

  async mounted() {
    await this.loadSavedSongs()
    if (typeof window !== 'undefined') {
      this._resizeTimeout = null
      this.handleResize = () => {
        if (this._resizeTimeout) clearTimeout(this._resizeTimeout)
        this._resizeTimeout = setTimeout(() => {
          this.windowWidth = window.innerWidth
        }, 150)
      }
      window.addEventListener('resize', this.handleResize)
    }
  },

  beforeUnmount() {
    if (typeof window !== 'undefined' && this.handleResize) {
      window.removeEventListener('resize', this.handleResize)
    }
    if (this._resizeTimeout) clearTimeout(this._resizeTimeout)
  },

  computed: {
    columnsPerRow() {
      const w = this.windowWidth
      if (w < 768) return 1
      if (w < 992) return 2
      return 3
    },
    songsPerPage() {
      return this.columnsPerRow * 2 // 2 rows consistently
    },
    paginatedSavedSongs() {
      const pages = []
      let start = 0
      while (start < this.savedSongs.length) {
        const end = Math.min(start + this.songsPerPage, this.savedSongs.length)
        pages.push(this.savedSongs.slice(start, end))
        start = end
      }
      return pages
    },
    totalSongPages() {
      return this.paginatedSavedSongs.length
    },
  },

  methods: {
    async loadSavedSongs() {
      try {
        this.loading = true
        const user = auth.currentUser

        if (!user) {
          this.$router.push('/login')
          return
        }

        console.log('Loading saved songs for user:', user.uid)

        // Get user's saved songs
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) {
          console.log('User document does not exist')
          this.savedSongs = []
          this.loading = false
          return
        }

        const userData = userDoc.data()
        console.log('User data:', userData)

        const savedSongKeys = userData.savedSongs || []
        console.log('Saved song keys:', savedSongKeys)

        if (savedSongKeys.length === 0) {
          console.log('No saved songs found in user document')
          this.savedSongs = []
          this.loading = false
          return
        }

        // Fetch full song data for each saved song
        const songsData = []

        for (const songKey of savedSongKeys) {
          console.log('Processing song key:', songKey)

          // Split only on the FIRST underscore (artistId_music_timestamp_random)
          const firstUnderscoreIndex = songKey.indexOf('_')
          const artistId = songKey.substring(0, firstUnderscoreIndex)
          const songId = songKey.substring(firstUnderscoreIndex + 1)

          // Extract timestamp from songId (format: music_timestamp_random)
          // Example: music_1699123456789_abc123
          const songIdParts = songId.split('_')
          let savedTimestamp = Date.now() // fallback to now
          if (songIdParts.length >= 2 && !isNaN(songIdParts[1])) {
            savedTimestamp = parseInt(songIdParts[1])
          }

          console.log('  Artist ID:', artistId)
          console.log('  Song ID:', songId)
          console.log('  Saved timestamp:', savedTimestamp, new Date(savedTimestamp))

          // Get artist document
          const artistDoc = await getDoc(doc(db, 'artists', artistId))
          if (!artistDoc.exists()) {
            console.log('Artist not found:', artistId)
            continue
          }

          const artistData = artistDoc.data()
          const musicLinks = artistData.musicLinks || []

          // Find the specific song
          const song = musicLinks.find((s) => s.id === songId)
          if (!song) {
            console.log('Song not found:', songId, 'in', musicLinks.length, 'songs')
            continue
          }

          console.log('Found song:', song.title)

          // Extract platform-specific IDs
          let platform = 'unknown'
          let spotifyId = null
          let soundcloudUrl = null
          let youtubeId = null

          if (song.url.includes('spotify.com')) {
            platform = 'spotify'
            const match = song.url.match(/track\/([a-zA-Z0-9]+)/)
            spotifyId = match ? match[1] : null
          } else if (song.url.includes('soundcloud.com')) {
            platform = 'soundcloud'
            soundcloudUrl = song.url
          } else if (song.url.includes('youtube.com') || song.url.includes('youtu.be')) {
            platform = 'youtube'
            const match = song.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
            youtubeId = match ? match[1] : null
          }

          songsData.push({
            key: songKey,
            artistId,
            songId,
            title: song.title || 'Untitled',
            url: song.url,
            platform,
            spotifyId,
            soundcloudUrl,
            youtubeId,
            likes: song.likes || 0,
            commentCount: song.commentCount || 0,
            artistName: artistData.artistName || 'Unknown Artist',
            artistGenre: artistData.genre || '',
            artistPhoto: artistData.profileImage || '',
            savedAt: savedTimestamp, // Use extracted timestamp from songId
          })
        }

        this.savedSongs = songsData
        console.log('Total saved songs loaded:', songsData.length)
        this.loading = false
      } catch (error) {
        console.error('Error loading saved songs:', error)
        this.loading = false
      }
    },

    nextSongPage() {
      if (this.currentSongPage < this.totalSongPages - 1) {
        this.currentSongPage++
      }
    },

    previousSongPage() {
      if (this.currentSongPage > 0) {
        this.currentSongPage--
      }
    },

    async handleUnlike(song) {
      if (this.unlikingInProgress[song.key]) return

      const confirmUnlike = confirm('Remove this song from your collection?')
      if (!confirmUnlike) return

      try {
        this.unlikingInProgress[song.key] = true

        // Unlike the song (which also unsaves it)
        const result = await toggleSongLike(song.artistId, song.songId, true)

        if (result.success) {
          // Remove from UI immediately
          this.savedSongs = this.savedSongs.filter((s) => s.key !== song.key)
        } else {
          alert('Failed to remove song. Please try again.')
        }
      } catch (error) {
        console.error('Error unliking song:', error)
        alert('Failed to remove song. Please try again.')
      } finally {
        this.unlikingInProgress[song.key] = false
      }
    },

    formatDate(timestamp) {
      const date = new Date(timestamp)
      const now = Date.now()
      const diff = now - timestamp

      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return 'just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`

      return date.toLocaleDateString()
    },

    // Song Detail Modal (combines embed + comments)
    openSongDetail(song) {
      console.log('Opening song detail for:', song.title, {
        artistId: song.artistId,
        songId: song.songId,
        platform: song.platform,
      })

      // Generate embedUrl based on platform
      let embedUrl = null
      if (song.platform === 'spotify' && song.spotifyId) {
        embedUrl = `https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator`
      } else if (song.platform === 'youtube' && song.youtubeId) {
        embedUrl = `https://www.youtube.com/embed/${song.youtubeId}`
      }

      // Convert the saved song format to the format expected by SongDetailModal
      this.selectedSongForDetail = {
        id: song.songId,
        artistId: song.artistId,
        title: song.title,
        url: song.url,
        platform: song.platform,
        embedUrl: embedUrl,
        spotifyId: song.spotifyId,
        soundcloudUrl: song.soundcloudUrl,
        youtubeId: song.youtubeId,
        likes: song.likes,
        commentCount: song.commentCount,
        artistName: song.artistName,
        artistGenre: song.artistGenre,
        artistPhoto: song.artistPhoto,
      }
      this.showSongDetailModal = true
    },

    closeSongDetailModal() {
      this.showSongDetailModal = false
      this.selectedSongForDetail = null
    },

    handleDetailCommentPosted() {
      // Find and update the comment count for the song
      const song = this.savedSongs.find(
        (s) =>
          s.artistId === this.selectedSongForDetail.artistId &&
          s.songId === this.selectedSongForDetail.id,
      )
      if (song) {
        song.commentCount = (song.commentCount || 0) + 1
        // Also update the selected song for detail modal
        this.selectedSongForDetail.commentCount = song.commentCount
      }
    },

    nextSongPage() {
      if (this.currentSongPage < this.totalSongPages - 1) this.currentSongPage++
    },
    previousSongPage() {
      if (this.currentSongPage > 0) this.currentSongPage--
    },
  },

  watch: {
    // Clamp current page when the number of pages changes (e.g., resize or data updates)
    totalSongPages(newPages) {
      if (this.currentSongPage > newPages - 1) {
        this.currentSongPage = Math.max(0, newPages - 1)
      }
    },
  },
}
</script>

<style scoped>
.my-music-page {
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

/* Carousel structure (match interests) */
.carousel-container {
  position: relative;
}
.artists-carousel {
  overflow-x: hidden;
  overflow-y: visible;
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

.my-music-page::before {
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

.welcome-section h1 {
  color: #fff;
  font-weight: 700;
  font-size: 2.3rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-top: 2rem;
}

.welcome-section p {
  color: #d4d5db;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-subtitle {
  color: #b0b1ba;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.text-muted {
  color: #b0b1ba !important;
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

.song-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.song-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(187, 24, 20, 0.3);
  border-color: #bb1814;
}

/* Player Container at Top */
.player-container {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  height: 232px;
  position: relative;
}

.player-container iframe {
  border: none;
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: absolute;
  top: 0;
  left: 0;
}

/* Ensure Spotify embed fills the container */
.player-container iframe[src*='spotify'] {
  min-height: 232px;
}

.player-container iframe::-webkit-scrollbar {
  display: none;
}

.song-link {
  display: block;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #bb1814 0%, #960f0c 100%);
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 12px;
  transition: opacity 0.2s;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
}

.song-link:hover {
  opacity: 0.9;
}

/* Song Footer Container */
.song-footer {
  padding: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

/* Artist Info at Bottom */
.song-artist-info {
  gap: 0.75rem;
}

.artist-photo-bottom {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #bb1814;
  flex-shrink: 0;
}

.song-details {
  min-width: 0;
  overflow: hidden;
}

.song-title-bottom {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
  font-family: 'Poppins', sans-serif;
  display: block;
}

.artist-name-bottom {
  font-size: 0.9rem;
  font-weight: 500;
  color: #b0b1ba;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Poppins', sans-serif;
  display: block;
}

.min-width-0 {
  min-width: 0;
}

.artist-name-bottom:hover {
  color: #bb1814;
}

.added-date {
  font-size: 0.8rem;
  color: #888;
  font-family: 'Poppins', sans-serif;
}

.stat-button {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.7rem;
  border-radius: 20px;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  color: #fff;
  font-family: 'Poppins', sans-serif;
}

.stat-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.stat-button:active:not(:disabled) {
  transform: scale(0.95);
}

.stat-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stat-button.liked {
  background: rgba(187, 24, 20, 0.3);
}

.stat-button.liked:hover:not(:disabled) {
  background: rgba(187, 24, 20, 0.5);
}

/* Pulse animation when liked */
.stat-button.liked .icon {
  animation: heartPulse 0.3s ease-in-out;
}

@keyframes heartPulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #888;
  font-size: 0.85rem;
  font-family: 'Poppins', sans-serif;
}

.icon {
  font-size: 1rem;
}

.count {
  font-weight: 600;
  color: #fff;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 2rem;
    padding-top: 1rem;
  }

  .welcome-section p {
    font-size: 0.85rem;
  }
}
</style>
