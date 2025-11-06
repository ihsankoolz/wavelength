import { auth, db } from '../services/firebase'
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  arrayUnion,
} from 'firebase/firestore'

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  NEW_MUSIC: 'new_music', // Artist posted new music
  COMMENT: 'comment', // Someone commented on your liked song
  REPLY: 'reply', // Someone replied to your comment
  LIKE_COMMENT: 'like_comment', // Someone liked your comment
  NEW_EVENT: 'new_event', // Followed artist created event
  FOLLOW: 'follow', // Someone followed you (for artists)
}

/**
 * Create a notification
 * @param {Object} notificationData - Notification details
 * @returns {Promise<string>} - Notification ID
 */
export async function createNotification({
  recipientId,
  type,
  senderId,
  senderName,
  title,
  message,
  link,
  metadata = {},
}) {
  try {
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      recipientId,
      type,
      senderId,
      senderName,
      title,
      message,
      link,
      metadata,
      read: false,
      createdAt: Timestamp.now(),
    })

    console.log('Notification created:', notificationRef.id)
    return notificationRef.id
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

/**
 * Notify followers when artist posts new music
 * @param {string} artistId - Artist ID
 * @param {string} artistName - Artist name
 * @param {Object} song - Song object
 */
export async function notifyFollowersNewMusic(artistId, artistName, song) {
  try {
    // Get artist's followers
    const artistDoc = await getDoc(doc(db, 'artists', artistId))
    if (!artistDoc.exists()) return

    // Find all users who follow this artist
    const usersQuery = query(
      collection(db, 'users'),
      where('followedArtists', 'array-contains', artistId),
    )
    const usersSnapshot = await getDocs(usersQuery)

    // Create notification for each follower
    const promises = usersSnapshot.docs.map((userDoc) => {
      return createNotification({
        recipientId: userDoc.id,
        type: NOTIFICATION_TYPES.NEW_MUSIC,
        senderId: artistId,
        senderName: artistName,
        title: `${artistName} posted new music`,
        message: `Check out their new ${song.type}: "${song.title}"`,
        link: `/artist/${artistId}`,
        metadata: {
          songId: song.id,
          songTitle: song.title,
          platform: song.platform,
        },
      })
    })

    await Promise.all(promises)
    console.log(`Notified ${usersSnapshot.size} followers about new music`)
  } catch (error) {
    console.error('Error notifying followers:', error)
  }
}

/**
 * Notify song owner when someone comments
 * @param {string} artistId - Artist ID
 * @param {string} songId - Song ID
 * @param {string} songTitle - Song title
 * @param {string} commenterId - User who commented
 * @param {string} commenterName - Commenter's name
 */
export async function notifyOnComment(artistId, songId, songTitle, commenterId, commenterName) {
  try {
    // Get artist's user ID
    const artistDoc = await getDoc(doc(db, 'artists', artistId))
    if (!artistDoc.exists()) return

    const artistData = artistDoc.data()
    const artistUserId = artistData.userId || artistData.createdBy

    if (!artistUserId || artistUserId === commenterId) return // Don't notify self

    await createNotification({
      recipientId: artistUserId,
      type: NOTIFICATION_TYPES.COMMENT,
      senderId: commenterId,
      senderName: commenterName,
      title: 'New comment on your song',
      message: `${commenterName} commented on "${songTitle}"`,
      link: `/artist/${artistId}?song=${songId}`,
      metadata: {
        songId,
        songTitle,
      },
    })

    console.log('Notified artist about comment')
  } catch (error) {
    console.error('Error notifying about comment:', error)
  }
}

/**
 * Notify comment author when someone replies
 * @param {string} originalCommenterId - User who wrote original comment
 * @param {string} replierId - User who replied
 * @param {string} replierName - Replier's name
 * @param {string} artistId - Artist ID
 * @param {string} songTitle - Song title
 * @param {string} songId - Song ID (optional)
 */
export async function notifyOnReply(
  originalCommenterId,
  replierId,
  replierName,
  artistId,
  songTitle,
  songId = null,
) {
  try {
    if (originalCommenterId === replierId) return // Don't notify self

    await createNotification({
      recipientId: originalCommenterId,
      type: NOTIFICATION_TYPES.REPLY,
      senderId: replierId,
      senderName: replierName,
      title: 'New reply to your comment',
      message: `${replierName} replied to your comment on "${songTitle}"`,
      link: songId ? `/artist/${artistId}?song=${songId}` : `/artist/${artistId}`,
      metadata: {
        songTitle,
        songId,
      },
    })

    console.log('Notified user about reply')
  } catch (error) {
    console.error('Error notifying about reply:', error)
  }
}

/**
 * Notify followers when artist creates event
 * @param {string} artistId - Artist ID
 * @param {string} artistName - Artist name
 * @param {Object} event - Event object
 */
export async function notifyFollowersNewEvent(artistId, artistName, event) {
  try {
    // Find all users who follow this artist
    const usersQuery = query(
      collection(db, 'users'),
      where('followedArtists', 'array-contains', artistId),
    )
    const usersSnapshot = await getDocs(usersQuery)

    // Create notification for each follower
    const promises = usersSnapshot.docs.map((userDoc) => {
      return createNotification({
        recipientId: userDoc.id,
        type: NOTIFICATION_TYPES.NEW_EVENT,
        senderId: artistId,
        senderName: artistName,
        title: `${artistName} created a new event`,
        message: `${event.title} on ${new Date(event.date).toLocaleDateString()}`,
        link: `/events/${event.id}`,
        metadata: {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
        },
      })
    })

    await Promise.all(promises)
    console.log(`Notified ${usersSnapshot.size} followers about new event`)
  } catch (error) {
    console.error('Error notifying about event:', error)
  }
}

/**
 * Get user's notifications
 * @param {string} userId - User ID
 * @param {number} limitCount - Max notifications to fetch
 * @returns {Promise<Array>} - Array of notifications
 */
export async function getUserNotifications(userId, limitCount = 20) {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    )

    const snapshot = await getDocs(notificationsQuery)
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }))

    return notifications
  } catch (error) {
    console.error('Error getting notifications:', error)
    return []
  }
}

/**
 * Get unread notification count
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Count of unread notifications
 */
export async function getUnreadCount(userId) {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      where('read', '==', false),
    )

    const snapshot = await getDocs(notificationsQuery)
    return snapshot.size
  } catch (error) {
    console.error('❌ Error getting unread count:', error)
    return 0
  }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 */
export async function markAsRead(notificationId) {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
    })
    console.log('Notification marked as read')
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

/**
 * Mark all notifications as read
 * @param {string} userId - User ID
 */
export async function markAllAsRead(userId) {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      where('read', '==', false),
    )

    const snapshot = await getDocs(notificationsQuery)
    const promises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        read: true,
      }),
    )

    await Promise.all(promises)
    console.log(`Marked ${snapshot.size} notifications as read`)
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 */
export async function deleteNotification(notificationId) {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      deleted: true,
    })
    console.log('Notification deleted')
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} - Icon class
 */
export function getNotificationIcon(type) {
  const icons = {
    [NOTIFICATION_TYPES.NEW_MUSIC]: 'bi-music-note-beamed',
    [NOTIFICATION_TYPES.COMMENT]: 'bi-chat-dots',
    [NOTIFICATION_TYPES.REPLY]: 'bi-reply',
    [NOTIFICATION_TYPES.LIKE_COMMENT]: 'bi-heart-fill',
    [NOTIFICATION_TYPES.NEW_EVENT]: 'bi-calendar-event',
    [NOTIFICATION_TYPES.FOLLOW]: 'bi-person-plus',
  }
  return icons[type] || 'bi-bell'
}

/**
 * Get notification color based on type
 * @param {string} type - Notification type
 * @returns {string} - Color class
 */
export function getNotificationColor(type) {
  const colors = {
    [NOTIFICATION_TYPES.NEW_MUSIC]: 'primary',
    [NOTIFICATION_TYPES.COMMENT]: 'info',
    [NOTIFICATION_TYPES.REPLY]: 'success',
    [NOTIFICATION_TYPES.LIKE_COMMENT]: 'danger',
    [NOTIFICATION_TYPES.NEW_EVENT]: 'warning',
    [NOTIFICATION_TYPES.FOLLOW]: 'secondary',
  }
  return colors[type] || 'secondary'
}
