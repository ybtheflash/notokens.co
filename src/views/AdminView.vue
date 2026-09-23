<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, Globe, LogOut, StickyNote, Terminal } from 'lucide-vue-next'
import AdminNotes from '@/components/admin/AdminNotes.vue'
import AdminLogin from '@/components/admin/AdminLogin.vue'
import AvatarUploader from '@/components/admin/AvatarUploader.vue'
import SitesManager from '@/components/admin/SitesManager.vue'
import { adminAuth, resolveAvatarUrl, type FounderProfile } from '@/services/adminAuth'
import { supabase } from '@/services/supabaseService'

const router = useRouter()
const profile = ref<FounderProfile | null>(null)
const ready = ref(false)
const currentSection = ref<'dashboard' | 'notes' | 'sites'>('dashboard')
const notesRefreshKey = ref(0)

interface LatestAdminNote {
  id: string
  title: string
  content: string
  author_key: 'justysss' | 'ybtheflash'
  author_name: string
  site_key: string
  site_name: string
  priority: 'red' | 'orange' | 'green'
  updated_at: string
}

const latestAdminNote = ref<LatestAdminNote | null>(null)
const headerAvatar = ref('')

const noteAuthors = {
  justysss: {
    label: 'Justysss',
    avatar: 'https://github.com/justysssss.png',
  },
  ybtheflash: {
    label: 'YBTHEFLASH',
    avatar: 'https://github.com/ybtheflash.png',
  },
} as const

const latestNoteAuthor = computed(() =>
  latestAdminNote.value ? noteAuthors[latestAdminNote.value.author_key] : noteAuthors.justysss,
)

const latestNotePreview = computed(() =>
  (latestAdminNote.value?.content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim(),
)

const latestNotePriorityClass = computed(
  () =>
    ({
      red: 'bg-red-400',
      orange: 'bg-orange-400',
      green: 'bg-emerald-400',
    })[latestAdminNote.value?.priority || 'green'],
)

const fetchLatestAdminNote = async () => {
  const { data, error } = await supabase
    .from('admin_notes')
    .select(
      'id, title, content, author_key, author_name, site_key, site_name, priority, updated_at',
    )
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!error) latestAdminNote.value = data as LatestAdminNote | null
}

const onAuthenticated = async (p: FounderProfile) => {
  profile.value = p
  headerAvatar.value = await resolveAvatarUrl(p.avatar_url) || `https://github.com/${p.username}.png`
  void fetchLatestAdminNote()
}

const onProfileUpdated = async (p: FounderProfile) => {
  profile.value = p
  headerAvatar.value = await resolveAvatarUrl(p.avatar_url) || `https://github.com/${p.username}.png`
}

const logout = () => {
  adminAuth.logout()
  profile.value = null
  currentSection.value = 'dashboard'
  void router.replace('/admin')
}

const openSection = (section: 'notes' | 'sites') => {
  currentSection.value = section
}

const backToWorkspace = () => {
  currentSection.value = 'dashboard'
  notesRefreshKey.value += 1
  void fetchLatestAdminNote()
}

onMounted(async () => {
  const restored = await adminAuth.restore()
  if (restored) {
    profile.value = restored
    headerAvatar.value =
      (await resolveAvatarUrl(restored.avatar_url)) ||
      `https://github.com/${restored.username}.png`
    void fetchLatestAdminNote()
  } else {
    profile.value = null
  }
  ready.value = true
})
</script>

<template>
  <div class="admin-shell min-h-screen">
    <AdminLogin v-if="ready && !profile" @authenticated="onAuthenticated" />

    <div v-else-if="profile">
      <header class="border-b border-white/[0.07] bg-black/20 backdrop-blur sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <button
              v-if="currentSection !== 'dashboard'"
              type="button"
              class="text-[11px] font-mono uppercase tracking-wider text-gray-500 hover:text-amber-300 transition-colors"
              @click="backToWorkspace"
            >
              ← Workspace
            </button>
            <div
              v-else
              class="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-amber-300"
            >
              <Terminal class="w-3.5 h-3.5" />
              Workspace
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full overflow-hidden ring-2 ring-white/10 bg-black/30">
                <img
                  :src="headerAvatar || `https://github.com/${profile.username}.png`"
                  :alt="profile.display_name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="hidden sm:block leading-tight">
                <div class="text-xs font-bold text-white">{{ profile.display_name }}</div>
                <div class="text-[10px] text-gray-500 font-mono">{{ profile.username }}</div>
              </div>
            </div>
            <button
              type="button"
              class="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Sign out"
              @click="logout"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-6xl mx-auto px-4 py-8">
        <div v-if="currentSection === 'dashboard'" class="space-y-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p class="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                NoTokens control
              </p>
              <h1 class="mt-2 text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Workspace<span class="text-amber-300 terminal-dot">.</span>
              </h1>
              <p class="mt-2 text-sm text-gray-400 max-w-xl">
                Private founder ops hub. Open a module to get work done — everything here is shared
                between Justysss and YBTHEFLASH.
              </p>
            </div>
            <AvatarUploader :profile="profile" @updated="onProfileUpdated" />
          </div>

          <button
            v-if="latestAdminNote"
            type="button"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-300/[0.045] border border-amber-300/15 hover:border-amber-300/30 hover:bg-amber-300/[0.07] text-left transition-all group"
            @click="openSection('notes')"
          >
            <img
              :src="latestNoteAuthor.avatar"
              :alt="latestNoteAuthor.label"
              class="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 shrink-0"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">
                  {{ latestNoteAuthor.label }} left a note for you
                </span>
                <span
                  class="px-1.5 py-0.5 rounded border border-sky-400/20 bg-sky-400/[0.07] text-[8px] font-mono uppercase tracking-wider text-sky-300"
                >
                  {{ latestAdminNote.site_name || 'NoTokens' }}
                </span>
                <span class="w-1.5 h-1.5 rounded-full" :class="latestNotePriorityClass"></span>
                <span class="text-[9px] font-mono uppercase text-gray-500">
                  {{ latestAdminNote.priority }}
                </span>
              </div>
              <p class="mt-0.5 text-[11px] text-gray-400 truncate">
                <span class="font-semibold text-gray-300">
                  {{ latestAdminNote.title || 'Untitled note' }}
                </span>
                <span v-if="latestNotePreview"> — {{ latestNotePreview }}</span>
              </p>
            </div>
            <ChevronRight
              class="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0"
            />
          </button>

          <section>
            <h2 class="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-3">
              Modules
            </h2>
            <div class="space-y-3">
              <button
                type="button"
                class="founder-notes-hero w-full text-left rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.08] via-white/[0.02] to-transparent hover:border-amber-300/40 hover:from-amber-300/[0.12] transition-all group relative overflow-hidden"
                @click="openSection('notes')"
              >
                <div class="absolute inset-0 abyss-hint opacity-40 pointer-events-none"></div>
                <div class="relative px-6 py-8 sm:px-8 sm:py-10 flex items-center gap-5 sm:gap-7">
                  <div
                    class="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-300/15 border border-amber-300/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                  >
                    <StickyNote class="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span
                        class="px-1.5 py-0.5 rounded border border-amber-300/30 bg-amber-300/10 text-[9px] font-mono uppercase tracking-wider text-amber-200"
                      >
                        Pinned
                      </span>
                    </div>
                    <h3
                      class="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors"
                    >
                      Founder Notes
                    </h3>
                    <p class="mt-1.5 text-sm text-gray-400 max-w-lg">
                      Shared autosaving notes for the founding team. Multi-site notebook with pins,
                      priorities, and attachments — powered by the dev-notes backend.
                    </p>
                    <p class="mt-3 text-[11px] font-mono text-gray-600">
                      workspace / founder-notes
                    </p>
                  </div>
                  <ChevronRight
                    class="w-6 h-6 sm:w-7 sm:h-7 text-amber-300/70 group-hover:translate-x-1.5 group-hover:text-amber-300 transition-all shrink-0"
                  />
                </div>
              </button>

              <button
                type="button"
                class="w-full text-left rounded-2xl border border-white/10 bg-white/[0.02] hover:border-sky-400/30 hover:bg-sky-400/[0.04] transition-all group px-5 py-5 flex items-center gap-4"
                @click="openSection('sites')"
              >
                <div
                  class="shrink-0 w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center"
                >
                  <Globe class="w-6 h-6 text-sky-300" />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="text-lg font-bold text-white">Sites &amp; API</h3>
                  <p class="mt-0.5 text-xs text-gray-500">
                    Register sibling sites, store CORS origins in the database, manage API keys.
                  </p>
                </div>
                <ChevronRight
                  class="w-5 h-5 text-gray-600 group-hover:text-sky-300 group-hover:translate-x-1 transition-all shrink-0"
                />
              </button>
            </div>
          </section>
        </div>

        <div v-else-if="currentSection === 'notes'">
          <AdminNotes :refresh-key="notesRefreshKey" @changed="fetchLatestAdminNote" />
        </div>

        <div v-else-if="currentSection === 'sites'">
          <SitesManager />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.terminal-dot {
  animation: terminalBlink 1.1s steps(2, start) infinite;
}

@keyframes terminalBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.abyss-hint {
  background: radial-gradient(
    ellipse 60% 80% at 100% 100%,
    rgba(249, 115, 22, 0.18) 0%,
    rgba(249, 115, 22, 0.06) 45%,
    transparent 75%
  );
}
</style>
