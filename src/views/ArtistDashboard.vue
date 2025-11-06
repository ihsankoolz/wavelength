<template>
  g<div class="dashboard-content">
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
        <div class="hero-background" :style="{
          backgroundImage: `url(${artistData.profileImage || 'https://ui-avatars.com/api/?name=Artist&size=300&background=667eea&color=fff'})`,
        }"></div>
        <div class="hero-content">
          <div class="container py-4 py-md-5">
            <div class="row align-items-center">
              <!-- Profile Picture -->
              <div class="col-auto mb-3 mb-md-0">
                <div class="position-relative d-inline-block">
                  <img :src="artistData.profileImage ||
                    'https://ui-avatars.com/api/?name=Artist&size=300&background=667eea&color=fff'
                    " :alt="artistData.artistName" class="artist-avatar rounded-circle" />
                  <div v-if="artistData.verified" class="verified-badge-large">
                    <i class="bi bi-patch-check-fill"></i>
                  </div>
                </div>
              </div>

              <!-- Artist Info -->
              <div class="col text-center text-md-start">
                <h1 class="artist-name display-4">{{ artistData.artistName || 'Artist Name' }}</h1>
                <p class="artist-bio">{{ artistData.bio || 'No bio available' }}</p>
                <div class="follower-count">{{ artistData.followerCount || 0 }} Followers</div>
                <div class="dashboard-actions d-flex flex-column flex-md-row gap-2">
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
        <!-- Wave Animation Background for Content Area -->
        <div class="content-wave-background">
          <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="#bb1814" stroke-width="1.5" opacity="0.3">
              <animate attributeName="d" values="M0,150 Q200,80 400,150 T800,150 T1200,150;
                       M0,150 Q200,220 400,150 T800,150 T1200,150;
                       M0,150 Q200,80 400,150 T800,150 T1200,150" dur="6s" repeatCount="indefinite" />
            </path>
            <path fill="none" stroke="#C73535" stroke-width="1" opacity="0.25">
              <animate attributeName="d" values="M0,180 Q250,110 500,180 T1000,180 T1200,180;
                       M0,180 Q250,250 500,180 T1000,180 T1200,180;
                       M0,180 Q250,110 500,180 T1000,180 T1200,180" dur="8s" repeatCount="indefinite" />
            </path>
            <path fill="none" stroke="#D95656" stroke-width="0.8" opacity="0.2">
              <animate attributeName="d" values="M0,120 Q300,50 600,120 T1200,120;
                       M0,120 Q300,190 600,120 T1200,120;
                       M0,120 Q300,50 600,120 T1200,120" dur="10s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>

        <div class="container" style="padding-top: 2rem; padding-bottom: 2rem">
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
                    <p class="text-white mb-4">No upcoming events scheduled.</p>
                    <button class="btn-add-event" @click="addEvent">
                      <i class="bi bi-plus-circle me-2"></i>CREATE YOUR FIRST EVENT
                    </button>
                  </div>

                  <!-- Events List -->
                  <div v-else>
                    <div class="events-section">
                      <!-- Events Grid Header -->
                      <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
                        <h2 class="events-library-title h2 mb-0">MY EVENTS</h2>
                        <button class="btn-add-event" @click="addEvent">+ ADD EVENT</button>
                      </div>

                      <div class="row g-3">
                        <div v-for="event in displayedEvents" :key="event.id" class="col-12 col-sm-6 col-md-6 col-lg-4">
                          <div class="event-card">
                            <!-- Red Header with Event Title -->
                            <div class="event-header">
                              {{ event.title || 'Untitled Event' }}
                            </div>

                            <!-- Event Body -->
                            <div class="event-body">
                              <!-- Venue and Date (No Artist Info on Profile Pages) -->
                              <div class="event-venue-date">
                                <div class="event-venue-text">
                                  <p class="event-venue">{{ event.venue || event.location }}</p>
                                  <p class="event-description-preview" v-if="event.description">
                                    {{ event.description.split(' ').slice(0, 6).join(' ')
                                    }}{{ event.description.split(' ').length > 6 ? '...' : '' }}
                                  </p>
                                </div>
                                <!-- Date Box on Right -->
                                <div class="event-date-box">
                                  <div class="date-day">{{ formatEventDay(event.date) }}</div>
                                  <div class="date-month">{{ formatEventMonth(event.date) }}</div>
                                </div>
                              </div>

                              <!-- Genres -->
                              <p class="event-genres-text" v-if="event.genres && event.genres.length > 0">
                                {{ event.genres.join(', ') }}
                              </p>

                              <!-- Map Preview -->
                              <div class="event-map-preview" v-if="event.location">
                                <EventMap :location="event.location" :title="event.venue || event.title" size="small" />
                              </div>

                              <!-- Interested Count -->
                              <p class="interested-count">
                                {{ event.interestedCount || 0 }}
                                {{ (event.interestedCount || 0) === 1 ? 'Person' : 'People' }}
                                Interested
                              </p>

                              <!-- Action Buttons (Owner Controls) -->
                              <div class="event-owner-actions">
                                <button class="btn-action-edit" @click="editEvent(event.id)" title="Edit Event">
                                  <i class="bi bi-pencil"></i> Edit
                                </button>
                                <button class="btn-action-view" @click="viewEvent(event.id)" title="View Details">
                                  <i class="bi bi-eye"></i> View
                                </button>
                                <button class="btn-action-delete" @click="deleteEvent(event.id)" title="Delete Event">
                                  <i class="bi bi-trash"></i> Delete
                                </button>
                              </div>
                            </div>
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
                    <div class="row g-3 mt-4">
                      <div class="col-12 col-md-4">
                        <div class="stat-box">
                          <i class="bi bi-calendar3 fs-4"></i>
                          <div>
                            <div class="fw-bold">Genres</div>
                            <div class="text-white-soft">
                              {{ artistData.genres?.length || 0 }} genres
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-md-4">
                        <div class="stat-box">
                          <i class="bi bi-music-note-list fs-4"></i>
                          <div>
                            <div class="fw-bold">Music</div>
                            <div class="text-white-soft">
                              {{ artistData.musicLinks?.length || 0 }} tracks
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-md-4">
                        <div class="stat-box">
                          <i class="bi bi-calendar-event fs-4"></i>
                          <div>
                            <div class="fw-bold">Upcoming Events</div>
                            <div class="text-white-soft">{{ artistEvents.length }} events</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Following Section -->
                    <section class="discover-artists-section mb-5">
                      <div class="section-header d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h2 class="h4 mb-1">FOLLOWING</h2>
                          <p class="text-muted mb-0 small">YOU ARE FOLLOWING <span>{{
                            followingArtists.length }}</span> ARTIST{{ followingArtists.length !== 1 ? 'S' : '' }}</p>
                        </div>
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
                        <button v-if="currentArtistPage > 0" @click="previousArtistPage"
                          class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 start-0 translate-middle-y shadow z-3 ms-2 ms-md-0"
                          aria-label="Previous artists">
                          <i class="bi bi-chevron-left fs-5"></i>
                        </button>

                        <div class="artists-carousel">
                          <div class="artists-grid-carousel"
                            :style="{ transform: `translateX(-${currentArtistPage * 100}%)` }">
                            <div v-for="(page, pageIndex) in paginatedFollowingArtists"
                              :key="`artist-page-${pageIndex}`" class="carousel-page artists-page">
                              <div class="row g-3 w-100">
                                <div v-for="artist in page" :key="artist.id" class="col-6 col-md-3 col-lg-2">
                                  <ArtistCard :artist="artist" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button v-if="currentArtistPage < totalArtistPages - 1" @click="nextArtistPage"
                          class="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute top-50 end-0 translate-middle-y shadow z-3 me-2 me-md-0"
                          aria-label="Next artists">
                          <i class="bi bi-chevron-right fs-5"></i>
                        </button>
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
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/services/firebase'
import NavigationBar from '@/components/NavigationBar.vue'
import EventCard from '@/components/EventCard.vue'
import EventMap from '@/components/EventMap.vue'
import MusicManager from '@/components/MusicManager.vue'
import EventModal from '@/components/EventModal.vue'
import ArtistCard from '@/components/ArtistCard.vue'

export default {
  name: 'ArtistDashboard',
  components: {
    NavigationBar,
    EventCard,
    EventMap,
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
    const currentArtistPage = ref(0)
    const artistsPerPage = ref(6) // Default for large screens

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

    // Computed property for paginated following artists
    const paginatedFollowingArtists = computed(() => {
      const pages = []
      let startIndex = 0

      while (startIndex < followingArtists.value.length) {
        const endIndex = Math.min(startIndex + artistsPerPage.value, followingArtists.value.length)
        pages.push(followingArtists.value.slice(startIndex, endIndex))
        startIndex = endIndex
      }
      return pages
    })

    // Computed property for total artist pages
    const totalArtistPages = computed(() => {
      return paginatedFollowingArtists.value.length
    })

    const loadArtistEvents = async (artistId) => {
      try {
        eventsLoading.value = true

        // console.log('Looking for events with artistId:', artistId)

        // Query events where artistId matches the current artist
        const eventsQuery = query(collection(db, 'events'), where('artistId', '==', artistId))
        const eventsSnapshot = await getDocs(eventsQuery)

        // console.log('Found events:', eventsSnapshot.docs.length)

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

    // Format day for event date box
    const formatEventDay = (timestamp) => {
      if (!timestamp) return ''
      let date
      if (timestamp.toDate) {
        date = timestamp.toDate()
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        date = new Date(timestamp)
      }
      return date.getDate()
    }

    // Format month for event date box
    const formatEventMonth = (timestamp) => {
      if (!timestamp) return ''
      let date
      if (timestamp.toDate) {
        date = timestamp.toDate()
      } else if (timestamp instanceof Date) {
        date = timestamp
      } else {
        date = new Date(timestamp)
      }
      return date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
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

    // Pagination methods for following artists carousel
    const nextArtistPage = () => {
      if (currentArtistPage.value < totalArtistPages.value - 1) {
        currentArtistPage.value++
      }
    }

    const previousArtistPage = () => {
      if (currentArtistPage.value > 0) {
        currentArtistPage.value--
      }
    }

    // Update artists per page based on window width (Bootstrap breakpoints)
    const updateArtistsPerPage = () => {
      const width = window.innerWidth
      if (width >= 992) {
        artistsPerPage.value = 6 // lg: 6 artists (col-lg-2 = 16.66% width)
      } else if (width >= 768) {
        artistsPerPage.value = 4 // md: 4 artists (col-md-3 = 25% width)
      } else {
        artistsPerPage.value = 2 // sm/xs: 2 artists (col-6 = 50% width)
      }
      currentArtistPage.value = 0
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
    onMounted(async () => {
      updateArtistsPerPage()
      window.addEventListener('resize', updateArtistsPerPage)

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUser.value = user
          loadArtistData(user.uid)
        } else {
          error.value = 'Please log in to access your dashboard.'
          loading.value = false
        }
      })

      return () => {
        unsubscribe()
        window.removeEventListener('resize', updateArtistsPerPage)
      }
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateArtistsPerPage)
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
      formatEventDay,
      formatEventMonth,
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
      currentArtistPage,
      artistsPerPage,
      paginatedFollowingArtists,
      totalArtistPages,
      nextArtistPage,
      previousArtistPage,
      updateArtistsPerPage,
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
  position: relative;
  z-index: 1;
}

/* Wave Animation Background */
.content-wave-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.8;
}

.content-wave-background svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  border: 2px solid #6e0b0b;
  background: #6e0b0b;
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
  background: #1db954;
}

.social-icon.youtube {
  background: #ff0000;
}

.social-icon.instagram {
  background: linear-gradient(45deg,
      #f09433 0%,
      #e6683c 25%,
      #dc2743 50%,
      #cc2366 75%,
      #bc1888 100%);
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
  content: '';
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
  content: '';
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

/* New Event Card Styles (matching EventCard.vue) */
.event-card {
  background: rgba(35, 35, 38, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(187, 24, 20, 0.3);
}

/* Event Header */
.event-header {
  background: linear-gradient(135deg, #bb1814 0%, #960f0c 100%);
  padding: 1rem 1.25rem;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

/* Event Body */
.event-body {
  padding: 1.25rem;
}

/* Venue and Date Section (No Artist Info on Profile Pages) */
.event-venue-date {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.event-venue-text {
  flex: 1;
  min-width: 0;
}

.event-venue {
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
}

.event-description-preview {
  font-size: 0.9rem;
  color: #b0b1ba;
  margin: 0;
  line-height: 1.4;
  font-family: 'Poppins', sans-serif;
}

/* Event Info Section */
.event-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.event-artist-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #bb1814;
  flex-shrink: 0;
}

.event-info-text {
  flex: 1;
  min-width: 0;
}

.event-artist-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.3rem;
  font-family: 'Poppins', sans-serif;
}

.event-venue {
  font-size: 0.85rem;
  color: #b0b1ba;
  margin: 0;
  font-family: 'Poppins', sans-serif;
}

/* Date Box on Right */
.event-date-box {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #bb1814 0%, #960f0c 100%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(187, 24, 20, 0.3);
}

.event-date-box .date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  font-family: 'Poppins', sans-serif;
}

.event-date-box .date-month {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
  text-transform: uppercase;
  font-family: 'Poppins', sans-serif;
}

/* Event Genres as Plain Text */
.event-genres-text {
  font-size: 0.9rem;
  font-weight: 400;
  color: #b0b1ba;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
}

/* Map Preview */
.event-map-preview {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

/* Interested Count */
.interested-count {
  font-size: 0.9rem;
  color: #b0b1ba;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}

/* Event Owner Actions (for Artist Dashboard) */
.event-owner-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
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


/* Following Section - Matching UserProfile.vue */
.discover-artists-section {
  margin-top: 40px;
  margin-bottom: 30px;
}

.section-header h2,
.section-header h4 {
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.5rem;
}

.section-header p {
  color: #b0b1ba;
  font-size: 0.9rem;
  text-transform: none;
  letter-spacing: normal;
}

.highlight-number {
  color: #bb1814;
  font-weight: 700;
}

.text-muted {
  color: #b0b1ba !important;
}

/* Carousel Container */
.carousel-container {
  position: relative;
  padding: 0;
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
  display: flex;
  padding: 0;
}
</style>
