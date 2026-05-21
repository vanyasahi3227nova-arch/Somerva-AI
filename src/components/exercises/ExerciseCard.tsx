'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { SomaticExercise } from '@/lib/exercises'

interface ExerciseCardProps {
  exercise: SomaticExercise
  index?: number
  onPreview: (exercise: SomaticExercise) => void
}

const intensityStyles: Record<string, string> = {
  very_low: 'bg-teal-50 text-teal-600',
  low:      'bg-sage-100 text-sage-600',
  moderate: 'bg-warm-50 text-warm-600',
  moderate_to_active: 'bg-warm-100 text-warm-700',
}

const intensityLabels: Record<string, string> = {
  very_low:           'Very gentle',
  low:                'Gentle',
  moderate:           'Moderate',
  moderate_to_active: 'Moderate–active',
}

const energyStyles: Record<string, string> = {
  minimal:  'bg-cream-100 text-[#9B9B8C]',
  low:      'bg-cream-200 text-[#6B6B60]',
  moderate: 'bg-warm-50 text-warm-600',
}

export function ExerciseCard({ exercise, index = 0, onPreview }: ExerciseCardProps) {
  const Icon = exercise.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.07)' }}
      className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-6 flex flex-col h-full transition-shadow duration-300"
    >
      {/* Icon + badges row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl bg-sage-100 flex items-center justify-center">
          <Icon size={20} className="text-sage-600" />
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full',
            intensityStyles[exercise.intensity] ?? 'bg-cream-100 text-[#9B9B8C]')}>
            {intensityLabels[exercise.intensity] ?? exercise.intensity}
          </span>
          <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full',
            energyStyles[exercise.energyRequirement] ?? 'bg-cream-100 text-[#9B9B8C]')}>
            {exercise.energyRequirement} energy
          </span>
        </div>
      </div>

      {/* Category label */}
      <p className="font-body text-[10px] text-[#9B9B8C] uppercase tracking-widest mb-1">{exercise.category}</p>

      {/* Title + description */}
      <h2 className="font-display text-xl font-medium text-[#2C2C28] mb-1">{exercise.name}</h2>
      <p className="font-body text-sm text-[#6B6B60] leading-relaxed flex-1 mb-3">{exercise.description}</p>

      {/* Purpose line */}
      <p className="font-body text-xs text-teal-600 italic leading-relaxed mb-4">
        {exercise.purpose}
      </p>

      {/* Tension focus chips */}
      {exercise.tensionFocusAreas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-5">
          {exercise.tensionFocusAreas.slice(0, 3).map((area) => (
            <span key={area} className="font-body text-[10px] px-2 py-0.5 bg-cream-100 text-[#9B9B8C] rounded-full">
              {area}
            </span>
          ))}
        </div>
      )}

      {/* Duration + CTA */}
      <div className="flex items-center justify-between gap-3 mt-auto">
        <span className="font-body text-xs text-[#9B9B8C]">{exercise.duration}</span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onPreview(exercise)}
          className="flex-1 py-2.5 bg-cream-100 text-[#2C2C28] border border-cream-300 rounded-2xl font-body text-sm font-medium hover:bg-sage-50 hover:border-sage-200 hover:text-sage-700 transition-colors"
        >
          Preview
        </motion.button>
      </div>
    </motion.article>
  )
}
