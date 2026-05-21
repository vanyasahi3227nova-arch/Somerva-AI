'use client'

import { motion } from 'framer-motion'
import { Play, Pause, Square, RefreshCw } from 'lucide-react'

export type SessionState = 'idle' | 'active' | 'paused' | 'ended'

interface SessionControlsProps {
  state: SessionState
  elapsed: number
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onEnd: () => void
  onReset: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const stateLabels: Record<SessionState, string> = {
  idle: 'Ready to begin',
  active: 'Session active',
  paused: 'Session paused',
  ended: 'Session complete',
}

const stateDotColors: Record<SessionState, string> = {
  idle: 'bg-[#9B9B8C]',
  active: 'bg-sage-500',
  paused: 'bg-warm-400',
  ended: 'bg-teal-400',
}

export function SessionControls({
  state,
  elapsed,
  onStart,
  onPause,
  onResume,
  onEnd,
  onReset,
}: SessionControlsProps) {
  return (
    <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5">
      {/* Timer */}
      <div className="text-center mb-5">
        <div className="font-display text-5xl font-light text-[#2C2C28] tabular-nums">
          {formatTime(elapsed)}
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <motion.div
            animate={state === 'active' ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-1.5 h-1.5 rounded-full ${stateDotColors[state]}`}
          />
          <span className="font-body text-xs text-[#9B9B8C]">
            {stateLabels[state]}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {state === 'idle' && (
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(106,143,98,0.28)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="flex items-center gap-2.5 px-8 py-3 bg-sage-500 text-white rounded-2xl font-body font-medium text-sm tracking-wide hover:bg-sage-600 transition-colors"
          >
            <Play size={15} />
            Begin Session
          </motion.button>
        )}

        {state === 'active' && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPause}
              className="flex items-center gap-2 px-5 py-3 bg-warm-100 text-warm-500 border border-warm-200 rounded-2xl font-body font-medium text-sm hover:bg-warm-200 transition-colors"
            >
              <Pause size={15} />
              Pause
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnd}
              className="flex items-center gap-2 px-5 py-3 bg-cream-200 text-[#6B6B60] border border-cream-300 rounded-2xl font-body font-medium text-sm hover:bg-cream-300 transition-colors"
            >
              <Square size={14} />
              End
            </motion.button>
          </>
        )}

        {state === 'paused' && (
          <>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onResume}
              className="flex items-center gap-2.5 px-6 py-3 bg-sage-500 text-white rounded-2xl font-body font-medium text-sm hover:bg-sage-600 transition-colors"
            >
              <Play size={15} />
              Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnd}
              className="flex items-center gap-2 px-5 py-3 bg-cream-200 text-[#6B6B60] border border-cream-300 rounded-2xl font-body font-medium text-sm hover:bg-cream-300 transition-colors"
            >
              <Square size={14} />
              End
            </motion.button>
          </>
        )}

        {state === 'ended' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-teal-100 text-teal-600 border border-teal-200 rounded-2xl font-body font-medium text-sm hover:bg-teal-200 transition-colors"
          >
            <RefreshCw size={14} />
            New Session
          </motion.button>
        )}
      </div>
    </div>
  )
}
