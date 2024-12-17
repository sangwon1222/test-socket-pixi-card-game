<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({ isFullScrStatus: false });

const goFullScreen = () => {
  const app = document.getElementById('app') as HTMLDivElement;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    if (app.requestFullscreen) {
      app.requestFullscreen();
    }
  }
  state.isFullScrStatus = !document.fullscreenElement;
};
</script>

<template>
  <button class="full-screen-btn" @click="goFullScreen">
    <p class="absolute block h-full w-full rounded bg-black opacity-50"></p>
    <div>
      <p
        class="h-[calc(40%)] w-[calc(80%)]"
        :class="
          state.isFullScrStatus
            ? 'before:border-transparent before:border-b-white before:border-r-white after:border-transparent after:border-b-white after:border-l-white'
            : 'before:border-transparent before:border-l-white before:border-t-white after:border-transparent after:border-r-white after:border-t-white'
        "
      />
      <p
        class="h-[calc(40%)] w-[calc(80%)]"
        :class="
          state.isFullScrStatus
            ? 'before:border-transparent before:border-r-white before:border-t-white after:border-transparent after:border-l-white after:border-t-white'
            : 'before:border-transparent before:border-b-white before:border-l-white after:border-transparent after:border-b-white after:border-r-white'
        "
      />
    </div>
  </button>
</template>

<style lang="less" scoped>
.full-screen-btn {
  @apply fixed right-10 top-10 z-30 h-40 w-40;
  > div {
    @apply relative right-0 top-0 block flex h-full w-full flex-col items-center justify-center;
    > p {
      @apply grid grid-cols-2 
    before:m-auto
    before:block
    before:h-[80%]
    before:w-[80%]
    before:border-2
    before:content-['']
    after:m-auto
    after:block
    after:h-[80%]
    after:w-[80%]
    after:border-2
    after:content-[''];
    }
  }
}
</style>
