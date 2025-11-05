import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

/**
 * Delete all artists that have Spotify data
 * (Artists imported via Spotify API have spotifyData field)
 */
async function deleteSpotifyArtists() {
  console.log('\n' + '='.repeat(50))
  console.log('🗑️  DELETE SPOTIFY-IMPORTED ARTISTS')
  console.log('='.repeat(50) + '\n')

  try {
    // Get all artists
    const artistsRef = collection(db, 'artists')
    const snapshot = await getDocs(artistsRef)

    console.log(`📊 Found ${snapshot.size} total artists in database`)

    let deletedCount = 0
    let skippedCount = 0

    for (const artistDoc of snapshot.docs) {
      const artistData = artistDoc.data()

      // Check if this artist was imported from Spotify
      // (has spotifyData field or musicLinks with platform='spotify')
      const hasSpotifyData = artistData.spotifyData !== undefined
      const hasSpotifyMusic = artistData.musicLinks?.some(
        (song) => song.platform === 'spotify' && song.spotifyId,
      )

      if (hasSpotifyData || hasSpotifyMusic) {
        console.log(`   🗑️  Deleting: ${artistData.artistName} (${artistDoc.id})`)
        await deleteDoc(doc(db, 'artists', artistDoc.id))
        deletedCount++
      } else {
        console.log(`   ⏭️  Skipping: ${artistData.artistName} (manually added)`)
        skippedCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 DELETION SUMMARY:')
    console.log(`   🗑️  Deleted: ${deletedCount} Spotify artists`)
    console.log(`   ⏭️  Skipped: ${skippedCount} manual artists`)
    console.log(`   📝 Total: ${snapshot.size} artists`)
    console.log('='.repeat(50) + '\n')
    console.log(
      '✅ Deletion complete! Now run import-artist-spotify.js to re-import with songId field.\n',
    )
  } catch (error) {
    console.error('\n❌ Error deleting artists:', error)
    console.error(error.stack)
    process.exit(1)
  }
}

deleteSpotifyArtists()
