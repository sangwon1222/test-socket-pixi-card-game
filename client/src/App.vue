<script lang="ts" setup scoped>
import { RouterView } from 'vue-router';
import aFullScreenBtn from '@atom/aFullScreenBtn.vue';
import tPopUp from '@template/cardGame/room/tPopUp.vue';
import tRoomNamePopUp from '@template/cardGame/room/tRoomNamePopUp.vue';
import tLoading from '@template/tLoading.vue';
import { userStore } from '@store/user';
import { loadingStore } from '@store/loading';
</script>

<template>
  <div class="min-h-screen min-w-full">
    <t-loading v-if="loadingStore.isLoading" />
    <t-pop-up v-if="userStore.isRoomNameInput" />
    <t-room-name-pop-up v-if="userStore.isRoomNameShare" />
    <a-full-screen-btn />
    <RouterView />
  </div>
</template>
