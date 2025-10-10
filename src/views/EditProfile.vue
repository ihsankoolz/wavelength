<template>
  <div class="edit-profile">
    <h2>Edit Profile</h2>

    <form @submit.prevent="updateProfile">
        <!-- Profile Image Button -->
        <div class="profile-image-container">
            <img
            :src="previewImage || form.profileImage || defaultPfp"
            alt="Profile Picture"
            class="profile-img"
            @click="selectImage"
            />
            <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="onFileSelected"
            style="display: none;"
            />
        </div>

        <div>
            <label>Display Name</label>
            <input v-model="form.displayName" type="text" />
        </div>

        <div>
            <label>Email</label>
            <input v-model="form.email" type="email" />
        </div>
        <div>
            <p>Last Active: {{ formatLastActive(form.lastActive) }}</p>
        </div>

        <button type="submit">Save Changes</button>
    </form>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import defaultPfp from "@/assets/defaultPfp.jpg";

export default {
  name: "EditProfile",
  data() {
    return {
      form: {
        displayName: "",
        email: "",
        profileImage: "",
        lastActive: "",
      },
      userId: null,
      previewImage: null,
      defaultPfp,
    };
  },
  async mounted() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.$router.push("/login");
      return;
    }

    // Use the route param if available, otherwise the logged-in user
    this.userId = this.$route.params.id || user.uid;

    // Load the current user data from Firestore
    const docRef = doc(db, "users", this.userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.form = { ...docSnap.data() };
    } else {
      console.warn("No such user!");
    }
  },
  methods: {
    selectImage() {
        this.$refs.fileInput.click();
    },
    onFileSelected(event) {
        const file = event.target.files[0]
        if (!file) return

        // show local preview
        this.previewImage = URL.createObjectURL(file)

        // upload to db (TBC)
        // this.selectedFile = file
    },
    async updateProfile() {
      try {
        let profileImageUrl = this.form.profileImage

        // upload to db (TBC)
        // if (this.selectedFile) { ... }

        const docRef = doc(db, "users", this.userId);
        await updateDoc(docRef, {
          displayName: this.form.displayName,
          profileImage: profileImageUrl,
        });

        alert("Profile updated successfully!");
        this.$router.push(`/profile/${this.userId}`);

      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      }
    },
    formatLastActive(timestamp) {
      if (!timestamp) return "Unavailable";
      return timestamp.toDate().toLocaleString("en-SG", { timeZone: "Asia/Singapore" });
    },
  },
};
</script>

<style>
.edit-profile {
  max-width: 400px;
  margin: 50px auto;
  text-align: left;
}

.edit-profile form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: #667eea;
  color: white;
  cursor: pointer;
}
</style>