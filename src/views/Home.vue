<!-- Home.vue -->
<template>
  <div class="fan-homepage">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <!-- Welcome Header -->
        <div class="welcome-section mb-4">
          <h1 class="display-5 fw-bold mb-2">Welcome back, {{ userName }}! 👋</h1>
          <p class="text-muted">Discover new music tailored just for you</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading recommendations...</p>
        </div>

        <!-- Content (only show when not loading) -->
        <div v-else>
          <!-- Recommended Songs Section -->
          <section class="recommended-songs-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 class="h3 mb-1">Recommended Songs</h2>
                <p class="text-muted mb-0 small">{{ getRecommendationSubtitle }}</p>
              </div>
            </div>

            <!-- Filter and Sort Controls -->
            <div class="controls-bar mb-4 d-flex flex-wrap gap-3 align-items-center">
              <!-- Genre Filter -->
              <div class="filter-group">
                <label class="small text-muted me-2">Filter by Genre:</label>
                <select
                  v-model="selectedGenreFilter"
                  @change="applyFiltersAndSort"
                  class="form-select form-select-sm"
                  style="width: auto; display: inline-block"
                >
                  <option value="">All Genres</option>
                  <option v-for="genre in allGenres" :key="genre" :value="genre">
                    {{ genre }}
                  </option>
                </select>
              </div>

              <!-- Sort Options -->
              <div class="sort-group">
                <label class="small text-muted me-2">Sort by:</label>
                <select
                  v-model="selectedSort"
                  @change="applyFiltersAndSort"
                  class="form-select form-select-sm"
                  style="width: auto; display: inline-block"
                >
                  <option value="recommended">Recommended</option>
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Added</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            <!-- No songs message -->
            <div v-if="displayedSongs.length === 0" class="text-center py-5">
              <i class="bi bi-music-note-list fs-1 text-muted mb-3"></i>
              <p class="text-muted">No songs found.</p>
              <p class="text-muted small">Check back soon as artists add more music!</p>
            </div>

            <!-- Song Cards Grid -->
            <div v-else class="songs-grid">
              <div
                v-for="song in displayedSongs"
                :key="`${song.artistId}_${song.id}`"
                class="song-card"
              >
                <!-- Artist Info Header -->
                <div class="song-artist-header">
                  <img
                    :src="song.artistPhoto || '/default-avatar.png'"
                    :alt="song.artistName"
                    class="artist-photo"
                    @click="navigateToArtist(song.artistId)"
                    style="cursor: pointer"
                  />
                  <div class="artist-info">
                    <router-link :to="`/artist/${song.artistId}`" class="artist-name">
                      {{ song.artistName }}
                    </router-link>
                    <div class="song-title">{{ song.title }}</div>
                  </div>

                  <!-- Follow Button -->
                  <button
                    v-if="!isFollowing(song.artistId)"
                    @click="followArtist(song.artistId)"
                    class="btn-follow"
                    :disabled="followingInProgress[song.artistId]"
                  >
                    <i class="bi bi-plus"></i>
                  </button>
                  <span v-else class="following-badge">
                    <i class="bi bi-check-circle-fill"></i> Following
                  </span>
                </div>

                <!-- Embedded Player -->
                <div class="player-container" @click="handlePlayerClick(song)">
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

                <!-- Genre Tags -->
                <div class="genre-tags" v-if="song.genres && song.genres.length > 0">
                  <span v-for="genre in song.genres.slice(0, 3)" :key="genre" class="genre-tag">
                    {{ genre }}
                  </span>
                </div>

                <!-- Song Stats & Actions -->
                <div class="song-stats">
                  <button
                    @click="toggleLike(song)"
                    class="stat-button"
                    :class="{ liked: isSongLiked(song) }"
                    :disabled="likingInProgress[`${song.artistId}_${song.id}`]"
                  >
                    <span class="icon">❤️</span>
                    <span class="count">{{ song.likes || 0 }}</span>
                  </button>

                  <div class="stat-item">
                    <span class="icon">💬</span>
                    <span class="count">{{ song.commentCount || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More Button -->
            <div
              v-if="displayedSongs.length > 0 && displayedSongs.length < filteredSongs.length"
              class="text-center mt-4"
            >
              <button
                @click="loadMoreSongs"
                class="btn btn-outline-primary"
                :disabled="loadingMore"
              >
                <span v-if="loadingMore">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Loading...
                </span>
                <span v-else> Load More Songs </span>
              </button>
            </div>
          </section>

          <!-- Discover Artists Section (One Row) -->
          <section class="discover-artists-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 class="h4 mb-1">🎤 Discover Artists</h2>
                <p class="text-muted mb-0 small">Explore talented local artists</p>
              </div>
            </div>

            <!-- Artist Cards - One Row (Horizontal Scroll on Mobile) -->
            <div class="artists-row">
              <div
                v-for="artist in recommendedArtists.slice(0, 6)"
                :key="artist.id"
                class="artist-card-wrapper"
              >
                <ArtistCard :artist="artist" />
              </div>
            </div>
          </section>

          <!-- Upcoming Events Section -->
          <section class="upcoming-events-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 class="h4 mb-1">📅 Upcoming Events</h2>
                <p class="text-muted mb-0 small">Don't miss out on live performances</p>
              </div>
              <router-link to="/events" class="btn btn-sm btn-outline-primary">
                View All
              </router-link>
            </div>

            <!-- Events Loading -->
            <div v-if="loadingEvents" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <!-- Events Grid -->
            <div v-else-if="upcomingEvents.length > 0" class="events-grid">
              <div v-for="event in upcomingEvents.slice(0, 4)" :key="event.id" class="event-card">
                <div class="event-content" @click="$router.push(`/events/${event.id}`)">
                  <div class="event-date">
                    <div class="date-day">{{ formatEventDay(event.date) }}</div>
                    <div class="date-month">{{ formatEventMonth(event.date) }}</div>
                  </div>
                  <div class="event-details">
                    <h5 class="event-title">{{ event.title }}</h5>
                    <p class="event-location"><i class="bi bi-geo-alt"></i> {{ event.location }}</p>
                    <div class="event-artists">
                      <span
                        v-for="(artist, index) in event.artistNames"
                        :key="index"
                        class="artist-tag"
                      >
                        {{ artist }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Small Map Preview -->
                <div class="event-map-preview" @click.stop>
                  <EventMap
                    :location="event.location"
                    :title="event.venue || event.title"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <!-- No Events -->
            <div v-else class="text-center py-4">
              <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
              <p class="text-muted">No upcoming events yet</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import NavigationBar from '@/components/NavigationBar.vue'
import ArtistCard from '@/components/ArtistCard.vue'
import EventMap from '@/components/EventMap.vue'
import { getRecommendedSongs, filterSongsByGenre, sortSongs } from '@/utils/recommendationEngine'
import { toggleSongLike, getUserLikedSongs } from '@/utils/musicInteractions'
import { toggleFollowArtist, getUserFollowedArtists } from '@/utils/artistInteractions'
import {
  trackSongPlay,
  trackArtistClick,
  initializeUserInteractions,
} from '@/utils/interactionTracking'

export default {
  name: 'FanHomepage',
  components: {
    ArtistCard,
    NavigationBar,
    EventMap,
  },
  data() {
    return {
      userName: '',
      userId: '',
      userGenres: [],

      // Songs data
      recommendedSongs: [],
      filteredSongs: [],
      displayedSongs: [],
      songsPerPage: 8,
      currentSongsLoaded: 8,

      // Artists data
      allArtists: [],
      recommendedArtists: [],

      // Events data
      upcomingEvents: [],
      loadingEvents: false,

      // Filters & Sort
      selectedGenreFilter: '',
      selectedSort: 'recommended',
      allGenres: [],

      // User interactions
      likedSongsSet: new Set(),
      followedArtistsSet: new Set(),
      playedSongsSet: new Set(), // Track which songs have been played

      // Loading states
      isLoading: true,
      loadingMore: false,
      likingInProgress: {},
      followingInProgress: {},

      auth,
    }
  },

  computed: {
    getRecommendationSubtitle() {
      if (this.userGenres.length === 0) {
        return 'Trending songs from local artists'
      }
      if (this.followedArtistsSet.size > 0) {
        return `Personalized for you based on your taste`
      }
      return `Based on your interests: ${this.userGenres.slice(0, 3).join(', ')}`
    },
  },

  async mounted() {
    await this.loadUserData()
    await initializeUserInteractions() // Initialize interaction tracking
    await this.loadRecommendations()
    await this.loadArtists()
    await this.loadEvents()
    this.isLoading = false
  },

  methods: {
    async loadUserData() {
      try {
        const user = auth.currentUser
        if (!user) {
          this.$router.push('/login')
          return
        }

        this.userId = user.uid

        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          this.userName = userData.displayName || 'there'
          this.userGenres = userData.preferredGenres || userData.preferences?.genres || []

          // Load user's liked songs and followed artists
          this.likedSongsSet = await getUserLikedSongs(user.uid)
          this.followedArtistsSet = await getUserFollowedArtists(user.uid)

          console.log('👤 User genres:', this.userGenres)
          console.log('❤️ Liked songs:', this.likedSongsSet.size)
          console.log('👥 Following:', this.followedArtistsSet.size)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    },

    async loadRecommendations() {
      try {
        // Get recommended songs using the recommendation engine
        this.recommendedSongs = await getRecommendedSongs(this.userId, {
          limit: 50,
        })

        // Extract all unique genres for filter dropdown
        const genresSet = new Set()
        this.recommendedSongs.forEach((song) => {
          const genres = song.genres || song.artistGenres || []
          genres.forEach((g) => genresSet.add(g))
        })
        this.allGenres = Array.from(genresSet).sort()

        // Apply initial filters and sort
        this.applyFiltersAndSort()

        console.log('🎵 Loaded', this.recommendedSongs.length, 'recommended songs')
      } catch (error) {
        console.error('Error loading recommendations:', error)
      }
    },

    async loadArtists() {
      try {
        const artistsSnapshot = await getDocs(collection(db, 'artists'))
        this.allArtists = artistsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Get top 6 artists for discovery section
        this.recommendedArtists = this.getRecommendedArtists()
      } catch (error) {
        console.error('Error loading artists:', error)
      }
    },

    getRecommendedArtists() {
      if (this.userGenres.length === 0) {
        // No preferences - show popular artists
        return this.allArtists
          .sort((a, b) => (b.followerCount || 0) - (a.followerCount || 0))
          .slice(0, 6)
      }

      // Score artists by genre match
      const scoredArtists = this.allArtists.map((artist) => {
        let score = 0
        if (artist.genres && Array.isArray(artist.genres)) {
          artist.genres.forEach((artistGenre) => {
            if (this.userGenres.includes(artistGenre)) {
              score += 1
            }
          })
        }
        return { ...artist, score }
      })

      return scoredArtists
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score
          }
          return (b.followerCount || 0) - (a.followerCount || 0)
        })
        .slice(0, 6)
    },

    async loadEvents() {
      try {
        this.loadingEvents = true
        const eventsSnapshot = await getDocs(collection(db, 'events'))
        const allEvents = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Filter for upcoming events only
        const now = new Date()
        this.upcomingEvents = allEvents
          .filter((event) => {
            const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
            return eventDate >= now
          })
          .sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
            return dateA - dateB
          })

        console.log('📅 Loaded', this.upcomingEvents.length, 'upcoming events')
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        this.loadingEvents = false
      }
    },

    formatEventDay(date) {
      const eventDate = date?.toDate ? date.toDate() : new Date(date)
      return eventDate.getDate()
    },

    formatEventMonth(date) {
      const eventDate = date?.toDate ? date.toDate() : new Date(date)
      const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ]
      return months[eventDate.getMonth()]
    },

    applyFiltersAndSort() {
      // Apply genre filter
      let filtered = this.selectedGenreFilter
        ? filterSongsByGenre(this.recommendedSongs, this.selectedGenreFilter)
        : [...this.recommendedSongs]

      // Apply sort
      this.filteredSongs = sortSongs(filtered, this.selectedSort)

      // Reset displayed songs to first page
      this.currentSongsLoaded = this.songsPerPage
      this.displayedSongs = this.filteredSongs.slice(0, this.currentSongsLoaded)

      console.log('🔍 Filtered:', this.filteredSongs.length, 'songs')
    },

    loadMoreSongs() {
      this.loadingMore = true

      setTimeout(() => {
        this.currentSongsLoaded += this.songsPerPage
        this.displayedSongs = this.filteredSongs.slice(0, this.currentSongsLoaded)
        this.loadingMore = false
      }, 300)
    },

    async toggleLike(song) {
      const songKey = `${song.artistId}_${song.id}`
      if (this.likingInProgress[songKey]) return

      try {
        this.likingInProgress[songKey] = true
        const isLiked = this.isSongLiked(song)

        const result = await toggleSongLike(song.artistId, song.id, isLiked)

        if (result.success) {
          // Update local state
          if (isLiked) {
            this.likedSongsSet.delete(songKey)
          } else {
            this.likedSongsSet.add(songKey)
          }

          // Update song's like count in UI
          song.likes = result.newLikeCount
        }
      } catch (error) {
        console.error('Error toggling like:', error)
      } finally {
        this.likingInProgress[songKey] = false
      }
    },

    async followArtist(artistId) {
      if (this.followingInProgress[artistId]) return

      try {
        this.followingInProgress[artistId] = true
        const isFollowing = this.isFollowing(artistId)

        const result = await toggleFollowArtist(artistId, isFollowing)

        if (result.success) {
          // Update local state
          if (isFollowing) {
            this.followedArtistsSet.delete(artistId)
          } else {
            this.followedArtistsSet.add(artistId)
          }
        }
      } catch (error) {
        console.error('Error following artist:', error)
      } finally {
        this.followingInProgress[artistId] = false
      }
    },

    isSongLiked(song) {
      const songKey = `${song.artistId}_${song.id}`
      return this.likedSongsSet.has(songKey)
    },

    isFollowing(artistId) {
      return this.followedArtistsSet.has(artistId)
    },

    handlePlayerClick(song) {
      const songKey = `${song.artistId}_${song.id}`

      console.log('🎧 Player clicked:', song.title, 'by', song.artistName)

      // Only track once per song per session (to avoid duplicate tracking on every click)
      if (!this.playedSongsSet.has(songKey)) {
        this.playedSongsSet.add(songKey)
        console.log('🎵 New song play - tracking...', {
          songId: song.id,
          artistId: song.artistId,
          genres: song.genres,
        })
        trackSongPlay(song.id, song.artistId, song.genres)
      } else {
        console.log('⏭️ Already tracked this song in this session')
      }
    },

    navigateToArtist(artistId) {
      trackArtistClick(artistId) // Track the click
      this.$router.push(`/artist/${artistId}`)
    },
  },
}
</script>

<style scoped>
.fan-homepage {
  min-height: 100vh;
  background: #f8f9fa;
}

.content-wrapper {
  margin-top: 100px;
  padding-bottom: 40px;
}

.welcome-section h1 {
  color: #2c3e50;
}

.section-header h2,
.section-header h4 {
  color: #2c3e50;
  font-weight: 600;
}

.section-header p {
  font-size: 0.9rem;
}

/* Controls Bar */
.controls-bar {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.controls-bar select {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 0.375rem 2rem 0.375rem 0.75rem; /* Add more right padding for arrow */
  background-color: white;
  cursor: pointer;
}

.controls-bar select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  outline: none;
}

/* Songs Grid */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.song-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.song-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Artist Header in Song Card */
.song-artist-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.artist-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #667eea;
  flex-shrink: 0;
}

.artist-info {
  flex: 1;
  min-width: 0;
}

.artist-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #667eea;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name:hover {
  color: #764ba2;
}

.song-title {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Follow Button */
.btn-follow {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-follow:hover:not(:disabled) {
  background: #764ba2;
  transform: scale(1.05);
}

.btn-follow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.following-badge {
  font-size: 0.75rem;
  color: #28a745;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Player Container */
.player-container {
  margin-bottom: 0.75rem;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
}

.player-container iframe {
  border: none;
  width: 100%;
  display: block;
  /* Hide scrollbars */
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.player-container iframe::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
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

/* Genre Tags */
.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.genre-tag {
  font-size: 0.7rem;
  background: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-weight: 500;
}

/* Song Stats */
.song-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.stat-button {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 16px;
  transition: background 0.2s;
  font-size: 0.9rem;
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
  gap: 0.4rem;
  color: #666;
  font-size: 0.9rem;
}

.icon {
  font-size: 1.1rem;
}

.count {
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
}

/* Artists Row (Horizontal Scroll) */
.artists-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.artist-card-wrapper {
  min-width: 200px;
}

/* Events Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.event-content {
  display: flex;
  gap: 1.25rem;
  cursor: pointer;
}

.event-date {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.event-details {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-location {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-location i {
  margin-right: 0.25rem;
}

.event-artists {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.artist-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f0f4ff;
  color: #667eea;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.event-map-preview {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 80px;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }

  .songs-grid {
    grid-template-columns: 1fr;
  }

  .artists-row {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .artist-card-wrapper {
    scroll-snap-align: start;
    flex-shrink: 0;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .controls-bar {
    flex-direction: column;
    align-items: stretch !important;
  }

  .filter-group,
  .sort-group {
    width: 100%;
  }

  .filter-group select,
  .sort-group select {
    width: 100% !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .songs-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .artists-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1025px) {
  .songs-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .artists-row {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
