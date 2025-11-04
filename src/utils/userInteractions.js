// userInteractions.js page

// src/utils/userInteractions.js
import { db } from '@/services/firebase'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'

/**
 * Mark an event as interested
 */
export async function markEventInterested(userId, eventId) {
  try {
    const userRef = doc(db, 'users', userId)
    const eventRef = doc(db, 'events', eventId)

    // Add event to user's interested list
    await updateDoc(userRef, {
      interestedEvents: arrayUnion(eventId),
    })

    // Increment event's interested count and add user
    await updateDoc(eventRef, {
      interestedCount: increment(1),
      interestedUsers: arrayUnion(userId),
    })

    return { success: true }
  } catch (error) {
    console.error('Error marking event as interested:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Remove interest from an event
 */
export async function unmarkEventInterested(userId, eventId) {
  try {
    const userRef = doc(db, 'users', userId)
    const eventRef = doc(db, 'events', eventId)

    // Remove event from user's interested list
    await updateDoc(userRef, {
      interestedEvents: arrayRemove(eventId),
    })

    // Decrement event's interested count and remove user
    await updateDoc(eventRef, {
      interestedCount: increment(-1),
      interestedUsers: arrayRemove(userId),
    })

    return { success: true }
  } catch (error) {
    console.error('Error unmarking event interest:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Follow an artist
 */
export async function followArtist(userId, artistId) {
  try {
    // Prevent self-following
    if (userId === artistId) {
      console.error('Cannot follow yourself')
      return { success: false, error: 'Cannot follow yourself' }
    }

    const userRef = doc(db, 'users', userId)
    const artistRef = doc(db, 'artists', artistId)

    // Add artist to user's following list
    await updateDoc(userRef, {
      followingArtists: arrayUnion(artistId),
    })

    // Increment artist's follower count and add user
    await updateDoc(artistRef, {
      followerCount: increment(1),
      followers: arrayUnion(userId),
    })

    return { success: true }
  } catch (error) {
    console.error('Error following artist:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Unfollow an artist
 */
export async function unfollowArtist(userId, artistId) {
  try {
    // Prevent self-unfollowing (shouldn't happen but just in case)
    if (userId === artistId) {
      console.error('Cannot unfollow yourself')
      return { success: false, error: 'Cannot unfollow yourself' }
    }

    const userRef = doc(db, 'users', userId)
    const artistRef = doc(db, 'artists', artistId)

    // Remove artist from user's following list
    await updateDoc(userRef, {
      followingArtists: arrayRemove(artistId),
    })

    // Decrement artist's follower count and remove user
    await updateDoc(artistRef, {
      followerCount: increment(-1),
      followers: arrayRemove(userId),
    })

    return { success: true }
  } catch (error) {
    console.error('Error unfollowing artist:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if user is interested in an event
 */
export async function isUserInterestedInEvent(userId, eventId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      const interestedEvents = userDoc.data().interestedEvents || []
      return interestedEvents.includes(eventId)
    }
    return false
  } catch (error) {
    console.error('Error checking event interest:', error)
    return false
  }
}

/**
 * Check if user is following an artist
 */
export async function isUserFollowingArtist(userId, artistId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      const followingArtists = userDoc.data().followingArtists || []
      return followingArtists.includes(artistId)
    }
    return false
  } catch (error) {
    console.error('Error checking artist follow:', error)
    return false
  }
}
