import type { PoseLandmark } from '@/hooks/usePoseTracking'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BaselineData {
  avgShoulderLevel: number      // mean Y of shoulder midpoint
  avgShoulderSymmetry: number   // mean absolute Y difference between shoulders
  avgNeckOffset: number         // mean |nose.x - shoulderMid.x|
  avgMovementSpeed: number      // mean per-frame displacement of shoulders
  capturedAt: string
  frameCount: number
}

export interface BaselineComparison {
  shoulderBalanceDelta: number   // positive = improved symmetry
  movementSpeedDelta: number     // positive = faster than baseline
  neckOffsetDelta: number        // positive = more forward than baseline
  messages: string[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'somerva_baseline_v1'
const REQUIRED_FRAMES = 60   // ~30 s at 2 Hz scoring

const LM = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
} as const

// ─── Module-level accumulator ─────────────────────────────────────────────────

interface FrameMetrics {
  shoulderLevel: number
  shoulderSymmetry: number
  neckOffset: number
  movementSpeed: number
}

let accumulator: FrameMetrics[] = []
let lastLandmarks: PoseLandmark[] | null = null

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

function visible(lm: PoseLandmark | undefined, threshold = 0.5): boolean {
  return !!lm && lm.visibility >= threshold
}

function extractMetrics(landmarks: PoseLandmark[]): FrameMetrics {
  const ls = landmarks[LM.LEFT_SHOULDER]
  const rs = landmarks[LM.RIGHT_SHOULDER]
  const nose = landmarks[LM.NOSE]

  const hasShoulders = visible(ls) && visible(rs)

  const shoulderLevel = hasShoulders ? (ls.y + rs.y) / 2 : 0.5
  const shoulderSymmetry = hasShoulders ? Math.abs(ls.y - rs.y) : 0
  const shoulderMidX = hasShoulders ? (ls.x + rs.x) / 2 : 0.5
  const neckOffset = visible(nose) ? Math.abs(nose.x - shoulderMidX) : 0

  let movementSpeed = 0
  if (lastLandmarks && hasShoulders) {
    const pls = lastLandmarks[LM.LEFT_SHOULDER]
    const prs = lastLandmarks[LM.RIGHT_SHOULDER]
    if (visible(pls) && visible(prs)) {
      const dl = Math.sqrt((ls.x - pls.x) ** 2 + (ls.y - pls.y) ** 2)
      const dr = Math.sqrt((rs.x - prs.x) ** 2 + (rs.y - prs.y) ** 2)
      movementSpeed = (dl + dr) / 2
    }
  }

  return { shoulderLevel, shoulderSymmetry, neckOffset, movementSpeed }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Feed one frame to the calibration accumulator.
 * Returns true once enough frames have been collected and the baseline is saved.
 */
export function addCalibrationFrame(landmarks: PoseLandmark[]): boolean {
  const metrics = extractMetrics(landmarks)
  accumulator.push(metrics)
  lastLandmarks = landmarks

  if (accumulator.length >= REQUIRED_FRAMES) {
    const baseline: BaselineData = {
      avgShoulderLevel: avg(accumulator.map((f) => f.shoulderLevel)),
      avgShoulderSymmetry: avg(accumulator.map((f) => f.shoulderSymmetry)),
      avgNeckOffset: avg(accumulator.map((f) => f.neckOffset)),
      avgMovementSpeed: avg(accumulator.map((f) => f.movementSpeed)),
      capturedAt: new Date().toISOString(),
      frameCount: accumulator.length,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(baseline))
    } catch {
      // SSR or restricted storage — silently ignore
    }
    accumulator = []
    lastLandmarks = null
    return true
  }

  return false
}

/** 0–1 progress toward completing the initial calibration. */
export function getCalibrationProgress(): number {
  return Math.min(1, accumulator.length / REQUIRED_FRAMES)
}

/** True if a baseline has been stored for this user. */
export function hasBaseline(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

/** Load stored baseline, or null if none exists. */
export function loadBaseline(): BaselineData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BaselineData) : null
  } catch {
    return null
  }
}

/** Remove stored baseline (e.g., for a fresh start). */
export function clearBaseline(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

/** Reset the in-memory accumulator without touching localStorage. */
export function resetCalibrationAccumulator(): void {
  accumulator = []
  lastLandmarks = null
}

/**
 * Compare a snapshot of landmarks against the stored baseline.
 * Returns null if no baseline exists yet.
 * All comparison messages use calm, non-judgemental language.
 */
export function compareToBaseline(landmarks: PoseLandmark[]): BaselineComparison | null {
  const baseline = loadBaseline()
  if (!baseline) return null

  const current = extractMetrics(landmarks)

  // Positive = improved (lower symmetry value = better balance)
  const shoulderBalanceDelta =
    ((baseline.avgShoulderSymmetry - current.shoulderSymmetry) /
      (baseline.avgShoulderSymmetry + 0.001)) *
    100

  // Positive = faster than baseline
  const movementSpeedDelta =
    ((current.movementSpeed - baseline.avgMovementSpeed) /
      (baseline.avgMovementSpeed + 0.0001)) *
    100

  // Positive = more forward than baseline
  const neckOffsetDelta =
    ((current.neckOffset - baseline.avgNeckOffset) /
      (baseline.avgNeckOffset + 0.001)) *
    100

  const messages: string[] = []

  // Shoulder balance
  const balancePct = Math.abs(shoulderBalanceDelta)
  if (balancePct >= 5) {
    if (shoulderBalanceDelta > 0) {
      messages.push(
        `Your shoulder balance has improved ${balancePct.toFixed(0)}% compared to your baseline.`,
      )
    } else {
      messages.push(
        `Your shoulders are carrying a little more tension than usual today — that is completely okay.`,
      )
    }
  }

  // Movement speed
  const speedPct = Math.abs(movementSpeedDelta)
  if (speedPct >= 15) {
    if (movementSpeedDelta < 0) {
      messages.push(
        `You are moving more slowly and mindfully than your baseline — a quiet sign of care.`,
      )
    } else {
      messages.push(
        `Your pace is a touch quicker than your baseline. See if you can soften the speed slightly.`,
      )
    }
  }

  // Neck offset
  const neckPct = Math.abs(neckOffsetDelta)
  if (neckPct >= 12) {
    if (neckOffsetDelta > 0) {
      messages.push(
        `Your head is sitting a little further forward than your baseline. A gentle draw-back may help.`,
      )
    } else {
      messages.push(
        `Your head position feels more aligned than your baseline today.`,
      )
    }
  }

  if (messages.length === 0) {
    messages.push(
      `Your movement quality feels consistent with your personal baseline today.`,
    )
  }

  return { shoulderBalanceDelta, movementSpeedDelta, neckOffsetDelta, messages }
}
