'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// ─── Tension / release visual — constrained, muted, non-distracting ───────────
// Max height: ~200px — never dominates layout

function TensionVisual() {
  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ height: 180 }}
    >
      <svg
        viewBox="0 0 160 200"
        className="w-[120px] h-auto opacity-70"
        aria-hidden="true"
      >
        {/* Head */}
        <motion.ellipse cx="80" cy="36" rx="16" ry="18"
          fill="none" stroke="#B8CEB4" strokeWidth="2"
          animate={{ stroke: ['#B8CEB4', '#8FB589', '#B8CEB4'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Torso */}
        <motion.path d="M64 54 C60 84 60 114 64 138 L96 138 C100 114 100 84 96 54 Z"
          fill="none" stroke="#B8CEB4" strokeWidth="2"
          animate={{ stroke: ['#B8CEB4', '#8FB589', '#B8CEB4'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        {/* Left arm — relaxes inward over cycle */}
        <motion.path
          animate={{ d: [
            'M64 68 C50 84 46 104 48 120',
            'M64 68 C56 82 54 100 56 116',
            'M64 68 C50 84 46 104 48 120',
          ]}}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          fill="none" stroke="#B8CEB4" strokeWidth="2" strokeLinecap="round"
        />
        {/* Right arm */}
        <motion.path
          animate={{ d: [
            'M96 68 C110 84 114 104 112 120',
            'M96 68 C104 82 106 100 104 116',
            'M96 68 C110 84 114 104 112 120',
          ]}}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          fill="none" stroke="#B8CEB4" strokeWidth="2" strokeLinecap="round"
        />
        {/* Legs */}
        <motion.path d="M70 138 C68 162 66 178 68 196"
          fill="none" stroke="#B8CEB4" strokeWidth="2" strokeLinecap="round"
        />
        <motion.path d="M90 138 C92 162 94 178 92 196"
          fill="none" stroke="#B8CEB4" strokeWidth="2" strokeLinecap="round"
        />
        {/* Shoulder tension dots — pulse then soften */}
        {[
          { cx: 56, cy: 60, d: 0 },
          { cx: 104, cy: 60, d: 0.5 },
          { cx: 52, cy: 72, d: 1.0 },
          { cx: 108, cy: 72, d: 1.5 },
        ].map((dot, i) => (
          <motion.circle key={i}
            cx={dot.cx} cy={dot.cy} r="2.5"
            fill="#D9BE94"
            animate={{ r: [2.5, 4, 2.5], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: dot.d }}
          />
        ))}
        {/* Release ring — expands from chest centre */}
        <motion.circle cx="80" cy="96" r="12"
          fill="none" stroke="#A8C4A0" strokeWidth="0.8"
          animate={{ r: [10, 38, 10], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeOut', delay: 2 }}
        />
      </svg>
      <p className="absolute bottom-0 left-0 right-0 text-center font-body text-[9px] text-[#BBBBAA] uppercase tracking-widest">
        tension → release
      </p>
    </div>
  )
}

// ─── Story section ────────────────────────────────────────────────────────────

export function StorySection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left — muted visual, constrained height */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center bg-white/50 rounded-3xl border border-[rgba(0,0,0,0.04)] py-8 px-6 sticky top-24 self-start"
          >
            <TensionVisual />
          </motion.div>

          {/* Right — narrative */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-3">
                Why this matters
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-light text-[#2C2C28] leading-snug">
                Living with fibromyalgia is{' '}
                <em className="italic text-sage-500">exhausting</em>{' '}
                in ways most people never see
              </h2>
            </div>

            <div className="space-y-4 font-body text-[#6B6B60] text-[15px] leading-[1.8]">
              <p>
                You wake up and already the body is heavy. The shoulders hold something
                that didn't arrive with sleep. The neck aches without cause. Simple tasks —
                a walk to the kitchen, a phone call — take more than people expect. And
                explaining it is its own kind of exhaustion.
              </p>
              <p>
                Fibromyalgia is a condition of the nervous system. The brain, through a process
                called{' '}
                <strong className="text-[#2C2C28] font-medium">central sensitization</strong>,
                learns to amplify pain signals — even when there is no new injury. Over time
                the nervous system becomes hypervigilant, scanning for threat, tightening the
                body in anticipation of pain that may not come.
              </p>
              <p>
                Pain relief medication can offer real comfort in difficult moments. But used
                consistently over a long period, it can deepen the nervous system's
                sensitization — creating a cycle that makes flares feel more frequent, not
                less. This isn't a reason for guilt. It's simply important to know, and to
                have alternatives.
              </p>
              <p>
                Somatic movement — gentle, slow, attentive movement done <em>with</em> the
                body rather than <em>to</em> it — is one of the most evidence-supported
                approaches for resetting that sensitized state. Not to push through. Not to
                cure. Simply to give the nervous system small, repeated signals that it is safe.
              </p>
            </div>

            <Link href="/somatic-coach">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="self-start px-6 py-3 bg-[#2C2C28] text-white rounded-2xl font-body text-sm font-medium hover:bg-[#3C3C34] transition-colors"
              >
                Begin a gentle session
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
