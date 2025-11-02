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

            <!-- Song Cards Carousel -->
            <div v-else class="carousel-container">
              <!-- Navigation Arrows -->
              <button
                v-if="currentSongPage > 0"
                @click="previousSongPage"
                class="carousel-arrow left"
                aria-label="Previous songs"
              >
                <i class="bi bi-chevron-left"></i>
              </button>

              <div class="songs-carousel">
                <div
                  class="songs-grid-carousel"
                  :style="{ transform: `translateX(-${currentSongPage * 100}%)` }"
                >
                  <div
                    v-for="(page, pageIndex) in paginatedSongs"
                    :key="`page-${pageIndex}`"
                    class="carousel-page"
                  >
                    <div
                      v-for="song in page"
                      :key="`${song.artistId}_${song.id}`"
                      class="song-card"
                      @click="openSongDetail(song)"
                    >
                      <!-- Artist Info Header -->
                      <div class="song-artist-header" @click.stop>
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
                      </div>

                      <!-- Embedded Player -->
                      <div class="player-container" @click.stop="handlePlayerClick(song)">
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
                        <span
                          v-for="genre in song.genres.slice(0, 3)"
                          :key="genre"
                          class="genre-tag"
                        >
                          {{ genre }}
                        </span>
                      </div>

                      <!-- Song Stats & Actions -->
                      <div class="song-stats">
                        <button
                          @click.stop="toggleLike(song)"
                          class="stat-button"
                          :class="{ liked: isSongLiked(song) }"
                          :disabled="likingInProgress[`${song.artistId}_${song.id}`]"
                          :title="
                            isSongLiked(song)
                              ? 'Unlike and remove from saved songs'
                              : 'Like this song and save it to My Music'
                          "
                        >
                          <span class="icon">❤️</span>
                          <span class="count">{{ song.likes || 0 }}</span>
                        </button>

                        <button
                          @click.stop="openSongDetail(song)"
                          class="stat-button"
                          title="View and post comments"
                        >
                          <span class="icon">💬</span>
                          <span class="count">{{ song.commentCount || 0 }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                v-if="currentSongPage < totalSongPages - 1"
                @click="nextSongPage"
                class="carousel-arrow right"
                aria-label="Next songs"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <!-- Carousel Indicators -->
            <div v-if="totalSongPages > 1" class="carousel-indicators">
              <button
                v-for="(page, index) in totalSongPages"
                :key="`indicator-${index}`"
                @click="goToSongPage(index)"
                class="indicator"
                :class="{ active: currentSongPage === index }"
                :aria-label="`Go to page ${index + 1}`"
              ></button>
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

            <!-- Artist Cards Carousel -->
            <div class="carousel-container">
              <button
                v-if="currentArtistPage > 0"
                @click="previousArtistPage"
                class="carousel-arrow left"
                aria-label="Previous artists"
              >
                <i class="bi bi-chevron-left"></i>
              </button>

              <div class="artists-carousel">
                <div
                  class="artists-grid-carousel"
                  :style="{ transform: `translateX(-${currentArtistPage * 100}%)` }"
                >
                  <div
                    v-for="(page, pageIndex) in paginatedArtists"
                    :key="`artist-page-${pageIndex}`"
                    class="carousel-page artists-page"
                  >
                    <div v-for="artist in page" :key="artist.id" class="artist-card-wrapper">
                      <ArtistCard :artist="artist" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                v-if="currentArtistPage < totalArtistPages - 1"
                @click="nextArtistPage"
                class="carousel-arrow right"
                aria-label="Next artists"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <!-- Carousel Indicators -->
            <div v-if="totalArtistPages > 1" class="carousel-indicators">
              <button
                v-for="(page, index) in totalArtistPages"
                :key="`artist-indicator-${index}`"
                @click="goToArtistPage(index)"
                class="indicator"
                :class="{ active: currentArtistPage === index }"
                :aria-label="`Go to artist page ${index + 1}`"
              ></button>
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
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import NavigationBar from '@/components/NavigationBar.vue'
import ArtistCard from '@/components/ArtistCard.vue'
import EventMap from '@/components/EventMap.vue'
import SongDetailModal from '@/components/SongDetailModal.vue'
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
    SongDetailModal,
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

      // Carousel state for songs
      currentSongPage: 0,
      songsPerPage: 6, // 2 rows × 3 cards

      // Artists data
      allArtists: [],
      recommendedArtists: [],

      // Carousel state for artists
      currentArtistPage: 0,
      artistsPerPage: 5, // 5 artists per page

      // Events data
      upcomingEvents: [],
      loadingEvents: false,

      // Filters & Sort
      selectedGenreFilter: '',
      selectedSort: 'recommended',
      allGenres: [
        'Indie',
        'Jazz',
        'Electronic',
        'Rock',
        'Pop',
        'Hip Hop',
        'R&B',
        'Folk',
        'Classical',
        'Metal',
        'Alternative',
        'Soul',
        'Blues',
        'Punk',
        'Reggae',
        'Country',
        'K-Pop',
        'EDM',
        'Funk',
        'Gospel',
      ],

      // User interactions
      likedSongsSet: new Set(),
      followedArtistsSet: new Set(),
      playedSongsSet: new Set(), // Track which songs have been played

      // Loading states
      isLoading: true,
      loadingMore: false,
      likingInProgress: {},
      followingInProgress: {},

      // Song Detail Modal (combines embed + comments)
      showSongDetailModal: false,
      selectedSongForDetail: null,

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

    // Paginate songs into pages of 6 (2 rows × 3 cards)
    paginatedSongs() {
      const pages = []
      for (let i = 0; i < this.displayedSongs.length; i += this.songsPerPage) {
        pages.push(this.displayedSongs.slice(i, i + this.songsPerPage))
      }
      return pages
    },

    totalSongPages() {
      return this.paginatedSongs.length
    },

    // Paginate artists into pages of 5
    paginatedArtists() {
      const pages = []
      for (let i = 0; i < this.recommendedArtists.length; i += this.artistsPerPage) {
        pages.push(this.recommendedArtists.slice(i, i + this.artistsPerPage))
      }
      return pages
    },

    totalArtistPages() {
      return this.paginatedArtists.length
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

      // Show ALL songs for carousel (not limited)
      this.displayedSongs = this.filteredSongs

      // Reset to first page
      this.currentSongPage = 0

      console.log('🔍 Filtered:', this.filteredSongs.length, 'songs')
    },

    async toggleLike(song) {
      console.log('🔥 toggleLike called!', song.title)
      const songKey = `${song.artistId}_${song.id}`
      if (this.likingInProgress[songKey]) {
        console.log('⚠️ Already in progress, skipping')
        return
      }

      try {
        this.likingInProgress[songKey] = true
        const isLiked = this.isSongLiked(song)
        console.log('❤️ Current like status:', isLiked)

        const result = await toggleSongLike(song.artistId, song.id, isLiked)
        console.log('✅ Toggle result:', result)

        if (result.success) {
          // Update local state - Create new Set to trigger reactivity
          const newSet = new Set(this.likedSongsSet)
          if (isLiked) {
            newSet.delete(songKey)
            console.log('💔 Unliked song')
          } else {
            newSet.add(songKey)
            console.log('❤️ Liked song')
          }
          this.likedSongsSet = newSet

          // Update song's like count in UI - Find and update in array
          const songIndex = this.recommendedSongs.findIndex(
            (s) => s.artistId === song.artistId && s.id === song.id,
          )
          if (songIndex !== -1) {
            this.recommendedSongs[songIndex].likes = result.newLikeCount
          }
          console.log('📊 New like count:', result.newLikeCount)
        } else {
          console.error('❌ Toggle failed:', result.error)
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
          // Update local state - Create new Set to trigger reactivity
          const newSet = new Set(this.followedArtistsSet)
          if (isFollowing) {
            newSet.delete(artistId)
          } else {
            newSet.add(artistId)
          }
          this.followedArtistsSet = newSet
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

    // Song Detail Modal (combines embed + comments)
    openSongDetail(song) {
      console.log('🎵 Opening song detail for:', song.title, {
        artistId: song.artistId,
        songId: song.id,
        platform: song.platform,
      })
      this.selectedSongForDetail = song
      this.showSongDetailModal = true
    },

    closeSongDetailModal() {
      this.showSongDetailModal = false
      this.selectedSongForDetail = null
    },

    handleDetailCommentPosted() {
      // Reload song data to get updated comment count
      const song = this.recommendedSongs.find(
        (s) =>
          s.artistId === this.selectedSongForDetail.artistId &&
          s.id === this.selectedSongForDetail.id,
      )
      if (song) {
        song.commentCount = (song.commentCount || 0) + 1
      }
    },

    // Song Carousel Navigation
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

    goToSongPage(pageIndex) {
      this.currentSongPage = pageIndex
    },

    // Artist Carousel Navigation
    nextArtistPage() {
      if (this.currentArtistPage < this.totalArtistPages - 1) {
        this.currentArtistPage++
      }
    },

    previousArtistPage() {
      if (this.currentArtistPage > 0) {
        this.currentArtistPage--
      }
    },

    goToArtistPage(pageIndex) {
      this.currentArtistPage = pageIndex
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
  background: var(--color-background-dark);
}

.content-wrapper {
  margin-top: 80px;
  padding-bottom: 40px;
}

.welcome-section h1 {
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.section-header h2,
.section-header h4 {
  color: var(--color-text-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.75rem;
}

.section-header p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-transform: none;
  letter-spacing: normal;
}

/* Controls Bar */
.controls-bar {
  background: transparent;
  padding: 1.5rem 0;
  border-radius: 0;
  box-shadow: none;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.controls-bar label {
  color: var(--color-text-primary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.controls-bar select {
  border-radius: 25px;
  border: none;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  background-color: white;
  color: var(--color-text-dark);
  cursor: pointer;
  font-weight: 500;
}

.controls-bar select:focus {
  border: none;
  box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.2);
  outline: none;
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
  background: var(--color-background-card);
  border: none;
  color: var(--color-text-dark);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.carousel-arrow:hover {
  background: var(--color-primary-red);
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: var(--shadow-lg);
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

.songs-carousel {
  overflow: hidden;
  width: 100%;
}

.songs-grid-carousel {
  display: flex;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-page {
  min-width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2rem;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

.indicator.active {
  background: var(--color-primary-red);
  width: 30px;
  border-radius: 5px;
}

/* Artists Carousel */
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
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 columns for artists */
  grid-template-rows: 1fr;
  gap: 1.5rem;
}

/* Songs Grid (fallback for non-carousel) */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.song-card {
  background: var(--color-background-card);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.song-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-red);
}

/* Artist Header in Song Card */
.song-artist-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.artist-photo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary-red);
  flex-shrink: 0;
}

.artist-info {
  flex: 1;
  min-width: 0;
}

.artist-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-dark);
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name:hover {
  color: var(--color-primary-red);
}

.song-title {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

/* Follow Button */
.btn-follow {
  background: var(--color-primary-red);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-follow:hover:not(:disabled) {
  background: var(--color-primary-red-hover);
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
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.genre-tag {
  font-size: 0.65rem;
  background: var(--color-primary-red);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  transition: all 0.2s ease;
  font-size: 0.9rem;
  position: relative;
}

.stat-button:hover:not(:disabled) {
  background: #f8f8f8;
  transform: scale(1.05);
}

.stat-button:active:not(:disabled) {
  transform: scale(0.95);
  background: #f0f0f0;
}

.stat-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stat-button.liked {
  color: #e74c3c;
  background: #ffebee;
}

.stat-button.liked:hover:not(:disabled) {
  background: #ffcdd2;
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

  /* Carousel adjustments for mobile */
  .carousel-container {
    padding: 0 2.5rem;
  }

  .carousel-arrow {
    width: 40px;
    height: 40px;
  }

  .carousel-arrow i {
    font-size: 1.2rem;
  }

  .carousel-page {
    grid-template-columns: 1fr; /* 1 column on mobile */
    grid-template-rows: auto;
  }

  .carousel-page.artists-page {
    grid-template-columns: 1fr; /* 1 artist per page on mobile */
  }

  .songs-grid {
    grid-template-columns: 1fr;
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
  .carousel-page {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for tablets */
  }

  .carousel-page.artists-page {
    grid-template-columns: repeat(3, 1fr); /* 3 artists for tablets */
  }

  .songs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .carousel-page {
    grid-template-columns: repeat(3, 1fr); /* 3 columns for desktop */
    grid-template-rows: repeat(2, 1fr); /* 2 rows for desktop */
  }

  .carousel-page.artists-page {
    grid-template-columns: repeat(5, 1fr); /* 5 artists for desktop */
  }

  .songs-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
