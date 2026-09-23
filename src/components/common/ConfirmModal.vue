<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'

const { state, handleConfirm, handleCancel } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="state.isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="handleCancel"></div>
      <div
        class="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#11151d] shadow-2xl p-5"
        :class="
          state.type === 'danger'
            ? 'border-red-500/25'
            : state.type === 'warning'
              ? 'border-orange-500/25'
              : 'border-sky-500/25'
        "
      >
        <h3 class="text-base font-bold text-white">{{ state.title }}</h3>
        <p class="mt-2 text-sm leading-6 text-gray-400">{{ state.message }}</p>
        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="px-3.5 py-2 rounded-lg border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition-colors"
            @click="handleCancel"
          >
            {{ state.cancelText }}
          </button>
          <button
            type="button"
            class="px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
            :class="
              state.type === 'danger'
                ? 'bg-red-500/90 text-white hover:bg-red-500'
                : state.type === 'warning'
                  ? 'bg-orange-400 text-[#1a1205] hover:bg-orange-300'
                  : 'bg-sky-400 text-[#0b1220] hover:bg-sky-300'
            "
            @click="handleConfirm"
          >
            {{ state.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
