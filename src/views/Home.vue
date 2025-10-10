<template>
    <div class="container mt-5">

        <!-- Navigation Bar -->
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="/assets/logo1.png" alt="Wavelength" class="navbar-logo">
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="ms-auto d-flex gap-2">
                    <button @click="goToProfile" class="btn btn-outline-light">Profile</button>
                </div>
            </div>
        </div>
        </nav>

        <div class="welcome-message">
            <h1>Welcome to Wavelength!</h1>
            <p>You are logged in as: {{ userEmail }}</p>
            <button @click="logout" class="btn btn-danger">Logout</button>
        </div>
    </div>
</template>

<script>
import { signOut, getAuth } from 'firebase/auth'
import { auth } from '@/services/firebase'

export default {
    name: 'Home',
    data() {
        return {
        userEmail: '',
        }
    },
    mounted() {
        // Get current user email
        if (auth.currentUser) {
        this.userEmail = auth.currentUser.email
        }
    },
    methods: {
        async logout() {
        try {
            await signOut(auth)
            this.$router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
        },

        goToProfile() {
            const user = getAuth().currentUser;

            if (user) {
                // Route to logged-in user's profile
                this.$router.push(`/profile/${user.uid}`)
            } else {
                console.log("User not logged in!");
            }
        }
    }
}
</script>

<style>

/* Nav Bar */
.navbar {
    background: rgba(102, 126, 234, 0.95) !important;
    backdrop-filter: blur(10px);
    padding: 1rem 0;
}

.navbar-brand {
    color: white !important;
    font-size: 1.5rem;
    font-weight: bold;
}

.navbar .btn-outline-light {
    border: 2px solid white;
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-weight: 500;
}

.navbar .btn-outline-light:hover {
    background: white;
    color: #667eea;
}

.navbar-logo {
  height: 80px;
  width: auto;
}

/* welcome message */
.welcome-message {
    margin: 150px;
}

</style>