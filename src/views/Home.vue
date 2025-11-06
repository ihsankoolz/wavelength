<!-- Home.vue -->
<template>
  <div class="fan-homepage">
    <!-- Navigation Bar -->
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
          <div class="spinner-border text-red" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading recommendations...</p>
        </div>

        <!-- Content (only show when not loading) -->
        <div v-else>
          <!-- Recommended Songs Section -->
          <section class="recommended-songs-section mb-5">
            <!-- Filter and Sort Controls -->
            <div
              class="controls-bar mb-4 d-flex flex-wrap gap-3 align-items-center justify-content-between"
            >
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
                  <select
                    v-model="selectedGenreFilter"
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
                class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 start-0 translate-middle-y shadow z-3 ms-2 ms-md-0"
                aria-label="Previous songs"
              >
                <i class="bi bi-chevron-left fs-5"></i>
              </button>

              <div class="songs-carousel">
                <div
                  class="songs-grid-carousel"
                  :key="songCarouselKey"
                  :style="{ transform: `translateX(-${currentSongPage * 100}%)` }"
                >
                  <div
                    v-for="(page, pageIndex) in paginatedSongs"
                    :key="`page-${pageIndex}-${songCarouselKey}`"
                    class="carousel-page"
                  >
                    <div class="row g-4">
                      <div
                        v-for="song in page"
                        :key="`${song.artistId}_${song.id}`"
                        class="col-12 col-md-6 col-xl-4"
                      >
                        <div class="song-card" @click="openSongDetail(song)">
                          <!-- Player Container - Fixed height -->
                          <div class="player-container" @click.stop>
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

                          <!-- Footer Section - Fixed height -->
                          <div class="song-footer">
                            <!-- Artist Info & Genre Tags Container - Fixed height -->
                            <div class="song-footer-left">
                              <!-- Artist Info - Fixed height -->
                              <div class="song-artist-info" @click.stop>
                                <img
                                  :src="song.artistPhoto || '/default-avatar.png'"
                                  :alt="song.artistName"
                                  class="artist-photo-bottom"
                                  @click="navigateToArtist(song.artistId)"
                                  style="cursor: pointer"
                                />
                                <div class="song-details">
                                  <div class="song-title-bottom">{{ song.title }}</div>
                                  <router-link
                                    :to="`/artist/${song.artistId}`"
                                    class="artist-name-bottom"
                                    @click.stop
                                  >
                                    {{ song.artistName }}
                                  </router-link>
                                </div>
                              </div>

                              <!-- Genre Tags Container - Fixed height -->
                              <div class="genre-tags" v-if="song.genres && song.genres.length > 0">
                                <span v-for="genre in song.genres" :key="genre" class="genre-tag">
                                  {{ genre }}
                                </span>
                              </div>
                            </div>

                            <!-- Stats Section -->
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
                                <span class="count">{{ song.comments?.length || 0 }}</span>
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
              <button
                v-if="currentArtistPage > 0"
                @click="previousArtistPage"
                class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 start-0 translate-middle-y shadow z-3 ms-2 ms-md-0"
                aria-label="Previous artists"
              >
                <i class="bi bi-chevron-left fs-5"></i>
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
                    <div class="row g-3 w-100">
                      <div v-for="artist in page" :key="artist.id" class="col-6 col-md-3 col-lg-2">
                        <ArtistCard :artist="artist" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                v-if="currentArtistPage < totalArtistPages - 1"
                @click="nextArtistPage"
                class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 end-0 translate-middle-y shadow z-3 me-2 me-md-0"
                aria-label="Next artists"
              >
                <i class="bi bi-chevron-right fs-5"></i>
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
                VIEW ALL
              </router-link>
            </div>

            <!-- Events Loading -->
            <div v-if="loadingEvents" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-red" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <!-- Events Carousel -->
            <div v-else-if="upcomingEvents.length > 0" class="carousel-container">
              <!-- Navigation Arrows -->
              <button
                v-if="currentEventPage > 0"
                @click="previousEventPage"
                class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 start-0 translate-middle-y shadow z-3 ms-2 ms-md-0"
                aria-label="Previous events"
              >
                <i class="bi bi-chevron-left fs-5"></i>
              </button>

              <div class="events-carousel">
                <div
                  class="events-grid-carousel"
                  :style="{ transform: `translateX(-${currentEventPage * 100}%)` }"
                >
                  <div
                    v-for="(page, pageIndex) in paginatedEvents"
                    :key="`event-page-${pageIndex}`"
                    class="carousel-page events-page"
                  >
                    <!-- Add row class and set width to 100% -->
                    <div class="row w-100">
                      <!-- Update the column classes -->
                      <div
                        v-for="event in page"
                        :key="event.id"
                        class="col-sm-6 col-md-6 col-lg-4 px-3"
                      >
                        <div class="h-100">
                          <!-- Add wrapper div -->
                          <EventCard :event="event" @interest-changed="handleEventInterestChange" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                v-if="currentEventPage < totalEventPages - 1"
                @click="nextEventPage"
                class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 end-0 translate-middle-y shadow z-3 me-2 me-md-0"
                aria-label="Next events"
              >
                <i class="bi bi-chevron-right fs-5"></i>
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
import EventCard from '@/components/EventCard.vue'
import EventMap from '@/components/EventMap.vue'
import SongDetailModal from '@/components/SongDetailModal.vue'
import {
  getRecommendedSongs,
  getAllSongs,
  filterSongsByGenre,
  sortSongs,
  getUserProfile,
  getRecommendedArtists,
} from '@/utils/recommendationEngine'
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
    EventCard,
    EventMap,
    SongDetailModal,
  },
  data() {
    return {
      userName: '',
      userId: '',
      userGenres: [],
      userProfile: null, // Store user profile for recommendation scoring

      // Songs data
      recommendedSongs: [],

      // Carousel state for songs
      currentSongPage: 0,
      songsPerPage: 6, // Default for large screens

      // Artists data
      allArtists: [],
      recommendedArtists: [],

      // Carousel state for artists
      currentArtistPage: 0,
      artistsPerPage: 6, // 6 artists per page

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
        return 'Trending songs from local artists'.toUpperCase()
      }
      if (this.followedArtistsSet.size > 0) {
        return `Personalized for you based on your taste`.toUpperCase()
      }
      return `Based on your interests: ${this.userGenres.slice(0, 3).join(', ')}`.toUpperCase()
    },

    // Computed property for filtered and sorted songs
    displayedSongs() {
      // Determine which song list to use based on sort option
      let sourceSongs
      if (this.selectedSort === 'recommended') {
        // Use personalized recommendations
        sourceSongs = [...this.recommendedSongs]
      } else {
        // Use all songs for other sort options (popular, recent, trending)
        sourceSongs = [...this.allSongs]
      }

      // Apply genre filter first
      let filtered = this.selectedGenreFilter
        ? filterSongsByGenre(sourceSongs, this.selectedGenreFilter)
        : sourceSongs

      // Apply sort - pass userProfile for recommendation scoring
      const sorted = sortSongs(filtered, this.selectedSort, this.userProfile)

      // Log for debugging with first 3 songs
      console.log('Filters applied:', {
        genre: this.selectedGenreFilter || 'All',
        sort: this.selectedSort,
        sourceCount: sourceSongs.length,
        resultCount: sorted.length,
        first3Songs: sorted.slice(0, 3).map((s) => ({
          title: s.title,
          likes: s.likes || 0,
          addedAt: s.addedAt?.toDate?.() || s.addedAt,
        })),
      })

      return sorted
    },

    // Paginate songs with specific overlap logic - songs 3&6 become 1&4 in next page
    paginatedSongs() {
      const pages = []
      let songIndex = 0

      // Simple pagination: each page shows 6 completely new songs
      while (songIndex < this.displayedSongs.length) {
        const page = []
        for (let i = 0; i < this.songsPerPage && songIndex < this.displayedSongs.length; i++) {
          page.push(this.displayedSongs[songIndex])
          songIndex++
        }
        if (page.length > 0) {
          pages.push(page)
        }
      }

      console.log('Paginated into', pages.length, 'pages')

      return pages
    },

    totalSongPages() {
      return this.paginatedSongs.length
    },

    // Unique key for song carousel that changes when filters change
    songCarouselKey() {
      return `songs-${this.selectedGenreFilter}-${this.selectedSort}`
    },

    // Paginate artists with overlap logic
    paginatedArtists() {
      const pages = []
      let startIndex = 0

      while (startIndex < this.recommendedArtists.length) {
        const endIndex = Math.min(startIndex + this.artistsPerPage, this.recommendedArtists.length)
        pages.push(this.recommendedArtists.slice(startIndex, endIndex))

        // Move to next completely new set (no overlap)
        startIndex = endIndex
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

    // Watch for filter/sort changes to reset pagination
    selectedGenreFilter() {
      this.currentSongPage = 0
      console.log('Genre filter changed to:', this.selectedGenreFilter || 'All')
    },

    selectedSort(newSort) {
      this.currentSongPage = 0
      console.log('Sort changed to:', newSort)
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
    this.updateArtistsPerPage()
    window.addEventListener('resize', this.updateArtistsPerPage)

    this.updateEventsPerPage()
    window.addEventListener('resize', this.updateEventsPerPage)

    this.updateSongsPerPage()
    window.addEventListener('resize', this.updateSongsPerPage)
  },

  beforeUnmount() {
    // Add cleanup for resize listener
    window.removeEventListener('resize', this.updateArtistsPerPage)
    window.removeEventListener('resize', this.updateEventsPerPage)
    window.removeEventListener('resize', this.updateSongsPerPage)
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

          // Load user profile for recommendation scoring
          this.userProfile = await getUserProfile(user.uid)
          console.log('User profile loaded for recommendations:', {
            isNewUser: this.userProfile.isNewUser,
            hasPreferences: this.userProfile.hasPreferences,
            genres: this.userProfile.preferredGenres.length,
            followedArtists: this.userProfile.followedArtists.length,
          })

          console.log('User genres:', this.userGenres)
          console.log('Liked songs:', this.likedSongsSet.size)
          console.log('Following:', this.followedArtistsSet.size)
          console.log('Interested in:', this.interestedEventsSet.size, 'events')
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

        // Also load ALL songs for non-recommended sorting
        this.allSongs = await getAllSongs()

        console.log('Loaded', this.recommendedSongs.length, 'recommended songs')
        console.log('Loaded', this.allSongs.length, 'total songs')
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

        // Get recommended artists using the recommendation engine
        this.recommendedArtists = getRecommendedArtists(
          this.allArtists,
          this.userGenres,
          this.userId,
          { limit: 20 },
        )

        console.log('Loaded', this.recommendedArtists.length, 'recommended artists')
      } catch (error) {
        console.error('Error loading artists:', error)
      }
    },

    updateArtistsPerPage() {
      const width = window.innerWidth
      if (width >= 992) {
        this.artistsPerPage = 6 // lg: 6 artists (col-lg-2 = 16.66% width)
      } else if (width >= 768) {
        this.artistsPerPage = 4 // md: 4 artists (col-md-3 = 25% width)
      } else {
        this.artistsPerPage = 2 // sm/xs: 2 artists (col-6 = 50% width)
      }
      this.currentArtistPage = 0
    },
    updateEventsPerPage() {
      const width = window.innerWidth
      if (width >= 992) {
        this.eventsPerPage = 3 // lg: 6 events (col-lg-4 = 16.66% width)
      } else if (width >= 576) {
        this.eventsPerPage = 2 // md: 2 event (col-md-6 = 25% width)
      } else {
        this.eventsPerPage = 1 // sm/xs: 1 event (col-12 = 50% width)
      }
      this.currentEventPage = 0
    },
    updateSongsPerPage() {
      const width = window.innerWidth
      if (width >= 1200) {
        this.songsPerPage = 6 // lg: 2 rows × 3 cols
      } else if (width >= 992) {
        this.songsPerPage = 4 // md: 2 rows × 2 cols
      } else if (width >= 768) {
        this.songsPerPage = 2 // sm: 2 rows × 1 col
      } else {
        this.songsPerPage = 2
      }
      this.currentSongPage = 0 // Reset to first page when layout changes
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
        console.log('Loaded', this.upcomingEvents.length, 'upcoming events')
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

    async toggleLike(song) {
      console.log('toggleLike called!', song.title)
      const songKey = `${song.artistId}_${song.id}`
      if (this.likingInProgress[songKey]) {
        console.log('Already in progress, skipping')
        return
      }

      try {
        this.likingInProgress[songKey] = true
        const isLiked = this.isSongLiked(song)
        console.log('Current like status:', isLiked)

        const result = await toggleSongLike(song.artistId, song.id, isLiked)
        console.log('Toggle result:', result)

        if (result.success) {
          // Update local state - Create new Set to trigger reactivity
          const newSet = new Set(this.likedSongsSet)
          if (isLiked) {
            newSet.delete(songKey)
            console.log('Unliked song')
          } else {
            newSet.add(songKey)
            console.log('Liked song')
          }
          this.likedSongsSet = newSet

          // Update song's like count in UI - Find and update in array
          const songIndex = this.recommendedSongs.findIndex(
            (s) => s.artistId === song.artistId && s.id === song.id,
          )
          if (songIndex !== -1) {
            this.recommendedSongs[songIndex].likes = result.newLikeCount
          }
          console.log('New like count:', result.newLikeCount)
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
      console.log('Opening song detail for:', song.title, {
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
      // Comment count now reads directly from comments array
      // The modal updates the Firestore data, and we'll reload recommendations
      this.loadRecommendations()
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

      console.log('Player clicked:', song.title, 'by', song.artistName)

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
            behavior: 'smooth',
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
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23bb1814' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
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

/* Arrows now use Bootstrap utilities; custom arrow CSS removed */

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
  padding: 1rem;
}

/* Add/update these styles */
.song-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.player-container {
  height: 232px;
  flex-shrink: 0;
}

.song-footer {
  padding: 1.5rem 1rem 1rem;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.song-artist-info {
  height: 55px;
}

.song-title-bottom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name-bottom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  display: flex;
  padding: 0;
}

.carousel-page.events-page {
  min-width: 100%;
  display: flex;
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
  padding: 2rem 1rem 1rem;
  /* Increase top padding */
  height: auto;
  /* Remove fixed height */
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  /* Add separator line */
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
  font-size: 1.2rem;
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

.genre-tag {
  font-size: 0.7rem;
  background: #bb1814;
  color: white;
  padding: 0.4rem 0.7rem;
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
  width: 100%;
  height: 100%;
}

/* Events Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Button Styles */
.btn-outline-primary {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  padding: 0.5rem 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
  border-color: #bb1814;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  color: #fff;
  box-shadow: 0 8px 24px rgba(187, 24, 20, 0.3);
}

.btn-outline-primary:active {
  transform: translateY(0);
}

.btn-outline-primary:focus {
  box-shadow: 0 0 0 3px rgba(187, 24, 20, 0.3);
}

/* Update the song footer styles */
.song-footer {
  padding: 1.5rem 1rem 1rem;
  /* Increase top padding */
  height: auto;
  /* Remove fixed height */
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  /* Add separator line */
}

/* Update genre tags container */
.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.75rem;
  min-height: 32px;
  overflow: visible; /* Allow tags to be visible */
  height: auto; /* Allow container to grow */
}

/* Update song detail modal genre tags */
.genre-tag.genre-count {
  display: none;
  /* This is hiding your count tag */
}

/* Add to show all genres in modal */
:deep(.song-detail-modal .genre-tags .genre-tag) {
  display: inline-flex !important;
  /* Force display all tags in modal */
}

/* Custom red loading spinner */
.spinner-border.text-red {
  color: #bb1814 !important;
}
</style>
