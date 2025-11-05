<template>
  <div class="music-manager">
    <div class="music-library-section">
      <!-- Music Grid Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="music-library-title">MUSIC LIBRARY</h2>
        <button class="btn-add-music" @click="openAddModal">+ ADD MUSIC</button>
      </div>

      <!-- Filter Tabs -->
      <div v-if="musicLinks.length > 0" class="filter-tabs mb-4">
        <button
          class="filter-tab"
          :class="{ active: filterType === 'all' }"
          @click="filterType = 'all'"
        >
          ALL ({{ musicLinks.length }})
        </button>
        <button
          class="filter-tab"
          :class="{ active: filterType === 'single' }"
          @click="filterType = 'single'"
        >
          SINGLES ({{ getSongsByType('single').length }})
        </button>
        <button
          class="filter-tab"
          :class="{ active: filterType === 'album' }"
          @click="filterType = 'album'"
        >
          ALBUMS ({{ getSongsByType('album').length }})
        </button>
        <button
          class="filter-tab"
          :class="{ active: filterType === 'video' }"
          @click="filterType = 'video'"
        >
          VIDEOS ({{ getSongsByType('video').length }})
        </button>
      </div>
    </div>

    <!-- Music Grid -->
    <div v-if="filteredMusicLinks.length > 0" class="song-carousel">
      <div v-for="music in displayedMusicLinks" :key="music.id" class="song-card">
        <!-- Song Header - Just Title and Platform/Type Badges -->
        <div class="song-header">
          <div class="song-info">
            <h6 class="song-title">{{ music.title }}</h6>
          </div>

          <!-- Platform and Type Badges -->
          <div class="badges-container">
            <!-- Music Type Badge -->
            <span v-if="music.type" class="type-badge" :class="getTypeBadgeClass(music.type)">
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
            style="
              height: 232px !important;
              min-height: 232px !important;
              max-height: 232px !important;
            "
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
            style="
              height: 232px !important;
              min-height: 232px !important;
              max-height: 232px !important;
            "
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
            style="
              height: 232px !important;
              min-height: 232px !important;
              max-height: 232px !important;
            "
          ></iframe>
        </div>

        <!-- Bottom Row: Genre Tags Left, Action Buttons Right -->
        <div class="song-bottom">
          <!-- Genre Tags -->
          <div v-if="music.genres && music.genres.length > 0" class="genres-container">
            <span v-for="genre in music.genres.slice(0, 2)" :key="genre" class="genre-tag">
              {{ genre }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="song-actions">
            <button class="btn-action-edit" @click="editMusic(music)" title="Edit">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn-action-delete" @click="confirmDelete(music)" title="Delete">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- See More Music Button -->
    <div v-if="filteredMusicLinks.length > 6 && !showAllMusic" class="text-center mt-4">
      <button class="btn-see-more" @click="showAllMusic = true">
        <i class="bi bi-chevron-down"></i>
        See More Music ({{ filteredMusicLinks.length - 6 }} more)
      </button>
    </div>

    <!-- Show Less Music Button -->
    <div v-if="showAllMusic && filteredMusicLinks.length > 6" class="text-center mt-4">
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
      <p class="text-white">No {{ filterType }}s found.</p>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditMode ? 'EDIT MUSIC' : 'ADD NEW MUSIC' }}
            </h5>
            <button type="button" class="btn-close-modal" @click="closeModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body">
            <!-- Error Alert -->
            <div v-if="modalError" class="modal-alert">
              <i class="bi bi-exclamation-triangle"></i>
              {{ modalError }}
              <button type="button" class="btn-close-alert" @click="modalError = ''">
                <i class="bi bi-x"></i>
              </button>
            </div>

            <form @submit.prevent="saveMusic">
              <!-- Title -->
              <div class="modal-field">
                <label class="modal-label">TITLE *</label>
                <input
                  type="text"
                  v-model="formData.title"
                  class="modal-input"
                  placeholder="e.g., My Awesome Song"
                  required
                  maxlength="100"
                />
              </div>

              <!-- Type -->
              <div class="modal-field">
                <label class="modal-label">TYPE *</label>
                <div class="btn-group w-100" role="group">
                  <!-- Show Single/Album only for Spotify -->
                  <template v-if="formData.platform === 'spotify'">
                    <input
                      type="radio"
                      class="btn-check"
                      id="type-single"
                      v-model="formData.type"
                      value="single"
                    />
                    <label class="btn btn-outline-modal" for="type-single"> SINGLE </label>

                    <input
                      type="radio"
                      class="btn-check"
                      id="type-album"
                      v-model="formData.type"
                      value="album"
                    />
                    <label class="btn btn-outline-modal" for="type-album"> ALBUM </label>
                  </template>

                  <!-- Show Video only for YouTube -->
                  <template v-else>
                    <input
                      type="radio"
                      class="btn-check"
                      id="type-video"
                      v-model="formData.type"
                      value="video"
                      checked
                    />
                    <label class="btn btn-outline-modal" for="type-video"> VIDEO </label>
                  </template>
                </div>
              </div>

              <!-- Platform -->
              <div class="modal-field">
                <label class="modal-label">PLATFORM *</label>
                <div class="btn-group w-100" role="group">
                  <input
                    type="radio"
                    class="btn-check"
                    id="platform-spotify"
                    v-model="formData.platform"
                    value="spotify"
                  />
                  <label class="btn btn-outline-modal" for="platform-spotify"> SPOTIFY </label>

                  <input
                    type="radio"
                    class="btn-check"
                    id="platform-youtube"
                    v-model="formData.platform"
                    value="youtube"
                  />
                  <label class="btn btn-outline-modal" for="platform-youtube"> YOUTUBE </label>
                </div>
              </div>

              <!-- URL -->
              <div class="modal-field">
                <label class="modal-label">
                  {{ formData.platform === 'spotify' ? 'SPOTIFY' : 'YOUTUBE' }} URL *
                </label>
                <input
                  type="url"
                  v-model="formData.url"
                  class="modal-input"
                  :placeholder="getUrlPlaceholder()"
                  required
                />
              </div>

              <!-- Genres -->
              <div class="modal-field">
                <label class="modal-label">GENRES (OPTIONAL)</label>
                <div class="genres-grid">
                  <div
                    v-for="genre in availableGenres"
                    :key="genre"
                    class="genre-chip-modal"
                    :class="{ selected: formData.genres.includes(genre) }"
                    @click="toggleGenre(genre)"
                  >
                    {{ genre.toUpperCase() }}
                  </div>
                </div>
                <small class="genre-count">{{ formData.genres.length }}/5 genres selected</small>
              </div>

              <!-- Submit Buttons -->
              <div class="modal-actions">
                <button type="submit" class="btn-modal-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'SAVING...' : isEditMode ? 'UPDATE MUSIC' : 'ADD MUSIC' }}
                </button>
                <button type="button" class="btn-modal-cancel" @click="closeModal">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title"><i class="bi bi-exclamation-triangle"></i> Confirm Delete</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="showDeleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-2">Are you sure you want to delete this music?</p>
            <p class="fw-bold mb-0">{{ musicToDelete?.title }}</p>
            <p class="text-muted small">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
            <button class="btn btn-danger" @click="deleteMusic" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-trash"></i>
              {{ loading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import {
  createMusicLink,
  validateSpotifyUrl,
  validateYouTubeUrl,
  detectPlatform,
} from '@/utils/musicHelpers'
import { notifyFollowersNewMusic } from '@/utils/notifications'

export default {
  name: 'MusicManager',
  props: {
    artistId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      musicLinks: [],
      filterType: 'all',
      showModal: false,
      showDeleteModal: false,
      isEditMode: false,
      loading: false,
      modalError: '',
      newMusicAdded: null, // Track new music for notifications
      artistName: '',
      artistProfileImage: '',
      formData: {
        title: '',
        type: 'single',
        platform: 'spotify',
        url: '',
        genres: [],
      },
      currentEditingId: null,
      musicToDelete: null,
      showAllMusic: false, // Track if showing all music or just first 6
      availableGenres: [
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
    }
  },
  computed: {
    filteredMusicLinks() {
      if (this.filterType === 'all') {
        return this.musicLinks
      }
      return this.musicLinks.filter((music) => music.type === this.filterType)
    },
    displayedMusicLinks() {
      // Show first 6 items (3x2 grid) unless "See More" is clicked
      if (this.showAllMusic) {
        return this.filteredMusicLinks
      }
      return this.filteredMusicLinks.slice(0, 6)
    },
  },
  watch: {
    // Reset "Show All" when filter changes
    filterType() {
      this.showAllMusic = false
    },
    // Auto-adjust type when platform changes
    'formData.platform'(newPlatform) {
      if (newPlatform === 'spotify') {
        // Switch to single if current type is video
        if (this.formData.type === 'video') {
          this.formData.type = 'single'
        }
      } else if (newPlatform === 'youtube') {
        // Switch to video for YouTube
        this.formData.type = 'video'
      }
    },
  },
  async mounted() {
    await this.loadMusicLinks()
  },
  methods: {
    async loadMusicLinks() {
      try {
        const artistDoc = await getDoc(doc(db, 'artists', this.artistId))
        if (artistDoc.exists()) {
          const data = artistDoc.data()
          this.musicLinks = data.musicLinks || []
          this.artistName = data.artistName || ''
          this.artistProfileImage = data.profileImage || ''

          // Sort by newest first
          this.musicLinks.sort((a, b) => {
            const dateA = a.addedAt?.toDate ? a.addedAt.toDate() : new Date(a.addedAt)
            const dateB = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(b.addedAt)
            return dateB - dateA
          })
        }
      } catch (error) {
        console.error('Error loading music links:', error)
      }
    },

    getSongsByType(type) {
      return this.musicLinks.filter((music) => music.type === type)
    },

    openAddModal() {
      this.isEditMode = false
      this.currentEditingId = null
      this.formData = {
        title: '',
        type: 'single',
        platform: 'spotify',
        url: '',
        genres: [],
      }
      this.modalError = ''
      this.showModal = true
    },

    editMusic(music) {
      this.isEditMode = true
      this.currentEditingId = music.id
      this.formData = {
        title: music.title,
        type: music.type,
        platform: music.platform,
        url: music.url,
        genres: [...music.genres], // Create copy
      }
      this.modalError = ''
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.modalError = ''
    },

    confirmDelete(music) {
      this.musicToDelete = music
      this.showDeleteModal = true
    },

    async saveMusic() {
      try {
        this.loading = true
        this.modalError = ''

        // Validate URL
        if (this.formData.platform === 'spotify' && !validateSpotifyUrl(this.formData.url)) {
          this.modalError = 'Please enter a valid Spotify track or album URL'
          this.loading = false
          return
        }

        if (this.formData.platform === 'youtube' && !validateYouTubeUrl(this.formData.url)) {
          this.modalError = 'Please enter a valid YouTube video URL'
          this.loading = false
          return
        }

        // Check for duplicate URLs (except when editing the same music)
        const duplicateUrl = this.musicLinks.find(
          (m) => m.url === this.formData.url && m.id !== this.currentEditingId,
        )
        if (duplicateUrl) {
          this.modalError = 'This URL is already in your library'
          this.loading = false
          return
        }

        let updatedMusicLinks

        if (this.isEditMode) {
          // Update existing music
          updatedMusicLinks = this.musicLinks.map((music) => {
            if (music.id === this.currentEditingId) {
              return createMusicLink({
                ...this.formData,
                // Preserve existing stats
                likes: music.likes || 0,
                plays: music.plays || 0,
                // Update addedAt to current time
                addedAt: music.addedAt,
              })
            }
            return music
          })
        } else {
          // Add new music
          if (this.musicLinks.length >= 100) {
            this.modalError = 'Maximum 100 music items allowed'
            this.loading = false
            return
          }

          const newMusic = createMusicLink(this.formData)
          updatedMusicLinks = [newMusic, ...this.musicLinks]

          // Store new music for notification (send after Firestore update)
          this.newMusicAdded = newMusic
        }

        // Update Firestore
        await updateDoc(doc(db, 'artists', this.artistId), {
          musicLinks: updatedMusicLinks,
        })

        // Update local state
        this.musicLinks = updatedMusicLinks

        // Send notification to followers if new music was added (not edited)
        if (!this.isEditMode && this.newMusicAdded) {
          // Get artist name from data
          const artistDoc = await getDoc(doc(db, 'artists', this.artistId))
          if (artistDoc.exists()) {
            const artistName = artistDoc.data().artistName
            notifyFollowersNewMusic(this.artistId, artistName, this.newMusicAdded)
          }
          this.newMusicAdded = null
        }

        this.closeModal()

        // Emit success event
        this.$emit('music-updated')
      } catch (error) {
        console.error('Error saving music:', error)
        this.modalError = 'Failed to save music. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async deleteMusic() {
      try {
        this.loading = true

        // Remove from array
        const updatedMusicLinks = this.musicLinks.filter(
          (music) => music.id !== this.musicToDelete.id,
        )

        // Update Firestore
        await updateDoc(doc(db, 'artists', this.artistId), {
          musicLinks: updatedMusicLinks,
        })

        // Update local state
        this.musicLinks = updatedMusicLinks
        this.showDeleteModal = false
        this.musicToDelete = null

        // Emit success event
        this.$emit('music-updated')
      } catch (error) {
        console.error('Error deleting music:', error)
        alert('Failed to delete music. Please try again.')
      } finally {
        this.loading = false
      }
    },

    toggleGenre(genre) {
      const index = this.formData.genres.indexOf(genre)
      if (index > -1) {
        this.formData.genres.splice(index, 1)
      } else {
        if (this.formData.genres.length < 5) {
          this.formData.genres.push(genre)
        }
      }
    },

    getUrlPlaceholder() {
      if (this.formData.platform === 'spotify') {
        return 'https://open.spotify.com/track/...'
      }
      return 'https://www.youtube.com/watch?v=...'
    },

    getUrlHelp() {
      if (this.formData.platform === 'spotify') {
        return 'Paste a Spotify track or album link'
      }
      return 'Paste a YouTube video link'
    },

    getTypeBadgeClass(type) {
      const classes = {
        single: 'bg-primary',
        album: 'bg-success',
        video: 'bg-danger',
      }
      return classes[type] || 'bg-secondary'
    },

    capitalizeType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1)
    },

    formatDate(timestamp) {
      if (!timestamp) return 'Unknown'
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
  },
}
</script>

<style scoped>
.music-manager {
  padding: 0;
}

/* Music Library Section */
.music-library-section {
  margin-bottom: 40px;
}

.music-library-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-add-music {
  background: #bb1814;
  color: white;
  border: none;
  border-radius: 22px;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-music:hover {
  background: #9d1310;
  transform: translateY(-2px);
}

/* Filter Tabs */
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

/* Song Carousel */
.song-carousel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  overflow-y: visible;
}

/* Song Card Styles */
.song-card {
  background: rgba(35, 35, 38, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
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

.music-item-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.genre-tag-small {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  padding: 0;
  border-radius: 0;
  font-size: 0.85rem;
  font-weight: normal;
  margin-right: 0;
  text-transform: none;
}

/* Embed Containers */
.embed-container {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0;
  height: 232px !important;
  min-height: 232px !important;
  max-height: 232px !important;
  position: relative;
  /* Force container to exact size */
  box-sizing: border-box;
}

.spotify-embed-wrapper,
.youtube-embed-wrapper {
  width: 100% !important;
  height: 232px !important;
  min-height: 232px !important;
  max-height: 232px !important;
  border-radius: 8px;
  overflow: hidden !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  /* Clip any overflow */
  clip-path: inset(0 0 0 0);
}

.spotify-embed-wrapper iframe,
.youtube-embed-wrapper iframe {
  width: 100% !important;
  height: 232px !important;
  min-height: 232px !important;
  max-height: 232px !important;
  border-radius: 8px;
  display: block !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
  /* Force exact dimensions - no scaling */
  box-sizing: border-box !important;
  /* Clip overflow for albums */
  overflow: hidden !important;
}

/* Additional enforcement for Spotify albums */
.spotify-embed-wrapper {
  /* Absolutely position and clip */
  position: absolute !important;
  overflow: hidden !important;
}

.spotify-embed-wrapper.is-album {
  /* Extra clipping for albums that try to be taller */
  clip: rect(0px, 100%, 232px, 0px) !important;
  -webkit-clip-path: inset(0) !important;
  clip-path: inset(0 0 0 0) !important;
}

.spotify-embed-wrapper iframe {
  /* Prevent Spotify from overriding dimensions */
  transform: scale(1) !important;
  /* Ensure no internal scaling */
  object-fit: fill !important;
  /* Force exact height - override any Spotify defaults */
  height: 232px !important;
  min-height: 232px !important;
  max-height: 232px !important;
}

/* Music Actions */
.music-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-action-edit,
.btn-action-delete {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 16px;
}

.btn-action-edit:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #bb1814;
  transform: translateY(-1px);
}

.btn-action-delete:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #dc3545;
  transform: translateY(-1px);
}

/* See More/Less Buttons */
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  margin: 1.75rem auto;
  margin-top: 140px;
}

.modal-content {
  border-radius: 20px;
  border: 2px solid rgba(187, 24, 20, 0.3);
  background: rgba(25, 23, 23, 0.95);
  backdrop-filter: blur(20px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(187, 24, 20, 0.2);
}

.modal-header {
  border-bottom: 1px solid rgba(187, 24, 20, 0.2);
  padding: 1.5rem;
  background: rgba(35, 35, 38, 0.8);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px 20px 0 0;
}

.modal-title {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.btn-close-modal {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-close-modal:hover {
  background: rgba(187, 24, 20, 0.2);
  color: #bb1814;
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
  background: rgba(25, 23, 23, 0.95);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  flex: 1 1 auto;
}

.modal-alert {
  background: rgba(187, 24, 20, 0.2);
  border: 1px solid rgba(187, 24, 20, 0.5);
  color: #ff9999;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  backdrop-filter: blur(10px);
}

.btn-close-alert {
  background: transparent;
  border: none;
  color: #ff9999;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-close-alert:hover {
  color: #bb1814;
  transform: scale(1.1);
}

.modal-field {
  margin-bottom: 1.5rem;
}

.modal-label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.modal-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(35, 35, 38, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.modal-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.modal-input:focus {
  outline: none;
  border-color: #bb1814;
  box-shadow: 0 0 0 3px rgba(187, 24, 20, 0.2);
  background: rgba(35, 35, 38, 0.9);
}

/* Button Groups - Dark Theme Style */
.btn-group {
  display: flex;
  gap: 0;
  width: 100%;
}

.btn-check {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
}

.btn-outline-modal {
  flex: 1;
  padding: 8px 20px;
  background: rgba(35, 35, 38, 0.6);
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(187, 24, 20, 0.4);
  border-radius: 0;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  backdrop-filter: blur(10px);
}

/* First button - left side rounded */
.btn-group .btn-outline-modal:first-of-type {
  border-top-left-radius: 20px !important;
  border-bottom-left-radius: 20px !important;
  border-right: none;
}

/* Last button - right side rounded */
.btn-group .btn-outline-modal:last-of-type {
  border-top-right-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}

/* Middle buttons - no left border, no right border */
.btn-group .btn-outline-modal:not(:first-of-type):not(:last-of-type) {
  border-left: none;
  border-right: none;
}

/* All buttons except first - no left border */
.btn-group .btn-outline-modal:not(:first-of-type) {
  border-left: none;
}

.btn-outline-modal:hover {
  background: rgba(187, 24, 20, 0.2);
  color: white;
  border-color: #bb1814;
  transform: translateY(-1px);
}

.btn-check:checked + .btn-outline-modal {
  background: linear-gradient(135deg, #bb1814, #9d1310);
  color: white;
  border-color: #bb1814;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(187, 24, 20, 0.3);
}

.btn-check:checked + .btn-outline-modal:hover {
  background: linear-gradient(135deg, #9d1310, #7a0f0d);
  border-color: #9d1310;
}

/* Optimize button transitions for better performance */
.btn-check:checked + .btn-outline-modal {
  will-change: background-color, border-color, color;
}

/* Ensure checked button has proper borders */
.btn-check:checked + .btn-outline-modal:not(:first-child) {
  border-left: 2px solid #bb1814;
}

.btn-check:checked + .btn-outline-modal:not(:last-child) {
  border-right: 2px solid #bb1814;
}

/* Genre Selection in Modal */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.genre-chip-modal {
  padding: 8px 12px;
  background: transparent;
  border: 2px solid #bb1814;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
  font-size: 0.75rem;
  font-weight: 600;
  color: #bb1814;
  text-transform: uppercase;
  will-change: background-color, border-color, color;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.genre-chip-modal:hover {
  background: rgba(187, 24, 20, 0.3);
  border-color: #bb1814;
}

.genre-chip-modal.selected {
  background: #bb1814;
  color: white;
  border-color: #bb1814;
}

.genre-count {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-modal-primary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #bb1814, #9d1310);
  color: white;
  border: none;
  border-radius: 22px;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 0;
  box-shadow: 0 4px 15px rgba(187, 24, 20, 0.3);
}

.btn-modal-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #9d1310, #7a0f0d);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(187, 24, 20, 0.4);
}

.btn-modal-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-modal-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: rgba(35, 35, 38, 0.6);
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(187, 24, 20, 0.4);
  border-radius: 22px;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 0;
  backdrop-filter: blur(10px);
}

.btn-modal-cancel:hover {
  background: rgba(187, 24, 20, 0.2);
  border-color: #bb1814;
  color: white;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .song-carousel {
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

  .music-library-title {
    font-size: 1.5rem;
  }
}

/* Tablet responsive - 2 columns for medium screens */
@media (min-width: 769px) and (max-width: 1024px) {
  .song-carousel {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
