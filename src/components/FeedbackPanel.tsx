'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Activity, BarChart2, Loader2, Brain, Target } from 'lucide-react'
import type { SomaticFeedback, ReferenceComparison } from '@/hooks/useSomaticFeedback'
import type { MovementQualityScore } from '@/lib/movementScoring'
import type { BaselineComparison } from '@/lib/calibrationEngine'
import type { ClassifierOutput, MovementState } from '@/lib/mlMovementClassifier'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeedbackPanelProps {
  feedback: SomaticFeedback[]
  score: number
  sessionState: string
  movementScore?: MovementQualityScore | null
  baselineComparison?: BaselineComparison | null
  calibrationProgress?: number
  isCalibrating?: boolean
  classifierOutput?: ClassifierOutput | null
  referenceComparison?: ReferenceComparison | null
}

// ─── Movement state styling ───────────────────────────────────────────────────

const STATE_STYLES: Record<MovementState, { bg: string; text: string; dot: string }> = {
  Smooth:       { bg: 'bg-teal-50',  text: 'text-teal-600',  dot: 'bg-teal-400' },
  Stable:       { bg: 'bg-sage-50',  text: 'text-sage-600',  dot: 'bg-sage-400' },
  Guarded:      { bg: 'bg-cream-200', text: 'text-[#6B6B60]', dot: 'bg-[#9B9B8C]' },
  Tense:        { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400' },
  Asymmetrical: { bg: 'bg-blue-50',  text: 'text-blue-500',  dot: 'bg-blue-400' },
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const size = 80
  const sw   = 5
  const r    = (size - sw) / 2
  const c    = 2 * Math.PI * r
  const off  = c - (score / 100) * c
  const col  = score >= 75 ? '#7A9E6E' : score >= 50 ? '#8ABFB8' : '#C4A06C'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0EDE4" strokeWidth={sw} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={col} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.div
          key={score}
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="font-display text-xl font-medium text-[#2C2C28]"
        >
          {score}
        </motion.div>
        <div className="font-body text-[9px] text-[#9B9B8C] uppercase tracking-wide">quality</div>
      </div>
    </div>
  )
}

// ─── Metric bar ───────────────────────────────────────────────────────────────

function MetricBar({ label, value, color = 'bg-sage-400' }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between mb-0.5">
        <span className="font-body text-xs text-[#9B9B8C]">{label}</span>
        <motion.span
          key={value}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className="font-body text-xs text-[#6B6B60] tabular-nums"
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  )
}

// ─── ML state badge ───────────────────────────────────────────────────────────

function MLStateBadge({ output }: { output: ClassifierOutput }) {
  const style = STATE_STYLES[output.movementState]
  const confidencePct = Math.round(output.confidence * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain size={13} className="text-sage-500" />
        <span className="font-body text-xs font-medium text-[#2C2C28]">Movement Analysis</span>
        <span className="ml-auto font-body text-[10px] text-[#9B9B8C]">ML · rule-based</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${style.bg}`}>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
          />
          <span className={`font-body text-xs font-semibold ${style.text}`}>
            {output.movementState}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-body text-[10px] text-[#9B9B8C]">Confidence</span>
          <span className="font-body text-[10px] font-medium text-[#2C2C28] tabular-nums">
            {confidencePct}%
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="h-1 bg-cream-200 rounded-full overflow-hidden mb-3">
        <motion.div
          animate={{ width: `${confidencePct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full ${style.dot}`}
        />
      </div>

      <p className="font-body text-[10px] text-[#9B9B8C] leading-relaxed">
        {output.dominantFeature}
      </p>
    </motion.div>
  )
}

// ─── Reference alignment card ─────────────────────────────────────────────────

function ReferenceCard({ ref: comparison }: { ref: ReferenceComparison }) {
  const alignStyle = {
    within_envelope:   { color: 'text-teal-600',   bg: 'bg-teal-50',  label: 'Within range' },
    approaching_limit: { color: 'text-amber-600',  bg: 'bg-amber-50', label: 'Approaching limit' },
    outside_envelope:  { color: 'text-[#6B6B60]',  bg: 'bg-cream-200', label: 'Outside range' },
  }[comparison.overallAlignment]

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Target size={13} className="text-sage-500" />
        <span className="font-body text-xs font-medium text-[#2C2C28]">Therapeutic Range</span>
        <span className={`ml-auto font-body text-[10px] font-medium px-2 py-0.5 rounded-full ${alignStyle.bg} ${alignStyle.color}`}>
          {alignStyle.label}
        </span>
      </div>
      <p className="font-body text-xs text-[#6B6B60] leading-relaxed">
        {comparison.therapeuticGuidance}
      </p>
      {comparison.deviations.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {comparison.deviations.slice(0, 2).map((d, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#9B9B8C] flex-shrink-0 mt-1.5" />
              <p className="font-body text-[10px] text-[#9B9B8C] leading-relaxed">{d.note}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Calibration banner ───────────────────────────────────────────────────────

function CalibrationBanner({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100)
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Loader2 size={13} className="text-teal-500" />
        </motion.div>
        <span className="font-body text-xs font-medium text-[#2C2C28]">Building your baseline</span>
        <span className="ml-auto font-body text-xs text-teal-600 tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-teal-400 rounded-full"
        />
      </div>
      <p className="font-body text-xs text-[#9B9B8C] mt-2 leading-relaxed">
        We are learning your natural movement pattern. This only happens once.
      </p>
    </motion.div>
  )
}

// ─── Baseline comparison ──────────────────────────────────────────────────────

function BaselineCard({ comparison }: { comparison: BaselineComparison }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 size={13} className="text-sage-500" />
        <span className="font-body text-xs font-medium text-[#2C2C28]">vs. Your Baseline</span>
      </div>
      <div className="flex flex-col gap-2">
        {comparison.messages.map((msg, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="font-body text-xs text-[#6B6B60] leading-relaxed"
          >
            {msg}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Category pill colours ────────────────────────────────────────────────────

const categoryColors = {
  posture: 'bg-sage-100 text-sage-600',
  breath:  'bg-teal-100 text-teal-600',
  jaw:     'bg-warm-100 text-warm-500',
  neck:    'bg-cream-300 text-[#6B6B60]',
  general: 'bg-cream-200 text-[#9B9B8C]',
  ml:      'bg-blue-50 text-blue-500',
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function FeedbackPanel({
  feedback,
  score,
  sessionState,
  movementScore,
  baselineComparison,
  calibrationProgress = 0,
  isCalibrating = false,
  classifierOutput,
  referenceComparison,
}: FeedbackPanelProps) {
  const latestFeedback = feedback[feedback.length - 1]
  const history        = feedback.slice(0, -1).reverse().slice(0, 4)

  const hasRealScores = !!movementScore && score > 0
  const metrics = hasRealScores
    ? [
        { label: 'Shoulder Symmetry', value: movementScore!.shoulderSymmetry, color: 'bg-sage-400' },
        { label: 'Neck Alignment',    value: movementScore!.neckAlignment,    color: 'bg-teal-400' },
        { label: 'Smoothness',        value: movementScore!.smoothness,       color: 'bg-sage-300' },
        { label: 'Range Control',     value: movementScore!.rangeControl,     color: 'bg-teal-300' },
      ]
    : [
        { label: 'Posture',  value: Math.min(100, score + 8), color: 'bg-sage-400' },
        { label: 'Breath',   value: Math.max(0, score - 5),   color: 'bg-teal-400' },
        { label: 'Tension',  value: Math.min(100, score + 3), color: 'bg-sage-300' },
      ]

  return (
    <div className="flex flex-col gap-4">

      {/* Calibration */}
      <AnimatePresence>
        {isCalibrating && calibrationProgress < 1 && (
          <motion.div key="cal" exit={{ opacity: 0, y: -6 }}>
            <CalibrationBanner progress={calibrationProgress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ML movement state */}
      <AnimatePresence>
        {classifierOutput && sessionState === 'active' && (
          <motion.div key="ml" exit={{ opacity: 0, y: -6 }}>
            <MLStateBadge output={classifierOutput} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reference movement comparison */}
      <AnimatePresence>
        {referenceComparison && sessionState === 'active' && !isCalibrating && (
          <motion.div key="ref" exit={{ opacity: 0 }}>
            <ReferenceCard ref={referenceComparison} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Baseline comparison */}
      <AnimatePresence>
        {baselineComparison && !isCalibrating && (
          <motion.div key="baseline" exit={{ opacity: 0 }}>
            <BaselineCard comparison={baselineComparison} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score ring + metric bars */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5">
        <div className="flex items-center gap-3 mb-4">
          <Activity size={15} className="text-sage-500" />
          <h3 className="font-body text-sm font-medium text-[#2C2C28]">Movement Quality</h3>
          {movementScore?.breathingRhythm != null && (
            <span className="ml-auto font-body text-[10px] text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full">
              Breath {movementScore.breathingRhythm}
            </span>
          )}
        </div>
        <div className="flex items-center gap-5">
          <ScoreRing score={score} />
          <div className="flex-1 space-y-2">
            {metrics.map((m) => (
              <MetricBar key={m.label} label={m.label} value={m.value} color={m.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Live guidance */}
      <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={15} className="text-teal-500" />
          <h3 className="font-body text-sm font-medium text-[#2C2C28]">Live Guidance</h3>
          {sessionState === 'active' && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-auto w-1.5 h-1.5 rounded-full bg-sage-400"
            />
          )}
        </div>

        <AnimatePresence mode="wait">
          {latestFeedback ? (
            <motion.div
              key={latestFeedback.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="mb-4 p-4 rounded-2xl border border-sage-100"
              style={{ background: 'linear-gradient(135deg, #F0F4EE 0%, #EAF2F0 100%)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    categoryColors[latestFeedback.category as keyof typeof categoryColors] ??
                    categoryColors.general
                  }`}
                >
                  {latestFeedback.category}
                </span>
                {latestFeedback.movementState && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    STATE_STYLES[latestFeedback.movementState].bg
                  } ${STATE_STYLES[latestFeedback.movementState].text}`}>
                    {latestFeedback.movementState}
                  </span>
                )}
              </div>
              <p className="font-body text-sm text-[#2C2C28] leading-relaxed">
                {latestFeedback.message}
              </p>
              <p className="font-body text-xs text-[#9B9B8C] mt-2">{latestFeedback.time}</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-4 bg-cream-100 rounded-2xl text-center"
            >
              <p className="font-body text-sm text-[#9B9B8C]">
                {sessionState === 'idle'
                  ? 'Guidance will appear once your session begins.'
                  : 'Observing your movement…'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-body text-xs text-[#9B9B8C]">Earlier this session</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {history.map((item) => (
                <div key={item.id} className="flex items-start gap-2 py-1.5">
                  <span
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                      categoryColors[item.category as keyof typeof categoryColors] ?? categoryColors.general
                    }`}
                  >
                    {item.category}
                  </span>
                  <p className="font-body text-xs text-[#6B6B60] leading-relaxed">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
