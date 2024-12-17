<script lang="ts" setup>
import { userStore } from '@store/user';
</script>

<template>
  <div class="wrap">
    <div class="absolute z-10 h-full w-full bg-black opacity-80" />
    <div class="z-20 flex w-320 flex-col rounded-2xl bg-white p-20">
      <p
        class="text-xl"
        style="
           {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          }
        "
      >
        {{ userStore.roomName }}
      </p>
      <p>코드를 복사한 후</p>
      <p>친구에게 공유하세요. 방 찾기 버튼을 누르고 코드를 입력해주세요.</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wrap {
  @apply pointer-events-auto fixed z-20 flex h-full w-full items-center justify-center;
}
</style>
