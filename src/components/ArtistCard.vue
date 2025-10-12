<!-- artistcard.vue component -->
<template>
  <div class="artist-card" @click="viewProfile">
    <div class="card h-100 shadow-sm">
      <!-- Artist Image -->
      <div class="artist-image-wrapper">
        <img 
          :src="artist.profileImage || defaultImage" 
          :alt="artist.artistName"
          class="card-img-top"
        >
        <div class="verified-badge" v-if="artist.verified">
          <i class="bi bi-patch-check-fill"></i>
        </div>
      </div>

      <div class="card-body">
        <!-- Artist Name -->
        <h5 class="card-title mb-2">{{ artist.artistName }}</h5>

        <!-- Genres -->
        <div class="genres mb-2">
          <span 
            v-for="genre in artist.genres?.slice(0, 2)" 
            :key="genre"
            class="badge bg-light text-dark me-1"
          >
            {{ genre }}
          </span>
          <span v-if="artist.genres?.length > 2" class="badge bg-light text-dark">
            +{{ artist.genres.length - 2 }}
          </span>
        </div>

        <!-- Location -->
        <p class="text-muted small mb-2">
          <i class="bi bi-geo-alt"></i> {{ artist.location || 'Singapore' }}
        </p>

        <!-- Follower Count -->
        <p class="text-muted small mb-3">
          <i class="bi bi-people"></i> {{ artist.followerCount || 0 }} followers
        </p>

        <!-- Follow Button -->
        <button class="btn btn-primary btn-sm w-100" @click.stop="followArtist">
          <i class="bi bi-plus-circle"></i> Follow
        </button>
      </div>
    </div>
  </div>
</template>

<script>
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
      defaultImage: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Artist'
    }
  },
  methods: {
    viewProfile() {
      // TODO: Navigate to artist profile page
      this.$router.push(`/artist/${this.artist.id}`)
    },
    followArtist() {
      // TODO: Implement follow functionality
      console.log('Following artist:', this.artist.artistName)
      alert(`Following ${this.artist.artistName}! (Feature coming soon)`)
    }
  }
}
</script>

<style scoped>
.artist-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.artist-card:hover {
  transform: translateY(-5px);
}

.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.artist-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
  background: #f0f0f0;
}

.artist-image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.verified-badge i {
  color: #667eea;
  font-size: 1.2rem;
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.genres .badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
}

.btn-primary {
  background-color: #667eea;
  border-color: #667eea;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #5568d3;
  border-color: #5568d3;
}
</style>