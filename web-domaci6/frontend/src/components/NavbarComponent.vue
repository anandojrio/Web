<template>
  <nav class="navbar navbar-expand-md navbar-light fun-container mb-4">
    <div class="container-fluid">
      <router-link to="/posts" class="navbar-brand title-fun">Blog App</router-link>
      <div class="d-flex ms-auto">
        <LogoutButton />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import LogoutButton from '@/components/LogoutButton.vue'
</script>

<style scoped>
.fun-container {
  background: #e0e7ff;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.3);
  font-family: 'Roboto', sans-serif;
  color: #1e293b;
}
.title-fun {
  font-family: 'Roboto', sans-serif;
  color: #1e3a8a;
  text-shadow: 2px 2px 4px rgba(30, 58, 138, 0.4);
  letter-spacing: 2px;
  font-size: 30px;
  margin-left: 5%;
}

.fun-container {
  min-height: 80px;
}
</style>
