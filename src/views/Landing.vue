<!-- landing.vue -->
<template>
    <div class="landing-page">
        
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
                <router-link to="/login" class="btn btn-outline-light">Sign In</router-link>
                <router-link to="/register" class="btn btn-light">Get Started</router-link>
            </div>
            </div>
        </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-section">
        <div class="container">
            <div class="row justify-content-center">
            <div class="col-12 col-lg-10">
                
                <!-- Hero Content -->
                <div class="hero-content text-center">
                <h1 class="hero-title">
                    Discover Singapore's Local Music Scene
                </h1>
                
                <p class="hero-subtitle">
                    Connect with talented local artists, discover upcoming events, and support Singapore's vibrant music community.
                </p>
                
                <!-- Hero Buttons -->
                <div class="hero-buttons">
                    <router-link to="/register" class="btn btn-light btn-lg">Get Started for Free</router-link>
                    <a href="#features" class="btn btn-outline-light btn-lg">Learn More</a>
                </div>
                
                <!-- Stats -->
                <div class="hero-stats">
                    <div class="row text-center g-4">
                    <div class="col-12 col-sm-4">
                        <h3 class="stat-number">500+</h3>
                        <p class="stat-label">Local Artists</p>
                    </div>
                    <div class="col-12 col-sm-4">
                        <h3 class="stat-number">1000+</h3>
                        <p class="stat-label">Music Fans</p>
                    </div>
                    <div class="col-12 col-sm-4">
                        <h3 class="stat-number">50+</h3>
                        <p class="stat-label">Events/Month</p>
                    </div>
                    </div>
                </div>
                
                </div>
                
            </div>
            </div>
        </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="features-section py-5 bg-white">
        <div class="container py-5">
            <div class="row justify-content-center mb-5">
            <div class="col-12 col-lg-8 text-center">
                <h2 class="display-5 fw-bold mb-3">Why Wavelength?</h2>
                <p class="lead text-muted">Everything you need to discover and support local music</p>
            </div>
            </div>

            <div class="row g-4">
            <div class="col-12 col-md-4">
                <div class="feature-card text-center p-4">
                <div class="feature-icon mb-3 mx-auto">
                    <i class="bi bi-search fs-1 text-primary"></i>
                </div>
                <h4 class="mb-3">Discover Artists</h4>
                <p class="text-muted">
                    Find local artists based on your music taste. From indie to jazz, discover hidden gems in Singapore's music scene.
                </p>
                </div>
            </div>

            <div class="col-12 col-md-4">
                <div class="feature-card text-center p-4">
                <div class="feature-icon mb-3 mx-auto">
                    <i class="bi bi-calendar-event fs-1 text-primary"></i>
                </div>
                <h4 class="mb-3">Find Events</h4>
                <p class="text-muted">
                    Never miss a show. Browse upcoming gigs, concerts, and performances happening around Singapore.
                </p>
                </div>
            </div>

            <div class="col-12 col-md-4">
                <div class="feature-card text-center p-4">
                <div class="feature-icon mb-3 mx-auto">
                    <i class="bi bi-heart fs-1 text-primary"></i>
                </div>
                <h4 class="mb-3">Support Local</h4>
                <p class="text-muted">
                    Follow your favorite artists, share their music, and help grow Singapore's local music community.
                </p>
                </div>
            </div>
            </div>
        </div>
        </section>

        <!-- For Artists Section -->
        <section class="for-artists-section py-5 bg-light">
        <div class="container py-5">
            <div class="row justify-content-center">
            <div class="col-12 col-lg-8">
                <div class="text-center text-lg-start">
                <h2 class="display-5 fw-bold mb-4">Are You an Artist?</h2>
                <p class="lead mb-4">
                    Wavelength helps you reach more fans and grow your audience. Create your profile, share your music, and promote your events.
                </p>
                <ul class="list-unstyled mb-4">
                    <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                    Free artist profile with bio and links
                    </li>
                    <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                    Embed your music from Spotify & YouTube
                    </li>
                    <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                    Post and promote your events
                    </li>
                    <li class="mb-2">
                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                    Connect with fans who love your genre
                    </li>
                </ul>
                <router-link to="/register" class="btn btn-primary btn-lg">
                    Create Artist Profile
                </router-link>
                </div>
            </div>
            </div>
        </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section py-5 text-white">
        <div class="container py-5">
            <div class="row justify-content-center">
            <div class="col-12 col-lg-8 text-center">
                <h2 class="display-5 fw-bold mb-4">Ready to Discover Local Music?</h2>
                <p class="lead mb-4">Join thousands of music lovers supporting Singapore's local artists</p>
                <router-link to="/register" class="btn btn-light btn-lg px-5">
                Get Started Free
                </router-link>
            </div>
            </div>
        </div>
        </section>

        <!-- Footer -->
        <footer class="footer py-4 bg-dark text-white">
        <div class="container">
            <div class="row">
            <div class="col-12 text-center">
                <p class="mb-0">&copy; 2025 Wavelength. Discover Singapore's Local Music.</p>
            </div>
            </div>
        </div>
        </footer>

    </div>
</template>

<script>
export default {
    name: 'Landing'
}
</script>

<style scoped>
/* Landing page wrapper */
.landing-page {
    width: 100%;
}

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

.navbar .btn-light {
    background: white;
    color: #667eea;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-weight: 600;
    border: none;
}
.navbar-logo {
  height: 80px;
  width: auto;
}

.navbar .btn-light:hover {
    background: #f8f9fa;
}

/* head section */
.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 100px 0 60px 0;
    color: white;
}

.hero-content {
    padding: 40px 0;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    opacity: 0.95;
    line-height: 1.6;
}

/* hero buttons */
.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 4rem;
    flex-wrap: wrap;
}

.hero-buttons .btn-light {
    background: white;
    color: #667eea;
    padding: 0.875rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    text-decoration: none;
}

.hero-buttons .btn-outline-light {
    border: 2px solid white;
    color: white;
    padding: 0.875rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
}

.hero-buttons .btn-outline-light:hover {
    background: white;
    color: #667eea;
}

/* hero stats */
.hero-stats {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding-top: 3rem;
    margin-top: 2rem;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 1rem;
    opacity: 0.85;
    margin: 0;
}

/* feature section */
.feature-card {
    height: 100%;
    transition: transform 0.3s ease;
    border-radius: 12px;
}

.feature-card:hover {
    transform: translateY(-10px);
}

.feature-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 50%;
}

.text-primary {
    color: #667eea !important;
}

/*  cta section  */
.cta-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cta-section .btn-light {
    text-decoration: none;
}

/* footer */
.footer {
    background: #1a1a1a !important;
}

/* buttons */
.btn-primary {
    background-color: #667eea;
    border-color: #667eea;
}

.btn-primary:hover {
    background-color: #5568d3;
    border-color: #5568d3;
}

/* responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .stat-number {
        font-size: 2rem;
    }
    
    .stat-label {
        font-size: 1rem;
    }
}

@media (max-width: 576px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-buttons {
        flex-direction: column;
    }
    
    .hero-buttons .btn {
        width: 100%;
    }
    .stat-label{
        font-size: 1.5rem;
    }
    .stat-number{
        font-size: 2.5rem;
    }
}
</style>