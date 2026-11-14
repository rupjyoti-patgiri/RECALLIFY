import { parseAIResponse } from '../utils/parseAIResponse';
import { validateStudyResponse } from '../utils/validateResponse';
import { MOCK_TOPICS } from '../utils/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

/**
 * Service to request and validate AI-generated study material.
 * 
 * @param {object} params
 * @param {string} params.content - Notes or topic text
 * @param {'flashcards' | 'quiz' | 'both'} params.mode
 * @param {'easy' | 'medium' | 'hard'} params.difficulty
 * @param {number} params.count - Number of items
 * @param {AbortSignal} [params.signal] - Optional AbortSignal for request cancellation
 * @returns {Promise<{ success: boolean, data?: object, error?: string, isNetworkError?: boolean }>}
 */
export async function generateStudyMaterial({ content, mode = 'both', difficulty = 'medium', count = 5, signal }) {
  if (!content || !content.trim()) {
    return {
      success: false,
      error: 'Please enter notes or a topic before generating study materials.'
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-study-material`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content.trim(),
        mode,
        difficulty,
        count: Number(count) || 5,
      }),
      signal,
    });

    // Check for HTTP errors
    if (!response.ok) {
      let errorMessage = `Server returned status ${response.status} (${response.statusText})`;
      try {
        const errorJson = await response.json();
        if (errorJson && errorJson.error) {
          errorMessage = errorJson.error;
        }
      } catch (e) {
        // Non-JSON response
      }

      if (response.status === 429) {
        errorMessage = 'AI rate limit exceeded. Please wait a moment before generating again.';
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = 'AI service authentication failed. Please check the backend Gemini API key configuration.';
      } else if (response.status >= 500) {
        errorMessage = `AI service error: ${errorMessage}. The server encountered an issue while generating content.`;
      }

      return {
        success: false,
        error: errorMessage,
        statusCode: response.status
      };
    }

    const payload = await response.json();

    // The backend might return { success: true, data: ... } or direct data
    const rawData = payload.data || payload;

    // Parse if raw string
    const parsedResult = parseAIResponse(rawData);
    if (!parsedResult.success) {
      return {
        success: false,
        error: `Could not parse AI output: ${parsedResult.error}`
      };
    }

    // Validate structure
    const validation = validateStudyResponse(parsedResult.data, mode);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation error: ${validation.error}`
      };
    }

    return {
      success: true,
      data: validation.sanitizedData
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Generation request was cancelled.',
        isAborted: true
      };
    }

    // Network failure (server not started or offline)
    console.warn('[Recallify studyService] Backend connection failed:', error.message);
    
    // Check if the user entered one of the demo topics keywords for offline demo resilience
    const lowerContent = content.toLowerCase();
    let demoKey = null;
    if (lowerContent.includes('dbms') || lowerContent.includes('database')) demoKey = 'dbms';
    else if (lowerContent.includes('operating') || lowerContent.includes('os') || lowerContent.includes('kernel')) demoKey = 'os';
    else if (lowerContent.includes('javascript') || lowerContent.includes('js')) demoKey = 'javascript';
    else if (lowerContent.includes('network') || lowerContent.includes('tcp') || lowerContent.includes('dns')) demoKey = 'networks';

    if (demoKey && MOCK_TOPICS[demoKey]) {
      console.info('[Recallify studyService] Falling back to curated offline study set for demo topic:', demoKey);
      const fallbackSet = JSON.parse(JSON.stringify(MOCK_TOPICS[demoKey]));
      fallbackSet.mode = mode;
      if (mode === 'flashcards') fallbackSet.quiz = [];
      if (mode === 'quiz') fallbackSet.flashcards = [];
      return {
        success: true,
        data: fallbackSet,
        isFallback: true,
        notice: 'Loaded curated offline study session (Express server was unreachable).'
      };
    }

    return {
      success: false,
      error: `Could not reach the backend server at ${API_BASE_URL}. Please ensure the Express backend is running (run 'npm run server:dev').`,
      isNetworkError: true
    };
  }
}
