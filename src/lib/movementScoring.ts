import type { PoseLandmark } from '@/hooks/usePoseTracking'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MovementQualityScore {
  overallScore: number
  shoulderSymmetry: number
  neckAlignment: number
  smoothness: number
  rangeControl: number
  breathingRhythm: number | null
}

// ─── MediaPipe landmark indices ───────────────────────────────────────────────

const LM = {
  NOSE: 0,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
} as const

// ─── Frame history (module-level rolling buffer) ──────────────────────────────

const HISTORY_SIZE = 20
const frameHistory: PoseLandmark[][] = []

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dist(a: PoseLandmark, b: PoseLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

function visible(lm: PoseLandmark | undefined, threshold = 0.5): boolean {
  return !!lm && lm.visibility >= threshold
}

// ─── A. Shoulder Symmetry ─────────────────────────────────────────────────────
// Penalises unequal shoulder heights (y-axis in normalised coords, 0 = top).

function scoreShoulderSymmetry(lms: PoseLandmark[]): number {
  const ls = lms[LM.LEFT_SHOULDER]
  const rs = lms[LM.RIGHT_SHOULDER]
  if (!visible(ls) || !visible(rs)) return 75

  // Height difference in frame-height units; 0.04 ≈ 4 % of frame = notable
  const heightDiff = Math.abs(ls.y - rs.y)
  const penalty = Math.min(100, heightDiff * 1800)
  return Math.round(Math.max(0, 100 - penalty))
}

// ─── B. Neck Alignment ────────────────────────────────────────────────────────
// Checks lateral ear tilt and forward-head offset relative to shoulders.

function scoreNeckAlignment(lms: PoseLandmark[]): number {
  const nose = lms[LM.NOSE]
  const le = lms[LM.LEFT_EAR]
  const re = lms[LM.RIGHT_EAR]
  const ls = lms[LM.LEFT_SHOULDER]
  const rs = lms[LM.RIGHT_SHOULDER]

  if (!visible(nose) || !visible(ls) || !visible(rs)) return 75

  // Lateral tilt: difference in ear Y positions
  let lateralScore = 100
  if (visible(le) && visible(re)) {
    const earTilt = Math.abs(le.y - re.y)
    lateralScore = Math.max(0, 100 - earTilt * 1400)
  }

  // Forward head: how far nose's X deviates from shoulder midpoint
  const shoulderMidX = (ls.x + rs.x) / 2
  const forwardOffset = Math.abs(nose.x - shoulderMidX)
  const forwardScore = Math.max(0, 100 - forwardOffset * 380)

  return Math.round((lateralScore + forwardScore) / 2)
}

// ─── C. Movement Smoothness ───────────────────────────────────────────────────
// Detects per-frame jitter across key landmarks; rewards fluid, sustained motion.

function scoreSmoothness(current: PoseLandmark[]): number {
  if (frameHistory.length < 2) return 85

  const prev = frameHistory[frameHistory.length - 1]
  const keyIndices = [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER, LM.NOSE]

  let totalJitter = 0
  let count = 0

  for (const idx of keyIndices) {
    const cp = current[idx]
    const pp = prev[idx]
    if (visible(cp) && visible(pp)) {
      totalJitter += dist(cp, pp)
      count++
    }
  }

  if (count === 0) return 85

  const avgJitter = totalJitter / count
  // avgJitter < 0.003 is very fluid; > 0.035 is distinctly jerky
  const score = Math.max(0, 100 - avgJitter * 2600)
  return Math.round(Math.min(100, score))
}

// ─── D. Controlled Range of Motion ───────────────────────────────────────────
// Tracks amplitude from the oldest buffered frame; penalises abrupt overextension.

function scoreRangeControl(current: PoseLandmark[]): number {
  if (frameHistory.length < 3) return 80

  const prev = frameHistory[frameHistory.length - 1]
  const keyIndices = [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER]

  // Per-frame velocity
  let frameVelocity = 0
  for (const idx of keyIndices) {
    const cp = current[idx]
    const pp = prev[idx]
    if (visible(cp) && visible(pp)) {
      frameVelocity = Math.max(frameVelocity, dist(cp, pp))
    }
  }

  // Abrupt spike penalty (overextension)
  const abruptPenalty = Math.min(55, frameVelocity * 1400)
  return Math.round(Math.max(0, 100 - abruptPenalty))
}

// ─── E. Breathing Rhythm Proxy ────────────────────────────────────────────────
// Estimates breath rhythm from oscillation of the shoulder midpoint Y.
// Returns null when there is insufficient history.

function scoreBreathingRhythm(): number | null {
  if (frameHistory.length < HISTORY_SIZE) return null

  const yValues = frameHistory
    .map((frame) => {
      const ls = frame[LM.LEFT_SHOULDER]
      const rs = frame[LM.RIGHT_SHOULDER]
      if (!visible(ls) || !visible(rs)) return null
      return (ls.y + rs.y) / 2
    })
    .filter((v): v is number => v !== null)

  if (yValues.length < 8) return null

  // Count direction reversals (zero-crossings of discrete derivative)
  let reversals = 0
  let prevDir = 0
  for (let i = 1; i < yValues.length; i++) {
    const dir = Math.sign(yValues[i] - yValues[i - 1])
    if (dir !== 0 && prevDir !== 0 && dir !== prevDir) reversals++
    if (dir !== 0) prevDir = dir
  }

  // Calm breathing over 20 frames ≈ 2-4 reversals; too many = shallow/rapid
  if (reversals >= 2 && reversals <= 4) return 88
  if (reversals <= 1) return 70  // possible breath-holding
  return Math.max(45, 88 - (reversals - 4) * 9)
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Process one frame of MediaPipe landmarks and return a full quality score.
 * Maintains an internal rolling frame history for temporal metrics.
 */
export function computeMovementQuality(landmarks: PoseLandmark[]): MovementQualityScore {
  const shoulderSymmetry = scoreShoulderSymmetry(landmarks)
  const neckAlignment = scoreNeckAlignment(landmarks)
  const smoothness = scoreSmoothness(landmarks)
  const rangeControl = scoreRangeControl(landmarks)
  const breathingRhythm = scoreBreathingRhythm()

  // Push current frame into history after temporal metrics are computed
  frameHistory.push([...landmarks])
  if (frameHistory.length > HISTORY_SIZE) frameHistory.shift()

  const overallScore = Math.round(
    shoulderSymmetry * 0.25 +
    neckAlignment * 0.25 +
    smoothness * 0.30 +
    rangeControl * 0.20,
  )

  return {
    overallScore,
    shoulderSymmetry,
    neckAlignment,
    smoothness,
    rangeControl,
    breathingRhythm,
  }
}

/** Clear frame history — call when a session ends or resets. */
export function resetScoringHistory(): void {
  frameHistory.length = 0
}
