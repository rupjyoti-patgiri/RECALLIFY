# Recallify — AI-Powered Interactive Study Assistant

Recallify is an active-recall study assistant that transforms your notes or a topic into interactive flashcards and multiple-choice quizzes. It helps learners practise retrieval, check their understanding, revisit mistakes, and track their study activity.

The application combines a React frontend with an Express backend. The backend sends generation requests to the Groq API, while the browser stores study sessions and progress locally.

## ✨ Features

- **AI-Generated Study Material:** Generate flashcards, quizzes, or both from your notes or a topic.
- **Configurable Practice:** Choose study mode, difficulty (Easy, Medium, or Hard), and number of questions.
- **Interactive Flashcards:** Flip cards, navigate between them, and rate your understanding.
- **MCQ Practice:** Answer questions with immediate correctness feedback and explanations.
- **Mistake Review:** Revisit questions answered incorrectly and practise them again.
- **Progress Tracking:** Monitor study activity, quiz performance, and learning progress.
- **Local Storage Persistence:** Save study sessions and progress across browser sessions.
- **Curated Demo Content:** Explore sample material for DBMS, Operating Systems, JavaScript, and Computer Networks.
- **Request Handling:** Cancel pending generation requests and handle API, parsing, and validation errors.

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, JavaScript (ES Modules), Vite 6, React Router |
| Styling | Tailwind CSS 3 |
| UI Components | Lucide React, Canvas Confetti |
| Backend | Node.js, Express.js |
| AI Integration | Groq API, OpenAI JavaScript SDK |
| AI Model | `openai/gpt-oss-120b` (configurable) |
| Persistence | Browser Local Storage |
| Validation | Custom JSON Parsing and Schema Validation |

## 📁 Project Structure

```text
RECALLIFY/
├── client/
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Application pages
│       ├── services/         # Frontend API integration
│       └── utils/            # Parsing, validation, and demo data
│
├── server/
│   ├── controllers/          # Request handling
│   ├── routes/               # API routes
│   ├── services/             # Groq AI integration
│   ├── utils/                # Input validation
│   ├── .env.example          # Environment variable template
│   └── server.js             # Express server entry point
│
├── test-validation.js        # AI response validation tests
├── package.json              # Root scripts
└── README.md
```

## 🚀 Installation and Setup

### Prerequisites

Make sure you have the following installed:

- Node.js 20 or later (recommended).
- npm 9 or later.
- A Groq API key for AI-powered generation.

Get your API key from the [Groq Console](https://console.groq.com/).

### 1. Clone the Repository

```bash
git clone https://github.com/rupjyoti-patgiri/RECALLIFY.git

cd RECALLIFY
```

### 2. Install Dependencies

From the project root, execute:

```bash
npm run install:all
```

This installs dependencies for the root project, frontend, and backend.

Alternatively, install dependencies separately:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Configure Environment Variables

Navigate to the `server` directory and create a `.env` file using `.env.example`.

**Windows PowerShell:**

```powershell
Copy-Item server/.env.example server/.env
```

**Linux / macOS / Git Bash:**

```bash
cp server/.env.example server/.env
```

Add your Groq API credentials to `server/.env`:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

**Important:**
- Never expose your API key in frontend code.
- Never commit your `.env` file to GitHub.
- The backend reads `GROQ_API_KEY` and optionally `GROQ_MODEL`.
- The default model is `openai/gpt-oss-120b`.

### 4. Start the Application

From the project root, run:

```bash
npm run dev
```

This starts both the frontend and backend concurrently.

| Service | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:5000 |
| Backend Health Check | http://localhost:5000/api/health |

Open the frontend URL in your browser.

**Running Services Individually**

Backend:

```bash
npm run server:dev
```

Frontend:

```bash
npm run client:dev
```

## 📖 How to Use Recallify

1. Open the application in your browser.
2. Enter your study notes or a topic in the workspace.
3. Select your preferred study mode:
   - Flashcards
   - Quiz
   - Both
4. Choose the difficulty level: Easy, Medium, or Hard.
5. Select the number of flashcards or quiz questions to generate.
6. Generate your study material.
7. Start practising using the interactive flashcards or MCQ quizzes.
8. Review incorrect answers through the Mistake Review section.
9. Visit the Progress section to track your study activity and performance.

You can also explore the built-in sample datasets for DBMS, Operating Systems, JavaScript, and Computer Networks.

## 🔌 API Documentation

The Express backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks backend health and API key configuration |
| POST | `/api/generate-study-material` | Generates flashcards and/or quiz questions |

### Generate Study Material

**Endpoint:**

```http
POST /api/generate-study-material
```

**Request Body:**

```json
{
  "content": "Database normalization reduces data redundancy...",
  "mode": "both",
  "difficulty": "medium",
  "count": 5
}
```

**Supported Parameters:**

| Parameter | Accepted Values |
|---|---|
| content | Non-empty text, maximum 15,000 characters |
| mode | `flashcards`, `quiz`, `both` |
| difficulty | `easy`, `medium`, `hard` |
| count | Between 1 and 25 |

A successful response contains a title, summary, flashcards, and quiz questions according to the requested mode.

## 🤖 AI Integration and Response Validation

Recallify uses the Groq API through the OpenAI JavaScript SDK to generate educational content.

The AI integration follows this architecture:

1. The user submits notes or a topic through the React frontend.
2. The frontend sends a request to the Express backend.
3. The backend validates the input and forwards it to the configured Groq model.
4. The model generates structured JSON containing flashcards, MCQs, and explanations.
5. The backend parses the generated JSON and handles invalid responses.
6. The frontend performs additional parsing and schema validation.
7. Validated content is displayed in the appropriate learning interface.

### Why Use a Backend?

- **API Key Security:** Keeps the Groq API key on the server instead of exposing it in the frontend.
- **Input Validation:** Rejects invalid requests before sending them to the AI service.
- **Rate Limiting:** Uses `express-rate-limit` to limit API requests.
- **Error Handling:** Handles authentication failures, quota limits, and service errors.

### Three-Layer Response Validation

AI-generated responses are treated as untrusted data.

Recallify uses the following validation approach:

**1. Backend Validation**
- Validates user input.
- Checks content length and requested generation parameters.
- Parses the JSON returned by the AI model.

**2. Frontend Parsing**
- Parses valid JSON responses.
- Attempts to extract JSON from Markdown code blocks.
- Handles malformed or unexpected responses gracefully.

**3. Schema Validation**
- Checks required flashcard and quiz arrays.
- Validates question and answer fields.
- Checks answer options.
- Verifies that the correct-answer index is valid.
- Prevents invalid AI responses from reaching the UI.

## 🧪 Running Tests

Recallify includes a validation test script for checking AI response parsing and schema validation.

Run the following command from the project root:

```bash
npm test
```

The tests cover scenarios such as:

- Malformed JSON responses.
- Empty AI responses.
- Missing flashcard or quiz arrays.
- Incorrect data types.
- Missing question fields.
- Invalid correct-answer indexes.
- Markdown-wrapped JSON responses.
- Response sanitization.

## 💾 Data Storage and Privacy

- Study sessions and learning progress are stored in browser `localStorage`.
- Data persists across browser sessions on the same browser and origin.
- There is currently no database-backed account system or cross-device synchronization.
- User-submitted content is sent to the configured Groq service when AI generation is requested.
- Clearing browser site data can remove locally saved study sessions and progress.
- The Groq API key is maintained on the backend.

## ⚠️ Known Limitations

- **Local Storage:** Study data is stored locally in the browser and is not synchronized across devices.
- **Storage Capacity:** Browser local storage has limited capacity. Saving many large study sessions may eventually exceed the available quota.
- **AI Accuracy:** Generated flashcards, answers, and explanations may occasionally contain inaccurate or incomplete information. Important academic content should be verified.
- **External API Dependency:** AI generation requires an active internet connection, a working backend, a valid Groq API key, and available API quota.
- **Generation Failures:** The AI model may occasionally return incomplete or invalid structured content. The validation layer handles these cases, but cannot guarantee factual correctness.
- **Offline Support:** Curated demo datasets are available for DBMS, Operating Systems, JavaScript, and Computer Networks. Generating material for arbitrary topics still requires the AI service.
- **Mathematical Notation:** Complex mathematical expressions may appear as plain text rather than properly rendered mathematical notation.
- **Learning Analytics:** Progress metrics reflect application activity and quiz performance. They are not a scientifically validated measurement of long-term retention.

## 🧠 AI Usage Disclosure

AI tools were used during the development of Recallify as an assistance resource.

- **AI Coding Assistant:** Used for brainstorming implementation approaches, generating and refining portions of boilerplate code, debugging suggestions, and improving documentation.
- **Groq API:** Integrated into the application as the runtime AI service for generating flashcards, multiple-choice questions, and conceptual explanations from user-provided content.
- **Developer Contributions:** Project integration, feature implementation, AI prompt design, response validation, testing, and final implementation decisions were reviewed and adapted during development.

AI-generated suggestions were not treated as automatically correct. Generated code and AI responses required review, testing, and refinement.

## ⏱️ Development Time

**Approximate Total Development Time: 5 Hours 15 Minutes**

| Development Phase | Estimated Time |
|---|---:|
| Architecture and Project Setup | 45 minutes |
| UI Design and Interactive Components | 1 hour 30 minutes |
| AI Integration, Backend, and Validation | 1 hour 15 minutes |
| Local Storage, Mistake Review, and Analytics | 1 hour |
| Testing and Documentation | 45 minutes |
| **Total** | **5 hours 15 minutes** |

These are approximate development estimates rather than measured execution times.

## 🔮 Future Improvements

- User authentication and cloud-based study-session synchronization.
- Spaced-repetition scheduling for improved revision.
- Rich rendering support for mathematical expressions, code, and diagrams.
- Import and export functionality for study materials.
- Improved evaluation of AI-generated questions and factual correctness.
- More detailed learning analytics and retention insights.

## 📄 License

No license has been specified for this repository yet. Reuse and redistribution are therefore not granted by an explicit open-source license.

---

**Built to make studying more active, structured, and engaging.**
