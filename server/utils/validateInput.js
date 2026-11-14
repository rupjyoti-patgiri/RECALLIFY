// Input validation utility for study material generation requests

export function validateStudyInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return {
      isValid: false,
      errors: ['Request payload must be a valid JSON object.']
    };
  }

  const { content, mode, difficulty, count } = body;

  // Validate content
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('The "content" field is required and must contain notes or topic text.');
  } else if (content.trim().length > 15000) {
    errors.push('Content length exceeds the 15,000 character maximum limit.');
  }

  // Validate mode
  const validModes = ['flashcards', 'quiz', 'both'];
  if (mode && !validModes.includes(mode)) {
    errors.push(`Invalid mode "${mode}". Supported modes: ${validModes.join(', ')}.`);
  }

  // Validate difficulty
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (difficulty && !validDifficulties.includes(difficulty)) {
    errors.push(`Invalid difficulty "${difficulty}". Supported difficulties: ${validDifficulties.join(', ')}.`);
  }

  // Validate count
  if (count !== undefined) {
    const num = Number(count);
    if (isNaN(num) || num < 1 || num > 25) {
      errors.push('The "count" field must be an integer between 1 and 25.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      content: content ? content.trim() : '',
      mode: mode || 'both',
      difficulty: difficulty || 'medium',
      count: Number(count) || 5
    }
  };
}
