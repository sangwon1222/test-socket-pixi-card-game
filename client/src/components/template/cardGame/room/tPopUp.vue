<script lang="ts" setup>
import { debounce } from 'lodash-es';
import { onUpdated } from 'vue';
import { userStore } from '@store/user';
import { cardStore } from '@store/editCard';

onUpdated(async () => {
  const roomNameInput = document.getElementById('roomNameInput') as HTMLInputElement;
  setTimeout(() => roomNameInput?.focus(), 0);
});

const submit = debounce(
  () => {
    const roomNameInput = document.getElementById('roomNameInput') as HTMLInputElement;
    userStore.roomName = roomNameInput.value;
    userStore.isRoomNameInput = false;

    const app = window['app'] as any;
    app.getScene.socket.emit('search-room', { roomName: userStore.roomName, cardDeck: cardStore.cards });
  },
  500,
  { leading: true, trailing: false }
);
</script>

<template>
  <div class="wrap">
    <div class="absolute z-10 h-full w-full bg-black opacity-80" @click.self="userStore.isRoomNameInput = false" />
    <div class="card">
      <p>방 이름을 입력해 주세요.</p>
      <input id="roomNameInput" type="text" @keypress.enter="submit" />
      <button @click="submit">입력</button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wrap {
  @apply pointer-events-auto fixed z-20 flex h-full w-full items-center justify-center;
  .card {
    @apply z-20 rounded bg-white p-20;
    input {
      @apply border-2 focus:border-sky-700;
    }
  }
}
</style>
