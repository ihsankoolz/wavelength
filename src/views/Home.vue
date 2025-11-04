<!-- Home.vue -->
<template>
  <div class="fan-homepage">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Wave Background -->
    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="#bb1814" stroke-width="2" opacity="0.6">
          <animate attributeName="d" values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150" dur="3s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180" dur="4s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate attributeName="d" values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120" dur="5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate attributeName="d" values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate attributeName="d" values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60" dur="4.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="0.8" opacity="0.3">
          <animate attributeName="d" values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240" dur="6s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate attributeName="d" values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <!-- Welcome Header -->
        <div class="welcome-section mb-4">
          <h1 class="display-5 fw-bold mb-2">Curated for your taste</h1>
          <p class="text-muted">TRENDING SONGS FROM LOCAL ARTISTS</p>
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
            <!-- Filter and Sort Controls -->
            <div class="controls-bar mb-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
              <!-- Filter Header Text -->
              <div class="filter-header">
                <h2 class="h3 mb-1">FILTER SONGS</h2>
                <p class="text-muted mb-0 small">{{ getRecommendationSubtitle }}</p>
              </div>

              <!-- Filter Controls -->
              <div class="filter-controls d-flex flex-wrap gap-3 align-items-center">
                <!-- Genre Filter -->
                <div class="filter-group">
                  <label class="small text-muted me-2">Filter by Genre:</label>
                  <select v-model="selectedGenreFilter" @change="applyFiltersAndSort" class="form-select form-select-sm"
                    style="width: auto; display: inline-block">
                    <option value="">All Genres</option>
                    <option v-for="genre in allGenres" :key="genre" :value="genre">
                      {{ genre }}
                    </option>
                  </select>
                </div>

                <!-- Sort Options -->
                <div class="sort-group">
                  <label class="small text-muted me-2">Sort by:</label>
                  <select v-model="selectedSort" @change="applyFiltersAndSort" class="form-select form-select-sm"
                    style="width: auto; display: inline-block">
                    <option value="recommended">Recommended</option>
                    <option value="popular">Most Popular</option>
                    <option value="recent">Recently Added</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>
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
              <button v-if="currentSongPage > 0" @click="previousSongPage" class="carousel-arrow left"
                aria-label="Previous songs">
                <i class="bi bi-chevron-left"></i>
              </button>

              <div class="songs-carousel">
                <div class="songs-grid-carousel" :style="{ transform: `translateX(-${currentSongPage * 100}%)` }">
                  <div v-for="(page, pageIndex) in paginatedSongs" :key="`page-${pageIndex}`" class="carousel-page">
                    <div v-for="song in page" :key="`${song.artistId}_${song.id}`" class="song-card"
                      @click="openSongDetail(song)">
                      <!-- Embedded Player at Top -->
                      <div class="player-container" @click.stop="handlePlayerClick(song)">
                        <!-- Spotify Embed -->
                        <iframe v-if="song.platform === 'spotify'"
                          :src="`https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator`"
                          width="100%" height="232" frameborder="0" allowtransparency="true" allow="encrypted-media"
                          loading="lazy" style="min-height: 232px"></iframe>

                        <!-- SoundCloud Embed -->
                        <iframe v-else-if="song.platform === 'soundcloud'" width="100%" height="232" scrolling="no"
                          frameborder="no" allow="autoplay"
                          :src="`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                            song.url,
                          )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`"
                          loading="lazy"></iframe>

                        <!-- YouTube Embed -->
                        <iframe v-else-if="song.platform === 'youtube'" width="100%" height="232"
                          :src="`https://www.youtube.com/embed/${song.youtubeId}`" frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen loading="lazy"></iframe>

                        <!-- Fallback Link -->
                        <a v-else :href="song.url" target="_blank" rel="noopener noreferrer" class="song-link">
                          🎵 Open {{ song.platform }} →
                        </a>
                      </div>

                      <!-- Bottom Section: Artist Info, Genre Tags, and Stats -->
                      <div class="song-footer">
                        <!-- Left Side: Artist Info & Genre Tags -->
                        <div class="song-footer-left">
                          <div class="song-artist-info" @click.stop>
                            <img :src="song.artistPhoto || '/default-avatar.png'" :alt="song.artistName"
                              class="artist-photo-bottom" @click="navigateToArtist(song.artistId)"
                              style="cursor: pointer" />
                            <div class="song-details">
                              <div class="song-title-bottom">{{ song.title }}</div>
                              <router-link :to="`/artist/${song.artistId}`" class="artist-name-bottom">
                                {{ song.artistName }}
                              </router-link>
                            </div>
                          </div>

                          <!-- Genre Tags Below Artist Info -->
                          <div class="genre-tags" v-if="song.genres && song.genres.length > 0">
                            <span v-for="genre in song.genres.slice(0, 3)" :key="genre" class="genre-tag">
                              {{ genre }}
                            </span>
                          </div>
                        </div>

                        <!-- Right Side: Stats & Actions -->
                        <div class="song-stats">
                          <button @click.stop="toggleLike(song)" class="stat-button"
                            :class="{ liked: isSongLiked(song) }"
                            :disabled="likingInProgress[`${song.artistId}_${song.id}`]" :title="isSongLiked(song)
                                ? 'Unlike and remove from saved songs'
                                : 'Like this song and save it to My Music'
                              ">
                            <span class="icon">❤️</span>
                            <span class="count">{{ song.likes || 0 }}</span>
                          </button>

                          <button @click.stop="openSongDetail(song)" class="stat-button" title="View and post comments">
                            <span class="icon">💬</span>
                            <span class="count">{{ song.commentCount || 0 }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button v-if="currentSongPage < totalSongPages - 1" @click="nextSongPage" class="carousel-arrow right"
                aria-label="Next songs">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </section>

          <!-- Discover Artists Section (One Row) -->
          <section id="discover-artists" class="discover-artists-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 class="h4 mb-1">Artists to watch out for</h2>
                <p class="text-muted mb-0 small">EXPLORE TALENTED LOCAL ARTISTS</p>
              </div>
            </div>

            <!-- Artist Cards Carousel -->
            <div class="carousel-container">
              <button v-if="currentArtistPage > 0" @click="previousArtistPage" class="carousel-arrow left"
                aria-label="Previous artists">
                <i class="bi bi-chevron-left"></i>
              </button>

              <div class="artists-carousel">
                <div class="artists-grid-carousel" :style="{ transform: `translateX(-${currentArtistPage * 100}%)` }">
                  <div v-for="(page, pageIndex) in paginatedArtists" :key="`artist-page-${pageIndex}`"
                    class="carousel-page artists-page">
                    <div v-for="artist in page" :key="artist.id" class="artist-card-wrapper">
                      <ArtistCard :artist="artist" />
                    </div>
                  </div>
                </div>
              </div>

              <button v-if="currentArtistPage < totalArtistPages - 1" @click="nextArtistPage"
                class="carousel-arrow right" aria-label="Next artists">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </section>

          <!-- Upcoming Events Section -->
          <section class="upcoming-events-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 class="h4 mb-1">UPCOMING EVENTS</h2>
                <p class="text-muted mb-0 small">DON'T MISS OUT ON LIVE PERFORMANCES</p>
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

            <!-- Events Carousel -->
            <div v-else-if="upcomingEvents.length > 0" class="carousel-container">
              <!-- Navigation Arrows -->
              <button v-if="currentEventPage > 0" @click="previousEventPage" class="carousel-arrow left"
                aria-label="Previous events">
                <i class="bi bi-chevron-left"></i>
              </button>

              <div class="events-carousel">
                <div class="events-grid-carousel" :style="{ transform: `translateX(-${currentEventPage * 100}%)` }">
                  <div v-for="(page, pageIndex) in paginatedEvents" :key="`event-page-${pageIndex}`"
                    class="carousel-page events-page">
                    <div v-for="event in page" :key="event.id" class="event-card">
                      <!-- Red Header with Event Title -->
                      <div class="event-header">
                        {{ event.title }}
                      </div>

                      <!-- Event Body -->
                      <div class="event-body">
                        <!-- Artist Info & Details -->
                        <div class="event-info" @click="$router.push(`/events/${event.id}`)">
                          <img :src="event.artistImage || '/default-avatar.png'" :alt="event.artistName"
                            class="event-artist-photo" />
                          <div class="event-info-text">
                            <h5 class="event-artist-name">{{ event.artistName || 'Artist' }}</h5>
                            <p class="event-venue">{{ event.venue || event.location }}</p>
                          </div>

                          <!-- Date Box on Right -->
                          <div class="event-date-box">
                            <div class="date-day">{{ formatEventDay(event.date) }}</div>
                            <div class="date-month">{{ formatEventMonth(event.date) }}</div>
                          </div>
                        </div>

                        <!-- Genres as plain text -->
                        <p class="event-genres-text" v-if="event.genres && event.genres.length > 0">
                          {{ event.genres.join(', ') }}
                        </p>

                        <!-- Map Preview -->
                        <div class="event-map-preview" @click.stop>
                          <EventMap :location="event.location" :title="event.venue || event.title" size="small" />
                        </div>

                        <!-- Interested Count -->
                        <p class="interested-count">
                          {{ event.interestedCount || 0 }}
                          {{ (event.interestedCount || 0) === 1 ? 'Other' : 'Others' }} Interested
                        </p>

                        <!-- I'm Interested Button -->
                        <button class="btn-interested" :class="{ active: isEventInterested(event.id) }"
                          @click.stop="toggleEventInterest(event)" :disabled="togglingInterest[event.id]">
                          <i v-if="isEventInterested(event.id)" class="bi bi-check-circle-fill me-2"></i>
                          {{ isEventInterested(event.id) ? 'INTERESTED' : "I'M INTERESTED" }}
                        </button>
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
    <SongDetailModal :show="showSongDetailModal" :song="selectedSongForDetail" @close="closeSongDetailModal"
      @comment-posted="handleDetailCommentPosted" />
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

      // Carousel state for events
      currentEventPage: 0,
      eventsPerPage: 3, // 3 events per page

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
      interestedEventsSet: new Set(), // Track events user is interested in

      // Loading states
      isLoading: true,
      loadingMore: false,
      likingInProgress: {},
      followingInProgress: {},
      togglingInterest: {}, // Track interest toggle in progress

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

    // Paginate songs with specific overlap logic - songs 3&6 become 1&4 in next page
    paginatedSongs() {
      const pages = []
      let songIndex = 0

      while (songIndex < this.displayedSongs.length) {
        if (pages.length === 0) {
          // First page: normal sequential order (1,2,3,4,5,6)
          const page = []
          for (let i = 0; i < this.songsPerPage && songIndex < this.displayedSongs.length; i++) {
            page.push(this.displayedSongs[songIndex])
            songIndex++
          }
          pages.push(page)
        } else {
          // Subsequent pages: songs 3&6 from previous page become 1&4, fill with new songs
          const prevPage = pages[pages.length - 1]
          const page = []

          // Position 1: Previous song 3 (index 2)
          if (prevPage[2]) {
            page[0] = prevPage[2]
          }

          // Position 2: New song
          if (songIndex < this.displayedSongs.length) {
            page[1] = this.displayedSongs[songIndex]
            songIndex++
          }

          // Position 3: New song
          if (songIndex < this.displayedSongs.length) {
            page[2] = this.displayedSongs[songIndex]
            songIndex++
          }

          // Position 4: Previous song 6 (index 5)
          if (prevPage[5]) {
            page[3] = prevPage[5]
          }

          // Position 5: New song
          if (songIndex < this.displayedSongs.length) {
            page[4] = this.displayedSongs[songIndex]
            songIndex++
          }

          // Position 6: New song
          if (songIndex < this.displayedSongs.length) {
            page[5] = this.displayedSongs[songIndex]
            songIndex++
          }

          // Only add page if it has content
          if (page.some((song) => song)) {
            pages.push(page.filter((song) => song))
          }

          // Break if no more new songs
          if (songIndex >= this.displayedSongs.length && !page.some((song) => song)) {
            break
          }
        }
      }

      return pages
    },

    totalSongPages() {
      return this.paginatedSongs.length
    },

    // Paginate artists with overlap logic
    paginatedArtists() {
      const pages = []
      let startIndex = 0

      while (startIndex < this.recommendedArtists.length) {
        const endIndex = Math.min(startIndex + this.artistsPerPage, this.recommendedArtists.length)
        pages.push(this.recommendedArtists.slice(startIndex, endIndex))

        // For the next page, start from the overlap point (keep last 1 artist)
        if (endIndex < this.recommendedArtists.length) {
          startIndex = endIndex - 1 // Overlap of 1 artist
        } else {
          break
        }
      }
      return pages
    },

    totalArtistPages() {
      return this.paginatedArtists.length
    },

    // Paginate events
    paginatedEvents() {
      const pages = []
      let startIndex = 0

      while (startIndex < this.upcomingEvents.length) {
        const endIndex = Math.min(startIndex + this.eventsPerPage, this.upcomingEvents.length)
        pages.push(this.upcomingEvents.slice(startIndex, endIndex))
        startIndex = endIndex
      }
      return pages
    },

    totalEventPages() {
      return this.paginatedEvents.length
    },
  },

  watch: {
    // Watch for route hash changes
    '$route.hash'(newHash) {
      if (newHash === '#discover-artists') {
        this.$nextTick(() => {
          this.scrollToDiscoverArtists()
        })
      }
    },
  },

  async mounted() {
    await this.loadUserData()
    await initializeUserInteractions() // Initialize interaction tracking
    await this.loadRecommendations()
    await this.loadArtists()
    await this.loadEvents()
    this.isLoading = false

    // Scroll to discover-artists section if hash is present
    this.$nextTick(() => {
      if (this.$route.hash === '#discover-artists') {
        this.scrollToDiscoverArtists()
      }
    })
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

          // Load user's interested events
          const interestedEvents = userData.interestedEvents || []
          this.interestedEventsSet = new Set(interestedEvents)

          console.log('👤 User genres:', this.userGenres)
          console.log('❤️ Liked songs:', this.likedSongsSet.size)
          console.log('👥 Following:', this.followedArtistsSet.size)
          console.log('📅 Interested in:', this.interestedEventsSet.size, 'events')
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

        // Filter out current user if they are an artist
        this.allArtists = this.allArtists.filter((artist) => artist.id !== this.userId)

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
        let upcomingEvents = allEvents
          .filter((event) => {
            const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date)
            return eventDate >= now
          })
          .sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
            return dateA - dateB
          })

        // Fetch artist data for each event
        for (const event of upcomingEvents) {
          if (event.artistId) {
            try {
              const artistDoc = await getDoc(doc(db, 'artists', event.artistId))
              if (artistDoc.exists()) {
                const artistData = artistDoc.data()
                event.artistImage = artistData.profileImage
                event.artistName = event.artistName || artistData.artistName
              }
            } catch (error) {
              console.error('Error fetching artist data for event:', event.id, error)
            }
          }
        }

        this.upcomingEvents = upcomingEvents
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

    formatEventDate(date) {
      const eventDate = date?.toDate ? date.toDate() : new Date(date)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      return `${days[eventDate.getDay()]}, ${eventDate.getDate()} ${months[eventDate.getMonth()]} ${eventDate.getFullYear()}`
    },

    isEventInterested(eventId) {
      return this.interestedEventsSet.has(eventId)
    },

    async toggleEventInterest(event) {
      if (this.togglingInterest[event.id]) return

      const user = auth.currentUser
      if (!user) {
        this.$router.push('/login')
        return
      }

      this.togglingInterest[event.id] = true

      try {
        const { markEventInterested, unmarkEventInterested } = await import(
          '@/utils/userInteractions'
        )

        const isInterested = this.isEventInterested(event.id)

        if (isInterested) {
          // Unmark interest
          const result = await unmarkEventInterested(user.uid, event.id)
          if (result.success) {
            this.interestedEventsSet.delete(event.id)
            // Force reactivity update
            this.interestedEventsSet = new Set(this.interestedEventsSet)
            if (event.interestedCount > 0) {
              event.interestedCount--
            }
          } else {
            throw new Error(result.error || 'Failed to unmark interest')
          }
        } else {
          // Mark interested
          const result = await markEventInterested(user.uid, event.id)
          if (result.success) {
            this.interestedEventsSet.add(event.id)
            // Force reactivity update
            this.interestedEventsSet = new Set(this.interestedEventsSet)
            event.interestedCount = (event.interestedCount || 0) + 1
          } else {
            throw new Error(result.error || 'Failed to mark interest')
          }
        }
      } catch (error) {
        console.error('Error toggling event interest:', error)
        alert(error.message || 'Failed to update interest. Please try again.')
      } finally {
        this.togglingInterest[event.id] = false
      }
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

    // Event Carousel Navigation
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

    goToEventPage(pageIndex) {
      this.currentEventPage = pageIndex
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

    scrollToDiscoverArtists() {
      this.$nextTick(() => {
        const element = document.getElementById('discover-artists')
        if (element) {
          // Account for fixed navigation bar offset
          const offset = 80 // Adjust this value based on your nav bar height
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      })
    },
  },
}
</script>

<style scoped>
.fan-homepage {
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

.fan-homepage::before {
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

.section-header h2,
.section-header h4 {
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.5rem;
}

.section-header p {
  color: #b0b1ba;
  font-size: 0.9rem;
  text-transform: none;
  letter-spacing: normal;
}

.text-muted {
  color: #b0b1ba !important;
}

/* Controls Bar */
.controls-bar {
  background: transparent;
  padding: 1.5rem 0;
  border-radius: 0;
  box-shadow: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

/* Filter Header */
.filter-header {
  flex-shrink: 0;
  margin-right: 2rem;
}

.filter-header h2 {
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
}

.filter-header p {
  margin: 0;
  font-size: 0.9rem;
}

/* Filter Controls Container */
.filter-controls {
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

.controls-bar label {
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.controls-bar select {
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23bb1814' viewBox='0 0 16 16'%3e%3cpath d='m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}

.controls-bar select:hover {
  border-color: #bb1814;
  box-shadow: 0 4px 12px rgba(187, 24, 20, 0.3);
  transform: translateY(-2px);
}

.controls-bar select:focus {
  border-color: #bb1814;
  box-shadow: 0 0 0 3px rgba(187, 24, 20, 0.3);
  outline: none;
  transform: translateY(-2px);
}

.controls-bar select option {
  background: #2a2a2a;
  color: #fff;
  padding: 0.5rem;
  border: none;
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

.songs-carousel {
  overflow-x: hidden;
  overflow-y: visible;
  width: 100%;
  padding-top: 12px;
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
  padding-top: 6px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 0;
  list-style: none;
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
  margin: 0;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.indicator.active {
  background: #bb1814;
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
  grid-template-columns: repeat(5, 1fr);
  /* 5 columns for artists */
  grid-template-rows: 1fr;
  gap: 1.5rem;
}

.carousel-page.events-page {
  min-width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 columns for events */
  grid-template-rows: 1fr;
  gap: 1.5rem;
}

/* Events Carousel */
.events-carousel {
  overflow: hidden;
  width: 100%;
}

.events-grid-carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

/* Songs Grid (fallback for non-carousel) */
.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
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
  z-index: 10;
  position: relative;
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
}

.song-link:hover {
  opacity: 0.9;
}

/* Song Footer Container */
.song-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem;
  gap: 1rem;
}

.song-footer-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

/* Artist Info at Bottom */
.song-artist-info {
  display: flex;
  align-items: center;
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
  flex: 1;
  min-width: 0;
}

.song-title-bottom {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
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
}

.artist-name-bottom:hover {
  color: #bb1814;
}

/* Genre Tags */
.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag {
  font-size: 0.7rem;
  background: #bb1814;
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Song Stats - Bottom Right */
.song-stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
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
  color: #666;
  font-size: 0.9rem;
}

.icon {
  font-size: 1rem;
}

.count {
  font-weight: 600;
  color: #fff;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(187, 24, 20, 0.3);
  border-color: #bb1814;
}

/* Red Header */
.event-header {
  background: #bb1814;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 1rem 1.25rem;
  text-align: center;
  letter-spacing: 0.5px;
}

/* Event Body */
.event-body {
  padding: 1.25rem;
}

/* Event Info Section */
.event-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.event-artist-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #bb1814;
  flex-shrink: 0;
}

.event-info-text {
  flex: 1;
  min-width: 0;
}

.event-artist-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.3rem;
}

.event-venue {
  font-size: 0.85rem;
  color: #b0b1ba;
  margin: 0;
}

/* Date Box on Right */
.event-date-box {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #bb1814 0%, #960f0c 100%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(187, 24, 20, 0.3);
}

.event-date-box .date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.event-date-box .date-month {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
  text-transform: uppercase;
}

/* Event Genres as Plain Text */
.event-genres-text {
  font-size: 0.9rem;
  font-weight: 400;
  color: #b0b1ba;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}

/* Map Preview */
.event-map-preview {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

/* Interested Count */
.interested-count {
  font-size: 0.9rem;
  color: #b0b1ba;
  margin-bottom: 1rem;
  text-align: center;
}

/* I'm Interested Button */
.btn-interested {
  width: 100%;
  background: #bb1814;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.85rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-interested:hover:not(:disabled) {
  background: #960f0c;
  transform: scale(1.02);
}

.btn-interested:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-interested.active {
  background: #4a4a4a;
  color: #fff;
}

.btn-interested.active:hover:not(:disabled) {
  background: #3a3a3a;
}

/* Button Overrides */
.btn-outline-primary {
  border-color: #bb1814;
  color: #bb1814;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-outline-primary:hover {
  background-color: #bb1814;
  border-color: #bb1814;
  color: white;
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
    grid-template-columns: 1fr;
    /* 1 column on mobile */
    grid-template-rows: auto;
  }

  .carousel-page.artists-page {
    grid-template-columns: 1fr;
    /* 1 artist per page on mobile */
  }

  .carousel-page.events-page {
    grid-template-columns: 1fr;
    /* 1 event per page on mobile */
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
    gap: 1.5rem !important;
  }

  .filter-header {
    margin-right: 0;
    margin-bottom: 1rem;
    text-align: center;
  }

  .filter-controls {
    justify-content: center;
    gap: 1rem !important;
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
    grid-template-columns: repeat(2, 1fr);
    /* 2 columns for tablets */
  }

  .carousel-page.artists-page {
    grid-template-columns: repeat(3, 1fr);
    /* 3 artists for tablets */
  }

  .carousel-page.events-page {
    grid-template-columns: repeat(2, 1fr);
    /* 2 events for tablets */
  }

  .songs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .carousel-page {
    grid-template-columns: repeat(3, 1fr);
    /* 3 columns for desktop */
    grid-template-rows: repeat(2, 1fr);
    /* 2 rows for desktop */
  }

  .carousel-page.artists-page {
    grid-template-columns: repeat(5, 1fr);
    /* 5 artists for desktop */
  }

  .carousel-page.events-page {
    grid-template-columns: repeat(3, 1fr);
    /* 3 events for desktop */
  }

  .songs-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
