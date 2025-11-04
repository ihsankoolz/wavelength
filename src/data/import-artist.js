import fetch from 'node-fetch'; // npm i node-fetch@2
import fs from 'fs/promises';
// import { initializeApp } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
// import queryList from './query.json' assert { type: 'json' };
import { db } from '../services/firebase.js';  // Adjust path as necessary


const API_KEY = '20b69f02d3mshff68b75c96225cap1800d8jsnee2f841b64a6';
const RAPIDAPI_HOST = 'songstats.p.rapidapi.com';

async function loadQueryList() {
  const data = await fs.readFile('./query.json', 'utf8');
  return JSON.parse(data);
}

async function getArtistInfoById(artistId) {
  const url = `https://${RAPIDAPI_HOST}/artist/info?songstats_artist_id=${artistId}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': API_KEY,
    },
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error fetching artist info: ${response.status}`);
  }
  return await response.json();
}

async function saveArtistToFirestore(artist) {
  if (!artist) return;
  const ref = doc(db, 'artists', artist.songstats_artist_id);
  await setDoc(ref, artist);
  console.log(`Saved artist ${artist.name} with ID ${artist.songstats_artist_id} to Firestore.`);
}

async function fetchAndSaveArtists(artists) {
  for (const artist of artists) {
    try {
      const artistInfo = await getArtistInfoById(artist.songstats_artist_id);
      await saveArtistToFirestore(artistInfo);
      // Delay to respect API rate limits
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`Failed for artist ID ${artist.songstats_artist_id}`, e);
    }
  }
  console.log('All artists processed');
}

async function main() {
  try {
    const queryList = await loadQueryList();
    await fetchAndSaveArtists(queryList);
    console.log('All artists processed successfully.');
  } catch (err) {
    console.error('Error in main:', err);
  }
}

main();