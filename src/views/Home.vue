<template>
    <div class="container mt-5">
        <h1>Welcome to Wavelength!</h1>
        <p>You are logged in as: {{ userEmail }}</p>
        <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
</template>

<script>
import { signOut } from 'firebase/auth'
import { auth } from '@/services/firebase'

export default {
    name: 'Home',
    data() {
        return {
        userEmail: ''
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
        }
    }
}
</script>