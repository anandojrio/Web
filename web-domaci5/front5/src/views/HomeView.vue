<template>
  <div>
    <h2>PROB APROBA</h2>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PostService from '@/services/PostService'

onMounted(async () => {
  try {
    const posts = await PostService.getPosts()
    console.log('Fetched posts:', posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
})
</script>
