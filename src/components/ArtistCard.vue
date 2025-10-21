<!-- artistcard.vue component -->
<template>
  <div class="artist-card">
    <div class="card h-100 shadow-sm" @click="viewProfile" style="cursor: pointer;">
      <div class="card-body text-center">
        <!-- Artist Image -->
        <div class="position-relative d-inline-block mb-3">
          <img 
            :src="artist.profileImage || defaultImage" 
            :alt="artist.artistName"
            class="artist-image rounded-circle"
          >
          <!-- Verified Badge -->
          <div v-if="artist.verified" class="verified-badge">
            <i class="bi bi-patch-check-fill text-primary"></i>
          </div>
        </div>

        <!-- Artist Name -->
        <h5 class="card-title mb-2">{{ artist.artistName }}</h5>

        <!-- Bio -->
        <p class="card-text text-muted small mb-3" style="min-height: 40px;">
          {{ truncateBio(artist.bio) }}
        </p>

        <!-- Genres -->
        <div class="mb-3">
          <span 
            v-for="genre in artist.genres?.slice(0, 2)" 
            :key="genre"
            class="badge bg-light text-dark me-1"
            style="font-size: 0.75rem;"
          >
            {{ genre }}
          </span>
        </div>

        <!-- Follower Count -->
        <div class="mb-3">
          <small class="text-muted">
            <i class="bi bi-people"></i>
            {{ artist.followerCount || 0 }} followers
          </small>
        </div>

        <!-- Action Buttons -->
        <div class="d-grid gap-2" @click.stop>
          <button 
            class="btn btn-sm"
            :class="isFollowing ? 'btn-success' : 'btn-outline-primary'"
            @click="toggleFollow"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi" :class="isFollowing ? 'bi-check-circle-fill' : 'bi-plus-circle'"></i>
            {{ isFollowing ? 'Following' : 'Follow' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '@/services/firebase'
import { followArtist, unfollowArtist, isUserFollowingArtist } from '@/utils/userInteractions'

export default {
  name: 'ArtistCard',
  props: {
    artist: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFollowing: false,
      loading: false,
      defaultImage: 'https://ui-avatars.com/api/?name=Artist&size=200&background=667eea&color=fff'
    }
  },
  async mounted() {
    await this.checkFollowStatus()
  },
  methods: {
    async checkFollowStatus() {
      try {
        const user = auth.currentUser
        if (user && this.artist.id) {
          this.isFollowing = await isUserFollowingArtist(user.uid, this.artist.id)
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
      }
    },

    async toggleFollow() {
      const user = auth.currentUser
      if (!user) {
        alert('Please log in to follow artists')
        return
      }

      this.loading = true

      try {
        if (this.isFollowing) {
          // Unfollow
          const result = await unfollowArtist(user.uid, this.artist.id)
          if (result.success) {
            this.isFollowing = false
            // Update local count
            if (this.artist.followerCount > 0) {
              this.artist.followerCount--
            }
          }
        } else {
          // Follow
          const result = await followArtist(user.uid, this.artist.id)
          if (result.success) {
            this.isFollowing = true
            // Update local count
            this.artist.followerCount = (this.artist.followerCount || 0) + 1
          }
        }
      } catch (error) {
        console.error('Error toggling follow:', error)
        alert('Failed to update follow status. Please try again.')
      } finally {
        this.loading = false
      }
    },

    truncateBio(bio) {
      if (!bio) return 'No bio available'
      return bio.length > 60 ? bio.substring(0, 60) + '...' : bio
    },

    viewProfile() {
      this.$router.push(`/artist/${this.artist.id}`)
    }
  }
}
</script>

<style scoped>
.artist-card {
  transition: transform 0.3s ease;
}

.artist-card:hover {
  transform: translateY(-5px);
}

.card {
  border: none;
  border-radius: 12px;
}

.artist-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid #667eea;
}

.verified-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.verified-badge i {
  font-size: 1.5rem;
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
}

.btn {
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
}

.btn-success:hover {
  background: linear-gradient(135deg, #218838 0%, #1aa179 100%);
}

.btn-outline-primary {
  border-color: #667eea;
  color: #667eea;
}

.btn-outline-primary:hover {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}
</style>