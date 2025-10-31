<!-- onboarding.vue -->
<template>
  <div class="onboarding-wrapper">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-lg-10">
          <!-- Logo section -->
          <div class="text-center text-white mb-4">
            <img src="/assets/logo1.png" alt="Wavelength" class="onboarding-logo mb-3" />
            <h2 class="mb-2">What music do you love?</h2>
            <p class="tagline">Select your favorite genres to get personalized recommendations</p>
          </div>

          <!-- Genre selection card -->
          <div class="card shadow">
            <div class="card-body p-4 p-md-5">
              <!-- Error alert -->
              <div v-if="errorMessage" class="alert alert-warning" role="alert">
                {{ errorMessage }}
              </div>

              <!-- Genre grid -->
              <div class="genres-grid">
                <div
                  v-for="genre in genres"
                  :key="genre"
                  class="genre-card"
                  :class="{ selected: selectedGenres.includes(genre) }"
                  @click="toggleGenre(genre)"
                >
                  <div class="genre-icon">
                    <i :class="getGenreIcon(genre)"></i>
                  </div>
                  <div class="genre-name">{{ genre }}</div>
                  <div v-if="selectedGenres.includes(genre)" class="check-icon">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                </div>
              </div>

              <!-- Selected count -->
              <div class="text-center mt-4 mb-3">
                <small class="text-muted">
                  {{ selectedGenres.length }} genre{{ selectedGenres.length !== 1 ? 's' : '' }}
                  selected
                </small>
              </div>

              <!-- Continue button -->
              <button
                type="button"
                class="btn btn-primary w-100 py-3"
                :disabled="isLoading || selectedGenres.length === 0"
                @click="savePreferences"
              >
                <span v-if="isLoading">Saving...</span>
                <span v-else>Continue to Wavelength</span>
              </button>

              <!-- Skip option -->
              <div class="text-center mt-3">
                <button
                  type="button"
                  class="btn btn-link text-muted"
                  @click="skipOnboarding"
                  :disabled="isLoading"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'

export default {
  name: 'Onboarding',
  data() {
    return {
      genres: [
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
      selectedGenres: [],
      errorMessage: '',
      isLoading: false,
    }
  },
  methods: {
    toggleGenre(genre) {
      //find if this genre is already in selectedGenres array
      const index = this.selectedGenres.indexOf(genre)
      //check if genre is already selected
      if (index > -1) {
        // remove genre if already selected
        this.selectedGenres.splice(index, 1)
      } else {
        // add genre if not selected
        this.selectedGenres.push(genre)
      }
      this.errorMessage = '' // clear error when user selects
    },

    getGenreIcon(genre) {
      // map genres to Bootstrap Icons
      //create objhect that map names to icon classes
      const iconMap = {
        Indie: 'bi bi-vinyl fs-2',
        Jazz: 'bi bi-music-note-beamed fs-2',
        Electronic: 'bi bi-lightning fs-2',
        Rock: 'bi bi-file-music fs-2',
        Pop: 'bi bi-star fs-2',
        'R&B': 'bi bi-heart fs-2',
        'Hip-Hop': 'bi bi-mic fs-2',
        Folk: 'bi bi-tree fs-2',
        Classical: 'bi bi-trophy fs-2',
        Metal: 'bi bi-fire fs-2',
        Alternative: 'bi bi-badge-tm fs-2',
        Soul: 'bi bi-emoji-sunglasses fs-2',
      }
      //if genre not found, return default music note icon
      return iconMap[genre] || 'bi bi-music-note fs-2'
    },

    async savePreferences() {
      //make sure atleast one genre is chosen
      if (this.selectedGenres.length === 0) {
        this.errorMessage = 'Please select at least one genre'
        return
      }
      //show loading state -> disables the button
      this.isLoading = true
      this.errorMessage = ''

      try {
        //this is to get current logged in user
        const user = auth.currentUser
        if (!user) {
          throw new Error('No user logged in')
        }

        // update user document with selected genres
        await updateDoc(doc(db, 'users', user.uid), {
          'preferences.genres': this.selectedGenres,
          lastActive: new Date(),
        })

        // redirect to home
        this.$router.push('/home')
      } catch (error) {
        console.error('Error saving preferences:', error)
        this.errorMessage = 'Failed to save preferences. Please try again.'
      }
      //this is to hide loading state at the end
      this.isLoading = false
    },

    skipOnboarding() {
      // redirect without saving
      this.$router.push('/home')
    },
  },
}
</script>

<style scoped>
.onboarding-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.onboarding-logo {
  width: 280px;
  max-width: 90%;
  height: auto;
}

.tagline {
  font-size: 1.1rem;
  opacity: 0.95;
  margin: 0;
}

.card {
  border: none;
  border-radius: 16px;
  max-width: 900px;
  margin: 0 auto;
}

/* Genre Grid */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.genre-card {
  position: relative;
  background: #f8f9fa;
  border: 3px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.genre-card:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.genre-card.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.genre-icon {
  margin-bottom: 0.75rem;
  color: #667eea;
}

.genre-card.selected .genre-icon {
  color: white;
}

.genre-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  font-size: 1.25rem;
}

/* Button */
.btn-primary {
  background-color: #667eea;
  border-color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 10px;
}

.btn-primary:hover {
  background-color: #5568d3;
  border-color: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
}

.btn-link {
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 576px) {
  .genres-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .genre-card {
    padding: 1.25rem 0.75rem;
  }

  .onboarding-logo {
    width: 200px;
  }
}
</style>
