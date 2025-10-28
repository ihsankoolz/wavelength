<!-- createEvent.vue -->
<template>
  <div class="create-event-page">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            
            <!-- Header -->
            <div class="text-center mb-5">
              <h1 class="display-5 fw-bold mb-2">Create New Event</h1>
              <p class="text-muted">Share your upcoming performance with fans</p>
            </div>

            <!-- Event Form Card -->
            <div class="card shadow-lg border-0">
              <div class="card-body p-4 p-md-5">
                
                <!-- Success Alert -->
                <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  {{ successMessage }}
                  <button type="button" class="btn-close" @click="successMessage = ''"></button>
                </div>

                <!-- Error Alert -->
                <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ errorMessage }}
                  <button type="button" class="btn-close" @click="errorMessage = ''"></button>
                </div>

                <form @submit.prevent="createEvent">
                  
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
                    >
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
                    >
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
                        :class="{ 'selected': formData.genres.includes(genre) }"
                        @click="toggleGenre(genre)"
                      >
                        {{ genre }}
                      </div>
                    </div>
                    <div class="form-text">Select genres that describe your event (max 3)</div>
                    <div v-if="errors.genres" class="text-danger small mt-1">{{ errors.genres }}</div>
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
                    >
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
                    >
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

                  <!-- Submit Button -->
                  <div class="d-grid gap-2">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg"
                      :disabled="loading"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-plus-circle me-2"></i>
                      {{ loading ? 'Creating Event...' : 'Create Event' }}
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
</template>

<script>
import { auth, db } from '@/services/firebase'
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import NavigationBar from '@/components/NavigationBar.vue';

export default {
  name: 'CreateEvent',
  components:{
    NavigationBar
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
        ticket: ''
      },
      availableGenres: [
        'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 
        'Jazz', 'Classical', 'Country', 'Indie', 'Folk',
        'Metal', 'Punk', 'Reggae', 'Blues', 'Alternative',
        'K-Pop', 'Mandopop', 'Cantopop'
      ],
      errors: {},
      loading: false,
      successMessage: '',
      errorMessage: '',
      artistName: '',
      minDate: new Date().toISOString().split('T')[0]
    }
  },
  async mounted() {
    // Get artist name from Firestore
    try {
      const user = auth.currentUser
      if (!user) {
        this.$router.push('/login')
        return
      }

      const artistDoc = await getDoc(doc(db, 'artists', user.uid))
      if (artistDoc.exists()) {
        this.artistName = artistDoc.data().artistName
      }
    } catch (error) {
      console.error('Error fetching artist data:', error)
    }
  },
  methods: {
    toggleGenre(genre) {
      const index = this.formData.genres.indexOf(genre)
      
      if (index > -1) {
        // Remove genre
        this.formData.genres.splice(index, 1)
      } else {
        // Add genre (max 3)
        if (this.formData.genres.length < 3) {
          this.formData.genres.push(genre)
          this.errors.genres = ''
        } else {
          this.errors.genres = 'Maximum 3 genres allowed'
        }
      }
    },

    validateForm() {
      this.errors = {}
      
      // Validate date (must be future)
      const selectedDate = new Date(this.formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        this.errors.date = 'Event date must be in the future'
        return false
      }

      // Validate genres
      if (this.formData.genres.length === 0) {
        this.errors.genres = 'Please select at least one genre'
        return false
      }

      return true
    },

    async createEvent() {
      // Clear previous messages
      this.successMessage = ''
      this.errorMessage = ''

      // Validate
      if (!this.validateForm()) {
        this.errorMessage = 'Please fix the errors above'
        return
      }

      this.loading = true

      try {
        const user = auth.currentUser
        if (!user) {
          throw new Error('User not authenticated')
        }

        // Create event object matching your Firestore schema
        const eventData = {
          title: this.formData.title,
          artistName: this.artistName,
          artistId: user.uid,
          venue: this.formData.venue,
          location: this.formData.location,
          date: new Date(this.formData.date),
          genres: this.formData.genres,
          description: this.formData.description,
          interestedCount: 0,
          createdAt: serverTimestamp(),
          ticket: this.formData.ticket
        }

        // Add to Firestore
        const docRef = await addDoc(collection(db, 'events'), eventData)
        
        console.log('Event created with ID:', docRef.id)
        this.successMessage = '✅ Event created successfully!'

        // Reset form
        this.formData = {
          title: '',
          date: '',
          genres: [],
          venue: '',
          location: '',
          description: '',
          ticket: ''
        }

        // Redirect after 2 seconds
        setTimeout(() => {
          this.$router.push('/events')
        }, 2000)

      } catch (error) {
        console.error('Error creating event:', error)
        this.errorMessage = 'Failed to create event. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.create-event-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-logo {
  height: 80px;
  width: auto;
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

.btn-outline-light {
  border: 2px solid white;
  color: white;
  font-weight: 500;
}

.btn-outline-light:hover {
  background: white;
  color: #667eea;
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