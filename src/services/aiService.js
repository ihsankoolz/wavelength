// aiService.js - Gemini AI Integration for Wavelength Music Discovery
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from './firebase'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'

// Initialize Gemini AI
const apiKey = import.meta.env.VITE_GEMINI_API_KEY

// Debug: Check if API key is loaded
if (!apiKey) {
  console.error('❌ VITE_GEMINI_API_KEY is not defined in .env file!')
} else {
  console.log('✅ Gemini API Key loaded:', apiKey.substring(0, 10) + '...')
}

const genAI = new GoogleGenerativeAI(apiKey)

console.log('🤖 Pulse AI initialized with model: gemini-2.5-flash')

/**
 * Get compact context for AI (minimizes token usage)
 */
export async function getCompactContext(userId) {
  try {
    const context = {
      artists: [],
      songs: [], //  NEW: Add songs
      events: [],
      userFollowing: [],
      userGenres: [],
    }

    // Fetch top 50 artists (names + primary genre only for token efficiency)
    const artistsSnapshot = await getDocs(query(collection(db, 'artists'), limit(50)))

    //  NEW: Collect songs while fetching artists
    const allSongs = []

    context.artists = artistsSnapshot.docs.map((doc) => {
      const data = doc.data()
      const artistId = doc.id

      //  NEW: Extract songs from each artist
      const musicLinks = data.musicLinks || []
      musicLinks.forEach((song) => {
        allSongs.push({
          id: song.id,
          title: song.title,
          artistId: artistId,
          artistName: data.artistName,
          genre: song.genre || data.genres?.[0] || 'Music',
        })
      })

      return {
        id: doc.id,
        name: data.artistName,
        genre: data.genres?.[0] || 'Music',
      }
    })

    //  NEW: Limit to top 30 songs (sorted by likes or plays)
    context.songs = allSongs.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 30)

    // Fetch upcoming events (limited to 15)
    const now = new Date()
    const eventsSnapshot = await getDocs(query(collection(db, 'events'), limit(15)))
    context.events = eventsSnapshot.docs
      .map((doc) => {
        const data = doc.data()
        const eventDate = data.date?.toDate ? data.date.toDate() : new Date(data.date)
        return {
          id: doc.id,
          title: data.title,
          date: eventDate,
          venue: data.venue,
          artistId: data.artistId,
        }
      })
      .filter((event) => event.date >= now)
      .sort((a, b) => a.date - b.date)

    // Get user preferences if userId provided
    if (userId) {
      const userDoc = await getDocs(
        query(collection(db, 'users'), where('__name__', '==', userId), limit(1)),
      )
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data()
        context.userFollowing = userData.followingArtists || []
        context.userGenres = userData.preferredGenres || []
      }
    }

    return context
  } catch (error) {
    console.error('Error getting context:', error)
    return { artists: [], events: [], userFollowing: [], userGenres: [] }
  }
}

/**
 * Build system prompt with platform context
 */
function buildSystemPrompt(context) {
  // Create compact artist list (token-efficient)
  const artistList = context.artists
    .map((a) => `${a.name} (${a.genre})`)
    .join(', ')
    .substring(0, 500) // Limit to 500 chars max

  //  NEW: Create song list (title - artist)
  const songList = context.songs
    .map((s) => `${s.title} by ${s.artistName}`)
    .join(', ')
    .substring(0, 600) // Limit to 600 chars

  // Create event list
  const eventList = context.events
    .map((e) => `${e.title} at ${e.venue} on ${e.date.toLocaleDateString()}`)
    .join(', ')
    .substring(0, 400)

  // User context
  const userContext =
    context.userFollowing.length > 0 || context.userGenres.length > 0
      ? `\n\nUser Preferences:
- Following artists: ${context.userFollowing.length > 0 ? 'Yes' : 'None yet'}
- Preferred genres: ${context.userGenres.join(', ') || 'Not specified'}`
      : ''

  return `You are Wavelength's AI music discovery assistant for Singapore's local music scene.

Your role:
1. Recommend artists AND songs from our platform based on user preferences
2. Suggest events matching user interests
3. Help users discover new music and navigate the platform
4. Answer questions about how to use Wavelength features

Platform Data:
- Available artists: ${artistList || 'Loading...'}
- Available songs: ${songList || 'Loading...'}
- Upcoming events: ${eventList || 'No events currently'}${userContext}

Guidelines:
- ONLY recommend artists/songs/events that exist in the platform data above
- Keep responses under 120 words (concise and friendly)
- When recommending artists, use: "Check out [Artist Name](artist:artistId)"
- When recommending songs, use: "Listen to [Song Title](song:artistId_songId)"
- When suggesting events, use: "Attend [Event Title](event:eventId)"
- If asked about features (following, liking, etc.), explain clearly
- Be conversational and enthusiastic about music
- If you don't have enough data, suggest they explore the platform

IMPORTANT: Always include clickable links in your recommendations using the format above!`
}

/**
 * Send message to Gemini AI
 */
export async function sendChatMessage(userMessage, userId = null) {
  try {
    // Check API key first
    if (!apiKey) {
      throw new Error(
        'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.',
      )
    }

    // Get platform context
    const context = await getCompactContext(userId)

    // Use gemini-2.5-flash (confirmed available in your API key)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    })

    // Build system instruction into the first message
    const systemPrompt = buildSystemPrompt(context)
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`

    // Generate response
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    // Parse for artist/event links
    const actions = parseActions(text, context)

    return {
      success: true,
      message: text,
      actions, // Clickable recommendations
    }
  } catch (error) {
    console.error('AI Error Details:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)

    // Handle specific errors
    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      return {
        success: false,
        error: 'API key issue. Please restart the dev server after adding the API key to .env',
      }
    }

    if (error.message?.includes('quota') || error.message?.includes('RATE_LIMIT')) {
      return {
        success: false,
        error: "AI is taking a break. We've hit our daily limit. Try again later!",
      }
    }

    if (error.message?.includes('INVALID_ARGUMENT')) {
      return {
        success: false,
        error: 'Invalid request. The API key might be incorrect.',
      }
    }

    return {
      success: false,
      error: `Oops! AI error: ${error.message || 'Please try again.'}`,
    }
  }
}

/**
 * Parse AI response for clickable actions
 * Format: [Artist Name](artist:artistId), [Song Title](song:artistId_songId), or [Event Title](event:eventId)
 */
function parseActions(text, context) {
  const actions = []

  // Regex to find markdown-style links with our custom format
  const linkRegex = /\[([^\]]+)\]\((artist|song|event):([^\)]+)\)/g
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    const [, name, type, id] = match

    // Verify the ID exists in our context
    if (type === 'artist') {
      const artist = context.artists.find((a) => a.id === id || a.name === name)
      if (artist) {
        actions.push({
          type: 'artist',
          id: artist.id,
          name: artist.name,
        })
      }
    } else if (type === 'song') {
      //  NEW: Handle song recommendations
      // Format: artistId_songId
      const song = context.songs.find((s) => {
        const songKey = `${s.artistId}_${s.id}`
        return songKey === id || s.title === name
      })
      if (song) {
        actions.push({
          type: 'song',
          id: song.id,
          artistId: song.artistId,
          name: song.title,
          artistName: song.artistName,
        })
      }
    } else if (type === 'event') {
      const event = context.events.find((e) => e.id === id || e.title === name)
      if (event) {
        actions.push({
          type: 'event',
          id: event.id,
          name: event.title,
        })
      }
    }
  }

  // Fallback: Try to match artist names mentioned in text
  if (actions.length === 0) {
    context.artists.forEach((artist) => {
      if (text.includes(artist.name)) {
        actions.push({
          type: 'artist',
          id: artist.id,
          name: artist.name,
        })
      }
    })
  }

  return actions
}

/**
 * Get suggested starter questions
 */
export function getStarterQuestions() {
  return [
    'Recommend some songs for me',
    'What events are happening this week?',
    'Show me trending local artists',
    'Suggest songs based on my taste',
    'How do I save my favorite songs?',
  ]
}
