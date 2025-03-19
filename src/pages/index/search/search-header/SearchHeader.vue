<script setup>
import { ref } from 'vue'
import search from '@/static/tabbar/search.png'

const searchQuery = ref('')
</script>

<template>
  <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200">
    <img :src="search" alt="search" class="w-5 h-5" />
    <input
      v-model="searchQuery" type="text" placeholder="Search photos, collections, users"
      class="flex-1 bg-transparent outline-none text-sm"
    />
  </div>
</template>
