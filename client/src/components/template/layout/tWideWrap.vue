<script setup lang="ts" scoped>
defineProps({
  customStyle: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="flex w-full flex-wrap justify-center" :class="customStyle">
    <slot />
  </div>
</template>
