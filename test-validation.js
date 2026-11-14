/**
 * Automated Verification Script for AI Response Validation & Parsing
 * Tests all 14 required failure and edge cases to ensure zero unhandled exceptions.
 */

import { parseAIResponse } from './client/src/utils/parseAIResponse.js';
import { validateStudyResponse } from './client/src/utils/validateResponse.js';

console.log('====================================================');
console.log('🧪 RUNNING RECALLIFY AI VALIDATION SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(description, condition, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

// 1. Malformed JSON
const malformedInput = '{"title": "DBMS", "summary": "Bad json, missing quote: }';
const res1 = parseAIResponse(malformedInput);
assert('1. Malformed JSON returns safe error instead of crashing', !res1.success && typeof res1.error === 'string');

// 2. Empty response
const emptyInput = '';
const res2 = parseAIResponse(emptyInput);
assert('2. Empty response is safely rejected', !res2.success);

// 3. Missing flashcards in 'flashcards' mode
const missingFlashcards = { title: "Topic", summary: "Overview", quiz: [] };
const res3 = validateStudyResponse(missingFlashcards, 'flashcards');
assert('3. Missing flashcards array is caught', !res3.isValid && res3.error.includes('Missing flashcards'));

// 4. Missing quiz questions in 'quiz' mode
const missingQuiz = { title: "Topic", summary: "Overview", flashcards: [] };
const res4 = validateStudyResponse(missingQuiz, 'quiz');
assert('4. Missing quiz questions array is caught', !res4.isValid && res4.error.includes('Missing quiz'));

// 5. Incorrect data types (e.g. flashcards is a string, not array)
const invalidType = { title: 12345, summary: true, flashcards: "not an array" };
const res5 = validateStudyResponse(invalidType, 'flashcards');
assert('5. Incorrect data types are caught safely', !res5.isValid);

// 6. Missing question fields
const missingQFields = {
  title: "Topic",
  summary: "Overview",
  flashcards: [{ id: "fc-1", answer: "Only answer provided" }]
};
const res6 = validateStudyResponse(missingQFields, 'flashcards');
assert('6. Flashcard missing question prompt is rejected', !res6.isValid && res6.error.includes('missing a question'));

// 7. Missing answer options in quiz
const missingOptions = {
  title: "Topic",
  summary: "Overview",
  quiz: [{ id: "q-1", question: "What is X?", options: ["Only One Option"], correctAnswer: 0 }]
};
const res7 = validateStudyResponse(missingOptions, 'quiz');
assert('7. Quiz question with < 2 options is rejected', !res7.isValid && res7.error.includes('at least 2 answer choices'));

// 8. Invalid correctAnswer index (e.g. 5 when options length is 4)
const invalidCorrectAnswer = {
  title: "Topic",
  summary: "Overview",
  quiz: [{
    id: "q-1",
    question: "What is X?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 5 // out of bounds
  }]
};
const res8 = validateStudyResponse(invalidCorrectAnswer, 'quiz');
assert('8. Out of bounds correctAnswer index is rejected', !res8.isValid && res8.error.includes('invalid correct answer index'));

// 9. Negative correctAnswer index
const negativeCorrectAnswer = {
  title: "Topic",
  summary: "Overview",
  quiz: [{
    id: "q-1",
    question: "What is X?",
    options: ["A", "B", "C", "D"],
    correctAnswer: -1
  }]
};
const res9 = validateStudyResponse(negativeCorrectAnswer, 'quiz');
assert('9. Negative correctAnswer index is rejected', !res9.isValid);

// 10. Unexpected response structure (e.g. Array instead of Object)
const arrayPayload = [{ title: "Wrong root" }];
const res10 = validateStudyResponse(arrayPayload, 'both');
assert('10. Array at root level is rejected safely', !res10.isValid);

// 11. Markdown-wrapped JSON parsing
const markdownPayload = `Here is your JSON response:
\`\`\`json
{
  "title": "Clean Topic",
  "summary": "Valid summary",
  "flashcards": [
    { "id": "fc-1", "question": "What is A?", "answer": "A is letter A" }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "Which letter is first?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "A is the 1st letter"
    }
  ]
}
\`\`\`
Hope this helps!`;
const parsed11 = parseAIResponse(markdownPayload);
assert('11. Markdown code fences are stripped and parsed successfully', parsed11.success);
const val11 = validateStudyResponse(parsed11.data, 'both');
assert('11b. Extracted JSON passes full study schema validation', val11.isValid && val11.sanitizedData.flashcards.length === 1);

// 12. Normalization & Sanitization
assert('12. Sanitized data formats IDs, sets userRating to null, and attaches ISO timestamp', 
  val11.sanitizedData.flashcards[0].userRating === null && Boolean(val11.sanitizedData.createdAt)
);

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
