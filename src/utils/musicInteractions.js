// musicInteractions.js - Handle like/save/playlist functions
import { auth, db } from '@/services/firebase'
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { notifyOnComment, notifyOnReply } from './notifications'

/**
 * Like or unlike a song (also saves/unsaves to user's collection)
 * @param {string} artistId - Artist document ID
 * @param {string} songId - Song ID within musicLinks array
 * @param {boolean} isLiked - Current like state
 * @returns {Promise<{success: boolean, newLikeCount: number}>}
 */
export async function toggleSongLike(artistId, songId, isLiked) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to like songs')
    }

    const userId = user.uid

    // Update user's liked songs array AND saved songs array
    const userDocRef = doc(db, 'users', userId)
    const songKey = `${artistId}_${songId}` // Unique identifier

    // First, ensure the user document has the required fields
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      const userData = userDoc.data()

      // Initialize fields if they don't exist
      const updates = {}
      if (!userData.likedSongs) {
        updates.likedSongs = []
      }
      if (!userData.savedSongs) {
        updates.savedSongs = []
      }

      // Apply initialization if needed
      if (Object.keys(updates).length > 0) {
        await updateDoc(userDocRef, updates)
        console.log('✅ Initialized user music fields:', Object.keys(updates))
      }
    }

    if (isLiked) {
      // Unlike: Remove from BOTH likedSongs and savedSongs
      await updateDoc(userDocRef, {
        likedSongs: arrayRemove(songKey),
        savedSongs: arrayRemove(songKey), // Also remove from saved collection
      })
      console.log('❌ Unliked and unsaved song:', songKey)
    } else {
      // Like: Add to BOTH likedSongs and savedSongs
      await updateDoc(userDocRef, {
        likedSongs: arrayUnion(songKey),
        savedSongs: arrayUnion(songKey), // Also add to saved collection
      })
      console.log('✅ Liked and saved song:', songKey)
    }

    // Update song's like count in artist document
    const artistDocRef = doc(db, 'artists', artistId)
    const artistDoc = await getDoc(artistDocRef)

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const musicLinks = artistData.musicLinks || []

      // Find and update the specific song
      const updatedMusicLinks = musicLinks.map((song) => {
        if (song.id === songId) {
          const currentLikes = song.likes || 0
          return {
            ...song,
            likes: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          }
        }
        return song
      })

      // Save updated musicLinks
      await updateDoc(artistDocRef, {
        musicLinks: updatedMusicLinks,
      })

      // Return new like count
      const updatedSong = updatedMusicLinks.find((song) => song.id === songId)
      return {
        success: true,
        newLikeCount: updatedSong?.likes || 0,
      }
    }

    throw new Error('Artist not found')
  } catch (error) {
    console.error('Error toggling song like:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Check if user has liked specific songs
 * @param {string} userId - User ID
 * @param {Array} songKeys - Array of song keys (artistId_songId)
 * @returns {Promise<Set<string>>} - Set of liked song keys
 */
export async function getUserLikedSongs(userId, songKeys = []) {
  try {
    if (!userId) return new Set()

    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return new Set()

    const userData = userDoc.data()
    const likedSongs = userData.likedSongs || []

    // If specific songKeys provided, filter to those
    if (songKeys.length > 0) {
      return new Set(likedSongs.filter((key) => songKeys.includes(key)))
    }

    return new Set(likedSongs)
  } catch (error) {
    console.error('Error getting user liked songs:', error)
    return new Set()
  }
}

/**
 * Save or unsave a song
 * @param {string} artistId - Artist document ID
 * @param {string} songId - Song ID within musicLinks array
 * @param {boolean} isSaved - Current save state
 * @returns {Promise<{success: boolean}>}
 */
export async function toggleSongSave(artistId, songId, isSaved) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to save songs')
    }

    const userId = user.uid
    const userDocRef = doc(db, 'users', userId)
    const songKey = `${artistId}_${songId}`

    if (isSaved) {
      // Unsave: Remove from user's savedSongs
      await updateDoc(userDocRef, {
        savedSongs: arrayRemove(songKey),
      })
    } else {
      // Save: Add to user's savedSongs
      await updateDoc(userDocRef, {
        savedSongs: arrayUnion(songKey),
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error toggling song save:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Check if user has saved specific songs
 * @param {string} userId - User ID
 * @param {Array} songKeys - Array of song keys (artistId_songId)
 * @returns {Promise<Set<string>>} - Set of saved song keys
 */
export async function getUserSavedSongs(userId, songKeys = []) {
  try {
    if (!userId) return new Set()

    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) return new Set()

    const userData = userDoc.data()
    const savedSongs = userData.savedSongs || []

    if (songKeys.length > 0) {
      return new Set(savedSongs.filter((key) => songKeys.includes(key)))
    }

    return new Set(savedSongs)
  } catch (error) {
    console.error('Error getting user saved songs:', error)
    return new Set()
  }
}

/**
 * Initialize user music interaction fields if they don't exist
 * @param {string} userId - User ID
 */
export async function initializeUserMusicFields(userId) {
  try {
    const userDocRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      const updates = {}

      // Initialize missing fields
      if (!userData.likedSongs) updates.likedSongs = []
      if (!userData.savedSongs) updates.savedSongs = []
      if (!userData.recentlyPlayed) updates.recentlyPlayed = []
      if (!userData.favoriteGenres) updates.favoriteGenres = []

      // Only update if there are missing fields
      if (Object.keys(updates).length > 0) {
        await updateDoc(userDocRef, updates)
        console.log('✅ Initialized user music fields:', Object.keys(updates))
      }
    }
  } catch (error) {
    console.error('Error initializing user music fields:', error)
  }
}

/**
 * Post a comment on a song
 * @param {string} artistId - Artist document ID
 * @param {string} songId - Song ID within musicLinks array
 * @param {string} commentText - Comment text
 * @returns {Promise<{success: boolean, comment: Object}>}
 */
export async function postSongComment(artistId, songId, commentText) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to comment')
    }

    if (!commentText || !commentText.trim()) {
      throw new Error('Comment cannot be empty')
    }

    const userId = user.uid

    // Get user's display name
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userName = userDoc.exists() ? userDoc.data().displayName || 'Anonymous' : 'Anonymous'

    // Create comment object
    const comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      userName: userName,
      text: commentText.trim(),
      createdAt: new Date(),
      likes: 0,
    }

    // Update artist document - add comment to the specific song
    const artistDocRef = doc(db, 'artists', artistId)
    const artistDoc = await getDoc(artistDocRef)

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const musicLinks = artistData.musicLinks || []

      // Find and update the specific song with new comment
      const updatedMusicLinks = musicLinks.map((song) => {
        if (song.id === songId) {
          const comments = song.comments || []
          return {
            ...song,
            comments: [...comments, comment],
            commentCount: (song.commentCount || 0) + 1,
          }
        }
        return song
      })

      // Save updated musicLinks
      await updateDoc(artistDocRef, {
        musicLinks: updatedMusicLinks,
      })

      // Find the song title for notification
      const song = updatedMusicLinks.find((s) => s.id === songId)
      const songTitle = song?.title || 'your song'

      // Send notification to artist
      notifyOnComment(artistId, songId, songTitle, userId, userName)

      return {
        success: true,
        comment: comment,
      }
    }

    throw new Error('Artist not found')
  } catch (error) {
    console.error('Error posting comment:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Get comments for a specific song
 * @param {string} artistId - Artist document ID
 * @param {string} songId - Song ID within musicLinks array
 * @returns {Promise<Array>} - Array of comments
 */
export async function getSongComments(artistId, songId) {
  try {
    const artistDoc = await getDoc(doc(db, 'artists', artistId))

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const musicLinks = artistData.musicLinks || []

      const song = musicLinks.find((s) => s.id === songId)
      return song?.comments || []
    }

    return []
  } catch (error) {
    console.error('Error getting comments:', error)
    return []
  }
}

/**
 * Delete a comment (only by comment author)
 * @param {string} artistId - Artist document ID
 * @param {string} songId - Song ID within musicLinks array
 * @param {string} commentId - Comment ID to delete
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteSongComment(artistId, songId, commentId) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to delete comments')
    }

    const userId = user.uid
    const artistDocRef = doc(db, 'artists', artistId)
    const artistDoc = await getDoc(artistDocRef)

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const musicLinks = artistData.musicLinks || []

      // Find and update the specific song
      const updatedMusicLinks = musicLinks.map((song) => {
        if (song.id === songId) {
          const comments = song.comments || []
          const commentToDelete = comments.find((c) => c.id === commentId)

          // Check if user owns this comment
          if (commentToDelete && commentToDelete.userId !== userId) {
            throw new Error('You can only delete your own comments')
          }

          return {
            ...song,
            comments: comments.filter((c) => c.id !== commentId),
            commentCount: Math.max(0, (song.commentCount || 0) - 1),
          }
        }
        return song
      })

      // Save updated musicLinks
      await updateDoc(artistDocRef, {
        musicLinks: updatedMusicLinks,
      })

      return { success: true }
    }

    throw new Error('Artist not found')
  } catch (error) {
    console.error('Error deleting comment:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Like or unlike a comment
 * @param {string} artistId - Artist document ID
 * @param {string} songId - Song ID within musicLinks array
 * @param {string} commentId - Comment ID to like/unlike
 * @param {boolean} isLiked - Current like state
 * @returns {Promise<{success: boolean}>}
 */
export async function toggleCommentLike(artistId, songId, commentId, isLiked) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to like comments')
    }

    const userId = user.uid
    const artistDocRef = doc(db, 'artists', artistId)
    const artistDoc = await getDoc(artistDocRef)

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const musicLinks = artistData.musicLinks || []

      // Find and update the specific song
      const updatedMusicLinks = musicLinks.map((song) => {
        if (song.id === songId) {
          const comments = song.comments || []

          return {
            ...song,
            comments: comments.map((comment) => {
              if (comment.id === commentId) {
                const likedBy = comment.likedBy || []

                if (isLiked) {
                  // Remove like
                  return {
                    ...comment,
                    likedBy: likedBy.filter((id) => id !== userId),
                    likes: Math.max(0, (comment.likes || 0) - 1),
                  }
                } else {
                  // Add like
                  if (!likedBy.includes(userId)) {
                    return {
                      ...comment,
                      likedBy: [...likedBy, userId],
                      likes: (comment.likes || 0) + 1,
                    }
                  }
                }
              }
              return comment
            }),
          }
        }
        return song
      })

      // Save updated musicLinks
      await updateDoc(artistDocRef, {
        musicLinks: updatedMusicLinks,
      })

      return { success: true }
    }

    throw new Error('Artist not found')
  } catch (error) {
    console.error('Error toggling comment like:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Post a reply to a comment
 * @param {string} artistId - Artist document ID
 * @param {string} songId - Song ID within musicLinks array
 * @param {string} commentId - Comment ID to reply to
 * @param {string} replyText - Reply text
 * @returns {Promise<{success: boolean, reply: Object}>}
 */
export async function postCommentReply(artistId, songId, commentId, replyText) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to reply')
    }

    if (!replyText || !replyText.trim()) {
      throw new Error('Reply cannot be empty')
    }

    const userId = user.uid

    // Get user's display name
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userName = userDoc.exists() ? userDoc.data().displayName || 'Anonymous' : 'Anonymous'

    // Create reply object
    const reply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      userName: userName,
      text: replyText.trim(),
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
    }

    const artistDocRef = doc(db, 'artists', artistId)
    const artistDoc = await getDoc(artistDocRef)

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const musicLinks = artistData.musicLinks || []

      // Track original comment author for notification
      let originalCommenterId = null
      let songTitle = ''

      // Find and update the specific song
      const updatedMusicLinks = musicLinks.map((song) => {
        if (song.id === songId) {
          const comments = song.comments || []
          songTitle = song.title

          return {
            ...song,
            comments: comments.map((comment) => {
              if (comment.id === commentId) {
                originalCommenterId = comment.userId // Store original commenter
                const replies = comment.replies || []
                return {
                  ...comment,
                  replies: [...replies, reply],
                  replyCount: (comment.replyCount || 0) + 1,
                }
              }
              return comment
            }),
          }
        }
        return song
      })

      // Save updated musicLinks
      await updateDoc(artistDocRef, {
        musicLinks: updatedMusicLinks,
      })

      // Send notification to original commenter
      if (originalCommenterId) {
        notifyOnReply(originalCommenterId, userId, userName, artistId, songTitle, songId)
      }

      return {
        success: true,
        reply: reply,
      }
    }

    throw new Error('Artist not found')
  } catch (error) {
    console.error('Error posting reply:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Delete a reply (only by reply author)
 * @param {string} artistId - Artist document ID
 * @param {string} songId - Song ID within musicLinks array
 * @param {string} commentId - Comment ID containing the reply
 * @param {string} replyId - Reply ID to delete
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteCommentReply(artistId, songId, commentId, replyId) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User must be logged in to delete replies')
    }

    const userId = user.uid
    const artistDocRef = doc(db, 'artists', artistId)
    const artistDoc = await getDoc(artistDocRef)

    if (artistDoc.exists()) {
      const artistData = artistDoc.data()
      const musicLinks = artistData.musicLinks || []

      // Find and update the specific song
      const updatedMusicLinks = musicLinks.map((song) => {
        if (song.id === songId) {
          const comments = song.comments || []

          return {
            ...song,
            comments: comments.map((comment) => {
              if (comment.id === commentId) {
                const replies = comment.replies || []
                const replyToDelete = replies.find((r) => r.id === replyId)

                // Check if user owns this reply
                if (replyToDelete && replyToDelete.userId !== userId) {
                  throw new Error('You can only delete your own replies')
                }

                return {
                  ...comment,
                  replies: replies.filter((r) => r.id !== replyId),
                  replyCount: Math.max(0, (comment.replyCount || 0) - 1),
                }
              }
              return comment
            }),
          }
        }
        return song
      })

      // Save updated musicLinks
      await updateDoc(artistDocRef, {
        musicLinks: updatedMusicLinks,
      })

      return { success: true }
    }

    throw new Error('Artist not found')
  } catch (error) {
    console.error('Error deleting reply:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}
