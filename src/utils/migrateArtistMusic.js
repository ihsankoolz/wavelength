// migrateArtistMusic.js - Script to migrate existing artist music data to new schema

import { db } from '@/services/firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { createMusicLink } from './musicHelpers'

/**
 * Migrates a single artist document to the new musicLinks schema
 * @param {string} artistId - Artist document ID
 * @param {Object} artistData - Current artist data
 * @returns {Promise<Object>} - { success: boolean, message: string }
 */
export async function migrateArtistDocument(artistId, artistData) {
  try {
    const musicLinks = []

    // Migrate YouTube video (latest single)
    if (artistData.youtubeVideoUrl) {
      const singleLink = createMusicLink({
        title: artistData.latestSingle || 'Latest Single',
        type: 'video',
        platform: 'youtube',
        url: artistData.youtubeVideoUrl,
        genres: artistData.genres || [],
      })
      musicLinks.push(singleLink)
    }

    // Migrate Spotify track/album
    if (artistData.spotifyTrackUrl) {
      const isAlbum = artistData.spotifyTrackUrl.includes('/album/')
      const albumLink = createMusicLink({
        title: artistData.latestAlbum || 'Latest Album',
        type: isAlbum ? 'album' : 'single',
        platform: 'spotify',
        url: artistData.spotifyTrackUrl,
        genres: artistData.genres || [],
      })
      musicLinks.push(albumLink)
    }

    // Update artist document with new structure
    const updateData = {
      musicLinks: musicLinks,
      // Keep old fields for backwards compatibility (can remove later)
      latestSingle: artistData.latestSingle || '',
      latestAlbum: artistData.latestAlbum || '',
      youtubeVideoUrl: artistData.youtubeVideoUrl || '',
      spotifyTrackUrl: artistData.spotifyTrackUrl || '',
      // Add migration timestamp
      migratedToMusicLinks: true,
      migrationDate: new Date(),
    }

    await updateDoc(doc(db, 'artists', artistId), updateData)

    return {
      success: true,
      message: `Migrated ${musicLinks.length} music link(s) for artist ${artistId}`,
    }
  } catch (error) {
    console.error('Error migrating artist:', artistId, error)
    return {
      success: false,
      message: `Failed to migrate artist ${artistId}: ${error.message}`,
    }
  }
}

/**
 * Migrates all artist documents in the database
 * @returns {Promise<Object>} - { total: number, successful: number, failed: number, details: Array }
 */
export async function migrateAllArtists() {
  try {
    console.log('🔄 Starting migration of all artists...')

    const artistsSnapshot = await getDocs(collection(db, 'artists'))
    const total = artistsSnapshot.docs.length

    console.log(`📊 Found ${total} artist documents`)

    const results = {
      total: total,
      successful: 0,
      failed: 0,
      details: [],
    }

    for (const artistDoc of artistsSnapshot.docs) {
      const artistId = artistDoc.id
      const artistData = artistDoc.data()

      // Skip if already migrated
      if (artistData.migratedToMusicLinks) {
        console.log(`⏭️  Skipping ${artistId} - already migrated`)
        results.details.push({
          artistId,
          status: 'skipped',
          message: 'Already migrated',
        })
        continue
      }

      const result = await migrateArtistDocument(artistId, artistData)

      if (result.success) {
        results.successful++
        console.log(`✅ ${result.message}`)
      } else {
        results.failed++
        console.error(`❌ ${result.message}`)
      }

      results.details.push({
        artistId,
        status: result.success ? 'success' : 'failed',
        message: result.message,
      })
    }

    console.log('\n📈 Migration Summary:')
    console.log(`   Total: ${results.total}`)
    console.log(`   ✅ Successful: ${results.successful}`)
    console.log(`   ❌ Failed: ${results.failed}`)

    return results
  } catch (error) {
    console.error('Fatal error during migration:', error)
    return {
      total: 0,
      successful: 0,
      failed: 0,
      details: [],
      error: error.message,
    }
  }
}

/**
 * Initializes an empty musicLinks array for artists without any music
 * @param {string} artistId - Artist document ID
 * @returns {Promise<boolean>} - Success status
 */
export async function initializeEmptyMusicLinks(artistId) {
  try {
    await updateDoc(doc(db, 'artists', artistId), {
      musicLinks: [],
      migratedToMusicLinks: true,
      migrationDate: new Date(),
    })
    return true
  } catch (error) {
    console.error('Error initializing musicLinks:', error)
    return false
  }
}

/**
 * Validates the musicLinks array structure
 * @param {Array} musicLinks - Array to validate
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export function validateMusicLinks(musicLinks) {
  const errors = []

  if (!Array.isArray(musicLinks)) {
    return { valid: false, errors: ['musicLinks must be an array'] }
  }

  musicLinks.forEach((link, index) => {
    if (!link.id) errors.push(`Link ${index}: Missing id`)
    if (!link.title) errors.push(`Link ${index}: Missing title`)
    if (!link.type || !['single', 'album', 'video'].includes(link.type)) {
      errors.push(`Link ${index}: Invalid type (must be single/album/video)`)
    }
    if (!link.platform || !['spotify', 'youtube'].includes(link.platform)) {
      errors.push(`Link ${index}: Invalid platform (must be spotify/youtube)`)
    }
    if (!link.url) errors.push(`Link ${index}: Missing url`)
    if (!link.embedUrl) errors.push(`Link ${index}: Missing embedUrl`)
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Export for use in console or admin panel
if (typeof window !== 'undefined') {
  window.musicMigration = {
    migrateAllArtists,
    migrateArtistDocument,
    validateMusicLinks,
  }

  console.log('🎵 Music migration utilities loaded!')
  console.log('   Run: window.musicMigration.migrateAllArtists()')
}
