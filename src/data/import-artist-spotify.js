import fetch from 'node-fetch' // npm i node-fetch@2
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Missing Firebase configuration in .env file')
  console.log('   Please ensure your .env file has all VITE_FIREBASE_* variables')
  process.exit(1)
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Spotify configuration from environment variables
const SPOTIFY_CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('❌ Error: Missing Spotify credentials in .env file')
  console.log('   Please ensure VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET are set')
  process.exit(1)
}

// Gemini AI configuration
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.error('❌ Error: Missing Gemini API key in .env file')
  console.log('   Please ensure VITE_GEMINI_API_KEY is set')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Allowed genres (must match frontend options in Onboarding, ArtistSetup, EditArtistProfile)
const ALLOWED_GENRES = [
  'Indie',
  'Jazz',
  'Electronic',
  'Rock',
  'Pop',
  'Hip Hop',
  'R&B',
  'Folk',
  'Classical',
  'Metal',
  'Alternative',
  'Soul',
  'Blues',
  'Punk',
  'Reggae',
  'Country',
  'EDM',
  'Funk',
  'Gospel',
  'Mandopop',
  'Indie Pop',
  'Alternative Pop',
  'Singer-Songwriter',
  'Dream Pop',
  'Electropop',
  'Folk Pop',
  'Alternative R&B',
  'Bedroom Pop',
  'Acoustic',
  'Experimental',
]

// Cache for Spotify access token
let spotifyAccessToken = null
let tokenExpiresAt = 0

/**
 * Generate genres for an artist using Gemini AI
 * IMPORTANT: AI can ONLY select from the predefined ALLOWED_GENRES list
 */
async function generateArtistGenresWithAI(artistName, artistBio) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a music genre classifier. Based on the artist name and bio, select exactly 3-5 music genres that best describe this artist's overall style.

Artist: ${artistName}
Bio: ${artistBio || 'No bio available'}

You MUST choose ONLY from this list of allowed genres:
${ALLOWED_GENRES.join(', ')}

Return ONLY a JSON array of genre strings (exact capitalization as shown above). Maximum 5 genres.
Example format: ["Indie Pop", "Soul", "R&B"]

Genres:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    // Parse the JSON response
    const genreMatch = text.match(/\[([^\]]+)\]/)
    if (genreMatch) {
      const genresText = genreMatch[0]
      let genres = JSON.parse(genresText)

      // Filter to only include allowed genres (case-insensitive matching)
      genres = genres
        .map((g) => {
          const match = ALLOWED_GENRES.find((allowed) => allowed.toLowerCase() === g.toLowerCase())
          return match || null
        })
        .filter((g) => g !== null)
        .slice(0, 5) // Ensure max 5 genres

      // If no valid genres after filtering, use fallback
      if (genres.length === 0) {
        console.log(`   ⚠️  AI returned genres outside allowed list, using fallback`)
        return ['Pop', 'Indie']
      }

      return genres
    }

    // Fallback if parsing fails
    console.log(`   ⚠️  AI response parsing failed, using fallback`)
    return ['Pop', 'Indie']
  } catch (error) {
    console.error(`   ❌ AI genre generation error: ${error.message}`)
    return ['Pop', 'Indie'] // Fallback genres
  }
}

/**
 * Generate genres for a specific song using Gemini AI
 * IMPORTANT: AI can ONLY select from the predefined ALLOWED_GENRES list
 */
async function generateSongGenresWithAI(songTitle, artistName, albumName) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a music genre classifier. Based on the song title, artist, and album, select exactly 1-3 music genres that best describe this specific song's style.

Song: "${songTitle}"
Artist: ${artistName}
Album: ${albumName}

You MUST choose ONLY from this list of allowed genres:
${ALLOWED_GENRES.join(', ')}

Return ONLY a JSON array of genre strings (exact capitalization as shown above). Maximum 3 genres (be specific to the song, not just the artist).
Example format: ["Indie Pop", "Dream Pop"]

Genres:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()

    // Parse the JSON response
    const genreMatch = text.match(/\[([^\]]+)\]/)
    if (genreMatch) {
      const genresText = genreMatch[0]
      let genres = JSON.parse(genresText)

      // Filter to only include allowed genres (case-insensitive matching)
      genres = genres
        .map((g) => {
          const match = ALLOWED_GENRES.find((allowed) => allowed.toLowerCase() === g.toLowerCase())
          return match || null
        })
        .filter((g) => g !== null)
        .slice(0, 3) // Ensure max 3 genres for songs

      // If no valid genres after filtering, use fallback
      if (genres.length === 0) {
        console.log(
          `   ⚠️  AI returned genres outside allowed list for song "${songTitle}", using fallback`,
        )
        return ['Pop']
      }

      return genres
    }

    // Fallback if parsing fails
    console.log(`   ⚠️  AI response parsing failed for song "${songTitle}", using fallback`)
    return ['Pop']
  } catch (error) {
    console.error(`   ❌ AI song genre generation error for "${songTitle}": ${error.message}`)
    return ['Pop'] // Fallback genre
  }
}

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getSpotifyAccessToken() {
  // Return cached token if still valid
  if (spotifyAccessToken && Date.now() < tokenExpiresAt) {
    return spotifyAccessToken
  }

  console.log('🔑 Getting Spotify access token...')

  const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get Spotify access token: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  spotifyAccessToken = data.access_token
  tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000 // Refresh 1 min before expiry

  console.log('✅ Spotify access token obtained\n')
  return spotifyAccessToken
}

/**
 * Load artist names from query-spotify.json
 */
async function loadQueryList() {
  const filePath = path.join(__dirname, 'query-spotify.json')
  console.log('Reading query-spotify.json from:', filePath)
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

/**
 * Search for an artist on Spotify by name
 */
async function searchSpotifyArtist(artistName) {
  const token = await getSpotifyAccessToken()
  const query = encodeURIComponent(artistName)
  const url = `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`

  console.log(`🔍 Searching Spotify for: "${artistName}"`)

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Spotify search error (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  if (!data.artists || !data.artists.items || data.artists.items.length === 0) {
    throw new Error(`No artist found for "${artistName}"`)
  }

  return data.artists.items[0]
}

/**
 * Get detailed artist information from Spotify
 */
async function getSpotifyArtistById(artistId) {
  const token = await getSpotifyAccessToken()
  const url = `https://api.spotify.com/v1/artists/${artistId}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Spotify API error (${response.status}): ${errorText}`)
  }

  return await response.json()
}

/**
 * Get artist's top tracks from Spotify
 */
async function getArtistTopTracks(artistId) {
  const token = await getSpotifyAccessToken()
  // SG market for Singapore artists
  const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=SG`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    console.log(`   ⚠️  Could not fetch top tracks (${response.status})`)
    return { tracks: [] }
  }

  return await response.json()
}

/**
 * Get artist's albums from Spotify
 */
async function getArtistAlbums(artistId) {
  const token = await getSpotifyAccessToken()
  const url = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=SG&limit=10`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    console.log(`   ⚠️  Could not fetch albums (${response.status})`)
    return { items: [] }
  }

  return await response.json()
}

/**
 * Save artist data to Firestore
 */
async function saveArtistToFirestore(spotifyData, artistQuery) {
  if (!spotifyData) {
    console.log('No artist data to save')
    return
  }

  // Use Spotify ID as the document ID
  const artistId = spotifyData.id
  const artistName = artistQuery.name || artistQuery.artist_name

  // Fetch additional data (top tracks and albums)
  console.log(`   📀 Fetching top tracks and albums...`)
  const [topTracksData, albumsData] = await Promise.all([
    getArtistTopTracks(artistId),
    getArtistAlbums(artistId),
  ])

  // Extract the best quality image
  const profileImage =
    spotifyData.images && spotifyData.images.length > 0 ? spotifyData.images[0].url : ''

  // Get genres: Priority order: 1) query-spotify.json, 2) Spotify API, 3) AI generation
  let artistGenres = spotifyData.genres || []

  if (artistQuery.genres && artistQuery.genres.length > 0) {
    // Use genres from query-spotify.json (highest priority)
    artistGenres = artistQuery.genres
    console.log(`   🏷️  Using genres from config: ${artistGenres.join(', ')}`)
  } else if (artistGenres.length > 0) {
    // Use genres from Spotify API
    console.log(`   🏷️  Using genres from Spotify: ${artistGenres.join(', ')}`)
  } else {
    // Use AI to generate genres
    console.log(`   🤖 No genres from config or Spotify, asking Gemini AI...`)
    artistGenres = await generateArtistGenresWithAI(spotifyData.name, spotifyData.name)
    console.log(`   🏷️  AI generated artist genres: ${artistGenres.join(', ')}`)
  }

  // Generate individual genres for each track using AI
  console.log(`   🎵 Generating genres for ${topTracksData.tracks.length} tracks...`)
  const trackGenresPromises = topTracksData.tracks.map((track) =>
    generateSongGenresWithAI(track.name, spotifyData.name, track.album.name),
  )
  const trackGenresResults = await Promise.all(trackGenresPromises)

  // Transform tracks into musicLinks format
  const musicLinks = topTracksData.tracks.map((track, index) => ({
    title: track.name,
    url: track.external_urls.spotify,
    embedUrl: `https://open.spotify.com/embed/track/${track.id}`, // ✅ Add Spotify embed URL
    platform: 'spotify',
    type: 'single', // ✅ Mark as single for the SINGLES tab in artist profile
    trackId: track.id,
    spotifyId: track.id, // ✅ Also set spotifyId for compatibility
    genres: trackGenresResults[index], // ✅ Use AI-generated genres specific to this song
    albumName: track.album.name,
    albumImage:
      track.album.images && track.album.images.length > 0 ? track.album.images[0].url : '',
    releaseDate: track.album.release_date,
    previewUrl: track.preview_url, // 30-second preview if available
    durationMs: track.duration_ms,
    popularity: track.popularity,
    likeCount: 0,
    playCount: 0,
    commentCount: 0,
    comments: [],
    likes: 0, // ✅ Add likes field for recommendation engine
    addedAt: Timestamp.now(), // ✅ Use Firestore Timestamp instead of Date
  }))

  // Transform albums data
  const albums = albumsData.items.map((album) => ({
    name: album.name,
    type: album.album_type, // 'album' or 'single'
    releaseDate: album.release_date,
    totalTracks: album.total_tracks,
    spotifyUrl: album.external_urls.spotify,
    albumId: album.id,
    image: album.images && album.images.length > 0 ? album.images[0].url : '',
  }))

  // Create a better bio
  let bio = ''
  if (artistName.toLowerCase().includes('charlie lim')) {
    bio =
      "Charlie Lim is a Singapore singer-songwriter known for his unique blend of soul, R&B, and jazz. With his smooth vocals and intricate guitar work, he's become one of Singapore's most respected musicians."
  } else if (artistName.toLowerCase().includes('gentle bones')) {
    bio =
      "Gentle Bones is a Singaporean singer-songwriter who rose to fame with his indie-pop sound. Known for hits like 'Until We Die' and 'Settle Down', he's one of the most successful homegrown artists in Singapore."
  } else if (artistName.toLowerCase().includes('sam willows')) {
    bio =
      'The Sam Willows is a four-piece Singaporean indie-pop band known for their energetic performances and catchy melodies. Their music has topped local charts and gained international recognition.'
  } else {
    // Generic bio for other artists
    const genresText = spotifyData.genres.length > 0 ? spotifyData.genres.join(', ') : 'music'
    bio = `${spotifyData.name} is a ${genresText} artist from Singapore with ${spotifyData.followers?.total?.toLocaleString() || 0} followers on Spotify. Known for their unique sound and engaging performances.`
  }

  // Prepare the artist document matching your app's schema
  const artistDoc = {
    userId: artistId,
    artistName: spotifyData.name || artistName,
    bio: bio, // ✅ Enhanced bio
    genres: artistGenres, // ✅ Use genres with fallback
    location: 'Singapore', // Default to Singapore, can be manually updated
    profileImage: profileImage,
    socialLinks: {
      spotify: spotifyData.external_urls?.spotify || '',
      youtube: '',
      instagram: '',
    },
    musicLinks: musicLinks, // Now includes actual tracks!
    albums: albums, // Album information
    followerCount: spotifyData.followers?.total || 0,
    popularity: spotifyData.popularity || 0, // Spotify popularity score (0-100)
    verified: false,
    createdAt: Timestamp.now(), // ✅ Use Firestore Timestamp
    // Store the original Spotify data for reference
    spotifyData: spotifyData,
  }

  const ref = doc(db, 'artists', artistId)
  await setDoc(ref, artistDoc)
  console.log(`✅ Saved artist "${artistDoc.artistName}" with ID ${artistId} to Firestore.`)
  console.log(
    `   📊 Followers: ${artistDoc.followerCount.toLocaleString()} | Popularity: ${artistDoc.popularity}/100`,
  )
  console.log(`   🎵 Tracks: ${musicLinks.length} | Albums: ${albums.length}`)
}

/**
 * Process all artists from the query list
 */
async function fetchAndSaveArtists(artists) {
  console.log(`\n🚀 Starting to process ${artists.length} artist(s)...\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < artists.length; i++) {
    const artistQuery = artists[i]
    const artistName = artistQuery.name || artistQuery.artist_name

    try {
      console.log(`\n[${i + 1}/${artists.length}] Processing: "${artistName}"`)

      // Search for artist on Spotify
      const searchResult = await searchSpotifyArtist(artistName)
      console.log(`   ✅ Found on Spotify: ${searchResult.name} (ID: ${searchResult.id})`)

      // Get detailed artist info
      const artistInfo = await getSpotifyArtistById(searchResult.id)

      // Save to Firestore
      await saveArtistToFirestore(artistInfo, artistQuery)
      successCount++

      // Small delay to be respectful to the API (not required by Spotify but good practice)
      if (i < artists.length - 1) {
        await new Promise((r) => setTimeout(r, 500))
      }
    } catch (e) {
      failCount++
      console.error(`\n❌ Failed for "${artistName}":`)
      console.error(`   ${e.message}\n`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 SUMMARY:')
  console.log(`   ✅ Success: ${successCount} artists`)
  console.log(`   ❌ Failed: ${failCount} artists`)
  console.log(`   📝 Total: ${artists.length} artists`)
  console.log('='.repeat(50) + '\n')
}

async function main() {
  console.log('\n' + '='.repeat(50))
  console.log('🎵 WAVELENGTH ARTIST IMPORT TOOL (SPOTIFY)')
  console.log('='.repeat(50))

  try {
    const queryList = await loadQueryList()

    if (!queryList || queryList.length === 0) {
      console.error('\n❌ Error: No artists found in query-spotify.json')
      console.log('   Please add artist names to query-spotify.json\n')
      console.log('   Example format:')
      console.log('   [')
      console.log('     {"name": "Charlie Lim"},')
      console.log('     {"name": "Gentle Bones"},')
      console.log('     {"name": "The Sam Willows"}')
      console.log('   ]')
      return
    }

    console.log(`\n📋 Found ${queryList.length} artist(s) in query-spotify.json`)

    await fetchAndSaveArtists(queryList)

    console.log('✅ Script completed successfully.\n')
  } catch (err) {
    console.error('\n❌ Fatal Error:', err.message)
    console.error('\nStack trace:')
    console.error(err.stack)
    console.log('\n')
    process.exit(1)
  }
}

main()
