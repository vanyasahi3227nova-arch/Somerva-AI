'use client'

import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large sage blob top-right */}
      <motion.div
        animate={{
          x: [0, 30, -15, 0],
          y: [0, -25, 15, 0],
          scale: [1, 1.06, 0.97, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.13]"
        style={{
          background: 'radial-gradient(circle, #A8C4A0 0%, #C8D8C4 40%, transparent 70%)',
        }}
      />
      {/* Medium teal blob bottom-left */}
      <motion.div
        animate={{
          x: [0, -20, 25, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.95, 1.04, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-20 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #8ABFB8 0%, #B8D8D4 40%, transparent 70%)',
        }}
      />
      {/* Small warm accent center */}
      <motion.div
        animate={{
          x: [0, 15, -10, 0],
          y: [0, -10, 20, 0],
          scale: [1, 1.1, 0.93, 1],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #D9BE94 0%, #EAD8BC 40%, transparent 70%)',
        }}
      />
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
