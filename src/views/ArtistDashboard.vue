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
          <button @click="goToSetup" class="btn btn-light">
            Complete Profile Setup
          </button>
        </div>
      </div>
    </div>

    <!-- Artist Profile Display -->
    <div v-else class="container-fluid p-4">
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
                style="font-size: 0.9rem;">
                {{ genre }}</span>
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
                    type="button">Music</button>
                </li>
                <li class="nav-item" role="presentation">
                <button 
                    class="nav-link"
                    :class="{ active: activeTab === 'events' }"
                    @click="activeTab = 'events'"
                    type="button">Events</button>
                </li>
                <li class="nav-item" role="presentation">
                <button 
                    class="nav-link"
                    :class="{ active: activeTab === 'about' }"
                    @click="activeTab = 'about'"
                    type="button">About</button>
                </li>
          </ul>

<!-- Tab Content -->
<div class="tab-content">
  <!-- Music Tab -->
  <div 
    v-if="activeTab === 'music'" 
    class="tab-pane show active"
    style="display: block !important; opacity: 1 !important;"
  >
    <div class="visible-content" style="background: white; padding: 20px; margin: 20px 0; border: 2px solid #007bff; border-radius: 10px;">
      
      
      <!-- Latest Single -->
      <div style="background: #f8f9fa; padding: 20px; margin: 15px 0; border-left: 4px solid #28a745; border-radius: 5px;">
        <h5 style="color: #28a745; margin-bottom: 15px;">🎵 Latest Single: {{ artistData.latestSingle || 'No title yet' }}</h5>
        <div style="background: #e9ecef; padding: 20px; border-radius: 8px; text-align: center;">
          <p class="text-muted">Watch my latest video here:</p>
          
          <div v-if="artistData.youtubeVideoUrl" class="embed-container">
        
        <div class="video-wrapper">
          <iframe 
            :src="getYouTubeEmbedUrl(artistData.youtubeVideoUrl)"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            class="youtube-iframe"
          ></iframe>
        </div>
      </div>
        </div>
      </div>

      <!-- Latest Album -->
      <div style="background: #f8f9fa; padding: 20px; margin: 15px 0; border-left: 4px solid #1db954; border-radius: 5px;">
        <h5 style="color: #1db954; margin-bottom: 15px;">💿 Album: {{ artistData.latestAlbum || 'No album yet' }}</h5>
        <div style="background: #e9ecef; padding: 20px; border-radius: 8px; text-align: center;">
          <p class="text-muted">Listen to my music here:</p>
        
          <div v-if="artistData.spotifyTrackUrl" class="embed-container">
     
        <div class="spotify-wrapper">
          <iframe 
            :src="getSpotifyEmbedUrl(artistData.spotifyTrackUrl)"
            width="100%" 
            height="352" 
            frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media"
            class="spotify-iframe"
          ></iframe>
        </div>
      </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Events Tab -->
  <div 
    v-if="activeTab === 'events'" 
    class="tab-pane show active"
    style="display: block !important; opacity: 1 !important;"
  >
    <div style="background: #007bff; color: white; padding: 40px; text-align: center; border-radius: 10px;">
      <h4>🎪 EVENTS TAB IS WORKING!</h4>
      <p>No events scheduled at the moment</p>
      <button @click="addEvent" class="btn btn-light">📅 Add Event</button>
    </div>
  </div>

  <!-- About Tab -->
  <div 
    v-if="activeTab === 'about'" 
    class="tab-pane show active"
    style="display: block !important; opacity: 1 !important;"
  >
    <div style="background: #28a745; color: white; padding: 40px; text-align: center; border-radius: 10px;">
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
    <button @click="editProfile" class="btn btn-outline-dark">
      ✏️ Edit Profile
    </button>
    <button @click="viewAnalytics" class="btn btn-outline-dark">
      📊 Analytics
    </button>
  </div>
</div>


      </div> <!-- End of main row -->
    </div> <!-- End of Artist Profile Display -->
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/services/firebase'
import NavigationBar from '@/components/NavigationBar.vue'
import EventCard from '@/components/EventCard.vue'

export default {
  name: 'ArtistDashboard',
  components:{
    NavigationBar,
    EventCard
  },
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const error = ref(null)
    const currentUser = ref(null)
    const activeTab = ref('music')
    
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
        instagram: ''
      },
      followerCount: 0,
      musicLinks: [],
      verified: false,
      createdAt: null,
      profileSetupCompleted: false
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
        month: 'short' 
      })
    }

    // Navigation methods
    const goToSetup = () => {
      router.push('/artist/setup')
    }

    const editProfile = () => {
      router.push('/artist/setup')
    }

    const addEvent = () => {
      router.push('/events/create')
    }

    const viewAnalytics = () => {
      alert('Analytics feature coming soon!')
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
            spotifyTrackUrl: data.spotifyTrackUrl || '',      // ✅ ADD THIS
  youtubeVideoUrl: data.youtubeVideoUrl || '', 
            genres: data.genres || [],
            socialLinks: data.socialLinks || {
              spotify: '',
              youtube: '',
              instagram: ''
            },
            followerCount: data.followerCount || 0,
            musicLinks: data.musicLinks || [],
            verified: data.verified || false,
            createdAt: data.createdAt,
            profileSetupCompleted: data.profileSetupCompleted || false
          })
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

    // ✅ FIXED: Return isOwner in the return statement
    return {
      artistData,
      loading,
      error,
      activeTab,
      hasSocialLinks,
      isOwner, // ✅ NOW RETURNED - template can access it
      formatDate,
      goToSetup,
      editProfile,
      addEvent,
      viewAnalytics,
      getSpotifyEmbedUrl,    // ✅ ADD THIS
  getYouTubeEmbedUrl   
    }
  }
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
