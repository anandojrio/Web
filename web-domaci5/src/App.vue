<template>
  <div class="container">
    <header>
      <h1>Public Blog</h1>
    </header>
    <main>
      <HomeView />
    </main>
    <footer>
      <p>&copy; 2025 Blog Platform</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import HomeView from './views/HomeView.vue'
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header,
footer {
  text-align: center;
  padding: 20px 0;
}
</style>
