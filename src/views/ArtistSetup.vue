<!-- ArtistSetUp.vue -->
<template>
  <div class="artist-setup">
    <!-- Animated SVG Wave -->
    <!-- Wave SVG Background -->
    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path id="wave1" fill="none" stroke="#B51414" stroke-width="2" opacity="0.6">
          <animate
            attributeName="d"
            values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                    M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                    M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave2" fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                    M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                    M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave3" fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                    M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                    M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave4" fill="none" stroke="#B51414" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                    M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                    M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave5" fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate
            attributeName="d"
            values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                    M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                    M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave6" fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate
            attributeName="d"
            values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                    M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                    M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave7" fill="none" stroke="#B51414" stroke-width="0.8" opacity="0.3">
          <animate
            attributeName="d"
            values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                    M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                    M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave8" fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
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

    <div class="content-wrapper py-3">
      <!-- Logo -->
      <!-- Mobile Logo (< 768px) -->
        <img
          src="/assets/logo1.png"
          alt="Wavelength"
          class="onboarding-logo d-block d-md-none"
          style="width: 90px; top: 22px; left: 60px"
        />

        <!-- Desktop Logo (≥ 768px) -->
        <img
          src="/assets/logo1.png"
          alt="Wavelength"
          class="onboarding-logo d-none d-md-block"
          style="width: 120px; top: 22px; left: 60px"
        />

      <div class="profile-container px-5">
        <!-- Mobile Headings (< 768px) -->
        <h2 class="profile-title d-block d-md-none" style="font-size: 1.8rem;">
          COMPLETE YOUR PROFILE
        </h2>
        <div class="subtitle d-block d-md-none" style="font-size: 0.95rem">
          LET'S BUILD YOUR STAGE ON WAVELENGTH
        </div>

        <!-- Desktop Headings (≥ 768px) -->
        <h2 class="profile-title d-none d-md-block" style="font-size: 3rem">
          COMPLETE YOUR PROFILE
        </h2>
        <div class="subtitle d-none d-md-block" style="font-size: 1.12rem">
          LET'S BUILD YOUR STAGE ON WAVELENGTH
        </div>

        <form @submit.prevent="submitProfile" class="profile-form">
          <!-- Display Name -->
          <div class="form-group">
            <label class="input-label">DISPLAY NAME</label>
            <input
              v-model="formData.displayName"
              type="text"
              maxlength="50"
              class="profile-input"
              placeholder="Display Name"
              required
              autocomplete="off"
            />
          </div>

          <!-- Artist Bio -->
          <div class="form-group">
            <label class="input-label">ARTIST BIO</label>
            <textarea
              v-model="formData.bio"
              maxlength="500"
              rows="2"
              class="profile-textarea"
              placeholder="Give a quick introduction you and your music."
              required
            ></textarea>
            <div class="input-help">{{ formData.bio.length }}/500 characters</div>
          </div>

          <!-- About You -->
          <div class="form-group">
            <label class="input-label">ABOUT YOU</label>
            <textarea
              v-model="formData.about"
              maxlength="1000"
              rows="3"
              class="profile-textarea"
              placeholder="Share your story, inspirations, and what drives your music."
              required
            ></textarea>
            <div class="input-help">{{ formData.about.length }}/1000 characters</div>
          </div>

          <!-- Genre Picker -->
<div class="form-group">
  <label class="input-label mb-3">MUSIC GENRES (SELECT UP TO 5)</label>

  <!-- Single Responsive Grid -->
  <div class="genres-grid">
    <div
      v-for="genre in genres"
      :key="genre.name"
      class="genre-avatar"
      :class="{ selected: formData.genres.includes(genre.name) }"
      @click="toggleGenre(genre.name)"
    >
      <div class="genre-img-wrap">
        <img :src="genre.img" :alt="genre.name" class="genre-img" />
        <span v-if="formData.genres.includes(genre.name)" class="genre-check">
          <svg width="100%" height="100%" viewBox="0 0 55 55">
            <circle cx="27.5" cy="27.5" r="27.5" fill="black" fill-opacity="0.55" />
            <polyline
              points="16,30 25,39 40,21"
              fill="none"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="square"
              stroke-linejoin="square"
            />
          </svg>
        </span>
      </div>
      <div class="genre-label">{{ genre.name.toUpperCase() }}</div>
    </div>
  </div>
  <div class="genre-count text-center mt-4">
    <span>
      {{ formData.genres.length }} GENRE{{ formData.genres.length !== 1 ? 'S' : '' }} SELECTED
    </span>
  </div>
</div>


          <!-- Socials -->
          <div class="form-group">
            <label class="input-label mb-2">YOUR SOCIALS (OPTIONAL)</label>
            <input
              v-model="formData.socials.spotify"
              type="url"
              class="profile-input mb-3"
              placeholder="Spotify profile URL"
              autocomplete="off"
            />
            <input
              v-model="formData.socials.youtube"
              type="url"
              class="profile-input mb-3"
              placeholder="YouTube channel URL"
              autocomplete="off"
            />
            <input
              v-model="formData.socials.instagram"
              type="url"
              class="profile-input"
              placeholder="Instagram profile URL"
              autocomplete="off"
            />
          </div>

          <!-- Mobile Button (< 768px) -->
          <button
            class="main-btn d-block d-md-none"
            style="font-size: 1rem; padding: 0.9em 0"
            :disabled="loading || !canSubmit"
          >
            {{ loading ? 'Saving...' : 'COMPLETE SETUP' }}
          </button>

          <!-- Desktop Button (≥ 768px) -->
          <button
            class="main-btn d-none d-md-block"
            style="font-size: 1.13rem; padding: 1.13em 0"
            :disabled="loading || !canSubmit"
          >
            {{ loading ? 'Saving...' : 'COMPLETE SETUP' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'
import { getGenresWithImages } from '@/constants/genres'

export default {
  name: 'ArtistSetup',
  data() {
    return {
      loading: false,
      errorMessage: '',
      formData: {
        displayName: '',
        bio: '',
        about: '',
        genres: [],
        socials: { spotify: '', youtube: '', instagram: '' },
      },
      genres: getGenresWithImages(),
    }
  },
  computed: {
    canSubmit() {
      return (
        this.formData.displayName.trim() &&
        this.formData.bio.trim() &&
        this.formData.about.trim() &&
        this.formData.genres.length > 0 &&
        this.formData.genres.length <= 5
      )
    },
  },
  methods: {
    toggleGenre(genreName) {
      const i = this.formData.genres.indexOf(genreName)
      if (i > -1) {
        this.formData.genres.splice(i, 1)
      } else if (this.formData.genres.length < 5) {
        this.formData.genres.push(genreName)
      }
    },
    async submitProfile() {
      if (!this.canSubmit) {
        this.errorMessage = 'Please fill in all required fields and select 1–5 genres.'
        return
      }
      this.loading = true
      this.errorMessage = ''
      try {
        const user = auth.currentUser
        if (!user) throw new Error('User not authenticated')

        // Update User doc (profile basics for account)
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: this.formData.displayName,
          'preferences.genres': this.formData.genres,
          profileCompleted: true,
          lastActive: new Date(),
        })

        // Create or update Artist doc (artist profile specifics)
        await setDoc(
          doc(db, 'artists', user.uid),
          {
            artistName: this.formData.displayName,
            bio: this.formData.bio,
            about: this.formData.about,
            genres: this.formData.genres,
            socialLinks: {
              spotify: this.formData.socials.spotify || '',
              youtube: this.formData.socials.youtube || '',
              instagram: this.formData.socials.instagram || '',
            },
            profileSetupCompleted: true,
            updatedAt: new Date(),
          },
          { merge: true },
        )

        // Success: Route to dashboard
        this.$router.push('/artist/dashboard')
      } catch (e) {
        this.errorMessage = 'Failed to save profile. Please try again.'
      }
      this.loading = false
    },
  },
}
</script>

<style scoped>
.content-wrapper {
  position: relative;
  z-index: 1;
}
.artist-setup {
  min-height: 100vh;
  background: #191717;
  position: relative;
  font-family: 'Poppins', sans-serif;
}

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

.artist-setup::before {
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

.profile-container {
  max-width: 700px;
  margin: 0 auto;
  width: 94vw;
  padding-top: 100px;
  color: #fff;
}

.onboarding-logo {
  width: 120px;
  position: absolute;
  top: 22px;
  left: 60px;
  margin: 0;
  z-index: 3;
}

.profile-title {
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.4em;
  letter-spacing: 1.5px;
}

.subtitle {
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 36px;
  opacity: 0.97;
}

.profile-form {
  margin-top: 10px;
}

.form-group {
  margin-bottom: 34px;
}

.input-label {
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: 0.02rem;
  margin-bottom: 7px;
  color: #fff;
  display: block;
}

.profile-input,
.profile-textarea {
  width: 100%;
  background: #2d2a2b;
  opacity: 70%;
  color: #fff;
  border-radius: 11px;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 18px 16px;
  margin-top: 4px;
  outline: none;
  box-shadow: none;
  transition: border 0.2s;
}

.profile-input:focus,
.profile-textarea:focus {
  border-bottom: 2.5px solid #b51414;
  background: #242020;
}

.profile-textarea {
  min-height: 46px;
  resize: vertical;
}

.input-help {
  font-size: 13px;
  color: #b7b7b7;
  margin-top: 2px;
}

.genres-grid {
  justify-items: center;
  width: 100%;
  max-width: 790px;
  margin: 0 auto;
}

.genre-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.genre-avatar .genre-img-wrap {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  background: #191919;
  transition: border 0.2s, box-shadow 0.2s;
  margin-bottom: 7px;
}

.genre-avatar .genre-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: filter 0.2s;
}

.genre-avatar.selected .genre-img {
  filter: brightness(0.75);
}

.genre-avatar .genre-check {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.genre-label {
  color: #fff;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.02rem;
  margin-top: 2px;
  margin-bottom: 0;
  text-shadow: 0px 1.5px 8px rgba(16, 16, 16, 0.21);
}

.genre-avatar.selected .genre-label {
  color: #fff;
  opacity: 1;
}

.genre-count {
  font-size: 1.08rem;
  letter-spacing: 0.8px;
  color: #fff;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 4px;
}

.main-btn {
  width: 100%;
  background: #b51414;
  color: #fff;
  font-weight: 900;
  border: none;
  border-radius: 32px;
  margin-top: 22px;
  margin-bottom: 60px;
  box-shadow: 0 9px 28px 0 rgba(180, 21, 20, 0.12);
  transition: background 0.18s;
}

.main-btn:disabled {
  background: #6b2c2c !important;
  color: #fff !important;
}

/* Base: Mobile (< 576px) - 3 columns */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px 10px;
  justify-items: center;
  justify-content: center;
  width: 100%;
  max-width: 790px;
  margin: 0 auto;
  padding: 0 10px;
}

.genre-img-wrap {
  position: relative;
  width: 75px;
  height: 75px;
  border-radius: 50%;
  overflow: hidden;
  background: #191919;
  transition: border 0.2s, box-shadow 0.2s;
  margin-bottom: 6px;
}

.genre-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  background: none;
}

.genre-avatar .genre-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: filter 0.2s;
}

.genre-avatar.selected .genre-img {
  filter: brightness(0.75);
}

.genre-avatar .genre-check {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.genre-label {
  color: #fff;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.02rem;
  margin-top: 6px;
  margin-bottom: 0;
  background: none;
  padding: 0;
}

.genre-avatar.selected .genre-label {
  color: #fff;
  opacity: 1;
}

/* Small (≥ 576px) - 4 columns */
@media (min-width: 576px) {
  .genres-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px 12px;
    max-width: 600px;
  }
  
  .genre-img-wrap {
    width: 86px;
    height: 86px;
  }
  
  .genre-label {
    font-size: 0.9rem;
    margin-top: 7px;
  }
}

/* Medium (≥ 768px) - 5 columns */
@media (min-width: 768px) {
  .genres-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px 16px;
    max-width: 700px;
  }
  
  .genre-img-wrap {
    width: 95px;
    height: 95px;
  }
  
  .genre-label {
    font-size: 0.95rem;
    margin-top: 8px;
  }
}

/* Large (≥ 992px) - 6 columns */
@media (min-width: 992px) {
  .genres-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 28px 20px;
    max-width: 790px;
  }
  
  .genre-img-wrap {
    width: 105px;
    height: 105px;
  }
  
  .genre-label {
    font-size: 1rem;
  }
}

/* Extra Large (≥ 1200px) - 7 columns */
@media (min-width: 1200px) {
  .genres-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 34px 24px;
    max-width: 950px;
    padding: 0 20px;
  }
  
  .genre-img-wrap {
    width: 110px;
    height: 110px;
    margin-bottom: 8px;
  }
  
  .genre-label {
    font-size: 1.05rem;
    letter-spacing: 0.03rem;
  }
}

.genre-count {
  font-size: 1.08rem;
  letter-spacing: 0.8px;
  color: #fff;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 4px;
}

</style>