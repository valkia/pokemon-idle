<template>
  <main class="poke-container">
    <div class="poke-layout">
      <router-view />
      <Footer />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: 'Pokemon Game',
})
</script>

<style lang="scss">
:root {
  // Pokemon theme colors
  --primary-color: #FF0000;
  --secondary-color: #CC0000; 
  --accent-color: #3B4CCA;
  --text-color: #333333;
  --text-light: #FFFFFF;
  --background-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.poke-container {
  min-height: 100vh;
  width: 100%;
  background: var(--background-gradient);
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/src/assets/images/pokemon/background.png');
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: 0;
  }
}

.poke-layout {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
}

// Dark mode support
.dark {
  --text-color: #FFFFFF;
  --background-gradient: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}
</style>