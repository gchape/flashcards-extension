### PHASE 0: Project Setup ✅

- [ ] Create project folder: `flashcard-extension`
- [ ] Set up React app inside `extension/` (Vite or CRA)
- [ ] Install dependencies: React, Tailwind (optional), TensorFlow.js, handpose
- [ ] Create `FlashcardContext` with provider and reducer
- [ ] Wrap `App` with `FlashcardProvider`

---

### PHASE 1: Backend Server ✅

- [ ] Create Express server in `src/backend/server/server.js`
- [ ] Set up WebSocket server for real-time communication
- [ ] Implement endpoint for adding new flashcards (`/add-card`)
- [ ] Configure CORS for cross-origin requests
- [ ] Establish WebSocket connection for real-time updates

---

### PHASE 2: Frontend UI Components ✅

- [ ] Create main app structure (`App.tsx`)
- [ ] Implement header component
- [ ] Create flashcard display component
- [ ] Build action bar with buttons
- [ ] Style components with CSS modules
- [ ] Implement basic flashcard navigation

---

### PHASE 3: Chrome Extension 

- [ ] Create `manifest.json` (v3)
- [ ] Build popup UI (HTML/CSS)
- [ ] Implement JavaScript for the popup
- [ ] Connect popup to backend server
- [ ] Style extension UI

---

### PHASE 4: Gesture Detection Implementation 

- [ ] Set up TensorFlow.js and MediaPipe
- [ ] Implement webcam feed setup
- [ ] Create gesture detection functions
- [ ] Implement gesture recognition logic:
  - Thumbs up → Easy
  - Thumbs down → Wrong
  - Raised hand → Hard
- [ ] Connect detection with flashcard rating

---

### PHASE 5: Flashcard Algorithm 

- [ ] Implement spaced repetition algorithm
- [ ] Create bucket system for organizing cards
- [ ] Build practice mode functionality
- [ ] Implement difficulty-based card movement between buckets

---

### PHASE 6: Integration and Real-time Updates 

- [ ] Connect gesture detection results to difficulty ratings
- [ ] Update `ActionBar.tsx` to handle gesture recognition results
- [ ] Wire up button clicks to update card difficulty
- [ ] Process WebSocket messages for real-time flashcard updates
- [ ] Make sure new cards from extension appear immediately

---

### PHASE 7: Testing and Debugging 

- [ ] Test WebSocket communication
- [ ] Debug gesture recognition accuracy
- [ ] Test browser extension functionality
- [ ] Ensure card progression works correctly
- [ ] Verify spaced repetition algorithm implementation

---

### PHASE 8: User Experience Improvements 

- [ ] Add loading states
- [ ] Implement error handling for server connection issues
- [ ] Add visual feedback for gesture recognition
- [ ] Improve webcam feed placement and styling
- [ ] Add instructions for first-time users

---

### PHASE 9: Final Polishing 

- [ ] Refactor code for better organization
- [ ] Optimize performance
- [ ] Add more helpful hints and messages
- [ ] Fix any UI/UX issues
- [ ] Add analytics for tracking user progress (optional)