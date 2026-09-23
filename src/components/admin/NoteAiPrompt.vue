<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  Check,
  ChevronRight,
  Copy,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2,
  X,
} from 'lucide-vue-next'
import { toast } from '@/composables/useToast'
import {
  generateNoteAi,
  type NoteContext,
} from '@/services/aiNoteService'

const props = defineProps<{
  isOpen: boolean
  note: NoteContext
  selectedText?: string
  initialPrompt?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'insert', html: string, mode: 'cursor' | 'replace' | 'append'): void
}>()

const promptInput = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const generatedText = ref('')
const generatedHtml = ref('')
const errorMessage = ref('')
const hasCopied = ref(false)

const quickPrompts = [
  { label: 'Continue writing', prompt: 'Continue writing the next logical paragraphs based on the note context and tone.' },
  { label: 'Summarize note', prompt: 'Provide a concise, high-impact executive summary and key takeaways of this note.' },
  { label: 'Action items & checklist', prompt: 'Extract or generate a prioritized, actionable checklist / to-do items from this note.' },
  { label: 'Fix grammar & polish', prompt: 'Improve the clarity, grammar, structure, and readability of the note while preserving all technical details.' },
  { label: 'Brainstorm ideas', prompt: 'Brainstorm 5 creative, strategic ideas or solutions related to the goals discussed in this note.' },
]

const hasResult = computed(() => !!generatedHtml.value)

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      promptInput.value = props.initialPrompt || ''
      generatedText.value = ''
      generatedHtml.value = ''
      errorMessage.value = ''
      window.addEventListener('keydown', handleKeyDown)
      nextTick(() => {
        inputRef.value?.focus()
        if (props.initialPrompt) {
          void runGeneration(props.initialPrompt)
        }
      })
    } else {
      window.removeEventListener('keydown', handleKeyDown)
      generatedText.value = ''
      generatedHtml.value = ''
      errorMessage.value = ''
      promptInput.value = ''
    }
  },
)

const handleClose = () => {
  window.removeEventListener('keydown', handleKeyDown)
  generatedHtml.value = ''
  generatedText.value = ''
  errorMessage.value = ''
  promptInput.value = ''
  emit('close')
}

const runGeneration = async (instruction?: string) => {
  const query = (instruction || promptInput.value).trim()
  if (!query) {
    toast.error('Please enter an instruction for Gemini')
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  generatedHtml.value = ''
  generatedText.value = ''

  try {
    const res = await generateNoteAi({
      prompt: query,
      note: props.note,
      selectedText: props.selectedText,
    })

    generatedText.value = res.text
    generatedHtml.value = res.html
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'AI generation failed'
    errorMessage.value = msg
    toast.error(msg)
  } finally {
    isLoading.value = false
  }
}

const insertResult = (mode: 'cursor' | 'replace' | 'append' = 'cursor') => {
  if (!props.isOpen || !generatedHtml.value) return
  const html = generatedHtml.value
  handleClose()
  emit('insert', html, mode)
}

const copyResult = async () => {
  if (!generatedText.value) return
  try {
    await navigator.clipboard.writeText(generatedText.value)
    hasCopied.value = true
    setTimeout(() => {
      hasCopied.value = false
    }, 2000)
    toast.success('Copied to clipboard')
  } catch {
    toast.error('Failed to copy')
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isOpen) return

  if (e.key === 'Escape') {
    e.preventDefault()
    handleClose()
  } else if (e.key === 'Enter' && !e.shiftKey) {
    if (hasResult.value && !isLoading.value && document.activeElement !== inputRef.value) {
      e.preventDefault()
      insertResult('cursor')
    } else if (!hasResult.value && !isLoading.value) {
      e.preventDefault()
      void runGeneration()
    }
  }
}

onMounted(() => {
  if (props.isOpen) {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    @click.self="handleClose"
  >
    <div
      class="w-full max-w-2xl rounded-2xl bg-[#0f1117] border border-amber-300/30 shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col max-h-[85vh]"
    >
      <!-- Top Header Bar -->
      <div
        class="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border-b border-white/10"
      >
        <div class="flex items-center gap-2.5">
          <div class="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
            <Sparkles class="w-4 h-4" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-white">Gemini Flash AI</span>
              <span
                class="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30"
              >
                gemini-flash-latest
              </span>
            </div>
            <p class="text-[11px] text-gray-400">
              Full context active:
              <span class="text-gray-300 font-medium">"{{ note.title || 'Untitled Note' }}"</span>
              <span v-if="note.site_name" class="text-amber-400/80"> • {{ note.site_name }}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          title="Close (Esc)"
          class="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          @click="handleClose"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Prompt Input Form -->
      <div class="p-5 space-y-4">
        <div class="relative">
          <input
            ref="inputRef"
            v-model="promptInput"
            type="text"
            placeholder="What should Gemini do with this note? (e.g. summarize, continue, checklist...)"
            :disabled="isLoading"
            class="w-full px-4 py-3 pr-24 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-300/60 focus:ring-1 focus:ring-amber-300/30 transition-all disabled:opacity-60"
            @keydown.enter="runGeneration()"
          />
          <button
            type="button"
            :disabled="isLoading || !promptInput.trim()"
            class="absolute right-2 top-2 bottom-2 px-3 rounded-lg bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-amber-200 disabled:opacity-40 disabled:hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20"
            @click="runGeneration()"
          >
            <Loader2 v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
            <Wand2 v-else class="w-3.5 h-3.5" />
            <span>{{ hasResult ? 'Regenerate' : 'Generate' }}</span>
          </button>
        </div>

        <!-- Quick Prompts Chips -->
        <div v-if="!hasResult && !isLoading" class="space-y-1.5">
          <span class="text-[11px] font-mono uppercase tracking-wider text-gray-400">
            Quick Actions (/ai shortcuts)
          </span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="qp in quickPrompts"
              :key="qp.label"
              type="button"
              class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/10 border border-white/10 hover:border-amber-300/30 text-xs text-gray-300 hover:text-amber-200 transition-colors flex items-center gap-1"
              @click="runGeneration(qp.prompt)"
            >
              <span>{{ qp.label }}</span>
              <ChevronRight class="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>

        <!-- Selected Text Indicator -->
        <div
          v-if="selectedText"
          class="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 flex items-start gap-2"
        >
          <span class="text-amber-300 font-mono text-[10px] uppercase tracking-wider shrink-0 mt-0.5">
            Selection:
          </span>
          <span class="line-clamp-2 italic">"{{ selectedText }}"</span>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="py-8 flex flex-col items-center justify-center gap-3 text-center"
        >
          <div class="relative">
            <div
              class="w-10 h-10 rounded-full border-2 border-amber-300/20 border-t-amber-300 animate-spin"
            ></div>
            <Sparkles
              class="w-4 h-4 text-amber-300 absolute inset-0 m-auto animate-pulse"
            />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-white">Gemini Flash is thinking...</p>
            <p class="text-xs text-gray-400">
              Reading full note context: "{{ note.title || 'Untitled Note' }}"
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-else-if="errorMessage"
          class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1"
        >
          <p class="font-semibold">AI Assistant Error</p>
          <p class="text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- Generated Result View -->
        <div
          v-else-if="hasResult"
          class="space-y-3"
        >
          <div class="flex items-center justify-between text-xs text-gray-400">
            <span class="font-mono text-[10px] uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <Sparkles class="w-3 h-3" />
              Generated Response Preview
            </span>
            <button
              type="button"
              class="flex items-center gap-1 hover:text-white transition-colors"
              @click="copyResult"
            >
              <Check v-if="hasCopied" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ hasCopied ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>

          <div
            class="ai-preview-content p-4 rounded-xl bg-black/50 border border-white/10 text-gray-200 text-sm max-h-60 overflow-y-auto leading-relaxed space-y-2 select-text"
            v-html="generatedHtml"
          ></div>

          <!-- Bottom Action Buttons -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              @click="runGeneration()"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>Try again</span>
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                @click="handleClose"
              >
                Discard (Esc)
              </button>
              <button
                v-if="selectedText"
                type="button"
                class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                @click="insertResult('replace')"
              >
                Replace Selection
              </button>
              <button
                type="button"
                class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-300 text-black text-xs font-bold hover:bg-amber-200 shadow-md shadow-amber-500/20 transition-all"
                @click="insertResult('cursor')"
              >
                <Check class="w-3.5 h-3.5" />
                <span>Insert into Note (Enter)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-preview-content :deep(h2),
.ai-preview-content :deep(h3),
.ai-preview-content :deep(h4) {
  color: #fff;
  font-weight: 700;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
}
.ai-preview-content :deep(h2) { font-size: 1.15rem; }
.ai-preview-content :deep(h3) { font-size: 1.05rem; }
.ai-preview-content :deep(h4) { font-size: 0.95rem; }

.ai-preview-content :deep(p) {
  margin-bottom: 0.5rem;
}

.ai-preview-content :deep(ul),
.ai-preview-content :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
}

.ai-preview-content :deep(li) {
  list-style-type: disc;
  margin-bottom: 0.25rem;
}

.ai-preview-content :deep(strong) {
  color: #fef3c7;
  font-weight: 600;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>
