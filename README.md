# Recallify — AI-Powered Interactive Study Assistant

Recallify is a production-quality, active-recall study assistant that transforms user-provided notes, lecture outlines, and educational topics into interactive learning experiences. Instead of acting as a generic conversational chatbot, Recallify strictly produces structured pedagogical JSON payloads, validates them against strict schemas, and renders them into specialized learning environments including 3D flip flashcards, interactive MCQ quizzes with instant feedback, a mistake-review bank, and retention analytics.

---

## 1. Project Overview

Active recall and spaced repetition are the most scientifically validated methods for long-term knowledge retention. Recallify eliminates the manual friction of authoring study sets by analyzing raw student notes and automatically generating:
- **Active Recall Flashcards** with concise conceptual prompts and comprehensive answers.
- **Formative Multiple-Choice Quizzes** with distractor options and pedagogical explanations.
- **Targeted Mistake Review** that captures incorrect responses and enables focused re-testing until mastery is achieved.
- **Visual Analytics** tracking study sessions, flashcards flipped, quiz accuracy, and retention rates.

---

## 2. Key Features

- **Warm Editorial EdTech Design System**: Crafted with a distinctive editorial identity (warm off-white background `#F8F7F2`, vibrant coral `#FF7657`, muted lavender `#B8A8E8`, and deep charcoal `#202124`) using Google Fonts (*Newsreader* serif headings paired with *Plus Jakarta Sans* body text).
- **Interactive 3D Flashcards**: True 3D card-flip animations with keyboard shortcuts (`Space` to flip, `ArrowLeft` / `ArrowRight` to navigate, `1`/`2`/`3` for Difficulty ratings: Hard, Medium, Easy).
- **MCQ Quizzes with Immediate Pedagogical Feedback**: Single-question focus with immediate visual verification, correct answer highlighting, and rationale explanations.
- **Dedicated Mistake Review & Mastery Engine**: Questions missed during quizzes are automatically routed to the Mistake Review bank. When a student re-tests and answers correctly, the question is cleared from the review bank.
- **Comprehensive Local Storage Persistence**: Study units, flashcard ratings, mistake tracking, quiz metrics, and chronological activity logs are saved across browser sessions.
- **Pre-loaded Curated Curricula**: Pre-configured with rich study sets across DBMS, Operating Systems, JavaScript Engine Mechanics, and Computer Networks for instant offline testing and demonstration.
- **AbortController & Race Condition Protection**: Cancels in-flight generation requests when navigating or re-requesting, preventing stale responses from overwriting the UI.

---

## 3. Technology Stack

### Frontend:
- **Framework**: React 19 (Functional Components & React Hooks only)
- **Language**: JavaScript (Pure ES Modules, `.js` / `.jsx` exclusively — strictly NO TypeScript)
- **Build Tool**: Vite 6
- **Routing**: React Router v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v3 with customized typography, paper texture utilities, and 3D flip transforms
- **Icons**: Lucide React
- **Celebration Feedback**: Canvas Confetti

### Backend:
- **Runtime**: Node.js (v20+ LTS)
- **Framework**: Express.js
- **AI Integration**: Official Google Gemini SDK (`@google/generative-ai`)
- **Middleware**: CORS, `express.json` with 1MB payload limits, IP-based rate limiting (`express-rate-limit`)
- **Environment**: Dotenv for secure API key isolation

### Storage:
- **Client Storage**: Browser `localStorage` via a custom `useLocalStorage` hook with quota error protection and JSON serialization safeguards.

---

## 4. Folder Structure

```
Recallify/
├── package.json                 # Root script coordinator (concurrently dev runner)
├── .gitignore                   # Ignores node_modules, dist, and .env files
├── README.md                    # Project documentation & interview guide
├── test-validation.js           # Automated validation suite (13 test cases)
│
├── client/                      # Frontend React application
│   ├── index.html               # HTML entry with Newsreader & Plus Jakarta Sans fonts
│   ├── package.json             # Frontend dependencies (React, Vite, Tailwind, Lucide)
│   ├── vite.config.js           # Vite build configuration
│   ├── tailwind.config.js       # Custom warm editorial EdTech theme
│   ├── postcss.config.js        # PostCSS with Tailwind & Autoprefixer
│   │
│   └── src/
│       ├── main.jsx             # React DOM root mounting
│       ├── App.jsx              # App layout, router, state synchronization, toasts
│       ├── index.css            # Base Tailwind imports & 3D card CSS transforms
│       │
│       ├── components/
│       │   ├── Navbar.jsx       # Editorial brand header, navigation links & badge
│       │   ├── Flashcard.jsx    # 3D interactive flashcard with self-rating
│       │   ├── QuizQuestion.jsx # Single-question MCQ with immediate feedback
│       │   ├── ProgressCard.jsx # Stat metric card
│       │   ├── LoadingState.jsx # Animated pedagogical progress & cancel button
│       │   ├── ErrorState.jsx   # User-friendly error card with retry/sample options
│       │   ├── EmptyState.jsx   # Editorial empty state component
│       │   ├── Toast.jsx        # Non-intrusive action notification toast
│       │   └── ConfirmModal.jsx # Accessible confirmation modal dialog
│       │
│       ├── pages/
│       │   ├── Home.jsx         # Workspace landing: input, parameters & saved sessions
│       │   ├── Flashcards.jsx   # Dedicated flashcard study environment
│       │   ├── Quiz.jsx         # Interactive quiz view with results & confetti
│       │   ├── MistakeReview.jsx# Targeted re-testing of missed questions
│       │   └── Progress.jsx     # Analytics, retention chart & recent activity log
│       │
│       ├── hooks/
│       │   └── useLocalStorage.js # Custom hook for localStorage syncing
│       │
│       ├── services/
│       │   └── studyService.js  # API client with AbortSignal & offline fallback
│       │
│       └── utils/
│           ├── parseAIResponse.js  # Safely extracts JSON from markdown fences
│           ├── validateResponse.js # Strict schema validator for AI payloads
│           └── mockData.js         # Curated DBMS, OS, JS, and Networks demo sets
│
└── server/                      # Express backend proxy
    ├── package.json             # Express, @google/generative-ai, cors, rate-limit
    ├── server.js                # Server entry, rate limiting, error middleware
    ├── .env                     # Local environment file (API keys)
    ├── .env.example             # Template for required environment variables
    │
    ├── routes/
    │   └── studyRoutes.js       # Router mounting POST /api/generate-study-material
    │
    ├── controllers/
    │   └── studyController.js   # Request handling, input validation, and parsing
    │
    ├── services/
    │   └── geminiService.js     # Google Gemini API integration with JSON mode
    │
    └── utils/
        └── validateInput.js     # Server-side request payload validation
```

---

## 5. Installation Instructions

### Prerequisites:
- Node.js version `v18.0.0` or higher (tested on `v20.19.0`)
- npm version `9.0.0` or higher

### Step 1: Clone or Navigate to the Workspace
```bash
cd d:\Projects\Recallify
```

### Step 2: Install All Dependencies
Install root, client, and server dependencies in one command:
```bash
npm run install:all
```
*(Or manually run `npm install` in the root, `client/`, and `server/` directories).*

---

## 6. Environment Variable Configuration

Recallify isolates all sensitive credentials in the backend:
1. Navigate to the `server/` directory.
2. Locate or create `.env` using `.env.example`:
```bash
cp server/.env.example server/.env
```
3. Set your Google Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```
*Note: If no API key is set, the application continues to run in offline demo mode using curated high-quality datasets for DBMS, OS, JavaScript, and Computer Networks.*

---

## 7. How to Run the Frontend and Backend

### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
This starts:
- **Express Backend**: `http://localhost:5000`
- **Vite React Frontend**: `http://localhost:5173`

### Option B: Run Services Individually
In terminal 1 (Backend):
```bash
npm run server:dev
```

In terminal 2 (Frontend):
```bash
npm run client:dev
```

### Run the Automated Validation Suite:
```bash
npm test
```

---

## 8. AI Integration & Prompt Architecture

Recallify communicates with Google Gemini (`gemini-1.5-flash`) via the Express backend (`POST /api/generate-study-material`).

### Why an Express Backend?
1. **Security**: The Gemini API key is never exposed to the client bundle or network tab.
2. **Rate Limiting & Abuse Prevention**: Requests are throttled using `express-rate-limit`.
3. **Prompt Hardening**: The backend injects system instructions enforcing:
   - Output mime-type: `application/json`
   - Strict 0-indexed `correctAnswer` integers (0 to 3) matching the `options` array.
   - Generation of high-clarity educational explanations addressing common misconceptions.
   - Elimination of markdown banter, code fences, and hallucinated wrappers.

---

## 9. Robust AI Response Validation (Error-Handling Approach)

AI models are probabilistic and inherently non-deterministic. Recallify treats AI output as **untrusted data** and applies a 3-layer validation pipeline:

### Pipeline:
1. **Extraction (`parseAIResponse.js`)**:
   - Strips leading/trailing markdown code fences (````json ... ````).
   - Extracts balanced outer braces if conversational text is present.
   - Handles `JSON.parse` inside structured `try/catch` blocks.
2. **Schema Verification (`validateResponse.js`)**:
   - Ensures `title` and `summary` are valid non-empty strings.
   - Validates that `flashcards` and `quiz` arrays exist according to the requested mode.
   - Confirms each quiz item contains at least 4 distinct non-empty options.
   - Asserts `0 <= correctAnswer < options.length` as an integer.
   - Prevents `undefined` or partial data from reaching React component trees.
3. **Graceful Fallback & UI Protection**:
   - Emits human-friendly error messages (e.g. rate limit, authentication, timeout).
   - Provides an immediate **"Try Again"** button, a **"Back to Workspace"** link, and a **"Use Sample Material"** fallback.
   - Employs `AbortController` to cancel pending HTTP requests upon new user actions.

---

## 10. AI Tool Usage Disclosure

In compliance with assignment guidelines, AI tools were utilized during the development of Recallify:
- **Google Gemini API**: Utilized at runtime by the application backend to generate study flashcards, multiple-choice questions, and conceptual explanations from user input.
- **AI Coding Assistant**: Utilized as an architectural accelerator for boilerplate configuration, theme palette definition, and drafting test cases. All code logic, component hierarchy, validation utilities, and documentation have been reviewed, tested, and verified for production readiness.

---

## 11. Known Limitations

- **Browser Storage Limits**: LocalStorage has an origin limit of ~5MB. If a student saves hundreds of large study units, older sessions may need to be pruned.
- **Complex Mathematical Notation**: Raw LaTeX math expressions inside notes are parsed as text strings rather than rendered via a KaTeX canvas.
- **Network Latency with LLMs**: Large study units (20 questions + 20 flashcards) may take 4–8 seconds to generate on Gemini free-tier endpoints. To mitigate user frustration, step-by-step educational skeleton loaders with abort capabilities are displayed.

---

## 12. Approximate Development Time

- **Phase 1 (Architecture & Setup)**: 45 minutes
- **Phase 2 (Design System & Interactive UI)**: 1 hour 30 minutes
- **Phase 3 (AI Integration, Express Proxy & Validation Suite)**: 1 hour 15 minutes
- **Phase 4 (LocalStorage Persistence, Mistakes Bank & Analytics)**: 1 hour
- **Phase 5 (Testing, Cross-Browser Verification & Documentation)**: 45 minutes
- **Total Development Time**: ~5 hours 15 minutes
