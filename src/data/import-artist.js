import fetch from 'node-fetch'; // npm i node-fetch@2
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import queryList from './query.json' assert { type: 'json' };

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config object
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const API_KEY = '20b69f02d3mshff68b75c96225cap1800d8jsnee2f841b64a6';
const RAPIDAPI_HOST = 'songstats.p.rapidapi.com';

async function getSongstatsIdAndAvatarForArtist(name) {
  const url = `https://${RAPIDAPI_HOST}/artist/search?name=${encodeURIComponent(name)}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': API_KEY,
    },
  };
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const json = await res.json();
  if (json.results && json.results.length) {
    return json.results[0];
  }
  return null;
}

async function saveArtistToFirestore(artist) {
  if (!artist) return;
  const ref = doc(db, 'artists', artist.songstats_artist_id);
  await setDoc(ref, artist);
  console.log(`Saved artist ${artist.name} with ID ${artist.songstats_artist_id} to Firestore.`);
}

async function main() {
  for (const entry of queryList) {
    try {
      const name = entry.artistLabel;
      const artist = await getSongstatsIdAndAvatarForArtist(name);
      if (artist) {
        await saveArtistToFirestore(artist);
      } else {
        console.log(`No results for ${name}`);
      }
      // Delay between requests to avoid rate limits, adjust as needed
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error('Error processing artist:', entry.artistLabel, err);
    }
  }
  console.log('All artists processed');
}

main();
