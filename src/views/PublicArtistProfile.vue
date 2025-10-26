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
        <router-link to="/home" class="btn btn-primary"> Back to Home </router-link>
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
            />
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
              style="font-size: 1rem; padding: 0.5rem 1rem"
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
            <button class="btn btn-primary btn-lg" @click="toggleFollow" :disabled="followLoading">
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
                  <!-- Music Grid Header -->
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0"><i class="bi bi-music-note-list"></i> Music Library</h4>
                    <span class="badge bg-primary">
                      {{ musicLinks.length }} track{{ musicLinks.length !== 1 ? 's' : '' }}
                    </span>
                  </div>

                  <!-- Filter Tabs -->
                  <ul v-if="musicLinks.length > 0" class="nav nav-pills mb-4">
                    <li class="nav-item">
                      <button
                        class="nav-link"
                        :class="{ active: musicFilter === 'all' }"
                        @click="musicFilter = 'all'"
                      >
                        All ({{ musicLinks.length }})
                      </button>
                    </li>
                    <li class="nav-item">
                      <button
                        class="nav-link"
                        :class="{ active: musicFilter === 'single' }"
                        @click="musicFilter = 'single'"
                      >
                        Singles ({{ getMusicByType('single').length }})
                      </button>
                    </li>
                    <li class="nav-item">
                      <button
                        class="nav-link"
                        :class="{ active: musicFilter === 'album' }"
                        @click="musicFilter = 'album'"
                      >
                        Albums ({{ getMusicByType('album').length }})
                      </button>
                    </li>
                    <li class="nav-item">
                      <button
                        class="nav-link"
                        :class="{ active: musicFilter === 'video' }"
                        @click="musicFilter = 'video'"
                      >
                        Videos ({{ getMusicByType('video').length }})
                      </button>
                    </li>
                  </ul>

                  <!-- Music Grid -->
                  <div v-if="filteredMusicLinks.length > 0" class="music-grid">
                    <div
                      v-for="music in filteredMusicLinks"
                      :key="music.id"
                      class="music-item-card"
                    >
                      <!-- Platform Badge -->
                      <div class="platform-badge-public" :class="music.platform">
                        <i
                          class="bi"
                          :class="music.platform === 'spotify' ? 'bi-spotify' : 'bi-youtube'"
                        ></i>
                      </div>

                      <!-- Music Type Badge -->
                      <span class="type-badge" :class="getTypeBadgeClass(music.type)">
                        {{ music.type }}
                      </span>

                      <!-- Music Info -->
                      <div class="music-item-info">
                        <h5 class="music-item-title">{{ music.title }}</h5>
                        <p class="music-item-artist">
                          <i class="bi bi-person"></i>
                          {{ artist.artistName }}
                        </p>

                        <!-- Stats -->
                        <div class="music-item-stats">
                          <span class="stat">
                            <i class="bi bi-heart"></i> {{ music.likes || 0 }}
                          </span>
                          <span class="stat">
                            <i class="bi bi-play-circle"></i> {{ music.plays || 0 }}
                          </span>
                          <span class="stat">
                            <i class="bi bi-calendar3"></i> {{ formatDate(music.addedAt) }}
                          </span>
                        </div>

                        <!-- Genres -->
                        <div
                          v-if="music.genres && music.genres.length > 0"
                          class="music-item-genres"
                        >
                          <span
                            v-for="genre in music.genres.slice(0, 3)"
                            :key="genre"
                            class="genre-tag-small"
                          >
                            {{ genre }}
                          </span>
                        </div>
                      </div>

                      <!-- Embedded Player -->
                      <div class="embed-container">
                        <!-- Spotify Embed -->
                        <div v-if="music.platform === 'spotify'" class="spotify-embed-wrapper">
                          <iframe
                            :src="music.embedUrl"
                            width="102%"
                            height="250"
                            frameborder="0"
                            allowtransparency="true"
                            allow="encrypted-media"
                            loading="lazy"
                          ></iframe>
                        </div>

                        <!-- YouTube Embed -->
                        <div v-if="music.platform === 'youtube'" class="youtube-embed-wrapper">
                          <iframe
                            :src="music.embedUrl"
                            width="100%"
                            height="200"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                            loading="lazy"
                          ></iframe>
                        </div>
                      </div>

                      <!-- Action Buttons (Like & Comment) -->
                      <div class="music-actions mt-3">
                        <button
                          class="btn btn-sm action-btn"
                          :class="{ liked: isLiked(music) }"
                          @click="toggleLike(music)"
                          :disabled="likingInProgress[music.id]"
                          title="Like this song"
                        >
                          <i class="bi" :class="isLiked(music) ? 'bi-heart-fill' : 'bi-heart'"></i>
                          <span class="ms-1">{{ music.likes || 0 }}</span>
                        </button>
                        <button
                          class="btn btn-sm action-btn"
                          @click="toggleComments(music.id)"
                          title="View comments"
                        >
                          <i class="bi bi-chat-dots"></i>
                          <span class="ms-1">{{ getCommentCount(music.id) }}</span>
                        </button>
                      </div>

                      <!-- Comments Section -->
                      <div v-if="expandedComments[music.id]" class="comments-section mt-3">
                        <!-- Comment Input -->
                        <div class="comment-input-wrapper">
                          <textarea
                            v-model="commentText[music.id]"
                            class="form-control comment-input"
                            placeholder="Add a comment..."
                            rows="2"
                            @keydown.enter.ctrl="postComment(music.id)"
                          ></textarea>
                          <button
                            class="btn btn-primary btn-sm mt-2"
                            @click="postComment(music.id)"
                            :disabled="!commentText[music.id]?.trim() || postingComment[music.id]"
                          >
                            <span v-if="postingComment[music.id]">Posting...</span>
                            <span v-else>Post Comment</span>
                          </button>
                        </div>

                        <!-- Comments List -->
                        <div class="comments-list mt-3">
                          <div v-if="loadingComments[music.id]" class="text-center py-3">
                            <div class="spinner-border spinner-border-sm text-primary"></div>
                            <span class="ms-2">Loading comments...</span>
                          </div>

                          <div
                            v-else-if="getComments(music.id).length === 0"
                            class="text-center text-muted py-3"
                          >
                            <i class="bi bi-chat"></i> No comments yet. Be the first!
                          </div>

                          <div
                            v-else
                            v-for="comment in getComments(music.id)"
                            :key="comment.id"
                            class="comment-item"
                          >
                            <div class="comment-header">
                              <div>
                                <strong>{{ comment.userName }}</strong>
                                <small class="text-muted ms-2">{{
                                  formatCommentDate(comment.createdAt)
                                }}</small>
                              </div>
                              <div class="comment-actions">
                                <!-- Like Comment -->
                                <button
                                  class="btn btn-sm btn-link p-0 me-2"
                                  :class="{ 'text-danger': isCommentLiked(comment) }"
                                  @click="toggleCommentLike(music.id, comment.id)"
                                  :title="isCommentLiked(comment) ? 'Unlike' : 'Like'"
                                >
                                  <i
                                    class="bi"
                                    :class="isCommentLiked(comment) ? 'bi-heart-fill' : 'bi-heart'"
                                  ></i>
                                  <span v-if="comment.likes > 0" class="ms-1">{{
                                    comment.likes
                                  }}</span>
                                </button>

                                <!-- Reply Button -->
                                <button
                                  class="btn btn-sm btn-link p-0 me-2 text-primary"
                                  @click="toggleReply(comment.id)"
                                >
                                  <i class="bi bi-reply"></i> Reply
                                </button>

                                <!-- Delete Comment (if owner) -->
                                <button
                                  v-if="auth.currentUser && comment.userId === auth.currentUser.uid"
                                  class="btn btn-sm btn-link p-0 text-danger"
                                  @click="deleteComment(music.id, comment.id)"
                                  :disabled="deletingComment[comment.id]"
                                >
                                  <span
                                    v-if="deletingComment[comment.id]"
                                    class="spinner-border spinner-border-sm"
                                  ></span>
                                  <i v-else class="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                            <p class="comment-text">{{ comment.text }}</p>

                            <!-- Reply Input -->
                            <div v-if="replyingTo[comment.id]" class="reply-input mt-2">
                              <div class="d-flex gap-2">
                                <input
                                  type="text"
                                  v-model="replyText[comment.id]"
                                  class="form-control form-control-sm"
                                  placeholder="Write a reply..."
                                  @keyup.enter="postReply(music.id, comment.id)"
                                />
                                <button
                                  class="btn btn-sm btn-primary"
                                  @click="postReply(music.id, comment.id)"
                                  :disabled="!replyText[comment.id]?.trim()"
                                >
                                  <i class="bi bi-send"></i>
                                </button>
                                <button
                                  class="btn btn-sm btn-outline-secondary"
                                  @click="toggleReply(comment.id)"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            <!-- Replies -->
                            <div v-if="getReplyCount(comment) > 0" class="replies-section mt-2">
                              <button
                                class="btn btn-sm btn-link p-0 text-muted"
                                @click="toggleReplies(comment.id)"
                              >
                                <i
                                  class="bi"
                                  :class="
                                    expandedReplies[comment.id]
                                      ? 'bi-chevron-up'
                                      : 'bi-chevron-down'
                                  "
                                ></i>
                                {{ expandedReplies[comment.id] ? 'Hide' : 'View' }}
                                {{ getReplyCount(comment) }}
                                {{ getReplyCount(comment) === 1 ? 'reply' : 'replies' }}
                              </button>

                              <div v-if="expandedReplies[comment.id]" class="replies-list mt-2">
                                <div
                                  v-for="reply in getReplies(comment)"
                                  :key="reply.id"
                                  class="reply-item"
                                >
                                  <div class="reply-header">
                                    <div>
                                      <strong>{{ reply.userName }}</strong>
                                      <small class="text-muted ms-2">{{
                                        formatCommentDate(reply.createdAt)
                                      }}</small>
                                    </div>
                                    <div class="reply-actions">
                                      <!-- Delete Reply (if owner) -->
                                      <button
                                        v-if="
                                          auth.currentUser && reply.userId === auth.currentUser.uid
                                        "
                                        class="btn btn-sm btn-link p-0 text-danger"
                                        @click="deleteReply(music.id, comment.id, reply.id)"
                                      >
                                        <i class="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  </div>
                                  <p class="reply-text">{{ reply.text }}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No Music Message -->
                  <div v-else class="text-center py-5">
                    <i class="bi bi-music-note-list fs-1 text-muted mb-3"></i>
                    <p class="text-muted">
                      {{
                        musicFilter === 'all'
                          ? "This artist hasn't uploaded any music yet."
                          : `No ${musicFilter}s found.`
                      }}
                    </p>
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
                <div v-for="event in artistEvents" :key="event.id" class="col-12 col-md-6">
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
                    <p style="font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap">
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
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import EventCard from '@/components/EventCard.vue'
import NavigationBar from '@/components/NavigationBar.vue'
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
  },
  async mounted() {
    await this.loadArtistProfile()
    await this.loadArtistEvents()
    await this.checkFollowStatus()
    await this.loadUserLikedSongs()
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
  background: #f8f9fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.artist-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

/* Music Grid Styles */
.music-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.music-item-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 2px solid transparent;
}

.music-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.platform-badge-public {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
}

.platform-badge-public.spotify {
  background: #1db954;
}

.platform-badge-public.youtube {
  background: #ff0000;
}

.type-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
  margin-bottom: 0.5rem;
}

.music-item-info {
  padding-right: 40px;
  margin-top: 0.5rem;
}

.music-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.music-item-artist {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.music-item-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: #666;
}

.music-item-stats .stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.music-item-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag-small {
  background: white;
  color: #666;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e0e0e0;
}

/* Like Button - Inline with Title */
.like-btn-inline {
  background: white;
  border: 1px solid #e0e0e0;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.like-btn-inline:hover {
  background: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
}

.like-btn-inline.liked {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.like-btn-inline.liked:hover {
  background: #5568d3;
  border-color: #5568d3;
}

.like-btn-inline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.like-btn-inline i {
  font-size: 0.9rem;
}

/* Music Actions (Like & Comment buttons under embed) */
.music-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.action-btn {
  background: white;
  border: 1px solid #e0e0e0;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn.liked {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.action-btn.liked:hover {
  background: #5568d3;
  border-color: #5568d3;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.action-btn i {
  font-size: 1.1rem;
}

/* Comments Section */
.comments-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.comment-input-wrapper {
  margin-bottom: 1rem;
}

.comment-input {
  resize: vertical;
  min-height: 60px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.comment-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid #e9ecef;
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
  color: #667eea;
  font-size: 0.9rem;
}

.comment-header small {
  font-size: 0.75rem;
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
  color: #495057;
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
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #e9ecef;
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
  color: #667eea;
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
  color: #495057;
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
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0;
}

.spotify-embed-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
}

.spotify-embed-wrapper iframe {
  border-radius: 8px;
  display: block;
  margin-bottom: 0;
}

.youtube-embed-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.youtube-embed-wrapper iframe {
  border-radius: 8px;
  display: block;
}

.video-wrapper-small {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
}

/* Filter Pills */
.nav-pills .nav-link {
  color: #666;
  font-weight: 500;
  border-radius: 20px;
  padding: 8px 16px;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

  .music-grid {
    grid-template-columns: 1fr;
  }

  .nav-pills {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .nav-pills .nav-link {
    white-space: nowrap;
  }
}
</style>
