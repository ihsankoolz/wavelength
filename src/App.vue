<template>
  <div id="app">
    <RouterView />
    <!-- AI Chatbot - Available globally for logged-in users -->
    <AIChatbot />
  </div>
</template>

<script>
import AIChatbot from '@/components/AIChatbot.vue'

export default {
  name: 'App',
  components: {
    AIChatbot,
  },
}
</script>

<style>
/* Reset only what's necessary - don't break Bootstrap */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(ellipse at center, rgba(181, 20, 20, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse at 30% 50%, rgba(199, 53, 53, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(181, 20, 20, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: -2;
}

.wave-svg {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100vw;
  height: 300px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: -1;
  opacity: 0.45;
  overflow: hidden;
}
.wave-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
