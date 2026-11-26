# Monolog — Architecture, Product Design & Buildathon Specification

> **Google Startup Buildathon India 2026 Finalist**  
> **Monolog — A keyboard. With a memory.**  
> *Type. Speak. Act. Remember your side of the day.*  
> Live Showcase: [monolog.notokens.co](https://monolog.notokens.co/) · Interactive Demo: [monolog.notokens.co/demo](https://monolog.notokens.co/demo) · Companion Web: [web.monolog.notokens.co](https://web.monolog.notokens.co/)

---

## 1. Product Definition & Three Connected Needs

Monolog is a privacy-first AI keyboard and companion personal journal for Android 12+ (API 31+) built by NoTokens. Instead of forcing people to switch between typing, voice dictation, writing tools, web search, reminders, and journaling apps, Monolog brings everyday writing assistance and quick actions into the keyboard while keeping eligible thoughts and captured context in an encrypted, searchable journal on the device — representing **your side of the day**.

| Need | Experience | Outcome |
| :--- | :--- | :--- |
| **Express** | Familiar borderless QWERTY typing across 6 themes, Vox voice mode, grammar fixes, and tone rewrites | Communicate naturally and clearly without leaving the app |
| **Act** | Contextual inline suggestions, floating AI Ask panel, `m` key quick shortcuts, and confirmed Android intents | Set reminders, alarms, and check details without losing focus |
| **Remember** | Private local journals, Context Library (screenshots + OCR, photos, voice notes, text), daily timelines, and monthly recaps | Retrieve saved details and revisit a meaningful record of your day |

---

## 2. Five Product Pillars & Core Architecture

### Pillar 1 — Everyday Keyboard (`InputMethodService` + Jetpack Compose)
- **Borderless Key Grid:** Tactile QWERTY keys with invisible cell boundaries by default, plus an optional frosted glass **Key Borders** and **Compact Keys** toggle, swipe typing preview, clipboard history (optional, unpinned expires in 1h), emoji/GIF/sticker pickers, and one-handed modes (**Full · Left · Right**).
- **6 Visual Themes:** **Paper** (pearl-white + calm aurora), **Ink** (obsidian charcoal/black), **Iris** (soft indigo), **Ocean** (cool teal), **Terracotta** (warm clay), and **Photo** (custom backdrop).
- **Toolbar & Bottom Row:**
  - Left: Menu / tools drawer; Center: contextual smart pill (`Ask`, `Rewrite this draft`, `Set 5 PM exam reminder`, `Memory paused`).
  - Right: Microphone (**tap** for dictation, **hold** for Vox Mode) + signature lowercase Beth Ellen **`m` Context key**.
  - Bottom row: `?123` symbols, Emoji / Language switch, Lightning **Spacebar** (hold for **AI Ask**), **Period / Incognito** key (hat-and-glasses glyph shares the period key cell), and adaptive **Enter**.

### Pillar 2 — Vox Voice Typing
- Docked inside the keyboard above the active input draft (preserving cursor and pre-existing text).
- Supports **Pause-tolerant listening**, live waveform response, **Smart Filter** cleanup (removing fillers like *"uh"* / *"umm"* while polishing punctuation), and language switching (**English · English (India) · Hindi · Spanish**).
- Editable transcript before committing into the host app; never auto-sends messages.

### Pillar 3 — Floating AI Panel (`AI Ask`)
- Accessible by holding the lightning spacebar or via toolbar action.
- Offers **Personal (Offline)** memory search and explicit opt-in **Web Search** (via Wikipedia or configured web provider with cited sources).
- Explicit **Copy / Insert answer** actions let users place answers back into the draft without exposing unrelated journal data.
- Powered on-device by **Google Gemma 3 270M IT / Gemma 2B via LiteRT-LM (TF Lite)** and opt-in cloud inference via **Firebase AI Logic + Gemini 1.5 Flash** (selected context + explicit prompt only). Gemini Nano remains future evaluation work.

### Pillar 4 — Context Engine & Quick Shortcuts (`m` Key)
- **Tap `m`:** Captures the visible screen (with Android `MediaProjection` or Accessibility permission where enabled), lets the user crop/redact, attach a text or voice note, and save to the **Context Library**.
- **Hold `m`:** Anchored **Quick Shortcuts** popover offering **Reminder**, **Alarm**, **Journal** (opens Monolog — replacing earlier photo shortcuts), and **Edit / + Save a note**.
- **Searchable Context Library:** Filters for **All · Photos · Screenshots · Audio Notes · Notes** with on-device **Google ML Kit OCR** (text recognition, image labels, object detection) linking extracted text directly back to its visual/audio source.

### Pillar 5 — Companion Journal & Personal Memory
- **Main Surfaces (`Today · Journal · Library`):**
  - **Today Dashboard:** Displays local weather via **MET Norway** (rounded coordinates + Android geocoding), Today's Journal card, Reminders, Memory of the Day, Add a card, and Ask/chat composer.
  - **Journal Views:** **Timeline · Calendar · Gallery** modes, **Day / Month** recap switcher, chronological day streams, and **Narrative Nostalgia November (NNN Recap)** user-reviewable stories.
  - **Honest Evidence Boundaries:** Typing `"coffee with Sam tomorrow"` is treated as a draft/plan, not proof the event happened. Summaries never invent another person's replies or imply full conversation visibility.

---

## 3. Four-State Privacy & Security Model

| State | Memory Capture | AI & Voice Behavior | Visual UI |
| :--- | :--- | :--- | :--- |
| **Memory Off** | Zero keystrokes or drafts saved | Explicit local or opt-in requests only | Baseline keyboard + Settings link |
| **Memory On** | Consented, eligible non-sensitive drafts → encrypted SQLite Room DB | Local Gemma assistance; opt-in cloud requests | Standard active theme |
| **Manual Incognito** | Capture and learning paused (15 min default, configurable) | Does not silently process private typing | Incognito strip + timer + active period icon |
| **Protected Input** | Automatic bypass on passwords, PINs, OTPs & banking apps (e.g., *Pine Bank* / banking sign-in) | Voice, cloud assistance & `m` capture disabled; cannot expire mid-field | **"Incognito is on · Automatic · Memory paused for this field"**, locked `m` key, highlighted hat-and-glasses glyph |

- **Hardware Encryption:** Local journal entries and attachments encrypted with **Android Keystore AES-256-GCM (TEE / StrongBox)** inside SQLite Room.
- **SDK Diagnostics:** Usage/performance diagnostics upload channels on Google's on-device ML Kit recognition/summarization components are disabled in the current build.
- **Optional Encrypted Google Drive Backup:** Uses Credential Manager Google Sign-In and Drive API v3 (`appDataFolder`) with explicit client-side encryption and user recovery key design.

---

## 4. Prototype Engineering Status & Stack Boundaries

Verified prototype status recorded in *Monolog - Startup Buildathon Final Prototype Submission.pdf*:
- **Build & Test Verification:**
  - Android 15 ARM64 debug APK built successfully
  - **53 unit tests passed** on the same build
  - APK passed **16 KB ZIP alignment verification**
  - Physical-device latency, RAM, battery, and time-saved field metrics remain pending validation
- **Technology Stack:**
  - **App & IME:** Native Kotlin, Android 12+ (API 31+), Jetpack Compose, Android `InputMethodService`, WorkManager
  - **Local AI & Vision:** Google **Gemma 3 270M IT** & LiteRT-LM (with weight download on supported devices), **ML Kit** OCR / image labels / object detection, Android speech & action APIs
  - **Cloud (Explicit Opt-In Only):** Firebase AI Logic + **Gemini 1.5 Flash** (subject to Gemma Terms of Use & Prohibited Use Policy), Wikipedia/web search providers, MET Norway forecast
  - **Development Tooling:** Google AI Studio, Antigravity IDE, Agent Skills

---

## 5. Proposed Subscription Plans & Legal Compliance

*Proposed India launch pricing — preview only, no billing backend active yet:*

| Tier | Price | Inclusions | Privacy Guarantee |
| :--- | :--- | :--- | :--- |
| **Monolog Free** | **₹0** forever | Borderless & key-bordered 6 themes, local journal & basic search, basic Vox & on-device writing aid, limited monthly Vox/AI pool, incognito & banking shield | Full Keystore encryption, manual incognito, local deletion & basic export stay free forever |
| **Monolog Pro** | **₹299 / month** or **₹3,372 / year** (₹281/mo · Save ₹216 / ~6%) | Expanded (10×) Vox & AI Ask pool, priority Gemma updates, Tone & Saved Writing Styles, natural-language memory questions, richer recaps, unlimited pins, Drive backup & founder support | Same strict opt-in cloud boundaries; canceling returns safely to Free without losing journals |

- **Privacy Policy:** Last updated **26 November 2026** (`/monolog/privacy` & `https://monolog.notokens.co/privacy`).
- **Terms of Use:** Last updated **23 November 2026** (`/monolog/tos` & `https://monolog.notokens.co/tos`).

---

## 6. Competitive Advantage & Go-To-Market

- **Workflow Consolidation:** Competes with Gboard/SwiftKey (typing), Wispr Flow/Typeless (AI voice), Grammarly (writing fixes), and Day One (journaling) by uniting them inside a single keyboard workflow—targeting elimination of daily app switches without giving up privacy.
- **Target Audience:** Android students and young professionals who message, dictate, set reminders, and track plans daily, reached via campus clubs, productivity creators, and Android communities.
