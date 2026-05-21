/**
 * poseAnalysis.ts — Pose scoring engine scaffold
 *
 * This module will receive MediaPipe PoseLandmark arrays
 * and compute somatic quality metrics.
 *
 * Future implementation will:
 * - Compute shoulder elevation angle
 * - Detect forward head posture
 * - Estimate jaw tension (via facial landmarks)
 * - Score breath rhythm via shoulder oscillation
 * - Output a normalized PostureScore (0–100)
 */

import type { PoseLandmark } from '@/hooks/usePoseTracking'

export interface PostureScore {
  overall: number
  shoulderBalance: number
  headAlignment: number
  spinalCurve: number
  confidence: number
}

export interface SomaticInsight {
  area: 'shoulders' | 'neck' | 'jaw' | 'breath' | 'spine' | 'general'
  observation: string
  severity: 'gentle' | 'moderate'
}

/**
 * Analyze pose landmarks and return a posture quality score.
 * @param landmarks — Array of 33 MediaPipe pose landmarks
 * @returns PostureScore with per-region breakdowns
 */
export function analyzePose(_landmarks: PoseLandmark[]): PostureScore {
  // TODO: implement landmark math
  // Key landmark indices (MediaPipe convention):
  // 11 = left shoulder, 12 = right shoulder
  // 23 = left hip, 24 = right hip
  // 0 = nose, 7 = left ear, 8 = right ear
  return {
    overall: 0,
    shoulderBalance: 0,
    headAlignment: 0,
    spinalCurve: 0,
    confidence: 0,
  }
}

/**
 * Derive somatic guidance text from a posture score.
 * In production this may also call Gemini for nuanced feedback.
 */
export function deriveInsights(_score: PostureScore): SomaticInsight[] {
  // TODO: rule-based + Gemini-enhanced insight generation
  return []
}
