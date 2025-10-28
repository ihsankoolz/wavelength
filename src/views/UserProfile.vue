<!-- userprofile.vue - Fan Profile View -->
<template>
  <div class="user-profile-page">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
              <p class="mt-3 text-muted">Loading profile...</p>
            </div>

            <!-- Profile Card -->
            <div v-else-if="userData" class="card shadow-lg border-0">
              <div class="card-body p-4 p-md-5">
                <!-- Profile Header -->
                <div class="text-center mb-4">
                  <img
                    :src="userData.profileImage || defaultPfp"
                    alt="Profile Picture"
                    class="profile-img mb-3"
                  />
                  <h2 class="mb-2">{{ userData.displayName || 'Unnamed User' }}</h2>
                  <p class="text-muted mb-1">
                    <i class="bi bi-envelope me-2"></i>{{ userData.email }}
                  </p>
                  <p class="text-muted small">
                    <i class="bi bi-clock me-2"></i>Last active:
                    {{ formatLastActive(userData.lastActive) }}
                  </p>
                </div>

                <!-- Music Preferences Section -->
                <div class="preferences-section mb-4">
                  <h5 class="mb-3">
                    <i class="bi bi-music-note-list text-primary"></i> Music Preferences
                  </h5>
                  <div
                    v-if="userData.preferences?.genres && userData.preferences.genres.length > 0"
                  >
                    <div class="genres-display">
                      <span
                        v-for="genre in userData.preferences.genres"
                        :key="genre"
                        class="badge bg-primary me-2 mb-2"
                        style="font-size: 0.95rem; padding: 0.5rem 1rem"
                      >
                        {{ genre }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    No music preferences set yet.
                    <router-link :to="`/edit-profile/${userId}`">Add your preferences</router-link>
                    to get personalized recommendations!
                  </div>
                </div>

                <!-- Account Stats -->
                <div class="stats-section mb-4">
                  <div class="row text-center g-3">
                    <div class="col-6">
                      <div class="stat-box p-3">
                        <i class="bi bi-people fs-3 text-primary mb-2"></i>
                        <div class="fw-bold fs-4">{{ followingCount }}</div>
                        <div class="text-muted small">Following Artists</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="stat-box p-3">
                        <i class="bi bi-heart fs-3 text-danger mb-2"></i>
                        <div class="fw-bold fs-4">{{ interestedCount }}</div>
                        <div class="text-muted small">Interested Events</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2 mb-3">
                  <button @click="goToEditProfile" class="btn btn-primary btn-lg">
                    <i class="bi bi-pencil me-2"></i> Edit Profile
                  </button>
                  <router-link to="/my-interests" class="btn btn-outline-primary">
                    <i class="bi bi-heart me-2"></i> View My Interests
                  </router-link>
                </div>

                <!-- Delete Account Button -->
                <div class="text-center pt-3 border-top">
                  <button @click="confirmDelete" class="btn btn-link text-danger small">
                    <i class="bi bi-trash me-2"></i> Delete Account
                  </button>
                </div>
              </div>
            </div>

            <!-- No Profile Found -->
            <div v-else class="text-center py-5">
              <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
              <h3>Profile Not Found</h3>
              <p class="text-muted">Unable to load profile information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, deleteUser } from 'firebase/auth'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import NavigationBar from '@/components/NavigationBar.vue'
import defaultPfp from '@/assets/defaultPfp.jpg'

export default {
  name: 'UserProfile',
  components: {
    NavigationBar,
  },
  data() {
    return {
      userData: null,
      userId: null,
      loading: true,
      followingCount: 0,
      interestedCount: 0,
      defaultPfp: defaultPfp,
    }
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
            await auth.signOut()
            this.$router.push('/login')
          } else {
            // Unexpected error - alert user
            alert(
              '⚠️ Partial deletion occurred.\n\n' +
                'Your data was removed from our database, but there was an issue with the authentication system.\n\n' +
                'Please contact support with this error code: ' +
                authError.code,
            )
            await auth.signOut()
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
  min-height: 100vh;
  background: #f8f9fa;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

.card {
  border-radius: 16px;
}

.profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.genres-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preferences-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.stat-box {
  background: #f8f9fa;
  border-radius: 12px;
  transition: transform 0.3s;
}

.stat-box:hover {
  transform: translateY(-5px);
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

.btn-outline-primary {
  border: 2px solid #667eea;
  color: #667eea;
  font-weight: 600;
}

.btn-outline-primary:hover {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-top: 100px;
  }

  .profile-img {
    width: 120px;
    height: 120px;
  }
}
</style>
