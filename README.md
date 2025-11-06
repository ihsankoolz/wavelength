# 🎵 Wavelength - Music Discovery & Events Platform

**Connecting Singapore's Music Community**

---

## 🌐 Live Application

**Hosted URL:** [https://wavelength-adde0.web.app](https://wavelength-adde0.web.app)

**Git Repository:** [https://github.com/ihsankoolz/wavelength](https://github.com/ihsankoolz/wavelength)

---

## 📋 Problem Statement

### The Challenge

In Singapore's vibrant music scene, emerging local artists struggle to gain visibility and connect with their audience, while music fans find it difficult to discover new local talent and stay informed about live events. Traditional music platforms are saturated with mainstream content, making it challenging for independent artists to stand out and for fans to find personalized music recommendations that match their tastes.

### The Solution

**Wavelength** is a comprehensive music discovery and events platform specifically designed to bridge the gap between local artists and music enthusiasts. Our platform provides:

- **Personalized Music Discovery:** Advanced recommendation algorithm that learns from user preferences, listening history, and interactions to suggest relevant local music
- **Live Event Integration:** Centralized hub for discovering and tracking live music events across Singapore with interactive maps and venue details
- **Artist-Fan Connection:** Direct interaction through follows, likes, comments, and notifications to build a thriving music community
- **Artist Empowerment:** Dedicated dashboard for artists to upload music, manage events, and analyze their audience engagement
- **Smart Analytics:** Data-driven insights for artists to understand their reach and optimize their content strategy

---

## ✨ Key Features

### For Music Fans

- 🎵 **Personalized Song Recommendations** - Smart algorithm considering genre preferences, listening history, and trending tracks
- 🎪 **Event Discovery** - Browse upcoming live music events with interactive Google Maps integration
- 🔔 **Real-time Notifications** - Get notified when artists you follow upload new music or create events
- ❤️ **Social Interactions** - Like, comment, and save favorite songs
- 👤 **Profile Customization** - Set music preferences and manage your interests
- 📍 **Location-Based Discovery** - Find events near you with map visualization

### For Artists

- 🎼 **Music Upload & Management** - Support for Spotify, and Youtube integration
- 🎤 **Event Creation** - Create and manage live events with location, tickets, and details
- 📊 **Analytics Dashboard** - Track song performance, follower growth, and engagement metrics
- 🔗 **Social Media Integration** - Connect Instagram, Facebook, and other platforms
- 💬 **Fan Engagement** - Interact with fans through comments and notifications
- 📈 **Performance Insights** - Understand which songs resonate with your audience

### Recommendation Algorithm

Our adaptive recommendation system uses three user profiles:

- **New Users (No Preferences):** Trending songs based on popularity and recency
- **New Users (With Preferences):** 70% genre matching + 20% popularity + 10% recency
- **Active Users:** Personalized mix considering followed artists (30%), genre preferences (25%), listening history (20%), interactions (10%), popularity (10%), and recency (5%)

---

## 🛠️ Technology Stack

- **Frontend Framework:** Vue 3 (Options API)
- **Routing:** Vue Router
- **Styling:** Bootstrap 5 + Custom CSS
- **Build Tool:** Vite
- **Backend Services:** Firebase
  - Firestore Database
  - Firebase Authentication
  - Firebase Storage
  - Firebase Cloud Functions
- **Maps Integration:** Google Maps API
- **Deployment:** Firebase Hosting
- **Version Control:** Git & GitHub

---

## 📦 Setup Instructions

Follow these step-by-step instructions to set up and run Wavelength on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Firebase CLI** - Install globally with: `npm install -g firebase-tools`

### Step 1: Clone the Repository

```bash
git clone https://github.com/ihsankoolz/wavelength.git
cd wavelength
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### Step 3: Firebase Configuration

#### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the setup wizard
3. Enable the following services:
   - **Authentication** (Email/Password provider)
   - **Firestore Database**
   - **Storage**
   - **Hosting**

#### 3.2 Get Firebase Config

1. In Firebase Console, go to Project Settings → General
2. Scroll down to "Your apps" and click the web icon (</>)
3. Register your app and copy the Firebase configuration object

#### 3.3 Create Environment File

Create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### 3.4 Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API** and **Geocoding API**
4. Create API key and add it to `.env` file

### Step 4: Initialize Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase in the project
firebase init
```

When prompted:

- Select: **Firestore**, **Storage**, **Hosting**, **Functions**
- Use existing project (select the one you created)
- Accept default Firestore rules files
- Accept default Storage rules file
- Set public directory to: `dist`
- Configure as single-page app: **Yes**
- Don't overwrite `index.html`
- For Functions: Choose JavaScript, install dependencies

### Step 5: Deploy Firestore Rules and Indexes

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage
```

---

## 🚀 How to Run the Application

### Development Mode (Local)

Run the application locally with hot-reload for development:

```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

**Note:** The port may vary (5174, 5175, etc.) if 5173 is already in use.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

### Preview Production Build Locally

Test the production build locally before deploying:

```bash
npm run preview
```

### Deploy to Firebase Hosting

Deploy the application to Firebase Hosting:

```bash
# Build the project first
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

For full deployment (including functions, rules, and hosting):

```bash
firebase deploy
```

Your application will be live at: `https://your-project-id.web.app`

---

## 📂 Project Structure

```
wavelength/
├── public/                  # Static assets
│   └── assets/             # Images, icons, genre covers
├── src/
│   ├── assets/             # CSS and image assets
│   ├── components/         # Reusable Vue components
│   │   ├── NavigationBar.vue
│   │   ├── EventMap.vue
│   │   ├── SongDetailModal.vue
│   │   └── ...
│   ├── router/             # Vue Router configuration
│   ├── services/           # Firebase and auth services
│   ├── stores/             # State management
│   ├── utils/              # Helper functions
│   │   ├── recommendationEngine.js
│   │   ├── interactionTracking.js
│   │   └── notifications.js
│   ├── views/              # Page components
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── EventDetails.vue
│   │   └── ...
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── functions/              # Firebase Cloud Functions
├── docs/                   # Documentation
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── storage.rules           # Storage security rules
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

---

## � User Guide

### For Fans

1. **Register/Login:** Create an account or sign in
2. **Onboarding:** Select your favorite music genres
3. **Discover Music:** Browse personalized recommendations on the home feed
4. **Interact:** Like, comment, and save songs you enjoy
5. **Follow Artists:** Stay updated with your favorite artists
6. **Find Events:** Browse live events on the Events page
7. **Get Notifications:** Receive updates on new music and events

### For Artists

1. **Register as Artist:** Sign up and complete artist profile setup
2. **Upload Music:** Add songs from Spotify or Youtube
3. **Create Events:** Set up live performances with venue and ticket details
4. **View Analytics:** Track your performance metrics and audience engagement
5. **Engage Fans:** Respond to comments and build your community
6. **Manage Profile:** Update bio, social links, and profile picture

---

## 🔒 Security

- Firebase Authentication for secure user management
- Firestore security rules to protect user data
- Environment variables for sensitive configuration
- CORS configuration for API access control

---

## 🧪 Testing

Run tests (if configured):

```bash
npm run test
```

---

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Recommended Browser Extensions for Development:**

- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) (Chrome)
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/) (Firefox)

---

## 📞 Support & Contact

For issues, questions, or contributions:

- **Repository Issues:** [GitHub Issues](https://github.com/ihsankoolz/wavelength/issues)
- **Email:** Contact the development team

---

## 📄 License

Private - Wavelength Development Team

---

## 🙏 Acknowledgments

- Singapore's local music community
- Firebase platform
- Vue.js framework
- Google Maps API
- All open-source contributors

---

**Last Updated:** November 6, 2025  
**Version:** 2.0  
**Current Branch:** FurtherCleanUp
