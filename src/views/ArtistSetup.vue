<template>
  <div class="artist-setup">
    <div class="container">
      <div class="setup-card">
        
        <!-- Loading State -->
        <div v-if="loadingData" class="loading-section">
          <div class="header">
            <h2>Loading Your Profile</h2>
            <p>Please wait while we fetch your information...</p>
          </div>
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
        </div>

        <!-- Form content (WRAPPED IN v-else) -->
        <div v-else>
          <div class="header">
            <!-- <img src="/assets/logo.jpg" alt="Wavelength" class="logo"> -->
            <h2>{{ isEditMode ? 'Edit Your Artist Profile' : 'Complete Your Artist Profile' }}</h2>
  <p>{{ isEditMode ? 'Update your information below' : "Let's set up your creative space on Wavelength" }}</p>
          </div>

          <form @submit.prevent="submitProfile" class="setup-form">
            <!-- Display Name -->
            <div class="form-group">
              <label for="displayName" class="form-label">
                <i class="icon">🎤</i>
                Artist Display Name
              </label>
              <input 
                type="text" 
                id="displayName"
                v-model="formData.displayName"
                class="form-input"
                :class="{ 'error': errors.displayName }"
                placeholder="Enter your stage name"
                maxlength="50"
                required
              >
              <div class="input-help">This is how fans will see your name</div>
              <div v-if="errors.displayName" class="error-text">{{ errors.displayName }}</div>
            </div>

            <!-- Bio/Description -->
            <div class="form-group">
              <label for="bio" class="form-label">
                <i class="icon">📝</i>
                Artist Bio
              </label>
              <textarea 
                id="bio"
                v-model="formData.bio"
                class="form-textarea"
                :class="{ 'error': errors.bio }"
                placeholder="Tell fans about yourself, your music style, inspirations..."
                rows="4"
                maxlength="500"
                required
              ></textarea>
              <div class="input-help">{{ formData.bio.length }}/500 characters</div>
              <div v-if="errors.bio" class="error-text">{{ errors.bio }}</div>
            </div>

            <!-- About Section (NEW) -->
<div class="form-group">
  <label for="aboutSection" class="form-label">
    <i class="icon">📖</i>
    About Section
  </label>
  <textarea 
    id="aboutSection"
    v-model="formData.aboutSection"
    class="form-textarea"
    :class="{ 'error': errors.aboutSection }"
    placeholder="Write a detailed about section for fans to learn more about you, your journey, inspirations, etc..."
    rows="5"
    maxlength="1000"
    required
  ></textarea>
  <div class="input-help">{{ formData.aboutSection.length }}/1000 characters</div>
  <div v-if="errors.aboutSection" class="error-text">{{ errors.aboutSection }}</div>
</div>

<!-- Latest Single (NEW) -->
<div class="form-group">
  <label for="latestSingle" class="form-label">
    <i class="icon">🎵</i>
    Latest Single Title (Optional)
  </label>
  <input 
    type="text" 
    id="latestSingle"
    v-model="formData.latestSingle"
    class="form-input"
    placeholder="e.g. City Lights"
    maxlength="100"
  >
</div>

<!-- Latest Album (NEW) -->
<div class="form-group">
  <label for="latestAlbum" class="form-label">
    <i class="icon">💿</i>
    Latest Album Title (Optional)
  </label>
  <input 
    type="text" 
    id="latestAlbum"
    v-model="formData.latestAlbum"
    class="form-input"
    placeholder="e.g. Urban Stories"
    maxlength="100"
  >
</div>
<!-- Spotify Track URL -->
<div class="form-group">
  <label for="spotifyTrackUrl" class="form-label">
    <i class="icon">🎵</i>
    Spotify Track URL (For Music Tab)
  </label>
  <input 
    type="url" 
    id="spotifyTrackUrl"
    v-model="formData.spotifyTrackUrl"
    class="form-input"
    :class="{ 'error': errors.spotifyTrackUrl }"
    placeholder="https://open.spotify.com/track/..."
  >
  <div class="input-help">Paste your Spotify track URL to embed a playable track</div>
  <div v-if="errors.spotifyTrackUrl" class="error-text">{{ errors.spotifyTrackUrl }}</div>
</div>

<!-- YouTube Video URL -->
<div class="form-group">
  <label for="youtubeVideoUrl" class="form-label">
    <i class="icon">📺</i>
    YouTube Video URL (For Music Tab)
  </label>
  <input 
    type="url" 
    id="youtubeVideoUrl"
    v-model="formData.youtubeVideoUrl"
    class="form-input"
    :class="{ 'error': errors.youtubeVideoUrl }"
    placeholder="https://www.youtube.com/watch?v=..."
  >
  <div class="input-help">Paste your YouTube music video URL to embed a playable video</div>
  <div v-if="errors.youtubeVideoUrl" class="error-text">{{ errors.youtubeVideoUrl }}</div>
</div>

            <!-- Genres -->
            <div class="form-group">
              <label class="form-label">
                <i class="icon">🎵</i>
                Music Genres (Select up to 5)
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
              <div v-if="errors.genres" class="error-text">{{ errors.genres }}</div>
            </div>

            <!-- Social Links (Optional) -->
            <div class="form-group">
              <label class="form-label">
                <i class="icon">🔗</i>
                Social Links (Optional)
              </label>
              <div class="social-inputs">
                <input 
                  type="url" 
                  v-model="formData.socialLinks.spotify"
                  class="form-input"
                  placeholder="Spotify profile URL"
                >
                <input 
                  type="url" 
                  v-model="formData.socialLinks.youtube"
                  class="form-input"
                  placeholder="YouTube channel URL"
                >
                <input 
                  type="url" 
                  v-model="formData.socialLinks.instagram"
                  class="form-input"
                  placeholder="Instagram profile URL"
                >
              </div>
            </div>

            <!-- Submit Button (NO SKIP OPTION) -->
            <div class="form-actions">
  <!-- Back to Dashboard button (only in edit mode) -->
  <button 
    v-if="isEditMode" 
    type="button" 
    class="btn-secondary btn-full-width"
    @click="$router.push('/artist/dashboard')"
    style="margin-bottom: 15px;"
  >
    ← Back to Dashboard
  </button>

  <!-- Submit button -->
  <button 
    type="submit" 
    class="btn-primary btn-full-width"
    :disabled="loading"
  >
    <span v-if="loading" class="spinner"></span>
    {{ loading ? (isEditMode ? 'Updating...' : 'Setting up...') : (isEditMode ? 'Update Profile' : 'Complete Setup') }}
  </button>
</div>

          </form>
        </div>
            <!-- Add this AFTER your existing tab content but BEFORE the closing </div> of container -->

<!-- Edit Profile Modal -->
<div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
  <div class="edit-modal" @click.stop>
    <div class="modal-header">
      <h3>Edit Artist Profile</h3>
      <button class="close-btn" @click="closeEditModal">×</button>
    </div>
    
    <form @submit.prevent="saveProfile" class="edit-form">
      <!-- Artist Name -->
      <div class="form-group">
        <label for="editArtistName">Artist Display Name</label>
        <input 
          id="editArtistName"
          v-model="editData.artistName" 
          type="text" 
          class="form-input"
          :class="{ 'error': editErrors.artistName }"
          maxlength="50"
          required
        >
        <div v-if="editErrors.artistName" class="error-text">{{ editErrors.artistName }}</div>
      </div>

      <!-- Bio -->
      <div class="form-group">
        <label for="editBio">Short Bio</label>
        <textarea 
          id="editBio"
          v-model="editData.bio" 
          class="form-textarea"
          :class="{ 'error': editErrors.bio }"
          rows="3"
          maxlength="200"
          required
        ></textarea>
        <div class="input-help">{{ editData.bio.length }}/200 characters</div>
        <div v-if="editErrors.bio" class="error-text">{{ editErrors.bio }}</div>
      </div>

      <!-- About Section -->
      <div class="form-group">
        <label for="editAbout">About Section</label>
        <textarea 
          id="editAbout"
          v-model="editData.aboutSection" 
          class="form-textarea"
          :class="{ 'error': editErrors.aboutSection }"
          rows="4"
          maxlength="1000"
          required
        ></textarea>
        <div class="input-help">{{ editData.aboutSection.length }}/1000 characters</div>
        <div v-if="editErrors.aboutSection" class="error-text">{{ editErrors.aboutSection }}</div>
      </div>

      <!-- Latest Single -->
      <div class="form-group">
        <label for="editSingle">Latest Single</label>
        <input 
          id="editSingle"
          v-model="editData.latestSingle" 
          type="text" 
          class="form-input"
          maxlength="100"
        >
      </div>

      <!-- Latest Album -->
      <div class="form-group">
        <label for="editAlbum">Latest Album</label>
        <input 
          id="editAlbum"
          v-model="editData.latestAlbum" 
          type="text" 
          class="form-input"
          maxlength="100"
        >
      </div>

      <!-- Genres -->
      <div class="form-group">
        <label>Music Genres (Select up to 5)</label>
        <div class="genres-grid">
          <div 
            v-for="genre in availableGenres" 
            :key="genre"
            class="genre-chip"
            :class="{ 'selected': editData.genres.includes(genre) }"
            @click="toggleEditGenre(genre)"
          >
            {{ genre }}
          </div>
        </div>
        <div v-if="editErrors.genres" class="error-text">{{ editErrors.genres }}</div>
      </div>

      <!-- Social Links -->
      <div class="form-group">
        <label>Social Links</label>
        <div class="social-inputs">
          <input 
            v-model="editData.socialLinks.spotify" 
            type="url" 
            class="form-input"
            placeholder="Spotify profile URL"
          >
          <input 
            v-model="editData.socialLinks.youtube" 
            type="url" 
            class="form-input"
            placeholder="YouTube channel URL"
          >
          <input 
            v-model="editData.socialLinks.instagram" 
            type="url" 
            class="form-input"
            placeholder="Instagram profile URL"
          >
        </div>
      </div>

      <!-- Form Actions -->
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/services/firebase'

export default {
  name: 'ArtistSetup',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const loadingData = ref(true)
    const errors = reactive({})
    const isEditMode = ref(false)
    const currentUser = ref(null)
    
  
    const formData = reactive({
  displayName: '',
  bio: '',
  aboutSection: '',    // NEW
  latestSingle: '',    // NEW
  latestAlbum: '',     // NEW
   spotifyTrackUrl: '',      // ✅ ADD THIS
  youtubeVideoUrl: '', 
  genres: [],
  socialLinks: {
    spotify: '',
    youtube: '',
    instagram: ''
  }
})


    const availableGenres = [
      'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 
      'Jazz', 'Classical', 'Country', 'Indie', 'Folk',
      'Metal', 'Punk', 'Reggae', 'Blues', 'Alternative',
      'K-Pop', 'Mandopop', 'Cantopop'
    ]

    const loadExistingData = async (userId) => {
      try {
        loadingData.value = true
        
        const userDoc = await getDoc(doc(db, 'users', userId))
        const userData = userDoc.exists() ? userDoc.data() : {}
        
        const artistDoc = await getDoc(doc(db, 'artists', userId))
        const artistData = artistDoc.exists() ? artistDoc.data() : {}

      
        isEditMode.value = artistData.profileSetupCompleted === true

        if (artistData) {
          formData.displayName = artistData.artistName || userData.displayName || ''
          formData.bio = artistData.bio || ''
          formData.genres = artistData.genres || []
          formData.aboutSection = artistData.aboutSection || ''    // ✅ ADD THIS
          formData.latestSingle = artistData.latestSingle || ''    // ✅ ADD THIS  
           formData.spotifyTrackUrl = artistData.spotifyTrackUrl || ''      // ✅ ADD THIS
  formData.youtubeVideoUrl = artistData.youtubeVideoUrl || ''   
          formData.latestAlbum = artistData.latestAlbum || ''  
          formData.socialLinks = {
            spotify: artistData.socialLinks?.spotify || '',
            youtube: artistData.socialLinks?.youtube || '',
            instagram: artistData.socialLinks?.instagram || ''
          }
        }

      

      } catch (error) {
        console.error('Error loading existing data:', error)
      } finally {
        loadingData.value = false
      }
    }

    onMounted(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUser.value = user
          loadExistingData(user.uid)
        } else {
          router.push('/login')
        }
      })

      return () => unsubscribe()
    })

    const toggleGenre = (genre) => {
      const index = formData.genres.indexOf(genre)
      if (index > -1) {
        formData.genres.splice(index, 1)
      } else if (formData.genres.length < 5) {
        formData.genres.push(genre)
      }
    }

    const validateSpotifyUrl = (url) => {
  if (!url) return true // Optional field
  return url.includes('open.spotify.com/track/') || url.includes('open.spotify.com/album/')
}

const validateYouTubeUrl = (url) => {
  if (!url) return true // Optional field
  return url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')
}

    const validateForm = () => {
      const newErrors = {}

      if (!formData.displayName.trim()) {
        newErrors.displayName = 'Display name is required'
      } else if (formData.displayName.length < 2) {
        newErrors.displayName = 'Display name must be at least 2 characters'
      }

      if (!formData.bio.trim()) {
        newErrors.bio = 'Bio is required'
      } else if (formData.bio.length < 20) {
        newErrors.bio = 'Bio must be at least 20 characters'
      }
       if (formData.spotifyTrackUrl && !validateSpotifyUrl(formData.spotifyTrackUrl)) {
    newErrors.spotifyTrackUrl = 'Please enter a valid Spotify track or album URL'
  }

  if (formData.youtubeVideoUrl && !validateYouTubeUrl(formData.youtubeVideoUrl)) {
    newErrors.youtubeVideoUrl = 'Please enter a valid YouTube video URL'
  }
      if (formData.genres.length === 0) {
        newErrors.genres = 'Please select at least one genre'
      }
        if (!formData.aboutSection.trim()) {
    newErrors.aboutSection = 'About section is required'
  } else if (formData.aboutSection.length < 50) {
    newErrors.aboutSection = 'About section must be at least 50 characters'
  }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const submitProfile = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        const user = auth.currentUser
        if (!user) throw new Error('User not authenticated')

        await updateDoc(doc(db, 'users', user.uid), {
          displayName: formData.displayName,
          profileCompleted: true,
          lastActive: new Date()
        })

    
        await updateDoc(doc(db, 'artists', user.uid), {
          artistName: formData.displayName,
          bio: formData.bio,
          aboutSection: formData.aboutSection,    // NEW
          latestSingle: formData.latestSingle,    // NEW
          latestAlbum: formData.latestAlbum,      // NEW
          spotifyTrackUrl: formData.spotifyTrackUrl,      // ✅ ADD THIS
  youtubeVideoUrl: formData.youtubeVideoUrl,      // ✅ ADD THIS
          genres: formData.genres,
          socialLinks: {
            spotify: formData.socialLinks.spotify || '',
            youtube: formData.socialLinks.youtube || '',
            instagram: formData.socialLinks.instagram || ''
          },
          profileSetupCompleted: true,
          updatedAt: new Date()
        })

        console.log('Profile updated successfully!')
        router.push('/artist/dashboard')

      } catch (error) {
        console.error('Profile setup error:', error)
        alert('Failed to save profile. Please try again.')
      } finally {
        loading.value = false
      }
    }



    return {
      formData,
      errors,
      loading,
      loadingData,
      isEditMode,
      availableGenres,
      toggleGenre,
      submitProfile
    }
  }
}
</script>
<style scoped>
.artist-setup {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  max-width: 600px;
  width: 100%;
}

.setup-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 15px;
}

.header h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.header p {
  color: #666;
  font-size: 16px;
}

/* Loading Section Styles */
.loading-section {
  text-align: center;
  padding: 60px 0;
}

.loading-spinner {
  margin: 30px 0;
}

.loading-spinner .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e1e5e9;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

/* Form Styles */
.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.icon {
  margin-right: 10px;
  font-size: 18px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-input.error, .form-textarea.error {
  border-color: #e74c3c;
}

.input-help {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.error-text {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

/* Genres Grid */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
}

.genre-chip:hover {
  background: #e9ecef;
}

.genre-chip.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Social Inputs */
.social-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Form Actions - UPDATED for single button */
.form-actions {
  margin-top: 30px;
}

.btn-primary, .btn-full-width {
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled), .btn-full-width:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.btn-primary:disabled, .btn-full-width:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Button Spinner */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #dee2e6;
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .setup-card {
    padding: 25px;
  }

  .genres-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .artist-setup {
    padding: 10px;
  }

  .setup-card {
    padding: 20px;
  }

  .genres-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 8px;
  }

  .genre-chip {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
