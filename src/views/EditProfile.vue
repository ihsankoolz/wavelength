<!-- editprofile.vue - IMPROVED VERSION -->
<template>
  <div class="edit-profile-wrapper">
    <!-- Navigation Bar (MISSING!) -->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container">
        <router-link to="/home" class="navbar-brand">
          <img src="/assets/logo1.png" alt="Wavelength" class="navbar-logo">
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            
            <div class="card shadow">
              <div class="card-body p-4">
                <h2 class="text-center mb-4">Edit Profile</h2>

                <form @submit.prevent="updateProfile">
                  <!-- Profile Image -->
                  <div class="profile-image-container text-center mb-4">
                    <div class="position-relative d-inline-block">
                      <img
                        :src="previewImage || form.profileImage || defaultPfp"
                        alt="Profile Picture"
                        class="profile-img"
                        @click="selectImage"
                      />
                      <button 
                        type="button" 
                        class="btn btn-primary btn-sm camera-btn"
                        @click="selectImage"
                      >
                        <i class="bi bi-camera"></i>
                      </button>
                    </div>
                    <input
                      type="file"
                      ref="fileInput"
                      accept="image/*"
                      @change="onFileSelected"
                      style="display: none;"
                    />
                    <p class="text-muted small mt-2">Click to change photo</p>
                  </div>

                  <!-- Display Name -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Display Name</label>
                    <input 
                      v-model="form.displayName" 
                      type="text" 
                      class="form-control"
                      required
                    />
                  </div>

                  <!-- Email (read-only) -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Email</label>
                    <input 
                      v-model="form.email" 
                      type="email" 
                      class="form-control"
                      disabled
                    />
                    <small class="text-muted">Email cannot be changed</small>
                  </div>

                  <!-- Last Active (read-only) -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">Last Active</label>
                    <p class="text-muted">{{ formatLastActive(form.lastActive) }}</p>
                  </div>

                  <!-- Action Buttons -->
                  <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary py-2">
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="$router.push(`/profile/${userId}`)"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
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

    this.userId = this.$route.params.id || user.uid;

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
      const file = event.target.files[0];
      if (!file) return;
      this.previewImage = URL.createObjectURL(file);
      // TODO: Upload to Firebase Storage
    },
    async updateProfile() {
      try {
        const docRef = doc(db, "users", this.userId);
        await updateDoc(docRef, {
          displayName: this.form.displayName,
          profileImage: this.previewImage || this.form.profileImage,
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

<style scoped>
.edit-profile-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-logo {
  height: 80px;
  width: auto;
}

.content-wrapper {
  margin-top: 120px;
  padding-bottom: 40px;
}

.card {
  border: none;
  border-radius: 12px;
}

.profile-image-container {
  cursor: pointer;
}

.profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
  transition: opacity 0.3s;
}

.profile-img:hover {
  opacity: 0.8;
}

.camera-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #667eea;
  border-color: #667eea;
}

.btn-primary:hover {
  background-color: #5568d3;
  border-color: #5568d3;
}
</style>