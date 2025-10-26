<!-- editprofile.vue - Fan Profile Editor -->
<template>
  <div class="edit-profile-wrapper">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="card shadow">
              <div class="card-body p-4">
                <h2 class="text-center mb-4">Edit Profile</h2>

                <form @submit.prevent="updateProfile">
                  <!-- Profile Image -->
                  <div class="profile-image-container text-center mb-4">
                    <div class="position-relative d-inline-block">
                      <img
                        :src="previewImage || form.profileImage || defaultPfp"
                        alt="Profile Picture"
                        class="profile-img"
                        @click="selectImage"
                      />
                      <button
                        type="button"
                        class="btn btn-primary btn-sm camera-btn"
                        @click="selectImage"
                      >
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
                    <p class="text-muted small mt-2">Click to change photo</p>
                  </div>

                  <!-- Display Name -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Display Name</label>
                    <input v-model="form.displayName" type="text" class="form-control" required />
                  </div>

                  <!-- Email (read-only) -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Email</label>
                    <input v-model="form.email" type="email" class="form-control" disabled />
                    <small class="text-muted">Email cannot be changed</small>
                  </div>

                  <!-- Music Preferences (Genre Selection) -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-music-note-list text-primary"></i> Music Preferences
                    </label>
                    <p class="text-muted small mb-2">
                      Select genres you enjoy (this helps us recommend artists)
                    </p>
                    <div class="genres-grid">
                      <div
                        v-for="genre in availableGenres"
                        :key="genre"
                        class="genre-chip"
                        :class="{ selected: form.genres.includes(genre) }"
                        @click="toggleGenre(genre)"
                      >
                        {{ genre }}
                      </div>
                    </div>
                    <small class="text-muted">{{ form.genres.length }} genre(s) selected</small>
                  </div>

                  <!-- Action Buttons -->
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary py-2" :disabled="uploading">
                      <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ uploading ? 'Uploading...' : 'Save Changes' }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="$router.push(`/profile/${userId}`)"
                    >
                      Cancel
                    </button>
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
import { getAuth } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/services/firebase'
import NavigationBar from '@/components/NavigationBar.vue'
import defaultPfp from '@/assets/defaultPfp.jpg'

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
  min-height: 100vh;
  background: #f8f9fa;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

.card {
  border: none;
  border-radius: 12px;
}

.profile-image-container {
  cursor: pointer;
}

.profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
  transition: opacity 0.3s;
}

.profile-img:hover {
  opacity: 0.8;
}

.camera-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Genre Selection Grid */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 10px;
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
  background-color: #667eea;
  border-color: #667eea;
}

.btn-primary:hover {
  background-color: #5568d3;
  border-color: #5568d3;
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
