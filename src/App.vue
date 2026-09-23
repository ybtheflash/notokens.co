<script setup lang="ts">
import ConfirmModal from './components/common/ConfirmModal.vue'
import ToastHost from './components/common/ToastHost.vue'
</script>

<template>
  <router-view />
  <ConfirmModal />
  <ToastHost />
</template>
