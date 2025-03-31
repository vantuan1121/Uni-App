<script setup>
import SearchHeader from './search-header/SearchHeader.vue'
import Browse from './browse/Browse.vue'
import ShowPhoto from '@/pages/index/search/ShowPhoto.vue'
</script>

<template>
  <div class="">
    <SearchHeader></SearchHeader>
  </div>

  <div class="mt-[60px]">
    <h1 class="font-bold text-[26px] ml-[30px]">
      Browse by Category
    </h1>
    <div>
      <Browse></Browse>
    </div>
  </div>

  <div>
    <h1 class="font-bold text-[26px] mt-[30px] ml-[30px]">
      Discover
    </h1>
  </div>
  <div class="mt-[10px]">
    <ShowPhoto></ShowPhoto>
  </div>
</template>
