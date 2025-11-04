import fetch from 'node-fetch' // npm i node-fetch@2
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCd2aYSy8iIkQ5glOxzD2s5w6wvgJ7CKpo',
  authDomain: 'wavelength-f8f6d.firebaseapp.com',
  projectId: 'wavelength-f8f6d',
  storageBucket: 'wavelength-f8f6d.firebasestorage.app',
  messagingSenderId: '735240552106',
  appId: '1:735240552106:web:1c42df98e732e2b64821f8',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const API_KEY = '20b69f02d3mshff68b75c96225cap1800d8jsnee2f841b64a6'
const RAPIDAPI_HOST = 'songstats.p.rapidapi.com'

async function loadQueryList() {
  // Use path.join with __dirname to get the correct file path
  const filePath = path.join(__dirname, 'query.json')
  console.log('Reading query.json from:', filePath)
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

async function getArtistInfoById(artistId) {
  const url = `https://${RAPIDAPI_HOST}/artist/info?songstats_artist_id=${artistId}`
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': API_KEY,
    },
  }

  console.log(`Fetching artist info for ID: ${artistId}`)
  const response = await fetch(url, options)

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`API Error Response: ${errorText}`)
    throw new Error(`Error fetching artist info: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  console.log(`Successfully fetched data for artist:`, data.name || artistId)
  return data
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

  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i]
    try {
      console.log(
        `\n[${i + 1}/${artists.length}] Processing artist ID: ${artist.songstats_artist_id}`,
      )
      const artistInfo = await getArtistInfoById(artist.songstats_artist_id)
      await saveArtistToFirestore(artistInfo)

      // Delay to respect API rate limits
      if (i < artists.length - 1) {
        console.log('⏳ Waiting 2 seconds before next request...')
        await new Promise((r) => setTimeout(r, 2000))
      }
    } catch (e) {
      console.error(`❌ Failed for artist ID ${artist.songstats_artist_id}:`, e.message)
      // Continue with next artist even if one fails
    }
  }
  console.log('\n✅ All artists processed')
}

async function main() {
  try {
    const queryList = await loadQueryList()
    await fetchAndSaveArtists(queryList)
    console.log('All artists processed successfully.')
  } catch (err) {
    console.error('Error in main:', err)
  }
}

main()
