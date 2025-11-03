<template>
  <div class="user-profile-page">
    <!-- Dynamic Wave Background -->
    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="#bb1814" stroke-width="2" opacity="0.6">
          <animate attributeName="d" values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                   M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150" dur="3s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                   M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180" dur="4s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate attributeName="d" values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                   M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120" dur="5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="1.5" opacity="0.5">
          <animate attributeName="d" values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                   M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate attributeName="d" values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                   M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate attributeName="d" values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                   M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60" dur="4.5s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#bb1814" stroke-width="0.8" opacity="0.3">
          <animate attributeName="d" values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                   M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240" dur="6s" repeatCount="indefinite" />
        </path>
        <path fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate attributeName="d" values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                   M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>

    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div v-if="loading" class="container py-5">
        <div class="text-center">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-white">Loading profile...</p>
        </div>
      </div>

      <div v-else-if="userData" class="container py-5">
        <!-- Profile Section -->
        <div class="profile-section">
          <div class="row align-items-center">
            <!-- Profile Picture -->
            <div class="col-auto">
              <img :src="userData.profileImage || defaultPfp" alt="Profile Picture" class="profile-picture" />
            </div>

            <!-- User Information -->
            <div class="col">
              <h1 class="user-name">{{ userData.displayName || 'User' }}</h1>
              <p class="user-email">{{ userData.email || '' }}</p>
              <p class="user-last-active"><b>
                  Last active: {{ formatLastActive(userData.lastActive) }}
                </b></p>

              <!-- Genre Tags -->
              <div class="genre-tags">
                <span v-for="genre in (userData.preferredGenres || userData.preferences?.genres || [])" :key="genre"
                  class="genre-tag">
                  {{ genre.toUpperCase() }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons mt-3">
                <button @click="goToEditProfile" class="btn-edit">EDIT PROFILE</button>
                <button @click="confirmDelete" class="btn-delete">DELETE PROFILE</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Following Artists Section -->
        <section class="genre-picks-section">
          <h2 class="genre-heading">FOLLOWING</h2>
          <div class="header-subtitle text-muted mb-4">
            You are following <span class="highlight-number">{{ followingArtists.length }}</span> artist{{
              followingArtists.length !== 1 ? 's' : '' }}
          </div>

          <!-- No Following Artists -->
          <div v-if="followingArtists.length === 0" class="text-center py-5">
            <i class="bi bi-person-x fs-1 text-muted mb-3"></i>
            <h2 class="h4 mb-3 text-white">No following artists yet</h2>
            <p class="text-muted mb-4">Start exploring and follow artists you love!</p>
            <router-link to="/home#discover-artists" class="btn btn-primary">
              Discover Artists
            </router-link>
          </div>

          <!-- Artists Carousel -->
          <div v-else class="carousel-container">
            <button v-if="currentArtistPage > 0" @click="previousArtistPage" class="carousel-arrow left"
              aria-label="Previous artists">
              <i class="bi bi-chevron-left"></i>
            </button>

            <div class="artists-carousel">
              <div class="artists-grid-carousel" :style="{ transform: `translateX(-${currentArtistPage * 100}%)` }">
                <div v-for="(page, pageIndex) in paginatedFollowingArtists" :key="`artist-page-${pageIndex}`"
                  class="carousel-page artists-page row g-3">
                  <div v-for="artist in page" :key="artist.id" class="col-lg-3 col-md-4 col-sm-6">
                    <ArtistCard :artist="artist" />
                  </div>
                </div>
              </div>
            </div>

            <button v-if="currentArtistPage < totalArtistPages - 1" @click="nextArtistPage" class="carousel-arrow right"
              aria-label="Next artists">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, deleteUser, signOut } from 'firebase/auth'
import { doc, getDoc, deleteDoc, collection, getDocs, query, where, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'
import NavigationBar from '@/components/NavigationBar.vue'
import defaultPfp from '@/assets/defaultPfp.jpg'
import ArtistCard from '@/components/ArtistCard.vue'

export default {
  name: 'UserProfile',
  components: {
    NavigationBar,
    ArtistCard,
  },
  data() {
    return {
      userData: null,
      userId: null,
      loading: true,
      followingCount: 0,
      interestedCount: 0,
      defaultPfp: defaultPfp,
      followingArtists: [],
      currentArtistPage: 0,
      artistsPerPage: 4,
    }
  },
  computed: {
    isCurrentUser() {
      return auth.currentUser && this.userId === auth.currentUser.uid
    },
    paginatedFollowingArtists() {
      const pages = []
      let startIndex = 0

      while (startIndex < this.followingArtists.length) {
        const endIndex = Math.min(startIndex + this.artistsPerPage, this.followingArtists.length)
        pages.push(this.followingArtists.slice(startIndex, endIndex))
        startIndex = endIndex
      }
      return pages
    },
    totalArtistPages() {
      return this.paginatedFollowingArtists.length
    },
  },
  async mounted() {
    await this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        this.loading = true
        this.userId = this.$route.params.id

        const docRef = doc(db, 'users', this.userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          this.userData = docSnap.data()

          // Calculate stats
          this.followingCount = this.userData.followingArtists?.length || 0
          this.interestedCount = this.userData.interestedEvents?.length || 0

          // Load following artists if they exist
          if (this.userData.followingArtists && this.userData.followingArtists.length > 0) {
            await this.loadFollowingArtists(this.userData.followingArtists)
          }
        } else {
          console.warn('No such user!')
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        this.loading = false
      }
    },

    formatLastActive(timestamp) {
      if (!timestamp) return 'Unknown'
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    goToEditProfile() {
      this.$router.push(`/edit-profile/${this.userId}`)
    },

    goToArtistProfile(artistId) {
      this.$router.push(`/artist/${artistId}`)
    },

    isFollowingArtist(artistId) {
      return this.userData?.followingArtists?.includes(artistId) || false
    },

    async toggleArtistFollow(artistId) {
      if (!auth.currentUser) {
        alert('Please log in to follow artists')
        return
      }

      if (!this.isCurrentUser) {
        // Don't allow following from someone else's profile
        return
      }

      try {
        const user = auth.currentUser
        const userDocRef = doc(db, 'users', user.uid)
        const isFollowing = this.isFollowingArtist(artistId)

        if (isFollowing) {
          // Unfollow
          await updateDoc(userDocRef, {
            followingArtists: arrayRemove(artistId)
          })
          // Update local state
          this.userData.followingArtists = this.userData.followingArtists.filter(id => id !== artistId)
          this.followingCount = this.followingCount - 1

          // Remove from displayed list
          this.followingArtists = this.followingArtists.filter(artist => artist.id !== artistId)
        } else {
          // Follow
          await updateDoc(userDocRef, {
            followingArtists: arrayUnion(artistId)
          })
          // Update local state
          if (!this.userData.followingArtists) {
            this.userData.followingArtists = []
          }
          this.userData.followingArtists.push(artistId)
          this.followingCount = this.followingCount + 1
        }
      } catch (error) {
        console.error('Error toggling follow:', error)
        alert('Failed to update follow status. Please try again.')
      }
    },

    async loadFollowingArtists(artistIds) {
      try {
        const artists = []

        // Load each artist in batches of 10
        const batches = []
        for (let i = 0; i < artistIds.length; i += 10) {
          batches.push(artistIds.slice(i, i + 10))
        }

        for (const batch of batches) {
          const artistsQuery = query(
            collection(db, 'artists'),
            where('__name__', 'in', batch)
          )

          const artistsSnapshot = await getDocs(artistsQuery)
          artistsSnapshot.docs.forEach(doc => {
            artists.push({
              id: doc.id,
              ...doc.data()
            })
          })
        }

        this.followingArtists = artists

      } catch (error) {
        console.error('Error loading following artists:', error)
      }
    },

    scrollCarousel(direction) {
      // Calculate card width dynamically based on container width
      const container = this.$refs.carouselContainer
      if (!container) return

      const containerWidth = container.offsetWidth
      const gap = 32 // 2rem
      const cardWidth = (containerWidth - (gap * 4)) / 5 + gap // 5 cards visible

      const maxOffset = Math.max(0, (this.followingArtists.length - 5) * cardWidth)

      if (direction === 'right') {
        this.carouselOffset = Math.min(this.carouselOffset + cardWidth * 5, maxOffset)
      } else if (direction === 'left') {
        this.carouselOffset = Math.max(this.carouselOffset - cardWidth * 5, 0)
      }
    },

    nextArtistPage() {
      if (this.currentArtistPage < this.totalArtistPages - 1) {
        this.currentArtistPage++
      }
    },

    previousArtistPage() {
      if (this.currentArtistPage > 0) {
        this.currentArtistPage--
      }
    },

    confirmDelete() {
      if (
        confirm(
          '⚠️ Are you sure you want to delete your account?\n\nThis will:\n• Delete all your data\n• Remove you from followed artists\n• Remove your event interests\n\nThis action CANNOT be undone!',
        )
      ) {
        this.deleteAccount()
      }
    },

    async deleteAccount() {
      try {
        const auth = getAuth()
        const user = auth.currentUser

        if (!user) {
          alert('Please log in again before deleting your account.')
          return
        }

        const userId = user.uid

        // Step 1: Delete all related data from Firestore first
        console.log('🗑️ Deleting user data from Firestore...')

        // Delete user document
        await deleteDoc(doc(db, 'users', userId))
        console.log('✅ User document deleted')

        // If artist, delete artist profile and related data
        try {
          const artistDoc = await getDoc(doc(db, 'artists', userId))
          if (artistDoc.exists()) {
            await deleteDoc(doc(db, 'artists', userId))
            console.log('✅ Artist profile deleted')

            // TODO: Delete artist's events (if needed)
            // TODO: Delete artist's music comments (if needed)
          }
        } catch (e) {
          console.log('ℹ️ No artist profile found')
        }

        // Delete user's notifications
        try {
          const { collection, query, where, getDocs } = await import('firebase/firestore')
          const notificationsQuery = query(
            collection(db, 'notifications'),
            where('recipientId', '==', userId),
          )
          const notificationsSnapshot = await getDocs(notificationsQuery)
          const deletePromises = notificationsSnapshot.docs.map((doc) => deleteDoc(doc.ref))
          await Promise.all(deletePromises)
          console.log(`✅ Deleted ${notificationsSnapshot.size} notifications`)
        } catch (e) {
          console.log('ℹ️ No notifications to delete')
        }

        // Step 2: Delete Firebase Auth account
        console.log('🗑️ Deleting Firebase Auth account...')
        try {
          await deleteUser(user)
          console.log('✅ Firebase Auth account deleted')

          alert(
            '✅ Account deleted successfully. You can now register with this email again if you wish.',
          )
          this.$router.push('/')
        } catch (authError) {
          console.error('❌ Error deleting Auth account:', authError)

          if (authError.code === 'auth/requires-recent-login') {
            // Firestore data is already deleted, but Auth needs re-authentication
            alert(
              '⚠️ Your account data has been deleted from our database.\n\n' +
              'However, for security reasons, you need to log out and log back in, ' +
              'then delete your account again to fully remove it from the authentication system.\n\n' +
              'This will allow you to reuse your email address.',
            )
            await signOut(auth)
            this.$router.push('/login')
          } else {
            // Unexpected error - alert user
            alert(
              '⚠️ Partial deletion occurred.\n\n' +
              'Your data was removed from our database, but there was an issue with the authentication system.\n\n' +
              'Please contact support with this error code: ' +
              authError.code,
            )
            await signOut(auth)
            this.$router.push('/')
          }
        }
      } catch (error) {
        console.error('Error deleting account:', error)

        // If Firestore deletion failed, show error
        alert(
          '❌ Failed to delete account.\n\n' +
          'Please try again or contact support if the issue persists.\n\n' +
          'Error: ' +
          (error.message || 'Unknown error'),
        )
      }
    },
  },
  watch: {
    // Watch for route changes (when navigating from one user profile to another)
    '$route.params.id': {
      handler(newId, oldId) {
        if (newId && newId !== oldId) {
          // Reset state
          this.loading = true
          this.userData = null
          this.userId = ''
          this.followingCount = 0
          this.interestedCount = 0
          this.followingArtists = []
          this.currentArtistPage = 0

          // Reload data for new user
          this.loadUserProfile()
        }
      },
      immediate: false,
    },
  },
}
</script>

<style scoped>
.user-profile-page {
  font-family: 'Poppins', sans-serif;
  background: #191717;
  min-height: 100vh;
  width: 100%;
  color: white;
  padding-top: 100px;
  position: relative;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding-top: 40px;
  padding-bottom: 30px;
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

.user-profile-page::before {
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

/* Profile Section */
.profile-section {
  margin-bottom: 60px;
}

.profile-picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.user-email {
  font-size: 1rem;
  color: white;
  margin-bottom: 0.5rem;
}

.user-last-active {
  font-size: 1rem;
  color: white;
  margin-bottom: 0.5rem;
}

.genre-tags {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.genre-tag {
  background-color: #bb1814;
  color: white;
  padding: 0.1rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.btn-edit,
.btn-delete {
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

.btn-edit:hover,
.btn-delete:hover {
  background: #6E0B0B;
  color: white;
}

.btn-delete {
  background-color: transparent;
  border: 2px solid #bb1814;
  color: white;
}

.btn-delete:hover {
  background-color: #bb1814;
  color: white;
}

.btn-primary {
  background: #bb1814;
  border: none;
  border-radius: 25px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transform: none;
}

.btn-primary:hover {
  background: #960f0c;
}

/* Following Section */
.following-section {
  margin-top: 60px;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

/* Genre Heading (matching EditProfile) */
.genre-heading {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.genre-picks-section {
  margin-bottom: 30px;
}

.section-subtitle {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 2rem;
}

.text-muted {
  color: #b0b1ba !important;
}

/* Following Section - Horizontal Scroll */
.horizontal-scroll {
  overflow-x: auto;
  overflow-y: visible;
  padding: 10px 0;
  min-height: 350px;
}

.horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background-color: #B51414;
  border-radius: 4px;
}

.horizontal-scroll::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.artist-card-container {
  min-width: 250px;
  width: 250px;
  height: 100%;
  display: flex;
}

/* Carousel Container */
.carousel-container {
  position: relative;
  padding: 0;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  color: #000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
}

.carousel-container:hover .carousel-arrow {
  opacity: 1;
  pointer-events: auto;
}

.carousel-arrow:hover {
  background: #bb1814;
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.carousel-arrow.left {
  left: -25px;
}

.carousel-arrow.right {
  right: -25px;
}

.carousel-arrow i {
  font-size: 1.5rem;
}

.artists-carousel {
  overflow: hidden;
  width: 100%;
}

.artists-grid-carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-page.artists-page {
  min-width: 100%;
}

/* Responsive Design - Bootstrap breakpoints */
@media (max-width: 991.98px) {
  .user-profile-page {
    padding-top: 80px;
  }

  .content-wrapper {
    padding-top: 20px;
  }

  .profile-section .row {
    flex-direction: column;
    align-items: center !important;
    text-align: center;
  }

  .profile-picture {
    margin-bottom: 20px;
  }

  .user-name {
    font-size: 2rem;
  }

  .action-buttons {
    justify-content: center;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .genre-tags {
    justify-content: center;
  }
}

@media (max-width: 575.98px) {
  .user-name {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
