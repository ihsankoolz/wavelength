// artistSimilarity.js - Calculate artist similarity and build network graph

/**
 * Calculate similarity score between two artists
 * @param {Object} artist1 - First artist
 * @param {Object} artist2 - Second artist
 * @returns {number} - Similarity score (0-100)
 */
export function calculateArtistSimilarity(artist1, artist2) {
  let score = 0

  // 1. GENRE OVERLAP (40 points max)
  if (artist1.genres && artist2.genres && artist1.genres.length > 0 && artist2.genres.length > 0) {
    const sharedGenres = artist1.genres.filter((g) =>
      artist2.genres.some((g2) => g2.toLowerCase() === g.toLowerCase()),
    ).length

    // Each shared genre = 20 points, max 40
    const genreScore = Math.min(40, sharedGenres * 20)
    score += genreScore
  }

  // 2. FOLLOWER COUNT SIMILARITY (20 points max)
  const follower1 = artist1.followerCount || 0
  const follower2 = artist2.followerCount || 0

  if (follower1 > 0 && follower2 > 0) {
    const followerRatio = Math.min(follower1 / follower2, follower2 / follower1)
    const followerScore = followerRatio * 20
    score += followerScore
  }

  // 3. SHARED FOLLOWERS (30 points max)
  if (artist1.followers && artist2.followers) {
    const sharedFollowers = artist1.followers.filter((f) => artist2.followers.includes(f)).length
    const sharedFollowerScore = Math.min(30, sharedFollowers * 3)
    score += sharedFollowerScore
  }

  // 4. MUSIC COUNT SIMILARITY (10 points max)
  // Artists with similar catalog sizes might be similar
  const music1 = (artist1.musicLinks || []).length
  const music2 = (artist2.musicLinks || []).length

  if (music1 > 0 && music2 > 0) {
    const musicRatio = Math.min(music1 / music2, music2 / music1)
    const musicScore = musicRatio * 10
    score += musicScore
  }

  return Math.min(100, Math.round(score))
}

/**
 * Build network graph data for visualization
 * @param {string} currentUserId - Current user's ID
 * @param {Array} allArtists - All artists in the database
 * @param {Object} userPreferences - User's preferences (followingArtists, preferredGenres, etc.)
 * @param {Object} options - Optional parameters
 * @returns {Object} - { nodes, links } for D3.js
 */
export function buildArtistNetwork(currentUserId, allArtists, userPreferences, options = {}) {
  const {
    maxSimilarArtists = 25, // Limit to prevent clutter
    similarityThreshold = 35, // Minimum similarity to show
    includeUserCenter = true, // Show "Your Interests" center node
  } = options

  const nodes = []
  const links = []
  const nodeIds = new Set()

  // Get artists user is following
  const followingArtistIds = userPreferences.followingArtists || []
  const userFollowedArtists = allArtists.filter((a) => followingArtistIds.includes(a.id))

  // Store for later: whether user actually follows any artists
  const hasFollowedArtists = userFollowedArtists.length > 0

  // If user has no followed artists, use preferred genres for recommendations
  let seedArtists = []
  if (userFollowedArtists.length === 0 && userPreferences.preferredGenres) {
    // Show top artists from user's preferred genres
    seedArtists = allArtists
      .filter((artist) => {
        if (!artist.genres) return false
        return artist.genres.some((g) => userPreferences.preferredGenres.includes(g))
      })
      .sort((a, b) => (b.followerCount || 0) - (a.followerCount || 0))
      .slice(0, 5)
  }

  // If still no artists, show top overall artists
  if (userFollowedArtists.length === 0 && seedArtists.length === 0) {
    seedArtists = allArtists
      .sort((a, b) => (b.followerCount || 0) - (a.followerCount || 0))
      .slice(0, 5)
  }

  // Add center node (user's interests)
  if (includeUserCenter) {
    nodes.push({
      id: 'user-center',
      label: 'Your Interests',
      type: 'user',
      size: 25,
      color: '#bb1814',
      fixed: false,
    })
    nodeIds.add('user-center')
  }

  // Add followed artists as BLUE nodes (only if user actually follows them)
  if (hasFollowedArtists) {
    userFollowedArtists.forEach((artist) => {
      if (!nodeIds.has(artist.id)) {
        nodes.push({
          id: artist.id,
          label: artist.artistName,
          type: 'followed',
          size: 18,
          color: '#667eea', // Blue - artists user actually follows
          data: artist,
          genres: artist.genres || [],
          followerCount: artist.followerCount || 0,
        })
        nodeIds.add(artist.id)

        // Connect to user center
        if (includeUserCenter) {
          links.push({
            source: 'user-center',
            target: artist.id,
            strength: 1,
            type: 'primary',
          })
        }
      }
    })
  }

  // Add seed artists as GREEN nodes (recommendations, not followed)
  if (!hasFollowedArtists && seedArtists.length > 0) {
    seedArtists.forEach((artist) => {
      if (!nodeIds.has(artist.id)) {
        nodes.push({
          id: artist.id,
          label: artist.artistName,
          type: 'similar', // Green - recommended, not followed
          size: 18,
          color: '#4CAF50', // Green - recommendations based on genres/popularity
          data: artist,
          genres: artist.genres || [],
          followerCount: artist.followerCount || 0,
        })
        nodeIds.add(artist.id)

        // Connect to user center
        if (includeUserCenter) {
          links.push({
            source: 'user-center',
            target: artist.id,
            strength: 0.8,
            type: 'similar',
          })
        }
      }
    })
  }

  // Determine which artists to use for finding similar artists
  const baseArtists = hasFollowedArtists ? userFollowedArtists : seedArtists

  // Find similar artists for each base artist
  const similarArtistScores = new Map()

  baseArtists.forEach((baseArtist) => {
    allArtists.forEach((otherArtist) => {
      // Skip if same artist
      if (otherArtist.id === baseArtist.id) return
      // Skip if already in our node list (either followed or seed)
      if (nodeIds.has(otherArtist.id)) return
      // Don't show user's own artist profile
      if (otherArtist.id === currentUserId) return

      // Calculate similarity
      const similarity = calculateArtistSimilarity(baseArtist, otherArtist)

      if (similarity >= similarityThreshold) {
        // Track highest similarity score for each artist
        if (!similarArtistScores.has(otherArtist.id)) {
          similarArtistScores.set(otherArtist.id, {
            artist: otherArtist,
            maxSimilarity: similarity,
            connections: [{ source: baseArtist.id, similarity }],
          })
        } else {
          const existing = similarArtistScores.get(otherArtist.id)
          existing.maxSimilarity = Math.max(existing.maxSimilarity, similarity)
          existing.connections.push({ source: baseArtist.id, similarity })
        }
      }
    })
  })

  // Sort by similarity and limit
  const topSimilarArtists = Array.from(similarArtistScores.values())
    .sort((a, b) => b.maxSimilarity - a.maxSimilarity)
    .slice(0, maxSimilarArtists)

  // Add similar artists as nodes
  topSimilarArtists.forEach(({ artist, maxSimilarity, connections }) => {
    if (!nodeIds.has(artist.id)) {
      // Size based on similarity (15-22px)
      const sizeBonus = (maxSimilarity / 100) * 7
      const nodeSize = 15 + sizeBonus

      nodes.push({
        id: artist.id,
        label: artist.artistName,
        type: 'similar',
        size: nodeSize,
        color: '#4CAF50',
        data: artist,
        genres: artist.genres || [],
        followerCount: artist.followerCount || 0,
        similarity: maxSimilarity,
      })
      nodeIds.add(artist.id)

      // Add connections to followed artists
      connections.forEach(({ source, similarity }) => {
        links.push({
          source: source,
          target: artist.id,
          strength: similarity / 100,
          type: 'similar',
          similarity: similarity,
        })
      })
    }
  })

  return { nodes, links }
}

/**
 * Get primary genre for color coding (optional enhancement)
 * @param {Array} genres - Artist's genres
 * @returns {string} - Primary genre
 */
export function getPrimaryGenre(genres) {
  if (!genres || genres.length === 0) return 'Other'
  return genres[0]
}

/**
 * Get genre color (optional enhancement for genre-based coloring)
 * @param {string} genre - Genre name
 * @returns {string} - Hex color
 */
export function getGenreColor(genre) {
  const genreColors = {
    Indie: '#667eea',
    Rock: '#E74C3C',
    Jazz: '#F39C12',
    Electronic: '#9B59B6',
    Pop: '#E91E63',
    'Hip Hop': '#3498DB',
    'R&B': '#1ABC9C',
    Folk: '#16A085',
    Classical: '#8E44AD',
    Metal: '#34495E',
    Alternative: '#7F8C8D',
    Soul: '#D35400',
    Blues: '#2C3E50',
    Punk: '#C0392B',
    Reggae: '#27AE60',
    Country: '#D68910',
    'K-Pop': '#FF6B9D',
    EDM: '#6C5CE7',
    Funk: '#FD79A8',
    Gospel: '#A29BFE',
  }

  return genreColors[genre] || '#95a5a6'
}
