<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Calendar,
  BookOpen,
  Layers,
  Search,
  Mic,
  Image as ImageIcon,
  FileText,
  Clock,
  Plus,
} from 'lucide-vue-next'

type AppTab = 'Today' | 'Journal' | 'Library'
type JournalView = 'Timeline' | 'Calendar' | 'Gallery'
type PeriodType = 'Day' | 'Month' | 'Year'
type LibraryFilter = 'All' | 'Photo' | 'Screenshot' | 'Voice' | 'Note'

interface LibraryItem {
  id: string
  type: Exclude<LibraryFilter, 'All'>
  title: string
  detail: string
  date: string
  meta?: string
}

const activeTab = ref<AppTab>('Journal')
const journalView = ref<JournalView>('Timeline')
const period = ref<PeriodType>('Day')
const journalSearch = ref('')
const selectedDay = ref<string | null>(null)

const libFilter = ref<LibraryFilter>('All')
const libSearch = ref('')
const newNoteOpen = ref(false)
const newNoteText = ref('')
const selectedItem = ref<LibraryItem | null>(null)

const sampleDays = [
  {
    date: '2026-11-26',
    dateLabel: '26 Nov · Today',
    title: 'Buildathon finals',
    summary: '3:30 PM pitch rehearsal reminder, saved Demo Bay B venue move, and pitch opening notes.',
    tags: ['Screenshot', 'Reminder', 'Note'],
    sources: [
      { kind: 'Screenshot · ML Kit OCR', label: 'Judging moved to Demo Bay B', body: 'Finalist portal update · 4:00 PM · Hall 2 · Bring HDMI adapter.' },
      { kind: 'Reminder', label: 'Rehearse Monolog pitch', body: '3:30 PM · Verified by you' },
      { kind: 'Note', label: 'Pitch opening', body: 'Keep the opening about staying inside WhatsApp without switching apps.' },
    ],
  },
  {
    date: '2026-11-15',
    dateLabel: '15 Nov · Sun',
    title: 'A focused day',
    summary: 'Study plans, coffee with Sam, and an evening reminder.',
    tags: ['Note', 'Photo', 'Reminder'],
    sources: [
      { kind: 'Note', label: 'Library study plans', body: 'Meet at the library at four. Bring the notes.' },
      { kind: 'Photo', label: 'Coffee with Sam', body: 'A photo saved from the afternoon coffee break.' },
      { kind: 'Reminder', label: 'Call Amma', body: '6:00 PM · Verified by you' },
    ],
  },
  {
    date: '2026-11-14',
    dateLabel: '14 Nov · Sat',
    title: 'Small moments, kept',
    summary: 'An art walk, a voice note, and time to slow down.',
    tags: ['Photo', 'Voice'],
    sources: [
      { kind: 'Photo', label: 'Riverside art walk', body: 'A photo saved during the Saturday art walk.' },
      { kind: 'Voice', label: 'On the way home', body: '“I took the long way home. Glad I did.”' },
    ],
  },
]

const libraryItems = ref<LibraryItem[]>([
  { id: '0', type: 'Screenshot', title: 'Judging moved to Demo Bay B', detail: 'Hall 2 · 4:00 PM · Bring HDMI adapter. Voice note attached.', date: '26 Nov', meta: 'ML Kit OCR' },
  { id: '1', type: 'Photo', title: 'Riverside Art Walk', detail: 'A photo from the Saturday art walk by the river.', date: '14 Nov' },
  { id: '2', type: 'Photo', title: 'Coffee with Sam', detail: 'Saved from the afternoon coffee break.', date: '15 Nov' },
  { id: '3', type: 'Screenshot', title: 'Weekend getaway', detail: 'HND → ITM · 24 May · Hotel Namba · Check-in at 3:00 PM.', date: '13 Nov', meta: 'ML Kit OCR' },
  { id: '4', type: 'Voice', title: 'On the way home', detail: 'I took the long way home. Glad I did.', date: '14 Nov', meta: 'Audio Note' },
  { id: '5', type: 'Note', title: 'Pitch opening', detail: 'Keep the opening about staying inside WhatsApp without switching apps.', date: '26 Nov' },
])

const filteredDays = computed(() => {
  const q = journalSearch.value.trim().toLowerCase()
  if (!q) return sampleDays
  return sampleDays.filter((d) =>
    [d.title, d.summary, d.dateLabel, ...d.sources.map((s) => `${s.label} ${s.body}`)].join(' ').toLowerCase().includes(q)
  )
})

const currentDayDetail = computed(() => sampleDays.find((d) => d.date === selectedDay.value) || null)

const filteredLibrary = computed(() => {
  const q = libSearch.value.trim().toLowerCase()
  return libraryItems.value.filter(
    (item) => (libFilter.value === 'All' || item.type === libFilter.value) && `${item.title} ${item.detail}`.toLowerCase().includes(q)
  )
})

const saveNewLibraryNote = () => {
  const body = newNoteText.value.trim()
  if (!body) return
  const added: LibraryItem = {
    id: String(Date.now()),
    type: 'Note',
    title: 'Your note',
    detail: body,
    date: 'Just now',
  }
  libraryItems.value.unshift(added)
  newNoteText.value = ''
  newNoteOpen.value = false
  selectedItem.value = added
}

const activeDayNumbers = new Set([14, 15, 26])
</script>

<template>
  <div class="explorer-shell">
    <!-- Left Explanation Column -->
    <div class="explorer-copy">
      <div class="ex-eyebrow font-mono">// COMPANION JOURNAL &amp; CONTEXT LIBRARY</div>
      <h3 class="ex-title">Your side of the day, <em>searchable on-device.</em></h3>
      <p class="ex-desc">
        Test Monolog’s companion screens interactively. Browse <strong>Today</strong> with local MET Norway weather, switch between <strong>Timeline · Calendar · Gallery</strong> and monthly recaps (<em>Narrative Nostalgia November</em>), or filter saved screenshots, photos, and playable voice notes in <strong>Context Library</strong>.
      </p>

      <div class="ex-pillars-list">
        <button class="ex-jump-btn" :class="{ active: activeTab === 'Today' }" @click="activeTab = 'Today'">
          <Calendar :size="15" />
          <div>
            <strong>Today Dashboard</strong>
            <small>MET Norway weather, Memory of the Day &amp; reminder cues</small>
          </div>
        </button>
        <button class="ex-jump-btn" :class="{ active: activeTab === 'Journal' }" @click="activeTab = 'Journal'; selectedDay = null">
          <BookOpen :size="15" />
          <div>
            <strong>Journal &amp; Monthly Recaps</strong>
            <small>Chronological days, Day/Month recaps &amp; natural-language queries</small>
          </div>
        </button>
        <button class="ex-jump-btn" :class="{ active: activeTab === 'Library' }" @click="activeTab = 'Library'; selectedItem = null">
          <Layers :size="15" />
          <div>
            <strong>Context Library (ML Kit OCR + Audio)</strong>
            <small>Play sample voice note &amp; search extracted screenshot text</small>
          </div>
        </button>
      </div>
    </div>

    <!-- Right Interactive Companion Phone Device -->
    <div class="explorer-phone">
      <div class="ep-status font-mono">
        <span>9:41</span>
        <span class="ep-punch"></span>
        <span>On-device · 5G</span>
      </div>

      <div class="ep-header">
        <div class="ep-brand">
          <img src="/monolog/images/monolog-icon.png" alt="Monolog" />
          <strong>Monolog</strong>
        </div>
        <span class="ep-badge">AES-256 Room</span>
      </div>

      <!-- TAB 1: TODAY -->
      <div v-if="activeTab === 'Today'" class="ep-body">
        <div class="weather-pill">
          <span>24° · Partly cloudy (MET Norway)</span>
          <strong>Thu · 26 Nov</strong>
        </div>
        <h4 class="ep-page-heading">Your day, remembered.</h4>
        <div class="ep-card accent-card">
          <span class="ep-meta">TODAY'S JOURNAL</span>
          <strong>Buildathon finals</strong>
          <p>3:30 PM pitch rehearsal reminder, saved Demo Bay B venue move, and pitch opening notes.</p>
          <button class="ep-action-link" @click="activeTab = 'Journal'; selectedDay = '2026-11-26'">Open day stream →</button>
        </div>
        <div class="ep-two-col">
          <div class="ep-card">
            <span class="ep-meta"><Clock :size="11" /> REMINDERS</span>
            <strong>Rehearse pitch</strong>
            <small>3:30 PM today</small>
          </div>
          <div class="ep-card">
            <span class="ep-meta">RECENT MEMORY</span>
            <strong>Demo Bay B</strong>
            <small>26 Nov · Finals Portal OCR</small>
          </div>
        </div>
      </div>

      <!-- TAB 2: JOURNAL -->
      <div v-else-if="activeTab === 'Journal'" class="ep-body">
        <div class="ep-title-row">
          <h4 class="ep-page-heading">Journal</h4>
          <div class="ep-seg">
            <button :class="{ on: period === 'Day' }" @click="period = 'Day'">Day</button>
            <button :class="{ on: period === 'Month' }" @click="period = 'Month'">Month</button>
            <button :class="{ on: period === 'Year' }" @click="period = 'Year'">Year</button>
          </div>
        </div>

        <div class="ep-search-box">
          <Search :size="13" />
          <input v-model="journalSearch" type="search" placeholder="Ask about your days..." aria-label="Search journal" />
        </div>

        <div class="ep-views-bar">
          <button
            v-for="v in (['Timeline', 'Calendar', 'Gallery'] as JournalView[])"
            :key="v"
            :class="{ on: journalView === v }"
            @click="journalView = v; selectedDay = null"
          >
            {{ v }}
          </button>
        </div>

        <!-- Expanded Single Day -->
        <div v-if="currentDayDetail" class="ep-scroll-area">
          <button class="ep-back-btn" @click="selectedDay = null">‹ Back to {{ journalView }}</button>
          <div class="ep-card accent-card">
            <span class="ep-meta">{{ currentDayDetail.dateLabel }}</span>
            <strong>{{ currentDayDetail.title }}</strong>
            <p>{{ currentDayDetail.summary }}</p>
          </div>
          <div v-for="src in currentDayDetail.sources" :key="src.label" class="ep-card">
            <span class="ep-meta">{{ src.kind }}</span>
            <strong>{{ src.label }}</strong>
            <small>{{ src.body }}</small>
          </div>
        </div>

        <!-- Monthly / Daily Brief Card -->
        <div v-else class="ep-scroll-area">
          <div class="ep-card accent-card">
            <span class="ep-meta">
              {{ period === 'Year' ? '2026 RECAP' : period === 'Month' ? 'NOVEMBER 2026 · NNN RECAP' : 'THURSDAY, 26 NOV 2026' }}
            </span>
            <strong>
              {{ period === 'Year' ? 'Your year in brief' : period === 'Month' ? 'Narrative Nostalgia November' : 'Your day in brief' }}
            </strong>
            <p>
              {{
                period === 'Year'
                  ? 'Steady daily captures, exam prep in November, and your Buildathon finals walkthrough — private on-device.'
                  : period === 'Month'
                    ? 'Nights of revision. Coffee with Sam. Buildathon Demo Bay B capture. Editable before export.'
                    : 'Rehearsal reminder at 3:30 PM, Demo Bay B portal capture, and pitch notes saved.'
              }}
            </p>
          </div>

          <template v-if="journalView === 'Timeline'">
            <div v-for="day in filteredDays" :key="day.date" class="ep-card">
              <span class="ep-meta">{{ day.dateLabel }}</span>
              <strong>{{ day.title }}</strong>
              <p>{{ day.summary }}</p>
              <div class="ep-tag-row">
                <span v-for="t in day.tags" :key="t" class="ep-mini-tag">{{ t }}</span>
                <button class="ep-action-link" @click="selectedDay = day.date">View day →</button>
              </div>
            </div>
          </template>

          <template v-else-if="journalView === 'Calendar'">
            <div class="cal-grid">
              <span v-for="d in 30" :key="d" class="cal-cell" :class="{ marked: activeDayNumbers.has(d) }">
                <button v-if="activeDayNumbers.has(d)" @click="selectedDay = `2026-11-${d}`">{{ d }}</button>
                <span v-else>{{ d }}</span>
              </span>
            </div>
          </template>

          <template v-else>
            <div class="ep-two-col">
              <button class="ep-card gallery-tile" @click="selectedDay = '2026-11-26'">
                <div class="gal-preview bay-preview font-mono">HALL 2 · BAY B</div>
                <strong>Demo Bay B Notice</strong>
                <small>26 Nov · Screenshot OCR</small>
              </button>
              <button class="ep-card gallery-tile" @click="selectedDay = '2026-11-15'">
                <div class="gal-preview coffee-preview"><ImageIcon :size="15" /> Coffee Break</div>
                <strong>Coffee with Sam</strong>
                <small>15 Nov · Photo</small>
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- TAB 3: CONTEXT LIBRARY -->
      <div v-else class="ep-body">
        <div class="ep-title-row">
          <h4 class="ep-page-heading">Context Library</h4>
          <button class="ep-add-btn" @click="newNoteOpen = !newNoteOpen; selectedItem = null" title="Add note">
            <Plus :size="14" />
          </button>
        </div>

        <div class="ep-search-box">
          <Search :size="13" />
          <input v-model="libSearch" type="search" placeholder="Search OCR & notes..." aria-label="Search Context Library" />
        </div>

        <div class="ep-filter-chips">
          <button
            v-for="f in (['All', 'Photo', 'Screenshot', 'Voice', 'Note'] as LibraryFilter[])"
            :key="f"
            :class="{ on: libFilter === f }"
            @click="libFilter = f; selectedItem = null"
          >
            {{ f === 'Voice' ? 'Audio' : f }}
          </button>
        </div>

        <div v-if="newNoteOpen" class="ep-scroll-area">
          <div class="ep-card">
            <span class="ep-meta">NEW LIBRARY NOTE</span>
            <textarea v-model="newNoteText" rows="3" placeholder="Write something to save..." class="ep-textarea"></textarea>
            <button class="ep-save-btn" @click="saveNewLibraryNote">Save locally</button>
          </div>
        </div>

        <div v-else-if="selectedItem" class="ep-scroll-area">
          <button class="ep-back-btn" @click="selectedItem = null">‹ Back to Library</button>
          <div class="ep-card accent-card">
            <span class="ep-meta">{{ selectedItem.type }} · {{ selectedItem.date }}</span>
            <strong>{{ selectedItem.title }}</strong>
            <audio v-if="selectedItem.type === 'Voice'" controls preload="none" src="/monolog/audio/context-voice-demo.wav" class="ep-audio"></audio>
            <span v-if="selectedItem.meta" class="ep-meta">{{ selectedItem.meta }}</span>
            <p>{{ selectedItem.detail }}</p>
          </div>
        </div>

        <div v-else class="ep-scroll-area">
          <div class="ep-two-col">
            <button v-for="item in filteredLibrary" :key="item.id" class="ep-card lib-item" @click="selectedItem = item">
              <span class="ep-meta">
                <Mic v-if="item.type === 'Voice'" :size="10" />
                <FileText v-else :size="10" />
                {{ item.type }}
              </span>
              <strong>{{ item.title }}</strong>
              <small>{{ item.date }}</small>
            </button>
          </div>
          <p class="drive-hint font-mono">Optional encrypted Google Drive backup · Stay local by default</p>
        </div>
      </div>

      <!-- Companion App Bottom Navigation -->
      <nav class="ep-bottom-nav" aria-label="Monolog app navigation">
        <button :class="{ on: activeTab === 'Today' }" @click="activeTab = 'Today'">
          <Calendar :size="14" />
          <span>Today</span>
        </button>
        <button :class="{ on: activeTab === 'Journal' }" @click="activeTab = 'Journal'; selectedDay = null">
          <BookOpen :size="14" />
          <span>Journal</span>
        </button>
        <button :class="{ on: activeTab === 'Library' }" @click="activeTab = 'Library'; selectedItem = null">
          <Layers :size="14" />
          <span>Library</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.explorer-shell {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 2.5rem;
  align-items: center;
}

.explorer-copy {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.ex-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}

.ex-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
  margin: 0;
}

.ex-title em {
  color: var(--color-accent);
  font-style: italic;
}

.ex-desc {
  font-size: 0.92rem;
  color: #9ca3af;
  line-height: 1.65;
  margin: 0;
}

.ex-pillars-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.4rem;
}

.ex-jump-btn {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  text-align: left;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ex-jump-btn:hover,
.ex-jump-btn.active {
  border-color: rgba(249, 115, 22, 0.5);
  background: rgba(249, 115, 22, 0.1);
  color: #ffffff;
}

.ex-jump-btn strong {
  display: block;
  font-size: 0.88rem;
}

.ex-jump-btn small {
  font-size: 0.76rem;
  color: #94a3b8;
}

/* Interactive Companion App Phone */
.explorer-phone {
  width: 100%;
  max-width: 370px;
  margin: 0 auto;
  height: 580px;
  background: #f8fafc;
  color: #151823;
  border-radius: 38px;
  border: 3px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 25px 65px rgba(0, 0, 0, 0.75);
  padding: 0.85rem 0.9rem 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.ep-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.66rem;
  color: #334155;
}

.ep-punch {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #0f172a;
}

.ep-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ep-brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
}

.ep-brand img {
  width: 20px;
  height: 20px;
}

.ep-badge {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  background: #e2e8f0;
  color: #1e293b;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  font-weight: 700;
}

.weather-pill {
  background: linear-gradient(135deg, #e8edff, #f2eafe);
  border-radius: 12px;
  padding: 0.45rem 0.7rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
}

.ep-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-height: 0;
}

.ep-page-heading {
  font-size: 1.12rem;
  font-weight: 800;
  margin: 0;
}

.ep-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ep-seg {
  display: inline-flex;
  background: #e2e8f0;
  border-radius: 9999px;
  padding: 2px;
}

.ep-seg button,
.ep-views-bar button,
.ep-filter-chips button {
  border: none;
  background: transparent;
  color: #475569;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.22rem 0.55rem;
  border-radius: 9999px;
  cursor: pointer;
}

.ep-seg button.on,
.ep-views-bar button.on,
.ep-filter-chips button.on {
  background: #151823;
  color: #ffffff;
}

.ep-search-box {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  padding: 0.28rem 0.65rem;
}

.ep-search-box input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.74rem;
  outline: none;
  color: #0f172a;
}

.ep-views-bar,
.ep-filter-chips {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.ep-scroll-area {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 2px;
}

.ep-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.65rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
}

.ep-card.accent-card {
  background: linear-gradient(145deg, #ffffff, #f1edff);
  border-color: #d8d0f8;
}

.lib-item {
  cursor: pointer;
}

.lib-item:hover {
  border-color: #6366f1;
}

.ep-meta {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  text-transform: uppercase;
}

.ep-card strong {
  font-size: 0.8rem;
}

.ep-card p,
.ep-card small {
  font-size: 0.72rem;
  color: #475569;
  margin: 0;
  line-height: 1.4;
}

.ep-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
}

.ep-tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  margin-top: 0.2rem;
  flex-wrap: wrap;
}

.ep-mini-tag {
  font-size: 0.6rem;
  background: #f1f5f9;
  color: #334155;
  padding: 0.08rem 0.38rem;
  border-radius: 9999px;
}

.ep-action-link,
.ep-back-btn {
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
  text-align: left;
  width: fit-content;
}

.ep-add-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ep-textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.4rem;
  font-size: 0.74rem;
  resize: none;
}

.ep-save-btn {
  border: none;
  border-radius: 9999px;
  background: #151823;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  margin-top: 0.3rem;
}

.ep-audio {
  width: 100%;
  height: 32px;
  margin: 0.25rem 0;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.6rem;
}

.cal-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #64748b;
}

.cal-cell.marked button {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 50%;
  background: #4f46e5;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.7rem;
  cursor: pointer;
}

.drive-hint {
  font-size: 0.6rem;
  color: #64748b;
  text-align: center;
  margin-top: 0.3rem;
}

.ep-bottom-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #e2e8f0;
  padding-top: 0.4rem;
}

.ep-bottom-nav button {
  border: none;
  background: transparent;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.66rem;
  font-weight: 600;
  cursor: pointer;
}

.ep-bottom-nav button.on {
  color: #4f46e5;
}

.gallery-tile {
  padding: 0.45rem;
  cursor: pointer;
}

.gal-preview {
  height: 54px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.64rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.bay-preview {
  background: linear-gradient(135deg, #0f172a, #312e81);
  color: #f8fafc;
}

.coffee-preview {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #78350f;
}

@media (max-width: 960px) {
  .explorer-shell {
    grid-template-columns: 1fr;
  }
}
</style>
