'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { EXERCISES, type SomaticExercise } from '@/lib/exercises'

export { EXERCISES }
export type { SomaticExercise as Exercise }

interface ExerciseSelectorProps {
  selected: string
  onSelect: (id: string) => void
  onStartExercise: () => void
  liveUnlocked: boolean
}

export function ExerciseSelector({
  selected,
  onSelect,
  onStartExercise,
  liveUnlocked,
}: ExerciseSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="px-5 py-4 border-b border-[rgba(0,0,0,0.05)]"
      >
        <h3 className="font-display text-lg font-medium text-[#2C2C28]">Choose Your Practice</h3>
        <p className="font-body text-xs text-[#9B9B8C] mt-0.5">
          {liveUnlocked ? 'Session ready — camera available below' : 'Select, preview, then begin live'}
        </p>
      </motion.div>
      <div className="p-3 flex flex-col gap-2">
        {EXERCISES.map((exercise) => {
          const Icon = exercise.icon
          const isSelected = selected === exercise.id
          return (
            <motion.button
              key={exercise.id}
              onClick={() => onSelect(exercise.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.99 }}
              className={clsx(
                'w-full text-left p-4 rounded-2xl transition-all duration-200 border',
                isSelected
                  ? 'bg-sage-100 border-sage-200'
                  : 'bg-transparent border-transparent hover:bg-cream-100 hover:border-cream-300'
              )}
            >
              <motion.div layout className="flex items-center gap-3">
                <motion.div
                  animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
                  className={clsx(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-sage-200' : 'bg-cream-200'
                  )}
                >
                  <Icon size={16} className={isSelected ? 'text-sage-600' : 'text-[#9B9B8C]'} />
                </motion.div>
                <motion.div layout className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={clsx(
                        'font-body text-sm font-medium truncate',
                        isSelected ? 'text-sage-700' : 'text-[#2C2C28]'
                      )}
                    >
                      {exercise.name}
                    </span>
                    <span className="font-body text-xs text-[#9B9B8C] flex-shrink-0">
                      {exercise.duration}
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#9B9B8C] mt-0.5 truncate">
                    {exercise.description}
                  </p>
                </motion.div>
              </motion.div>
            </motion.button>
          )
        })}
      </div>
      <div className="p-4 pt-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onStartExercise}
          className="w-full py-3 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium hover:bg-sage-600 transition-colors"
        >
          {liveUnlocked ? 'Review Preview Again' : 'Start Exercise'}
        </motion.button>
      </div>
    </motion.div>
  )
}
