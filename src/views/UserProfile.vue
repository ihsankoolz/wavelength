<template>
  <!-- Navigation Bar -->
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
  <div class="container">
      <a class="navbar-brand" href="#">
          <router-link to="/home">
            <img src="/assets/logo1.png" alt="Wavelength" class="navbar-logo">
          </router-link>
      </a>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
          <!-- <div class="ms-auto d-flex gap-2">
              <button @click="" class="btn btn-outline-light">Edit</button>
          </div> -->
      </div>
  </div>
  </nav>
        
  <div class="profile">
    <div v-if="userData" class="profile-card">
      <img
        :src="userData.profileImage || defaultPfp"
        alt="Profile Picture"
        class="profile-img"
      />
      <h2>{{ userData.displayName || "Unnamed User" }}</h2>
      <p>Email: {{ userData.email }}</p>
      <p>Last Active: {{ formatLastActive(userData.lastActive) }}</p>
      <div class="ms-auto d-flex gap-2">
        <button @click="goToEditProfile" class="btn btn-light">Edit</button>
        <button @click="deleteAccount" class="btn btn-danger">Delete Account</button>
      </div>
    </div>

    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script>
import { getAuth, deleteUser } from "firebase/auth"
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import defaultPfp from "@/assets/defaultPfp.jpg"

export default {
  name: "UserProfile",
  data() {
    return {
      userData: null,
      defaultPfp: defaultPfp
    };
  },
  async mounted() {
    try {
      const userId = this.$route.params.id;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.userData = docSnap.data();
      } else {
        console.warn("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
  methods: {
    formatLastActive(timestamp) {
      if (!timestamp) return "Unavailable";
      return timestamp.toDate().toLocaleString("en-SG", { timeZone: "Asia/Singapore" });
    },
    goToEditProfile() {
      this.$router.push(`/edit-profile/${this.$route.params.id}`)
    },
    async deleteAccount() {
      const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (!confirmDelete) return;

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const userId = user.uid;

        // Delete user document from Firestore
        await deleteDoc(doc(db, "users", userId));

        // Delete Firebase Auth user
        await deleteUser(user);

        this.$router.push("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please log in again and try.");
      }
    }
  }
};
</script>

<style>
/* Nav Bar */
.navbar {
    background: rgba(102, 126, 234, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem 0;
}

.navbar-brand {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
}

.btn-light {
  background: #667eea;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
}

.btn-light:hover {
  background: #5b73de;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
}

.navbar-logo {
  height: 80px;
  width: auto;
}

/* profile details */
.profile {
  display: flex;
  justify-content: center;
  margin-top: 150px;
}

.profile-card {
  text-align: left;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 800px;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

h2 {
  margin: 10px 0;
}

p {
  margin-top: 10px;
  font-size: 16px;
}
</style>
