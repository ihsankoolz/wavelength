<!-- EditArtistProfile.vue - Artist Profile Editor -->
<template>
  <div class="edit-artist-profile">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <!-- Header -->
            <div class="text-center mb-4">
              <h1 class="display-5 fw-bold mb-2">Edit Artist Profile</h1>
              <p class="text-muted">Update your artist information and music links</p>
            </div>

            <!-- Form Card -->
            <div class="card shadow-lg border-0">
              <div class="card-body p-4 p-md-5">
                <!-- Success/Error Alerts -->
                <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  {{ successMessage }}
                  <button type="button" class="btn-close" @click="successMessage = ''"></button>
                </div>

                <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ errorMessage }}
                  <button type="button" class="btn-close" @click="errorMessage = ''"></button>
                </div>

                <form @submit.prevent="saveProfile">
                  <!-- Profile Image -->
                  <div class="text-center mb-4">
                    <div class="position-relative d-inline-block">
                      <img
                        :src="previewImage || form.profileImage || defaultPfp"
                        alt="Artist Profile"
                        class="profile-avatar"
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
                    <p class="text-muted small mt-2">Click to change profile picture</p>
                  </div>

                  <!-- Artist Name -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-person text-primary"></i> Artist Name
                    </label>
                    <input
                      type="text"
                      v-model="form.artistName"
                      class="form-control form-control-lg"
                      required
                      maxlength="100"
                    />
                  </div>

                  <!-- Bio -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-chat-quote text-primary"></i> Short Bio
                    </label>
                    <textarea
                      v-model="form.bio"
                      class="form-control"
                      rows="3"
                      maxlength="200"
                      placeholder="A short description of your music..."
                    ></textarea>
                    <div class="form-text">{{ form.bio.length }}/200 characters</div>
                  </div>

                  <!-- About Section -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-file-text text-primary"></i> About Me (Detailed)
                    </label>
                    <textarea
                      v-model="form.aboutSection"
                      class="form-control"
                      rows="5"
                      maxlength="1000"
                      placeholder="Tell your story, your musical journey, influences..."
                    ></textarea>
                    <div class="form-text">{{ form.aboutSection.length }}/1000 characters</div>
                  </div>

                  <!-- Genres -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">
                      <i class="bi bi-music-note-list text-primary"></i> Music Genres
                    </label>
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
                    <small class="text-muted"
                      >{{ form.genres.length }} genre(s) selected (max 5)</small
                    >
                  </div>

                  <!-- Social Links Section -->
                  <div class="card bg-light mb-4">
                    <div class="card-body">
                      <h5 class="card-title mb-3">
                        <i class="bi bi-share text-primary"></i> Social Media Links
                      </h5>

                      <!-- Spotify Profile -->
                      <div class="mb-3">
                        <label class="form-label">
                          <i class="bi bi-spotify text-success"></i> Spotify Profile
                        </label>
                        <input
                          type="url"
                          v-model="form.socialLinks.spotify"
                          class="form-control"
                          placeholder="https://open.spotify.com/artist/..."
                        />
                      </div>

                      <!-- YouTube Channel -->
                      <div class="mb-3">
                        <label class="form-label">
                          <i class="bi bi-youtube text-danger"></i> YouTube Channel
                        </label>
                        <input
                          type="url"
                          v-model="form.socialLinks.youtube"
                          class="form-control"
                          placeholder="https://youtube.com/@yourchannel"
                        />
                      </div>

                      <!-- Instagram -->
                      <div class="mb-3">
                        <label class="form-label">
                          <i class="bi bi-instagram text-primary"></i> Instagram
                        </label>
                        <input
                          type="url"
                          v-model="form.socialLinks.instagram"
                          class="form-control"
                          placeholder="https://instagram.com/yourprofile"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-check-circle me-2"></i>
                      {{ loading ? 'Saving...' : 'Save Profile' }}
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
import { auth, db, storage } from '@/services/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import NavigationBar from '@/components/NavigationBar.vue'
import defaultPfp from '@/assets/defaultPfp.jpg'

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
        socialLinks: {
          spotify: '',
          youtube: '',
          instagram: '',
        },
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
    async loadArtistProfile() {
      try {
        const user = auth.currentUser
        if (!user) {
          this.$router.push('/login')
          return
        }

        const artistDoc = await getDoc(doc(db, 'artists', user.uid))
        if (artistDoc.exists()) {
          const data = artistDoc.data()
          this.form = {
            artistName: data.artistName || '',
            bio: data.bio || '',
            aboutSection: data.aboutSection || '',
            genres: data.genres || [],
            profileImage: data.profileImage || '',
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
.edit-artist-profile {
  min-height: 100vh;
  background: #f8f9fa;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

.card {
  border: none;
  border-radius: 16px;
}

/* Profile Avatar */
.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
  cursor: pointer;
  transition: opacity 0.3s;
}

.profile-avatar:hover {
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

.form-label {
  color: #2c3e50;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
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
