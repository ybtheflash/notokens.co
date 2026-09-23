<script setup lang="ts">
import { toastState } from '@/composables/useToast'
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[110] flex flex-col gap-2 pointer-events-none">
      <div
        v-for="item in toastState"
        :key="item.id"
        class="pointer-events-auto px-3.5 py-2.5 rounded-xl border text-xs font-semibold shadow-lg backdrop-blur"
        :class="
          item.kind === 'error'
            ? 'border-red-500/30 bg-red-950/80 text-red-200'
            : item.kind === 'success'
              ? 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200'
              : 'border-sky-500/30 bg-sky-950/80 text-sky-200'
        "
      >
        {{ item.message }}
      </div>
    </div>
  </Teleport>
</template>
