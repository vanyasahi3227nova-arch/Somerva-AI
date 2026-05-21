'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import type { GeminiRecommendation } from '@/app/api/recommend/route'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckInModalProps {
  open: boolean
  onClose: () => void
  onAccept: (exerciseId: string, categoryHint: string) => void
}

type Step = 'energy' | 'stress' | 'fatigue' | 'pain' | 'emotion' | 'loading' | 'result' | 'error'

const PAIN_LOCATIONS = [
  'Head', 'Jaw', 'Neck', 'Shoulders', 'Arms', 'Hands',
  'Chest', 'Upper Back', 'Lower Back', 'Hips', 'Legs', 'Feet',
]

const EMOTIONAL_STATES = [
  { value: 'Calm', label: 'Calm', colour: 'bg-teal-50 border-teal-200 text-teal-700' },
  { value: 'Okay', label: 'Okay', colour: 'bg-cream-100 border-cream-300 text-[#6B6B60]' },
  { value: 'Anxious', label: 'Anxious', colour: 'bg-warm-50 border-warm-200 text-warm-600' },
  { value: 'Sad', label: 'Sad', colour: 'bg-blue-50 border-blue-200 text-blue-600' },
  { value: 'Numb', label: 'Numb', colour: 'bg-gray-50 border-gray-200 text-gray-500' },
  { value: 'Overwhelmed', label: 'Overwhelmed', colour: 'bg-red-50 border-red-200 text-red-600' },
]

const LEVEL_LABELS: Record<number, string> = {
  1: 'Very Low', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Very High',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SliderQuestion({
  question,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  question: string
  value: number
  onChange: (v: number) => void
  lowLabel: string
  highLabel: string
}) {
  return (
    <div>
      <p className="font-display text-xl font-light text-[#2C2C28] mb-6 leading-relaxed">
        {question}
      </p>
      <div className="mb-3">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[#7A9E6E] h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="font-body text-xs text-[#9B9B8C]">{lowLabel}</span>
          <span className="font-body text-xs text-[#9B9B8C]">{highLabel}</span>
        </div>
      </div>
      <div className="text-center">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-sm font-medium text-sage-600 bg-sage-50 px-4 py-1 rounded-full"
        >
          {LEVEL_LABELS[value]}
        </motion.span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CheckInModal({ open, onClose, onAccept }: CheckInModalProps) {
  const [step, setStep] = useState<Step>('energy')
  const [energyLevel, setEnergyLevel] = useState(3)
  const [stressLevel, setStressLevel] = useState(2)
  const [fatigueLevel, setFatigueLevel] = useState(2)
  const [painLocations, setPainLocations] = useState<string[]>([])
  const [emotionalState, setEmotionalState] = useState('Okay')
  const [recommendation, setRecommendation] = useState<GeminiRecommendation | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const togglePain = (loc: string) => {
    setPainLocations((prev) =>
      prev.includes(loc) ? prev.filter((p) => p !== loc) : [...prev, loc]
    )
  }

  const reset = () => {
    setStep('energy')
    setEnergyLevel(3)
    setStressLevel(2)
    setFatigueLevel(2)
    setPainLocations([])
    setEmotionalState('Okay')
    setRecommendation(null)
    setErrorMsg('')
  }

  const handleClose = () => {
    onClose()
    setTimeout(reset, 300)
  }

  const submitToGemini = async () => {
    setStep('loading')
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ energyLevel, stressLevel, fatigueLevel, painLocations, emotionalState }),
      })
      if (!res.ok) throw new Error('API error')
      const data: GeminiRecommendation = await res.json()
      setRecommendation(data)
      setStep('result')
    } catch {
      setErrorMsg('We could not reach the recommendation engine. Please try again.')
      setStep('error')
    }
  }

  const steps: Step[] = ['energy', 'stress', 'fatigue', 'pain', 'emotion']
  const currentStepIndex = steps.indexOf(step as Step)
  const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 100

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[80] bg-black/25 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-x-4 top-[6vh] z-[90] mx-auto max-w-md max-h-[88vh] overflow-y-auto bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-soft-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-sage-500" />
                  <span className="font-body text-xs font-medium text-[#9B9B8C] uppercase tracking-widest">
                    How are you right now?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-xl bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors"
                >
                  <X size={14} className="text-[#6B6B60]" />
                </button>
              </div>
              {step !== 'loading' && step !== 'result' && step !== 'error' && (
                <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="h-full bg-sage-400 rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* Step 1: Energy */}
                {step === 'energy' && (
                  <motion.div key="energy" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <SliderQuestion
                      question="How is your energy level today?"
                      value={energyLevel}
                      onChange={setEnergyLevel}
                      lowLabel="Very Low"
                      highLabel="High"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('stress')}
                      className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium"
                    >
                      Continue <ChevronRight size={15} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Stress */}
                {step === 'stress' && (
                  <motion.div key="stress" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <SliderQuestion
                      question="How stressed do you feel right now?"
                      value={stressLevel}
                      onChange={setStressLevel}
                      lowLabel="Calm"
                      highLabel="Very Stressed"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('fatigue')}
                      className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium"
                    >
                      Continue <ChevronRight size={15} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 3: Fatigue */}
                {step === 'fatigue' && (
                  <motion.div key="fatigue" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <SliderQuestion
                      question="How is your fatigue level?"
                      value={fatigueLevel}
                      onChange={setFatigueLevel}
                      lowLabel="Rested"
                      highLabel="Exhausted"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('pain')}
                      className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium"
                    >
                      Continue <ChevronRight size={15} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 4: Pain locations */}
                {step === 'pain' && (
                  <motion.div key="pain" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <p className="font-display text-xl font-light text-[#2C2C28] mb-2 leading-relaxed">
                      Where are you feeling pain or tension?
                    </p>
                    <p className="font-body text-xs text-[#9B9B8C] mb-5">Select all that apply, or skip if none.</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {PAIN_LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => togglePain(loc)}
                          className={`px-3 py-1.5 rounded-full font-body text-xs font-medium border transition-all ${
                            painLocations.includes(loc)
                              ? 'bg-sage-100 border-sage-300 text-sage-700'
                              : 'bg-cream-100 border-cream-300 text-[#6B6B60] hover:bg-sage-50'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('emotion')}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium"
                    >
                      Continue <ChevronRight size={15} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 5: Emotional state */}
                {step === 'emotion' && (
                  <motion.div key="emotion" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <p className="font-display text-xl font-light text-[#2C2C28] mb-5 leading-relaxed">
                      How would you describe your emotional state?
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {EMOTIONAL_STATES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setEmotionalState(s.value)}
                          className={`py-3 px-4 rounded-2xl font-body text-sm font-medium border transition-all ${
                            emotionalState === s.value
                              ? s.colour + ' shadow-sm'
                              : 'bg-cream-50 border-cream-200 text-[#9B9B8C] hover:bg-cream-100'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={submitToGemini}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium"
                    >
                      <Sparkles size={14} />
                      Get my recommendation
                    </motion.button>
                  </motion.div>
                )}

                {/* Loading */}
                {step === 'loading' && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 flex flex-col items-center gap-4 text-center"
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                      <Loader2 size={32} className="text-sage-400" />
                    </motion.div>
                    <p className="font-display text-lg font-light text-[#2C2C28]">Finding your practice…</p>
                    <p className="font-body text-sm text-[#9B9B8C] max-w-xs leading-relaxed">
                      We are considering your current state to suggest the safest, most supportive exercise.
                    </p>
                  </motion.div>
                )}

                {/* Result */}
                {step === 'result' && recommendation && (
                  <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={15} className="text-sage-500" />
                      <span className="font-body text-xs font-medium text-sage-600 uppercase tracking-widest">
                        Recommended for you
                      </span>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-sage-50 to-teal-50 rounded-2xl border border-sage-100 mb-4"
                      style={{ background: 'linear-gradient(135deg, #EEF4EC 0%, #EAF2F0 100%)' }}
                    >
                      <h3 className="font-display text-2xl font-light text-[#2C2C28] mb-1">
                        {recommendation.recommendedExercise}
                      </h3>
                      <span className="font-body text-xs text-sage-600 bg-sage-100 px-2 py-0.5 rounded-full">
                        {recommendation.recommendedCategory}
                      </span>
                      <p className="font-body text-sm text-[#6B6B60] mt-3 leading-relaxed">
                        {recommendation.reason}
                      </p>
                    </div>

                    {recommendation.avoid.length > 0 && (
                      <div className="p-4 bg-warm-50 rounded-xl border border-warm-100 mb-4">
                        <p className="font-body text-xs text-warm-600 font-medium mb-1">Better to avoid today</p>
                        <p className="font-body text-xs text-warm-500 leading-relaxed">
                          {recommendation.avoid.join(' · ')}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAccept(
                          recommendation.recommendedExercise.toLowerCase().replace(/\s+/g, '-'),
                          recommendation.recommendedCategory
                        )}
                        className="flex-1 py-3.5 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium hover:bg-sage-600 transition-colors"
                      >
                        Start this practice
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleClose}
                        className="px-5 py-3.5 bg-cream-200 text-[#6B6B60] rounded-2xl font-body text-sm font-medium hover:bg-cream-300 transition-colors"
                      >
                        Browse all
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {step === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-warm-50 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={22} className="text-warm-500" />
                    </div>
                    <p className="font-display text-lg font-light text-[#2C2C28] mb-2">Something went gently wrong</p>
                    <p className="font-body text-sm text-[#9B9B8C] mb-6 leading-relaxed max-w-xs mx-auto">{errorMsg}</p>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('emotion')}
                        className="flex-1 py-3 bg-sage-500 text-white rounded-2xl font-body text-sm"
                      >
                        Try again
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        onClick={handleClose}
                        className="px-5 py-3 bg-cream-200 text-[#6B6B60] rounded-2xl font-body text-sm"
                      >
                        Browse all
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
