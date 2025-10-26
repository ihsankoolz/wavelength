// artistInteractions.js - Handle follow/unfollow artist functions
import { auth, db } from '@/services/firebase'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'

/**
 * Follow or unfollow an artist
 * @param {string} artistId - Artist document ID to follow/unfollow
 * @param {boolean} isFollowing - Current follow state
 * @returns {Promise<{success: boolean, newFollowerCount: number}>}
 */
export async function toggleFollowArtist(artistId, isFollowing) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to follow artists')
    }

    const userId = user.uid

    // Don't let artists follow themselves
    if (userId === artistId) {
      throw new Error('You cannot follow yourself')
    }

    // Update user's followed artists array
    const userDocRef = doc(db, 'users', userId)

    // Ensure followedArtists field exists
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const userData = userDoc.data()
      if (!userData.followedArtists) {
        await updateDoc(userDocRef, { followedArtists: [] })
      }
    }

    if (isFollowing) {
      // Unfollow: Remove from user's followedArtists
      await updateDoc(userDocRef, {
        followedArtists: arrayRemove(artistId),
      })
      console.log('❌ Unfollowed artist:', artistId)
    } else {
      // Follow: Add to user's followedArtists
      await updateDoc(userDocRef, {
        followedArtists: arrayUnion(artistId),
      })
      console.log('✅ Followed artist:', artistId)
    }

    // Update artist's follower count
    const artistDocRef = doc(db, 'artists', artistId)
    const artistDoc = await getDoc(artistDocRef)

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const currentFollowers = artistData.followerCount || 0
      const newFollowerCount = isFollowing
        ? Math.max(0, currentFollowers - 1)
        : currentFollowers + 1

      await updateDoc(artistDocRef, {
        followerCount: newFollowerCount,
      })

      return {
        success: true,
        newFollowerCount,
      }
    }

    throw new Error('Artist not found')
  } catch (error) {
    console.error('Error toggling follow:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Check if user is following specific artists
 * @param {string} userId - User ID
 * @param {Array} artistIds - Array of artist IDs to check
 * @returns {Promise<Set<string>>} - Set of followed artist IDs
 */
export async function getUserFollowedArtists(userId, artistIds = []) {
  try {
    if (!userId) return new Set()

    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return new Set()

    const userData = userDoc.data()
    const followedArtists = userData.followedArtists || []

    // If specific artistIds provided, filter to those
    if (artistIds.length > 0) {
      return new Set(followedArtists.filter((id) => artistIds.includes(id)))
    }

    return new Set(followedArtists)
  } catch (error) {
    console.error('Error getting followed artists:', error)
    return new Set()
  }
}

/**
 * Get all artists that a user follows with full artist data
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of artist objects
 */
export async function getFollowedArtistsData(userId) {
  try {
    if (!userId) return []

    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return []

    const userData = userDoc.data()
    const followedArtistIds = userData.followedArtists || []

    if (followedArtistIds.length === 0) return []

    // Fetch artist data for each followed artist
    const artistsData = []
    for (const artistId of followedArtistIds) {
      const artistDoc = await getDoc(doc(db, 'artists', artistId))
      if (artistDoc.exists()) {
        artistsData.push({
          id: artistId,
          ...artistDoc.data(),
        })
      }
    }

    return artistsData
  } catch (error) {
    console.error('Error getting followed artists data:', error)
    return []
  }
}
