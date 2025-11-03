<!-- public artist profile.vue -->
<template>
  <div class="public-artist-profile">
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
      </svg>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="content-wrapper">
      <div class="container text-center py-5">
        <div class="loading-spinner" role="status">
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading artist profile...</p>
      </div>
    </div>

    <!-- Artist Not Found -->
    <div v-else-if="!artist" class="content-wrapper">
      <div class="container text-center py-5">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Artist Not Found</h3>
        <p class="error-message">This artist profile doesn't exist or has been removed.</p>
        <router-link to="/home" class="btn-primary-custom"> Back to Home </router-link>
      </div>
    </div>

    <!-- Artist Profile Content -->
    <div v-else>
      <!-- Artist Hero Section with Blurred Background -->
      <div class="artist-hero-section">
        <div
          class="hero-background"
          :style="{ backgroundImage: `url(${artist.profileImage || defaultImage})` }"
        ></div>
        <div class="hero-content">
          <div class="container py-5">
            <div class="row align-items-center">
              <!-- Profile Picture -->
              <div class="col-auto">
                <div class="position-relative d-inline-block">
                  <img
                    :src="artist.profileImage || defaultImage"
                    :alt="artist.artistName"
                    class="artist-avatar"
                  />
                  <div v-if="artist.verified" class="verified-badge-large">
                    <i class="bi bi-patch-check-fill"></i>
                  </div>
                </div>
              </div>

              <!-- Artist Info -->
              <div class="col">
                <h1 class="artist-name">{{ artist.artistName }}</h1>
                <p class="artist-bio">{{ artist.bio || 'Whatever bio they have.' }}</p>
                <div class="follower-count">{{ artist.followerCount || 500 }} Followers</div>
                <button
                  class="btn-follow"
                  :class="{ 'btn-unfollow': isFollowing }"
                  @click="toggleFollow"
                  :disabled="followLoading"
                >
                  <span v-if="followLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <span v-else-if="!isFollowing">+</span>
                  {{ isFollowing ? 'UNFOLLOW' : 'FOLLOW' }}
                </button>

                <!-- Social Links -->
                <div v-if="hasSocialLinks" class="social-links">
                  <a
                    v-if="artist.socialLinks?.spotify"
                    :href="artist.socialLinks.spotify"
                    target="_blank"
                    class="social-icon spotify"
                  >
                    <i class="bi bi-spotify"></i>
                  </a>
                  <a
                    v-if="artist.socialLinks?.youtube"
                    :href="artist.socialLinks.youtube"
                    target="_blank"
                    class="social-icon youtube"
                  >
                    <i class="bi bi-youtube"></i>
                  </a>
                  <a
                    v-if="artist.socialLinks?.instagram"
                    :href="artist.socialLinks.instagram"
                    target="_blank"
                    class="social-icon instagram"
                  >
                    <i class="bi bi-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- Wave Animation Background for Content Area -->
        <div class="content-wave-background">
          <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="#bb1814" stroke-width="1.5" opacity="0.3">
              <animate
                attributeName="d"
                values="M0,150 Q200,80 400,150 T800,150 T1200,150;
                       M0,150 Q200,220 400,150 T800,150 T1200,150;
                       M0,150 Q200,80 400,150 T800,150 T1200,150"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
            <path fill="none" stroke="#C73535" stroke-width="1" opacity="0.25">
              <animate
                attributeName="d"
                values="M0,180 Q250,110 500,180 T1000,180 T1200,180;
                       M0,180 Q250,250 500,180 T1000,180 T1200,180;
                       M0,180 Q250,110 500,180 T1000,180 T1200,180"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>
            <path fill="none" stroke="#D95656" stroke-width="0.8" opacity="0.2">
              <animate
                attributeName="d"
                values="M0,120 Q300,50 600,120 T1200,120;
                       M0,120 Q300,190 600,120 T1200,120;
                       M0,120 Q300,50 600,120 T1200,120"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        <div class="container" style="padding-top: 2rem; padding-bottom: 2rem">
          <!-- Tabs Section -->
          <div class="row">
            <div class="col-12">
              <div class="custom-tab-bar mb-4">
                <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'music' }"
                  @click="activeTab = 'music'"
                >
                  MY MUSIC
                </button>
                <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'events' }"
                  @click="activeTab = 'events'"
                >
                  MY EVENTS
                </button>
                <button
                  class="tab-btn"
                  :class="{ active: activeTab === 'about' }"
                  @click="activeTab = 'about'"
                >
                  ABOUT ME
                </button>
              </div>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="row">
            <div class="col-12">
              <!-- Music Tab -->
              <div v-if="activeTab === 'music'" class="tab-content-section">
                <div class="music-library-section">
                  <!-- Music Grid Header -->
                  <h2 class="music-library-title">MUSIC LIBRARY</h2>

                  <!-- Filter Tabs -->
                  <div v-if="musicLinks.length > 0" class="filter-tabs mb-4">
                    <button
                      class="filter-tab"
                      :class="{ active: musicFilter === 'all' }"
                      @click="musicFilter = 'all'"
                    >
                      ALL ({{ musicLinks.length }})
                    </button>
                    <button
                      class="filter-tab"
                      :class="{ active: musicFilter === 'single' }"
                      @click="musicFilter = 'single'"
                    >
                      SINGLES ({{ getMusicByType('single').length }})
                    </button>
                    <button
                      class="filter-tab"
                      :class="{ active: musicFilter === 'album' }"
                      @click="musicFilter = 'album'"
                    >
                      ALBUMS ({{ getMusicByType('album').length }})
                    </button>
                    <button
                      class="filter-tab"
                      :class="{ active: musicFilter === 'video' }"
                      @click="musicFilter = 'video'"
                    >
                      VIDEOS ({{ getMusicByType('video').length }})
                    </button>
                  </div>

                  <!-- Music Grid -->
                  <div v-if="filteredMusicLinks.length > 0" class="song-carousel">
                    <div
                      v-for="music in displayedMusicLinks"
                      :key="music.id"
                      class="song-card"
                      @click="openSongDetail(music)"
                    >
                      <!-- Song Header - Just Title and Platform/Type Badges -->
                      <div class="song-header">
                        <div class="song-info">
                          <h6 class="song-title">{{ music.title }}</h6>
                        </div>

                        <!-- Platform and Type Badges -->
                        <div class="badges-container">
                          <!-- Music Type Badge -->
                          <span
                            v-if="music.type"
                            class="type-badge"
                            :class="getTypeBadgeClass(music.type)"
                          >
                            {{ music.type }}
                          </span>

                          <!-- Platform Badge -->
                          <div class="platform-badge-song" :class="music.platform">
                            <i
                              class="bi"
                              :class="
                                music.platform === 'spotify'
                                  ? 'bi-spotify'
                                  : music.platform === 'youtube'
                                    ? 'bi-youtube'
                                    : music.platform === 'soundcloud'
                                      ? 'bi-soundwave'
                                      : 'bi-music-note'
                              "
                            ></i>
                          </div>
                        </div>
                      </div>

                      <!-- Embedded Player -->
                      <div class="iframe-container">
                        <!-- Spotify Embed -->
                        <iframe
                          v-if="music.platform === 'spotify'"
                          :src="music.embedUrl"
                          width="100%"
                          height="232"
                          frameborder="0"
                          allowtransparency="true"
                          allow="encrypted-media"
                          loading="lazy"
                          class="music-iframe"
                        ></iframe>

                        <!-- YouTube Embed -->
                        <iframe
                          v-else-if="music.platform === 'youtube'"
                          :src="music.embedUrl"
                          width="100%"
                          height="232"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                          loading="lazy"
                          class="music-iframe"
                        ></iframe>

                        <!-- SoundCloud Embed -->
                        <iframe
                          v-else-if="music.platform === 'soundcloud'"
                          :src="music.embedUrl"
                          width="100%"
                          height="232"
                          frameborder="0"
                          loading="lazy"
                          class="music-iframe"
                        ></iframe>
                      </div>

                      <!-- Bottom Row: Genre Tags Left, Action Buttons Right -->
                      <div class="song-bottom">
                        <!-- Genre Tags -->
                        <div
                          v-if="music.genres && music.genres.length > 0"
                          class="genres-container"
                        >
                          <span
                            v-for="genre in music.genres.slice(0, 2)"
                            :key="genre"
                            class="genre-tag"
                          >
                            {{ genre }}
                          </span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="song-actions">
                          <button
                            class="action-btn like-btn"
                            :class="{ liked: isLiked(music) }"
                            @click.stop="toggleLike(music)"
                            :disabled="likingInProgress[music.id]"
                          >
                            <span class="icon">❤️</span>
                            <span class="count">{{ music.likes || 0 }}</span>
                          </button>

                          <button
                            class="action-btn comment-btn"
                            @click.stop="openSongDetail(music)"
                          >
                            <span class="icon">💬</span>
                            <span class="count">{{ getCommentCount(music.id) }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- See More Music Button -->
                  <div
                    v-if="filteredMusicLinks.length > 6 && !showAllMusic"
                    class="text-center mt-4"
                  >
                    <button class="btn-see-more" @click="showAllMusic = true">
                      <i class="bi bi-chevron-down"></i>
                      See More Music ({{ filteredMusicLinks.length - 6 }} more)
                    </button>
                  </div>

                  <!-- Show Less Music Button -->
                  <div
                    v-if="showAllMusic && filteredMusicLinks.length > 6"
                    class="text-center mt-4"
                  >
                    <button class="btn-see-less" @click="showAllMusic = false">
                      <i class="bi bi-chevron-up"></i>
                      Show Less
                    </button>
                  </div>

                  <!-- No Music Message -->
                  <div v-if="musicLinks.length === 0" class="text-center py-5">
                    <i class="bi bi-music-note-list fs-1 text-white mb-3"></i>
                    <p class="text-white">This artist hasn't uploaded any music yet.</p>
                  </div>
                  <div v-else-if="filteredMusicLinks.length === 0" class="text-center py-5">
                    <i class="bi bi-music-note-list fs-1 text-white mb-3"></i>
                    <p class="text-white">No {{ musicFilter }}s found.</p>
                  </div>
                </div>
              </div>

              <!-- Events Tab -->
              <div v-if="activeTab === 'events'" class="tab-content-section">
                <!-- Loading Events -->
                <div v-if="loadingEvents" class="text-center py-5">
                  <div class="spinner-border text-danger"></div>
                  <p class="mt-3 text-white">Loading events...</p>
                </div>

                <!-- No Events -->
                <div v-else-if="artistEvents.length === 0" class="text-center py-5">
                  <i class="bi bi-calendar-x fs-1 text-white mb-3"></i>
                  <p class="text-white">No upcoming events scheduled.</p>
                </div>

                <!-- Events List -->
                <div v-else>
                  <div class="events-grid">
                    <div v-for="event in displayedEvents" :key="event.id">
                      <EventCard :event="event" />
                    </div>
                  </div>

                  <!-- See More Events Button -->
                  <div v-if="artistEvents.length > 6 && !showAllEvents" class="text-center mt-4">
                    <button class="btn-see-more" @click="showAllEvents = true">
                      <i class="bi bi-chevron-down"></i>
                      See More Events ({{ artistEvents.length - 6 }} more)
                    </button>
                  </div>

                  <!-- Show Less Events Button -->
                  <div v-if="showAllEvents && artistEvents.length > 6" class="text-center mt-4">
                    <button class="btn-see-less" @click="showAllEvents = false">
                      <i class="bi bi-chevron-up"></i>
                      Show Less
                    </button>
                  </div>
                </div>
              </div>

              <!-- About Tab -->
              <div v-if="activeTab === 'about'" class="tab-content-section">
                <div class="about-section">
                  <h2 class="about-title">About {{ artist.artistName }}</h2>

                  <div v-if="artist.aboutSection" class="about-text mb-4">
                    <p style="font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap">
                      {{ artist.aboutSection }}
                    </p>
                  </div>
                  <div v-else class="about-empty">
                    <i class="bi bi-info-circle"></i> No additional information available.
                  </div>

                  <!-- Artist Stats -->
                  <div class="stats-grid mt-4">
                    <div class="stat-box">
                      <i class="bi bi-calendar3 fs-4"></i>
                      <div>
                        <div class="fw-bold">Member Since</div>
                        <div class="text-white-soft">{{ formatDate(artist.createdAt) }}</div>
                      </div>
                    </div>
                    <div class="stat-box">
                      <i class="bi bi-music-note-list fs-4"></i>
                      <div>
                        <div class="fw-bold">Genres</div>
                        <div class="text-white-soft">{{ artist.genres?.length || 0 }} genres</div>
                      </div>
                    </div>
                    <div class="stat-box">
                      <i class="bi bi-calendar-event fs-4"></i>
                      <div>
                        <div class="fw-bold">Upcoming Events</div>
                        <div class="text-white-soft">{{ artistEvents.length }} events</div>
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

    <!-- Song Detail Modal -->
    <SongDetailModal :show="showSongModal" :song="selectedSong" @close="closeSongModal" />
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import EventCard from '@/components/EventCard.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import SongDetailModal from '@/components/SongDetailModal.vue'
import { followArtist, unfollowArtist, isUserFollowingArtist } from '@/utils/userInteractions'
import {
  toggleSongLike,
  getUserLikedSongs,
  postSongComment,
  getSongComments,
  deleteSongComment,
  toggleCommentLike,
  postCommentReply,
  deleteCommentReply,
} from '@/utils/musicInteractions'

export default {
  name: 'PublicArtistProfile',
  components: {
    EventCard,
    NavigationBar,
    SongDetailModal,
  },
  data() {
    return {
      auth, // Expose auth to template
      artist: null,
      artistEvents: [],
      loading: true,
      loadingEvents: false,
      activeTab: 'music',
      isFollowing: false,
      followLoading: false,
      musicLinks: [],
      musicFilter: 'all',
      defaultImage: 'https://ui-avatars.com/api/?name=Artist&size=300&background=667eea&color=fff',
      userLikedSongs: new Set(), // Track which songs user has liked
      likingInProgress: {}, // Track which songs are being liked/unliked: { songId: true/false }
      expandedComments: {}, // Track which songs have comments expanded: { songId: true/false }
      songComments: {}, // Store comments for each song: { songId: [comments] }
      commentText: {}, // Store comment input text for each song: { songId: text }
      loadingComments: {}, // Track which songs are loading comments: { songId: true/false }
      postingComment: {}, // Track which songs are posting comments: { songId: true/false }
      replyingTo: {}, // Track which comment is being replied to: { commentId: true/false }
      replyText: {}, // Store reply text for each comment: { commentId: text }
      expandedReplies: {}, // Track which comments have expanded replies: { commentId: true/false }
      deletingComment: {}, // Track comments being deleted: { commentId: true/false }
      showAllMusic: false, // Track if showing all music or just first 6
      showAllEvents: false, // Track if showing all events or just first 6
      selectedSong: null, // Song to display in modal
      showSongModal: false, // Control modal visibility
    }
  },
  computed: {
    hasSocialLinks() {
      const links = this.artist?.socialLinks || {}
      return links.spotify || links.youtube || links.instagram
    },
    filteredMusicLinks() {
      if (this.musicFilter === 'all') {
        return this.musicLinks
      }
      return this.musicLinks.filter((music) => music.type === this.musicFilter)
    },
    displayedMusicLinks() {
      // Show first 6 items (3x2 grid) unless "See More" is clicked
      if (this.showAllMusic) {
        return this.filteredMusicLinks
      }
      return this.filteredMusicLinks.slice(0, 6)
    },
    displayedEvents() {
      // Show first 6 items (3x2 grid) unless "See More" is clicked
      if (this.showAllEvents) {
        return this.artistEvents
      }
      return this.artistEvents.slice(0, 6)
    },
  },
  async mounted() {
    await this.loadArtistProfile()
    await this.loadArtistEvents()
    await this.checkFollowStatus()
    await this.loadUserLikedSongs()

    // Note: checkForSongModal is called inside loadArtistProfile after musicLinks are loaded
  },
  watch: {
    // Reset "Show All" when filter changes
    musicFilter() {
      this.showAllMusic = false
    },
    // Watch for route query changes (notifications)
    '$route.query.song'(newSongId) {
      if (newSongId) {
        this.checkForSongModal()
      }
    },
  },
  methods: {
    async loadArtistProfile() {
      try {
        const artistId = this.$route.params.id

        const artistDoc = await getDoc(doc(db, 'artists', artistId))

        if (artistDoc.exists()) {
          this.artist = {
            id: artistDoc.id,
            ...artistDoc.data(),
          }

          // Load music links
          this.musicLinks = this.artist.musicLinks || []

          // Sort by newest first
          this.musicLinks.sort((a, b) => {
            const dateA = a.addedAt?.toDate ? a.addedAt.toDate() : new Date(a.addedAt)
            const dateB = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(b.addedAt)
            return dateB - dateA
          })

          console.log('Artist loaded:', this.artist.artistName)
          console.log('Music links:', this.musicLinks.length)

          // Check if we need to open a song modal from notification
          this.$nextTick(() => {
            this.checkForSongModal()
          })
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
        const eventsQuery = query(collection(db, 'events'), where('artistId', '==', this.artist.id))

        const eventsSnapshot = await getDocs(eventsQuery)
        console.log(`Raw events found: ${eventsSnapshot.docs.length}`)

        const now = new Date()
        now.setHours(0, 0, 0, 0)

        // Filter for upcoming events and sort client-side
        this.artistEvents = eventsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((event) => {
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
        month: 'long',
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
    },

    getMusicByType(type) {
      return this.musicLinks.filter((music) => music.type === type)
    },

    getTypeBadgeClass(type) {
      const classes = {
        single: 'bg-primary',
        album: 'bg-success',
        video: 'bg-danger',
      }
      return classes[type] || 'bg-secondary'
    },

    async loadUserLikedSongs() {
      try {
        const user = auth.currentUser
        if (!user || !this.musicLinks.length) return

        // Create song keys for this artist's songs
        const songKeys = this.musicLinks.map((song) => `${this.artist.id}_${song.id}`)

        // Get user's liked songs
        this.userLikedSongs = await getUserLikedSongs(user.uid, songKeys)
      } catch (error) {
        console.error('Error loading user liked songs:', error)
      }
    },

    async toggleLike(music) {
      try {
        const user = auth.currentUser
        if (!user) {
          alert('Please log in to like songs')
          return
        }

        const songKey = `${this.artist.id}_${music.id}`
        const isCurrentlyLiked = this.userLikedSongs.has(songKey)

        // Prevent multiple rapid clicks
        if (this.likingInProgress[music.id]) return
        this.likingInProgress[music.id] = true

        // Optimistic update
        if (isCurrentlyLiked) {
          this.userLikedSongs.delete(songKey)
        } else {
          this.userLikedSongs.add(songKey)
        }

        // Update like count optimistically
        const currentLikes = music.likes || 0
        music.likes = isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1

        // Call API
        const result = await toggleSongLike(this.artist.id, music.id, isCurrentlyLiked)

        if (result.success) {
          // Update with actual like count from server
          music.likes = result.newLikeCount
        } else {
          // Revert optimistic update on error
          if (isCurrentlyLiked) {
            this.userLikedSongs.add(songKey)
          } else {
            this.userLikedSongs.delete(songKey)
          }
          music.likes = currentLikes
          alert('Failed to update like. Please try again.')
        }
      } catch (error) {
        console.error('Error toggling like:', error)
        alert('An error occurred. Please try again.')
      } finally {
        this.likingInProgress[music.id] = false
      }
    },

    isLiked(music) {
      const songKey = `${this.artist.id}_${music.id}`
      return this.userLikedSongs.has(songKey)
    },

    async toggleComments(songId) {
      if (this.expandedComments[songId]) {
        // Collapse comments
        this.expandedComments[songId] = false
      } else {
        // Expand comments and load them
        this.expandedComments[songId] = true
        await this.loadComments(songId)
      }
    },

    async loadComments(songId) {
      try {
        this.loadingComments[songId] = true
        const comments = await getSongComments(this.artist.id, songId)

        // Sort comments by date (newest first)
        const sortedComments = comments.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
          return dateB - dateA
        })

        this.songComments[songId] = sortedComments
      } catch (error) {
        console.error('Error loading comments:', error)
      } finally {
        this.loadingComments[songId] = false
      }
    },

    async postComment(songId) {
      try {
        const user = auth.currentUser
        if (!user) {
          alert('Please log in to comment')
          return
        }

        const text = this.commentText[songId]
        if (!text || !text.trim()) {
          return
        }

        this.postingComment[songId] = true

        const result = await postSongComment(this.artist.id, songId, text)

        if (result.success) {
          // Clear input
          this.commentText[songId] = ''

          // Reload comments
          await this.loadComments(songId)

          // Update comment count in music links
          const music = this.musicLinks.find((m) => m.id === songId)
          if (music) {
            music.commentCount = (music.commentCount || 0) + 1
          }
        } else {
          alert(result.error || 'Failed to post comment')
        }
      } catch (error) {
        console.error('Error posting comment:', error)
        alert('An error occurred. Please try again.')
      } finally {
        this.postingComment[songId] = false
      }
    },

    getComments(songId) {
      return this.songComments[songId] || []
    },

    getCommentCount(songId) {
      const music = this.musicLinks.find((m) => m.id === songId)
      return music?.commentCount || 0
    },

    formatCommentDate(timestamp) {
      if (!timestamp) return 'Just now'

      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diffInSeconds = Math.floor((now - date) / 1000)

      if (diffInSeconds < 60) return 'Just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },

    async deleteComment(songId, commentId) {
      if (!confirm('Are you sure you want to delete this comment?')) {
        return
      }

      this.deletingComment[commentId] = true

      try {
        const result = await deleteSongComment(this.artist.id, songId, commentId)

        if (result.success) {
          // Reload comments
          await this.loadComments(songId)

          // Update comment count
          const music = this.musicLinks.find((m) => m.id === songId)
          if (music) {
            music.commentCount = Math.max(0, (music.commentCount || 0) - 1)
          }
        } else {
          alert(result.error || 'Failed to delete comment')
        }
      } catch (error) {
        console.error('Error deleting comment:', error)
        alert('An error occurred. Please try again.')
      } finally {
        this.deletingComment[commentId] = false
      }
    },

    async toggleCommentLike(songId, commentId) {
      if (!auth.currentUser) {
        alert('Please sign in to like comments')
        return
      }

      const comment = this.songComments[songId]?.find((c) => c.id === commentId)
      if (!comment) return

      const isLiked = this.isCommentLiked(comment)

      // Optimistic update
      if (isLiked) {
        comment.likes = Math.max(0, (comment.likes || 0) - 1)
        comment.likedBy = (comment.likedBy || []).filter((id) => id !== auth.currentUser.uid)
      } else {
        comment.likes = (comment.likes || 0) + 1
        if (!comment.likedBy) {
          comment.likedBy = []
        }
        comment.likedBy.push(auth.currentUser.uid)
      }

      const result = await toggleCommentLike(this.artist.id, songId, commentId, isLiked)

      if (!result.success) {
        // Revert on failure
        if (isLiked) {
          comment.likes = (comment.likes || 0) + 1
          comment.likedBy.push(auth.currentUser.uid)
        } else {
          comment.likes = Math.max(0, (comment.likes || 0) - 1)
          comment.likedBy = comment.likedBy.filter((id) => id !== auth.currentUser.uid)
        }
        alert(result.error || 'Failed to like comment')
      }
    },

    isCommentLiked(comment) {
      if (!auth.currentUser || !comment.likedBy) return false
      return comment.likedBy.includes(auth.currentUser.uid)
    },

    toggleReply(commentId) {
      this.replyingTo[commentId] = !this.replyingTo[commentId]
      if (!this.replyText[commentId]) {
        this.replyText[commentId] = ''
      }
    },

    async postReply(songId, commentId) {
      const text = this.replyText[commentId]?.trim()
      if (!text) return

      if (!auth.currentUser) {
        alert('Please sign in to reply to comments')
        return
      }

      try {
        const result = await postCommentReply(this.artist.id, songId, commentId, text)

        if (result.success) {
          this.replyText[commentId] = ''
          this.replyingTo[commentId] = false
          await this.loadComments(songId)

          // Auto-expand replies
          this.expandedReplies[commentId] = true
        } else {
          alert(result.error || 'Failed to post reply')
        }
      } catch (error) {
        console.error('Error posting reply:', error)
        alert('An error occurred. Please try again.')
      }
    },

    toggleReplies(commentId) {
      this.expandedReplies[commentId] = !this.expandedReplies[commentId]
    },

    async deleteReply(songId, commentId, replyId) {
      if (!confirm('Are you sure you want to delete this reply?')) {
        return
      }

      try {
        const result = await deleteCommentReply(this.artist.id, songId, commentId, replyId)

        if (result.success) {
          await this.loadComments(songId)
        } else {
          alert(result.error || 'Failed to delete reply')
        }
      } catch (error) {
        console.error('Error deleting reply:', error)
        alert('An error occurred. Please try again.')
      }
    },

    getReplies(comment) {
      return comment.replies || []
    },

    getReplyCount(comment) {
      return comment.replyCount || 0
    },

    // Song Modal Methods
    checkForSongModal() {
      const songId = this.$route.query.song
      console.log('🔍 Checking for song modal, songId:', songId)
      console.log('🔍 musicLinks available:', this.musicLinks.length)

      if (songId && this.musicLinks.length > 0) {
        const song = this.musicLinks.find((s) => s.id === songId)
        console.log('🔍 Found song:', song ? song.title : 'NOT FOUND')

        if (song) {
          this.openSongDetail(song)
          // Switch to music tab if not already there
          this.activeTab = 'music'
        } else {
          console.warn('⚠️ Song not found in musicLinks:', songId)
        }
      }
    },

    openSongDetail(song) {
      console.log('🎵 Opening song detail modal for:', song.title)
      this.selectedSong = {
        ...song,
        artistId: this.artist.id,
        artistName: this.artist.artistName,
      }
      this.showSongModal = true
      console.log('🎵 Modal state:', this.showSongModal, 'Selected song:', this.selectedSong?.title)
    },

    closeSongModal() {
      this.showSongModal = false
      this.selectedSong = null

      // Remove song query parameter from URL
      if (this.$route.query.song) {
        this.$router.replace({
          query: { ...this.$route.query, song: undefined },
        })
      }
    },
  },
  watch: {
    // Watch for route changes (when navigating from one artist to another)
    '$route.params.id': {
      async handler(newId, oldId) {
        // Only reload if we're navigating from one artist to another
        // Skip if oldId is undefined (initial load handled by mounted())
        if (newId && oldId && newId !== oldId) {
          // Reset state
          this.loading = true
          this.artist = null
          this.artistEvents = []
          this.musicLinks = []
          this.isFollowing = false
          this.activeTab = 'music'
          this.musicFilter = 'all'
          this.expandedComments = {}
          this.songComments = {}
          this.commentText = {}
          this.loadingComments = {}
          this.postingComment = {}

          // Reload data for new artist sequentially
          await this.loadArtistProfile()
          await this.loadArtistEvents()
          await this.checkFollowStatus()
          await this.loadUserLikedSongs()
        }
      },
      immediate: false,
    },
  },
}
</script>

<style scoped>
.public-artist-profile {
  min-height: 100vh;
  background: #191717;
  color: white;
  position: relative;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}

/* Only show dark background after hero section */
.public-artist-profile .content-wrapper {
  background: #191717;
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
  position: relative;
  z-index: 1;
  padding-bottom: 40px;
  margin-top: 0;
  padding-top: 0;
}

/* Wave Animation Backgrounds */
.wave-svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.content-wave-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.8;
}

.wave-svg svg,
.content-wave-background svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Artist Hero Section */
.artist-hero-section {
  position: relative;
  width: 100%;
  min-height: 400px;
  overflow: hidden;
  margin: 0;
  margin-bottom: 0;
  padding: 0;
  top: 0;
  left: 0;
  z-index: 0;
}

.hero-background {
  position: absolute;
  top: -80px;
  /* Extend above to cover navbar area */
  left: 0;
  width: 100%;
  height: calc(100% + 80px);
  /* Add navbar height to cover behind it */
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.3);
  transform: scale(1.05);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  padding-top: 100px;
  /* Account for fixed navbar */
  background: transparent;
}

.artist-name {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.artist-bio {
  font-size: 1.1rem;
  color: white;
  margin-bottom: 1rem;
}

.follower-count {
  font-size: 1rem;
  color: white;
  margin-bottom: 1.5rem;
}

.btn-follow {
  background: #bb1814;
  color: #fff;
  border-radius: 22px;
  font-size: 1.1rem;
  font-weight: 600;
  border: 2px solid #bb1814;
  padding: 8px 0;
  letter-spacing: 0.4px;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 180px;
}

.btn-follow:hover:not(:disabled) {
  background: #6e0b0b;
  color: white;
}

.btn-follow.btn-unfollow {
  background-color: transparent;
  border: 2px solid #bb1814;
  color: white;
}

.btn-follow.btn-unfollow:hover:not(:disabled) {
  background-color: #bb1814;
  color: white;
}

.btn-follow:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.social-icon.spotify {
  background: #1db954;
}

.social-icon.youtube {
  background: #ff0000;
}

.social-icon.instagram {
  background: linear-gradient(
    45deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );
}

.social-icon:hover {
  transform: scale(1.1);
}

.artist-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.verified-badge-large i {
  color: #bb1814;
  font-size: 2rem;
}

/* Tabs */
.custom-tab-bar {
  display: flex;
  align-items: flex-end;
  position: relative;
  background: transparent;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1 1 auto;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Poppins', Arial, Helvetica, sans-serif;
  font-weight: 700;
  color: white;
  padding: 18px 0 15px 0;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tab-btn.active {
  background: #bb1814;
  color: white;
  border-radius: 16px 16px 0 0;
  position: relative;
}

.tab-btn:not(.active):hover {
  color: #bb1814;
}

.custom-tab-bar::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: #bb1814;
  z-index: 1;
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

/* Music Library Section */
.music-library-section {
  margin-bottom: 40px;
}

.music-library-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tab {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.filter-tab:hover {
  border-color: #bb1814;
  color: #bb1814;
}

.filter-tab.active {
  background: #bb1814;
  border-color: #bb1814;
  color: white;
}

/* Song Carousel Styles */
.song-carousel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  overflow-y: visible;
}

/* Events Grid Styles */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Song Card Styles */
.song-card {
  background: rgba(35, 35, 38, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.song-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(187, 24, 20, 0.2);
  border-color: rgba(187, 24, 20, 0.3);
}

/* Song Header */
.song-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Badges Container */
.badges-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Type Badge */
.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

/* Platform Badge */
.platform-badge-song {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.platform-badge-song.spotify {
  background: rgba(29, 185, 84, 0.9);
}

.platform-badge-song.youtube {
  background: rgba(255, 0, 0, 0.9);
}

.platform-badge-song.soundcloud {
  background: rgba(255, 85, 0, 0.9);
}

/* Iframe Container */
.iframe-container {
  margin: 0.75rem 0;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.music-iframe {
  width: 100%;
  height: 232px;
  border: none;
  border-radius: 12px;
}

/* Bottom Row Layout */
.song-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Genres Container */
.genres-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.genre-tag {
  background: linear-gradient(135deg, #bb1814, #d32f2f);
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Song Actions */
.song-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.action-btn .icon {
  font-size: 1.1rem;
}

.action-btn .count {
  font-weight: 600;
  font-size: 0.85rem;
}

.like-btn.liked .icon {
  transform: scale(1.2);
}

.action-btn:hover:not(:disabled) {
  background: rgba(187, 24, 20, 0.2);
  border-color: rgba(187, 24, 20, 0.5);
  transform: translateY(-2px);
}

.like-btn.liked {
  background: rgba(187, 24, 20, 0.3);
  border-color: #bb1814;
  color: #bb1814;
}

.action-btn:hover:not(:disabled) {
  color: #bb1814;
  transform: translateY(-1px);
}

.action-btn.liked {
  color: #bb1814;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-btn .icon {
  font-size: 1.1rem;
}

.action-btn .count {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Comments Section */
.comments-section {
  background: rgba(35, 35, 38, 0.6);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
}

.comment-input-wrapper {
  margin-bottom: 1rem;
}

.comment-input {
  resize: vertical;
  min-height: 60px;
  border-radius: 8px;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.comment-input:focus {
  border-color: #bb1814;
  box-shadow: 0 0 0 0.2rem rgba(187, 24, 20, 0.25);
  outline: none;
  background: rgba(0, 0, 0, 0.4);
}

.comment-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.btn-post-comment {
  background: #bb1814;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-post-comment:hover:not(:disabled) {
  background: #9d1310;
  transform: translateY(-2px);
}

.btn-post-comment:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-item:last-child {
  margin-bottom: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-header strong {
  color: white;
  font-size: 0.9rem;
}

.comment-header small {
  font-size: 0.75rem;
}

.text-white {
  color: white !important;
}

.text-white-soft {
  color: rgba(255, 255, 255, 0.7) !important;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-actions .btn-link {
  text-decoration: none;
  font-size: 0.85rem;
}

.comment-actions .btn-link:hover {
  text-decoration: underline;
}

.comment-text {
  margin: 0;
  color: white;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Reply Input */
.reply-input {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.reply-input .form-control {
  border-radius: 20px;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.reply-input .form-control:focus {
  border-color: #bb1814;
  background: rgba(0, 0, 0, 0.4);
  outline: none;
}

.reply-input .form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.btn-reply-submit {
  background: #bb1814;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reply-submit:hover:not(:disabled) {
  background: #9d1310;
}

.btn-reply-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-reply-cancel {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reply-cancel:hover {
  border-color: #bb1814;
  color: #bb1814;
}

.btn-replies-toggle {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-replies-toggle:hover {
  color: #bb1814;
}

/* Replies Section */
.replies-section {
  padding-left: 1.5rem;
  margin-top: 0.75rem;
  border-left: 2px solid #e9ecef;
}

.replies-list {
  margin-top: 0.5rem;
}

.reply-item {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.reply-header strong {
  color: white;
  font-size: 0.85rem;
}

.reply-header small {
  font-size: 0.7rem;
}

.reply-actions {
  display: flex;
  align-items: center;
}

.reply-text {
  margin: 0;
  color: white;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Embed Preview */
.embed-preview {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
}

/* Embed Container - Always visible */
.embed-container {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0;
  height: 232px;
  position: relative;
}

.spotify-embed-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  position: relative;
}

.spotify-embed-wrapper iframe {
  border-radius: 8px;
  display: block;
  margin-bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.youtube-embed-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.spotify-embed-wrapper iframe,
.youtube-embed-wrapper iframe {
  width: 100% !important;
  height: 232px !important;
  min-height: 232px !important;
  max-height: 232px !important;
  border-radius: 8px;
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.video-wrapper-small {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
}

/* About Section */
.about-section {
  background: rgba(35, 35, 38, 0.8);
  border-radius: 12px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.about-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: white;
}

.about-empty {
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
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
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-box i {
  color: #bb1814;
  font-size: 1.5rem;
}

.stat-box .fw-bold {
  color: white;
  font-size: 1rem;
}

.btn-back-home {
  background: #bb1814;
  color: white;
  border: none;
  border-radius: 22px;
  padding: 10px 30px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-back-home:hover {
  background: #9d1310;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(187, 24, 20, 0.4);
}

.btn-see-more,
.btn-see-less {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 22px;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-see-more:hover,
.btn-see-less:hover {
  border-color: #bb1814;
  color: #bb1814;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 70px;
  }

  .artist-hero-section {
    min-height: 300px;
  }

  .hero-content {
    min-height: 300px;
  }

  .artist-avatar {
    width: 120px;
    height: 120px;
  }

  .artist-name {
    font-size: 2rem;
  }

  .artist-bio {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .song-carousel {
    grid-template-columns: 1fr;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .filter-tab {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tab-btn {
    font-size: 0.85rem;
    padding: 12px 0 10px 0;
  }

  .music-library-title {
    font-size: 1.5rem;
  }
}

/* Tablet responsive - 2 columns for medium screens */
@media (min-width: 769px) and (max-width: 1024px) {
  .song-carousel {
    grid-template-columns: repeat(2, 1fr);
  }

  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
