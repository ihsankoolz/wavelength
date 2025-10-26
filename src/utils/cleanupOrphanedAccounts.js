/**
 * Admin Utility: Clean Up Orphaned Firebase Auth Accounts
 *
 * This script helps identify and clean up Firebase Authentication accounts
 * that don't have corresponding Firestore user documents.
 *
 * USE CASE:
 * When users manually delete their Firestore data but Firebase Auth account remains,
 * it causes "email already in use" errors.
 *
 * IMPORTANT: This should be run from Firebase Admin SDK (backend/Cloud Functions)
 * NOT from client-side code for security reasons.
 */

// Example Cloud Function implementation:
/*
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.cleanupOrphanedAuthAccounts = functions.https.onCall(async (data, context) => {
  // Verify admin access
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Must be an admin');
  }

  const orphanedAccounts = [];
  
  try {
    // List all Firebase Auth users
    const listUsersResult = await admin.auth().listUsers(1000);
    
    for (const userRecord of listUsersResult.users) {
      // Check if Firestore document exists
      const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();
      
      if (!userDoc.exists) {
        orphanedAccounts.push({
          uid: userRecord.uid,
          email: userRecord.email,
          createdAt: userRecord.metadata.creationTime
        });
      }
    }
    
    return {
      success: true,
      orphanedAccounts: orphanedAccounts,
      count: orphanedAccounts.length
    };
    
  } catch (error) {
    console.error('Error finding orphaned accounts:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.deleteOrphanedAuthAccount = functions.https.onCall(async (data, context) => {
  // Verify admin access
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Must be an admin');
  }

  const { uid } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID is required');
  }

  try {
    // Delete from Firebase Auth
    await admin.auth().deleteUser(uid);
    
    return {
      success: true,
      message: `User ${uid} deleted from Firebase Auth`
    };
    
  } catch (error) {
    console.error('Error deleting auth account:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
*/

// Manual cleanup via Firebase Console:
// 1. Go to: https://console.firebase.google.com/project/wavelength-adde0/authentication/users
// 2. Find the user by email
// 3. Click three dots (⋮) → Delete account
// 4. Confirm deletion

// Manual cleanup via Firebase CLI:
// firebase auth:delete <email> --project wavelength-adde0

module.exports = {
  // Client-side helper to detect orphaned account issue
  async checkIfOrphanedAccount(user, db) {
    try {
      const { doc, getDoc } = await import('firebase/firestore')
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      return !userDoc.exists()
    } catch (error) {
      console.error('Error checking orphaned account:', error)
      return false
    }
  },
}
