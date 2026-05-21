'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Play, Pause, CheckCircle2, AlertTriangle,
  Sparkles, ChevronRight,
} from 'lucide-react'
import type { SomaticExercise } from '@/lib/exercises'

// ─── Intensity display helpers ────────────────────────────────────────────────

const INTENSITY_LABELS: Record<string, string> = {
  very_low:           'Very gentle',
  low:                'Gentle',
  moderate:           'Moderate',
  moderate_to_active: 'Moderate–active',
}
const INTENSITY_STYLES: Record<string, string> = {
  very_low:           'bg-teal-50 text-teal-600',
  low:                'bg-sage-100 text-sage-600',
  moderate:           'bg-warm-50 text-warm-600',
  moderate_to_active: 'bg-warm-100 text-warm-700',
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExercisePreviewModalProps {
  exercise: SomaticExercise | null
  open: boolean
  onClose: () => void
  onBeginLive: () => void
  beginLabel?: string
}

// ─── Demonstration panel ──────────────────────────────────────────────────────
// Attempts a real <video> from /public/exercise-videos/<id>.mp4.
// Falls back to an animated breathing illustration when no file is found.

function DemonstrationPanel({ exercise }: { exercise: SomaticExercise }) {
  const [videoError, setVideoError] = useState(false)
  const [playing, setPlaying]       = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) { el.play(); setPlaying(true) }
    else           { el.pause(); setPlaying(false) }
  }

  // Step-based guide when no video
  const [activeStep, setActiveStep] = useState(0)
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!videoError) return
    stepTimerRef.current = setInterval(() => {
      setActiveStep((s) => (s + 1) % exercise.preview.instructions.length)
    }, 3500)
    return () => { if (stepTimerRef.current) clearInterval(stepTimerRef.current) }
  }, [videoError, exercise.preview.instructions.length])

  if (videoError) {
    const steps = exercise.preview.instructions
    return (
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EEF4EC 0%, #F0F6EE 100%)' }}
      >
        {/* Cue banner */}
        <div className="px-5 pt-5 pb-3 border-b border-sage-100/60">
          <span className="font-display text-sm italic text-sage-700">
            "{exercise.cue}"
          </span>
        </div>

        {/* Step carousel */}
        <div className="px-5 py-4" style={{ minHeight: 130 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sage-500 flex items-center justify-center">
                <span className="font-body text-[11px] font-semibold text-white">{activeStep + 1}</span>
              </div>
              <p className="font-body text-sm text-[#2C2C28] leading-relaxed pt-0.5">
                {steps[activeStep]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`rounded-full transition-all ${
                  i === activeStep
                    ? 'w-5 h-1.5 bg-sage-500'
                    : 'w-1.5 h-1.5 bg-sage-200 hover:bg-sage-300'
                }`}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>
          <span className="font-body text-[10px] text-[#9B9B8C]">
            {activeStep + 1} / {steps.length}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#1a1a18]" style={{ height: 200 }}>
      <video
        ref={videoRef}
        src={`/exercise-videos/${exercise.id}.mp4`}
        poster={`/exercise-thumbnails/${exercise.id}.jpg`}
        loop
        playsInline
        className="w-full h-full object-cover"
        onError={() => setVideoError(true)}
        onEnded={() => setPlaying(false)}
      />
      <div className="absolute inset-0 flex items-end justify-between p-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          {playing
            ? <Pause size={15} className="text-[#2C2C28]" />
            : <Play  size={15} className="text-[#2C2C28] ml-0.5" />}
        </motion.button>
        <span className="font-body text-xs text-white/80 bg-black/30 px-2 py-1 rounded-full">
          {exercise.duration}
        </span>
      </div>
      <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
        <span className="font-display text-sm italic text-white/90 bg-black/25 px-4 py-1.5 rounded-full">
          "{exercise.cue}"
        </span>
      </div>
    </div>
  )
}

// ─── Instruction step ─────────────────────────────────────────────────────────

function InstructionStep({ step, index }: { step: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-3"
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center mt-0.5">
        <span className="font-body text-[10px] font-semibold text-sage-600">{index + 1}</span>
      </div>
      <p className="font-body text-sm text-[#6B6B60] leading-relaxed">{step}</p>
    </motion.div>
  )
}

// ─── Posture guidance ─────────────────────────────────────────────────────────

function buildPostureGuidance(exercise: SomaticExercise): string[] {
  const tips: string[] = [
    'Find a position where you can remain for the full duration without discomfort.',
    'Let your spine find its natural curve — not forced upright, not collapsed.',
  ]
  if (exercise.tensionFocusAreas.some(a => a.toLowerCase().includes('shoulder')))
    tips.push('Allow your shoulders to drop away from your ears before beginning.')
  if (exercise.tensionFocusAreas.some(a => a.toLowerCase().includes('neck')))
    tips.push('Let your chin float gently forward — no tucking or tilting required.')
  if (exercise.tensionFocusAreas.some(a => a.toLowerCase().includes('jaw')))
    tips.push('Check for jaw tension: let the teeth part slightly and the tongue rest easy.')
  if (exercise.category === 'Breath Regulation' || exercise.category === 'Vagus Nerve Calming')
    tips.push('One hand on the belly can help you feel the breath without directing it.')
  if (exercise.energyRequirement === 'minimal')
    tips.push('You may lie down completely if that feels more supportive today.')
  return tips
}

function buildTensionMistakes(exercise: SomaticExercise): string[] {
  const mistakes: string[] = [
    'Holding the breath while moving — always let the breath continue naturally.',
    'Trying to do the exercise "correctly" rather than comfortably.',
  ]
  if (exercise.intensity === 'very_low')
    mistakes.push('Expecting a visible result or sensation — subtle is the point.')
  if (exercise.category === 'Gentle Neck Release' || exercise.category === 'Shoulder Tension Relief')
    mistakes.push('Moving too quickly or pushing into end range — slow is always better here.')
  if (exercise.category === 'Breath Regulation')
    mistakes.push('Controlling the inhale as well as the exhale — let the body decide when to breathe in.')
  if (exercise.contraindications.length > 0)
    mistakes.push(`If you experience ${exercise.contraindications[0].toLowerCase()}, pause and rest.`)
  mistakes.push("Checking whether you're doing it 'right' — trust your body's pace.")
  return mistakes.slice(0, 4)
}

// ─── Posture tab ──────────────────────────────────────────────────────────────

function PostureTab({ exercise }: { exercise: SomaticExercise }) {
  const tips    = buildPostureGuidance(exercise)
  const mistakes = buildTensionMistakes(exercise)
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-2xl border border-teal-100" style={{ background: 'rgba(234,242,240,0.45)' }}>
        <p className="font-body text-xs font-semibold text-teal-700 uppercase tracking-wider mb-3">
          Posture guidance
        </p>
        <div className="flex flex-col gap-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0 mt-2" />
              <p className="font-body text-xs text-teal-800 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-amber-100" style={{ background: 'rgba(254,249,240,0.60)' }}>
        <p className="font-body text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">
          Common tension patterns to notice
        </p>
        <div className="flex flex-col gap-2">
          {mistakes.map((m, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertTriangle size={11} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="font-body text-xs text-amber-800 leading-relaxed">{m}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Benefits tab ─────────────────────────────────────────────────────────────

function BenefitsTab({ exercise }: { exercise: SomaticExercise }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        {exercise.preview.benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-2"
          >
            <CheckCircle2 size={13} className="text-teal-500 flex-shrink-0 mt-0.5" />
            <p className="font-body text-sm text-[#6B6B60] leading-relaxed">{b}</p>
          </motion.div>
        ))}
      </div>

      {/* Therapeutic benefit explanation */}
      <div className="p-4 rounded-2xl border border-sage-100" style={{ background: 'rgba(238,244,236,0.55)' }}>
        <p className="font-body text-xs font-semibold text-sage-700 uppercase tracking-wider mb-2">
          Why this helps
        </p>
        <p className="font-body text-xs text-sage-800 leading-relaxed">{exercise.purpose}</p>
        {exercise.fibromyalgiaSafetyNotes && (
          <p className="font-body text-xs text-sage-600 italic leading-relaxed mt-2">
            {exercise.fibromyalgiaSafetyNotes}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ExercisePreviewModal({
  exercise,
  open,
  onClose,
  onBeginLive,
  beginLabel = 'Begin live session',
}: ExercisePreviewModalProps) {
  const [tab, setTab] = useState<'instructions' | 'posture' | 'benefits'>('instructions')

  if (!exercise) return null
  const Icon = exercise.icon

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="epm-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed inset-x-4 top-[4vh] z-[80] mx-auto max-w-lg max-h-[92vh] overflow-y-auto bg-[#FAFAF6] rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-soft-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Sticky header ── */}
            <div className="sticky top-0 z-10 bg-[#FAFAF6]/96 backdrop-blur-sm px-6 pt-6 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-sage-600" />
                  </div>
                  <div>
                    <p className="font-body text-[10px] text-[#9B9B8C] uppercase tracking-widest">
                      {exercise.category}
                    </p>
                    <h2 id="epm-title" className="font-display text-xl font-light text-[#2C2C28]">
                      {exercise.name}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close preview"
                  className="w-8 h-8 rounded-xl bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors flex-shrink-0 mt-0.5"
                >
                  <X size={14} className="text-[#6B6B60]" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className={`font-body text-[10px] font-medium px-2 py-0.5 rounded-full ${INTENSITY_STYLES[exercise.intensity] ?? 'bg-teal-50 text-teal-600'}`}>
                  {INTENSITY_LABELS[exercise.intensity] ?? exercise.intensity}
                </span>
                <span className="font-body text-[10px] font-medium px-2 py-0.5 rounded-full bg-cream-200 text-[#6B6B60]">
                  {exercise.energyRequirement} energy
                </span>
                <span className="font-body text-[10px] font-medium px-2 py-0.5 rounded-full bg-sage-50 text-sage-600">
                  {exercise.duration}
                </span>
              </div>
            </div>

            <div className="px-6 pb-6 pt-5 flex flex-col gap-5">

              {/* ── Video / illustration demonstration ── */}
              <DemonstrationPanel exercise={exercise} />

              {/* ── Purpose line ── */}
              <div className="flex items-start gap-2">
                <Sparkles size={13} className="text-sage-400 flex-shrink-0 mt-0.5" />
                <p className="font-body text-sm text-[#6B6B60] italic leading-relaxed">{exercise.purpose}</p>
              </div>

              {/* ── Tab bar ── */}
              <div className="flex gap-1 p-1 bg-cream-100 rounded-2xl">
                {(['instructions', 'posture', 'benefits'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-xl font-body text-xs font-medium capitalize transition-all ${
                      tab === t
                        ? 'bg-white text-[#2C2C28] shadow-sm'
                        : 'text-[#9B9B8C] hover:text-[#6B6B60]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* ── Tab content ── */}
              <AnimatePresence mode="wait">
                {tab === 'instructions' && (
                  <motion.div
                    key="instructions"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-3.5">
                      {exercise.preview.instructions.map((step, i) => (
                        <InstructionStep key={i} step={step} index={i} />
                      ))}
                    </div>
                    <div className="p-3 bg-cream-100 rounded-xl border border-cream-200">
                      <p className="font-body text-xs text-[#9B9B8C] leading-relaxed italic">
                        Pacing: {exercise.pacingStyle}
                      </p>
                    </div>
                  </motion.div>
                )}

                {tab === 'posture' && (
                  <motion.div
                    key="posture"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                  >
                    <PostureTab exercise={exercise} />
                  </motion.div>
                )}

                {tab === 'benefits' && (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                  >
                    <BenefitsTab exercise={exercise} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── CTA ── */}
              <div className="flex gap-3 pt-2 border-t border-[rgba(0,0,0,0.05)]">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(106,143,98,0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onBeginLive}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium hover:bg-sage-600 transition-colors"
                >
                  {beginLabel}
                  <ChevronRight size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={onClose}
                  className="px-5 py-4 bg-cream-200 text-[#6B6B60] rounded-2xl font-body text-sm font-medium hover:bg-cream-300 transition-colors"
                >
                  Back
                </motion.button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
