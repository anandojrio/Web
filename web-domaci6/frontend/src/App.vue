<template>
  <div id="app">
    <Navbar v-if="isAuthenticated" />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Navbar from '@/components/NavbarComponent.vue'

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('user')
})
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
