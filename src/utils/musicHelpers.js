// musicHelpers.js - Utility functions for music platform integrations

/**
 * Converts a regular Spotify URL to an embed URL
 * @param {string} url - Regular Spotify URL (track or album)
 * @returns {string|null} - Embed URL or null if invalid
 */
export function getSpotifyEmbedUrl(url) {
  if (!url) return null

  // Handle both track and album URLs
  if (url.includes('open.spotify.com/track/') || url.includes('open.spotify.com/album/')) {
    return url.replace('open.spotify.com/', 'open.spotify.com/embed/')
  }

  return null
}

/**
 * Converts a YouTube URL to an embed URL
 * @param {string} url - Regular YouTube URL
 * @returns {string|null} - Embed URL or null if invalid
 */
export function getYouTubeEmbedUrl(url) {
  if (!url) return null

  let videoId = ''

  // Handle youtube.com/watch?v= format
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0]
  }
  // Handle youtu.be/ format
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0]
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

/**
 * Validates a Spotify URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid Spotify URL
 */
export function validateSpotifyUrl(url) {
  if (!url) return true // Optional field
  return url.includes('open.spotify.com/track/') || url.includes('open.spotify.com/album/')
}

/**
 * Validates a YouTube URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid YouTube URL
 */
export function validateYouTubeUrl(url) {
  if (!url) return true // Optional field
  return url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')
}

/**
 * Extracts the Spotify track/album ID from a URL
 * @param {string} url - Spotify URL
 * @returns {string|null} - Track/Album ID or null
 */
export function getSpotifyId(url) {
  if (!url) return null

  const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/)
  const albumMatch = url.match(/album\/([a-zA-Z0-9]+)/)

  return trackMatch ? trackMatch[1] : albumMatch ? albumMatch[1] : null
}

/**
 * Extracts YouTube video ID from a URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
export function getYouTubeVideoId(url) {
  if (!url) return null

  if (url.includes('youtube.com/watch?v=')) {
    return url.split('watch?v=')[1].split('&')[0]
  } else if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0]
  }

  return null
}

/**
 * Generates a unique ID for a music link
 * @returns {string} - Unique ID
 */
export function generateMusicLinkId() {
  return `music_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Determines platform type from URL
 * @param {string} url - Music platform URL
 * @returns {string} - 'spotify' | 'youtube' | 'unknown'
 */
export function detectPlatform(url) {
  if (!url) return 'unknown'

  if (url.includes('spotify.com')) return 'spotify'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'

  return 'unknown'
}

/**
 * Creates a music link object with all required fields
 * @param {Object} params - { title, type, platform, url, genres }
 * @returns {Object} - Complete music link object
 */
export function createMusicLink({ title, type, platform, url, genres = [] }) {
  const embedUrl = platform === 'spotify' ? getSpotifyEmbedUrl(url) : getYouTubeEmbedUrl(url)

  return {
    id: generateMusicLinkId(),
    title: title || 'Untitled',
    type: type || 'single', // 'single', 'album', 'video'
    platform: platform || detectPlatform(url),
    url: url,
    embedUrl: embedUrl,
    genres: genres,
    likes: 0,
    plays: 0,
    addedAt: new Date(),
  }
}

/**
 * Formats play count for display (e.g., 1234 -> 1.2K)
 * @param {number} count - Play count
 * @returns {string} - Formatted count
 */
export function formatPlayCount(count) {
  if (!count || count === 0) return '0'

  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

/**
 * Formats like count for display
 * @param {number} count - Like count
 * @returns {string} - Formatted count
 */
export function formatLikeCount(count) {
  return formatPlayCount(count) // Same formatting logic
}
