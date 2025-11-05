/**
 * Centralized genre list for Wavelength
 * Used across: Onboarding, Artist Setup, Edit Profile, and AI Import
 *
 * IMPORTANT: When adding/removing genres, update ALL references:
 * - src/views/Onboarding.vue
 * - src/views/ArtistSetup.vue
 * - src/views/EditArtistProfile.vue
 * - src/data/import-artist-spotify.js (AI prompt)
 */

export const GENRE_LIST = [
  // Original genres (K-Pop removed)
  'Indie',
  'Jazz',
  'Electronic',
  'Rock',
  'Pop',
  'Hip Hop',
  'R&B',
  'Folk',
  'Classical',
  'Metal',
  'Alternative',
  'Soul',
  'Blues',
  'Punk',
  'Reggae',
  'Country',
  'EDM',
  'Funk',
  'Gospel',
  'Mandopop',

  // Additional 10 common genres
  'Indie Pop',
  'Alternative Pop',
  'Singer-Songwriter',
  'Dream Pop',
  'Electropop',
  'Folk Pop',
  'Alternative R&B',
  'Bedroom Pop',
  'Acoustic',
  'Experimental',
] // Genre images mapping (with existing images from assets)
export const GENRE_IMAGES = {
  Indie: '/src/assets/Genres/indie.png',
  Jazz: '/src/assets/Genres/Jazz.png',
  Electronic: '/src/assets/Genres/Electronic.png',
  Rock: '/src/assets/Genres/rock.png',
  Pop: '/src/assets/Genres/pop.png',
  'Hip Hop': '/src/assets/Genres/hip hop.png',
  'R&B': '/src/assets/Genres/r&b.png',
  Folk: '/src/assets/Genres/folk.png',
  Classical: '/src/assets/Genres/classiscal.png',
  Metal: '/src/assets/Genres/metal.png',
  Alternative: '/src/assets/Genres/alternative.png',
  Soul: '/src/assets/Genres/soul.png',
  Blues: '/src/assets/Genres/Blues.png',
  Punk: '/src/assets/Genres/Punk.png',
  Reggae: '/src/assets/Genres/Raggae.png',
  Country: '/src/assets/Genres/Country.png',
  EDM: '/src/assets/Genres/EDM.png',
  Funk: '/src/assets/Genres/Funk.png',
  Gospel: '/src/assets/Genres/Gospel.png',
  Mandopop: '/src/assets/Genres/pop.png', // Reuse Pop image

  // New genres use a default/placeholder image
  'Indie Pop': '/src/assets/Genres/indie.png', // Reuse Indie image
  'Alternative Pop': '/src/assets/Genres/alternative.png', // Reuse Alternative image
  'Singer-Songwriter': '/src/assets/Genres/folk.png', // Reuse Folk image
  'Dream Pop': '/src/assets/Genres/pop.png', // Reuse Pop image
  Electropop: '/src/assets/Genres/Electronic.png', // Reuse Electronic image
  'Folk Pop': '/src/assets/Genres/folk.png', // Reuse Folk image
  'Alternative R&B': '/src/assets/Genres/r&b.png', // Reuse R&B image
  'Bedroom Pop': '/src/assets/Genres/indie.png', // Reuse Indie image
  Acoustic: '/src/assets/Genres/folk.png', // Reuse Folk image
  Experimental: '/src/assets/Genres/Electronic.png', // Reuse Electronic image
}

// Helper function to get genre data for components
export function getGenresWithImages() {
  return GENRE_LIST.map((name) => ({
    name,
    img: GENRE_IMAGES[name] || '/src/assets/Genres/indie.png', // Fallback image
  }))
}
