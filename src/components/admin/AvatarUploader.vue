<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Camera, Loader2 } from 'lucide-vue-next'
import {
  adminAuth,
  convertToWebp,
  resolveAvatarUrl,
  uploadAvatar,
  type FounderProfile,
} from '@/services/adminAuth'
import { toast } from '@/composables/useToast'

const props = defineProps<{ profile: FounderProfile }>()
const emit = defineEmits<{ updated: [profile: FounderProfile] }>()

const displayUrl = ref('')
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const refreshAvatar = async () => {
  displayUrl.value = await resolveAvatarUrl(props.profile.avatar_url)
}

const onPick = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.error('Choose an image file')
    return
  }
  isUploading.value = true
  try {
    await convertToWebp(file) // validate convert works before upload
    const { avatar_url, signed_url } = await uploadAvatar(file)
    const profile = await adminAuth.updateProfile({ avatar_url })
    displayUrl.value = signed_url || (await resolveAvatarUrl(avatar_url))
    emit('updated', profile)
    toast.success('Avatar saved to dev-notes as WebP')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Avatar upload failed')
  } finally {
    isUploading.value = false
  }
}

onMounted(() => void refreshAvatar())
</script>

<template>
  <div class="flex items-center gap-4">
    <button
      type="button"
      class="relative group/avatar w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black/30"
      title="Upload avatar"
      @click="fileInput?.click()"
    >
      <img
        v-if="displayUrl"
        :src="displayUrl"
        :alt="props.profile.display_name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
        <Camera class="w-5 h-5" />
      </div>
      <span
        class="absolute inset-0 bg-black/55 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"
      >
        <Loader2 v-if="isUploading" class="w-5 h-5 text-amber-300 animate-spin" />
        <Camera v-else class="w-5 h-5 text-white" />
      </span>
    </button>
    <div class="min-w-0">
      <div class="text-sm font-bold text-white">{{ props.profile.display_name }}</div>
      <p class="text-[11px] text-gray-500 mt-0.5">
        Avatar stored in <span class="font-mono text-gray-400">dev-notes/avatars/</span> as WebP
      </p>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp,image/gif"
      class="hidden"
      @change="onPick"
    />
  </div>
</template>
