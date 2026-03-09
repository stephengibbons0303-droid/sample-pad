# 🎙️ SoundLoop — Record & Loop Studio

A kid-friendly Progressive Web App that lets children record sounds through a tablet microphone, loop them, layer up to 8 tracks, and shape each loop with real-time audio effects. Designed as a companion to [MusicPad](https://github.com/) (a notation-based composition tool), SoundLoop focuses on **sound exploration and experimentation** rather than traditional music theory.

Built for **Android tablets** (ages 7–10), runs entirely in the browser, works offline, and stores all data on-device.

---

## ✨ Features

### Recording
- **Press-and-hold to record** — large, color-coded buttons that children hold down to capture sound. The recording length is defined by how long they hold. No timers, no settings to configure.
- **Up to 8 loop layers** — each loop slot is independent with its own recording, effects, and mute state.
- **Instant looping** — recorded audio immediately begins looping via Tone.js Player nodes.

### Audio Effects (per loop)
Each loop has 6 real-time effects controlled by kid-friendly sliders and toggles:

| Effect | Control | Range | What It Does |
|--------|---------|-------|-------------- |
| 🎵 Pitch | Slider | -12 to +12 semitones | Shifts pitch up (chipmunk) or down (monster voice) |
| 🔁 Echo | Slider | 0–100% | Adds repeating delay with feedback |
| ⚡ Distort | Slider | 0–100% | Adds gritty, crunchy distortion |
| 🏛️ Reverb | Slider | 0–100% | Adds spacious room/hall reverb |
| 🏃 Speed | Slider | 25–200% | Speeds up or slows down playback |
| ⏪ Reverse | Toggle | On/Off | Plays the loop backwards |

Effects are chained per-loop as: **Player → PitchShift → FeedbackDelay → Distortion → Reverb → Destination**

### Transport & Mixing
- **Play All / Pause** — starts or pauses all loops simultaneously.
- **Stop** — stops all playback immediately.
- **Mute** — per-loop mute toggle for quick A/B comparisons.
- **Master Volume** — global output level control.
- **Clear All** — wipes all loops (with confirmation prompt).

### Save / Load / Export
- **Save projects** — stores loop audio data, effect settings, and mute states to IndexedDB. Full binary audio is preserved, not just references.
- **Load projects** — restores complete sessions including all effects. Shows loop count and save date.
- **Delete projects** — remove saved projects individually (with confirmation).
- **Export as .wav** — mixes all unmuted loops into a single WAV file and triggers a download. Children can share their creations or play them on any device.

### Waveform Display
- Selected loop shows a color-coded waveform visualization on a canvas.
- Waveform reflects reverse state in real-time.
- Auto-scales to panel width on resize.

### Guided Tutorial
- Step-by-step onboarding walkthrough (7 steps) that appears on first launch.
- Accessible any time via the **?** button.
- Covers recording, effects, transport, saving, and exporting.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript (single-file architecture) |
| Audio Engine | [Tone.js](https://tonejs.github.io/) v14.8.49 (Web Audio API) |
| Recording | MediaRecorder API → AudioBuffer decoding |
| Storage | IndexedDB (binary audio + project metadata) |
| Typography | [Nunito](https://fonts.google.com/specimen/Nunito) (Google Fonts) |
| Architecture | Progressive Web App with Service Worker |

### Audio Signal Flow

```
Microphone → MediaRecorder → Blob → decodeAudioData → Float32Array (raw storage)
                                                            ↓
                                              Tone.Player (looped) 
                                                            ↓
                                              Tone.PitchShift
                                                            ↓
                                              Tone.FeedbackDelay
                                                            ↓
                                              Tone.Distortion
                                                            ↓
                                              Tone.Reverb
                                                            ↓
                                              Tone.Destination (speakers)
```

---

## 📁 Project Structure

```
soundloop/
├── index.html       # Complete app (HTML + CSS + JS in single file)
├── manifest.json    # PWA manifest (standalone, landscape)
├── sw.js            # Service Worker (network-first, caches CDN assets)
├── icon-192.png     # PWA icon (192×192)
├── icon-512.png     # PWA icon (512×512)
└── README.md
```

---

## 📱 How to Install on a Tablet

This is a Progressive Web App — install it directly from the browser with no app store required.

### Android (Chrome)
1. Open **Google Chrome** on the tablet.
2. Navigate to your GitHub Pages URL:  
   `https://[your-username].github.io/soundloop/`
3. Tap the **three-dot menu** (top right) → **"Add to Home screen"** or **"Install app"**.
4. The app icon appears on the home screen and opens in full-screen landscape mode.

### iPad (Safari)
1. Open **Safari** on the iPad.
2. Navigate to the GitHub Pages URL.
3. Tap the **Share icon** (square with arrow) → **"Add to Home Screen"**.

### Permissions
The app will request **microphone access** on first launch. This is required for recording. A friendly prompt explains why before the browser permission dialog appears.

---

## 💻 Local Development

Browser security policies require serving via HTTP (not `file://`) for Service Workers and MediaRecorder to function.

### Quick Start
```bash
# Clone the repo
git clone https://github.com/[your-username]/soundloop.git
cd soundloop

# Serve locally (Python 3)
python -m http.server 8000

# Or with Node.js
npx serve .
```

Then open `http://localhost:8000` in Chrome.

### Testing Notes
- **Microphone**: required. Use a real device or enable virtual mic in browser DevTools.
- **Tone.js audio context**: requires a user gesture (tap/click) before audio plays — this is handled by the mic permission prompt.
- **Service Worker**: only active over HTTPS or localhost. Clear registration via DevTools → Application → Service Workers if testing changes.
- **IndexedDB**: inspect saved projects via DevTools → Application → IndexedDB → `SoundLoopDB`.

---

## 🎨 Design Decisions

### Why press-and-hold recording?
Traditional "tap to start / tap to stop" recording creates confusion for younger children — they forget to stop, or accidentally tap twice. Press-and-hold is intuitive: **the sound lasts exactly as long as you hold the button**. It also gives tactile feedback that something is happening.

### Why IndexedDB instead of localStorage?
MusicPad used localStorage, which has a ~5MB limit and only stores strings. Audio buffers for 8 loops can easily exceed this. IndexedDB handles large binary blobs efficiently and has no practical size limit for this use case.

### Why single-file HTML?
Matches MusicPad's architecture. For a PWA this size (~47KB), a single file keeps deployment trivial (drag-and-drop to GitHub), caching simple, and eliminates module bundling complexity. The tradeoff is maintainability at scale, which is acceptable for a focused tool.

### Why Tone.js?
The Web Audio API is powerful but verbose. Tone.js provides high-level abstractions for the exact operations this app needs: Player with looping, PitchShift, FeedbackDelay, Distortion, Reverb, and audio buffer manipulation. It's also the same engine used by MusicPad, keeping the ecosystem consistent.

### Effect ranges
All sliders use 0–100 percentage ranges (except pitch in semitones and speed in percentage) because children understand "more" and "less" intuitively. The internal scaling to Tone.js parameter ranges is hidden.

---

## 🔗 Companion App

**SoundLoop** is designed as a companion to **MusicPad** — a notation-based music composition PWA for the same age group.

| | MusicPad | SoundLoop |
|---|---------|-----------|
| Focus | Written music / notation | Sound recording / experimentation |
| Input | Note buttons / piano keyboard | Microphone recording |
| Output | Sheet music + playback | Layered loop mix |
| Audio | Sampled piano (Salamander) | Live mic recording |
| Storage | localStorage | IndexedDB |
| Export | — | .wav download |

Both apps share the same visual language (Nunito font, blue gradient palette, rounded card UI, tutorial system) so children experience them as a unified toolkit.

---

## 🔒 Privacy

- **No tracking, analytics, or telemetry.**
- **No backend server or cloud storage.** All data lives exclusively on the device in IndexedDB.
- **No network requests** beyond initial CDN loads (Tone.js, Google Fonts). The Service Worker caches these for offline use.
- **Microphone audio never leaves the device.** Recordings are stored locally and are only accessible within the app.
- Clearing browser data or uninstalling the PWA deletes all saved projects permanently.

---

## 📋 Known Limitations (v1)

| Area | Limitation | Notes |
|------|-----------|-------|
| Export | .wav mix is a simple sum of raw buffers | Pitch/echo/distortion/reverb effects are not baked into the export — only speed and reverse are applied. Full offline rendering would require Tone.js OfflineContext. |
| Recording | WebM codec via MediaRecorder | Quality depends on device mic and browser codec support. Chrome on Android produces good results. |
| Effects | Reverb initialization | Tone.Reverb generates an impulse response asynchronously. Very fast effect changes may briefly glitch. |
| Loops | No time-sync between loops | Loops are independent and don't quantize to a shared tempo grid. This is by design for free-form experimentation but means loops may drift. |
| Browser | Chrome recommended | Full support for Chrome on Android. Safari has partial MediaRecorder support (may require polyfill on older iOS versions). |

---

## 📄 License

MIT — free to use, modify, and distribute.
