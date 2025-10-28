<!-- artistDashbord.vue -->
<template>
  <div class="dashboard-content">
    <NavigationBar />

    <!-- Loading State -->
    <div v-if="loading" class="container-fluid bg-light p-4">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading artist profile...</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container-fluid bg-danger text-white p-4">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center">
          <h3>Profile Setup Required</h3>
          <p>{{ error }}</p>
          <button @click="goToSetup" class="btn btn-light">Complete Profile Setup</button>
        </div>
      </div>
    </div>

    <!-- Artist Profile Display -->
    <div v-else class="content-wrapper">
      <div class="container-fluid p-4">
        <div class="row justify-content-center">
          <!-- Artist Header -->
          <div class="col-12 text-center mb-4">
            <h1 class="display-4 fw-bold mb-2">{{ artistData.artistName || 'Artist Name' }}</h1>
            <p class="lead mb-3">{{ artistData.bio || 'No bio available' }}</p>
          </div>

          <!-- Genres Display -->
          <div class="col-12 text-center mb-4">
            <h6 class="mb-3">Music Genres</h6>
            <div v-if="artistData.genres && artistData.genres.length > 0">
              <span
                v-for="genre in artistData.genres"
                :key="genre"
                class="badge bg-dark me-2 mb-2 px-3 py-2"
                style="font-size: 0.9rem"
              >
                {{ genre }}</span
              >
            </div>
            <div v-else>
              <span class="badge bg-secondary">No genres selected</span>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="col-12">
            <ul class="nav nav-tabs nav-justified mb-4" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'music' }"
                  @click="activeTab = 'music'"
                  type="button"
                >
                  Music
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'events' }"
                  @click="activeTab = 'events'"
                  type="button"
                >
                  Events
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'about' }"
                  @click="activeTab = 'about'"
                  type="button"
                >
                  About
                </button>
              </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Music Tab - NEW MusicManager Component -->
              <div
                v-if="activeTab === 'music'"
                class="tab-pane show active"
                style="display: block !important; opacity: 1 !important"
              >
                <div class="music-tab-wrapper">
                  <MusicManager
                    v-if="artistData.uid"
                    :artistId="artistData.uid"
                    @music-updated="onMusicUpdated"
                  />
                </div>
              </div>

              <!-- Events Tab -->
              <div
                v-if="activeTab === 'events'"
                class="tab-pane show active"
                style="display: block !important; opacity: 1 !important"
              >
                <div v-if="eventsLoading" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading events...</span>
                  </div>
                  <p class="mt-2 text-muted">Loading your events...</p>
                </div>
                <div v-else>
                  <!-- Header with Add Event Button -->
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h4 class="mb-1">🎪 My Events</h4>
                      <p class="text-muted mb-0">Manage your upcoming performances</p>
                    </div>
                    <button @click="addEvent" class="btn btn-primary">📅 Add New Event</button>
                  </div>
                </div>

                <div v-if="artistEvents.length === 0" class="text-center py-5">
                  <div
                    style="
                      background: #f8f9fa;
                      padding: 40px;
                      border-radius: 10px;
                      border: 2px dashed #dee2e6;
                    "
                  >
                    <i class="bi bi-calendar-event display-4 text-muted mb-3"></i>
                    <h5 class="text-muted mb-3">No events scheduled yet</h5>
                    <p class="text-muted mb-4">
                      Create your first event to start building your audience!
                    </p>
                    <button @click="addEvent" class="btn btn-primary btn-lg">
                      📅 Create Your First Event
                    </button>
                  </div>
                </div>

                <div v-else class="row g-4">
                  <div
                    v-for="event in artistEvents"
                    :key="event.id"
                    class="col-12 col-md-6 col-lg-4"
                  >
                    <div class="card h-100 event-card">
                      <div class="card-body d-flex flex-column">
                        <!-- Event Title -->
                        <h5 class="card-title text-primary fw-bold mb-2">
                          {{ event.title || 'Untitled Event' }}
                        </h5>

                        <!-- Event Date & Time -->
                        <div class="mb-2">
                          <small class="text-muted">
                            <i class="bi bi-calendar me-1"></i>
                            {{ formatEventDate(event.date) }}
                            <span v-if="formatEventTime(event.date)" class="ms-2">
                              <i class="bi bi-clock me-1"></i>
                              {{ formatEventTime(event.date) }}
                            </span>
                          </small>
                        </div>

                        <!-- Event Location -->
                        <div v-if="event.location" class="mb-2">
                          <small class="text-muted">
                            <i class="bi bi-geo-alt me-1"></i>
                            {{ event.location }}
                          </small>
                        </div>

                        <!-- Event Description -->
                        <p v-if="event.description" class="card-text text-muted small mb-3">
                          {{
                            event.description.length > 100
                              ? event.description.substring(0, 100) + '...'
                              : event.description
                          }}
                        </p>
                      </div>

                      <!-- Card Actions -->
                      <div class="card-footer bg-light">
                        <div class="btn-group w-100" role="group">
                          <button
                            class="btn btn-outline-primary btn-sm"
                            @click="editEvent(event.id)"
                          >
                            <i class="bi bi-pencil"></i> Edit
                          </button>
                          <button class="btn btn-outline-info btn-sm" @click="viewEvent(event.id)">
                            <i class="bi bi-eye"></i> View
                          </button>
                          <button
                            class="btn btn-outline-danger btn-sm"
                            @click="deleteEvent(event.id)"
                          >
                            <i class="bi bi-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <div style="background: #007bff; color: white; padding: 40px; text-align: center; border-radius: 10px;">
            <h4>🎪 EVENTS TAB IS WORKING!</h4>
            <p>No events scheduled at the moment</p>
            <button @click="addEvent" class="btn btn-light">📅 Add Event</button>
            </div> -->
              </div>

              <!-- About Tab -->
              <div
                v-if="activeTab === 'about'"
                class="tab-pane show active"
                style="display: block !important; opacity: 1 !important"
              >
                <div
                  style="
                    background: #28a745;
                    color: white;
                    padding: 40px;
                    text-align: center;
                    border-radius: 10px;
                  "
                >
                  <h4>About {{ artistData.artistName || 'Artist Name' }}!</h4>
                  <p>{{ artistData.aboutSection || 'No about section available.' }}</p>
                  <div v-if="hasSocialLinks" class="social-links mt-4">
                    <h5>Connect With Me!</h5>
                    <div class="d-flex flex-wrap gap-2 justify-content-center">
                      <a
                        v-if="artistData.socialLinks?.spotify"
                        :href="artistData.socialLinks.spotify"
                        target="_blank"
                        class="btn btn-success btn-sm"
                      >
                        Spotify
                      </a>
                      <a
                        v-if="artistData.socialLinks?.youtube"
                        :href="artistData.socialLinks.youtube"
                        target="_blank"
                        class="btn btn-danger btn-sm"
                      >
                        YouTube
                      </a>
                      <a
                        v-if="artistData.socialLinks?.instagram"
                        :href="artistData.socialLinks.instagram"
                        target="_blank"
                        class="btn btn-primary btn-sm"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions - Only show for profile owner -->
          <div v-if="isOwner" class="col-12 text-center mt-4">
            <div class="btn-group" role="group">
              <button @click="editProfile" class="btn btn-outline-dark">✏️ Edit Profile</button>
              <button @click="viewAnalytics" class="btn btn-outline-dark">📊 Analytics</button>
            </div>
          </div>
        </div>
        <!-- End of main row -->
      </div>
      <!-- End of container-fluid -->
    </div>
    <!-- End of content-wrapper -->
    <!-- End of v-else (Artist Profile Display) -->
  </div>
  <!-- End of dashboard-content -->

  <!-- Delete Confirmation Modal -->
  <div
    class="modal fade"
    id="deleteEventModal"
    tabindex="-1"
    aria-labelledby="deleteEventModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteEventModalLabel">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirm Delete
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">Are you sure you want to delete this event?</p>
          <p class="text-muted small mb-0">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="deleting">
            <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-trash me-2"></i>
            {{ deleting ? 'Deleting...' : 'Delete Event' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Success Toast -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="successToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-success text-white">
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong class="me-auto">Success</strong>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        {{ successMessage }}
      </div>
    </div>
  </div>

  <!-- Error Toast -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="errorToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-danger text-white">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <strong class="me-auto">Error</strong>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/services/firebase'
import NavigationBar from '@/components/NavigationBar.vue'
import EventCard from '@/components/EventCard.vue'
import MusicManager from '@/components/MusicManager.vue'

export default {
  name: 'ArtistDashboard',
  components: {
    NavigationBar,
    EventCard,
    MusicManager,
  },
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const error = ref(null)
    const currentUser = ref(null)
    const activeTab = ref('music')
    //event tab
    const artistEvents = ref([])
    const eventsLoading = ref(false)

    // Delete modal state
    const eventToDelete = ref(null)
    const deleting = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    // Initialize artistData with uid field
    const artistData = reactive({
      uid: '', // Add uid to store the profile owner's ID
      artistName: '',
      bio: '',
      aboutSection: '',
      latestSingle: '',
      latestAlbum: '',
      genres: [],
      socialLinks: {
        spotify: '',
        youtube: '',
        instagram: '',
      },
      followerCount: 0,
      musicLinks: [],
      verified: false,
      createdAt: null,
      profileSetupCompleted: false,
    })

    // DECLARE ALL FUNCTIONS AND COMPUTED PROPERTIES FIRST

    // Computed property to check if artist has social links
    const hasSocialLinks = computed(() => {
      const links = artistData.socialLinks || {}
      return links.spotify || links.youtube || links.instagram
    })

    // ✅ FIXED: Computed property to check if current user is profile owner
    const isOwner = computed(() => {
      return currentUser.value && currentUser.value.uid === artistData.uid
    })

    const loadArtistEvents = async (artistId) => {
      try {
        eventsLoading.value = true

        console.log('Looking for events with artistId:', artistId)

        // Query events where artistId matches the current artist
        const eventsQuery = query(collection(db, 'events'), where('artistId', '==', artistId))

        const eventsSnapshot = await getDocs(eventsQuery)

        console.log('Found events:', eventsSnapshot.docs.length)

        artistEvents.value = eventsSnapshot.docs.map((doc) => {
          const data = doc.data()
          console.log('Event data:', data)
          return {
            id: doc.id,
            ...data,
          }
        })

        // Sort events by date in JavaScript instead of Firestore
        artistEvents.value.sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
          return dateA - dateB
        })

        console.log('Loaded and sorted artist events:', artistEvents.value)
      } catch (err) {
        console.error('Error loading artist events:', err)
      } finally {
        eventsLoading.value = false
      }
    }

    // Format date for events
    const formatEventDate = (timestamp) => {
      if (!timestamp) return 'Date TBD'

      let date
      if (timestamp.toDate) {
        date = timestamp.toDate()
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        date = new Date(timestamp)
      }

      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    // Format time for events
    const formatEventTime = (timestamp) => {
      if (!timestamp) return ''

      let date
      if (timestamp.toDate) {
        date = timestamp.toDate()
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        date = new Date(timestamp)
      }

      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    }

    // Event management -- placeholders for now
    const editEvent = (eventId) => {
      router.push(`/events/edit/${eventId}`)
    }

    const viewEvent = (eventId) => {
      router.push(`/events/${eventId}`)
    }

    const deleteEvent = (eventId) => {
      // Store the event ID and show the modal
      eventToDelete.value = eventId
      const modal = new window.bootstrap.Modal(document.getElementById('deleteEventModal'))
      modal.show()
    }

    const confirmDelete = async () => {
      if (!eventToDelete.value) return

      deleting.value = true

      try {
        // Delete the event from Firestore
        await deleteDoc(doc(db, 'events', eventToDelete.value))

        // Remove the event from the local array to update UI immediately
        artistEvents.value = artistEvents.value.filter((event) => event.id !== eventToDelete.value)

        // Close the modal
        const modal = window.bootstrap.Modal.getInstance(
          document.getElementById('deleteEventModal'),
        )
        modal.hide()

        // Show success toast
        successMessage.value = 'Event deleted successfully!'
        showToast('successToast')

        console.log('Event deleted successfully:', eventToDelete.value)
      } catch (error) {
        console.error('Error deleting event:', error)

        // Close the modal
        const modal = window.bootstrap.Modal.getInstance(
          document.getElementById('deleteEventModal'),
        )
        modal.hide()

        // Show error toast
        errorMessage.value = 'Failed to delete event. Please try again.'
        showToast('errorToast')
      } finally {
        deleting.value = false
        eventToDelete.value = null
      }
    }

    const showToast = (toastId) => {
      const toastElement = document.getElementById(toastId)
      const toast = new window.bootstrap.Toast(toastElement)
      toast.show()
    }

    const getSpotifyEmbedUrl = (url) => {
      if (!url) return null
      // Convert https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
      // to https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh
      return url.replace('open.spotify.com/', 'open.spotify.com/embed/')
    }

    const getYouTubeEmbedUrl = (url) => {
      if (!url) return null
      let videoId = ''

      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0]
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0]
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }

    // Format date for display
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A'

      let date
      if (timestamp.toDate) {
        date = timestamp.toDate()
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        date = new Date(timestamp)
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    }

    // Navigation methods
    const goToSetup = () => {
      router.push('/artist/setup')
    }

    const editProfile = () => {
      router.push('/artist/edit-profile')
    }

    const addEvent = () => {
      router.push('/events/create')
    }

    const viewAnalytics = () => {
      router.push('/artist/analytics')
    }

    // Handle music updates from MusicManager component
    const onMusicUpdated = async () => {
      console.log('Music updated - refreshing artist data')
      if (currentUser.value) {
        await loadArtistData(currentUser.value.uid)
      }
    }

    // Load artist data from Firestore
    const loadArtistData = async (userId) => {
      try {
        loading.value = true
        error.value = null

        // Get artist document from Firestore
        const artistDoc = await getDoc(doc(db, 'artists', userId))

        if (artistDoc.exists()) {
          const data = artistDoc.data()
          console.log('Artist data loaded:', data)

          // Check if profile setup is completed
          if (!data.profileSetupCompleted) {
            error.value = 'Please complete your profile setup to access the dashboard.'
            return
          }

          // ✅ FIXED: Update reactive data and store the uid
          Object.assign(artistData, {
            uid: userId, // Store the user ID for ownership checking
            artistName: data.artistName || 'Unknown Artist',
            bio: data.bio || 'No bio available',
            aboutSection: data.aboutSection || '',
            latestSingle: data.latestSingle || '',
            latestAlbum: data.latestAlbum || '',
            spotifyTrackUrl: data.spotifyTrackUrl || '',
            youtubeVideoUrl: data.youtubeVideoUrl || '',
            genres: data.genres || [],
            socialLinks: data.socialLinks || {
              spotify: '',
              youtube: '',
              instagram: '',
            },
            followerCount: data.followerCount || 0,
            musicLinks: data.musicLinks || [],
            verified: data.verified || false,
            createdAt: data.createdAt,
            profileSetupCompleted: data.profileSetupCompleted || false,
          })
          await loadArtistEvents(userId)
        } else {
          error.value = 'Artist profile not found. Please complete your registration.'
        }
      } catch (err) {
        console.error('Error loading artist data:', err)
        error.value = 'Failed to load artist profile. Please try refreshing the page.'
      } finally {
        loading.value = false
      }
    }

    // Initialize component
    onMounted(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUser.value = user
          loadArtistData(user.uid)
        } else {
          error.value = 'Please log in to access your dashboard.'
          loading.value = false
        }
      })

      return () => unsubscribe()
    })

    return {
      artistData,
      loading,
      error,
      activeTab,
      hasSocialLinks,
      isOwner,
      artistEvents,
      eventsLoading,
      formatDate,
      formatEventDate,
      formatEventTime,
      editEvent,
      viewEvent,
      deleteEvent,
      confirmDelete,
      eventToDelete,
      deleting,
      successMessage,
      errorMessage,
      goToSetup,
      editProfile,
      addEvent,
      viewAnalytics,
      getSpotifyEmbedUrl,
      getYouTubeEmbedUrl,
      onMusicUpdated,
    }
  },
}
</script>

<style scoped>
.dashboard-content {
  min-height: 100vh;
  padding-top: 100px; /* ⭐ Space for fixed navbar */
  background: #f8f9fa; /* Optional: add background color */
}

.display-4 {
  font-size: 2.5rem;
}

.badge {
  font-size: 0.85rem;
}

/* Tab Styles */
.nav-tabs {
  border-bottom: 3px solid #667eea;
}

.nav-tabs .nav-link {
  border: none;
  color: #666;
  font-weight: 600;
  padding: 15px 20px;
  margin-bottom: -3px;
}

.nav-tabs .nav-link.active {
  background-color: #667eea;
  color: white;
  border-radius: 10px 10px 0 0;
}

.nav-tabs .nav-link:hover {
  color: #667eea;
}

/* Music Section */
.music-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  min-height: 150px;
}

.music-placeholder {
  background: #f8f9fa;
  padding: 40px 20px;
  border-radius: 8px;
  text-align: center;
  min-height: 100px;
}

.content-wrapper {
  margin-top: 110px;
  padding-bottom: 40px;
}

.embed-placeholder {
  background: #e9ecef;
  padding: 30px;
  margin: 20px 0;
  border-radius: 5px;
  border: 2px dashed #adb5bd;
  min-height: 80px;
}

.spotify-embed {
  background: #1db954 !important;
  color: white !important;
}

/* About Section */
.about-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
}

.social-links {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.stats-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.stat-card {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

/* Button Styles */
.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.btn-group .btn:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.tab-content {
  min-height: 300px;
}

.tab-pane {
  display: block !important;
  min-height: 200px;
}

.tab-pane:not(.show) {
  display: none !important;
}

/* Music Tab Wrapper */
.music-tab-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Embed Wrappers */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
}

.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.spotify-wrapper {
  border-radius: 12px;
  overflow: hidden;
  background: #1db954;
}

.spotify-iframe {
  border-radius: 12px;
  min-height: 152px;
}

.embed-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-top: 15px;
}

.embed-description {
  color: #666;
  margin-bottom: 15px;
  font-weight: 500;
  text-align: center;
}

/* ⭐ MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .dashboard-content {
    padding-top: 80px; /* ⭐ Less padding for mobile navbar */
  }

  .display-4 {
    font-size: 2rem;
  }

  .btn-group {
    flex-direction: column;
  }

  .btn-group .btn {
    border-radius: 0.375rem !important;
    margin-bottom: 0.5rem;
  }

  .nav-tabs .nav-link {
    padding: 10px 15px;
    font-size: 14px;
  }

  .spotify-iframe {
    height: 152px;
  }

  .embed-container {
    padding: 15px;
  }
}
</style>
