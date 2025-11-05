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
]

// Helper function to get the correct image path for Vite
function getGenreImagePath(filename) {
  return new URL(`../assets/Genres/${filename}`, import.meta.url).href
}

// Genre images mapping (updated with new images)
export const GENRE_IMAGES = {
  Indie: getGenreImagePath('Indie.png'),
  Jazz: getGenreImagePath('Jazz.png'),
  Electronic: getGenreImagePath('Electronic.png'),
  Rock: getGenreImagePath('Rock.png'),
  Pop: getGenreImagePath('Pop.png'),
  'Hip Hop': getGenreImagePath('Hip Hop.png'),
  'R&B': getGenreImagePath('R&B.png'),
  Folk: getGenreImagePath('Folk.png'),
  Classical: getGenreImagePath('Classiscal.png'), // Note: typo in filename
  Metal: getGenreImagePath('Metal.png'),
  Alternative: getGenreImagePath('Alternative.png'),
  Soul: getGenreImagePath('Soul.png'),
  Blues: getGenreImagePath('Blues.png'),
  Punk: getGenreImagePath('Punk.png'),
  Reggae: getGenreImagePath('Raggae.png'), // Note: typo in filename
  Country: getGenreImagePath('Country.png'),
  EDM: getGenreImagePath('EDM.png'),
  Funk: getGenreImagePath('Funk.png'),
  Gospel: getGenreImagePath('Gospel.png'),
  Mandopop: getGenreImagePath('Mando pop.png'),
  'Indie Pop': getGenreImagePath('Indie Pop.png'),
  'Alternative Pop': getGenreImagePath('Alternative Pop.png'),
  'Singer-Songwriter': getGenreImagePath('Singer Songwriter.png'),
  'Dream Pop': getGenreImagePath('Dream Pop.png'),
  Electropop: getGenreImagePath('Electronic Pop.png'),
  'Folk Pop': getGenreImagePath('Folk Pop.png'),
  'Alternative R&B': getGenreImagePath('Alternative R&B.png'),
  'Bedroom Pop': getGenreImagePath('Bedroom Pop.png'),
  Acoustic: getGenreImagePath('Acoustic.png'),
  Experimental: getGenreImagePath('Experimental.png'),
}

// Helper function to get genre data for components
export function getGenresWithImages() {
  return GENRE_LIST.map((name) => ({
    name,
    img: GENRE_IMAGES[name] || getGenreImagePath('Indie.png'), // Fallback image
  }))
}
