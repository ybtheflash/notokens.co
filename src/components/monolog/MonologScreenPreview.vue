<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Mic,
  Search,
  Zap,
  Shield,
  Lock,
  Clock,
  Bell,
  BookOpen,
  Plus,
  Layers,
  Calendar,
  ChevronDown,
  EyeOff,
  FileText,
  Play,
  Smile,
  CheckCircle2,
} from 'lucide-vue-next'
import { KEYBOARD_THEMES, type KeyboardThemeId } from '@/data/monologData'

export type ScreenPreviewMode = 'dual' | 'vox' | 'ai' | 'ink' | 'privacy' | 'shortcuts' | 'flow'

const props = withDefaults(
  defineProps<{
    mode: ScreenPreviewMode
    variant?: string
    compact?: boolean
  }>(),
  {
    variant: 'default',
    compact: false,
  }
)

const keyBorders = ref(false)
const dualBorders = ref(false)
const dualDraft = ref("let's meet at the library at 5 pm")

// Keyboard (ink / 6-theme) interactive state
const selectedTheme = ref<KeyboardThemeId>('ink')
const kbLayout = ref<'full' | 'left' | 'right'>('full')
const kbDraft = ref('Type across all 6 Monolog themes.')

// Vox interactive state
const voxTheme = ref<KeyboardThemeId>('paper')
const smartFilter = ref(true)
const voxLangIdx = ref(0)
const voxLanguages = ['English', 'English (India)', 'Hindi', 'Spanish']
const voxIsPlaying = ref(false)
const voxTypedWords = ref<string[]>([])
const voxInserted = ref('')
let voxTimer: number | null = null

const voxRawWords = ['I’ll', 'take', 'the,', 'uh,', 'bus', 'and', 'be', 'there', 'by', 'four.']
const voxCleanWords = ['I’ll', 'take', 'the', 'bus', 'and', 'be', 'there', 'by', 'four.']

const voxDisplaySentence = computed(() => {
  if (voxIsPlaying.value) return voxTypedWords.value.join(' ') || 'Listening…'
  return smartFilter.value ? voxCleanWords.join(' ') : voxRawWords.join(' ')
})

const startVoxDemo = () => {
  if (voxTimer) clearInterval(voxTimer)
  const target = smartFilter.value ? voxCleanWords : voxRawWords
  voxIsPlaying.value = true
  voxTypedWords.value = []
  let idx = 0
  voxTimer = window.setInterval(() => {
    idx += 1
    voxTypedWords.value = target.slice(0, idx)
    if (idx >= target.length) {
      if (voxTimer) clearInterval(voxTimer)
      voxIsPlaying.value = false
    }
  }, 150)
}

// AI Ask interactive state
const aiTheme = ref<KeyboardThemeId>('paper')
const aiPersonal = ref(true)
const aiWeb = ref(false)
const aiSelectedSample = ref<'hike' | 'library' | 'coffee'>('hike')
const aiInsertedNotice = ref<string | null>(null)

const aiSampleMap = {
  hike: {
    label: 'Hike essentials?',
    query: 'What should we bring for the hike?',
    answer: 'Water, a light layer, a charged phone, a small first-aid kit. And snacks.',
    source: 'Sample answer · Product preview',
  },
  library: {
    label: 'Study room?',
    query: 'When does the study room close?',
    answer: 'The study room closes at 8:00 PM. Last entry is at 7:30 PM.',
    source: 'Riverside Library hours',
  },
  coffee: {
    label: 'Coffee with Sam?',
    query: 'Coffee with Sam',
    answer: 'Coffee with Sam is in the sample journal entry for 15 November.',
    source: 'Sample journal · 15 November',
  },
}

const currentAiSample = computed(() => aiSampleMap[aiSelectedSample.value])

// Privacy screen interactive state
const privacyStateView = ref<'protected' | 'manual' | 'off'>('protected')

// Shortcuts interactive state
const activeShortcutCard = ref<'menu' | 'Reminder' | 'Alarm' | 'Note'>('menu')
const reminderDraft = ref('Exam at 5 PM today')
const reminderConfirmed = ref(false)

// Flow (Journal / Library / Recap) interactive state
const activeRecapHighlights = ref<string[]>(['Rehearsal 3:30 PM', 'Demo Bay B', 'Coffee with Sam', 'Art walk'])
const toggleRecapHighlight = (item: string) => {
  if (activeRecapHighlights.value.includes(item)) {
    activeRecapHighlights.value = activeRecapHighlights.value.filter((x) => x !== item)
  } else {
    activeRecapHighlights.value = [...activeRecapHighlights.value, item]
  }
}

watch(
  () => [props.mode, props.variant],
  ([newMode, newVar]) => {
    if (newMode === 'ai') {
      aiTheme.value = newVar === 'ink' ? 'ink' : 'paper'
    }
    if (newMode === 'ink') {
      selectedTheme.value = newVar === 'paper' ? 'paper' : 'ink'
    }
    if (newMode === 'shortcuts') {
      activeShortcutCard.value = 'menu'
      reminderConfirmed.value = false
    }
  },
  { immediate: true }
)

const keyRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

const tapDualKey = (ch: string) => {
  dualDraft.value += ch
}

const tapKbKey = (ch: string) => {
  kbDraft.value += ch
}
</script>

<template>
  <div class="lsp-root" :class="{ 'is-compact': compact }">
    <!-- 1. PAPER & INK DUAL SYSTEM -->
    <div v-if="mode === 'dual'" class="dual-stage">
      <div class="stage-bar">
        <span class="stage-chip font-mono">Shared borderless QWERTY · Tap keys in either phone</span>
        <button class="stage-btn" @click="dualBorders = !dualBorders">
          Key borders: {{ dualBorders ? 'On' : 'Off' }}
        </button>
      </div>

      <div class="dual-phones-grid" :class="{ 'compact-dual': compact }">
        <div
          v-for="themeVariant in (['paper', 'ink'] as const)"
          :key="themeVariant"
          class="mini-phone"
          :data-theme="themeVariant"
          :data-borders="String(dualBorders)"
        >
          <div class="mp-status">
            <span>Monolog Keyboard</span>
            <span>{{ themeVariant === 'paper' ? 'Paper' : 'Ink AMOLED' }}</span>
          </div>

          <div class="mp-chat">
            <div class="mp-bubble recv">Did you confirm Hall 2?</div>
            <div class="mp-draft-pill">{{ dualDraft || 'Type something…' }}</div>
          </div>

          <div class="mp-kb-surface">
            <div class="mp-toolbar">
              <span class="mp-dots">•••</span>
              <span class="mp-pill">Rewrite · Set 5 PM reminder</span>
              <Mic :size="12" />
              <span class="mp-m-badge"><img src="/monolog/images/monolog-icon.png" alt="m" /></span>
            </div>

            <div class="mp-rows">
              <div class="mp-row">
                <button v-for="k in keyRows[0]" :key="k" class="mp-key" @click="tapDualKey(k)">{{ k }}</button>
              </div>
              <div class="mp-row mid">
                <button v-for="k in keyRows[1]" :key="k" class="mp-key" @click="tapDualKey(k)">{{ k }}</button>
              </div>
              <div class="mp-row">
                <span class="mp-key mod">↑</span>
                <button v-for="k in keyRows[2]" :key="k" class="mp-key" @click="tapDualKey(k)">{{ k }}</button>
                <button class="mp-key mod" @click="dualDraft = dualDraft.slice(0, -1)">⌫</button>
              </div>
              <div class="mp-row">
                <span class="mp-key mod-wide">?123</span>
                <button class="mp-key space" @click="tapDualKey(' ')">
                  <span>English</span>
                  <Zap :size="10" />
                </button>
                <span class="mp-key mod">.</span>
                <button class="mp-key enter" @click="dualDraft = 'Ready in Demo Bay B.'">↵</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. VOX VOICE MODE -->
    <div v-else-if="mode === 'vox'" class="single-stage">
      <div class="stage-bar">
        <button class="stage-btn" @click="voxTheme = voxTheme === 'paper' ? 'ink' : 'paper'">
          Theme: {{ voxTheme === 'paper' ? 'Paper' : 'Ink' }}
        </button>
        <button class="stage-btn" :class="{ active: smartFilter }" @click="smartFilter = !smartFilter">
          Smart Filter: {{ smartFilter ? 'On' : 'Off' }}
        </button>
        <button class="stage-btn accent" @click="startVoxDemo">
          <Play :size="11" />
          <span>{{ voxIsPlaying ? 'Dictating…' : 'Play dictation' }}</span>
        </button>
      </div>

      <div class="mini-phone focused-phone" :data-theme="voxTheme" data-borders="false">
        <div class="mp-status">
          <span>VOX Voice</span>
          <span>{{ voxTheme }}</span>
        </div>

        <div class="mp-chat-head">
          <span class="mp-avatar">S</span>
          <div>
            <strong>Sam</strong>
            <small>Messages · Live Voice Preview</small>
          </div>
        </div>

        <div class="mp-chat">
          <div class="mp-bubble recv">Are you still on the bus?</div>
          <div v-if="voxInserted" class="mp-bubble sent">{{ voxInserted }}</div>
          <div class="mp-draft-pill">Draft: {{ voxInserted || 'Hold mic to speak…' }}</div>
        </div>

        <div class="mp-vox-dock">
          <div class="vox-top-row">
            <span class="vox-word"><Mic :size="12" /> VOX</span>
            <span class="vox-status-tag">{{ voxIsPlaying ? 'Listening…' : 'Pause-tolerant · Clean' }}</span>
          </div>

          <div class="vox-bars" :class="{ animating: voxIsPlaying }">
            <span v-for="n in 18" :key="n" class="v-bar" :style="{ '--i': n }"></span>
          </div>

          <p class="vox-quote">“{{ voxDisplaySentence }}”</p>
          <small class="vox-sub">
            {{ smartFilter ? 'Fillers (“uh”) removed · Punctuation added' : 'Raw speech · Smart Filter paused' }}
          </small>

          <div class="vox-btn-row">
            <button
              class="vox-pill"
              @click="voxLangIdx = (voxLangIdx + 1) % voxLanguages.length"
            >
              {{ voxLanguages[voxLangIdx] }} ⌄
            </button>
            <button class="vox-pill" @click="smartFilter = !smartFilter">
              Filter {{ smartFilter ? 'On' : 'Off' }}
            </button>
            <button
              class="vox-done-btn"
              @click="voxInserted = smartFilter ? voxCleanWords.join(' ') : voxRawWords.join(' ')"
            >
              Insert transcript
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. FLOATING AI ASK PANEL -->
    <div v-else-if="mode === 'ai'" class="single-stage">
      <div class="stage-bar">
        <button class="stage-btn" @click="aiTheme = aiTheme === 'paper' ? 'ink' : 'paper'">
          Theme: {{ aiTheme === 'paper' ? 'Paper' : 'Ink AMOLED' }}
        </button>
        <button class="stage-btn" :class="{ active: aiPersonal }" @click="aiPersonal = !aiPersonal">
          Personal
        </button>
        <button class="stage-btn" :class="{ active: aiWeb }" @click="aiWeb = !aiWeb">
          {{ aiWeb ? 'Web: Wikipedia' : 'Web: Off' }}
        </button>
      </div>

      <div class="mini-phone focused-phone" :data-theme="aiTheme" data-borders="false">
        <div class="mp-status">
          <span>AI Ask</span>
          <span>{{ aiTheme === 'ink' ? 'Ink AMOLED' : 'Paper' }}</span>
        </div>

        <div class="mp-chat-head">
          <span class="mp-avatar">S</span>
          <div>
            <strong>Sam</strong>
            <small>WhatsApp · Chat stays open</small>
          </div>
        </div>

        <div class="mp-chat">
          <div class="mp-bubble recv">Did they announce check-in hours?</div>
          <div v-if="aiInsertedNotice" class="mp-bubble sent">{{ aiInsertedNotice }}</div>
        </div>

        <!-- Floating AI Ask Card -->
        <div class="ai-float-card">
          <div class="ai-head">
            <span class="ai-brand"><Zap :size="12" /> AI Ask</span>
            <span class="ai-source-badge">{{ aiWeb ? 'Personal + Web' : 'Personal · Offline' }}</span>
          </div>

          <div class="ai-query-pill">
            <Search :size="12" />
            <span>{{ currentAiSample.query }}</span>
          </div>

          <div class="ai-chips-strip">
            <button
              v-for="(val, key) in aiSampleMap"
              :key="key"
              class="ai-q-chip"
              :class="{ on: aiSelectedSample === key }"
              @click="aiSelectedSample = key"
            >
              {{ val.label }}
            </button>
          </div>

          <div class="ai-answer-box">
            <p>{{ currentAiSample.answer }}</p>
            <div class="ai-foot">
              <small>{{ currentAiSample.source }}</small>
              <button class="ai-insert" @click="aiInsertedNotice = currentAiSample.answer">Insert answer</button>
            </div>
          </div>
        </div>

        <!-- Compact Keyboard Base -->
        <div class="mp-kb-surface">
          <div class="mp-rows compact">
            <div class="mp-row">
              <button v-for="k in keyRows[0]" :key="k" class="mp-key">{{ k }}</button>
            </div>
            <div class="mp-row">
              <span class="mp-key mod-wide">?123</span>
              <span class="mp-key space active-ai"><Zap :size="10" /> AI Ask</span>
              <span class="mp-key mod">.</span>
              <span class="mp-key enter">↵</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. 6-THEME INK / EVERYDAY KEYBOARD -->
    <div v-else-if="mode === 'ink'" class="single-stage">
      <div class="stage-bar">
        <button
          v-for="t in KEYBOARD_THEMES"
          :key="t.id"
          class="stage-btn"
          :class="{ active: selectedTheme === t.id }"
          @click="selectedTheme = t.id"
        >
          {{ t.label }}
        </button>
        <button class="stage-btn" :class="{ active: keyBorders }" @click="keyBorders = !keyBorders">
          Borders: {{ keyBorders ? 'On' : 'Off' }}
        </button>
        <button
          class="stage-btn"
          @click="kbLayout = kbLayout === 'full' ? 'left' : kbLayout === 'left' ? 'right' : 'full'"
        >
          Handed: {{ kbLayout }}
        </button>
      </div>

      <div
        class="mini-phone focused-phone"
        :data-theme="selectedTheme"
        :data-borders="String(keyBorders)"
        :data-layout="kbLayout"
      >
        <div class="mp-status">
          <span>Theme</span>
          <span>{{ selectedTheme }}</span>
        </div>

        <div class="mp-chat-head">
          <span class="mp-avatar">M</span>
          <div>
            <strong>Notes · Quick Draft</strong>
            <small>One-handed · Clipboard · 6 themes</small>
          </div>
        </div>

        <div class="mp-chat">
          <div class="mp-draft-box">{{ kbDraft }}</div>
          <div class="mp-clip-strip">
            <span>Clipboard (1h):</span>
            <button class="clip-chip" @click="kbDraft = 'Demo Bay B · 4:00 PM'">Demo Bay B · 4:00 PM</button>
            <button class="clip-chip" @click="kbDraft = ''">Clear</button>
          </div>
        </div>

        <div class="mp-kb-surface">
          <div class="mp-toolbar">
            <ChevronDown :size="13" />
            <span class="mp-pill">Polish · Shorten · Friendly</span>
            <Mic :size="12" />
            <span class="mp-m-badge"><img src="/monolog/images/monolog-icon.png" alt="m" /></span>
          </div>
          <div class="mp-rows" :class="kbLayout">
            <div class="mp-row">
              <button v-for="k in keyRows[0]" :key="k" class="mp-key" @click="tapKbKey(k)">{{ k }}</button>
            </div>
            <div class="mp-row mid">
              <button v-for="k in keyRows[1]" :key="k" class="mp-key" @click="tapKbKey(k)">{{ k }}</button>
            </div>
            <div class="mp-row">
              <span class="mp-key mod">↑</span>
              <button v-for="k in keyRows[2]" :key="k" class="mp-key" @click="tapKbKey(k)">{{ k }}</button>
              <button class="mp-key mod" @click="kbDraft = kbDraft.slice(0, -1)">⌫</button>
            </div>
            <div class="mp-row">
              <span class="mp-key mod-wide">?123</span>
              <span class="mp-key mod"><Smile :size="11" /></span>
              <button class="mp-key space" @click="tapKbKey(' ')">English <Zap :size="10" /></button>
              <span class="mp-key mod">.</span>
              <span class="mp-key enter">↵</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. PROTECTED FIELD · BANKING & PRIVACY STATES -->
    <div v-else-if="mode === 'privacy'" class="single-stage">
      <div class="stage-bar">
        <button
          class="stage-btn"
          :class="{ active: privacyStateView === 'protected' }"
          @click="privacyStateView = 'protected'"
        >
          Protected Field · Pine Bank
        </button>
        <button
          class="stage-btn"
          :class="{ active: privacyStateView === 'manual' }"
          @click="privacyStateView = 'manual'"
        >
          Manual Incognito · 15:00
        </button>
        <button
          class="stage-btn"
          :class="{ active: privacyStateView === 'off' }"
          @click="privacyStateView = 'off'"
        >
          Memory Off
        </button>
      </div>

      <div class="mini-phone focused-phone" data-theme="ink" data-borders="false">
        <div class="mp-status">
          <span>Privacy State</span>
          <span>{{ privacyStateView === 'protected' ? 'Pine Bank' : privacyStateView === 'manual' ? 'Incognito' : 'Memory Off' }}</span>
        </div>

        <div v-if="privacyStateView === 'protected'" class="mp-bank-screen">
          <div class="bank-top">
            <Lock :size="13" />
            <strong>Everyday / Pine Bank</strong>
          </div>
          <h4>Sign in securely</h4>
          <div class="bank-box">
            <small>Customer ID</small>
            <div class="bank-input font-mono">•••• 4821</div>
          </div>
          <div class="bank-box focused">
            <small>Password (typePassword)</small>
            <div class="bank-input font-mono">
              <span>••••••••••••</span>
              <EyeOff :size="12" />
            </div>
          </div>
          <span class="bank-auto-tag"><Shield :size="11" /> Auto-detected · Cannot expire while field is active</span>
        </div>

        <div v-else-if="privacyStateView === 'manual'" class="mp-chat">
          <div class="mp-chat-head">
            <span class="mp-avatar">N</span>
            <div>
              <strong>Private Note</strong>
              <small>Hold period key · Paused 15m</small>
            </div>
          </div>
          <div class="mp-draft-box">Keep this draft between us. Nothing logged to Room DB.</div>
        </div>

        <div v-else class="mp-chat">
          <div class="mp-chat-head">
            <span class="mp-avatar">S</span>
            <div>
              <strong>Messages · Sam</strong>
              <small>Baseline IME · Memory toggle Off</small>
            </div>
          </div>
          <div class="mp-draft-box">Zero drafts or voice saved when Memory is Off in Settings.</div>
        </div>

        <div class="mp-kb-surface">
          <div v-if="privacyStateView !== 'off'" class="mp-incognito-banner">
            <span>
              {{ privacyStateView === 'protected' ? 'Incognito is on · Memory paused for this field' : 'Manual incognito · Nothing saved' }}
            </span>
            <strong class="font-mono">{{ privacyStateView === 'protected' ? 'Automatic' : '14:58' }}</strong>
          </div>

          <div class="mp-toolbar">
            <ChevronDown :size="13" />
            <span class="mp-pill muted">
              <Lock :size="10" />
              {{ privacyStateView === 'off' ? 'Memory Off · Settings' : 'Memory paused · Protected' }}
            </span>
            <span class="mp-m-badge locked">
              <img src="/monolog/images/monolog-icon.png" alt="m" />
              <Lock :size="8" class="m-lock-pin" />
            </span>
          </div>

          <div class="mp-rows">
            <div class="mp-row">
              <span v-for="k in keyRows[0]" :key="k" class="mp-key">{{ k }}</span>
            </div>
            <div class="mp-row mid">
              <span v-for="k in keyRows[1]" :key="k" class="mp-key">{{ k }}</span>
            </div>
            <div class="mp-row">
              <span class="mp-key mod-wide">?123</span>
              <span class="mp-key space">English</span>
              <span class="mp-key mod incognito-glow">.</span>
              <span class="mp-key enter">↵</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. M KEY QUICK SHORTCUTS & INLINE REMINDERS -->
    <div v-else-if="mode === 'shortcuts'" class="dual-stage">
      <div
        class="dual-phones-grid"
        :class="{ 'single-col': compact }"
      >
        <!-- Screen 01: Quick Shortcuts Popup -->
        <div
          v-if="!compact || variant !== 'reminder'"
          class="mini-phone"
          data-theme="paper"
          data-borders="false"
        >
          <div class="mp-status">
            <span>Quick Shortcuts</span>
            <span>Hold m key</span>
          </div>

          <div class="mp-chat">
            <div class="sc-popup-box">
              <div class="sc-pop-head">
                <strong>Quick shortcuts</strong>
                <span class="sc-pop-tag">Tap to preview</span>
              </div>
              <div class="sc-pop-grid">
                <button
                  class="sc-pop-tile"
                  :class="{ active: activeShortcutCard === 'Reminder' }"
                  @click="activeShortcutCard = 'Reminder'"
                >
                  <Clock :size="14" />
                  <span>Reminder</span>
                </button>
                <button
                  class="sc-pop-tile"
                  :class="{ active: activeShortcutCard === 'Alarm' }"
                  @click="activeShortcutCard = 'Alarm'"
                >
                  <Bell :size="14" />
                  <span>Alarm</span>
                </button>
                <button
                  class="sc-pop-tile"
                  @click="activeShortcutCard = 'menu'"
                >
                  <BookOpen :size="14" />
                  <span>Journal</span>
                </button>
                <button
                  class="sc-pop-tile"
                  :class="{ active: activeShortcutCard === 'Note' }"
                  @click="activeShortcutCard = 'Note'"
                >
                  <Plus :size="14" />
                  <span>Save note</span>
                </button>
              </div>
              <div class="sc-preview-strip">
                <span v-if="activeShortcutCard === 'Reminder'">Reminder review: Rehearse pitch · Today 3:30 PM</span>
                <span v-else-if="activeShortcutCard === 'Alarm'">Alarm review: Leave for campus · 2:45 PM</span>
                <span v-else-if="activeShortcutCard === 'Note'">Quick note composer ready · Saves locally to Library</span>
                <span v-else>Journal opens Monolog · All actions confirm first</span>
              </div>
            </div>
          </div>

          <div class="mp-kb-surface">
            <div class="mp-toolbar">
              <span class="mp-dots">•••</span>
              <span class="mp-pill">Ask · Rewrite</span>
              <Mic :size="12" />
              <span class="mp-m-badge active"><img src="/monolog/images/monolog-icon.png" alt="m" /></span>
            </div>
            <div class="mp-rows compact">
              <div class="mp-row">
                <span v-for="k in keyRows[0]" :key="k" class="mp-key">{{ k }}</span>
              </div>
              <div class="mp-row">
                <span class="mp-key mod-wide">?123</span>
                <span class="mp-key space">English <Zap :size="10" /></span>
                <span class="mp-key enter">↵</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Screen 02: Contextual Inline Reminder Pill -->
        <div
          v-if="!compact || variant === 'reminder'"
          class="mini-phone"
          data-theme="ink"
          data-borders="false"
        >
          <div class="mp-status">
            <span>Inline Suggestion</span>
            <span>Contextual Reminder</span>
          </div>

          <div class="mp-chat-head">
            <span class="mp-avatar">S</span>
            <div>
              <strong>Sam</strong>
              <small>Contextual Suggestion Pill</small>
            </div>
          </div>

          <div class="mp-chat">
            <div class="mp-bubble recv">What time is our mock exam?</div>
            <div class="mp-draft-box">{{ reminderDraft }}</div>
            <div v-if="reminderConfirmed" class="mp-confirmed-card">
              <CheckCircle2 :size="13" />
              <div>
                <strong>Exam reminder reviewed</strong>
                <small>Today · 5:00 PM · Local clock intent ready</small>
              </div>
            </div>
          </div>

          <div class="mp-kb-surface">
            <div class="mp-toolbar">
              <span class="mp-dots">•••</span>
              <button class="mp-pill reminder-pill" @click="reminderConfirmed = !reminderConfirmed">
                <Clock :size="11" />
                <span>{{ reminderConfirmed ? 'Reminder reviewed ✓' : 'Set 5:00 PM reminder' }}</span>
              </button>
              <span class="mp-m-badge"><img src="/monolog/images/monolog-icon.png" alt="m" /></span>
            </div>
            <div class="mp-rows compact">
              <div class="mp-row">
                <span v-for="k in keyRows[0]" :key="k" class="mp-key">{{ k }}</span>
              </div>
              <div class="mp-row">
                <span class="mp-key mod-wide">?123</span>
                <span class="mp-key space">English <Zap :size="10" /></span>
                <span class="mp-key enter">↵</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 7. COMPANION FLOW (1-4 LIVE SCREENS) -->
    <div v-else-if="mode === 'flow'" class="dual-stage">
      <div class="flow-4-grid" :class="{ 'compact-flow': compact }">
        <!-- 01 Today Dashboard -->
        <div v-if="!compact || variant !== 'timeline'" class="flow-phone" data-theme="paper">
          <div class="fp-top">
            <span class="fp-num font-mono">01 · TODAY</span>
            <span class="fp-weather">24°C · MET Norway</span>
          </div>
          <h4>Your day, remembered.</h4>
          <div class="fp-card accent">
            <small>TODAY'S JOURNAL</small>
            <strong>A focused day</strong>
            <p>Study plans in the library, coffee with Sam, and Call Amma at 6:00 PM.</p>
          </div>
          <div class="fp-mini-grid">
            <div class="fp-card">
              <Clock :size="12" />
              <strong>Call Amma</strong>
              <small>6:00 PM</small>
            </div>
            <div class="fp-card">
              <Calendar :size="12" />
              <strong>Memory</strong>
              <small>Art walk · 14 Nov</small>
            </div>
          </div>
          <div class="fp-nav">
            <span class="on">Today</span>
            <span>Journal</span>
            <span>Library</span>
          </div>
        </div>

        <!-- 02 Journal Timeline -->
        <div v-if="!compact || variant === 'timeline'" class="flow-phone" data-theme="paper">
          <div class="fp-top">
            <span class="fp-num font-mono">02 · JOURNAL</span>
            <span class="fp-pill-mini">Timeline · Calendar · Gallery</span>
          </div>
          <h4>Journal</h4>
          <div class="fp-card">
            <small>SUNDAY, 15 NOV</small>
            <strong>A focused day</strong>
            <p>Study plans, coffee with Sam, and Call Amma at 6:00 PM.</p>
          </div>
          <div class="fp-card">
            <small>14 NOV · SAT</small>
            <strong>Small moments, kept</strong>
            <p>Riverside art walk &amp; voice note on the way home.</p>
          </div>
          <div class="fp-nav">
            <span>Today</span>
            <span class="on">Journal</span>
            <span>Library</span>
          </div>
        </div>

        <!-- 03 Context Library -->
        <div v-if="!compact" class="flow-phone" data-theme="paper">
          <div class="fp-top">
            <span class="fp-num font-mono">03 · LIBRARY</span>
            <span class="fp-pill-mini">ML Kit OCR</span>
          </div>
          <h4>Context Library</h4>
          <div class="fp-card accent">
            <small><Layers :size="10" /> SCREENSHOT OCR</small>
            <strong>Weekend getaway</strong>
            <p>HND → ITM · 24 May · Hotel Namba check-in 3:00 PM.</p>
          </div>
          <div class="fp-card">
            <small><FileText :size="10" /> AUDIO NOTE · 0:05</small>
            <strong>On the way home</strong>
            <audio controls preload="none" src="/monolog/audio/context-voice-demo.wav" class="fp-audio"></audio>
          </div>
          <div class="fp-nav">
            <span>Today</span>
            <span>Journal</span>
            <span class="on">Library</span>
          </div>
        </div>

        <!-- 04 Monthly Narrative Recap -->
        <div v-if="!compact" class="flow-phone" data-theme="ink">
          <div class="fp-top">
            <span class="fp-num font-mono">04 · NNN RECAP</span>
            <span class="fp-pill-mini dark">Review first</span>
          </div>
          <h4>Narrative Nostalgia November</h4>
          <div class="fp-card dark-accent">
            <p>“Nights of revision. Coffee with Sam. An art walk you almost skipped. November held more than deadlines.”</p>
          </div>
          <div class="fp-chips-wrap">
            <button
              v-for="item in ['Morning reflection', 'Coffee with Sam', 'Art walk', 'Call Amma 6 PM']"
              :key="item"
              class="fp-toggle-chip"
              :class="{ on: activeRecapHighlights.includes(item) }"
              @click="toggleRecapHighlight(item)"
            >
              {{ activeRecapHighlights.includes(item) ? '✓ ' : '+ ' }}{{ item }}
            </button>
          </div>
          <small class="fp-foot-hint">{{ activeRecapHighlights.length }} selected · Edit before export</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lsp-root {
  width: 100%;
}

.dual-stage,
.single-stage {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
  width: 100%;
}

.stage-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
}

.stage-chip {
  font-size: 0.68rem;
  color: #9ca3af;
}

.stage-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: #d1d5db;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  cursor: pointer;
}

.stage-btn.active {
  border-color: var(--color-accent);
  background: rgba(249, 115, 22, 0.2);
  color: #ffffff;
}

.stage-btn.accent {
  background: #f97316;
  border-color: #fb923c;
  color: #ffffff;
  font-weight: 700;
}

.dual-phones-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.1rem;
  max-width: 720px;
}

.dual-phones-grid.single-col {
  grid-template-columns: 1fr;
  max-width: 310px;
}

/* Mini Phone Theme Tokens */
.mini-phone {
  --mp-bg: #ffffff;
  --mp-ink: #151823;
  --mp-muted: #535b6b;
  --mp-card: #f2f3f7;
  --mp-kb-bg: radial-gradient(ellipse at 15% 85%, #dce8f7, transparent 58%), radial-gradient(ellipse at 86% 80%, #e8e2f3, transparent 60%), #ffffff;
  --mp-key-bg: rgba(255, 255, 255, 0.9);
  --mp-key-border: rgba(21, 24, 35, 0.1);
  --mp-pill: rgba(21, 24, 35, 0.07);

  width: 100%;
  background: var(--mp-bg);
  color: var(--mp-ink);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 0.75rem 0.75rem 0.65rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
}

.mini-phone.focused-phone {
  max-width: 325px;
}

.mini-phone[data-theme='ink'] {
  --mp-bg: #08090b;
  --mp-ink: #f7f8fc;
  --mp-muted: #a1a8ba;
  --mp-card: #1a1b24;
  --mp-kb-bg: radial-gradient(ellipse at 0% 70%, rgba(54, 47, 74, 0.85), transparent 58%), radial-gradient(ellipse at 100% 70%, rgba(69, 42, 59, 0.85), transparent 58%), #121318;
  --mp-key-bg: rgba(34, 37, 48, 0.9);
  --mp-key-border: rgba(255, 255, 255, 0.14);
  --mp-pill: rgba(255, 255, 255, 0.11);
}

.mini-phone[data-theme='iris'] {
  --mp-bg: #f6f7fe;
  --mp-ink: #161b2e;
  --mp-muted: #4e5674;
  --mp-card: #e8ebfb;
  --mp-kb-bg: #ececf9;
  --mp-key-border: rgba(64, 79, 145, 0.15);
  --mp-pill: rgba(64, 79, 145, 0.1);
}

.mini-phone[data-theme='ocean'] {
  --mp-bg: #eff8f7;
  --mp-ink: #102b33;
  --mp-muted: #3d646e;
  --mp-card: #d9eff0;
  --mp-kb-bg: #dff2f0;
  --mp-key-border: rgba(24, 95, 115, 0.15);
  --mp-pill: rgba(24, 95, 115, 0.1);
}

.mini-phone[data-theme='terracotta'] {
  --mp-bg: #fdf5ef;
  --mp-ink: #2f1b17;
  --mp-muted: #6d4d46;
  --mp-card: #f5e2d8;
  --mp-kb-bg: linear-gradient(150deg, #fff1e5, #f3cfc5);
  --mp-key-border: rgba(134, 62, 53, 0.15);
  --mp-pill: rgba(134, 62, 53, 0.1);
}

.mini-phone[data-theme='photo'] {
  --mp-bg: #121520;
  --mp-ink: #f7f8fc;
  --mp-muted: #cbd2e6;
  --mp-card: rgba(34, 38, 56, 0.88);
  --mp-kb-bg: linear-gradient(rgba(10, 12, 20, 0.65), rgba(10, 12, 20, 0.65)), url('/monolog/artwork/memory-unfolding.webp') center / cover no-repeat;
  --mp-key-bg: rgba(22, 25, 38, 0.7);
  --mp-key-border: rgba(255, 255, 255, 0.22);
  --mp-pill: rgba(255, 255, 255, 0.14);
}

.mp-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--mp-muted);
  border-bottom: 1px solid var(--mp-key-border);
  padding: 0 0.2rem 0.32rem;
}

.mp-chat-head {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.mp-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--mp-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.mp-chat-head strong {
  display: block;
  font-size: 0.78rem;
  line-height: 1.1;
}

.mp-chat-head small {
  font-size: 0.62rem;
  color: var(--mp-muted);
}

.mp-chat {
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
}

.mp-bubble {
  padding: 0.4rem 0.65rem;
  border-radius: 12px;
  font-size: 0.72rem;
  max-width: 86%;
}

.mp-bubble.recv {
  background: var(--mp-card);
  align-self: flex-start;
}

.mp-bubble.sent {
  background: var(--mp-ink);
  color: var(--mp-bg);
  align-self: flex-end;
}

.mp-draft-pill,
.mp-draft-box {
  background: var(--mp-card);
  border: 1px solid var(--mp-key-border);
  border-radius: 12px;
  padding: 0.42rem 0.65rem;
  font-size: 0.72rem;
}

.mp-clip-strip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
  font-size: 0.62rem;
  color: var(--mp-muted);
}

.clip-chip {
  padding: 0.14rem 0.42rem;
  border-radius: 9999px;
  border: 1px solid var(--mp-key-border);
  background: var(--mp-pill);
  color: var(--mp-ink);
  font-size: 0.62rem;
  cursor: pointer;
}

.mp-kb-surface {
  background: var(--mp-kb-bg);
  border-radius: 20px;
  padding: 0.45rem 0.3rem 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.mp-toolbar {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0 0.25rem;
}

.mp-dots {
  font-size: 0.65rem;
  opacity: 0.65;
}

.mp-pill {
  flex: 1;
  background: var(--mp-pill);
  border: 1px solid var(--mp-key-border);
  border-radius: 9999px;
  padding: 0.2rem 0.5rem;
  font-size: 0.64rem;
  font-weight: 600;
  color: var(--mp-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mp-pill.reminder-pill {
  background: rgba(249, 115, 22, 0.2);
  border-color: rgba(249, 115, 22, 0.5);
  cursor: pointer;
}

.mp-m-badge {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: #ffffff;
  border: 1px solid var(--mp-key-border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

.mp-m-badge img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.mp-m-badge.active {
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.28);
}

.mp-m-badge.locked {
  opacity: 0.55;
}

.m-lock-pin {
  position: absolute;
  bottom: -2px;
  right: -2px;
  color: #c084fc;
}

.mp-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: width 0.2s ease;
}

.mp-rows.left {
  width: 86%;
  margin-right: auto;
}

.mp-rows.right {
  width: 86%;
  margin-left: auto;
}

.mp-row {
  display: flex;
  gap: 3px;
  justify-content: center;
}

.mp-row.mid {
  padding: 0 4%;
}

.mp-key {
  flex: 1;
  height: 29px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--mp-ink);
  font-size: 0.82rem;
  font-weight: 500;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
}

.mini-phone[data-borders='true'] .mp-key {
  background: var(--mp-key-bg);
  border-color: var(--mp-key-border);
}

.mp-key.mod,
.mp-key.mod-wide {
  background: var(--mp-pill);
  font-size: 0.66rem;
  max-width: 38px;
}

.mp-key.incognito-glow {
  box-shadow: 0 0 0 1.5px #a855f7;
}

.mp-key.space {
  flex: 2.8;
  background: var(--mp-pill);
  font-size: 0.66rem;
}

.mp-key.space.active-ai {
  background: var(--mp-ink);
  color: var(--mp-bg);
}

.mp-key.enter {
  max-width: 40px;
  background: var(--mp-ink);
  color: var(--mp-bg);
  border-radius: 9999px;
}

/* Vox Dock */
.mp-vox-dock {
  background: var(--mp-card);
  border-radius: 18px;
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.vox-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
}

.vox-word {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 800;
}

.vox-status-tag {
  font-size: 0.62rem;
  color: var(--mp-muted);
}

.vox-bars {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  height: 24px;
}

.v-bar {
  width: 3px;
  height: 6px;
  border-radius: 999px;
  background: #8b5cf6;
  animation: waveP 1s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.06s);
  animation-play-state: paused;
}

.vox-bars.animating .v-bar {
  animation-play-state: running;
}

@keyframes waveP {
  0%, 100% { height: 6px; }
  50% { height: 22px; }
}

.vox-quote {
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
}

.vox-sub {
  font-size: 0.6rem;
  color: var(--mp-muted);
  text-align: center;
}

.vox-btn-row {
  display: flex;
  gap: 0.35rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.vox-pill,
.vox-done-btn {
  border-radius: 9999px;
  border: 1px solid var(--mp-key-border);
  background: var(--mp-bg);
  color: var(--mp-ink);
  font-size: 0.64rem;
  font-weight: 600;
  padding: 0.22rem 0.55rem;
  cursor: pointer;
}

.vox-done-btn {
  background: var(--mp-ink);
  color: var(--mp-bg);
  border-color: var(--mp-ink);
}

/* AI Float Card */
.ai-float-card {
  background: var(--mp-card);
  border: 1px solid var(--mp-key-border);
  border-radius: 16px;
  padding: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ai-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.74rem;
}

.ai-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  font-weight: 700;
}

.ai-source-badge {
  font-size: 0.6rem;
  color: var(--mp-muted);
}

.ai-query-pill {
  background: var(--mp-bg);
  border-radius: 10px;
  padding: 0.32rem 0.5rem;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.ai-chips-strip {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.ai-q-chip {
  padding: 0.16rem 0.45rem;
  border-radius: 9999px;
  border: 1px solid var(--mp-key-border);
  background: var(--mp-bg);
  color: var(--mp-ink);
  font-size: 0.62rem;
  cursor: pointer;
}

.ai-q-chip.on {
  background: var(--mp-ink);
  color: var(--mp-bg);
}

.ai-answer-box {
  background: var(--mp-bg);
  border-radius: 12px;
  padding: 0.5rem;
}

.ai-answer-box p {
  font-size: 0.72rem;
  margin: 0 0 0.3rem;
}

.ai-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.35rem;
}

.ai-foot small {
  font-size: 0.6rem;
  color: var(--mp-muted);
}

.ai-insert {
  border: none;
  border-radius: 9999px;
  background: var(--mp-ink);
  color: var(--mp-bg);
  font-size: 0.64rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  cursor: pointer;
}

/* Bank Screen */
.mp-bank-screen {
  background: var(--mp-card);
  border-radius: 16px;
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.bank-top {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.76rem;
}

.mp-bank-screen h4 {
  margin: 0;
  font-size: 0.9rem;
}

.bank-box small {
  display: block;
  font-size: 0.6rem;
  color: var(--mp-muted);
}

.bank-input {
  background: var(--mp-bg);
  border: 1px solid var(--mp-key-border);
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
  font-size: 0.72rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bank-box.focused .bank-input {
  border-color: #a855f7;
}

.bank-auto-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.62rem;
  color: #c084fc;
}

.mp-incognito-banner {
  background: rgba(168, 85, 247, 0.22);
  border: 1px solid rgba(168, 85, 247, 0.45);
  border-radius: 10px;
  padding: 0.28rem 0.5rem;
  font-size: 0.62rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Shortcuts Popup */
.sc-popup-box {
  background: var(--mp-card);
  border: 1px solid var(--mp-key-border);
  border-radius: 14px;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.sc-pop-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
}

.sc-pop-tag {
  font-size: 0.6rem;
  color: var(--mp-muted);
}

.sc-pop-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.3rem;
}

.sc-pop-tile {
  border: 1px solid var(--mp-key-border);
  background: var(--mp-bg);
  color: var(--mp-ink);
  border-radius: 10px;
  padding: 0.45rem 0.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6rem;
  font-weight: 600;
  cursor: pointer;
}

.sc-pop-tile.active {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.14);
}

.sc-preview-strip {
  background: var(--mp-bg);
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  font-size: 0.64rem;
  color: var(--mp-muted);
}

.mp-confirmed-card {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  background: rgba(52, 211, 153, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.4);
  border-radius: 10px;
  padding: 0.4rem 0.5rem;
  font-size: 0.68rem;
}

.mp-confirmed-card small {
  display: block;
  font-size: 0.6rem;
  opacity: 0.8;
}

/* 4-Screen Companion Flow Grid */
.flow-4-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
}

.flow-4-grid.compact-flow {
  grid-template-columns: 1fr;
  max-width: 310px;
}

.flow-phone {
  background: #f8fafc;
  color: #151823;
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: space-between;
}

.flow-phone[data-theme='ink'] {
  background: #0d0e14;
  color: #f8fafc;
}

.fp-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.fp-num {
  font-size: 0.62rem;
  font-weight: 700;
  color: #f97316;
}

.fp-weather,
.fp-pill-mini {
  font-size: 0.58rem;
  background: #e2e8f0;
  color: #334155;
  padding: 0.1rem 0.38rem;
  border-radius: 9999px;
}

.fp-pill-mini.dark {
  background: rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
}

.flow-phone h4 {
  font-size: 0.92rem;
  font-weight: 800;
  margin: 0;
}

.fp-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.55rem 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}

.fp-card.accent {
  background: linear-gradient(145deg, #ffffff, #eef2ff);
  border-color: #c7d2fe;
}

.fp-card.dark-accent {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.35);
}

.fp-card small {
  font-size: 0.56rem;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 700;
}

.fp-card strong {
  font-size: 0.74rem;
}

.fp-card p {
  font-size: 0.66rem;
  margin: 0;
  line-height: 1.35;
  color: #475569;
}

.flow-phone[data-theme='ink'] .fp-card p {
  color: #e2e8f0;
  font-style: italic;
}

.fp-mini-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}

.fp-audio {
  width: 100%;
  height: 28px;
  margin-top: 0.25rem;
}

.fp-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.fp-toggle-chip {
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 0.6rem;
  padding: 0.18rem 0.45rem;
  cursor: pointer;
}

.fp-toggle-chip.on {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.24);
  color: #ffffff;
}

.fp-foot-hint {
  font-size: 0.6rem;
  color: #9ca3af;
}

.fp-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  font-size: 0.62rem;
  font-weight: 600;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
  padding-top: 0.38rem;
}

.fp-nav .on {
  color: #4f46e5;
}

@media (max-width: 1024px) {
  .flow-4-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .dual-phones-grid,
  .flow-4-grid {
    grid-template-columns: 1fr;
  }
}
</style>
