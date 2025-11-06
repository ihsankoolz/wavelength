<template>
  <div class="onboarding-wrapper">
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

    <!-- Landing content -->
    <div class="content-wrapper">
      <div class="onboarding-bg px-5 px-md-5">
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

        <div class="onboarding-content px-2 px-md-0">
          <!-- Mobile Title (< 768px) -->
          <h2 class="genre-title d-block d-md-none" style="font-size: 1.5rem">YOUR GENRE PICKS</h2>

          <!-- Desktop Title (≥ 768px) -->
          <h2 class="genre-title d-none d-md-block" style="font-size: 2.8rem">YOUR GENRE PICKS</h2>

          <div class="subtitle mb-5">CHOOSE SOME OF YOUR FAVOURITE GENRES</div>

          <!-- Single Responsive Grid -->
          <div class="genres-grid">
            <div
              v-for="genre in genres"
              :key="genre.name"
              class="genre-avatar"
              :class="{ selected: selectedGenres.includes(genre.name) }"
              @click="toggleGenre(genre.name)"
            >
              <div class="genre-img-wrap">
                <img :src="genre.img" :alt="genre.name" class="genre-img" />
                <span v-if="selectedGenres.includes(genre.name)" class="genre-check">
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
            <span
              >{{ selectedGenres.length }} GENRE{{
                selectedGenres.length !== 1 ? 'S' : ''
              }}
              SELECTED</span
            >
          </div>

          <!-- Mobile Button (< 768px) -->
          <button
            class="main-btn mt-4 mb-2 d-block d-md-none"
            style="padding: 0.8em 0; font-size: 1rem"
            :disabled="isLoading || selectedGenres.length === 0"
            @click="savePreferences"
          >
            CONTINUE TO WAVELENGTH
          </button>

          <!-- Desktop Button (≥ 768px) -->
          <button
            class="main-btn mt-4 mb-2 d-none d-md-block"
            style="padding: 1.09em 0; font-size: 1.15rem"
            :disabled="isLoading || selectedGenres.length === 0"
            @click="savePreferences"
          >
            CONTINUE TO WAVELENGTH
          </button>

          <div class="mt-2 mb-3 text-center skip-text">
            <button
              type="button"
              class="btn btn-link"
              @click="skipOnboarding"
              :disabled="isLoading"
            >
              Skip for Now
            </button>
          </div>

          <div v-if="errorMessage" class="alert alert-danger my-2">
            {{ errorMessage }}
          </div>

          <!-- Rest of content... -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'
import { getGenresWithImages } from '@/constants/genres'

export default {
  name: 'Onboarding',
  data() {
    return {
      genres: getGenresWithImages(),
      selectedGenres: [],
      errorMessage: '',
      isLoading: false,
    }
  },
  methods: {
    toggleGenre(genreName) {
      const i = this.selectedGenres.indexOf(genreName)
      if (i > -1) {
        this.selectedGenres.splice(i, 1)
      } else {
        this.selectedGenres.push(genreName)
      }
      this.errorMessage = ''
    },
    async savePreferences() {
      if (!this.selectedGenres.length) {
        this.errorMessage = 'Please select at least one genre'
        return
      }
      this.isLoading = true
      try {
        const user = auth.currentUser
        if (!user) throw new Error('No user logged in')
        await updateDoc(doc(db, 'users', user.uid), {
          'preferences.genres': this.selectedGenres,
          lastActive: new Date(),
        })
        this.$router.push('/home')
      } catch (error) {
        this.errorMessage = 'Failed to save preferences. Please try again.'
      }
      this.isLoading = false
    },
    skipOnboarding() {
      this.$router.push('/home')
    },
  },
}
</script>

<style scoped>
.content-wrapper {
  position: relative;
  z-index: 1;
}
.onboarding-wrapper {
  min-height: 100vh;
  background: #191717;
  position: relative;
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
}

.meta-action-bar {
  background: transparent;
}

.wave-svg {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100%;
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

.onboarding-wrapper::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background:
    radial-gradient(ellipse at center, rgba(187, 24, 20, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse at 30% 50%, rgba(199, 53, 53, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(187, 24, 20, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.onboarding-bg {
  min-height: 100vh;
  width: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 34px;
  position: relative;
}

.onboarding-logo {
  position: absolute;
  margin: 0;
  z-index: 3;
}

.onboarding-content {
  background: none;
  color: #fff;
  width: 100%;
  max-width: 840px;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.genre-title {
  font-weight: 800;
  letter-spacing: 1.1px;
  text-align: center;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 1.07rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
  opacity: 0.92;
  margin-bottom: 20px;
  text-align: center;
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
  width: 340px;
  max-width: 95vw;
  background: #be1c1b;
  color: #fff;
  font-weight: 800;
  border: none;
  border-radius: 40px;
  letter-spacing: 0.06rem;
  margin-top: 7px;
  box-shadow: 0 6px 36px 0 rgba(168, 39, 25, 0.14);
  transition: background 0.2s;
}

.main-btn:disabled {
  background: #be1c1b77 !important;
  color: #ffffffbb !important;
}

.skip-text .btn-link {
  color: #fff;
  text-decoration: underline;
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.9;
  padding: 0;
}

.skip-text .btn-link:focus,
.skip-text .btn-link:hover {
  color: #be1c1b;
  opacity: 1;
}

.alert-danger {
  background: #a12121;
  color: #fff;
  border: none;
  border-radius: 13px;
  font-weight: 600;
  width: 340px;
  max-width: 95vw;
  text-align: center;
  margin: 0 auto;
  font-size: 1rem;
}

/* Base: Mobile (< 576px) - 3 columns */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px 10px;
  justify-items: center;
  width: 100%;
  max-width: 790px;
  margin: 0 auto;
}

.genre-img-wrap {
  position: relative;
  width: 75px;
  height: 75px;
  border-radius: 50%;
  overflow: hidden;
  background: #191919;
  transition:
    border 0.2s,
    box-shadow 0.2s;
  margin-bottom: 6px;
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

/* Small (≥ 576px) - 4 columns */
@media (min-width: 576px) {
  .genres-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px 12px;
    justify-content: center;
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
    justify-content: center;
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
    justify-content: center;
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
    justify-content: center;
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

/* Keep other styles */
.genre-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
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
</style>
