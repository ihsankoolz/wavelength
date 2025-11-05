<template>
  <div class="edit-profile-wrapper">
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
          <h1 class="section-heading">EDIT PROFILE</h1>

          <form @submit.prevent="updateProfile">
            <div class="profile-info-section">
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
              <div class="profile-fields">
                <div class="field-group">
                  <label class="field-label">DISPLAY NAME</label>
                  <input v-model="form.displayName" type="text" class="profile-input" required />
                </div>

                <div class="field-group">
                  <label class="field-label">EMAIL</label>
                  <input v-model="form.email" type="email" class="profile-input" disabled />
                </div>
              </div>
            </div>

            <!-- YOUR GENRE PICKS Section -->
            <div class="genre-picks-section">
              <h2 class="genre-heading">YOUR GENRE PICKS</h2>
              <div class="genres-grid">
                <div
                  v-for="genre in availableGenres"
                  :key="genre"
                  class="genre-item"
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
              <p class="genre-count">{{ form.genres.length }} GENRES SELECTED</p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button type="submit" class="btn-save" :disabled="uploading">
                <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
                {{ uploading ? 'Uploading...' : 'SAVE CHANGES' }}
              </button>
              <button type="button" class="btn-cancel" @click="$router.push(`/profile/${userId}`)">
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
import { getAuth } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/services/firebase'
import NavigationBar from '@/components/NavigationBar.vue'
import defaultPfp from '@/assets/defaultPfp.jpg'
import { GENRE_LIST, GENRE_IMAGES } from '@/constants/genres'

export default {
  name: 'EditProfile',
  components: {
    NavigationBar,
  },
  data() {
    return {
      form: {
        displayName: '',
        email: '',
        profileImage: '',
        genres: [], // ✅ Added genres
      },
      availableGenres: GENRE_LIST,
      userId: null,
      previewImage: null,
      selectedFile: null, // ✅ Store actual file for upload
      uploading: false,
      defaultPfp,
    }
  },
  async mounted() {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      this.$router.push('/login')
      return
    }

    this.userId = this.$route.params.id || user.uid

    const docRef = doc(db, 'users', this.userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const userData = docSnap.data()
      this.form = {
        displayName: userData.displayName || '',
        email: userData.email || '',
        profileImage: userData.profileImage || '',
        genres: userData.preferences?.genres || [], // ✅ Load existing genres
      }
    } else {
      console.warn('No such user!')
    }
  },
  methods: {
    getGenreImage(genre) {
      // Use the centralized GENRE_IMAGES mapping
      return GENRE_IMAGES[genre] || GENRE_IMAGES['Indie']
    },
    toggleGenre(genre) {
      const index = this.form.genres.indexOf(genre)
      if (index > -1) {
        this.form.genres.splice(index, 1)
      } else {
        this.form.genres.push(genre)
      }
    },
    selectImage() {
      this.$refs.fileInput.click()
    },
    onFileSelected(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
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
        // Create a reference to storage location
        const imageRef = storageRef(
          storage,
          `profile-images/${this.userId}/${Date.now()}_${this.selectedFile.name}`,
        )

        // Upload file
        await uploadBytes(imageRef, this.selectedFile)

        // Get download URL
        const downloadURL = await getDownloadURL(imageRef)

        return downloadURL
      } catch (error) {
        console.error('Error uploading image:', error)
        throw error
      }
    },
    async updateProfile() {
      try {
        this.uploading = true

        // Upload image if new one selected
        let imageUrl = this.form.profileImage
        if (this.selectedFile) {
          imageUrl = await this.uploadProfileImage()
        }

        // Update Firestore
        const docRef = doc(db, 'users', this.userId)
        await updateDoc(docRef, {
          displayName: this.form.displayName,
          profileImage: imageUrl,
          'preferences.genres': this.form.genres, // ✅ Update genres
          lastActive: new Date(),
        })

        alert('Profile updated successfully!')
        this.$router.push(`/profile/${this.userId}`)
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Failed to update profile. Please try again.')
      } finally {
        this.uploading = false
      }
    },
  },
}
</script>

<style scoped>
.edit-profile-wrapper {
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

.edit-profile-wrapper::before {
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
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Profile Info Section */
.profile-info-section {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

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

.profile-fields {
  flex: 1;
  min-width: 300px;
}

.field-group {
  margin-bottom: 30px;
}

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

/* Genre Picks Section */
.genre-picks-section {
  margin-bottom: 60px;
}

.genre-heading {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
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
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-top: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 60px;
  flex-wrap: wrap;
}

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
  margin-bottom: 0.5rem;
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

/* Responsive Design */
@media (max-width: 768px) {
  .edit-profile-wrapper {
    padding-top: 80px;
  }

  .section-heading {
    font-size: 2rem;
  }

  .profile-info-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-img {
    width: 180px;
    height: 180px;
  }

  .profile-fields {
    width: 100%;
  }

  .genres-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .genre-heading {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 576px) {
  .genres-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .section-heading {
    font-size: 1.5rem;
  }
}
</style>
