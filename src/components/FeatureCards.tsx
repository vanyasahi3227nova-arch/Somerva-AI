'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, Lightbulb, Play, Camera, BarChart2 } from 'lucide-react'

// ─── 5-step "How to use" ──────────────────────────────────────────────────────

const STEPS = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Check in',
    description:
      'Take a moment to notice how your body feels today — energy level, pain areas, any tension patterns. The check-in takes under a minute and shapes your session.',
    color: 'sage',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Get a recommendation',
    description:
      'Based on your check-in, Somerva suggests exercises matched to your current capacity — from very gentle grounding to slower mobility work.',
    color: 'teal',
  },
  {
    number: '03',
    icon: Play,
    title: 'Preview the exercise',
    description:
      'Read the step-by-step instructions, posture guidance, and what sensations to expect before you begin. No surprises.',
    color: 'warm',
  },
  {
    number: '04',
    icon: Camera,
    title: 'Start your somatic session',
    description:
      'Allow camera access and begin. The AI gently observes your movement in real time, offering calming feedback and tracking your quality of movement.',
    color: 'sage',
  },
  {
    number: '05',
    icon: BarChart2,
    title: 'Review your session report',
    description:
      'After each session, see your movement quality scores, body observations, and how your nervous system is responding over time.',
    color: 'teal',
  },
]

const colorMap = {
  sage: { bg: 'bg-sage-100', border: 'border-sage-200', icon: 'text-sage-500', number: 'text-sage-200' },
  teal: { bg: 'bg-teal-100', border: 'border-teal-100', icon: 'text-teal-500', number: 'text-teal-200' },
  warm: { bg: 'bg-warm-50',  border: 'border-warm-100', icon: 'text-warm-500', number: 'text-warm-200' },
}

export function FeatureCards() {
  return (
    <section className="py-24 px-6 bg-[#F4F4EE]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-3">Your practice</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#2C2C28] mb-4">
            How to use <em className="italic text-sage-500">Somerva AI</em>
          </h2>
          <p className="font-body text-[#6B6B60] text-base max-w-md mx-auto leading-relaxed">
            Five gentle steps — at whatever pace your body allows today.
          </p>
        </motion.div>

        {/* Steps — 3 across top, 2 centered below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {STEPS.slice(0, 3).map((step, i) => {
            const c = colorMap[step.color as keyof typeof colorMap]
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-[rgba(0,0,0,0.05)] shadow-soft"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center`}>
                    <Icon size={19} className={c.icon} />
                  </div>
                  <span className={`font-display text-3xl font-light ${c.number} select-none`}>{step.number}</span>
                </div>
                <h3 className="font-display text-xl font-medium text-[#2C2C28] mb-2">{step.title}</h3>
                <p className="font-body text-sm text-[#6B6B60] leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:max-w-[66%] mx-auto mb-14">
          {STEPS.slice(3).map((step, i) => {
            const c = colorMap[step.color as keyof typeof colorMap]
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i + 3) * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-[rgba(0,0,0,0.05)] shadow-soft"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center`}>
                    <Icon size={19} className={c.icon} />
                  </div>
                  <span className={`font-display text-3xl font-light ${c.number} select-none`}>{step.number}</span>
                </div>
                <h3 className="font-display text-xl font-medium text-[#2C2C28] mb-2">{step.title}</h3>
                <p className="font-body text-sm text-[#6B6B60] leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link href="/exercises">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(106,143,98,0.25)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-sage-500 text-white rounded-2xl font-body font-medium text-base hover:bg-sage-600 transition-colors"
            >
              Browse the exercise library
            </motion.button>
          </Link>
          <p className="font-body text-xs text-[#9B9B8C] mt-3">No account required. Start gently.</p>
        </motion.div>
      </div>
    </section>
  )
}
