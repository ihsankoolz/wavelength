import fetch from 'node-fetch' // npm i node-fetch@2
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
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

// RapidAPI configuration from environment variables
const API_KEY = process.env.RAPIDAPI_KEY
const RAPIDAPI_HOST = 'songstats.p.rapidapi.com'

if (!process.env.RAPIDAPI_KEY) {
  console.warn('⚠️  Warning: RAPIDAPI_KEY not found in .env, using default key')
}

async function loadQueryList() {
  // Use path.join with __dirname to get the correct file path
  const filePath = path.join(__dirname, 'query.json')
  console.log('Reading query.json from:', filePath)
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

async function getArtistInfoById(artistId) {
  // Try different possible endpoint patterns (most common first)
  const endpoints = [`/artist/${artistId}`, `/v1/artist/${artistId}`, `/api/artist/${artistId}`]

  console.log(`Fetching artist info for ID: ${artistId}`)

  // Try each endpoint until one works
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i]
    const url = `https://${RAPIDAPI_HOST}${endpoint}`
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': API_KEY,
      },
    }

    console.log(`   Trying endpoint: ${endpoint}`)

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        const errorText = await response.text()

        // If 404, wait then try next endpoint
        if (response.status === 404) {
          console.log(`   ❌ Endpoint not found (404)`)

          // Wait 2 seconds before trying next endpoint to avoid rate limit
          if (i < endpoints.length - 1) {
            console.log(`   ⏰ Waiting 2 seconds before trying next endpoint...`)
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }
          continue
        }

        // Handle specific error cases
        if (response.status === 403) {
          throw new Error(
            `API Subscription Error: ${errorText}\n  → Please subscribe to the SongStats API on RapidAPI (free plan available)`,
          )
        } else if (response.status === 429) {
          throw new Error(
            `Rate Limit Exceeded: ${errorText}\n  → Free plan allows 20 requests/day, 1 request/second`,
          )
        } else if (response.status === 401) {
          throw new Error(`Invalid API Key: ${errorText}\n  → Check your RapidAPI key is correct`)
        } else {
          throw new Error(`API Error (${response.status}): ${errorText}`)
        }
      }

      const data = await response.json()
      console.log(`   ✅ Successfully fetched data using endpoint: ${endpoint}`)
      console.log(`   ✅ Artist: ${data.name || artistId}`)
      return data
    } catch (error) {
      // If it's a connection error or 404, try next endpoint
      if (error.message.includes('404') || error.code === 'ENOTFOUND') {
        // Wait 2 seconds before trying next endpoint
        if (i < endpoints.length - 1) {
          console.log(`   ⏰ Waiting 2 seconds before trying next endpoint...`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
        continue
      }
      // For other errors, throw immediately
      throw error
    }
  }

  // If we tried all endpoints and none worked
  throw new Error(
    `All endpoints failed for artist ID: ${artistId}. The SongStats API structure may have changed or you need to subscribe.`,
  )
}

async function saveArtistToFirestore(artistData) {
  if (!artistData) {
    console.log('No artist data to save')
    return
  }

  // Generate a unique ID for Firestore (you can customize this)
  const artistId =
    artistData.songstats_artist_id || artistData.id || Math.random().toString(36).substr(2, 9)

  // Prepare the artist document with the structure your app expects
  const artistDoc = {
    userId: artistId, // Using songstats ID as userId
    artistName: artistData.name || 'Unknown Artist',
    bio: artistData.bio || '',
    genres: artistData.genres || [],
    location: artistData.location || 'Singapore',
    socialLinks: {
      spotify: artistData.spotify_url || '',
      youtube: artistData.youtube_url || '',
      instagram: artistData.instagram_url || '',
    },
    musicLinks: [],
    followerCount: artistData.followers || 0,
    verified: false,
    createdAt: new Date(),
    // Store the original songstats data for reference
    songstatsData: artistData,
  }

  const ref = doc(db, 'artists', artistId)
  await setDoc(ref, artistDoc)
  console.log(`✅ Saved artist "${artistDoc.artistName}" with ID ${artistId} to Firestore.`)
}

async function fetchAndSaveArtists(artists) {
  console.log(`\n🚀 Starting to process ${artists.length} artists...\n`)
  console.log(`⚠️  Rate Limit: 1 request per second (Free plan limit)\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i]
    try {
      console.log(
        `\n[${i + 1}/${artists.length}] Processing artist ID: ${artist.songstats_artist_id}`,
      )

      const artistInfo = await getArtistInfoById(artist.songstats_artist_id)
      await saveArtistToFirestore(artistInfo)
      successCount++

      // IMPORTANT: Wait at least 1 second between requests (Free plan: 1 request/second)
      if (i < artists.length - 1) {
        console.log('⏳ Waiting 1 second before next request (rate limit)...')
        await new Promise((r) => setTimeout(r, 1000)) // Exactly 1 second
      }
    } catch (e) {
      failCount++
      console.error(`\n❌ Failed for artist ID ${artist.songstats_artist_id}:`)
      console.error(`   ${e.message}\n`)

      // If it's a rate limit error, wait longer before continuing
      if (e.message.includes('Rate Limit')) {
        console.log('⏰ Rate limit hit - waiting 5 seconds before continuing...')
        await new Promise((r) => setTimeout(r, 5000))
      }

      // Continue with next artist even if one fails
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
  console.log('🎵 WAVELENGTH ARTIST IMPORT TOOL')
  console.log('='.repeat(50))

  try {
    const queryList = await loadQueryList()

    if (!queryList || queryList.length === 0) {
      console.error('\n❌ Error: No artists found in query.json')
      console.log('   Please add artist IDs to query.json\n')
      return
    }

    console.log(`\n📋 Found ${queryList.length} artist(s) in query.json`)
    console.log(`🔑 Using API Key: ${API_KEY.substring(0, 10)}...${API_KEY.slice(-6)}`)

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
