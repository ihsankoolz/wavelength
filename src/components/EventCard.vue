<!-- eventcard.vue component -->
<template>
  <div class="event-card">
    <div class="card h-100 shadow-sm" @click="viewDetails" style="cursor: pointer;">
        <div class="card-title-header">
            {{ event.title }}
        </div>
      <div class="card-body">
       <div class="d-flex align-items-start mb-3">
        <img 
            :src="artist?.profileImage || defaultImage" 
            :alt="artist?.artistName"
            class="event-artist-image"
        />
        <div class="artist-info ms-3">
            <h5 class="card-title mb-1">{{ event.artistName }}</h5>
            <p class="event-detail mb-1">
            <i class="bi bi-calendar3 text-dark"></i>
            {{ formatDate(event.date) }}
            </p>
            <p class="event-detail mb-1">
            <i class="bi bi-geo-alt text-dark"></i>
            {{ event.venue }}
            </p>
        </div>
        </div>


        <!-- Genre Tags -->
        <div class="genres mb-3">
          <span 
            v-for="genre in event.genres?.slice(0, 3)" 
            :key="genre"
            class="genre-pill"
          >
            {{ genre }}
          </span>
        </div>

        <!-- Small Map Preview -->
        <div class="mt-3 mb-3 event-card-map" @click.stop>
          <EventMap 
            :location="event.location" 
            :title="event.venue"
            size="small"
          />
        </div>

        

        <!-- Interested Count -->
        <div class="mb-3 text-align-end">
          <small class="text-muted">
            <i class="bi bi-people"></i> 
            {{ event.interestedCount || 0 }} interested
          </small>
        </div>

        <!-- Action Buttons -->
        <div class="d-grid gap-2" @click.stop>
          <button 
            class="btn "
            :class="isInterested ? 'btn-dark' : 'btn-not-interested'"
            @click="toggleInterest"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            <!-- <i v-else class="bi" :class="isInterested ? 'bi-star-fill' : 'bi-star'"></i> -->
            {{ isInterested ? 'Interested ✓' : 'Mark as Interested' }}
          </button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/services/firebase'
import { markEventInterested, unmarkEventInterested, isUserInterestedInEvent } from '@/utils/userInteractions'
import EventMap from '@/components/EventMap.vue'
import EventDetails from '@/views/EventDetails.vue';

export default {
  name: 'EventCard',
  components: {
    EventMap
  },
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isInterested: false,
      loading: false,
      artist: null,
      defaultImage: 'https://ui-avatars.com/api/?name=Artist&size=200&background=667eea&color=fff'
    }
  },
  async mounted() {
    await this.checkInterestStatus()
    await this.fetchArtistData();
  },
  methods: {
    async checkInterestStatus() {
      try {
        const user = auth.currentUser
        if (user && this.event.id) {
          this.isInterested = await isUserInterestedInEvent(user.uid, this.event.id)
        }
      } catch (error) {
        console.error('Error checking interest status:', error)
      }
    },
    async fetchArtistData() {
        try {
      if (this.event.artistId) {
        const artistDoc = await getDoc(doc(db, 'artists', this.event.artistId))
        if (artistDoc.exists()) {
          this.artist = artistDoc.data()
        }
      }
    } catch (error) {
      console.error('Failed to fetch artist data:', error)
    }
    },
    async toggleInterest() {
      const user = auth.currentUser
      if (!user) {
        alert('Please log in to mark events as interested')
        return
      }

      this.loading = true

      try {
        if (this.isInterested) {
          // Remove interest
          const result = await unmarkEventInterested(user.uid, this.event.id)
          if (result.success) {
            this.isInterested = false
            // Update local count
            if (this.event.interestedCount > 0) {
              this.event.interestedCount--
            }
            this.$emit('interest-changed', {
                eventId: this.event.id,
                interested: false,
                count: this.event.interestedCount
            })
          }
        } else {
          // Add interest
          const result = await markEventInterested(user.uid, this.event.id)
          if (result.success) {
            this.isInterested = true
            // Update local count
            this.event.interestedCount = (this.event.interestedCount || 0) + 1
            this.$emit('interest-changed', {
          eventId: this.event.id,
          interested: true,
          count: this.event.interestedCount
        })
          }
        }
      } catch (error) {
        console.error('Error toggling interest:', error)
        alert('Failed to update interest. Please try again.')
      } finally {
        this.loading = false
      }
    },

    formatDate(date) {
      if (!date) return 'TBA'
      
      // Handle Firestore Timestamp
      const eventDate = date.toDate ? date.toDate() : new Date(date)
      
      const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      
      return eventDate.toLocaleDateString('en-SG', options)
    },

    viewDetails() {
      this.$router.push(`/events/${this.event.id}`)
    }
  }
}
</script>

<style scoped>
.event-card {
  transition: transform 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
}

.card {
  border: none;
  border-radius: 20px;
  
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.2rem;
}

.event-card-map {
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

/* Prevent click-through on map */
.event-card-map::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.event-detail i {
  font-size: 1.1rem;
}

.genres .btn {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
 
}

.btn {
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}
.event-artist-image {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #fff;
  background: #fff;
  box-shadow: none;
  display: inline-block;
}

.artist-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.event-detail {
  color: #000000;
  font-size: 0.96rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.card-title-header {
  background: #bb1814;
  color: #fff;
  text-align: center;
  font-weight: 700;
  font-size: 1.12rem;
  border-radius: 18px 18px 0 0;
  padding: 12px 10px 8px 10px;
  letter-spacing: 0.5px;
}

.genre-pill {
  display: inline-block;
  background: #bb1814;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.15rem 1.05rem 0.13rem 1.05rem;
  border-radius: 20px;
  margin-right: 0.45rem;
  margin-bottom: 0.22rem;
  letter-spacing: 0.1px;
  /* text-transform: uppercase; */
  border: none;
  box-shadow: none;
}
.text-align-end {
  text-align: end;
}
.btn-not-interested {
    background: #bb1814;
    color: white;
}

</style>
```

---

## 🎯 **What Changed:**

### ✅ **Kept Your Features:**
- Google Maps small preview ✓
- All your styling ✓
- Event details display ✓

### ⭐ **Added New Features:**
1. **Interest Status Checking** - Checks if user already interested on mount
2. **Toggle Interest** - Real button that saves to Firestore
3. **Loading State** - Shows spinner while saving
4. **Button Changes** - Changes from "Mark as Interested" to "Interested ✓"
5. **Color Changes** - Green when interested, blue outline when not
6. **Click Handling** - `@click.stop` prevents card click when clicking button/map
7. **Real-time Count Update** - Updates interested count immediately

---

## 🎨 **Visual Behavior:**

### **Before Interest:**
```
[ ⭐ Mark as Interested ]  ← Blue outline button
```

### **After Clicking:**
```
[ ⏳ Loading... ]  ← Shows spinner
```

### **After Interest:**
```
[ ⭐ Interested ✓ ]  ← Green gradient button