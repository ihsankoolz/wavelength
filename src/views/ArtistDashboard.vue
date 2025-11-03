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
    <div v-else>
      <!-- Artist Hero Section with Blurred Background -->
      <div class="artist-hero-section">
        <div class="hero-background"
          :style="{ backgroundImage: `url(${artistData.profileImage || 'https://ui-avatars.com/api/?name=Artist&size=300&background=667eea&color=fff'})` }">
        </div>
        <div class="hero-content">
          <div class="container py-5">
            <div class="row align-items-center">
              <!-- Profile Picture -->
              <div class="col-auto">
                <div class="position-relative d-inline-block">
                  <img
                    :src="artistData.profileImage || 'https://ui-avatars.com/api/?name=Artist&size=300&background=667eea&color=fff'"
                    :alt="artistData.artistName" class="artist-avatar" />
                  <div v-if="artistData.verified" class="verified-badge-large">
                    <i class="bi bi-patch-check-fill"></i>
                  </div>
                </div>
              </div>

              <!-- Artist Info -->
              <div class="col">
                <h1 class="artist-name">{{ artistData.artistName || 'Artist Name' }}</h1>
                <p class="artist-bio">{{ artistData.bio || 'No bio available' }}</p>
                <div class="follower-count">{{ artistData.followerCount || 0 }} Followers</div>
                <div class="dashboard-actions">
                  <button @click="editProfile" class="btn-dashboard-action">EDIT PROFILE</button>
                  <button @click="viewAnalytics" class="btn-dashboard-action">ANALYTICS</button>
                </div>

                <!-- Social Links -->
                <div v-if="hasSocialLinks" class="social-links">
                  <a v-if="artistData.socialLinks?.spotify" :href="artistData.socialLinks.spotify" target="_blank"
                    class="social-icon spotify">
                    <i class="bi bi-spotify"></i>
                  </a>
                  <a v-if="artistData.socialLinks?.youtube" :href="artistData.socialLinks.youtube" target="_blank"
                    class="social-icon youtube">
                    <i class="bi bi-youtube"></i>
                  </a>
                  <a v-if="artistData.socialLinks?.instagram" :href="artistData.socialLinks.instagram" target="_blank"
                    class="social-icon instagram">
                    <i class="bi bi-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="container" style="padding-top: 2rem; padding-bottom: 2rem;">
          <!-- Tabs Section -->
          <div class="row">
            <div class="col-12">
              <div class="custom-tab-bar mb-4">
                <button class="tab-btn" :class="{ active: activeTab === 'music' }" @click="activeTab = 'music'">
                  MY MUSIC
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'events' }" @click="activeTab = 'events'">
                  MY EVENTS
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'about' }" @click="activeTab = 'about'">
                  ABOUT ME
                </button>
              </div>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="row">
            <div class="col-12">
              <div class="tab-content">
                <!-- Music Tab - NEW MusicManager Component -->
                <div v-if="activeTab === 'music'" class="tab-content-section">
                  <div class="music-tab-wrapper">
                    <MusicManager v-if="artistData.uid" :artistId="artistData.uid" @music-updated="onMusicUpdated" />
                  </div>
                </div>

                <!-- Events Tab -->
                <div v-if="activeTab === 'events'" class="tab-content-section">
                  <!-- Loading Events -->
                  <div v-if="eventsLoading" class="text-center py-5">
                    <div class="spinner-border text-danger"></div>
                    <p class="mt-3 text-white">Loading events...</p>
                  </div>

                  <!-- No Events -->
                  <div v-else-if="artistEvents.length === 0" class="text-center py-5">
                    <i class="bi bi-calendar-x fs-1 text-white mb-3"></i>
                    <p class="text-white">No upcoming events scheduled.</p>
                  </div>

                  <!-- Events List -->
                  <div v-else>
                    <div class="events-section">
                      <!-- Events Grid Header -->
                      <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="events-library-title">MY EVENTS</h2>
                        <button class="btn-add-event" @click="addEvent">
                          + ADD EVENT
                        </button>
                      </div>

                      <div class="events-grid">
                        <div v-for="event in displayedEvents" :key="event.id" class="event-item-card">
                          <!-- Event Info -->
                          <div class="event-item-info">
                            <h5 class="event-item-title">{{ event.title || 'Untitled Event' }}</h5>

                            <!-- Event Date & Time -->
                            <div class="event-meta mb-2">
                              <small class="event-meta-item">
                                <i class="bi bi-calendar me-1"></i>
                                {{ formatEventDate(event.date) }}
                                <span v-if="formatEventTime(event.date)" class="ms-2">
                                  <i class="bi bi-clock me-1"></i>
                                  {{ formatEventTime(event.date) }}
                                </span>
                              </small>
                            </div>

                            <!-- Event Location -->
                            <div v-if="event.location" class="event-meta mb-2">
                              <small class="event-meta-item">
                                <i class="bi bi-geo-alt me-1"></i>
                                {{ event.location }}
                              </small>
                            </div>

                            <!-- Event Description -->
                            <p v-if="event.description" class="event-description">
                              {{
                                event.description.length > 100
                                  ? event.description.substring(0, 100) + '...'
                                  : event.description
                              }}
                            </p>
                          </div>

                          <!-- Action Buttons -->
                          <div class="event-actions mt-3">
                            <button class="btn-action-edit" @click="editEvent(event.id)" title="Edit">
                              <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn-action-view" @click="viewEvent(event.id)" title="View">
                              <i class="bi bi-eye"></i> View
                            </button>
                            <button class="btn-action-delete" @click="deleteEvent(event.id)" title="Delete">
                              <i class="bi bi-trash"></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- See More Events Button -->
                    <div v-if="artistEvents.length > 6 && !showAllEvents" class="text-center mt-4">
                      <button class="btn-see-more" @click="showAllEvents = true">
                        <i class="bi bi-chevron-down"></i>
                        See More Events ({{ artistEvents.length - 6 }} more)
                      </button>
                    </div>

                    <!-- Show Less Events Button -->
                    <div v-if="showAllEvents && artistEvents.length > 6" class="text-center mt-4">
                      <button class="btn-see-less" @click="showAllEvents = false">
                        <i class="bi bi-chevron-up"></i>
                        Show Less
                      </button>
                    </div>
                  </div>

                  <!-- <div style="background: #007bff; color: white; padding: 40px; text-align: center; border-radius: 10px;">
            <h4>🎪 EVENTS TAB IS WORKING!</h4>
            <p>No events scheduled at the moment</p>
            <button @click="addEvent" class="btn btn-light">📅 Add Event</button>
            </div> -->
                </div>

                <!-- About Tab -->
                <div v-if="activeTab === 'about'" class="tab-content-section">
                  <div class="about-section">
                    <h2 class="about-title">ABOUT {{ artistData.artistName || 'Artist Name' }}</h2>

                    <div v-if="artistData.aboutSection" class="about-text mb-4">
                      <p style="font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap">
                        {{ artistData.aboutSection }}
                      </p>
                    </div>
                    <div v-else class="about-empty">
                      <i class="bi bi-info-circle"></i> No additional information available.
                    </div>

                    <!-- Artist Stats -->
                    <div class="stats-grid mt-4">
                      <div class="stat-box">
                        <i class="bi bi-calendar3 fs-4"></i>
                        <div>
                          <div class="fw-bold">Genres</div>
                          <div class="text-white-soft">{{ artistData.genres?.length || 0 }} genres</div>
                        </div>
                      </div>
                      <div class="stat-box">
                        <i class="bi bi-music-note-list fs-4"></i>
                        <div>
                          <div class="fw-bold">Music</div>
                          <div class="text-white-soft">{{ artistData.musicLinks?.length || 0 }} tracks</div>
                        </div>
                      </div>
                      <div class="stat-box">
                        <i class="bi bi-calendar-event fs-4"></i>
                        <div>
                          <div class="fw-bold">Upcoming Events</div>
                          <div class="text-white-soft">{{ artistEvents.length }} events</div>
                        </div>
                      </div>
                    </div>

                    <!-- Following Section -->
                    <section class="genre-picks-section mt-5">
                      <h2 class="genre-heading">FOLLOWING</h2>
                      <div class="header-subtitle mb-4">
                        You are following <span>{{ followingArtists.length }}</span> artist{{ followingArtists.length !== 1 ? 's' : '' }}
                      </div>

                      <!-- No Following Artists -->
                      <div v-if="followingArtists.length === 0" class="card shadow-sm">
                        <div class="card-body text-center py-5">
                          <i class="bi bi-person-x fs-1 text-muted mb-3"></i>
                          <p class="text-muted">You're not following any artists yet.</p>
                          <router-link to="/home" class="btn btn-primary">
                            Discover Artists
                          </router-link>
                        </div>
                      </div>

                      <!-- Following Artists Grid -->
                      <div v-else class="horizontal-scroll">
                        <div class="d-flex gap-3">
                          <div v-for="artist in followingArtists" :key="artist.id" class="flex-shrink-0 artist-card-container">
                            <ArtistCard :artist="artist" />
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End of v-else (Artist Profile Display) -->
  </div>
  <!-- End of dashboard-content -->

  <!-- Delete Confirmation Modal -->
  <div class="modal fade" id="deleteEventModal" tabindex="-1" aria-labelledby="deleteEventModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteEventModalLabel">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirm Delete
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
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
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
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
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ errorMessage }}
      </div>
    </div>
  </div>

  <!-- Event Modal -->
  <EventModal :show="showEventModal" :event="eventToEdit" :artistId="artistData.uid" :artistName="artistData.artistName"
    @close="closeEventModal" @event-saved="onEventSaved" />
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
import EventModal from '@/components/EventModal.vue'
import ArtistCard from '@/components/ArtistCard.vue'

export default {
  name: 'ArtistDashboard',
  components: {
    NavigationBar,
    EventCard,
    MusicManager,
    EventModal,
    ArtistCard,
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
    const showAllEvents = ref(false) // Track if showing all events or just first 6

    // Event Modal state
    const showEventModal = ref(false)
    const eventToEdit = ref(null)

    // Delete modal state
    const eventToDelete = ref(null)
    const deleting = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    // Following artists state
    const followingArtists = ref([])

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

    // Computed property for displayed events (show first 6 or all)
    const displayedEvents = computed(() => {
      if (showAllEvents.value) {
        return artistEvents.value
      }
      return artistEvents.value.slice(0, 6)
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

    // Event management
    const editEvent = (eventId) => {
      const event = artistEvents.value.find((e) => e.id === eventId)
      if (event) {
        eventToEdit.value = event
        showEventModal.value = true
      }
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
      eventToEdit.value = null // Clear any previous event
      showEventModal.value = true
    }

    const closeEventModal = () => {
      showEventModal.value = false
      eventToEdit.value = null
    }

    const onEventSaved = async () => {
      // Reload events after creating/updating
      if (artistData.uid) {
        await loadArtistEvents(artistData.uid)
      }
    }

    const viewAnalytics = () => {
      router.push('/artist/analytics')
    }

    const loadFollowingArtists = async (userId) => {
      try {
        // Get user document to find artists they're following
        const userDoc = await getDoc(doc(db, 'users', userId))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const followedArtistIds = userData.followingArtists || userData.followedArtists || []
          
          if (followedArtistIds.length === 0) {
            followingArtists.value = []
            return
          }
          
          // Load artist data for each followed artist
          const artistsList = []
          for (const artistId of followedArtistIds) {
            try {
              const artistDoc = await getDoc(doc(db, 'artists', artistId))
              if (artistDoc.exists()) {
                artistsList.push({
                  id: artistId,
                  ...artistDoc.data(),
                })
              }
            } catch (err) {
              console.error(`Error loading artist ${artistId}:`, err)
            }
          }
          
          followingArtists.value = artistsList
        } else {
          // If no user document, try checking artist document
          followingArtists.value = []
        }
      } catch (error) {
        console.error('Error loading following artists:', error)
        followingArtists.value = []
      }
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
            profileImage: data.profileImage || '',
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
          await loadFollowingArtists(userId)
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
      showAllEvents,
      displayedEvents,
      showEventModal,
      eventToEdit,
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
      closeEventModal,
      onEventSaved,
      viewAnalytics,
      getSpotifyEmbedUrl,
      getYouTubeEmbedUrl,
      onMusicUpdated,
      followingArtists,
    }
  },
}
</script>

<style scoped>
.dashboard-content {
  min-height: 100vh;
  background: #191717;
  color: white;
  font-family: 'Poppins', sans-serif;
  position: relative;
  margin: 0;
  padding: 0;
}

.content-wrapper {
  background: #191717;
  padding-bottom: 40px;
  padding-top: 0;
  margin-top: 0;
}

/* Artist Hero Section */
.artist-hero-section {
  position: relative;
  width: 100%;
  min-height: 400px;
  overflow: hidden;
  margin: 0;
  margin-bottom: 0;
  padding: 0;
  top: 0;
  left: 0;
  z-index: 0;
}

.hero-background {
  position: absolute;
  top: -80px;
  /* Extend above to cover navbar area */
  left: 0;
  width: 100%;
  height: calc(100% + 80px);
  /* Add navbar height to cover behind it */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(20px) brightness(0.3);
  transform: scale(1.05);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  padding-top: 100px;
  background: transparent;
}

.artist-name {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.artist-bio {
  font-size: 1.1rem;
  color: white;
  margin-bottom: 1rem;
}

.follower-count {
  font-size: 1rem;
  color: white;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.dashboard-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.btn-dashboard-action {
  background: #bb1814;
  color: #fff;
  border-radius: 22px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid #bb1814;
  padding: 8px 24px;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-dashboard-action:hover {
  border: 2px solid #6E0B0B;;
  background: #6E0B0B;
  color: white;
}

.artist-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.verified-badge-large {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.verified-badge-large i {
  color: #bb1814;
  font-size: 2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.social-icon.spotify {
  background: #1DB954;
}

.social-icon.youtube {
  background: #FF0000;
}

.social-icon.instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}

.social-icon:hover {
  transform: scale(1.1);
}

.display-4 {
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
}

.lead {
  color: rgba(255, 255, 255, 0.8);
}

.badge {
  font-size: 0.85rem;
}

.badge.bg-dark {
  background: #bb1814 !important;
  color: white;
}

.badge.bg-secondary {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white;
}

/* Custom Tab Bar - Matching PublicArtistProfile */
.custom-tab-bar {
  display: flex;
  align-items: flex-end;
  position: relative;
  background: transparent;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1 1 auto;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Poppins', Arial, Helvetica, sans-serif;
  font-weight: 700;
  color: white;
  padding: 18px 0 15px 0;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tab-btn.active {
  background: #bb1814;
  color: white;
  border-radius: 16px 16px 0 0;
  position: relative;
}

.tab-btn:not(.active):hover {
  color: #bb1814;
}

.custom-tab-bar::after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: #bb1814;
  z-index: 1;
}

/* Legacy nav-tabs support (if still used elsewhere) */
.nav-tabs {
  border: none;
  display: flex;
  align-items: flex-end;
  position: relative;
  background: transparent;
  margin-bottom: 1.5rem;
}

.nav-tabs::after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: #bb1814;
  z-index: 1;
}

.nav-tabs .nav-link {
  flex: 1 1 auto;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Poppins', Arial, Helvetica, sans-serif;
  font-weight: 700;
  color: white;
  padding: 18px 0 15px 0;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0;
}

.nav-tabs .nav-link.active {
  background: #bb1814;
  color: white;
  border-radius: 16px 16px 0 0;
  position: relative;
}

.nav-tabs .nav-link:not(.active):hover {
  color: #bb1814;
}

/* Music Section */
.music-section {
  background: rgba(35, 35, 38, 0.8);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  min-height: 150px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.music-placeholder {
  background: rgba(0, 0, 0, 0.2);
  padding: 40px 20px;
  border-radius: 8px;
  text-align: center;
  min-height: 100px;
  color: white;
}

.content-wrapper {
  background: #191717;
  padding-bottom: 40px;
}

.embed-placeholder {
  background: rgba(0, 0, 0, 0.3);
  padding: 30px;
  margin: 20px 0;
  border-radius: 5px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  min-height: 80px;
  color: white;
}

.spotify-embed {
  background: #1db954 !important;
  color: white !important;
}

/* About Section */
.about-section {
  background: rgba(35, 35, 38, 0.8);
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.about-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: white;
  white-space: pre-wrap;
}

.about-empty {
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-box i {
  color: #bb1814;
  font-size: 1.5rem;
}

.stat-box .fw-bold {
  color: white;
  font-size: 1rem;
}

.text-white-soft {
  color: rgba(255, 255, 255, 0.7) !important;
}

.social-links {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.stats-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.stat-card {
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  color: white;
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

.btn-outline-dark {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline-dark:hover {
  background: #bb1814;
  border-color: #bb1814;
  color: white;
}

.btn-primary {
  background: #bb1814;
  border-color: #bb1814;
}

.btn-primary:hover {
  background: #9d1310;
  border-color: #9d1310;
}

.btn-light {
  background: white;
  color: #191717;
}

.btn-light:hover {
  background: rgba(255, 255, 255, 0.9);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.spinner-border.text-primary {
  color: #bb1814 !important;
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

/* Tab Content Section */
.tab-content-section {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Music Tab Wrapper */
.music-tab-wrapper {
  background: transparent;
  padding: 0;
  border-radius: 0;
  border: none;
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
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 12px;
  margin-top: 15px;
}

.embed-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  font-weight: 500;
  text-align: center;
}

/* Events Section */
.events-section {
  margin-bottom: 40px;
}

.events-library-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-add-event {
  background: #bb1814;
  color: white;
  border: none;
  border-radius: 22px;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-event:hover {
  background: #9d1310;
  transform: translateY(-2px);
}

/* Events Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.event-item-card {
  background: rgba(35, 35, 38, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.event-item-card:hover {
  transform: translateY(-4px);
}

.event-item-info {
  margin-bottom: 0.5rem;
}

.event-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
}

.event-meta {
  margin-bottom: 0.5rem;
}

.event-meta-item {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.event-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0;
}

/* Event Actions */
.event-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-action-view {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 16px;
}

.btn-action-view:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #0dcaf0;
  transform: translateY(-1px);
}

.btn-action-edit {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 16px;
}

.btn-action-edit:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #bb1814;
  transform: translateY(-1px);
}

.btn-action-delete {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 16px;
}

.btn-action-delete:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #dc3545;
  transform: translateY(-1px);
}

.card {
  background: rgba(35, 35, 38, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.card-title {
  color: white;
}

.card-text {
  color: rgba(255, 255, 255, 0.8);
}

.card-footer {
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-outline-primary {
  border-color: #bb1814;
  color: #bb1814;
}

.btn-outline-primary:hover {
  background: #bb1814;
  border-color: #bb1814;
  color: white;
}

.btn-outline-info {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline-info:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline-danger {
  border-color: rgba(220, 53, 69, 0.5);
  color: rgba(220, 53, 69, 1);
}

.btn-outline-danger:hover {
  background: rgba(220, 53, 69, 0.8);
  border-color: rgba(220, 53, 69, 1);
  color: white;
}

.text-muted {
  color: rgba(255, 255, 255, 0.6) !important;
}

.text-center {
  color: white;
}

h4,
h5,
h6 {
  color: white;
}

small {
  color: rgba(255, 255, 255, 0.7);
}

/* Text color overrides */
.text-primary {
  color: #bb1814 !important;
}

.bg-danger {
  background: #bb1814 !important;
}

.bg-light {
  background: rgba(35, 35, 38, 0.8) !important;
  color: white;
}

.bg-light .text-muted {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* See More/Less Buttons */
.btn-see-more,
.btn-see-less {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 22px;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-see-more:hover,
.btn-see-less:hover {
  border-color: #bb1814;
  color: #bb1814;
  transform: translateY(-2px);
}

/* ⭐ MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }

  .events-library-title {
    font-size: 1.5rem;
  }

  .dashboard-content {
    padding-top: 80px;
  }

  .artist-hero-section {
    min-height: 300px;
  }

  .hero-content {
    min-height: 300px;
    padding-top: 80px;
  }

  .artist-avatar {
    width: 120px;
    height: 120px;
  }

  .artist-name {
    font-size: 2rem;
  }

  .artist-bio {
    font-size: 1rem;
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

  .nav-tabs .nav-link,
  .tab-btn {
    padding: 12px 0 10px 0;
    font-size: 0.85rem;
  }

  .spotify-iframe {
    height: 152px;
  }

  .embed-container {
    padding: 15px;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-dashboard-action {
    width: 100%;
  }
}

/* Tablet responsive - 2 columns for medium screens */
@media (min-width: 769px) and (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Followers Section - Matching UserProfile.vue */
.genre-picks-section {
  margin-top: 40px;
  margin-bottom: 30px;
}

.genre-heading {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.header-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

/* Horizontal Scroll for Following Artists */
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

/* Artist Card Container */
.artist-card-container {
  min-width: 250px;
  width: 250px;
  height: 100%;
  display: flex;
}
</style>
