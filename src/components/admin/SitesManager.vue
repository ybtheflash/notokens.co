<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Copy, Globe, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-vue-next'
import { adminAuth } from '@/services/adminAuth'
import { toast } from '@/composables/useToast'

interface SiteRow {
  id: string
  site_key: string
  site_name: string
  api_key: string
  origins: string[]
  storage_ready: boolean
  created_at: string
}

const sites = ref<SiteRow[]>([])
const isLoading = ref(false)
const isSaving = ref(false)

const form = ref({
  site_key: '',
  site_name: '',
  origins: '',
})

function apiBase() {
  return (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/, '')
}

async function api(path: string, init?: RequestInit) {
  const token = adminAuth.getToken()
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''
  if (!token) {
    throw new Error('Please log in as a founder to manage sites.')
  }
  const res = await fetch(`${apiBase()}/functions/v1/notes-api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

const load = async () => {
  isLoading.value = true
  try {
    const data = await api('/sites')
    sites.value = data.sites || []
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to load sites')
  } finally {
    isLoading.value = false
  }
}

const createSite = async () => {
  if (!form.value.site_key.trim() || !form.value.site_name.trim()) {
    toast.error('Site key and name are required')
    return
  }
  isSaving.value = true
  try {
    await api('/sites', {
      method: 'POST',
      body: JSON.stringify({
        site_key: form.value.site_key.trim(),
        site_name: form.value.site_name.trim(),
        origins: form.value.origins,
      }),
    })
    toast.success('Site saved to database')
    form.value = { site_key: '', site_name: '', origins: '' }
    await load()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to create site')
  } finally {
    isSaving.value = false
  }
}

const saveOrigins = async (site: SiteRow) => {
  try {
    await api(`/sites/${site.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ origins: site.origins }),
    })
    toast.success(`Origins updated for ${site.site_name}`)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to update origins')
  }
}

const addOriginRow = (site: SiteRow) => {
  site.origins = [...(site.origins || []), '']
}

const removeOriginRow = (site: SiteRow, index: number) => {
  site.origins = site.origins.filter((_, i) => i !== index)
}

const deleteSite = async (site: SiteRow) => {
  if (!confirm(`Delete site ${site.site_name}? Notes stay, but API key stops working.`)) return
  try {
    await api(`/sites/${site.id}`, { method: 'DELETE' })
    toast.success('Site removed')
    await load()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to delete site')
  }
}

const copyKey = async (key: string) => {
  try {
    await navigator.clipboard.writeText(key)
    toast.success('API key copied')
  } catch {
    toast.error('Copy failed')
  }
}

const originsText = (site: SiteRow) => (site.origins || []).filter(Boolean).join(', ')

onMounted(() => void load())
</script>

<template>
  <section class="max-w-5xl mx-auto space-y-6">
    <div class="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
      <div class="flex items-center gap-3">
        <span
          class="w-9 h-9 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center"
        >
          <Globe class="w-4.5 h-4.5 text-sky-300" />
        </span>
        <div>
          <h3 class="text-base font-bold text-white">Sites &amp; API origins</h3>
          <p class="text-[11px] text-gray-500">
            Stored in the <span class="font-mono">sites</span> table. Both founders can edit.
          </p>
        </div>
      </div>
      <button
        type="button"
        class="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        title="Refresh"
        @click="load"
      >
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>

    <!-- Create site -->
    <form
      class="rounded-2xl border border-white/10 bg-[#18181c] p-5 space-y-3"
      @submit.prevent="createSite"
    >
      <h4 class="text-sm font-bold text-white">Add site</h4>
      <div class="grid sm:grid-cols-2 gap-3">
        <label class="block">
          <span class="text-[10px] font-mono uppercase tracking-wider text-gray-500">Site key</span>
          <input
            v-model="form.site_key"
            placeholder="otterspeak"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            class="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-white outline-none focus:border-amber-300/40"
          />
        </label>
        <label class="block">
          <span class="text-[10px] font-mono uppercase tracking-wider text-gray-500">Site name</span>
          <input
            v-model="form.site_name"
            placeholder="OtterSpeak"
            maxlength="48"
            class="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-white outline-none focus:border-amber-300/40"
          />
        </label>
      </div>
      <label class="block">
        <span class="text-[10px] font-mono uppercase tracking-wider text-gray-500">
          Allowed origins (comma-separated)
        </span>
        <input
          v-model="form.origins"
          placeholder="https://otterspeak.com, https://www.otterspeak.com"
          class="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-white outline-none focus:border-amber-300/40"
        />
      </label>
      <button
        type="submit"
        :disabled="isSaving"
        class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-300 text-[#17130a] text-xs font-bold hover:bg-amber-200 disabled:opacity-50 transition-colors"
      >
        <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
        <Plus v-else class="w-3.5 h-3.5" />
        Save site to database
      </button>
    </form>

    <!-- Sites list -->
    <div v-if="isLoading && !sites.length" class="flex justify-center py-10">
      <Loader2 class="w-5 h-5 text-amber-300 animate-spin" />
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="site in sites"
        :key="site.id"
        class="rounded-xl border border-white/10 bg-[#18181c] p-4 space-y-3"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-white">{{ site.site_name }}</h4>
              <span
                class="px-1.5 py-0.5 rounded border border-sky-400/20 bg-sky-400/[0.07] text-[9px] font-mono uppercase text-sky-300"
              >
                {{ site.site_key }}
              </span>
            </div>
            <div class="mt-2 flex items-center gap-2 text-[11px] font-mono text-gray-500">
              <span class="truncate max-w-[220px]">{{ site.api_key }}</span>
              <button
                type="button"
                class="p-1 rounded text-gray-500 hover:text-white"
                title="Copy API key"
                @click="copyKey(site.api_key)"
              >
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
            <p class="mt-1 text-[11px] text-gray-600 font-mono">
              dev-notes/{{ site.site_key }}/ ·
              {{ site.storage_ready ? 'folder ready' : 'folder on first write' }}
            </p>
          </div>
          <button
            type="button"
            class="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-white/5"
            title="Delete site"
            @click="deleteSite(site)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-mono uppercase tracking-wider text-gray-500">
              CORS origins
            </span>
            <button
              type="button"
              class="text-[11px] text-amber-300 hover:text-amber-200"
              @click="addOriginRow(site)"
            >
              + origin
            </button>
          </div>
          <div class="space-y-2">
            <div v-for="(_origin, index) in site.origins" :key="index" class="flex gap-2">
              <input
                v-model="site.origins[index]"
                placeholder="https://example.com"
                class="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-white outline-none focus:border-amber-300/40"
              />
              <button
                type="button"
                class="px-2 rounded-lg text-gray-500 hover:text-red-400"
                @click="removeOriginRow(site, index)"
              >
                ×
              </button>
            </div>
            <p v-if="!site.origins?.length" class="text-[11px] text-gray-600">
              No origins yet ({{ originsText(site) || '—' }})
            </p>
          </div>
          <button
            type="button"
            class="mt-3 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-semibold text-gray-300 hover:bg-white/5"
            @click="saveOrigins(site)"
          >
            Save origins
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
