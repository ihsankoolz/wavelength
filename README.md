# 🎵 Wavelength - Music Discovery Platform

A modern music platform connecting fans with artists through personalized recommendations, live events, and social interactions.

## 🚀 Quick Start

```sh
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📚 Documentation

### For Team Members

- **[BRANCH_SUMMARY.md](./BRANCH_SUMMARY.md)** - Complete overview of features and changes in this branch
- Additional technical docs available in `/docs` folder (development only, not committed)

## 🛠️ Tech Stack

- **Frontend:** Vue 3 (Options API), Vue Router, Bootstrap 5
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **Build Tool:** Vite
- **Deployment:** Firebase Hosting

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📦 Firebase Setup

```sh
# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy security rules
firebase deploy --only firestore:rules,storage

# Full deployment
firebase deploy
```

## 🎯 Features

- 🎵 Music streaming integration (Spotify, YouTube, SoundCloud)
- 🎪 Event discovery and management
- ❤️ Like, save, and comment on songs
- 👥 Follow artists and get notifications
- 📊 Artist analytics dashboard
- 🤖 Personalized recommendations
- 🔔 Real-time notifications

## 👥 User Types

- **Fans:** Discover music, attend events, follow artists
- **Artists:** Upload music, create events, view analytics

## 📱 Development

### Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Browser Extensions

- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) (Chrome)
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/) (Firefox)

## 📄 License

Private - Wavelength Development Team

---

**Current Branch:** NavigationFollowing  
**Last Updated:** October 26, 2025
