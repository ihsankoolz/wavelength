import { auth, db } from '../services/firebase'
import { doc, updateDoc, arrayUnion, increment, getDoc, setDoc } from 'firebase/firestore'

/**
 * Track when a user plays a song
 * @param {string} songId - The song ID
 * @param {string} artistId - The artist ID
 * @param {Array} genres - Array of genre strings
 */
export async function trackSongPlay(songId, artistId, genres = []) {
  const user = auth.currentUser
  if (!user) {
    console.warn('⚠️ Cannot track play: User not logged in')
    return
  }

  try {
    const userRef = doc(db, 'users', user.uid)
    const timestamp = new Date().toISOString()

    // Create play record
    const playRecord = {
      songId,
      artistId,
      genres,
      timestamp,
    }

    console.log('🎵 Attempting to track play:', playRecord)

    // Check if user document exists and has listenHistory field
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      console.error('❌ User document does not exist')
      return
    }

    const userData = userDoc.data()
    if (!userData.listenHistory) {
      console.log('⚠️ listenHistory field missing, initializing...')
      // Initialize the field first
      await updateDoc(userRef, {
        listenHistory: [playRecord],
      })
      console.log('✅ listenHistory initialized with first play')
    } else {
      // Update user's listen history
      await updateDoc(userRef, {
        listenHistory: arrayUnion(playRecord),
      })
      console.log('✅ Play added to listenHistory')
    }

    // Update the song's play count in the artist's musicLinks
    const artistRef = doc(db, 'artists', artistId)
    const artistDoc = await getDoc(artistRef)

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const musicLinks = artistData.musicLinks || []

      // Find the song and increment its playCount
      const updatedMusicLinks = musicLinks.map((song) => {
        if (song.id === songId) {
          return {
            ...song,
            playCount: (song.playCount || 0) + 1,
          }
        }
        return song
      })

      await updateDoc(artistRef, {
        musicLinks: updatedMusicLinks,
      })
      console.log('✅ Song playCount updated')
    }

    // Auto-update genre preferences based on plays
    await updateGenrePreferences(genres)

    console.log('✅ Song play tracked successfully:', songId)
  } catch (error) {
    console.error('❌ Error tracking song play:', error)
    console.error('Error details:', error.message)
  }
}

/**
 * Track when a user clicks on an artist profile
 * @param {string} artistId - The artist ID
 */
export async function trackArtistClick(artistId) {
  const user = auth.currentUser
  if (!user) return

  try {
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      const artistClicks = userData.artistClicks || {}

      // Increment click count for this artist
      artistClicks[artistId] = (artistClicks[artistId] || 0) + 1

      await updateDoc(userRef, {
        artistClicks,
      })
    }

    console.log('Artist click tracked:', artistId)
  } catch (error) {
    console.error('Error tracking artist click:', error)
  }
}

/**
 * Update user's genre preferences based on their listening activity
 * @param {Array} genres - Array of genre strings from recently played song
 */
export async function updateGenrePreferences(genres = []) {
  const user = auth.currentUser
  if (!user || genres.length === 0) return

  try {
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      const currentPreferences = userData.preferredGenres || []
      const listenHistory = userData.listenHistory || []

      // Count genre occurrences in recent listen history (last 50 plays)
      const recentPlays = listenHistory.slice(-50)
      const genreCounts = {}

      recentPlays.forEach((play) => {
        play.genres?.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
      })

      // Get top 5 genres by play count (minimum 3 plays to be included)
      const topGenres = Object.entries(genreCounts)
        .filter(([_, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([genre, _]) => genre)

      // Merge with current preferences, keeping top genres first
      const updatedPreferences = [...new Set([...topGenres, ...currentPreferences])].slice(0, 5) // Keep top 5 overall

      // Only update if preferences have changed
      if (JSON.stringify(updatedPreferences) !== JSON.stringify(currentPreferences)) {
        await updateDoc(userRef, {
          preferredGenres: updatedPreferences,
        })
        console.log('Genre preferences updated:', updatedPreferences)
      }
    }
  } catch (error) {
    console.error('Error updating genre preferences:', error)
  }
}

/**
 * Track song card impression (when song appears in user's feed)
 * @param {string} songId - The song ID
 * @param {string} artistId - The artist ID
 */
export async function trackSongImpression(songId, artistId) {
  const user = auth.currentUser
  if (!user) return

  try {
    const userRef = doc(db, 'users', user.uid)
    const timestamp = new Date().toISOString()

    const impressionRecord = {
      songId,
      artistId,
      timestamp,
    }

    // Store impressions (useful for calculating click-through rates)
    await updateDoc(userRef, {
      songImpressions: arrayUnion(impressionRecord),
    })
  } catch (error) {
    console.error('Error tracking song impression:', error)
  }
}

/**
 * Get user's interaction statistics
 * @returns {Object} Stats object with play counts, top genres, etc.
 */
export async function getUserInteractionStats() {
  const user = auth.currentUser
  if (!user) return null

  try {
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      const listenHistory = userData.listenHistory || []
      const artistClicks = userData.artistClicks || {}

      // Calculate stats
      const totalPlays = listenHistory.length
      const uniqueSongs = new Set(listenHistory.map((p) => p.songId)).size
      const uniqueArtists = new Set(listenHistory.map((p) => p.artistId)).size

      // Top genres
      const genreCounts = {}
      listenHistory.forEach((play) => {
        play.genres?.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
      })

      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      // Most clicked artists
      const topArtists = Object.entries(artistClicks)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      return {
        totalPlays,
        uniqueSongs,
        uniqueArtists,
        topGenres,
        topArtists,
        preferredGenres: userData.preferredGenres || [],
      }
    }

    return null
  } catch (error) {
    console.error('Error getting interaction stats:', error)
    return null
  }
}

/**
 * Initialize user interaction data structure if it doesn't exist
 */
export async function initializeUserInteractions() {
  const user = auth.currentUser
  if (!user) return

  try {
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()

      // Add interaction fields if they don't exist
      const updates = {}
      if (!userData.listenHistory) updates.listenHistory = []
      if (!userData.artistClicks) updates.artistClicks = {}
      if (!userData.songImpressions) updates.songImpressions = []

      if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates)
        console.log('User interaction tracking initialized')
      }
    }
  } catch (error) {
    console.error('Error initializing user interactions:', error)
  }
}
