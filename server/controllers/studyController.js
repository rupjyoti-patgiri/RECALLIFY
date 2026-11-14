import { generateStudyWithAI } from "../services/Service.js";
import { validateStudyInput } from "../utils/validateInput.js";

export async function generateMaterial(req, res, next) {
  try {
    // 1. Validate request body
    const validation = validateStudyInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(" "),
      });
    }

    const { content, mode, difficulty, count } = validation.sanitized;

    // 2. Call Groq Service
    let rawOutput;

    try {
      rawOutput = await generateStudyWithAI({
        content,
        mode,
        difficulty,
        count,
      });
    } catch (groqError) {
      const errorMessage = groqError.message || "Unknown Groq API error";
      const status = groqError.status || groqError.statusCode;

      console.error("[Groq Error]:", errorMessage);

      // Missing API key
      if (errorMessage.includes("MISSING_API_KEY")) {
        return res.status(503).json({
          success: false,
          error:
            "Groq API key is not configured. Please add GROQ_API_KEY to server/.env.",
        });
      }

      // Invalid API key
      if (status === 401 || status === 403) {
        return res.status(503).json({
          success: false,
          error:
            "Groq API authentication failed. Please check your GROQ_API_KEY.",
        });
      }

      // Rate limit exceeded
      if (
        status === 429 ||
        errorMessage.toLowerCase().includes("rate limit") ||
        errorMessage.toLowerCase().includes("quota")
      ) {
        return res.status(429).json({
          success: false,
          error: "Groq API rate limit exceeded. Please wait and try again.",
        });
      }

      // Model unavailable or temporary server error
      if (
        status === 503 ||
        status === 502 ||
        status === 500 ||
        errorMessage.includes("MODEL_UNAVAILABLE")
      ) {
        return res.status(503).json({
          success: false,
          error:
            "Groq AI service is temporarily unavailable. Please try again later.",
        });
      }

      // Invalid model or request
      if (status === 404 || status === 400) {
        return res.status(502).json({
          success: false,
          error: `Groq API rejected the request: ${errorMessage}`,
        });
      }

      // Other errors
      return res.status(500).json({
        success: false,
        error: `AI generation failed: ${errorMessage}`,
      });
    }

    // 3. Parse JSON safely on backend
    let parsedData;

    try {
      // Remove accidental Markdown code fences
      let cleaned = rawOutput.trim();

      if (cleaned.startsWith("```")) {
        cleaned = cleaned
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/```\s*$/, "")
          .trim();
      }

      parsedData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error(
        "[Groq JSON Parse Error]: Failed to parse Groq output:",
        rawOutput,
      );

      return res.status(502).json({
        success: false,
        error: "AI returned an unparseable response. Please retry generation.",
      });
    }

    // 4. Return structured response
    return res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    next(error);
  }
}

