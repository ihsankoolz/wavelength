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
      required: true
    }
  },
  data() {
    return {
      map: null,
      markers: [],
      infoWindow: null,
      loading: true
    }
  },
  watch: {
    events: {
      handler() {
        if (this.map) {
          this.updateMarkers()
        }
      },
      deep: true
    }
  },
  async mounted() {
    await this.initMap() // ⭐ ADD async/await HERE
  },
  methods: {
    async initMap() { // ⭐ MAKE THIS async
      try {
        // ⭐ Load Google Maps dynamically (SECURE WAY)
        await loadGoogleMaps()

        const singaporeBounds = {
          north: 1.47,
          south: 1.16,
          west: 103.60,
          east: 104.05
        }

        this.map = new google.maps.Map(document.getElementById('discoveryMap'), {
          zoom: 12,
          center: { lat: 1.3521, lng: 103.8198 },
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          restriction: {
            latLngBounds: singaporeBounds,
            strictBounds: false
          }
        })

        this.infoWindow = new google.maps.InfoWindow()
        this.loading = false
        
        this.updateMarkers()

      } catch (error) {
        console.error('Failed to load Google Maps:', error)
        this.loading = false
      }
    },

    async updateMarkers() {
      // Clear existing markers
      this.markers.forEach(marker => marker.setMap(null))
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
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
          })

          // Info window content
          const content = `
            <div style="padding: 10px; max-width: 300px;">
              <h6 style="margin-bottom: 8px;">${event.title}</h6>
              <p style="margin-bottom: 4px;"><strong>Artist:</strong> ${event.artistName}</p>
              <p style="margin-bottom: 4px;"><strong>Date:</strong> ${this.formatDate(event.date)}</p>
              <p style="margin-bottom: 4px;"><strong>Venue:</strong> ${event.venue}</p>
              <p style="margin-bottom: 8px;"><small>${event.description || ''}</small></p>
              <button onclick="window.location.href='#/events/${event.id}'" 
                      style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                View Details
              </button>
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
            componentRestrictions: { country: 'SG' }
          },
          (results, status) => {
            if (status === 'OK') {
              resolve(results[0])
            } else {
              reject(status)
            }
          }
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
        minute: '2-digit'
      })
    }
  }
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