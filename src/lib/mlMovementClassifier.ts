import type { MovementQualityScore } from '@/lib/movementScoring'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MovementState = 'Smooth' | 'Guarded' | 'Tense' | 'Asymmetrical' | 'Stable'

export interface ClassifierOutput {
  movementState: MovementState
  confidence: number          // 0.0 – 1.0
  dominantFeature: string     // human-readable reason for the classification
  subScores: {
    smoothScore: number       // 0–100
    guardScore: number
    tenseScore: number
    asymScore: number
    stableScore: number
  }
}

// ─── Feature extraction ───────────────────────────────────────────────────────
// Translates raw movement quality scores into classifier-ready normalised features.

interface Features {
  symmetryNorm: number      // 0=highly asymmetric  1=perfectly symmetric
  neckNorm: number          // 0=poor alignment     1=well aligned
  smoothNorm: number        // 0=very jerky         1=very smooth
  rangeNorm: number         // 0=overextended/abrupt 1=controlled
  breathNorm: number | null // 0=dysregulated       1=rhythmic
}

function extractFeatures(score: MovementQualityScore): Features {
  return {
    symmetryNorm: score.shoulderSymmetry / 100,
    neckNorm:     score.neckAlignment    / 100,
    smoothNorm:   score.smoothness       / 100,
    rangeNorm:    score.rangeControl     / 100,
    breathNorm:   score.breathingRhythm != null ? score.breathingRhythm / 100 : null,
  }
}

// ─── Class activation functions ───────────────────────────────────────────────
// Each function returns a 0-1 activation score for that movement state.
// These encode therapeutic movement knowledge from somatic experiencing literature:
//  - Smooth:        high smoothness + good alignment + controlled range
//  - Guarded:       reduced range, tight symmetry, lower smoothness (bracing pattern)
//  - Tense:         asymmetry + reduced smoothness + elevated range (strain)
//  - Asymmetrical:  dominant asymmetry signal, moderate other scores
//  - Stable:        all sub-scores moderate-to-high, breath regulated

function activateSmooth(f: Features): number {
  const base = f.smoothNorm * 0.45 + f.rangeNorm * 0.30 + f.neckNorm * 0.25
  const breathBonus = f.breathNorm != null ? (f.breathNorm - 0.5) * 0.08 : 0
  return clamp01(base + breathBonus)
}

function activateGuarded(f: Features): number {
  // Guarding: range is very small (controlled or suppressed), symmetry decent but smoothness low
  const lowRange   = 1 - f.rangeNorm          // high when range is restricted
  const lowSmooth  = 1 - f.smoothNorm          // high when jerky / held
  const okSymmetry = f.symmetryNorm            // guarding is usually fairly symmetric
  return clamp01(lowRange * 0.45 + lowSmooth * 0.35 + okSymmetry * 0.20)
}

function activateTense(f: Features): number {
  // Tension: asymmetry + elevated jerk + range spikes
  const asymFactor  = 1 - f.symmetryNorm
  const jerkFactor  = 1 - f.smoothNorm
  const rangeFactor = 1 - f.rangeNorm          // abrupt range = high tension
  return clamp01(asymFactor * 0.40 + jerkFactor * 0.35 + rangeFactor * 0.25)
}

function activateAsymmetrical(f: Features): number {
  // Pure asymmetry: the asymmetry signal dominates clearly
  const asymSignal = 1 - f.symmetryNorm
  const modifiers  = (f.smoothNorm + f.rangeNorm) / 2   // other features moderate
  return clamp01(asymSignal * 0.70 + (1 - modifiers) * 0.30)
}

function activateStable(f: Features): number {
  // Stable: all individual scores are moderate-to-good
  const minScore  = Math.min(f.symmetryNorm, f.neckNorm, f.smoothNorm, f.rangeNorm)
  const avgScore  = (f.symmetryNorm + f.neckNorm + f.smoothNorm + f.rangeNorm) / 4
  const breathAdj = f.breathNorm != null ? f.breathNorm * 0.10 : 0
  return clamp01(minScore * 0.50 + avgScore * 0.40 + breathAdj)
}

// ─── Confidence calibration ───────────────────────────────────────────────────
// Converts the winning activation margin into a calibrated confidence value.
// Close competitions (winner ≈ runner-up) should yield lower confidence.

function calibrateConfidence(scores: number[], winnerIdx: number): number {
  const sorted = [...scores].sort((a, b) => b - a)
  const margin = sorted[0] - sorted[1]           // 0 = tie, 1 = clean win
  // Winner's raw activation acts as a prior, margin sharpens it
  const raw = scores[winnerIdx]
  const confidence = raw * 0.55 + margin * 0.45
  return Math.round(clamp01(confidence) * 100) / 100
}

// ─── Dominant feature label ───────────────────────────────────────────────────

function dominantLabel(state: MovementState, f: Features): string {
  switch (state) {
    case 'Smooth':
      return `Movement flowing well — smoothness ${pct(f.smoothNorm)}, range control ${pct(f.rangeNorm)}`
    case 'Guarded':
      return `Body bracing detected — range suppressed ${pct(1 - f.rangeNorm)}, holding ${pct(1 - f.smoothNorm)}`
    case 'Tense':
      return `Muscular tension present — asymmetry ${pct(1 - f.symmetryNorm)}, jitter ${pct(1 - f.smoothNorm)}`
    case 'Asymmetrical':
      return `Shoulder asymmetry dominant — ${pct(1 - f.symmetryNorm)} imbalance detected`
    case 'Stable':
      return `Steady and regulated — consistent across all movement dimensions`
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp01(v: number): number { return Math.max(0, Math.min(1, v)) }
function pct(v: number): string { return `${Math.round(v * 100)}%` }

// ─── Classifier history (rolling window for temporal smoothing) ───────────────

const SMOOTHING_WINDOW = 4
const classifierHistory: MovementState[] = []

function smoothedState(candidate: MovementState): MovementState {
  classifierHistory.push(candidate)
  if (classifierHistory.length > SMOOTHING_WINDOW) classifierHistory.shift()
  // Return most-frequent state in window
  const freq: Partial<Record<MovementState, number>> = {}
  for (const s of classifierHistory) freq[s] = (freq[s] ?? 0) + 1
  return (Object.entries(freq) as [MovementState, number][])
    .sort((a, b) => b[1] - a[1])[0][0]
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Classify the current movement state from a MovementQualityScore.
 * Applies temporal smoothing over the last SMOOTHING_WINDOW frames
 * to prevent rapid label flickering — important for on-screen feedback.
 *
 * @param score  Output of computeMovementQuality() from movementScoring.ts
 * @returns      ClassifierOutput with state, confidence, and diagnostic info
 */
export function classifyMovement(score: MovementQualityScore): ClassifierOutput {
  const f = extractFeatures(score)

  const activations: Record<MovementState, number> = {
    Smooth:        activateSmooth(f),
    Guarded:       activateGuarded(f),
    Tense:         activateTense(f),
    Asymmetrical:  activateAsymmetrical(f),
    Stable:        activateStable(f),
  }

  const states = Object.keys(activations) as MovementState[]
  const values = states.map((s) => activations[s])
  const maxIdx  = values.indexOf(Math.max(...values))
  const rawWinner = states[maxIdx]

  const movementState = smoothedState(rawWinner)
  const confidence    = calibrateConfidence(values, maxIdx)

  return {
    movementState,
    confidence,
    dominantFeature: dominantLabel(movementState, f),
    subScores: {
      smoothScore: Math.round(activations.Smooth       * 100),
      guardScore:  Math.round(activations.Guarded      * 100),
      tenseScore:  Math.round(activations.Tense        * 100),
      asymScore:   Math.round(activations.Asymmetrical * 100),
      stableScore: Math.round(activations.Stable       * 100),
    },
  }
}

/** Reset the classifier smoothing history — call when a session ends. */
export function resetClassifier(): void {
  classifierHistory.length = 0
}
