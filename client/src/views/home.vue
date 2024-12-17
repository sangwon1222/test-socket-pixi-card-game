<script setup lang="ts" scoped>
import tWideWrap from '@template/layout/tWideWrap.vue';
import { userStore } from '@store/user';
import Application from '@core/application';
import CardScene from '@game/card/scene';
import { useRouter } from 'vue-router';
import config from '@app/config';
import { onMounted } from 'vue';
import { loadingStore } from '@store/loading';

loadingStore.isLoading = true;
const { canvas } = config;
const router = useRouter();

onMounted(async () => {
  const canvasElement = document.getElementById('pixi-canvas') as HTMLCanvasElement;
  window['app'] = new Application({
    backgroundColor: canvas.bg,
    width: canvas.width,
    height: canvas.height,
    view: canvasElement,
  });
  await window['app'].init();

  resize();
  window.addEventListener('resize', () => resize());
  loadingStore.isLoading = false;
});

const resize = () => {
  const canvasElement = document.getElementById('pixi-canvas') as HTMLCanvasElement;
  const screenRate = innerWidth / innerHeight;
  const canvasRate = canvas.width / canvas.height;

  if (screenRate > canvasRate) {
    canvasElement.style.width = `${innerHeight * canvasRate}px`;
    canvasElement.style.height = `${innerHeight}px`;
  } else {
    canvasElement.style.width = `${innerWidth}px`;
    canvasElement.style.height = `${innerWidth / canvasRate}px`;
  }
};

const goHome = async () => {
  await CardScene.getHandle.socket.close();
  router.push('/');
};
</script>

<template>
  <t-wide-wrap custom-style="min-h-screen bg-gray-900">
    <div class="flex w-full max-w-1280 items-center justify-center">
      <canvas id="pixi-canvas" class="relative z-10" />

      <div class="fixed left-0 top-0 z-20 grid max-h-100 w-full grid-cols-3 text-white">
        <div class="relative flex max-w-100 flex-col gap-1 text-xs font-black">
          <ul class="relative grid border bg-black bg-opacity-40 text-center">
            <li>ID</li>
            <li>{{ userStore.socketId?.substring(0, 4) }}</li>
          </ul>
        </div>

        <div
          class="relative flex w-full flex-col gap-1 text-xs font-black"
          :class="userStore.income ? 'opacity-1' : 'opacity-0'"
        >
          <ul class="relative grid min-w-80 border bg-black bg-opacity-40 text-center">
            <li>상대 유저:</li>
            <li>{{ userStore.income?.substring(0, 4) }}</li>
          </ul>
        </div>

        <div class="relative flex w-full flex-col items-end gap-1 text-xs font-black">
          <button class="relative h-full min-w-100 border bg-black bg-opacity-40 text-center" @click="goHome">
            편집하기
          </button>
        </div>
      </div>
    </div>
  </t-wide-wrap>
</template>
