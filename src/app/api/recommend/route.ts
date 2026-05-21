import { NextRequest, NextResponse } from 'next/server'

export interface CheckInData {
  energyLevel: number        // 1–5
  stressLevel: number        // 1–5
  fatigueLevel: number       // 1–5
  painLocations: string[]    // e.g. ['Neck', 'Shoulders']
  emotionalState: string     // e.g. 'Anxious'
}

export interface GeminiRecommendation {
  recommendedCategory: string
  recommendedExercise: string
  intensity: 'very_low' | 'low' | 'moderate'
  reason: string
  avoid: string[]
}

// ─── Fallback — always safe, never breaks UI ─────────────────────────────────

function buildFallback(data: CheckInData): GeminiRecommendation {
  const isLowEnergy = data.energyLevel <= 2
  const isHighFatigue = data.fatigueLevel >= 4
  const hasNeckPain = data.painLocations.some((p) =>
    ['Neck', 'Shoulders', 'Head'].includes(p)
  )

  if (isLowEnergy || isHighFatigue) {
    return {
      recommendedCategory: 'Grounding',
      recommendedExercise: 'Floor Contact Scan',
      intensity: 'very_low',
      reason: 'Your energy is low today. A gentle grounding practice will help your nervous system settle without asking too much of your body.',
      avoid: ['Postural Reset', 'Somatic Release'],
    }
  }
  if (data.stressLevel >= 4 || data.emotionalState === 'Anxious' || data.emotionalState === 'Overwhelmed') {
    return {
      recommendedCategory: 'Breath Regulation',
      recommendedExercise: 'Extended Exhale',
      intensity: 'very_low',
      reason: 'When stress is high, slowing the exhale activates the parasympathetic nervous system gently and effectively.',
      avoid: [],
    }
  }
  if (hasNeckPain) {
    return {
      recommendedCategory: 'Body Scanning',
      recommendedExercise: 'Head-to-Toe Awareness Scan',
      intensity: 'very_low',
      reason: 'With neck and shoulder discomfort today, a body scan allows awareness without movement demand.',
      avoid: ['Gentle Neck Release', 'Shoulder Tension Relief'],
    }
  }
  return {
    recommendedCategory: 'Vagus Nerve Calming',
    recommendedExercise: 'Humming Breath',
    intensity: 'very_low',
    reason: 'A humming exhale is one of the most direct ways to activate the vagus nerve and shift the body toward regulation.',
    avoid: [],
  }
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(data: CheckInData): string {
  const { energyLevel, stressLevel, fatigueLevel, painLocations, emotionalState } = data
  const energyLabel   = ['', 'Very Low', 'Low', 'Moderate', 'Good', 'High'][energyLevel] ?? 'Unknown'
  const stressLabel   = ['', 'Calm', 'Mild', 'Moderate', 'High', 'Very High'][stressLevel] ?? 'Unknown'
  const fatigueLabel  = ['', 'Rested', 'Slightly Tired', 'Moderately Tired', 'Fatigued', 'Exhausted'][fatigueLevel] ?? 'Unknown'
  const painText      = painLocations.length > 0 ? painLocations.join(', ') : 'None'

  return `You are a somatic recommendation engine for fibromyalgia patients.
Return ONLY valid JSON. No markdown. No explanation.

Patient state:
Energy: ${energyLabel} (${energyLevel}/5)
Stress: ${stressLabel} (${stressLevel}/5)
Fatigue: ${fatigueLabel} (${fatigueLevel}/5)
Pain locations: ${painText}
Emotional state: ${emotionalState}

Categories: Grounding, Breath Regulation, Gentle Neck Release, Shoulder Tension Relief, Freeze-State Regulation, Low-Energy Reset, Sleep Preparation, Seated Flare-Friendly, Orienting, Vagus Nerve Calming, Micro-Movement, Bilateral Regulation, Body Scanning, Somatic Release, Postural Reset, Sensory Awareness

Rules:
- Choose the safest exercise for current state
- Energy ≤ 2 or Fatigue ≥ 4 → only Grounding or Low-Energy Reset
- High stress or anxious → Breath Regulation or Vagus Nerve Calming
- intensity very_low unless energy ≥ 3 AND fatigue ≤ 2; moderate only if energy = 5 AND fatigue = 1
- reason: 1-2 warm sentences, non-clinical
- avoid: [] is fine

OUTPUT FORMAT (exact):
{
  "recommendedCategory": "",
  "recommendedExercise": "",
  "intensity": "very_low",
  "reason": "",
  "avoid": []
}`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: CheckInData
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    // No key configured — return intelligent fallback silently
    return NextResponse.json(buildFallback(body))
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(body) }] }],
          generationConfig: {
            temperature: 0.15,
            maxOutputTokens: 300,
            responseMimeType: 'application/json',
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      console.warn('[recommend] Gemini non-OK:', geminiRes.status)
      return NextResponse.json(buildFallback(body))
    }

    const geminiJson = await geminiRes.json()
    const rawText: string = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    let recommendation: GeminiRecommendation
    try {
      recommendation = JSON.parse(rawText)
    } catch {
      console.warn('[recommend] JSON parse failed, using fallback')
      return NextResponse.json(buildFallback(body))
    }

    // Validate required fields — fallback if anything is missing
    if (!recommendation.recommendedCategory || !recommendation.recommendedExercise || !recommendation.reason) {
      return NextResponse.json(buildFallback(body))
    }

    return NextResponse.json(recommendation)
  } catch (err) {
    console.warn('[recommend] Network error, using fallback:', err)
    return NextResponse.json(buildFallback(body))
  }
}
