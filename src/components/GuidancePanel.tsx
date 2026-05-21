'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Exercise } from './ExerciseSelector'

interface GuidancePanelProps {
  exercise: Exercise | undefined
  sessionState: string
  currentStep: number
}

const generalGuidance = [
  'Let your shoulders soften downward naturally.',
  'Notice your breathing without changing it forcefully.',
  'Observe sensations with curiosity, not correction.',
  'Allow your body to settle into stillness.',
  'There is no performance here — only awareness.',
]

const exerciseGuidance: Record<string, string[]> = {
  'shoulder-release': [
    'Let your shoulders soften downward naturally.',
    'Notice if you are bracing anywhere — you can release.',
    'Allow the weight of your arms to gently open your chest.',
    'Breathe into the space between your shoulder blades.',
  ],
  'neck-relaxation': [
    'Allow your neck to lengthen upward, without strain.',
    'Let your head float gently above your spine.',
    'If tension arises, breathe toward it rather than away.',
    'Move slowly, with full permission to pause at any moment.',
  ],
  'breath-regulation': [
    'Notice your breathing without changing it forcefully.',
    'Let your exhale be slightly longer than your inhale.',
    'Feel your ribcage expand in all directions as you breathe.',
    'There is nothing to force — the breath knows the way.',
  ],
  'jaw-unclenching': [
    'Let your jaw soften. You may part your teeth slightly.',
    'Notice the space behind your eyes — let it widen.',
    'Your face holds more tension than you might realize. That is okay.',
    'With each exhale, invite your face to become heavier.',
  ],
  'spine-alignment-reset': [
    'Imagine space between each vertebra, like pearls on a string.',
    'Lengthen through the crown of your head — lightly, not rigidly.',
    'Soften the lower ribs and let the pelvis feel neutral.',
    'You are not fixing. You are witnessing. That is enough.',
  ],
}

export function GuidancePanel({ exercise, sessionState, currentStep }: GuidancePanelProps) {
  const steps = exercise
    ? exerciseGuidance[exercise.id] ?? generalGuidance
    : generalGuidance

  const currentGuidance = steps[currentStep % steps.length]

  return (
    <div className="bg-gradient-to-r from-teal-50 to-sage-50 rounded-3xl border border-teal-100 p-5"
      style={{ background: 'linear-gradient(135deg, #EAF2F0 0%, #EEF4EC 100%)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Heart size={14} className="text-teal-500" />
        <span className="font-body text-xs font-medium text-teal-600 uppercase tracking-widest">
          Somatic Guidance
        </span>
        {exercise && (
          <span className="ml-auto font-body text-xs text-[#9B9B8C]">
            {exercise.name}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={currentGuidance}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
          className="font-display text-xl font-light text-[#2C2C28] leading-relaxed italic"
        >
          "{currentGuidance}"
        </motion.p>
      </AnimatePresence>

      {/* Step dots */}
      {sessionState === 'active' && (
        <div className="flex items-center gap-1.5 mt-4">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentStep % steps.length
                  ? 'w-4 bg-teal-400'
                  : 'w-1.5 bg-teal-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
