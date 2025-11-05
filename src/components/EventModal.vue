<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-dialog modal-dialog-centered modal-lg" @click.stop>
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditMode ? 'EDIT EVENT' : 'CREATE NEW EVENT' }}
              </h5>
              <button type="button" class="btn-close-modal" @click="closeModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
              <!-- Success Alert -->
              <div v-if="successMessage" class="modal-alert modal-alert-success">
                <i class="bi bi-check-circle-fill"></i>
                {{ successMessage }}
                <button type="button" class="btn-close-alert" @click="successMessage = ''">
                  <i class="bi bi-x"></i>
                </button>
              </div>

              <!-- Error Alert -->
              <div v-if="errorMessage" class="modal-alert">
                <i class="bi bi-exclamation-triangle-fill"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close-alert" @click="errorMessage = ''">
                  <i class="bi bi-x"></i>
                </button>
              </div>

              <form @submit.prevent="saveEvent">
                <!-- Event Title -->
                <div class="modal-field">
                  <label for="title" class="modal-label">EVENT TITLE *</label>
                  <input
                    type="text"
                    id="title"
                    v-model="formData.title"
                    class="modal-input"
                    placeholder="e.g., Summer Jazz Night"
                    required
                    maxlength="100"
                  />
                </div>

                <!-- Event Date -->
                <div class="modal-field">
                  <label for="date" class="modal-label">EVENT DATE *</label>
                  <input
                    type="date"
                    id="date"
                    v-model="formData.date"
                    :min="minDate"
                    class="modal-input"
                    required
                  />
                </div>

                <!-- Genres (Multiple Selection) -->
                <div class="modal-field">
                  <label class="modal-label">MUSIC GENRES</label>
                  <div class="genres-grid">
                    <div
                      v-for="genre in availableGenres"
                      :key="genre"
                      class="genre-chip-modal"
                      :class="{ selected: formData.genres.includes(genre) }"
                      @click="toggleGenre(genre)"
                    >
                      {{ genre }}
                    </div>
                  </div>
                  <small class="genre-count">Select genres that describe your event (max 3)</small>
                  <div v-if="errors.genres" class="error-text">{{ errors.genres }}</div>
                </div>

                <!-- Venue Name -->
                <div class="modal-field">
                  <label for="venue" class="modal-label">VENUE NAME *</label>
                  <input
                    type="text"
                    id="venue"
                    v-model="formData.venue"
                    class="modal-input"
                    placeholder="e.g., Esplanade Concert Hall"
                    required
                  />
                </div>

                <!-- Location (Address) -->
                <div class="modal-field">
                  <label for="location" class="modal-label">LOCATION / ADDRESS *</label>
                  <input
                    type="text"
                    id="location"
                    v-model="formData.location"
                    class="modal-input"
                    placeholder="e.g., 1 Esplanade Drive, Singapore 038981"
                    required
                  />
                </div>

                <!-- Description -->
                <div class="modal-field">
                  <label for="description" class="modal-label">EVENT DESCRIPTION</label>
                  <textarea
                    id="description"
                    v-model="formData.description"
                    class="modal-input"
                    rows="3"
                    placeholder="Tell fans what makes this event special..."
                    maxlength="500"
                  ></textarea>
                  <small class="genre-count">{{ formData.description.length }}/500 characters</small>
                </div>

                <div class="modal-field">
                  <label for="ticket" class="modal-label">TICKETING LINK</label>
                  <input
                    type="text"
                    id="ticket"
                    v-model="formData.ticket"
                    class="modal-input"
                    placeholder="e.g., https://ticketmaster.sg/activity/detail/25sg_blackpink"
                    required
                  />
                </div>

                <!-- Submit Buttons -->
                <div class="modal-actions">
                  <button type="submit" class="btn-modal-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'SAVING...' : isEditMode ? 'UPDATE EVENT' : 'CREATE EVENT' }}
                  </button>
                  <button type="button" class="btn-modal-cancel" @click="closeModal">
                    CANCEL
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
        ticket: '',
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
            ticket: this.event.ticket || '',
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
          ticket: this.formData.ticket,
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
        ticket: '',
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
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-dialog {
  width: 100%;
  max-width: 600px;
  margin: auto;
  max-height: 90vh;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 16px;
  border: none;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transform: translateZ(0);
  will-change: transform;
}

.modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  background: #1a1a1a;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: white;
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
  background: rgba(255, 255, 255, 0.1);
  color: #bb1814;
}

.modal-body {
  padding: 1.5rem;
  background: #1a1a1a;
  overflow-y: auto;
  flex: 1 1 auto;
}

.modal-alert {
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid rgba(220, 53, 69, 0.5);
  color: #ff6b6b;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.modal-alert-success {
  background: rgba(25, 135, 84, 0.2);
  border: 1px solid rgba(25, 135, 84, 0.5);
  color: #75b798;
}

.btn-close-alert {
  background: transparent;
  border: none;
  color: #ff6b6b;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-alert-success .btn-close-alert {
  color: #75b798;
}

.modal-field {
  margin-bottom: 1.5rem;
}

.modal-label {
  display: block;
  color: white;
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
  box-sizing: border-box;
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

.modal-input textarea {
  resize: vertical;
  font-family: inherit;
}

/* Date Input Calendar Button - Red */
input[type="date"].modal-input::-webkit-calendar-picker-indicator {
  filter: invert(27%) sepia(95%) saturate(2878%) hue-rotate(346deg) brightness(90%) contrast(97%);
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.3s ease;
}

input[type="date"].modal-input::-webkit-calendar-picker-indicator:hover {
  opacity: 0.8;
}

/* Genres Grid */
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
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  font-size: 0.75rem;
  font-weight: 600;
  color: #bb1814;
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

.error-text {
  color: #ff6b6b;
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
  background: #bb1814;
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
}

.btn-modal-primary:hover:not(:disabled) {
  background: #9d1310;
}

.btn-modal-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-modal-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #bb1814;
  border: 2px solid #bb1814;
  border-radius: 22px;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 0;
}

.btn-modal-cancel:hover {
  background: #bb1814;
  border-color: #bb1814;
  color: white;
}

/* Mobile Responsive */
@media (max-width: 576px) {
  .modal-content {
    border-radius: 16px;
    max-height: 100vh;
  }

  .genres-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .modal-dialog {
    width: 95%;
  }
}
</style>
