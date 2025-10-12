import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export const authService = {
  // Register new user
    async register(email, password, displayName, userType) {
        try {
        // 1. Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // 2. Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: email,
            userType: userType, // 'artist' or 'fan'
            displayName: displayName,
            profileImage: '',
            preferences: {
            genres: [],
            location: 'Singapore'
            },
            createdAt: new Date(),
            lastActive: new Date()
        })

      // 3. If artist, create artist profile
    if (userType === 'artist') {
      await setDoc(doc(db, 'artists', user.uid), {
        userId: user.uid,
        artistName: displayName,
        bio: '',
        genres: [],
        location: 'Singapore',
        socialLinks: {
          spotify: '',
          youtube: '',
          instagram: ''
        },
        musicLinks: [],
        followerCount: 0,
        verified: false,
        profileSetupCompleted: false, // Add this flag
        createdAt: new Date()
      })
    }

    return { success: true, user, userType } // Return userType for redirect logic
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: error.message }
  }
},

  // Login user
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)

        // Update last active
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                lastActive: new Date()
        }, { merge: true })

            return { success: true, user: userCredential.user }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: error.message }
        }
    },

  // Logout user
    async logout() {
        try {
        await signOut(auth)
        return { success: true }
        } catch (error) {
        console.error('Logout error:', error)
        return { success: false, error: error.message }
        }
    },

  // Get current user data
    async getCurrentUserData() {
        const user = auth.currentUser
        if (!user) return null

        const userDoc = await getDoc(doc(db, 'users', user.uid))
        return userDoc.exists() ? { id: user.uid, ...userDoc.data() } : null
    },

  // Listen to auth state changes
    onAuthChange(callback) {
        return onAuthStateChanged(auth, callback)
    }
}