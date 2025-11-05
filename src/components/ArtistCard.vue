<!-- artistcard.vue component -->
<template>
  <div class="artist-card" @click="viewProfile">
    <!-- Artist Image -->
    <div class="artist-image-wrapper">
      <img :src="artist.profileImage || defaultImage" :alt="artist.artistName" class="artist-image" />

      <!-- Follow Button (appears on hover) -->
      <button class="follow-button" :class="{ following: isFollowing }" @click.stop="toggleFollow" :disabled="loading"
        :title="isFollowing ? 'Unfollow' : 'Follow'">
        <i v-if="loading" class="bi bi-arrow-repeat spin"></i>
        <i v-else-if="isFollowing" class="bi bi-check"></i>
        <i v-else class="bi bi-plus"></i>
      </button>
    </div>

    <!-- Artist Name -->
    <h5 class="artist-name">{{ artist.artistName }}</h5>

    <!-- Genres -->
    <p class="artist-genres">
      {{ formatGenres(artist.genres) }}
    </p>
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
      required: true,
    },
  },
  data() {
    return {
      isFollowing: false,
      loading: false,
      defaultImage: 'https://ui-avatars.com/api/?name=Artist&size=200&background=667eea&color=fff',
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
        this.$router.push('/login')
        return
      }

      this.loading = true

      try {
        if (this.isFollowing) {
          // Unfollow
          const result = await unfollowArtist(user.uid, this.artist.id)
          if (result.success) {
            this.isFollowing = false
            // Update local count if it exists
            if (this.artist.followerCount > 0) {
              this.artist.followerCount--
            }
          } else {
            throw new Error(result.error || 'Failed to unfollow')
          }
        } else {
          // Follow
          const result = await followArtist(user.uid, this.artist.id)
          if (result.success) {
            this.isFollowing = true
            // Update local count
            this.artist.followerCount = (this.artist.followerCount || 0) + 1
          } else {
            throw new Error(result.error || 'Failed to follow')
          }
        }
      } catch (error) {
        console.error('Error toggling follow:', error)
        alert(error.message || 'Failed to update follow status. Please try again.')
      } finally {
        this.loading = false
      }
    },

    formatGenres(genres) {
      if (!genres || genres.length === 0) return 'No genres listed'

      // Limit to first 2 genres
      const limitedGenres = genres.slice(0, 2)
      const genreText = limitedGenres.join(', ')

      // Add "..." if there are more genres
      if (genres.length > 2) {
        return `${genreText}...`
      }

      return genreText
    },

    viewProfile() {
      this.$router.push(`/artist/${this.artist.id}`)
    },
  },
}
</script>

<style scoped>
.artist-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
  width: 100%;
  /* Ensure card takes full width of grid cell */
}

.artist-card:hover {
  transform: translateY(-8px);
}

.artist-card:hover .artist-image {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(187, 24, 20, 0.4);
  border-color: #bb1814;
}

.artist-image-wrapper {
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
  /* Take full width of container */
  max-width: 200px;
  /* But don't exceed 200px */
}

.artist-card:hover .follow-button {
  opacity: 1;
  pointer-events: auto;
}

.artist-image {
  width: 100%;
  /* Responsive to container */
  aspect-ratio: 1;
  /* Maintain square shape */
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.follow-button {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #bb1814;
  border: 3px solid #191717;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;
  font-size: 1.5rem;
  z-index: 10;
}

/* Smaller follow button on mobile */
@media (max-width: 767px) {
  .follow-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .artist-image-wrapper {
    max-width: 150px;
    /* Smaller on mobile */
  }
}

.follow-button:hover {
  background: #960f0c;
  transform: scale(1.1);
}

.follow-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.follow-button.following {
  opacity: 1;
  pointer-events: auto;
}

.follow-button i {
  font-weight: bold;
  line-height: 1;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.artist-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
  word-wrap: break-word;
  width: 100%;
}

/* Smaller text on mobile */
@media (max-width: 767px) {
  .artist-name {
    font-size: 1.1rem;
  }

  .artist-genres {
    font-size: 0.8rem;
  }
}

.artist-genres {
  font-size: 0.9rem;
  font-weight: 400;
  color: #b0b1ba;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  text-align: center;
}

@media (max-width: 767px) {
  .artist-name {
    font-size: 1.1rem;
  }

  .artist-genres {
    font-size: 0.8rem;
  }
}
</style>
