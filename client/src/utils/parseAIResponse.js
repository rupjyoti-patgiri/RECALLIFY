/**
 * Recallify AI Response Parser
 * Safely parses raw string output from LLMs into clean JSON objects,
 * extracting JSON from markdown code blocks or surrounding text.
 */

/**
 * Parses raw text from AI model into a JavaScript object.
 * @param {string|object} rawInput
 * @returns {{ success: boolean, data: any, error: string | null }}
 */
export function parseAIResponse(rawInput) {
  if (!rawInput) {
    return {
      success: false,
      data: null,
      error: 'Empty response received from AI model.'
    };
  }

  // If already an object, return directly
  if (typeof rawInput === 'object') {
    return {
      success: true,
      data: rawInput,
      error: null
    };
  }

  if (typeof rawInput !== 'string') {
    return {
      success: false,
      data: null,
      error: 'Unexpected response type: expected string or object from model.'
    };
  }

  let text = rawInput.trim();

  // Try direct parse first
  try {
    const parsed = JSON.parse(text);
    return { success: true, data: parsed, error: null };
  } catch (err) {
    // Continue with extraction strategies
  }

  // Strategy 1: Extract from markdown code fences ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      return { success: true, data: parsed, error: null };
    } catch (err) {
      // Continue to next strategy
    }
  }

  // Strategy 2: Find outermost JSON object { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(candidate);
      return { success: true, data: parsed, error: null };
    } catch (err) {
      // Still failed
    }
  }

  return {
    success: false,
    data: null,
    error: 'Failed to parse JSON structure from the AI output. The model returned non-conforming text.'
  };
}
