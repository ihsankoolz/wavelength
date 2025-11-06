<!-- EVENTMAP.VUE -->
<template>
  <div>
    <div :id="mapId" class="event-map"></div>
    <div v-if="loading" class="map-loading">
      <div class="spinner-border spinner-border-sm text-primary"></div>
      <small class="ms-2">Loading map...</small>
    </div>
    <div v-if="error" class="alert alert-warning mb-0 mt-2">
      <small>📍 {{ location }}</small
      ><br />
      <small class="text-muted">{{ error }}</small>
    </div>
  </div>
</template>

<script>
import { loadGoogleMaps } from '@/utils/googleMapsLoader' //  ADD THIS

export default {
  name: 'EventMap',
  props: {
    location: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value),
    },
  },
  data() {
    return {
      mapId: `map-${Math.random().toString(36).substr(2, 9)}`,
      map: null,
      marker: null,
      loading: true,
      error: null,
    }
  },
  async mounted() {
    await this.initMap()
  },
  methods: {
    async initMap() {
      try {
        //  Load Google Maps dynamically
        await loadGoogleMaps()

        // Now proceed with geocoding
        this.geocodeAndRender()
      } catch (error) {
        console.error('Failed to load Google Maps:', error)
        this.error = 'Failed to load map'
        this.loading = false
      }
    },

    geocodeAndRender() {
      const geocoder = new google.maps.Geocoder()
      let searchAddress = this.location

      if (!searchAddress.toLowerCase().includes('singapore')) {
        searchAddress += ', Singapore'
      }

      geocoder.geocode(
        {
          address: searchAddress,
          region: 'sg',
          componentRestrictions: {
            country: 'SG',
          },
        },
        (results, status) => {
          if (status === 'OK') {
            this.createMap(results[0].geometry.location)
            this.loading = false
          } else {
            console.warn('Geocoding failed:', status, this.location)
            this.error = 'Location not found on map'
            this.loading = false
          }
        },
      )
    },

    createMap(location) {
      const mapElement = document.getElementById(this.mapId)
      if (!mapElement) return

      const singaporeBounds = {
        north: 1.47,
        south: 1.16,
        west: 103.6,
        east: 104.05,
      }

      const zoomLevels = {
        small: 14,
        medium: 15,
        large: 16,
      }

      this.map = new google.maps.Map(mapElement, {
        zoom: zoomLevels[this.size],
        center: location,
        mapTypeControl: false,
        streetViewControl: this.size !== 'small',
        fullscreenControl: this.size === 'large',
        // Disable interactions for small maps (preview cards)
        draggable: this.size !== 'small',
        zoomControl: this.size !== 'small',
        scrollwheel: this.size !== 'small',
        disableDoubleClickZoom: this.size === 'small',
        gestureHandling: this.size === 'small' ? 'none' : 'auto',
        restriction: {
          latLngBounds: singaporeBounds,
          strictBounds: false,
        },
      })

      this.marker = new google.maps.Marker({
        map: this.map,
        position: location,
        title: this.title || this.location,
        animation: google.maps.Animation.DROP,
        clickable: this.size !== 'small', // Disable clicking for small maps
      })

      // Only add click listener for non-small maps
      if (this.size !== 'small') {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <strong>${this.title || 'Event Location'}</strong><br>
              <small>${this.location}</small><br>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat()},${location.lng()}" 
                 target="_blank" 
                 style="color: #667eea; text-decoration: none;">
                Get Directions →
              </a>
            </div>
          `,
        })

        this.marker.addListener('click', () => {
          infoWindow.open(this.map, this.marker)
        })
      }
    },
  },
}
</script>

<style scoped>
.event-map {
  width: 100%;
  border: none !important;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  height: 100%;
  min-height: 150px;
  overflow: hidden;
  box-shadow: none !important;
}

.map-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 1rem;
  color: #fff;
}

.map-loading .spinner-border {
  border-color: rgba(187, 24, 20, 0.2);
  border-top-color: #bb1814;
}

.alert {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.9rem;
  color: #fff;
  margin-bottom: 0;
  margin-top: 1rem;
}

.alert small {
  color: rgba(255, 255, 255, 0.7);
}
</style>
