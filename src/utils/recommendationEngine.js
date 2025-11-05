// recommendationEngine.js - Smart song recommendation algorithm
import { db } from '@/services/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

/**
 * Get recommended songs for a user based on their profile and engagement
 * @param {string} userId - User ID
 * @param {Object} options - Recommendation options
 * @returns {Promise<Array>} - Array of scored and sorted songs
 */
export async function getRecommendedSongs(userId, options = {}) {
  const {
    limit = 50, // Get more than needed for filtering
    includeFollowedArtistsOnly = false,
  } = options

  try {
    console.log('🎵 Getting recommendations for user:', userId)

    // 1. Get user profile
    const userProfile = await getUserProfile(userId)
    console.log('👤 User profile:', userProfile)

    // 2. Get all songs from all artists
    const allSongs = await getAllSongs()
    console.log('📀 Total songs available:', allSongs.length)

    // 3. Determine user type and score songs accordingly
    const scoredSongs = allSongs.map((song) => ({
      ...song,
      score: calculateSongScore(song, userProfile),
    }))

    // 4. Sort by score (highest first)
    scoredSongs.sort((a, b) => b.score - a.score)

    console.log(
      '✅ Top 5 recommended songs:',
      scoredSongs.slice(0, 5).map((s) => ({
        title: s.title,
        artist: s.artistName,
        score: s.score.toFixed(2),
      })),
    )

    return scoredSongs.slice(0, limit)
  } catch (error) {
    console.error('❌ Error getting recommendations:', error)
    return []
  }
}

/**
 * Get user profile data for recommendations
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile object
 */
export async function getUserProfile(userId) {
  const userDoc = await getDoc(doc(db, 'users', userId))

  if (!userDoc.exists()) {
    return {
      isNewUser: true,
      preferredGenres: [],
      followedArtists: [],
      likedSongs: [],
      interestedEvents: [],
      listenHistory: [],
      artistClicks: {},
    }
  }

  const userData = userDoc.data()
  const likedSongs = userData.likedSongs || []
  const followedArtists = userData.followedArtists || []
  const interestedEvents = userData.interestedEvents || []
  const preferredGenres = userData.preferredGenres || []
  const listenHistory = userData.listenHistory || []
  const artistClicks = userData.artistClicks || {}

  // Determine if user is "new" (no engagement yet)
  const isNewUser =
    likedSongs.length === 0 && followedArtists.length === 0 && listenHistory.length === 0

  // Get genres from interested events
  const eventGenres = await getGenresFromEvents(interestedEvents)

  // Combine preferred genres with event genres
  const allGenres = [...new Set([...preferredGenres, ...eventGenres])]

  return {
    isNewUser,
    preferredGenres: allGenres,
    followedArtists,
    likedSongs,
    interestedEvents,
    listenHistory,
    artistClicks,
    hasPreferences: preferredGenres.length > 0 || allGenres.length > 0,
  }
}

/**
 * Get genres from events user is interested in
 * @param {Array} eventIds - Array of event IDs
 * @returns {Promise<Array>} - Array of genre strings
 */
async function getGenresFromEvents(eventIds) {
  if (eventIds.length === 0) return []

  const genres = []
  for (const eventId of eventIds) {
    const eventDoc = await getDoc(doc(db, 'events', eventId))
    if (eventDoc.exists()) {
      const eventData = eventDoc.data()
      if (eventData.genres && Array.isArray(eventData.genres)) {
        genres.push(...eventData.genres)
      }
    }
  }

  return [...new Set(genres)] // Remove duplicates
}

/**
 * Extract platform-specific data from song URL
 * @param {Object} song - Song object with url
 * @returns {Object} - Object with platform, spotifyId, soundcloudUrl, youtubeId
 */
function extractPlatformData(song) {
  const url = song.url || ''
  let platform = 'unknown'
  let spotifyId = null
  let soundcloudUrl = null
  let youtubeId = null

  if (url.includes('spotify.com')) {
    platform = 'spotify'
    const match = url.match(/track\/([a-zA-Z0-9]+)/)
    spotifyId = match ? match[1] : null
  } else if (url.includes('soundcloud.com')) {
    platform = 'soundcloud'
    soundcloudUrl = url
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    platform = 'youtube'
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    youtubeId = match ? match[1] : null
  }

  return {
    platform,
    spotifyId,
    soundcloudUrl,
    youtubeId,
  }
}

/**
 * Get all songs from all artists
 * @returns {Promise<Array>} - Array of song objects with artist info
 */
async function getAllSongs() {
  const artistsSnapshot = await getDocs(collection(db, 'artists'))
  const songs = []

  artistsSnapshot.forEach((artistDoc) => {
    const artistData = artistDoc.data()
    const artistId = artistDoc.id
    const musicLinks = artistData.musicLinks || []

    musicLinks.forEach((song) => {
      // Extract platform-specific data
      const platformData = extractPlatformData(song)

      songs.push({
        ...song,
        ...platformData, // Add platform, spotifyId, soundcloudUrl, youtubeId
        artistId,
        artistName: artistData.artistName || 'Unknown Artist',
        artistGenres: artistData.genres || [],
        artistPhoto: artistData.profileImage || artistData.photoURL || '',
        followerCount: artistData.followerCount || 0,
      })
    })
  })

  return songs
}

/**
 * Calculate recommendation score for a song
 * @param {Object} song - Song object
 * @param {Object} userProfile - User profile object
 * @returns {number} - Score (0-100)
 */
export function calculateSongScore(song, userProfile) {
  const {
    isNewUser,
    hasPreferences,
    preferredGenres,
    followedArtists,
    interestedEvents,
    likedSongs,
  } = userProfile

  // NEW USER WITH NO PREFERENCES - Show trending songs
  if (isNewUser && !hasPreferences) {
    return calculateTrendingScore(song)
  }

  // NEW USER WITH PREFERENCES - Genre-focused
  if (isNewUser && hasPreferences) {
    return calculateNewUserScore(song, preferredGenres)
  }

  // ACTIVE USER - Personalized recommendations
  return calculateActiveUserScore(song, userProfile)
}

/**
 * Trending score for brand new users (no preferences set)
 * Score = Popularity (60%) + Recency (40%)
 */
function calculateTrendingScore(song) {
  const likes = song.likes || 0
  const comments = (song.comments || []).length
  const addedAt = song.addedAt?.toMillis() || Date.now()

  // Popularity score (0-60)
  const popularity = likes + comments * 2 // Comments worth 2x likes
  const popularityScore = Math.min(60, (popularity / 100) * 60)

  // Recency score (0-40) - songs from last 30 days get full points
  const daysSinceAdded = (Date.now() - addedAt) / (1000 * 60 * 60 * 24)
  const recencyScore = Math.max(0, 40 - (daysSinceAdded / 30) * 40)

  return popularityScore + recencyScore
}

/**
 * New user score (has genre preferences but no engagement)
 * Score = Genre Match (50%) + Popularity (30%) + Recency (20%)
 */
function calculateNewUserScore(song, preferredGenres) {
  const songGenres = song.genres || song.artistGenres || []
  const likes = song.likes || 0
  const comments = (song.comments || []).length
  const addedAt = song.addedAt?.toMillis() || Date.now()

  // Genre match score (0-50)
  const genreMatches = songGenres.filter((g) =>
    preferredGenres.some((pg) => pg.toLowerCase() === g.toLowerCase()),
  ).length
  const genreScore = genreMatches > 0 ? 50 : 0

  // Popularity score (0-30)
  const popularity = likes + comments * 2
  const popularityScore = Math.min(30, (popularity / 100) * 30)

  // Recency score (0-20)
  const daysSinceAdded = (Date.now() - addedAt) / (1000 * 60 * 60 * 24)
  const recencyScore = Math.max(0, 20 - (daysSinceAdded / 30) * 20)

  return genreScore + popularityScore + recencyScore
}

/**
 * Active user score (has engagement: follows, likes, events, listen history)
 * Score = Followed Artists (30%) + Genre Match (25%) + Listen History (20%) +
 *         Artist Clicks (10%) + Popularity (10%) + Recency (5%)
 */
function calculateActiveUserScore(song, userProfile) {
  const { preferredGenres, followedArtists, interestedEvents, listenHistory, artistClicks } =
    userProfile
  const songGenres = song.genres || song.artistGenres || []
  const likes = song.likes || 0
  const comments = (song.comments || []).length
  const addedAt = song.addedAt?.toMillis() || Date.now()

  // Followed artist score (0-30)
  const isFollowedArtist = followedArtists.includes(song.artistId)
  const followedScore = isFollowedArtist ? 30 : 0

  // Genre match score (0-25) - Boost genres from listen history
  const listenedGenres = listenHistory
    .flatMap((play) => play.genres || [])
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {})

  const genreMatches = songGenres.filter((g) =>
    preferredGenres.some((pg) => pg.toLowerCase() === g.toLowerCase()),
  ).length

  const listenedGenreMatches = songGenres.filter((g) => listenedGenres[g] > 0).length

  const genreScore = genreMatches > 0 || listenedGenreMatches > 0 ? 25 : 0

  // Listen history score (0-20) - Boost songs from artists user has listened to
  const listenedArtistIds = [...new Set(listenHistory.map((play) => play.artistId))]
  const hasListenedToArtist = listenedArtistIds.includes(song.artistId)
  const listenHistoryScore = hasListenedToArtist ? 20 : 0

  // Artist click score (0-10) - Boost artists user has clicked on
  const clickCount = artistClicks[song.artistId] || 0
  const clickScore = Math.min(10, clickCount * 2) // 2 points per click, max 10

  // Popularity score (0-10)
  const popularity = likes + comments * 2
  const popularityScore = Math.min(10, (popularity / 100) * 10)

  // Recency score (0-5)
  const daysSinceAdded = (Date.now() - addedAt) / (1000 * 60 * 60 * 24)
  const recencyScore = Math.max(0, 5 - (daysSinceAdded / 30) * 5)

  return (
    followedScore + genreScore + listenHistoryScore + clickScore + popularityScore + recencyScore
  )
}

/**
 * Filter songs by genre
 * @param {Array} songs - Array of songs
 * @param {string} genre - Genre to filter by
 * @returns {Array} - Filtered songs
 */
export function filterSongsByGenre(songs, genre) {
  if (!genre || genre === 'all') return songs

  return songs.filter((song) => {
    const songGenres = song.genres || song.artistGenres || []
    return songGenres.some((g) => g.toLowerCase() === genre.toLowerCase())
  })
}

/**
 * Sort songs by different criteria
 * @param {Array} songs - Array of songs
 * @param {string} sortBy - Sort criteria
 * @param {Object} userProfile - User profile for recommendation scoring (optional)
 * @returns {Array} - Sorted songs
 */
export function sortSongs(songs, sortBy, userProfile = null) {
  const sorted = [...songs]

  switch (sortBy) {
    case 'popular':
      console.log('📊 Sorting by POPULAR (Likes + Comments × 2)')
      return sorted.sort((a, b) => {
        const aPopularity = (a.likes || 0) + (a.comments || []).length * 2
        const bPopularity = (b.likes || 0) + (b.comments || []).length * 2
        return bPopularity - aPopularity
      })

    case 'recent':
      console.log('🆕 Sorting by RECENT (Newest first)')
      return sorted.sort((a, b) => {
        const aTime = a.addedAt?.toMillis() || 0
        const bTime = b.addedAt?.toMillis() || 0
        return bTime - aTime
      })

    case 'trending':
      console.log('🔥 Sorting by TRENDING (60% Popularity + 40% Recency)')
      return sorted.sort((a, b) => {
        const aScore = calculateTrendingScore(a)
        const bScore = calculateTrendingScore(b)
        return bScore - aScore
      })

    case 'recommended':
      // Recalculate recommendation scores based on user profile
      if (userProfile) {
        const { isNewUser, hasPreferences } = userProfile
        let algorithm = 'Active User (Multi-factor)'
        if (isNewUser && !hasPreferences) {
          algorithm = 'New User - No Preferences (Trending)'
        } else if (isNewUser && hasPreferences) {
          algorithm = 'New User - With Preferences (Genre Match)'
        }
        console.log(`⭐ Sorting by RECOMMENDED - Algorithm: ${algorithm}`)

        const scoredSongs = sorted.map((song) => ({
          ...song,
          _tempScore: calculateSongScore(song, userProfile),
        }))
        return scoredSongs.sort((a, b) => b._tempScore - a._tempScore)
      }
      // Fallback to existing order if no user profile
      console.log('⭐ Sorting by RECOMMENDED (using existing order - no user profile)')
      return sorted

    default:
      return sorted
  }
}

/**
 * Get recommended artists for a user
 * @param {Array} allArtists - Array of all artists
 * @param {Array} userGenres - User's preferred genres
 * @param {string} currentUserId - Current user's ID (to exclude from recommendations)
 * @param {Object} options - Recommendation options
 * @returns {Array} - Array of recommended artists (max 20)
 */
export function getRecommendedArtists(
  allArtists,
  userGenres = [],
  currentUserId = null,
  options = {},
) {
  const { limit = 20 } = options

  // Filter out current user if they are an artist
  let filteredArtists = allArtists
  if (currentUserId) {
    filteredArtists = allArtists.filter((artist) => artist.id !== currentUserId)
  }

  // NEW USER WITH NO PREFERENCES - Show popular artists
  if (userGenres.length === 0) {
    console.log('👥 Artist Recommendation: No preferences - showing popular artists')
    return filteredArtists
      .sort((a, b) => (b.followerCount || 0) - (a.followerCount || 0))
      .slice(0, limit)
  }

  // USER WITH PREFERENCES - Genre-based recommendation
  console.log('👥 Artist Recommendation: Genre-based scoring for', userGenres.length, 'genres')

  // Score artists by genre match
  const scoredArtists = filteredArtists.map((artist) => {
    let score = 0

    if (artist.genres && Array.isArray(artist.genres)) {
      // Count how many of the artist's genres match user preferences
      artist.genres.forEach((artistGenre) => {
        if (userGenres.some((userGenre) => userGenre.toLowerCase() === artistGenre.toLowerCase())) {
          score += 10 // 10 points per matching genre
        }
      })
    }

    // Add popularity bonus (scaled to max 5 points)
    const popularityBonus = Math.min(5, (artist.followerCount || 0) / 100)
    score += popularityBonus

    return { ...artist, _recommendationScore: score }
  })

  // Sort by score (highest first), then by follower count as tiebreaker
  const sortedArtists = scoredArtists.sort((a, b) => {
    if (b._recommendationScore !== a._recommendationScore) {
      return b._recommendationScore - a._recommendationScore
    }
    return (b.followerCount || 0) - (a.followerCount || 0)
  })

  console.log(
    '✅ Top 5 recommended artists:',
    sortedArtists.slice(0, 5).map((a) => ({
      name: a.artistName,
      score: a._recommendationScore.toFixed(1),
      followers: a.followerCount || 0,
      genres: a.genres?.slice(0, 2),
    })),
  )

  return sortedArtists.slice(0, limit)
}
