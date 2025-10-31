<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-dialog modal-dialog-centered modal-lg" @click.stop>
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-calendar-event"></i>
                {{ isEditMode ? 'Edit Event' : 'Create New Event' }}
              </h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
              <!-- Success Alert -->
              <div
                v-if="successMessage"
                class="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                <i class="bi bi-check-circle-fill me-2"></i>
                {{ successMessage }}
                <button type="button" class="btn-close" @click="successMessage = ''"></button>
              </div>

              <!-- Error Alert -->
              <div
                v-if="errorMessage"
                class="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="errorMessage = ''"></button>
              </div>

              <form @submit.prevent="saveEvent">
                <!-- Event Title -->
                <div class="mb-3">
                  <label for="title" class="form-label fw-bold">
                    <i class="bi bi-music-note-beamed text-primary"></i> Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    v-model="formData.title"
                    class="form-control"
                    placeholder="e.g., Summer Jazz Night"
                    required
                    maxlength="100"
                  />
                  <div class="form-text">Make it catchy and descriptive</div>
                </div>

                <!-- Event Date -->
                <div class="mb-3">
                  <label for="date" class="form-label fw-bold">
                    <i class="bi bi-calendar3 text-primary"></i> Event Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    v-model="formData.date"
                    :min="minDate"
                    class="form-control"
                    required
                  />
                </div>

                <!-- Genres (Multiple Selection) -->
                <div class="mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-stars text-primary"></i> Music Genres
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
                  <div class="form-text">Select genres that describe your event (max 3)</div>
                  <div v-if="errors.genres" class="text-danger small mt-1">{{ errors.genres }}</div>
                </div>

                <!-- Venue Name -->
                <div class="mb-3">
                  <label for="venue" class="form-label fw-bold">
                    <i class="bi bi-building text-primary"></i> Venue Name *
                  </label>
                  <input
                    type="text"
                    id="venue"
                    v-model="formData.venue"
                    class="form-control"
                    placeholder="e.g., Esplanade Concert Hall"
                    required
                  />
                </div>

                <!-- Location (Address) -->
                <div class="mb-3">
                  <label for="location" class="form-label fw-bold">
                    <i class="bi bi-geo-alt text-primary"></i> Location / Address *
                  </label>
                  <input
                    type="text"
                    id="location"
                    v-model="formData.location"
                    class="form-control"
                    placeholder="e.g., 1 Esplanade Drive, Singapore 038981"
                    required
                  />
                  <div class="form-text">Include full address for better discoverability</div>
                </div>

                <!-- Description -->
                <div class="mb-3">
                  <label for="description" class="form-label fw-bold">
                    <i class="bi bi-card-text text-primary"></i> Event Description
                  </label>
                  <textarea
                    id="description"
                    v-model="formData.description"
                    class="form-control"
                    rows="3"
                    placeholder="Tell fans what makes this event special..."
                    maxlength="500"
                  ></textarea>
                  <div class="form-text">{{ formData.description.length }}/500 characters</div>
                </div>

                <!-- Submit Buttons -->
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-plus-circle me-2"></i>
                    {{ loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event' }}
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
    </Transition>
  </Teleport>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { notifyFollowersNewEvent } from '@/utils/notifications'

export default {
  name: 'EventModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    event: {
      type: Object,
      default: null,
    },
    artistId: {
      type: String,
      required: true,
    },
    artistName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        title: '',
        date: '',
        genres: [],
        venue: '',
        location: '',
        description: '',
      },
      loading: false,
      successMessage: '',
      errorMessage: '',
      errors: {},
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
    minDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    },
    isEditMode() {
      return !!this.event
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        if (this.event) {
          // Edit mode - populate form with event data
          this.formData = {
            title: this.event.title || '',
            date: this.formatDateForInput(this.event.date),
            genres: this.event.genres || [],
            venue: this.event.venue || '',
            location: this.event.location || '',
            description: this.event.description || '',
          }
        } else {
          // Create mode - reset form
          this.resetForm()
        }
        this.successMessage = ''
        this.errorMessage = ''
        this.errors = {}
      }
    },
  },
  methods: {
    formatDateForInput(date) {
      if (!date) return ''
      const d = date.toDate ? date.toDate() : new Date(date)
      return d.toISOString().split('T')[0]
    },

    toggleGenre(genre) {
      const index = this.formData.genres.indexOf(genre)
      if (index > -1) {
        this.formData.genres.splice(index, 1)
      } else {
        if (this.formData.genres.length >= 3) {
          this.errors.genres = 'Maximum 3 genres allowed'
          setTimeout(() => {
            this.errors.genres = ''
          }, 3000)
          return
        }
        this.formData.genres.push(genre)
      }
    },

    async saveEvent() {
      try {
        this.loading = true
        this.errorMessage = ''
        this.errors = {}

        // Validation
        if (this.formData.genres.length === 0) {
          this.errors.genres = 'Please select at least one genre'
          this.loading = false
          return
        }

        const eventData = {
          title: this.formData.title.trim(),
          date: Timestamp.fromDate(new Date(this.formData.date)),
          genres: this.formData.genres,
          venue: this.formData.venue.trim(),
          location: this.formData.location.trim(),
          description: this.formData.description.trim(),
          artistId: this.artistId,
          artistName: this.artistName,
          updatedAt: Timestamp.now(),
        }

        if (this.isEditMode) {
          // Update existing event
          await updateDoc(doc(db, 'events', this.event.id), eventData)
          this.successMessage = 'Event updated successfully!'
        } else {
          // Create new event
          eventData.createdAt = Timestamp.now()
          const docRef = await addDoc(collection(db, 'events'), eventData)

          // Notify followers about new event
          await notifyFollowersNewEvent(this.artistId, this.artistName, {
            id: docRef.id,
            ...eventData,
          })

          this.successMessage = 'Event created successfully!'
        }

        // Emit success event
        this.$emit('event-saved')

        // Close modal after short delay
        setTimeout(() => {
          this.closeModal()
        }, 1500)
      } catch (error) {
        console.error('Error saving event:', error)
        this.errorMessage = 'Failed to save event. Please try again.'
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.formData = {
        title: '',
        date: '',
        genres: [],
        venue: '',
        location: '',
        description: '',
      }
      this.errors = {}
    },

    closeModal() {
      this.resetForm()
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-dialog {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.modal-body {
  padding: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 1;
}

/* Genres Grid */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.genre-chip {
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  font-weight: 500;
}

.genre-chip:hover {
  background: #f8f9fa;
  border-color: #667eea;
}

.genre-chip.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

/* Form Styles */
.form-label {
  margin-bottom: 0.5rem;
  color: #333;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 0.75rem;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
  padding: 0.75rem;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 576px) {
  .modal-content {
    border-radius: 0;
    max-height: 100vh;
  }

  .genres-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>
