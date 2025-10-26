<!-- eventcard.vue component -->
<template>
  <div class="event-card">
    <div class="card h-100 shadow-sm" @click="viewDetails" style="cursor: pointer;">
      <div class="card-body">
        <!-- Event Title -->
        <h5 class="card-title mb-3">{{ event.title }}</h5>

        <!-- Artist -->
        <p class="event-detail mb-2">
          <i class="bi bi-music-note text-primary"></i>
          <strong>{{ event.artistName }}</strong>
        </p>

        <!-- Date & Time -->
        <p class="event-detail mb-2">
          <i class="bi bi-calendar3 text-primary"></i>
          {{ formatDate(event.date) }}
        </p>

        <!-- Venue -->
        <p class="event-detail mb-3">
          <i class="bi bi-geo-alt text-primary"></i>
          {{ event.venue }}
        </p>

        <!-- Small Map Preview -->
        <div class="mt-3 mb-3 event-card-map" @click.stop>
          <EventMap 
            :location="event.location" 
            :title="event.venue"
            size="small"
          />
        </div>

        <!-- Genre Tags -->
        <div class="genres mb-3">
          <span 
            v-for="genre in event.genres?.slice(0, 3)" 
            :key="genre"
            class="badge bg-light text-dark me-1"
          >
            {{ genre }}
          </span>
        </div>

        <!-- Interested Count -->
        <div class="mb-3">
          <small class="text-muted">
            <i class="bi bi-people"></i> 
            {{ event.interestedCount || 0 }} interested
          </small>
        </div>

        <!-- Action Buttons -->
        <div class="d-grid gap-2" @click.stop>
          <button 
            class="btn btn-sm"
            :class="isInterested ? 'btn-success' : 'btn-outline-primary'"
            @click="toggleInterest"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi" :class="isInterested ? 'bi-star-fill' : 'bi-star'"></i>
            {{ isInterested ? 'Interested ✓' : 'Mark as Interested' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '@/services/firebase'
import { markEventInterested, unmarkEventInterested, isUserInterestedInEvent } from '@/utils/userInteractions'
import EventMap from '@/components/EventMap.vue'

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
      loading: false
    }
  },
  async mounted() {
    await this.checkInterestStatus()
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
          }
        } else {
          // Add interest
          const result = await markEventInterested(user.uid, this.event.id)
          if (result.success) {
            this.isInterested = true
            // Update local count
            this.event.interestedCount = (this.event.interestedCount || 0) + 1
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
  border-radius: 12px;
  border-left: 4px solid #667eea;
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

.event-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.event-detail i {
  font-size: 1.1rem;
}

.genres .badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
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