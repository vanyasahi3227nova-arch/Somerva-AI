'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { AnimatedBackground } from './AnimatedBackground'

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-6">
      <AnimatedBackground />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-100 border border-sage-200 rounded-full text-sage-600 text-xs font-medium tracking-widest uppercase mb-8"
        >
          <Sparkles size={11} />
          AI-powered somatic therapy
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-6xl md:text-7xl font-light leading-[1.08] tracking-tight text-[#2C2C28] mb-6"
        >
          AI-guided somatic
          <br />
          <em className="italic font-light text-sage-500">healing</em> for chronic pain
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-lg text-[#6B6B60] max-w-xl mx-auto leading-relaxed mb-10"
        >
          Observe your movement. Refine your practice.
          Support your nervous system — gently, intelligently, in real time.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/exercises">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(106,143,98,0.30)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 px-8 py-4 bg-sage-500 text-white rounded-2xl font-body font-medium text-base tracking-wide transition-colors duration-200 hover:bg-sage-600"
            >
              Start Somatic Session
              <ArrowRight size={16} />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-2 px-8 py-4 bg-white/70 border border-[rgba(0,0,0,0.08)] text-[#6B6B60] rounded-2xl font-body font-medium text-base tracking-wide hover:bg-white transition-all"
          >
            How it works
          </motion.button>
        </motion.div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 inline-flex items-center gap-8 px-8 py-4 bg-white/60 backdrop-blur-sm border border-[rgba(0,0,0,0.06)] rounded-3xl shadow-soft"
        >
          {[
            { value: 'Real-time', label: 'Posture Analysis' },
            { value: 'Somatic', label: 'Guided Exercises' },
            { value: 'Calm', label: 'AI Feedback' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-xl font-medium text-[#2C2C28]">{stat.value}</div>
              <div className="font-body text-xs text-[#9B9B8C] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border border-[rgba(0,0,0,0.15)] rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-[#9B9B8C] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
