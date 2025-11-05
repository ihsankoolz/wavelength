<template>
  <div class="edit-artist-profile-wrapper">
    <!-- Dynamic Wave Background -->
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
        <path fill="none" stroke="#bb1814" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate
            attributeName="d"
            values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate
            attributeName="d"
            values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="0.8" opacity="0.3">
          <animate
            attributeName="d"
            values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>

    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-5">
        <!-- EDIT PROFILE Section -->
        <div class="edit-profile-section">
          <h1 class="section-heading display-4">EDIT PROFILE</h1>

          <!-- Success/Error Alerts -->
          <div v-if="successMessage" class="alert-success">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ successMessage }}
            <button type="button" class="alert-close" @click="successMessage = ''">×</button>
          </div>

          <div v-if="errorMessage" class="alert-error">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
            <button type="button" class="alert-close" @click="errorMessage = ''">×</button>
          </div>

          <form @submit.prevent="saveProfile">
            <div class="profile-info-section d-flex flex-column flex-lg-row align-items-center align-items-lg-start gap-4 gap-lg-5 mb-5">
              <!-- Profile Picture (Left) -->
              <div class="profile-image-container">
                <div class="profile-img-wrapper" @click="selectImage">
                  <img
                    :src="previewImage || form.profileImage || defaultPfp"
                    alt="Profile Picture"
                    class="profile-img"
                  />
                  <div class="profile-overlay">
                    <span class="overlay-text">Choose Photo</span>
                  </div>
                  <button type="button" class="camera-btn" @click.stop="selectImage">
                    <i class="bi bi-camera"></i>
                  </button>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  @change="onFileSelected"
                  style="display: none"
                />
              </div>

              <!-- Display Name & Email (Right) -->
              <div class="profile-fields flex-grow-1 w-100">
                <div class="field-group mb-4">
                  <label class="field-label">DISPLAY NAME</label>
                  <input
                    v-model="form.artistName"
                    type="text"
                    class="profile-input"
                    required
                    maxlength="100"
                  />
                </div>

                <div class="field-group mb-4">
                  <label class="field-label">EMAIL</label>
                  <input v-model="form.email" type="email" class="profile-input" disabled />
                </div>
              </div>
            </div>

            <!-- Artist Bio Section -->
            <div class="field-group mb-4">
              <label class="field-label">ARTIST BIO</label>
              <textarea
                v-model="form.bio"
                class="profile-input profile-textarea"
                rows="3"
                maxlength="500"
                placeholder="A short description of your music..."
              ></textarea>
              <div class="char-count">{{ form.bio.length }}/500 characters</div>
            </div>

            <!-- About You Section -->
            <div class="field-group mb-5">
              <label class="field-label">ABOUT YOU</label>
              <textarea
                v-model="form.aboutSection"
                class="profile-input profile-textarea"
                rows="5"
                maxlength="1000"
                placeholder="Tell your story, your musical journey, influences..."
              ></textarea>
              <div class="char-count">{{ form.aboutSection.length }}/1000 characters</div>
            </div>

            <!-- Music Genre Selection Section -->
            <div class="genre-picks-section mb-5">
              <h2 class="genre-heading display-5 mb-4">MUSIC GENRE (SELECT UP TO 5)</h2>
              <div class="genres-grid row g-3 g-md-4 g-lg-5">
                <div
                  v-for="genre in availableGenres"
                  :key="genre"
                  class="genre-item col-4 col-sm-3 col-md-2 col-lg-2"
                  :class="{ selected: form.genres.includes(genre) }"
                  @click="toggleGenre(genre)"
                >
                  <div class="genre-image-wrapper">
                    <img :src="getGenreImage(genre)" :alt="genre" class="genre-image" />
                    <div v-if="form.genres.includes(genre)" class="genre-overlay"></div>
                    <div v-if="form.genres.includes(genre)" class="genre-checkmark">
                      <i class="bi bi-check-lg"></i>
                    </div>
                  </div>
                  <p class="genre-name">{{ genre.toUpperCase() }}</p>
                </div>
              </div>
              <p class="genre-count text-center mt-4">{{ form.genres.length }} GENRES SELECTED</p>
            </div>

            <!-- Social Links Section -->
            <div class="social-links-section mb-5 p-3 p-md-4 p-lg-5">
              <h3 class="section-subheading display-6 mb-4">SOCIAL MEDIA LINKS</h3>
              <div class="social-fields d-flex flex-column gap-3">
                <div class="field-group mb-0">
                  <label class="field-label">SPOTIFY</label>
                  <input
                    type="url"
                    v-model="form.socialLinks.spotify"
                    class="profile-input"
                    placeholder="https://open.spotify.com/artist/..."
                  />
                </div>
                <div class="field-group mb-0">
                  <label class="field-label">YOUTUBE</label>
                  <input
                    type="url"
                    v-model="form.socialLinks.youtube"
                    class="profile-input"
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
                <div class="field-group mb-0">
                  <label class="field-label">INSTAGRAM</label>
                  <input
                    type="url"
                    v-model="form.socialLinks.instagram"
                    class="profile-input"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 gap-sm-4 mt-5">
              <button type="submit" class="btn-save" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Saving...' : 'SAVE CHANGES' }}
              </button>
              <button type="button" class="btn-cancel" @click="$router.push('/artist/dashboard')">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db, storage } from '@/services/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import NavigationBar from '@/components/NavigationBar.vue'
import defaultPfp from '@/assets/defaultPfp.jpg'
import { GENRE_LIST, GENRE_IMAGES } from '@/constants/genres'

export default {
  name: 'EditArtistProfile',
  components: {
    NavigationBar,
  },
  data() {
    return {
      form: {
        artistName: '',
        bio: '',
        aboutSection: '',
        genres: [],
        profileImage: '',
        email: '',
        socialLinks: {
          spotify: '',
          youtube: '',
          instagram: '',
        },
      },
      availableGenres: GENRE_LIST,
      previewImage: null,
      selectedFile: null,
      loading: false,
      successMessage: '',
      errorMessage: '',
      defaultPfp,
    }
  },
  async mounted() {
    await this.loadArtistProfile()
  },
  methods: {
    getGenreImage(genre) {
      // Use the centralized GENRE_IMAGES mapping
      return GENRE_IMAGES[genre] || GENRE_IMAGES['Indie']
    },
    async loadArtistProfile() {
      try {
        const user = auth.currentUser
        if (!user) {
          this.$router.push('/login')
          return
        }

        // Get email from auth
        this.form.email = user.email || ''

        const artistDoc = await getDoc(doc(db, 'artists', user.uid))
        if (artistDoc.exists()) {
          const data = artistDoc.data()
          this.form = {
            artistName: data.artistName || '',
            bio: data.bio || '',
            aboutSection: data.aboutSection || '',
            genres: data.genres || [],
            profileImage: data.profileImage || '',
            email: user.email || '',
            socialLinks: {
              spotify: data.socialLinks?.spotify || '',
              youtube: data.socialLinks?.youtube || '',
              instagram: data.socialLinks?.instagram || '',
            },
          }
        }
      } catch (error) {
        console.error('Error loading artist profile:', error)
        this.errorMessage = 'Failed to load profile'
      }
    },

    toggleGenre(genre) {
      const index = this.form.genres.indexOf(genre)
      if (index > -1) {
        this.form.genres.splice(index, 1)
      } else {
        if (this.form.genres.length < 5) {
          this.form.genres.push(genre)
        } else {
          alert('Maximum 5 genres allowed')
        }
      }
    },

    selectImage() {
      this.$refs.fileInput.click()
    },

    onFileSelected(event) {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }

      this.selectedFile = file
      this.previewImage = URL.createObjectURL(file)
    },

    async uploadProfileImage() {
      if (!this.selectedFile) return this.form.profileImage

      try {
        const user = auth.currentUser
        const imageRef = storageRef(
          storage,
          `artist-images/${user.uid}/${Date.now()}_${this.selectedFile.name}`,
        )

        await uploadBytes(imageRef, this.selectedFile)
        const downloadURL = await getDownloadURL(imageRef)

        return downloadURL
      } catch (error) {
        console.error('Error uploading image:', error)
        throw error
      }
    },

    async saveProfile() {
      try {
        this.loading = true
        this.successMessage = ''
        this.errorMessage = ''

        const user = auth.currentUser
        if (!user) {
          throw new Error('Not authenticated')
        }

        // Upload image if new one selected
        let imageUrl = this.form.profileImage
        if (this.selectedFile) {
          imageUrl = await this.uploadProfileImage()
        }

        // Update artist document
        await updateDoc(doc(db, 'artists', user.uid), {
          artistName: this.form.artistName,
          bio: this.form.bio,
          aboutSection: this.form.aboutSection,
          genres: this.form.genres,
          profileImage: imageUrl,
          socialLinks: this.form.socialLinks,
        })

        // Also update user document display name
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: this.form.artistName,
          profileImage: imageUrl,
        })

        this.successMessage = 'Profile updated successfully!'

        // Redirect after 2 seconds
        setTimeout(() => {
          this.$router.push('/artist/dashboard')
        }, 2000)
      } catch (error) {
        console.error('Error saving profile:', error)
        this.errorMessage = 'Failed to save profile. Please try again.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.edit-artist-profile-wrapper {
  font-family: 'Poppins', sans-serif;
  background: #191717;
  min-height: 100vh;
  width: 100%;
  color: white;
  padding-top: 100px;
  position: relative;
}

/* Dynamic Wave Background */
.wave-svg {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100vw;
  height: 300px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
  overflow: hidden;
}

.wave-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}

.edit-artist-profile-wrapper::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(ellipse at center, rgba(187, 24, 20, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse at 30% 50%, rgba(199, 53, 53, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(187, 24, 20, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding-top: 40px;
  padding-bottom: 60px;
}

.edit-profile-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-heading {
  font-weight: bold;
  color: white;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.section-subheading {
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Alerts */
.alert-success,
.alert-error {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-success {
  background: rgba(40, 167, 69, 0.2);
  border: 1px solid rgba(40, 167, 69, 0.5);
  color: #28a745;
}

.alert-error {
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid rgba(220, 53, 69, 0.5);
  color: #dc3545;
}

.alert-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  line-height: 1;
}

.alert-close:hover {
  opacity: 0.7;
}

/* Profile Info Section - Bootstrap classes handle layout */

.profile-image-container {
  cursor: pointer;
}

.profile-img-wrapper {
  position: relative;
  display: inline-block;
}

.profile-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.3s ease;
  cursor: pointer;
}

.profile-img:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.profile-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1;
  cursor: pointer;
}

.profile-img-wrapper:hover .profile-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.camera-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #bb1814;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 3;
}

.camera-btn:hover {
  background: #a01511;
  transform: scale(1.1);
}

/* Profile fields and field groups - Bootstrap classes handle layout */

.field-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.profile-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.profile-input:focus {
  outline: none;
  border-color: #bb1814;
  background: rgba(255, 255, 255, 0.15);
}

.profile-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.profile-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 5px;
}

/* Genre Picks Section - Bootstrap classes handle spacing and grid */

.genre-heading {
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.genre-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.genre-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  margin-bottom: 12px;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s ease;
}

.genre-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: all 0.3s ease;
  filter: brightness(1);
}

.genre-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 1;
  transition: all 0.3s ease;
}

.genre-checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.genre-checkmark i {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

/* Hover Effects - Clear and Vibrant (for non-selected items) */
.genre-item:hover .genre-image-wrapper {
  transform: scale(1.05);
}

/* Non-selected items: brighten and enhance on hover */
.genre-item:hover:not(.selected) .genre-image {
  filter: brightness(1.15) saturate(1.3);
  opacity: 1;
}

/* Selected State - Black Overlay with Centered Checkmark */
.genre-item.selected .genre-image {
  filter: brightness(0.7);
}

.genre-item.selected .genre-overlay {
  background: rgba(0, 0, 0, 0.6);
}

/* Selected items on hover: maintain black overlay but slightly brighten */
.genre-item.selected:hover .genre-image {
  filter: brightness(0.75);
}

.genre-item.selected:hover .genre-overlay {
  background: rgba(0, 0, 0, 0.65);
}

.genre-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.genre-count {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Social Links Section */
.social-links-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Social fields - Bootstrap classes handle layout */

/* Action Buttons - Bootstrap classes handle layout */

.btn-save,
.btn-cancel {
  background: #bb1814;
  color: #fff;
  border-radius: 22px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  padding: 8px 0;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 200px;
  min-width: 200px;
}

.btn-save:hover:not(:disabled) {
  background: #6e0b0b;
  color: white;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: transparent;
  border: 2px solid #bb1814;
  color: white;
}

.btn-cancel:hover {
  background-color: #bb1814;
  color: white;
}

/* Responsive Design - Handled by Bootstrap breakpoints */
/* All responsive layout is now handled by Bootstrap utility classes */
</style>
