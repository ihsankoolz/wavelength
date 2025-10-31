<template>
  <div class="music-manager">
    <!-- Add Music Button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0"><i class="bi bi-music-note-list"></i> My Music Library</h4>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle"></i> Add New Music
      </button>
    </div>

    <!-- Filter Tabs -->
    <ul class="nav nav-pills mb-4">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: filterType === 'all' }"
          @click="filterType = 'all'"
        >
          All ({{ musicLinks.length }})
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: filterType === 'single' }"
          @click="filterType = 'single'"
        >
          Singles ({{ getSongsByType('single').length }})
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: filterType === 'album' }"
          @click="filterType = 'album'"
        >
          Albums ({{ getSongsByType('album').length }})
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: filterType === 'video' }"
          @click="filterType = 'video'"
        >
          Videos ({{ getSongsByType('video').length }})
        </button>
      </li>
    </ul>

    <!-- Music Grid -->
    <div v-if="filteredMusicLinks.length > 0" class="music-grid">
      <div v-for="music in displayedMusicLinks" :key="music.id" class="music-card">
        <!-- Platform Badge -->
        <div class="platform-badge" :class="music.platform">
          <i class="bi" :class="music.platform === 'spotify' ? 'bi-spotify' : 'bi-youtube'"></i>
        </div>

        <!-- Music Info -->
        <div class="music-info">
          <h5 class="music-title">{{ music.title }}</h5>
          <div class="music-meta">
            <span class="badge" :class="getTypeBadgeClass(music.type)">
              {{ music.type }}
            </span>
            <span class="text-muted ms-2">
              <i class="bi bi-calendar3"></i>
              {{ formatDate(music.addedAt) }}
            </span>
          </div>
          <div class="music-stats mt-2">
            <span class="stat-item"> <i class="bi bi-heart"></i> {{ music.likes || 0 }} </span>
            <span class="stat-item ms-3">
              <i class="bi bi-play-circle"></i> {{ music.plays || 0 }}
            </span>
          </div>

          <!-- Genres -->
          <div v-if="music.genres && music.genres.length > 0" class="music-genres mt-2">
            <span v-for="genre in music.genres.slice(0, 3)" :key="genre" class="genre-tag">
              {{ genre }}
            </span>
          </div>
        </div>

        <!-- Embedded Player -->
        <div class="embed-container mt-3">
          <!-- Spotify Embed -->
          <div v-if="music.platform === 'spotify'" class="spotify-embed-wrapper">
            <iframe
              :src="music.embedUrl"
              width="100%"
              height="152"
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

        <!-- Action Buttons -->
        <div class="music-actions mt-3">
          <button class="btn btn-sm btn-outline-primary" @click="editMusic(music)" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            @click="confirmDelete(music)"
            title="Delete"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- See More Music Button -->
    <div v-if="filteredMusicLinks.length > 6 && !showAllMusic" class="text-center mt-4">
      <button class="btn btn-outline-primary btn-lg" @click="showAllMusic = true">
        <i class="bi bi-chevron-down"></i>
        See More Music ({{ filteredMusicLinks.length - 6 }} more)
      </button>
    </div>

    <!-- Show Less Music Button -->
    <div v-if="showAllMusic && filteredMusicLinks.length > 6" class="text-center mt-4">
      <button class="btn btn-outline-secondary" @click="showAllMusic = false">
        <i class="bi bi-chevron-up"></i>
        Show Less
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredMusicLinks.length === 0" class="empty-state text-center py-5">
      <i class="bi bi-music-note-list fs-1 text-muted mb-3"></i>
      <h5 class="text-muted">
        {{ filterType === 'all' ? 'No music added yet' : `No ${filterType}s found` }}
      </h5>
      <p class="text-muted">
        {{
          filterType === 'all'
            ? 'Start building your music library by adding your first track!'
            : `Add some ${filterType}s to your library`
        }}
      </p>
      <button v-if="filterType === 'all'" class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle"></i> Add Your First Music
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi" :class="isEditMode ? 'bi-pencil' : 'bi-plus-circle'"></i>
              {{ isEditMode ? 'Edit Music' : 'Add New Music' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <!-- Error Alert -->
            <div v-if="modalError" class="alert alert-danger alert-dismissible fade show">
              <i class="bi bi-exclamation-triangle"></i>
              {{ modalError }}
              <button type="button" class="btn-close" @click="modalError = ''"></button>
            </div>

            <form @submit.prevent="saveMusic">
              <!-- Title -->
              <div class="mb-3">
                <label class="form-label fw-bold"> <i class="bi bi-music-note"></i> Title * </label>
                <input
                  type="text"
                  v-model="formData.title"
                  class="form-control"
                  placeholder="e.g., My Awesome Song"
                  required
                  maxlength="100"
                />
              </div>

              <!-- Type -->
              <div class="mb-3">
                <label class="form-label fw-bold"> <i class="bi bi-tags"></i> Type * </label>
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
                    <label class="btn btn-outline-primary" for="type-single">
                      <i class="bi bi-music-note"></i> Single
                    </label>

                    <input
                      type="radio"
                      class="btn-check"
                      id="type-album"
                      v-model="formData.type"
                      value="album"
                    />
                    <label class="btn btn-outline-primary" for="type-album">
                      <i class="bi bi-disc"></i> Album
                    </label>
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
                    <label class="btn btn-outline-primary" for="type-video">
                      <i class="bi bi-camera-video"></i> Video
                    </label>
                  </template>
                </div>
                <small class="text-muted d-block mt-1">
                  {{
                    formData.platform === 'spotify'
                      ? 'Spotify supports singles and albums only'
                      : 'YouTube supports videos only'
                  }}
                </small>
              </div>

              <!-- Platform -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-broadcast"></i> Platform *
                </label>
                <div class="btn-group w-100" role="group">
                  <input
                    type="radio"
                    class="btn-check"
                    id="platform-spotify"
                    v-model="formData.platform"
                    value="spotify"
                  />
                  <label class="btn btn-outline-success" for="platform-spotify">
                    <i class="bi bi-spotify"></i> Spotify
                  </label>

                  <input
                    type="radio"
                    class="btn-check"
                    id="platform-youtube"
                    v-model="formData.platform"
                    value="youtube"
                  />
                  <label class="btn btn-outline-danger" for="platform-youtube">
                    <i class="bi bi-youtube"></i> YouTube
                  </label>
                </div>
              </div>

              <!-- URL -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-link-45deg"></i>
                  {{ formData.platform === 'spotify' ? 'Spotify' : 'YouTube' }} URL *
                </label>
                <input
                  type="url"
                  v-model="formData.url"
                  class="form-control"
                  :placeholder="getUrlPlaceholder()"
                  required
                />
                <div class="form-text">
                  <small>
                    <i class="bi bi-info-circle"></i>
                    {{ getUrlHelp() }}
                  </small>
                </div>
              </div>

              <!-- Genres -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  <i class="bi bi-music-note-list"></i> Genres (Optional)
                </label>
                <div class="genres-grid">
                  <div
                    v-for="genre in availableGenres"
                    :key="genre"
                    class="genre-chip"
                    :class="{ selected: formData.genres.includes(genre) }"
                    @click="toggleGenre(genre)"
                  >
                    {{ genre }}
                  </div>
                </div>
                <small class="text-muted">{{ formData.genres.length }}/5 genres selected</small>
              </div>

              <!-- Submit Buttons -->
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i
                    v-else
                    class="bi"
                    :class="isEditMode ? 'bi-check-circle' : 'bi-plus-circle'"
                  ></i>
                  {{ loading ? 'Saving...' : isEditMode ? 'Update Music' : 'Add Music' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="closeModal">
                  Cancel
                </button>
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
        'Pop',
        'Rock',
        'Hip Hop',
        'R&B',
        'Electronic',
        'Jazz',
        'Classical',
        'Country',
        'Indie',
        'Folk',
        'Metal',
        'Punk',
        'Reggae',
        'Blues',
        'Alternative',
        'K-Pop',
        'Mandopop',
        'Cantopop',
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
  padding: 1rem 0;
}

/* Filter Tabs */
.nav-pills .nav-link {
  color: #666;
  font-weight: 500;
  border-radius: 20px;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Music Grid */
.music-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.music-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.music-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.platform-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.platform-badge.spotify {
  background: #1db954;
}

.platform-badge.youtube {
  background: #ff0000;
}

.music-info {
  padding-right: 50px;
}

.music-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.music-meta {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.music-stats {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.music-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.music-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.music-actions .btn {
  flex: 1;
}

/* Embed Containers */
.embed-container {
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
}

.spotify-embed-wrapper iframe {
  border-radius: 12px;
}

.youtube-embed-wrapper {
  position: relative;
  width: 100%;
}

.youtube-embed-wrapper iframe {
  border-radius: 12px;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 12px;
  padding: 3rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 1;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
}

.modal-content {
  border-radius: 16px;
  border: none;
  background: white;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  border-bottom: 2px solid #f0f0f0;
  padding: 1.5rem;
  background: white;
  flex-shrink: 0;
}

.modal-body {
  padding: 1.5rem;
  background: white;
  overflow-y: auto;
  flex: 1 1 auto;
}

.modal-footer {
  background: white; /* FIX: Ensure footer has background */
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
}

/* Genre Selection in Modal */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.genre-chip {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.genre-chip:hover {
  background: #e9ecef;
}

.genre-chip.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

/* Button Groups */
.btn-group .btn-check:checked + .btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .music-grid {
    grid-template-columns: 1fr;
  }

  .modal-dialog {
    width: 95%;
  }
}

/* Tablet responsive - 2 columns for medium screens */
@media (min-width: 769px) and (max-width: 1024px) {
  .music-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
