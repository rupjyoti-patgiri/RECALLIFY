/**
 * Recallify Study Response Validation Utility
 * 
 * Validates AI study output structures against expected schemas
 * to protect React components from runtime failures and partial/corrupted rendering.
 */

/**
 * Validates the structured study response from AI/backend.
 * @param {any} data - Parsed JSON object from AI or API
 * @param {'flashcards' | 'quiz' | 'both'} mode - Expected content mode
 * @returns {{ isValid: boolean, error: string | null, sanitizedData: object | null }}
 */
export function validateStudyResponse(data, mode = 'both') {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      isValid: false,
      error: 'Invalid AI response: Expected an object but received an empty or non-object payload.',
      sanitizedData: null
    };
  }

  // Validate Title
  const title = (typeof data.title === 'string' && data.title.trim())
    ? data.title.trim()
    : 'Untitled Study Session';

  // Validate Summary
  const summary = (typeof data.summary === 'string' && data.summary.trim())
    ? data.summary.trim()
    : 'Summary not provided.';

  let sanitizedFlashcards = [];
  let sanitizedQuiz = [];

  // Validate Flashcards if mode requires it
  if (mode === 'flashcards' || mode === 'both') {
    if (!Array.isArray(data.flashcards)) {
      return {
        isValid: false,
        error: 'Missing flashcards array: Expected "flashcards" to be a list in the AI response.',
        sanitizedData: null
      };
    }

    if (data.flashcards.length === 0) {
      return {
        isValid: false,
        error: 'The AI returned an empty flashcard list. Please try again with more detailed notes.',
        sanitizedData: null
      };
    }

    for (let i = 0; i < data.flashcards.length; i++) {
      const card = data.flashcards[i];
      if (!card || typeof card !== 'object') {
        return {
          isValid: false,
          error: `Malformed flashcard item at index ${i + 1}: expected an object.`,
          sanitizedData: null
        };
      }

      const question = typeof card.question === 'string' ? card.question.trim() : '';
      const answer = typeof card.answer === 'string' ? card.answer.trim() : '';

      if (!question) {
        return {
          isValid: false,
          error: `Flashcard #${i + 1} is missing a question prompt.`,
          sanitizedData: null
        };
      }

      if (!answer) {
        return {
          isValid: false,
          error: `Flashcard #${i + 1} is missing an answer explanation.`,
          sanitizedData: null
        };
      }

      sanitizedFlashcards.push({
        id: card.id ? String(card.id) : `fc-${i + 1}-${Date.now().toString(36)}`,
        question,
        answer,
        difficulty: card.difficulty || 'medium',
        userRating: null // 'easy' | 'medium' | 'hard' | null
      });
    }
  }

  // Validate Quiz if mode requires it
  if (mode === 'quiz' || mode === 'both') {
    if (!Array.isArray(data.quiz)) {
      return {
        isValid: false,
        error: 'Missing quiz questions array: Expected "quiz" to be a list in the AI response.',
        sanitizedData: null
      };
    }

    if (data.quiz.length === 0) {
      return {
        isValid: false,
        error: 'The AI returned an empty quiz list. Please try again with more specific content.',
        sanitizedData: null
      };
    }

    for (let i = 0; i < data.quiz.length; i++) {
      const q = data.quiz[i];
      if (!q || typeof q !== 'object') {
        return {
          isValid: false,
          error: `Malformed quiz question at index ${i + 1}: expected an object.`,
          sanitizedData: null
        };
      }

      const question = typeof q.question === 'string' ? q.question.trim() : '';
      if (!question) {
        return {
          isValid: false,
          error: `Quiz question #${i + 1} is missing its question text.`,
          sanitizedData: null
        };
      }

      if (!Array.isArray(q.options) || q.options.length < 2) {
        return {
          isValid: false,
          error: `Quiz question #${i + 1} must contain at least 2 answer choices (expected 4).`,
          sanitizedData: null
        };
      }

      const cleanedOptions = q.options.map(opt => typeof opt === 'string' ? opt.trim() : String(opt || ''));
      if (cleanedOptions.some(opt => !opt)) {
        return {
          isValid: false,
          error: `Quiz question #${i + 1} contains empty answer options.`,
          sanitizedData: null
        };
      }

      // Validate correctAnswer index
      const correctIdx = Number(q.correctAnswer);
      if (isNaN(correctIdx) || !Number.isInteger(correctIdx) || correctIdx < 0 || correctIdx >= cleanedOptions.length) {
        return {
          isValid: false,
          error: `Quiz question #${i + 1} has an invalid correct answer index (${q.correctAnswer}).`,
          sanitizedData: null
        };
      }

      sanitizedQuiz.push({
        id: q.id ? String(q.id) : `q-${i + 1}-${Date.now().toString(36)}`,
        question,
        options: cleanedOptions,
        correctAnswer: correctIdx,
        explanation: (typeof q.explanation === 'string' && q.explanation.trim())
          ? q.explanation.trim()
          : `The correct answer is: ${cleanedOptions[correctIdx]}`,
        difficulty: q.difficulty || 'medium'
      });
    }
  }

  return {
    isValid: true,
    error: null,
    sanitizedData: {
      title,
      summary,
      mode,
      flashcards: sanitizedFlashcards,
      quiz: sanitizedQuiz,
      createdAt: new Date().toISOString()
    }
  };
}

/**
 * Normalizes study response to ensure all expected properties exist safely.
 * @param {object} raw
 * @param {'flashcards' | 'quiz' | 'both'} mode
 * @returns {object}
 */
export function normalizeStudyResponse(raw, mode = 'both') {
  const result = validateStudyResponse(raw, mode);
  if (!result.isValid) {
    throw new Error(result.error);
  }
  return result.sanitizedData;
}
