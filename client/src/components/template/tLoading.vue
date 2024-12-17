<template>
  <div class="t-0 l-0 animate-fadeIn pointer-events-auto fixed z-100 h-screen w-screen">
    <div class="h-full w-full bg-black opacity-50">
      <div class="circle" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.circle {
  @apply fixed left-1/2 h-200 w-200 animate-[spin_2s_linear_infinite] rounded-full border-20 border-transparent border-t-white;
  top: calc(50% - 100px);
}

#progress-bar-wrap {
  @apply fixed left-1/2 h-40 w-800 overflow-hidden rounded border-2 bg-white;
  top: calc(50% + 200px);
  transform: translate(-50%, -50%);
  #progress-bar {
    @apply h-full bg-sky-500;
  }
}
</style>
