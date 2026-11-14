import OpenAI from "openai";

// * Service to generate study materials using Groq API. Uses GPT-OSS 120B by default.

export async function generateStudyWithAI({
  content,
  mode,
  difficulty,
  count,
}) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    throw new Error(
      "MISSING_API_KEY: Groq API key is not configured in server/.env.",
    );
  }

  // Initialize Groq client
  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  // Select model from environment variables
  const modelName = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  const prompt = `
You are Recallify's pedagogical AI engine. Your job is to transform educational notes, summaries, or topics into structured, interactive study materials.

CONTENT PROVIDED BY USER:
"""
${content}
"""

CONFIGURATION:
- Target Mode: ${mode} (Options: "flashcards", "quiz", "both")
- Difficulty Level: ${difficulty} (Options: "easy", "medium", "hard")
- Requested Item Count: ${count} per enabled mode

STRICT INSTRUCTIONS:
1. Base the questions directly on the user's content. Do not generate generic unrelated facts unless the input is just a broad topic name.

2. For Flashcards:
   - Provide concise, thought-provoking questions on the front.
   - Provide complete, conceptual, and unambiguous answers on the back.
   ${
     mode === "quiz"
       ? '- Since mode is "quiz", leave flashcards as an empty array: []'
       : `- Generate exactly ${count} high-quality flashcards.`
   }

3. For Quizzes:
   - Provide 4 distinct options per question.
   - Exactly one option must be unambiguously correct.
   - The "correctAnswer" property MUST be the 0-based integer index (0, 1, 2, or 3) of the correct option in the "options" array.
   - Provide a clear, educational "explanation" justifying why the correct answer is right and correcting common misconceptions.
   ${
     mode === "flashcards"
       ? '- Since mode is "flashcards", leave quiz as an empty array: []'
       : `- Generate exactly ${count} multiple-choice questions.`
   }

4. Generate a concise, informative "title" and a 1-2 sentence "summary".

5. Return ONLY a valid JSON object matching the schema below. Do not wrap in markdown or include conversational text.

REQUIRED JSON SCHEMA:
{
  "title": "Topic or Unit Title",
  "summary": "Brief 1-2 sentence summary of what this study material covers.",
  "flashcards": [
    {
      "id": "fc-1",
      "question": "Question text here",
      "answer": "Answer explanation here",
      "difficulty": "${difficulty}"
    }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "MCQ Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct",
      "difficulty": "${difficulty}"
    }
  ]
}
`;

  // Generate response using Groq
  const completion = await groq.chat.completions.create({
    model: modelName,

    messages: [
      {
        role: "system",
        content:
          "You are an expert educational content generator. Follow the user's instructions strictly and return valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.3,

    // Enforce JSON response format
    response_format: {
      type: "json_object",
    },
  });

  const rawText = completion.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error("EMPTY_AI_RESPONSE: Groq returned an empty response.");
  }

  // Validate the generated JSON before returning it
  try {
    JSON.parse(rawText);
  } catch (error) {
    throw new Error("INVALID_JSON_RESPONSE: Groq returned invalid JSON.");
  }

  return rawText;
}
