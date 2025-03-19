<script setup>
import SearchHeader from './search-header/SearchHeader.vue'
import Browse from './browse/Browse.vue'
import DiscoverVue from './discover/Discover.vue'
</script>

<template>
  <SearchHeader></SearchHeader>

  <div class="mt-[30px] ml-[30px]">
    <Browse></Browse>
  </div>

  <div class="mt-[30px] ml-[30px]">
    <DiscoverVue></DiscoverVue>
  </div>
</template>
