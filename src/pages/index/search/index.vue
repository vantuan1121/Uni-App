<script setup>
import SearchHeader from './search-header/SearchHeader.vue'
import Browse from './browse/Browse.vue'
import ShowPhoto from '@/pages/index/search/ShowPhoto.vue'
</script>

<template>
  <div class="fixed top-9 left-0 w-full bg-white  z-50 p-2">
    <SearchHeader></SearchHeader>
  </div>

  <div class="mt-[70px] ml-[30px]">
    <Browse></Browse>
  </div>

  <div>
    <h1 class="font-bold text-[30px] mt-[30px] ml-[30px]">
      Discover
    </h1>
  </div>
  <div class="mt-[10px]">
    <ShowPhoto></ShowPhoto>
  </div>
</template>
