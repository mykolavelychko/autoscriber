<template>
  <div>
    <RecordsList />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import RecordsList from '../components/RecordsList.vue';
</script>
