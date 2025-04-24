### PHASE 0: Project Setup

- [ ] Create project folder: `flashcard-extension`
- [ ] Set up React app inside `extension/` (Vite or CRA)
- [ ] Install dependencies: React, Tailwind (optional), TensorFlow.js, handpose
- [ ] Create `FlashcardContext` with provider and reducer
- [ ] Wrap `App` with `FlashcardProvider`

---

### PHASE 1: Chrome Extension Foundation

- [ ] Create `manifest.json` (v3)
  - Permissions: `activeTab`, `scripting`, `storage`
  - Declare popup and content script
- [ ] Create React popup UI (`Popup.jsx`)
- [ ] Create content script to capture highlighted text
- [ ] Use `chrome.runtime.sendMessage` to send selection to popup
- [ ] Add "Create Flashcard" button in popup
- [ ] Add selected text to Context state as a new `Flashcard` (starts in bucket 0)

---

### PHASE 2: Gesture Detection (TensorFlow.js)

- [ ] Add webcam feed component (`GestureDetector.jsx`)
- [ ] Load `@tensorflow-models/handpose`
- [ ] Detect:
  - Thumbs up → Easy
  - Flat hand → Hard
  - Thumbs down → Wrong
- [ ] Map gestures to `AnswerDifficulty`
- [ ] On detection, update flashcard rating and reassign to appropriate bucket

---

### PHASE 3: Flashcard Logic (Context API with BucketMap)

- [ ] Store flashcards using `BucketMap`:
  ```ts
  type BucketMap = Map<number, Set<Flashcard>>;
  ```
- [ ] On addCard:
  - Add new `Flashcard` to `bucket 0`
- [ ] On rateCard:
  - If `Wrong`: move to `bucket 0`
  - If `Hard`: optionally move down or stay
  - If `Easy`: move to next higher bucket
- [ ] Prioritize cards from lower-numbered buckets during review
- [ ] Create helper to get next flashcard for review based on bucket priority
- [ ] (Optional) Persist `BucketMap` in `localStorage`

---

### PHASE 4: Review UI

- [ ] Build review mode component
- [ ] Flip between front and back of flashcard
- [ ] Show current card from prioritized bucket
- [ ] Display gesture feedback in UI
- [ ] Show review progress (cards completed / total)

---

### PHASE 5: Polish and Package

- [ ] Test highlight to card creation flow
- [ ] Test gesture to rating logic
- [ ] Style UI (optional: Tailwind or custom CSS)
- [ ] Load unpacked extension in Chrome
- [ ] Package extension as ZIP for Chrome Web Store

---

### Bonus (Optional)

- [ ] Add edit/delete flashcard options
- [ ] Add manual back/answer or hint field in UI
- [ ] Add tag filtering by `Flashcard.tags`
- [ ] Add in-page overlay for flashcard creation
- [ ] Add dark mode or animation themes

---
