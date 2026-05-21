/**
 * gemini.ts — Google Gemini API integration scaffold
 *
 * Future features powered by Gemini:
 * 1. Flare prediction — analyse symptom patterns → predict flare risk
 * 2. Brain fog assistant — LLM that simplifies tasks and instructions
 * 3. Somatic feedback generation — nuanced, empathetic guidance from pose data
 * 4. Weekly insight summaries — personalised health narrative
 *
 * DO NOT implement yet — scaffold only.
 */

export interface GeminiRequest {
  prompt: string
  systemInstruction?: string
  context?: Record<string, unknown>
}

export interface GeminiResponse {
  text: string
  confidence: number
}

/**
 * Generate somatic feedback text from pose and session data.
 * @param poseContext — current posture metrics
 * @returns compassionate, human-sounding guidance
 */
export async function generateSomaticFeedback(
  _poseContext: Record<string, unknown>
): Promise<GeminiResponse> {
  // TODO:
  // const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
  // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  // const result = await model.generateContent(buildFeedbackPrompt(poseContext))
  throw new Error('[gemini] Not yet implemented. Scaffold only.')
}

/**
 * Predict flare risk from symptom history.
 */
export async function predictFlareRisk(
  _symptomHistory: unknown[]
): Promise<{ riskScore: number; narrative: string }> {
  throw new Error('[gemini] Not yet implemented. Scaffold only.')
}

/**
 * Brain fog assistant — simplify a task or piece of text.
 */
export async function simplifyForBrainFog(
  _content: string
): Promise<string> {
  throw new Error('[gemini] Not yet implemented. Scaffold only.')
}
