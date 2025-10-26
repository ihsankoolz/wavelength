<template>
  <div class="my-music-page">
    <NavigationBar />

    <div class="container">
      <div class="page-header">
        <h1>My Music</h1>
        <p class="subtitle">Your saved songs collection</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your music...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="savedSongs.length === 0" class="empty-state">
        <div class="empty-icon">🎵</div>
        <h2>No saved songs yet</h2>
        <p>Start exploring and heart songs you love!</p>
        <router-link to="/home" class="cta-button"> Discover Music </router-link>
      </div>

      <!-- Saved Songs List -->
      <div v-else class="songs-grid">
        <div v-for="song in savedSongs" :key="song.key" class="song-card">
          <!-- Artist Info -->
          <div class="artist-header">
            <img
              :src="song.artistPhoto || '/default-avatar.png'"
              :alt="song.artistName"
              class="artist-avatar"
            />
            <div class="artist-info">
              <router-link :to="`/artist/${song.artistId}`" class="artist-name">
                {{ song.artistName }}
              </router-link>
              <span class="artist-genre">{{ song.artistGenre }}</span>
            </div>
          </div>

          <!-- Song Title -->
          <h3 class="song-title">{{ song.title }}</h3>

          <!-- Embedded Player -->
          <div class="player-container">
            <!-- Spotify Embed -->
            <iframe
              v-if="song.platform === 'spotify'"
              :src="`https://open.spotify.com/embed/track/${song.spotifyId}`"
              width="100%"
              height="152"
              frameborder="0"
              allowtransparency="true"
              allow="encrypted-media"
              loading="lazy"
            ></iframe>

            <!-- SoundCloud Embed -->
            <iframe
              v-else-if="song.platform === 'soundcloud'"
              width="100%"
              height="166"
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
              height="200"
              :src="`https://www.youtube.com/embed/${song.youtubeId}`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
            ></iframe>

            <!-- Fallback Link -->
            <a v-else :href="song.url" target="_blank" rel="noopener noreferrer" class="song-link">
              🎵 Open {{ song.platform }} →
            </a>
          </div>

          <!-- Song Stats -->
          <div class="song-stats">
            <button
              @click="handleUnlike(song)"
              class="stat-button liked"
              :disabled="unlikingInProgress[song.key]"
            >
              <span class="icon">❤️</span>
              <span class="count">{{ song.likes }}</span>
            </button>

            <div class="stat-item">
              <span class="icon">💬</span>
              <span class="count">{{ song.commentCount || 0 }}</span>
            </div>

            <span class="added-date"> Added {{ formatDate(song.savedAt) }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { toggleSongLike } from '@/utils/musicInteractions'
import NavigationBar from '@/components/NavigationBar.vue'

export default {
  name: 'MyMusic',
  components: {
    NavigationBar,
  },

  data() {
    return {
      loading: true,
      savedSongs: [],
      unlikingInProgress: {},
      auth,
    }
  },

  async mounted() {
    await this.loadSavedSongs()
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

        console.log('🎵 Loading saved songs for user:', user.uid)

        // Get user's saved songs
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) {
          console.log('❌ User document does not exist')
          this.savedSongs = []
          this.loading = false
          return
        }

        const userData = userDoc.data()
        console.log('📄 User data:', userData)

        const savedSongKeys = userData.savedSongs || []
        console.log('💾 Saved song keys:', savedSongKeys)

        if (savedSongKeys.length === 0) {
          console.log('⚠️ No saved songs found in user document')
          this.savedSongs = []
          this.loading = false
          return
        }

        // Fetch full song data for each saved song
        const songsData = []

        for (const songKey of savedSongKeys) {
          console.log('🔍 Processing song key:', songKey)

          // Split only on the FIRST underscore (artistId_music_timestamp_random)
          const firstUnderscoreIndex = songKey.indexOf('_')
          const artistId = songKey.substring(0, firstUnderscoreIndex)
          const songId = songKey.substring(firstUnderscoreIndex + 1)

          console.log('  📌 Artist ID:', artistId)
          console.log('  🎵 Song ID:', songId)

          // Get artist document
          const artistDoc = await getDoc(doc(db, 'artists', artistId))
          if (!artistDoc.exists()) {
            console.log('❌ Artist not found:', artistId)
            continue
          }

          const artistData = artistDoc.data()
          const musicLinks = artistData.musicLinks || []

          // Find the specific song
          const song = musicLinks.find((s) => s.id === songId)
          if (!song) {
            console.log('❌ Song not found:', songId, 'in', musicLinks.length, 'songs')
            continue
          }

          console.log('✅ Found song:', song.title)

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
            artistPhoto: artistData.photoURL || '',
            savedAt: Date.now(), // We'll use current time for now
          })
        }

        this.savedSongs = songsData
        console.log('✅ Total saved songs loaded:', songsData.length)
        this.loading = false
      } catch (error) {
        console.error('❌ Error loading saved songs:', error)
        this.loading = false
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
  },
}
</script>

<style scoped>
.my-music-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* Songs Grid */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.song-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.song-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

/* Artist Header */
.artist-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.artist-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #667eea;
}

.artist-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.artist-name {
  font-weight: 600;
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
}

.artist-name:hover {
  color: #667eea;
}

.artist-genre {
  font-size: 0.85rem;
  color: #888;
}

/* Song Title */
.song-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

/* Player Container */
.player-container {
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
}

.song-link {
  display: block;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 12px;
  transition: opacity 0.2s;
}

.song-link:hover {
  opacity: 0.9;
}

/* Song Stats */
.song-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.stat-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: background 0.2s;
  font-size: 1rem;
}

.stat-button:hover:not(:disabled) {
  background: #f8f8f8;
}

.stat-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stat-button.liked {
  color: #e74c3c;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.icon {
  font-size: 1.2rem;
}

.count {
  font-weight: 600;
  color: #333;
}

.added-date {
  margin-left: auto;
  font-size: 0.85rem;
  color: #888;
}

/* Responsive */
@media (max-width: 768px) {
  .songs-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .song-stats {
    flex-wrap: wrap;
  }

  .added-date {
    width: 100%;
    margin-left: 0;
    margin-top: 0.5rem;
  }
}
</style>
