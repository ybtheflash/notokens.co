<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, Lock, StickyNote } from 'lucide-vue-next'
import { adminAuth, type FounderProfile } from '@/services/adminAuth'
import { toast } from '@/composables/useToast'

const emit = defineEmits<{ authenticated: [profile: FounderProfile] }>()

const router = useRouter()
const password = ref('')
const isSubmitting = ref(false)

const submit = async () => {
  if (!password.value || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const profile = await adminAuth.login(password.value)
    toast.success(`Welcome, ${profile.display_name}`)
    emit('authenticated', profile)
    void router.replace('/admin')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Invalid password')
    password.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16 admin-shell">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="mx-auto w-14 h-14 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center mb-4"
        >
          <StickyNote class="w-6 h-6 text-amber-300" />
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Founder's Space</h1>
        <p class="mt-2 text-sm text-gray-500">
          Enter your password.
        </p>
      </div>

      <form
        class="rounded-2xl border border-white/10 bg-[#18181c] p-6 shadow-2xl space-y-4"
        @submit.prevent="submit"
      >
        <label class="block">
          <span class="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            <Lock class="w-3.5 h-3.5" />
            Password
          </span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            placeholder="••••••••••••"
            class="w-full px-3.5 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-600 outline-none focus:border-amber-300/40 transition-colors text-sm"
          />
        </label>

        <button
          type="submit"
          :disabled="isSubmitting || !password"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-300 text-[#17130a] text-sm font-bold hover:bg-amber-200 disabled:opacity-50 transition-colors"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          Unlock
        </button>

        <p class="text-[11px] text-gray-600 text-center leading-5">
          Your password, your space uwu.
        </p>
      </form>
    </div>
  </div>
</template>
