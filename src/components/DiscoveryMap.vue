<!-- discoverymap.vue -->
<template>
  <div>
    <div id="discoveryMap" class="discovery-map"></div>
    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Loading map...</p>
    </div>
  </div>
</template>

<script>
import { loadGoogleMaps } from '@/utils/googleMapsLoader' // ✅ Already imported

export default {
  name: 'DiscoveryMap',
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      markers: [],
      infoWindow: null,
      loading: true,
    }
  },
  watch: {
    events: {
      handler() {
        if (this.map) {
          this.updateMarkers()
        }
      },
      deep: true,
    },
  },
  async mounted() {
    // Set up global function for info window buttons
    window.viewEventDetails = (eventId) => {
      this.$router.push(`/events/${eventId}`)
    }

    await this.initMap() // ⭐ ADD async/await HERE
  },
  beforeUnmount() {
    // Clean up global function
    delete window.viewEventDetails
  },
  methods: {
    async initMap() {
      // ⭐ MAKE THIS async
      try {
        // ⭐ Load Google Maps dynamically (SECURE WAY)
        await loadGoogleMaps()

        const singaporeBounds = {
          north: 1.47,
          south: 1.16,
          west: 103.6,
          east: 104.05,
        }

        this.map = new google.maps.Map(document.getElementById('discoveryMap'), {
          zoom: 12,
          center: { lat: 1.3521, lng: 103.8198 },
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          restriction: {
            latLngBounds: singaporeBounds,
            strictBounds: false,
          },
        })

        this.infoWindow = new google.maps.InfoWindow({
          disableAutoPan: false,
          maxWidth: 350,
          pixelOffset: new google.maps.Size(0, 0),
        })

        this.loading = false

        this.updateMarkers()
      } catch (error) {
        console.error('Failed to load Google Maps:', error)
        this.loading = false
      }
    },

    async updateMarkers() {
      // Clear existing markers
      this.markers.forEach((marker) => marker.setMap(null))
      this.markers = []

      if (!this.map || this.events.length === 0) return

      const geocoder = new google.maps.Geocoder()
      const bounds = new google.maps.LatLngBounds()

      // Geocode and add markers for each event
      for (const event of this.events) {
        try {
          const result = await this.geocodeAddress(geocoder, event.location)

          const marker = new google.maps.Marker({
            map: this.map,
            position: result.geometry.location,
            title: event.title,
            animation: google.maps.Animation.DROP,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
            clickable: true,
            optimized: false,
            zIndex: google.maps.Marker.MAX_ZINDEX + 1,
          })

          // Info window content - Simplified HTML structure
          const content = `
            <div class="event-info-window">
              <div class="event-info-title">${event.title}</div>
              <div class="event-info-artist"><i class="bi bi-music-note-beamed"></i> <span>${event.artistName}</span></div>
              <div class="event-info-date"><i class="bi bi-calendar-event"></i> <span>${this.formatDate(event.date)}</span></div>
              <div class="event-info-venue"><i class="bi bi-geo-alt-fill"></i> <span>${event.venue}</span></div>
              ${event.description ? `<div class="event-info-description">${event.description}</div>` : ''}
              <div class="event-info-button-container">
                <button type="button" onclick="viewEventDetails('${event.id}')" class="event-info-button">VIEW DETAILS</button>
              </div>
            </div>
          `

          marker.addListener('click', () => {
            this.infoWindow.setContent(content)
            this.infoWindow.open(this.map, marker)
          })

          this.markers.push(marker)
          bounds.extend(result.geometry.location)
        } catch (error) {
          console.warn('Could not geocode:', event.location)
        }
      }

      // Fit map to show all markers
      if (this.markers.length > 0) {
        this.map.fitBounds(bounds)
      }
    },

    geocodeAddress(geocoder, address) {
      return new Promise((resolve, reject) => {
        let searchAddress = address
        if (!searchAddress.toLowerCase().includes('singapore')) {
          searchAddress += ', Singapore'
        }

        geocoder.geocode(
          {
            address: searchAddress,
            region: 'sg',
            componentRestrictions: { country: 'SG' },
          },
          (results, status) => {
            if (status === 'OK') {
              resolve(results[0])
            } else {
              reject(status)
            }
          },
        )
      })
    },

    formatDate(date) {
      if (!date) return 'TBA'
      const eventDate = date.toDate ? date.toDate() : new Date(date)
      return eventDate.toLocaleDateString('en-SG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
}
</script>

<style scoped>
.discovery-map {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  background: #e9ecef;
}
</style>

<style>
/* CRITICAL: Global styles for Google Maps Info Window - Must be aggressive to override Google's styles */

/* Event info window custom container */
.event-info-window {
  font-family: 'Poppins', sans-serif !important;
  padding: 24px !important;
  width: 300px !important;
  background: #2a2a2a !important;
  color: #fff !important;
  border-radius: 12px !important;
  box-sizing: border-box !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important;
  position: relative !important;
}

/* Title */
.event-info-title {
  font-size: 1.2rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  margin: 0 0 16px 0 !important;
  padding: 0 0 12px 0 !important;
  letter-spacing: 0.3px !important;
  border-bottom: 2px solid #bb1814 !important;
  line-height: 1.3 !important;
  text-align: left !important;
  word-wrap: break-word !important;
}

/* Artist, Date, Venue rows */
.event-info-artist,
.event-info-date,
.event-info-venue {
  font-size: 0.9rem !important;
  color: #e0e0e0 !important;
  margin: 0 0 10px 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 10px !important;
  line-height: 1.5 !important;
}

.event-info-artist i,
.event-info-date i,
.event-info-venue i {
  color: #bb1814 !important;
  font-size: 1.1rem !important;
  flex-shrink: 0 !important;
  margin-top: 2px !important;
}

.event-info-artist span,
.event-info-date span,
.event-info-venue span {
  flex: 1 !important;
  word-wrap: break-word !important;
}

/* Description */
.event-info-description {
  font-size: 0.85rem !important;
  color: #b0b1ba !important;
  margin: 0 0 16px 0 !important;
  padding: 0 !important;
  line-height: 1.5 !important;
  max-height: 80px !important;
  overflow: hidden !important;
  word-wrap: break-word !important;
}

/* Button container */
.event-info-button-container {
  margin: 16px 0 0 0 !important;
  padding: 0 !important;
}

/* Button */
.event-info-button {
  background: #bb1814 !important;
  color: #ffffff !important;
  border: none !important;
  padding: 14px 24px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  width: 100% !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(187, 24, 20, 0.4) !important;
  font-family: 'Poppins', sans-serif !important;
  display: block !important;
  text-align: center !important;
  line-height: 1 !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  outline: none !important;
}

.event-info-button:hover {
  background: #d41e1e !important;
  box-shadow: 0 6px 16px rgba(187, 24, 20, 0.6) !important;
  transform: translateY(-2px) !important;
}

.event-info-button:active {
  transform: translateY(0) !important;
}

/* CLOSE BUTTON - Complete override */
.gm-style-iw-c > button,
.gm-style-iw-chr > button {
  background: #bb1814 !important;
  opacity: 1 !important;
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
  top: 12px !important;
  right: 12px !important;
  border: 3px solid #2a2a2a !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
  padding: 0 !important;
  margin: 0 !important;
  position: absolute !important;
  z-index: 1000 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.gm-style-iw-c > button:hover,
.gm-style-iw-chr > button:hover {
  background: #d41e1e !important;
  transform: scale(1.1) !important;
}

/* Hide default close button content */
.gm-style-iw-c > button > img,
.gm-style-iw-chr > button > img,
.gm-style-iw-c > button > span,
.gm-style-iw-chr > button > span {
  display: none !important;
}

/* Add custom X using pseudo-element */
.gm-style-iw-c > button::before,
.gm-style-iw-chr > button::before {
  content: '×' !important;
  color: white !important;
  font-size: 32px !important;
  font-weight: 300 !important;
  line-height: 30px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
