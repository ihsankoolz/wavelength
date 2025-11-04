# Artist Import Script

This script fetches artist information from the SongStats API and saves it to Firestore.

## Setup

1. Make sure you have all dependencies installed:

```bash
npm install
```

2. The script requires:
   - `node-fetch@2` (already in package.json)
   - Firebase packages (already in package.json)

## How to Use

1. **Edit query.json** to include the SongStats artist IDs you want to import:

```json
[
  { "songstats_artist_id": "wqp174n2" },
  { "songstats_artist_id": "woltx0cz" },
  { "songstats_artist_id": "2jlz5cm3" }
]
```

2. **Run the script** from the project root:

```bash
node src/data/import-artist.js
```

## What It Does

1. Reads artist IDs from `query.json`
2. Fetches artist info from SongStats API for each ID
3. Transforms the data to match your Firestore schema
4. Saves each artist to the `artists` collection in Firestore
5. Waits 2 seconds between requests to respect API rate limits

## Firestore Document Structure

Each artist is saved with this structure:

```javascript
{
  userId: "songstats_artist_id",
  artistName: "Artist Name",
  bio: "Artist bio",
  genres: ["genre1", "genre2"],
  location: "Singapore",
  socialLinks: {
    spotify: "url",
    youtube: "url",
    instagram: "url"
  },
  musicLinks: [],
  followerCount: 0,
  verified: false,
  createdAt: Date,
  songstatsData: { /* original API response */ }
}
```

## Troubleshooting

- **File not found error**: Make sure you run the command from the project root directory
- **API errors**: Check your RapidAPI key and quota
- **Firebase errors**: Ensure Firebase config is correct
