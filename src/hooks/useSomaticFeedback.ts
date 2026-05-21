'use client'

import { useState, useCallback, useRef } from 'react'
import type { PoseLandmark } from '@/hooks/usePoseTracking'
import { computeMovementQuality, resetScoringHistory, type MovementQualityScore } from '@/lib/movementScoring'
import {
  addCalibrationFrame,
  getCalibrationProgress,
  hasBaseline,
  compareToBaseline,
  resetCalibrationAccumulator,
  type BaselineComparison,
} from '@/lib/calibrationEngine'
import {
  classifyMovement,
  resetClassifier,
  type ClassifierOutput,
  type MovementState,
} from '@/lib/mlMovementClassifier'
import {
  compareToReference,
  type ReferenceComparison as RefComparison,
} from '@/lib/referenceMovementSystem'
import type { ExerciseCategory } from '@/lib/exercises'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SomaticFeedback {
  id: string
  message: string
  category: 'posture' | 'breath' | 'jaw' | 'neck' | 'general' | 'ml'
  time: string
  score: number
  movementState?: MovementState
}

export type { RefComparison as ReferenceComparison }

// ─── Therapeutic message pools ────────────────────────────────────────────────

const STATE_MESSAGES: Record<MovementState, Omit<SomaticFeedback, 'id' | 'time'>[]> = {
  Smooth: [
    { message: 'Your movement looks smooth and steady. Stay with this pace.', category: 'general', score: 88 },
    { message: 'There is a lovely fluidity in how you are moving. Allow it to continue naturally.', category: 'posture', score: 90 },
    { message: 'The nervous system is settling. Your breath and movement are in rhythm.', category: 'breath', score: 86 },
    { message: 'This looks comfortable. You are moving in a way that supports your body.', category: 'general', score: 88 },
  ],
  Stable: [
    { message: 'Your movement is consistent and regulated. That is exactly the aim.', category: 'posture', score: 85 },
    { message: 'A good, stable pace. Notice the steadiness — your body is finding its rhythm.', category: 'general', score: 84 },
    { message: 'Your upper body appears well-supported. Let that continue without effort.', category: 'posture', score: 83 },
    { message: 'The breath is quiet, the movement is measured. This is regulated movement.', category: 'breath', score: 86 },
  ],
  Guarded: [
    { message: 'Your movement looks a bit guarded today — that is okay. Let the body move only as much as it wants to.', category: 'posture', score: 72, movementState: 'Guarded' },
    { message: 'It looks like the body may be bracing slightly. No need to force it open — just notice.', category: 'general', score: 70, movementState: 'Guarded' },
    { message: 'Try slowing the pace a little more. Smaller and slower is always safer here.', category: 'posture', score: 68, movementState: 'Guarded' },
    { message: 'The nervous system sometimes protects us with holding. That is wise — we are simply inviting it to soften.', category: 'general', score: 74, movementState: 'Guarded' },
  ],
  Tense: [
    { message: 'There is some tension present. See if you can soften one area — the jaw, the hands, the shoulders.', category: 'posture', score: 65, movementState: 'Tense' },
    { message: 'Take a gentle exhale and let the movement become even smaller. Less effort, not more.', category: 'breath', score: 62, movementState: 'Tense' },
    { message: 'Tension is information, not something to push through. Let it simply be noticed.', category: 'general', score: 68, movementState: 'Tense' },
    { message: 'Your shoulders may be carrying some holding. Gently invite them to drop — even a millimetre helps.', category: 'neck', score: 66, movementState: 'Tense' },
  ],
  Asymmetrical: [
    { message: 'There is a slight asymmetry in your movement — very common. Just notice it without trying to fix it.', category: 'posture', score: 72, movementState: 'Asymmetrical' },
    { message: 'One side may feel different from the other today. That is information, not a problem.', category: 'general', score: 74, movementState: 'Asymmetrical' },
    { message: 'Gently bring awareness to both shoulders — can they find a similar height, without forcing?', category: 'neck', score: 70, movementState: 'Asymmetrical' },
    { message: 'Asymmetrical patterns often reflect where the body is holding tension. Simply observing this is therapeutic.', category: 'posture', score: 73, movementState: 'Asymmetrical' },
  ],
}

const WARMUP_POOL: Omit<SomaticFeedback, 'id' | 'time'>[] = [
  { message: 'Take a gentle breath and let your body settle into the movement.', category: 'breath', score: 80 },
  { message: 'Notice where your body is being held by the chair or floor beneath you.', category: 'general', score: 78 },
  { message: 'There is no correct pace. Simply observe how your body wants to move today.', category: 'general', score: 82 },
]

// ─── Landmark simulator ───────────────────────────────────────────────────────

function simulateLandmarks(elapsedSecs: number): PoseLandmark[] {
  const base: PoseLandmark = { x: 0.5, y: 0.5, z: 0, visibility: 0.05 }
  const lms: PoseLandmark[] = Array(33).fill(null).map(() => ({ ...base }))
  const jitter = () => (Math.random() - 0.5) * 0.003
  const breathPhase   = Math.sin((elapsedSecs * 2 * Math.PI) / 4)
  const exercisePhase = Math.sin((elapsedSecs * 2 * Math.PI) / 7)
  lms[0]  = { x: 0.5 + jitter(), y: 0.22 + jitter(), z: -0.05, visibility: 0.99 }
  lms[7]  = { x: 0.42 + jitter(), y: 0.23 + jitter(), z: -0.02, visibility: 0.88 }
  lms[8]  = { x: 0.58 + jitter(), y: 0.23 + jitter(), z: -0.02, visibility: 0.88 }
  const shoulderY = 0.42 - breathPhase * 0.007
  const tilt      = exercisePhase * 0.008
  lms[11] = { x: 0.34 + jitter(), y: shoulderY + tilt + jitter(),       z: 0, visibility: 0.98 }
  lms[12] = { x: 0.66 + jitter(), y: shoulderY - tilt * 0.6 + jitter(), z: 0, visibility: 0.98 }
  lms[23] = { x: 0.42, y: 0.72, z: 0.02, visibility: 0.95 }
  lms[24] = { x: 0.58, y: 0.72, z: 0.02, visibility: 0.95 }
  return lms
}

function now(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSomaticFeedback(activeCategory?: ExerciseCategory | null) {
  const [feedback, setFeedback]             = useState<SomaticFeedback[]>([])
  const [guidanceStep, setGuidanceStep]     = useState(0)
  const [movementScore, setMovementScore]   = useState<MovementQualityScore | null>(null)
  const [baselineComparison, setBaselineComparison] = useState<BaselineComparison | null>(null)
  const [calibrationProgress, setCalibrationProgress] = useState(0)
  const [isCalibrating, setIsCalibrating]   = useState(false)
  const [classifierOutput, setClassifierOutput] = useState<ClassifierOutput | null>(null)
  const [referenceComparison, setReferenceComparison] = useState<RefComparison | null>(null)

  const elapsedRef         = useRef(0)
  const stateCountRef      = useRef<Partial<Record<MovementState, number>>>({})
  const activeCategoryRef  = useRef(activeCategory)
  activeCategoryRef.current = activeCategory

  // ── Refs for latest values — used in stable callbacks ─────────────────────
  const latestClassifierRef    = useRef<ClassifierOutput | null>(null)
  const latestReferenceRef     = useRef<RefComparison | null>(null)
  const latestMovementScoreRef = useRef<MovementQualityScore | null>(null)

  // ─── Score tick (every 500 ms) ──────────────────────────────────────────────
  // Stable: reads activeCategory from ref, never needs to be recreated.

  const updateMovementScore = useCallback((
    realLandmarks?: PoseLandmark[],
    elapsedSecs?: number,
  ) => {
    const landmarks = realLandmarks ?? simulateLandmarks(elapsedSecs ?? elapsedRef.current)
    elapsedRef.current = elapsedSecs ?? elapsedRef.current + 0.5

    const score          = computeMovementQuality(landmarks)
    const classification = classifyMovement(score)
    const refResult      = compareToReference(score, activeCategoryRef.current ?? null)

    // Update refs synchronously (no re-render cost, available immediately)
    latestMovementScoreRef.current = score
    latestClassifierRef.current    = classification
    latestReferenceRef.current     = refResult

    // Update state for rendering (batch-friendly)
    setMovementScore(score)
    setClassifierOutput(classification)
    setReferenceComparison(refResult)

    // Baseline calibration
    if (!hasBaseline()) {
      setIsCalibrating(true)
      const done = addCalibrationFrame(landmarks)
      setCalibrationProgress(getCalibrationProgress())
      if (done) { setIsCalibrating(false); setCalibrationProgress(1) }
    } else if (Math.random() < 0.1) {
      const comparison = compareToBaseline(landmarks)
      if (comparison) setBaselineComparison(comparison)
    }
  }, []) // ← stable: no state deps; reads via refs

  // ─── Guidance tick (every 8 s) ───────────────────────────────────────────────
  // Stable: reads latest values from refs instead of closed-over state.

  const processFeedback = useCallback((_poseData?: unknown) => {
    const classifierOut  = latestClassifierRef.current
    const refComparison  = latestReferenceRef.current
    const movementSc     = latestMovementScoreRef.current

    if (!classifierOut) {
      const idx = Object.values(stateCountRef.current).reduce((a, b) => a + (b ?? 0), 0)
      const item = WARMUP_POOL[idx % WARMUP_POOL.length]
      setFeedback((prev) => [...prev.slice(-9), { ...item, id: `fb-${Date.now()}`, time: now() }])
      setGuidanceStep((prev) => prev + 1)
      return
    }

    const state = classifierOut.movementState
    stateCountRef.current[state] = (stateCountRef.current[state] ?? 0) + 1
    const count = stateCountRef.current[state]!

    const useRefGuidance =
      refComparison &&
      refComparison.overallAlignment === 'outside_envelope' &&
      Math.random() < 0.35

    let messageData: Omit<SomaticFeedback, 'id' | 'time'>

    if (useRefGuidance) {
      messageData = {
        message:       refComparison!.therapeuticGuidance,
        category:      'general',
        score:         movementSc?.overallScore ?? 75,
        movementState: state,
      }
    } else {
      const statePool = STATE_MESSAGES[state]
      messageData = { ...statePool[(count - 1) % statePool.length], movementState: state }
    }

    setFeedback((prev) => [...prev.slice(-9), { ...messageData, id: `fb-${Date.now()}-${Math.random()}`, time: now() }])
    setGuidanceStep((prev) => prev + 1)
  }, []) // ← stable: reads via refs

  // ─── Reset ───────────────────────────────────────────────────────────────────

  const resetFeedback = useCallback(() => {
    setFeedback([])
    setMovementScore(null)
    setBaselineComparison(null)
    setCalibrationProgress(0)
    setIsCalibrating(false)
    setGuidanceStep(0)
    setClassifierOutput(null)
    setReferenceComparison(null)
    elapsedRef.current = 0
    stateCountRef.current = {}
    latestClassifierRef.current    = null
    latestReferenceRef.current     = null
    latestMovementScoreRef.current = null
    resetScoringHistory()
    resetCalibrationAccumulator()
    resetClassifier()
  }, [])

  const score = movementScore?.overallScore ?? 0

  return {
    feedback,
    score,
    guidanceStep,
    movementScore,
    baselineComparison,
    calibrationProgress,
    isCalibrating,
    classifierOutput,
    referenceComparison,
    processFeedback,
    updateMovementScore,
    resetFeedback,
  }
}
