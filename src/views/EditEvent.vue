<!-- EditEvent.vue -->
<template>
  <div class="edit-event-page">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <!-- Loading State -->
            <div v-if="loading && !eventLoaded" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted">Loading event details...</p>
            </div>

            <!-- Event Not Found -->
            <div v-else-if="!loading && !eventLoaded" class="text-center py-5">
              <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
              <h3 class="mt-3">Event Not Found</h3>
              <p class="text-muted">This event may have been deleted or doesn't exist.</p>
              <router-link to="/artist/dashboard" class="btn btn-primary">
                Back to Dashboard
              </router-link>
            </div>

            <!-- Edit Form -->
            <div v-else>
              <!-- Header -->
              <div class="text-center mb-5">
                <h1 class="display-5 fw-bold mb-2">Edit Event</h1>
                <p class="text-muted">Update your event details</p>
              </div>

              <!-- Event Form Card -->
              <div class="card shadow-lg border-0">
                <div class="card-body p-4 p-md-5">
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

                  <form @submit.prevent="updateEvent">
                    <!-- Event Title -->
                    <div class="mb-4">
                      <label for="title" class="form-label fw-bold">
                        <i class="bi bi-music-note-beamed text-primary"></i> Event Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        v-model="formData.title"
                        class="form-control form-control-lg"
                        placeholder="e.g., Summer Jazz Night"
                        required
                        maxlength="100"
                      />
                      <div class="form-text">Make it catchy and descriptive</div>
                    </div>

                    <!-- Event Date -->
                    <div class="mb-4">
                      <label for="date" class="form-label fw-bold">
                        <i class="bi bi-calendar3 text-primary"></i> Event Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        v-model="formData.date"
                        :min="minDate"
                        class="form-control form-control-lg"
                        required
                      />
                    </div>

                    <!-- Genres (Multiple Selection) -->
                    <div class="mb-4">
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
                      <div v-if="errors.genres" class="text-danger small mt-1">
                        {{ errors.genres }}
                      </div>
                    </div>

                    <!-- Venue Name -->
                    <div class="mb-4">
                      <label for="venue" class="form-label fw-bold">
                        <i class="bi bi-building text-primary"></i> Venue Name
                      </label>
                      <input
                        type="text"
                        id="venue"
                        v-model="formData.venue"
                        class="form-control form-control-lg"
                        placeholder="e.g., Esplanade Concert Hall"
                        required
                      />
                    </div>

                    <!-- Location (Address) -->
                    <div class="mb-4">
                      <label for="location" class="form-label fw-bold">
                        <i class="bi bi-geo-alt text-primary"></i> Location / Address
                      </label>
                      <input
                        type="text"
                        id="location"
                        v-model="formData.location"
                        class="form-control form-control-lg"
                        placeholder="e.g., 1 Esplanade Drive, Singapore 038981"
                        required
                      />
                      <div class="form-text">Include full address for better discoverability</div>
                    </div>

                    <!-- Description -->
                    <div class="mb-4">
                      <label for="description" class="form-label fw-bold">
                        <i class="bi bi-card-text text-primary"></i> Event Description
                      </label>
                      <textarea
                        id="description"
                        v-model="formData.description"
                        class="form-control"
                        rows="4"
                        placeholder="Tell fans what makes this event special..."
                        maxlength="500"
                      ></textarea>
                      <div class="form-text">{{ formData.description.length }}/500 characters</div>
                    </div>

                    <!-- Tickets -->
                    <div class="mb-4">
                      <label for="ticket" class="form-label fw-bold">
                        <i class="bi bi-geo-alt text-primary"></i> Ticketing Link
                      </label>
                      <input
                        type="text"
                        id="ticket"
                        v-model="formData.ticket"
                        class="form-control form-control-lg"
                        placeholder="https://ticketmaster.sg/activity/detail/25sg_blackpink"
                        required
                      />
                      <div class="form-text">Add your event ticket link here</div>
                    </div>

                    <!-- Submit Buttons -->
                    <div class="d-grid gap-2">
                      <button type="submit" class="btn btn-primary btn-lg" :disabled="saving">
                        <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-save me-2"></i>
                        {{ saving ? 'Saving Changes...' : 'Save Changes' }}
                      </button>
                      <router-link to="/artist/dashboard" class="btn btn-outline-secondary">
                        Cancel
                      </router-link>
                    </div>
                  </form>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth, db } from '@/services/firebase'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import NavigationBar from '@/components/NavigationBar.vue'

export default {
  name: 'EditEvent',
  components: {
    NavigationBar,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const eventId = route.params.id
    const loading = ref(true)
    const saving = ref(false)
    const eventLoaded = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const formData = reactive({
      title: '',
      date: '',
      genres: [],
      venue: '',
      location: '',
      description: '',
      ticket: ''
    })

    const availableGenres = [
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
    ]

    const errors = reactive({})
    const minDate = new Date().toISOString().split('T')[0]

    // Load event data
    const loadEventData = async () => {
      loading.value = true
      try {
        const user = auth.currentUser
        if (!user) {
          router.push('/login')
          return
        }

        const eventDoc = await getDoc(doc(db, 'events', eventId))

        if (!eventDoc.exists()) {
          eventLoaded.value = false
          loading.value = false
          return
        }

        const eventData = eventDoc.data()

        // Verify that the current user is the owner of this event
        if (eventData.artistId !== user.uid) {
          errorMessage.value = 'You do not have permission to edit this event'
          eventLoaded.value = false
          loading.value = false
          return
        }

        // Populate form with existing data
        formData.title = eventData.title || ''
        formData.venue = eventData.venue || ''
        formData.location = eventData.location || ''
        formData.description = eventData.description || ''
        formData.genres = eventData.genres || []
        formData.ticket = eventData.ticket || ''

        // Convert Firestore Timestamp to date string
        if (eventData.date) {
          const dateObj = eventData.date.toDate ? eventData.date.toDate() : new Date(eventData.date)
          formData.date = dateObj.toISOString().split('T')[0]
        }

        eventLoaded.value = true
      } catch (error) {
        console.error('Error loading event:', error)
        errorMessage.value = 'Failed to load event data'
        eventLoaded.value = false
      } finally {
        loading.value = false
      }
    }

    // Toggle genre selection
    const toggleGenre = (genre) => {
      const index = formData.genres.indexOf(genre)

      if (index > -1) {
        formData.genres.splice(index, 1)
      } else {
        if (formData.genres.length < 3) {
          formData.genres.push(genre)
          errors.genres = ''
        } else {
          errors.genres = 'Maximum 3 genres allowed'
        }
      }
    }

    // Validate form
    const validateForm = () => {
      Object.keys(errors).forEach((key) => delete errors[key])

      // Validate date (must be future)
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        errors.date = 'Event date must be in the future'
        return false
      }

      // Validate genres
      if (formData.genres.length === 0) {
        errors.genres = 'Please select at least one genre'
        return false
      }

      return true
    }

    // Update event
    const updateEvent = async () => {
      successMessage.value = ''
      errorMessage.value = ''

      if (!validateForm()) {
        errorMessage.value = 'Please fix the errors above'
        return
      }

      saving.value = true

      try {
        const user = auth.currentUser
        if (!user) {
          throw new Error('User not authenticated')
        }

        // Update event in Firestore
        const eventRef = doc(db, 'events', eventId)
        await updateDoc(eventRef, {
          title: formData.title,
          venue: formData.venue,
          location: formData.location,
          date: new Date(formData.date),
          genres: formData.genres,
          description: formData.description,
          updatedAt: serverTimestamp(),
          ticket: formData.ticket,
        })

        successMessage.value = '✅ Event updated successfully!'

        // Redirect after 1.5 seconds
        setTimeout(() => {
          router.push('/artist/dashboard')
        }, 1500)
      } catch (error) {
        console.error('Error updating event:', error)
        errorMessage.value = 'Failed to update event. Please try again.'
      } finally {
        saving.value = false
      }
    }

    onMounted(() => {
      loadEventData()
    })

    return {
      formData,
      availableGenres,
      errors,
      loading,
      saving,
      eventLoaded,
      successMessage,
      errorMessage,
      minDate,
      toggleGenre,
      updateEvent,
    }
  },
}
</script>

<style scoped>
.edit-event-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

.card {
  border-radius: 16px;
}

.form-label {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-label i {
  font-size: 1.2rem;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Genres Grid */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.genre-chip {
  padding: 10px 15px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 500;
}

.genre-chip:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.genre-chip.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
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

  .genres-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
