import type { MovementQualityScore } from '@/lib/movementScoring'
import type { ExerciseCategory } from '@/lib/exercises'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MovementEnvelope {
  shoulderSymmetry: { min: number; ideal: number }
  neckAlignment:    { min: number; ideal: number }
  smoothness:       { min: number; ideal: number }
  rangeControl:     { min: number; ideal: number }
}

export interface ReferenceComparison {
  inSafeRange: boolean
  deviations: DeviationNote[]
  overallAlignment: 'within_envelope' | 'approaching_limit' | 'outside_envelope'
  therapeuticGuidance: string
}

export interface DeviationNote {
  dimension: string
  severity: 'mild' | 'moderate' | 'notable'
  note: string
}

// ─── Therapeutic movement envelopes ──────────────────────────────────────────
// Each category defines minimum acceptable scores and ideal targets.
// These encode fibromyalgia-safe movement principles from somatic experiencing:
//  - Smoothness over intensity
//  - Safety over range  
//  - Pacing over repetition
//  - Regulation over performance
//
// Minimum values are intentionally lower for high-demand categories.
// The system guides gently rather than warns harshly.

const ENVELOPES: Record<ExerciseCategory, MovementEnvelope> = {

  // Passive categories — smoothness is paramount, range is not expected
  'Grounding': {
    shoulderSymmetry: { min: 55, ideal: 78 },
    neckAlignment:    { min: 55, ideal: 78 },
    smoothness:       { min: 72, ideal: 88 },
    rangeControl:     { min: 60, ideal: 82 },
  },
  'Body Scanning': {
    shoulderSymmetry: { min: 55, ideal: 76 },
    neckAlignment:    { min: 55, ideal: 76 },
    smoothness:       { min: 70, ideal: 86 },
    rangeControl:     { min: 60, ideal: 80 },
  },
  'Sensory Awareness': {
    shoulderSymmetry: { min: 55, ideal: 76 },
    neckAlignment:    { min: 55, ideal: 76 },
    smoothness:       { min: 68, ideal: 84 },
    rangeControl:     { min: 60, ideal: 80 },
  },
  'Low-Energy Reset': {
    shoulderSymmetry: { min: 50, ideal: 72 },
    neckAlignment:    { min: 50, ideal: 72 },
    smoothness:       { min: 65, ideal: 82 },
    rangeControl:     { min: 58, ideal: 78 },
  },
  'Sleep Preparation': {
    shoulderSymmetry: { min: 50, ideal: 72 },
    neckAlignment:    { min: 50, ideal: 72 },
    smoothness:       { min: 68, ideal: 84 },
    rangeControl:     { min: 58, ideal: 78 },
  },
  'Freeze-State Regulation': {
    shoulderSymmetry: { min: 48, ideal: 70 },
    neckAlignment:    { min: 48, ideal: 70 },
    smoothness:       { min: 60, ideal: 80 },
    rangeControl:     { min: 55, ideal: 76 },
  },

  // Breath-led categories — smoothness very important, alignment moderate
  'Breath Regulation': {
    shoulderSymmetry: { min: 60, ideal: 80 },
    neckAlignment:    { min: 58, ideal: 78 },
    smoothness:       { min: 75, ideal: 90 },
    rangeControl:     { min: 65, ideal: 84 },
  },
  'Vagus Nerve Calming': {
    shoulderSymmetry: { min: 60, ideal: 80 },
    neckAlignment:    { min: 60, ideal: 80 },
    smoothness:       { min: 72, ideal: 88 },
    rangeControl:     { min: 65, ideal: 83 },
  },

  // Gentle movement — all dimensions moderate
  'Micro-Movement': {
    shoulderSymmetry: { min: 60, ideal: 80 },
    neckAlignment:    { min: 60, ideal: 80 },
    smoothness:       { min: 70, ideal: 88 },
    rangeControl:     { min: 68, ideal: 85 },
  },
  'Bilateral Regulation': {
    shoulderSymmetry: { min: 65, ideal: 82 },
    neckAlignment:    { min: 60, ideal: 80 },
    smoothness:       { min: 72, ideal: 88 },
    rangeControl:     { min: 65, ideal: 83 },
  },
  'Seated Flare-Friendly': {
    shoulderSymmetry: { min: 55, ideal: 76 },
    neckAlignment:    { min: 58, ideal: 78 },
    smoothness:       { min: 68, ideal: 85 },
    rangeControl:     { min: 62, ideal: 80 },
  },
  'Orienting': {
    shoulderSymmetry: { min: 60, ideal: 80 },
    neckAlignment:    { min: 62, ideal: 82 },
    smoothness:       { min: 70, ideal: 86 },
    rangeControl:     { min: 65, ideal: 82 },
  },

  // Specific tension-focus categories
  'Gentle Neck Release': {
    shoulderSymmetry: { min: 62, ideal: 82 },
    neckAlignment:    { min: 65, ideal: 85 },
    smoothness:       { min: 75, ideal: 90 },
    rangeControl:     { min: 68, ideal: 86 },
  },
  'Shoulder Tension Relief': {
    shoulderSymmetry: { min: 62, ideal: 82 },
    neckAlignment:    { min: 60, ideal: 80 },
    smoothness:       { min: 72, ideal: 88 },
    rangeControl:     { min: 65, ideal: 84 },
  },
  'Somatic Release': {
    shoulderSymmetry: { min: 58, ideal: 78 },
    neckAlignment:    { min: 58, ideal: 78 },
    smoothness:       { min: 68, ideal: 85 },
    rangeControl:     { min: 62, ideal: 80 },
  },
  'Postural Reset': {
    shoulderSymmetry: { min: 65, ideal: 84 },
    neckAlignment:    { min: 65, ideal: 84 },
    smoothness:       { min: 70, ideal: 86 },
    rangeControl:     { min: 65, ideal: 82 },
  },
}

// ─── Default fallback envelope ────────────────────────────────────────────────

const DEFAULT_ENVELOPE: MovementEnvelope = {
  shoulderSymmetry: { min: 58, ideal: 78 },
  neckAlignment:    { min: 58, ideal: 78 },
  smoothness:       { min: 68, ideal: 85 },
  rangeControl:     { min: 62, ideal: 80 },
}

// ─── Deviation analysis ───────────────────────────────────────────────────────

function analyseDeviation(
  label: string,
  value: number,
  envelope: { min: number; ideal: number },
): DeviationNote | null {
  if (value >= envelope.ideal) return null  // within ideal range, no note

  const gap = envelope.ideal - value

  if (value < envelope.min) {
    return {
      dimension: label,
      severity: gap > 25 ? 'notable' : 'moderate',
      note: dimensionNote(label, 'outside'),
    }
  }

  if (gap > 12) {
    return {
      dimension: label,
      severity: 'mild',
      note: dimensionNote(label, 'approaching'),
    }
  }

  return null
}

function dimensionNote(dimension: string, level: 'outside' | 'approaching'): string {
  const notes: Record<string, Record<string, string>> = {
    'Shoulder Symmetry': {
      outside:    'One shoulder appears higher than the other. Gently invite them to a similar height.',
      approaching: 'A slight shoulder imbalance. No need to force — just notice.',
    },
    'Neck Alignment': {
      outside:    'The neck may be straining forward or sideways. Let it soften toward centre.',
      approaching: 'Very slight neck tilt. Simply allow the head to float gently upright.',
    },
    'Smoothness': {
      outside:    'Movement is feeling a little effortful. Slowing down further can help.',
      approaching: 'Some jitter present. Smaller, slower movements will feel better.',
    },
    'Range Control': {
      outside:    'Movement amplitude seems to be exceeding a comfortable range. Smaller is safer.',
      approaching: 'Approaching the comfortable range limit. Less is always more here.',
    },
  }
  return notes[dimension]?.[level] ?? `${dimension} slightly outside the therapeutic range.`
}

// ─── Therapeutic guidance generator ──────────────────────────────────────────

function buildGuidance(
  alignment: 'within_envelope' | 'approaching_limit' | 'outside_envelope',
  deviations: DeviationNote[],
): string {
  if (alignment === 'within_envelope') {
    return 'Your movement is sitting within the therapeutic range for this exercise. Stay with this pace.'
  }
  if (alignment === 'approaching_limit') {
    const dim = deviations[0]?.dimension ?? 'one area'
    return `Movement in ${dim.toLowerCase()} is gently approaching its limit. No adjustment needed — just awareness.`
  }
  // outside_envelope
  if (deviations.length === 1) {
    return deviations[0].note
  }
  return `A few movement dimensions are outside the therapeutic envelope. Consider pausing to rest, or reducing the movement range further.`
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Compare the current movement score against the safe envelope for
 * the active exercise category.
 *
 * @param score     Output of computeMovementQuality()
 * @param category  The currently active exercise category
 * @returns         ReferenceComparison with deviations and guidance
 */
export function compareToReference(
  score: MovementQualityScore,
  category: ExerciseCategory | null,
): ReferenceComparison {
  const envelope = (category && ENVELOPES[category]) ?? DEFAULT_ENVELOPE

  const checks: Array<[string, number, { min: number; ideal: number }]> = [
    ['Shoulder Symmetry', score.shoulderSymmetry, envelope.shoulderSymmetry],
    ['Neck Alignment',    score.neckAlignment,    envelope.neckAlignment],
    ['Smoothness',        score.smoothness,        envelope.smoothness],
    ['Range Control',     score.rangeControl,      envelope.rangeControl],
  ]

  const deviations = checks
    .map(([label, value, env]) => analyseDeviation(label, value, env))
    .filter((d): d is DeviationNote => d !== null)

  const outsideCount = deviations.filter((d) => d.severity !== 'mild').length
  const inSafeRange  = deviations.length === 0

  let overallAlignment: ReferenceComparison['overallAlignment']
  if (deviations.length === 0) {
    overallAlignment = 'within_envelope'
  } else if (outsideCount === 0) {
    overallAlignment = 'approaching_limit'
  } else {
    overallAlignment = 'outside_envelope'
  }

  return {
    inSafeRange,
    deviations,
    overallAlignment,
    therapeuticGuidance: buildGuidance(overallAlignment, deviations),
  }
}

/** Get the movement envelope for a specific category — used for display. */
export function getEnvelope(category: ExerciseCategory | null): MovementEnvelope {
  return (category && ENVELOPES[category]) ?? DEFAULT_ENVELOPE
}
