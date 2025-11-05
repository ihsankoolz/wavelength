<template>
  <div class="landing-page" @mousemove="handleMouseMove">
    <!-- Cursor Spotlight Effect -->
    <div class="cursor-spotlight" :style="spotlightStyle"></div>

    <!-- Header --> 
    <nav
      class="header-nav d-flex flex-column flex-sm-row align-items-center justify-content-between px-3 px-sm-5 py-3"
    >
      <!-- Logo (SVG or Image) -->
      <div class="d-flex align-items-center mb-3 mb-sm-0 ms-0 ms-lg-5">
        <img src="/assets/logo1.png" alt="Wavelength Logo" class="logo-img" />
      </div>
      <div class="d-flex flex-row align-items-center gap-2 gap-sm-3 me-0 me-lg-5">
        <router-link to="/register" class="btn btn-link text-white font-weight-bold sign-up-btn"
          >SIGN UP</router-link
        >
        <router-link to="/login" class="btn btn-outline-danger font-weight-bold log-in-btn"
          >LOG IN</router-link
        >
      </div>
    </nav>

    <div class="wave-svg">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path id="wave1" fill="none" stroke="#B51414" stroke-width="2" opacity="0.6">
          <animate
            attributeName="d"
            values="M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150;
                    M0,150 Q150,250 300,150 T600,150 T900,150 T1200,150;
                    M0,150 Q150,50 300,150 T600,150 T900,150 T1200,150"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave2" fill="none" stroke="#C73535" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180;
                    M0,180 Q150,280 300,180 T600,180 T900,180 T1200,180;
                    M0,180 Q150,80 300,180 T600,180 T900,180 T1200,180"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave3" fill="none" stroke="#D95656" stroke-width="1" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120;
                    M0,120 Q150,220 300,120 T600,120 T900,120 T1200,120;
                    M0,120 Q150,20 300,120 T600,120 T900,120 T1200,120"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave4" fill="none" stroke="#B51414" stroke-width="1.5" opacity="0.5">
          <animate
            attributeName="d"
            values="M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90;
                    M0,90 Q150,210 300,90 T600,90 T900,90 T1200,90;
                    M0,90 Q150,30 300,90 T600,90 T900,90 T1200,90"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave5" fill="none" stroke="#C73535" stroke-width="1" opacity="0.45">
          <animate
            attributeName="d"
            values="M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210;
                    M0,210 Q150,270 300,210 T600,210 T900,210 T1200,210;
                    M0,210 Q150,120 300,210 T600,210 T900,210 T1200,210"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave6" fill="none" stroke="#D95656" stroke-width="1.2" opacity="0.35">
          <animate
            attributeName="d"
            values="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60;
                    M0,60 Q150,240 300,60 T600,60 T900,60 T1200,60;
                    M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave7" fill="none" stroke="#B51414" stroke-width="0.8" opacity="0.3">
          <animate
            attributeName="d"
            values="M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240;
                    M0,240 Q150,290 300,240 T600,240 T900,240 T1200,240;
                    M0,240 Q150,160 300,240 T600,240 T900,240 T1200,240"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
        <path id="wave8" fill="none" stroke="#C73535" stroke-width="1.3" opacity="0.4">
          <animate
            attributeName="d"
            values="M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100;
                    M0,100 Q150,230 300,100 T600,100 T900,100 T1200,100;
                    M0,100 Q150,40 300,100 T600,100 T900,100 T1200,100"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>

    <!-- Landing content -->
    <div class="content-wrapper">
      <div class="container"></div>
      <!-- Hero Section -->
      <section class="hero-section d-flex align-items-center">
        <div class="hero-content px-5 mt-3 mt-md-4 ms-0 ms-md-3 ms-lg-5">
          <!-- Mobile Title (< 768px) -->
          <h1
            class="hero-title mb-2 mb-md-3 magnetic-text d-block d-md-none"
            style="font-size: 3rem"
            ref="heroTitle"
          >
            WHERE LOCAL MUSIC CONNECTS
          </h1>

          <!-- Tablet/Desktop Title (≥ 768px) -->
          <h1
            class="hero-title mb-2 mb-md-3 magnetic-text d-none d-md-block d-lg-none"
            style="font-size: 5rem"
            ref="heroTitle"
          >
            WHERE LOCAL MUSIC CONNECTS
          </h1>

          <!-- Desktop Title (≥ 992px) -->
          <h1
            class="hero-title mb-2 mb-md-3 magnetic-text d-none d-lg-block"
            style="font-size: 6rem"
            ref="heroTitle"
          >
            WHERE LOCAL MUSIC CONNECTS
          </h1>

          <div
            class="hero-actions d-flex flex-column flex-sm-row gap-2 gap-sm-3 fade-in-up"
            style="animation-delay: 0.9s"
          >
            <!-- Mobile Buttons (< 768px) -->
            <router-link
              to="/register"
              class="btn btn-danger get-started-btn w-100 w-sm-auto me-0 me-sm-2 d-block d-md-none"
              style="font-size: 1.1rem; padding: 0.85rem 2rem; border-radius: 2.5rem"
            >
              GET STARTED
            </router-link>

            <!-- Desktop Buttons (≥ 768px) -->
            <router-link
              to="/register"
              class="btn btn-danger get-started-btn w-100 w-sm-auto me-0 me-sm-2 d-none d-md-block"
              style="font-size: 1.4rem; padding: 1rem 2.5rem; border-radius: 3rem"
            >
              GET STARTED
            </router-link>

            <!-- Mobile Learn More (< 768px) -->
            <a
              href="#Feature"
              class="btn btn-outline-light learn-more-btn w-100 w-sm-auto d-block d-md-none"
              style="font-size: 1.1rem; padding: 0.85rem 2rem; border-radius: 2.5rem"
            >
              LEARN MORE
            </a>

            <!-- Desktop Learn More (≥ 768px) -->
            <a
              href="#Feature"
              class="btn btn-outline-light learn-more-btn w-100 w-sm-auto d-none d-md-block"
              style="font-size: 1.4rem; padding: 1rem 2.5rem; border-radius: 3rem"
            >
              LEARN MORE
            </a>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section d-flex flex-column align-items-center py-5">
        <div class="gradient-mesh"></div>

        <!-- Mobile Heading (< 768px) -->
        <div
          class="stats-heading text-white text-center mb-4 mb-md-5 scroll-reveal d-block d-md-none px-3"
          ref="statsHeading"
        >
          <h2 class="font-weight-bold" style="font-size: 1.3rem; line-height: 1.3">
            CONNECT WITH TALENTED LOCAL ARTISTS, DISCOVER UPCOMING EVENTS,<br />
            AND SUPPORT SINGAPORE'S VIBRANT MUSIC COMMUNITY
          </h2>
        </div>

        <!-- Tablet Heading (768px - 991px) -->
        <div
          class="stats-heading text-white text-center mb-4 mb-md-5 scroll-reveal d-none d-md-block d-lg-none"
          ref="statsHeading"
        >
          <h2 class="font-weight-bold" style="font-size: 1.4rem; line-height: 1.3">
            CONNECT WITH TALENTED LOCAL ARTISTS, DISCOVER UPCOMING EVENTS,<br />
            AND SUPPORT SINGAPORE'S VIBRANT MUSIC COMMUNITY
          </h2>
        </div>

        <!-- Desktop Heading (≥ 992px) -->
        <div
          class="stats-heading text-white text-center mb-4 mb-md-5 scroll-reveal d-none d-lg-block"
          ref="statsHeading"
        >
          <h2 class="font-weight-bold" style="font-size: 1.5rem; line-height: 1.3">
            CONNECT WITH TALENTED LOCAL ARTISTS, DISCOVER UPCOMING EVENTS,<br />
            AND SUPPORT SINGAPORE'S VIBRANT MUSIC COMMUNITY
          </h2>
        </div>

        <div class="container">
          <div class="row justify-content-center">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="col-12 col-md-4 col-lg-4 d-flex justify-content-center mb-4 scroll-reveal"
              :ref="'stat-' + stat.label"
            >
              <!-- Mobile Stat Card (< 768px) -->
              <div
                class="stat-card bg-white d-flex flex-column justify-content-center align-items-center d-block d-md-none"
                style="padding: 1.5rem 1rem; font-size: 1rem; min-width: 80vw"
                @mouseenter="hoverStat = stat.label"
                @mouseleave="hoverStat = null"
              >
                <!-- Circular Progress Ring -->
                <div class="stat-ring-container mb-3">
                  <svg class="stat-ring" width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      class="ring-background"
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#f0f0f0"
                      stroke-width="8"
                    />
                    <circle
                      class="ring-progress"
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#gradient)"
                      stroke-width="8"
                      stroke-linecap="round"
                      :style="{
                        strokeDasharray: '314',
                        strokeDashoffset: getStrokeDashoffset(stat),
                      }"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color: #d52222; stop-opacity: 1" />
                        <stop offset="100%" style="stop-color: #bb1814; stop-opacity: 1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <!-- Icon in Center -->
                  <div class="stat-icon">
                    <component :is="'span'" v-html="getStatIcon(stat.label)"></component>
                  </div>
                </div>

                <div class="stat-value text-dark mb-2" style="font-size: 2.5rem; font-weight: 800">
                  {{ stat.animatedValue }}{{ stat.suffix }}
                </div>
                <div class="stat-label text-muted" style="font-size: 0.95rem; font-weight: 600">
                  {{ stat.label.toUpperCase() }}
                </div>
              </div>

              <!-- Tablet Stat Card (768px - 991px) -->
              <div
                class="stat-card bg-white d-none d-md-flex d-lg-none flex-column justify-content-center align-items-center"
                style="padding: 1.2rem 1rem; min-width: 220px; max-width: 260px"
                @mouseenter="hoverStat = stat.label"
                @mouseleave="hoverStat = null"
              >
                <!-- Circular Progress Ring (Smaller) -->
                <div class="stat-ring-container mb-2" style="width: 90px; height: 90px">
                  <svg class="stat-ring" width="90" height="90" viewBox="0 0 120 120">
                    <circle
                      class="ring-background"
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#f0f0f0"
                      stroke-width="8"
                    />
                    <circle
                      class="ring-progress"
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#gradient-tablet)"
                      stroke-width="8"
                      stroke-linecap="round"
                      :style="{
                        strokeDasharray: '314',
                        strokeDashoffset: getStrokeDashoffset(stat),
                      }"
                    />
                    <defs>
                      <linearGradient id="gradient-tablet" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color: #d52222; stop-opacity: 1" />
                        <stop offset="100%" style="stop-color: #bb1814; stop-opacity: 1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <!-- Icon in Center (Smaller) -->
                  <div class="stat-icon" style="font-size: 2rem">
                    <component :is="'span'" v-html="getStatIcon(stat.label)"></component>
                  </div>
                </div>

                <div class="stat-value text-dark mb-2" style="font-size: 2rem; font-weight: 800">
                  {{ stat.animatedValue }}{{ stat.suffix }}
                </div>
                <div class="stat-label text-muted" style="font-size: 0.85rem; font-weight: 600">
                  {{ stat.label.toUpperCase() }}
                </div>
              </div>

              <!-- Desktop Stat Card (≥ 992px) -->
              <div
                class="stat-card bg-white d-none d-lg-flex flex-column justify-content-center align-items-center p-4"
                @mouseenter="hoverStat = stat.label"
                @mouseleave="hoverStat = null"
              >
                <!-- Circular Progress Ring -->
                <div class="stat-ring-container mb-3">
                  <svg class="stat-ring" width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      class="ring-background"
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#f0f0f0"
                      stroke-width="8"
                    />
                    <circle
                      class="ring-progress"
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#gradient-desktop)"
                      stroke-width="8"
                      stroke-linecap="round"
                      :style="{
                        strokeDasharray: '314',
                        strokeDashoffset: getStrokeDashoffset(stat),
                      }"
                    />
                    <defs>
                      <linearGradient id="gradient-desktop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color: #d52222; stop-opacity: 1" />
                        <stop offset="100%" style="stop-color: #bb1814; stop-opacity: 1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <!-- Icon in Center -->
                  <div class="stat-icon">
                    <component :is="'span'" v-html="getStatIcon(stat.label)"></component>
                  </div>
                </div>

                <div class="stat-value text-dark mb-2" style="font-size: 2.5rem; font-weight: 800">
                  {{ stat.animatedValue }}{{ stat.suffix }}
                </div>
                <div class="stat-label text-muted" style="font-size: 0.95rem; font-weight: 600">
                  {{ stat.label.toUpperCase() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Wavelength -->
      <section id="Feature" class="why-section py-5 d-flex flex-column align-items-center">
        <!-- Mobile Heading (< 768px) -->
        <div class="text-center mb-3 mb-md-4 scroll-reveal d-block d-md-none" ref="whyHeading">
          <h2
            class="why-title font-weight-bold mb-2"
            style="font-size: 2rem; color: #fff; font-weight: 800; letter-spacing: 2px"
          >
            WHY WAVELENGTH
          </h2>
          <div
            class="why-subtitle font-weight-bold"
            style="color: #fff; font-size: 0.95rem; margin-bottom: 2rem"
          >
            EVERYTHING YOU NEED TO DISCOVER AND SUPPORT LOCAL MUSIC
          </div>
        </div>

        <!-- Tablet Heading (768px - 991px) -->
        <div
          class="text-center mb-3 mb-md-4 scroll-reveal d-none d-md-block d-lg-none"
          ref="whyHeading"
        >
          <h2
            class="why-title font-weight-bold mb-2"
            style="font-size: 2.5rem; color: #fff; font-weight: 800; letter-spacing: 2px"
          >
            WHY WAVELENGTH
          </h2>
          <div
            class="why-subtitle font-weight-bold"
            style="color: #fff; font-size: 1rem; margin-bottom: 2rem"
          >
            EVERYTHING YOU NEED TO DISCOVER AND SUPPORT LOCAL MUSIC
          </div>
        </div>

        <!-- Desktop Heading (≥ 992px) -->
        <div class="text-center mb-4 scroll-reveal d-none d-lg-block" ref="whyHeading">
          <h2
            class="why-title font-weight-bold mb-2"
            style="font-size: 3.5rem; color: #fff; font-weight: 800; letter-spacing: 2px"
          >
            WHY WAVELENGTH
          </h2>
          <div
            class="why-subtitle font-weight-bold"
            style="color: #fff; font-size: 1.2rem; margin-bottom: 2rem"
          >
            EVERYTHING YOU NEED TO DISCOVER AND SUPPORT LOCAL MUSIC
          </div>
        </div>

        <div class="container">
          <div class="row justify-content-center">
            <!-- Feature 1 -->
            <div
              class="col-12 col-md-4 text-center mb-5 mb-md-0 scroll-reveal feature-card-3d"
              style="display: flex; flex-direction: column"
              ref="feature1"
            >
              <!-- Mobile Feature Card (< 768px) -->
              <div class="feature-card-glass d-block d-md-none p-3" style="padding: 1.2rem">
                <div class="feature-icon mx-auto mb-3">
                  <svg height="50" width="50" viewBox="0 0 32 32" class="pulsing-icon">
                    <circle cx="15" cy="15" r="10" stroke="#c62828" stroke-width="3" fill="none" />
                    <line
                      x1="23"
                      y1="23"
                      x2="29"
                      y2="29"
                      stroke="#c62828"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <div
                  class="feature-title text-danger font-weight-bold mb-2"
                  style="font-size: 1.1rem"
                >
                  DISCOVER ARTISTS
                </div>
                <div class="feature-desc text-white" style="font-size: 0.97rem; line-height: 1.6">
                  Find local artists based on your music taste. From indie to jazz, discover hidden
                  gems in Singapore's music scene.
                </div>
              </div>

              <!-- Desktop Feature Card (≥ 768px) -->
              <div class="feature-card-glass d-none d-md-block p-5">
                <div class="feature-icon mx-auto mb-3">
                  <svg height="60" width="60" viewBox="0 0 32 32" class="pulsing-icon">
                    <circle cx="15" cy="15" r="10" stroke="#c62828" stroke-width="3" fill="none" />
                    <line
                      x1="23"
                      y1="23"
                      x2="29"
                      y2="29"
                      stroke="#c62828"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <div
                  class="feature-title text-danger font-weight-bold mb-3"
                  style="font-size: 1.6rem"
                >
                  DISCOVER ARTISTS
                </div>
                <div class="feature-desc text-white" style="font-size: 1.1rem; line-height: 1.6">
                  Find local artists based on your music taste. From indie to jazz, discover hidden
                  gems in Singapore's music scene.
                </div>
              </div>
            </div>

            <!-- Feature 2 -->
            <div
              class="col-12 col-md-4 text-center mb-5 mb-md-0 scroll-reveal feature-card-3d"
              ref="feature2"
            >
              <!-- Mobile Feature Card (< 768px) -->
              <div class="feature-card-glass d-block d-md-none p-3" style="padding: 1.2rem">
                <div class="feature-icon mx-auto mb-3">
                  <svg height="50" width="50" viewBox="0 0 32 32" class="flipping-icon">
                    <rect
                      x="6"
                      y="10"
                      width="20"
                      height="16"
                      rx="3"
                      fill="none"
                      stroke="#c62828"
                      stroke-width="3"
                    />
                    <rect x="6" y="6" width="20" height="6" fill="none" />
                    <line x1="10" y1="10" x2="10" y2="6" stroke="#c62828" stroke-width="3" />
                    <line x1="22" y1="10" x2="22" y2="6" stroke="#c62828" stroke-width="3" />
                  </svg>
                </div>
                <div
                  class="feature-title text-danger font-weight-bold mb-2"
                  style="font-size: 1.1rem"
                >
                  FIND EVENTS
                </div>
                <div class="feature-desc text-white" style="font-size: 0.97rem; line-height: 1.6">
                  Never miss a show. Browse upcoming gigs, concerts, and performances happening
                  around Singapore.
                </div>
              </div>

              <!-- Desktop Feature Card (≥ 768px) -->
              <div class="feature-card-glass d-none d-md-block p-5">
                <div class="feature-icon mx-auto mb-3">
                  <svg height="60" width="60" viewBox="0 0 32 32" class="flipping-icon">
                    <rect
                      x="6"
                      y="10"
                      width="20"
                      height="16"
                      rx="3"
                      fill="none"
                      stroke="#c62828"
                      stroke-width="3"
                    />
                    <rect x="6" y="6" width="20" height="6" fill="none" />
                    <line x1="10" y1="10" x2="10" y2="6" stroke="#c62828" stroke-width="3" />
                    <line x1="22" y1="10" x2="22" y2="6" stroke="#c62828" stroke-width="3" />
                  </svg>
                </div>
                <div
                  class="feature-title text-danger font-weight-bold mb-3"
                  style="font-size: 1.6rem"
                >
                  FIND EVENTS
                </div>
                <div class="feature-desc text-white" style="font-size: 1.1rem; line-height: 1.6">
                  Never miss a show. Browse upcoming gigs, concerts, and performances happening
                  around Singapore.
                </div>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="col-12 col-md-4 text-center scroll-reveal feature-card-3d" ref="feature3">
              <!-- Mobile Feature Card (< 768px) -->
              <div
                class="feature-card-glass d-block d-md-none p-3"
                style="padding: 1.2rem; margin-bottom: 0"
              >
                <div class="feature-icon mx-auto mb-3">
                  <svg height="50" width="50" viewBox="0 0 32 32" class="beating-heart">
                    <path
                      d="M16 28s-9.5-7.25-9.5-13.5A6.5 6.5 0 0116 8a6.5 6.5 0 019.5 6.5C25.5 20.75 16 28 16 28z"
                      fill="none"
                      stroke="#c62828"
                      stroke-width="3"
                    />
                  </svg>
                </div>
                <div
                  class="feature-title text-danger font-weight-bold mb-2"
                  style="font-size: 1.1rem"
                >
                  SUPPORT LOCAL
                </div>
                <div class="feature-desc text-white" style="font-size: 0.97rem; line-height: 1.6">
                  Follow your favorite artists, share their music, and help grow Singapore's local
                  music community.
                </div>
              </div>

              <!-- Desktop Feature Card (≥ 768px) -->
              <div class="feature-card-glass d-none d-md-block p-5">
                <div class="feature-icon mx-auto mb-3">
                  <svg height="60" width="60" viewBox="0 0 32 32" class="beating-heart">
                    <path
                      d="M16 28s-9.5-7.25-9.5-13.5A6.5 6.5 0 0116 8a6.5 6.5 0 019.5 6.5C25.5 20.75 16 28 16 28z"
                      fill="none"
                      stroke="#c62828"
                      stroke-width="3"
                    />
                  </svg>
                </div>
                <div
                  class="feature-title text-danger font-weight-bold mb-2"
                  style="font-size: 1.5rem"
                >
                  SUPPORT LOCAL
                </div>
                <div class="feature-desc text-white" style="font-size: 1.1rem; line-height: 1.6">
                  Follow your favorite artists, share their music, and help grow Singapore's local
                  music community.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Artist CTA -->
      <section class="artist-cta-section py-5">
        <!-- Flying Music Symbols -->
        <div class="music-particles">
          <div
            v-for="n in 20"
            :key="'particle-' + n"
            class="music-note"
            :style="getParticleStyle(n)"
          >
            {{ getMusicSymbol(n) }}
          </div>
        </div>

        <!-- Animated Background Gradient -->
        <div class="dynamic-gradient"></div>

        <!-- Mobile CTA Content (< 768px) -->
        <div
          class="container scroll-reveal cta-content d-block d-md-none px-3"
          ref="ctaSection"
          style="padding-left: 1rem; padding-right: 1rem"
        >
          <h2
            class="cta-title mb-2 split-text"
            ref="ctaTitle"
            style="font-size: 2.5rem; gap: 0.8rem"
          >
            <span
              v-for="(word, index) in ctaWords"
              :key="index"
              class="word-animate"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              {{ word }}
            </span>
          </h2>
          <div class="cta-sub mb-4 dramatic-fade" style="font-size: 1.1rem; max-width: 100%">
            <span class="cta-line" style="animation-delay: 0.5s"
              >REACH NEW FANS AND GROW YOUR AUDIENCE ON WAVELENGTH.</span
            ><br />
            <span class="cta-line" style="animation-delay: 0.7s"
              >CREATE YOUR PROFILE, SHARE YOUR SOUND, AND PROMOTE YOUR GIGS — ALL IN ONE
              PLACE.</span
            >
          </div>
          <ul class="cta-list mb-3">
            <li class="list-item-slide" style="animation-delay: 0.9s; font-size: 1.2rem">
              <span class="cta-icon">&#10003;</span>
              Free artist profile with bio and links
            </li>
            <li class="list-item-slide" style="animation-delay: 1.1s; font-size: 1.2rem">
              <span class="cta-icon">&#10003;</span>
              Embed your music from Spotify &amp; YouTube
            </li>
            <li class="list-item-slide" style="animation-delay: 1.3s; font-size: 1.2rem">
              <span class="cta-icon">&#10003;</span>
              Post and promote your events
            </li>
            <li class="list-item-slide" style="animation-delay: 1.5s; font-size: 1.2rem">
              <span class="cta-icon">&#10003;</span>
              Connect with fans who love your genre
            </li>
          </ul>
          <router-link
            to="/register"
            class="btn btn-danger btn-lg cta-btn dramatic-button"
            style="font-size: 1.2rem; padding: 1rem 2rem; border-radius: 2rem"
          >
            SIGN UP NOW
          </router-link>
        </div>

        <!-- Desktop CTA Content (≥ 768px) -->
        <div class="container scroll-reveal cta-content d-none d-md-block px-5" ref="ctaSection">
          <h2 class="cta-title mb-3 split-text" ref="ctaTitle" style="font-size: 5rem; gap: 1.5rem">
            <span
              v-for="(word, index) in ctaWords"
              :key="index"
              class="word-animate"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              {{ word }}
            </span>
          </h2>
          <div class="cta-sub mb-5 dramatic-fade" style="font-size: 1.3rem; max-width: 900px">
            <span class="cta-line" style="animation-delay: 0.5s"
              >REACH NEW FANS AND GROW YOUR AUDIENCE ON WAVELENGTH.</span
            ><br />
            <span class="cta-line" style="animation-delay: 0.7s"
              >CREATE YOUR PROFILE, SHARE YOUR SOUND, AND PROMOTE YOUR GIGS — ALL IN ONE
              PLACE.</span
            >
          </div>
          <ul class="cta-list mb-4">
            <li class="list-item-slide" style="animation-delay: 0.9s; font-size: 1.5rem">
              <span class="cta-icon">&#10003;</span>
              Free artist profile with bio and links
            </li>
            <li class="list-item-slide" style="animation-delay: 1.1s; font-size: 1.5rem">
              <span class="cta-icon">&#10003;</span>
              Embed your music from Spotify &amp; YouTube
            </li>
            <li class="list-item-slide" style="animation-delay: 1.3s; font-size: 1.5rem">
              <span class="cta-icon">&#10003;</span>
              Post and promote your events
            </li>
            <li class="list-item-slide" style="animation-delay: 1.5s; font-size: 1.5rem">
              <span class="cta-icon">&#10003;</span>
              Connect with fans who love your genre
            </li>
          </ul>
          <router-link
            to="/register"
            class="btn btn-danger btn-lg cta-btn dramatic-button"
            style="font-size: 1.5rem; padding: 1.2rem 3rem; border-radius: 2rem; margin-top: 1.5rem"
          >
            SIGN UP NOW
          </router-link>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer-section">
        <div
          class="footer-main d-flex flex-column justify-content-center align-items-center text-center scroll-reveal"
          ref="footer"
        >
          <!-- Mobile Title (< 768px) -->
          <h2
            class="footer-title mb-3 d-block d-md-none"
            style="
              font-size: 2rem;
              font-weight: 800;
              letter-spacing: 2px;
              margin-top: 60px;
              background: linear-gradient(135deg, #fff 0%, #d95656 50%, #fff 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: gradientShift 5s ease infinite;
            "
          >
            STAY ON WAVELENGTH
          </h2>

          <!-- Desktop Title (≥ 768px) -->
          <h2
            class="footer-title mb-4 d-none d-md-block"
            style="
              font-size: 4rem;
              font-weight: 800;
              letter-spacing: 2px;
              margin-top: 100px;
              background: linear-gradient(135deg, #fff 0%, #d95656 50%, #fff 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: gradientShift 5s ease infinite;
            "
          >
            STAY ON WAVELENGTH
          </h2>

          <!-- Mobile Subtitle (< 768px) -->
          <div
            class="footer-sub mb-4 d-block d-md-none"
            style="font-size: 1rem; font-weight: 700; letter-spacing: 1px"
          >
            JOIN THOUSANDS OF MUSIC LOVERS SUPPORTING SINGAPORE'S LOCAL ARTISTS
          </div>

          <!-- Desktop Subtitle (≥ 768px) -->
          <div
            class="footer-sub mb-5 d-none d-md-block"
            style="font-size: 1.2rem; font-weight: 700; letter-spacing: 1px"
          >
            JOIN THOUSANDS OF MUSIC LOVERS SUPPORTING SINGAPORE'S LOCAL ARTISTS
          </div>
        </div>

        <!-- Footer Bar -->
        <div
          class="footer-bar"
          style="
            background: linear-gradient(90deg, #b71c1c 0%, #d52222 50%, #b71c1c 100%);
            color: #fff;
            text-align: center;
            padding: 1.2rem 0 1.1rem 0;
            font-weight: 500;
            margin-top: 80px;
            position: relative;
            z-index: 1;
          "
        >
          <!-- Mobile Footer Copy (< 768px) -->
          <span class="footer-copy d-block d-md-none" style="font-size: 1rem">
            © 2025 WAVELENGTH. DISCOVER SINGAPORE'S LOCAL MUSIC.
          </span>

          <!-- Desktop Footer Copy (≥ 768px) -->
          <span class="footer-copy d-none d-md-block" style="font-size: 1.1rem">
            © 2025 WAVELENGTH. DISCOVER SINGAPORE'S LOCAL MUSIC.
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  data() {
    return {
      stats: [
        { label: 'Local Artists', value: 500, animatedValue: 0, suffix: '+' },
        { label: 'Music Fans', value: 1000, animatedValue: 0, suffix: '+' },
        { label: 'Events Per Month', value: 50, animatedValue: 0, suffix: '+' },
      ],
      ctaWords: ['ARE', 'YOU', 'AN', 'ARTIST?'],
      mouseX: 0,
      mouseY: 0,
      observer: null,
      hoverStat: null,
    }
  },
  computed: {
    spotlightStyle() {
      return {
        background: `radial-gradient(circle 600px at ${this.mouseX}px ${this.mouseY}px, rgba(217, 86, 86, 0.15), transparent 80%)`,
      }
    },
  },
  mounted() {
    this.setupScrollAnimations()
    this.setupFeatureCard3D()
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    handleMouseMove(e) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY

      // Magnetic text effect for hero title
      if (this.$refs.heroTitle) {
        const rect = this.$refs.heroTitle.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (e.clientX - centerX) * 0.02
        const deltaY = (e.clientY - centerY) * 0.02
        this.$refs.heroTitle.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      }
    },
    setupScrollAnimations() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')

              // Trigger count-up animation for stats
              if (entry.target === this.$refs.statsHeading) {
                this.animateStats()
              }
            }
          })
        },
        { threshold: 0.2 },
      )

      // Observe all scroll-reveal elements
      this.$nextTick(() => {
        const elements = this.$el.querySelectorAll('.scroll-reveal')
        elements.forEach((el) => this.observer.observe(el))
      })
    },
    animateStats() {
      this.stats.forEach((stat, index) => {
        const duration = 2000 // 2 seconds
        const steps = 60
        const increment = stat.value / steps
        let current = 0

        const timer = setInterval(() => {
          current += increment
          if (current >= stat.value) {
            stat.animatedValue = stat.value
            clearInterval(timer)
          } else {
            stat.animatedValue = Math.floor(current)
          }
        }, duration / steps)
      })
    },
    setupFeatureCard3D() {
      this.$nextTick(() => {
        const cards = this.$el.querySelectorAll('.feature-card-3d')
        cards.forEach((card) => {
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            const rotateX = ((y - centerY) / centerY) * -10
            const rotateY = ((x - centerX) / centerX) * 10
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
          })

          card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
          })
        })
      })
    },
    getParticleStyle(n) {
      const delay = Math.random() * 5
      const duration = 15 + Math.random() * 10
      const startX = Math.random() * 100
      const endX = Math.random() * 100
      const size = 1.5 + Math.random() * 2

      return {
        left: `${startX}%`,
        fontSize: `${size}rem`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        '--end-x': `${endX}%`,
      }
    },
    getMusicSymbol(n) {
      const symbols = ['♪', '♫', '♬', '♩', '𝄞', '🎵', '🎶', '🎸', '🎤', '🎧']
      return symbols[n % symbols.length]
    },
    getStrokeDashoffset(stat) {
      const percentage = (stat.animatedValue / stat.value) * 100
      const circumference = 314
      return circumference - (circumference * percentage) / 100
    },
    getStatIcon(label) {
      const icons = {
        'Local Artists': '🎤',
        'Music Fans': '👥',
        'Events Per Month': '📅',
      }
      return icons[label] || '🎵'
    },
  },
}
</script>

<style scoped>
/* Cursor Spotlight Effect */
.cursor-spotlight {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  transition: background 0.3s ease;
}

/* Text Animations */
.letter {
  display: inline-block;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

.letter-space {
  display: inline-block;
  width: 0.3em;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 1s ease forwards;
}

/* Magnetic Text Effect */
.magnetic-text {
  transition: transform 0.3s ease;
  cursor: default;
}

/* Scroll Reveal Animations */
.scroll-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 3D Card Tilt Effect */
.feature-card-3d {
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}

/* Glassmorphism Feature Cards */
.feature-card-glass {
  background: rgba(25, 23, 23, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(217, 86, 86, 0.05);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  min-height: 100%;
  height: 100%;
}

.feature-card-glass::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(213, 34, 34, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-card-glass:hover {
  border-color: rgba(213, 34, 34, 0.5);
  box-shadow:
    0 15px 50px rgba(213, 34, 34, 0.3),
    inset 0 0 30px rgba(217, 86, 86, 0.1);
  background: rgba(25, 23, 23, 0.6);
}

.feature-card-glass:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulsing-icon {
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(198, 40, 40, 0.5));
  }
  50% {
    transform: scale(1.15);
    filter: drop-shadow(0 0 15px rgba(198, 40, 40, 0.8));
  }
}

.flipping-icon {
  animation: iconFlip 4s ease-in-out infinite;
}

@keyframes iconFlip {
  0%,
  100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
}

.beating-heart {
  animation: heartBeat 1.5s ease-in-out infinite;
}

@keyframes heartBeat {
  0%,
  100% {
    transform: scale(1);
  }
  10%,
  30% {
    transform: scale(1.2);
  }
  20%,
  40% {
    transform: scale(1);
  }
}

/* Gradient Mesh Background for Stats */
.stats-section {
  position: relative;
  overflow: hidden;
}

.gradient-mesh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 50%, rgba(217, 86, 86, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(199, 53, 53, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(181, 20, 20, 0.2) 0%, transparent 50%);
  animation: meshMove 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes meshMove {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(20px, -20px);
  }
  50% {
    transform: translate(-20px, 20px);
  }
  75% {
    transform: translate(20px, 20px);
  }
}

/* Pulsing Gradient for Artist CTA */
.artist-cta-section {
  position: relative;
  overflow: hidden;
}

.pulsing-gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 30% 40%, rgba(214, 34, 34, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 70% 60%, rgba(190, 28, 27, 0.05) 0%, transparent 40%);
  animation: pulseGradient 6s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes pulseGradient {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.8;
  }
}

.artist-cta-section > .container {
  position: relative;
  z-index: 1;
}

/* Stats Section - make sure content is above gradient */
.stats-section > .stats-heading,
.stats-section > .container {
  position: relative;
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 1;
}
.landing-page {
  min-height: 100vh;
  background: #191717;
  position: relative;
  font-family: 'Poppins', sans-serif;
}

.meta-action-bar {
  background: transparent;
}

.wave-svg {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100vw;
  height: 300px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
  overflow: hidden;
}

.wave-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}

.landing-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(ellipse at center, rgba(187, 24, 20, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse at 30% 50%, rgba(199, 53, 53, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(187, 24, 20, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* Hero background example: add your svg or image via CSS or as a background image */
.header-nav {
  background: #171717;
  min-height: 80px;
}

.logo-img {
  height: 80px;
  transition: transform 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.05);
}

.sign-up-btn {
  text-decoration: none;
  outline: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  position: relative;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-shadow: 0 2px 10px rgba(217, 86, 86, 0.3);
}

.sign-up-btn::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d95656, transparent);
  transform: translateX(-50%);
  transition: width 0.4s ease;
}

.sign-up-btn:hover {
  color: #d95656 !important;
  transform: translateY(-2px);
  text-shadow: 0 4px 15px rgba(217, 86, 86, 0.5);
}

.sign-up-btn:hover::after {
  width: 100%;
}

.log-in-btn {
  border-width: 3px;
  border-radius: 30px;
  padding: 0.65rem 1.8rem;
  color: #fff;
  background: rgba(25, 23, 23, 0.3);
  backdrop-filter: blur(5px);
  border-color: #d52222;
  font-weight: 700;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow:
    0 4px 15px rgba(213, 34, 34, 0.2),
    inset 0 0 20px rgba(213, 34, 34, 0.1);
}

.log-in-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(213, 34, 34, 0.8) 0%, rgba(187, 24, 20, 0.9) 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    width 0.5s ease,
    height 0.5s ease;
  z-index: -1;
}

.log-in-btn:hover,
.log-in-btn:focus {
  background: rgba(213, 34, 34, 0.9);
  border-color: #fff;
  color: #fff;
  transform: translateY(-3px) scale(1.05);
  box-shadow:
    0 8px 25px rgba(213, 34, 34, 0.5),
    inset 0 0 30px rgba(255, 255, 255, 0.1);
}

.log-in-btn:hover::before {
  width: 300px;
  height: 300px;
}

.log-in-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.hero-section {
  position: relative;
  min-height: calc(100vh - 80px);
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hero-content {
  z-index: 2;
  position: relative;
  max-width: 800px;
}

.hero-title {
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #d95656 50%, #fff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  animation: gradientShift 5s ease infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}

.hero-actions .btn {
  font-weight: 800;
  letter-spacing: 1.5px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.get-started-btn {
  background: linear-gradient(135deg, #d52222 0%, #bb1814 100%);
  border: 3px solid transparent;
  box-shadow:
    0 6px 20px rgba(213, 34, 34, 0.4),
    0 0 30px rgba(217, 86, 86, 0.2);
}

.get-started-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    width 0.6s ease,
    height 0.6s ease;
}

.get-started-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: buttonShine 3s infinite;
}

@keyframes buttonShine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.get-started-btn:hover {
  background: linear-gradient(135deg, #bb1814 0%, #d52222 100%);
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 10px 30px rgba(213, 34, 34, 0.6),
    0 0 50px rgba(217, 86, 86, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

.get-started-btn:hover::before {
  width: 300px;
  height: 300px;
}

.get-started-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.learn-more-btn {
  border: 3px solid #d52222;
  color: #fff;
  background: rgba(25, 23, 23, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(213, 34, 34, 0.1);
  position: relative;
}

.learn-more-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(213, 34, 34, 0.3), transparent);
  transition: width 0.5s ease;
}

.learn-more-btn:hover,
.learn-more-btn:focus {
  background: rgba(213, 34, 34, 0.9);
  border-color: #fff;
  color: #fff;
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 10px 30px rgba(213, 34, 34, 0.5),
    inset 0 0 30px rgba(255, 255, 255, 0.1);
}

.learn-more-btn:hover::before {
  width: 100%;
}

.learn-more-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.stats-section {
  background: #b51414; /* Deep red */
  min-height: 300px;
  width: 100%;
}

.stat-card {
  border-radius: 30px;
  min-width: 340px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  line-height: 1;
  font-family: poppins, sans-serif;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%) !important;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(213, 34, 34, 0.05) 0%, transparent 70%);
  animation: statCardGlow 3s ease-in-out infinite;
}

@keyframes statCardGlow {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, 10px);
  }
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow:
    0 20px 60px rgba(213, 34, 34, 0.3),
    0 0 0 1px rgba(213, 34, 34, 0.2);
}

/* Circular Progress Ring */
.stat-ring-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.stat-ring {
  transform: rotate(-90deg);
}

.ring-progress {
  transition: stroke-dashoffset 2s ease;
}

.stat-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.why-section {
  width: 100%;
}

.why-title {
  color: #fff;
  font-weight: 800;
  letter-spacing: 2px;
}

.why-subtitle {
  color: #fff;
  margin-bottom: 2rem;
}

.feature-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

.feature-title {
  font-weight: 800;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.feature-desc {
  font-weight: 400;
  margin-top: 0.6rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

/* NO @media queries! */

.artist-cta-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  align-items: center;
}

/* Flying Music Particles */
.music-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.music-note {
  position: absolute;
  color: rgba(217, 86, 86, 0.3);
  font-weight: bold;
  animation: floatUp 20s linear infinite;
  opacity: 0;
}

@keyframes floatUp {
  0% {
    bottom: -10%;
    opacity: 0;
    transform: translateX(0) rotate(0deg);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    bottom: 110%;
    opacity: 0;
    transform: translateX(var(--end-x)) rotate(360deg);
  }
}

/* Dynamic Animated Gradient Background */
.dynamic-gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(circle at 20% 50%, rgba(213, 34, 34, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(181, 20, 20, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(199, 53, 53, 0.2) 0%, transparent 50%);
  animation: rotatePulse 15s ease-in-out infinite;
  z-index: 0;
}

@keyframes rotatePulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.6;
  }
  25% {
    transform: scale(1.2) rotate(90deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.7;
  }
  75% {
    transform: scale(1.3) rotate(270deg);
    opacity: 0.9;
  }
}

.cta-content {
  position: relative;
  z-index: 2;
}

.cta-title {
  font-weight: 900;
  letter-spacing: 3px;
  color: #fff;
  text-shadow:
    0 0 20px rgba(217, 86, 86, 0.5),
    0 0 40px rgba(217, 86, 86, 0.3),
    0 5px 15px rgba(0, 0, 0, 0.3);
}

.split-text {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.word-animate {
  display: inline-block;
  opacity: 0;
  animation: dramaticWordEntry 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes dramaticWordEntry {
  0% {
    opacity: 0;
    transform: translateY(-100px) rotateX(-90deg) scale(0.5);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0) scale(1);
    filter: blur(0);
  }
}

.cta-sub {
  font-weight: 600;
  color: #e0e0e0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.cta-line {
  display: inline-block;
  opacity: 0;
  animation: fadeSlideIn 1s ease forwards;
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.cta-list {
  list-style-type: none;
  padding-left: 0;
}

.cta-list li {
  display: flex;
  align-items: center;
  margin-bottom: 1.1rem;
  color: #fff;
  opacity: 0;
}

.list-item-slide {
  animation: slideInFromLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #d95656;
  font-size: 2rem;
  margin-right: 1rem;
  text-shadow: 0 0 10px rgba(217, 86, 86, 0.5);
}

.dramatic-button {
  opacity: 0;
  animation: buttonDramaticEntry 1s ease forwards;
  animation-delay: 1.7s;
}

@keyframes buttonDramaticEntry {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  70% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

.cta-btn {
  font-weight: 800;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  background: linear-gradient(135deg, #d52222 0%, #bb1814 100%);
  border: 3px solid #fff;
  box-shadow:
    0 8px 25px rgba(213, 34, 34, 0.5),
    0 0 40px rgba(217, 86, 86, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.cta-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.cta-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -50%;
  }
  100% {
    left: 150%;
  }
}

.cta-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow:
    0 15px 40px rgba(213, 34, 34, 0.7),
    0 0 60px rgba(217, 86, 86, 0.5),
    inset 0 0 30px rgba(255, 255, 255, 0.2);
  border-color: #d95656;
}

.cta-btn:hover::before {
  width: 400px;
  height: 400px;
}

.cta-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.footer-section {
  color: #fff;
  width: 100%;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.footer-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 30% 50%, rgba(213, 34, 34, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(181, 20, 20, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.footer-main {
  position: relative;
  z-index: 1;
}

.footer-title {
  animation: gradientShift 5s ease infinite;
}

.footer-sub {
  letter-spacing: 1px;
}

/* Social Links */
.social-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.social-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(213, 34, 34, 0.8) 0%, rgba(187, 24, 20, 0.6) 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    width 0.4s ease,
    height 0.4s ease;
  z-index: -1;
}

.social-icon:hover {
  transform: translateY(-5px) scale(1.1);
  border-color: #d52222;
  box-shadow: 0 10px 30px rgba(213, 34, 34, 0.4);
}

.social-icon:hover::before {
  width: 100px;
  height: 100px;
}

/* Footer Links */
.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #d52222;
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: #fff;
}

.footer-link:hover::after {
  width: 100%;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}
</style>
