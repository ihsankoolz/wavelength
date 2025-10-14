// src/utils/googleMapsLoader.js

let googleMapsPromise = null

export function loadGoogleMaps() {
  // Return existing promise if already loading/loaded
  if (googleMapsPromise) {
    return googleMapsPromise
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve(window.google.maps)
      return
    }

    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      reject(new Error('Google Maps API key not found in environment variables'))
      return
    }

    // Create script tag
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps)
      } else {
        reject(new Error('Google Maps failed to load'))
      }
    }

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'))
    }

    document.head.appendChild(script)
  })

  return googleMapsPromise
}

// Helper to check if Google Maps is loaded
export function isGoogleMapsLoaded() {
  return !!(window.google && window.google.maps)
}