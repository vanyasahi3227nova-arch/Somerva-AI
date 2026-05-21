'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Lightbulb, Award, Search, Users, Layers, Compass, AlertCircle } from 'lucide-react'

// ─── Timeline data ─────────────────────────────────────────────────────────────

const TIMELINE = [
  {
    icon: Lightbulb,
    year: '2021',
    heading: 'The idea of UrChi was conceived as an artificial intelligence wellness companion focused on emotional resilience, inner balance, and natural healing support.',
    color: 'sage',
  },
  {
    icon: Award,
    year: '2022',
    heading: 'The first prototype was developed, received Intel certification, and was submitted to MIT Solve as part of the Health and Pandemics Challenge.',
    color: 'teal',
  },
  {
    icon: Search,
    year: '2023',
    heading: 'Research and user observations expanded into chronic stress, pain sensitization, and the broader relationship between emotional wellbeing and physical pain.',
    color: 'warm',
  },
  {
    icon: Users,
    year: '2024',
    heading: 'Surveys and needfinding highlighted the growing impact of fibromyalgia and the lack of accessible guided somatic support.',
    color: 'sage',
  },
  {
    icon: Layers,
    year: '2025',
    heading: 'Multiple design iterations explored how intelligent movement analysis could provide real time feedback during somatic exercises.',
    color: 'teal',
  },
  {
    icon: Compass,
    year: '2026',
    heading: 'Somerva AI was formally established as a personalized somatic guidance platform built to support safer and more informed nervous system regulation.',
    color: 'warm',
  },
]

const timelineColors = {
  sage: { iconBg: 'bg-sage-100', icon: 'text-sage-500', year: 'text-sage-600', line: 'bg-sage-200' },
  teal: { iconBg: 'bg-teal-100', icon: 'text-teal-500', year: 'text-teal-600', line: 'bg-teal-200' },
  warm: { iconBg: 'bg-warm-100', icon: 'text-warm-500', year: 'text-warm-600', line: 'bg-warm-200' },
}

// ─── Animated timeline item ────────────────────────────────────────────────────

function TimelineItem({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const colors = timelineColors[item.color as keyof typeof timelineColors]
  const Icon = item.icon

  return (
    <div ref={ref} className="relative grid grid-cols-[44px_1fr] gap-5 md:gap-8">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className={`w-11 h-11 rounded-2xl ${colors.iconBg} flex items-center justify-center flex-shrink-0 z-10`}
        >
          <Icon size={19} className={colors.icon} />
        </motion.div>
        {index < TIMELINE.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
            className={`w-px flex-1 mt-2 ${colors.line}`}
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="pb-10"
      >
        <span className={`font-body text-xs font-semibold uppercase tracking-widest mb-2 block ${colors.year}`}>
          {item.year}
        </span>
        <p className="font-body text-[15px] text-[#6B6B60] leading-[1.8]">
          {item.heading}
        </p>
      </motion.div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF6]">

      {/* Hero */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-4">
            About Somerva AI
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-[#2C2C28] leading-[1.08] mb-8">
            Our <em className="italic text-sage-500">Story</em>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start"
        >
          <div className="space-y-5 font-body text-[15px] text-[#6B6B60] leading-[1.85]">
            <p>
              Somerva AI was born from a much longer journey that began with an earlier vision
              called UrChi, inspired by the idea of inner energy and the belief that healing often
              begins by reconnecting the mind and body.
            </p>
            <p>
              The original concept emerged in 2021 during a time when emotional strain, uncertainty,
              and social isolation were deeply affecting people across the world. It became
              increasingly clear that while many individuals were physically safe, they were silently
              struggling with overwhelming stress, emotional fatigue, and a growing sense of
              disconnection from themselves.
            </p>
            <p>
              UrChi was imagined as an intelligent wellness companion designed to support mental,
              emotional, and physical wellbeing through natural and spiritually grounded
              interventions. By combining artificial intelligence with personalized guidance, the
              system was designed to understand a person's concerns and suggest restorative practices
              such as meditation, yoga, and other forms of self regulation to help them regain
              balance and purpose.
            </p>
            <p>
              In 2022, the prototype was formally developed, became Intel certified through a
              Certificate of Accomplishment, and was submitted as part of the Health and Pandemics
              Challenge to MIT Solve.
            </p>
            <p>
              Over the following years, deeper research, surveys, and continued observation revealed
              an important and often overlooked reality. Many individuals, especially women, were
              living with chronic pain conditions such as fibromyalgia while navigating stress that
              was continuously sensitizing the nervous system and amplifying pain throughout the body.
            </p>
            <p>
              While awareness of somatic healing approaches was growing, many people were still left
              to follow generic videos without understanding whether their movements were helping,
              whether they were performing them correctly, or what measurable impact they were
              creating within their bodies.
            </p>
            <p>
              This gap between guidance and meaningful feedback became impossible to ignore.
            </p>
            <p>
              Between 2023 and 2026, extensive needfinding and multiple prototype iterations led to
              a new realization. People needed not only access to somatic practices, but also a way
              to receive gentle real time guidance and insight into how their bodies were responding.
            </p>
            <p>
              Somerva AI was established to meet that need.
            </p>
            <p>
              Built upon the original foundation of UrChi, Somerva AI combines intelligent exercise
              recommendations, movement analysis, and therapeutic feedback to help users engage with
              somatic exercises more intentionally and with greater confidence.
            </p>
            <p>
              Its purpose is to make supportive nervous system regulation more accessible while
              encouraging awareness of how stress, emotional health, and physical pain are deeply
              connected.
            </p>
            <p>
              Somerva AI is designed to assist and empower. It is not a replacement for medical
              professionals or trained somatic specialists, but a supportive tool created to help
              individuals better understand and work with their own bodies.
            </p>
          </div>

          {/* Right column: creator card + visual cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-shrink-0 w-full md:w-52 flex flex-col gap-4"
          >
            {/* Creator card — visual preserved exactly */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-300 to-teal-300 mx-auto mb-3 flex items-center justify-center">
                <span className="font-display text-2xl font-light text-white">V</span>
              </div>
              <p className="font-display text-base font-medium text-[#2C2C28]">Vanya Sahi</p>
              <p className="font-body text-xs text-[#9B9B8C] mt-0.5">Creator, Somerva AI</p>
              <div className="mt-3 pt-3 border-t border-cream-200">
                <p className="font-body text-[10px] text-[#9B9B8C] italic leading-relaxed">
                  Building what was missing.
                </p>
              </div>
            </div>

            {/* Visual card 1 — Pain Awareness */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-soft p-4">
              <p className="font-body text-[10px] text-[#9B9B8C] uppercase tracking-widest mb-3">
                Pain Awareness
              </p>
              <div className="flex justify-center mb-3">
                <svg viewBox="0 0 80 110" width="72" height="99" aria-hidden="true">
                  {/* Head */}
                  <ellipse cx="40" cy="14" rx="9" ry="11" fill="none" stroke="#C8D8C4" strokeWidth="1.5" />
                  {/* Neck */}
                  <line x1="40" y1="25" x2="40" y2="30" stroke="#C8D8C4" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Torso */}
                  <path d="M28 30 C26 52 26 74 28 88 L52 88 C54 74 54 52 52 30 Z" fill="none" stroke="#C8D8C4" strokeWidth="1.5" />
                  {/* Left arm */}
                  <path d="M28 36 C20 52 18 66 20 78" fill="none" stroke="#C8D8C4" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Right arm */}
                  <path d="M52 36 C60 52 62 66 60 78" fill="none" stroke="#C8D8C4" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Legs */}
                  <path d="M34 88 C33 100 32 107 33 110" fill="none" stroke="#C8D8C4" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M46 88 C47 100 48 107 47 110" fill="none" stroke="#C8D8C4" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Left shoulder tension dot */}
                  <motion.circle cx="27" cy="36" r="3.5" fill="#D9BE94"
                    animate={{ r: [3.5, 5.5, 3.5], opacity: [0.55, 0.9, 0.55] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Right shoulder tension dot */}
                  <motion.circle cx="53" cy="36" r="3.5" fill="#D9BE94"
                    animate={{ r: [3.5, 5.5, 3.5], opacity: [0.55, 0.9, 0.55] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  />
                  {/* Neck / upper trap */}
                  <motion.circle cx="40" cy="28" r="2.8" fill="#D9BE94"
                    animate={{ r: [2.8, 4.5, 2.8], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  />
                  {/* Upper back */}
                  <motion.circle cx="40" cy="52" r="2.5" fill="#D9BE94"
                    animate={{ r: [2.5, 4, 2.5], opacity: [0.35, 0.7, 0.35] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  />
                </svg>
              </div>
              <p className="font-body text-[9px] text-[#BBBBAA] text-center leading-relaxed">
                Common fibromyalgia tension sites
              </p>
            </div>

            {/* Visual card 2 — Gentle Regulation */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-soft p-4">
              <p className="font-body text-[10px] text-[#9B9B8C] uppercase tracking-widest mb-3">
                Gentle Regulation
              </p>
              <div className="flex justify-center mb-3">
                <svg viewBox="0 0 80 80" width="72" height="72" aria-hidden="true">
                  {/* Outermost expanding ring */}
                  <motion.circle cx="40" cy="40" r="30" fill="none" stroke="#A8C4A0" strokeWidth="0.6"
                    animate={{ r: [28, 36, 28], opacity: [0.18, 0, 0.18] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeOut' }}
                  />
                  {/* Mid ring */}
                  <motion.circle cx="40" cy="40" r="22" fill="none" stroke="#A8C4A0" strokeWidth="0.8"
                    animate={{ r: [20, 28, 20], opacity: [0.28, 0.05, 0.28] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                  />
                  {/* Inner breathing circle */}
                  <motion.circle cx="40" cy="40" r="14" fill="#D6E8D2"
                    animate={{ r: [13, 18, 13], opacity: [0.55, 0.85, 0.55] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Core dot */}
                  <circle cx="40" cy="40" r="4" fill="#8FB589" opacity="0.7" />
                  {/* Breath label */}
                  <motion.text x="40" y="43" textAnchor="middle"
                    fontSize="4.5" fill="#6B9B65" fontFamily="serif"
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    breathe
                  </motion.text>
                </svg>
              </div>
              <p className="font-body text-[9px] text-[#BBBBAA] text-center leading-relaxed">
                Nervous system settling through breath
              </p>
            </div>

            {/* Visual card 3 — Measured Relief */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-soft p-4">
              <p className="font-body text-[10px] text-[#9B9B8C] uppercase tracking-widest mb-3">
                Measured Relief
              </p>
              <div className="space-y-2.5 mb-3">
                {[
                  { label: 'Tension', from: 82, to: 38, color: '#D9BE94', delay: 0 },
                  { label: 'Guarding', from: 74, to: 30, color: '#B8CEB4', delay: 0.4 },
                  { label: 'Ease', from: 22, to: 78, color: '#8FB589', delay: 0.8 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-[9px] text-[#9B9B8C]">{row.label}</span>
                    </div>
                    <div className="w-full bg-cream-100 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: row.color }}
                        animate={{ width: [`${row.from}%`, `${row.to}%`, `${row.from}%`] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: row.delay,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-body text-[9px] text-[#BBBBAA] text-center leading-relaxed">
                Gradual shift toward ease over sessions
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Disclaimer */}
      <div className="px-6 mb-12 max-w-4xl mx-auto">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
          <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="font-body text-xs text-amber-800 leading-relaxed">
            <strong className="font-semibold">Somerva AI is not a medical tool.</strong>{' '}
            It is a wellness and movement support companion. It does not diagnose, treat, or
            replace the guidance of a doctor, physiotherapist, or qualified somatic practitioner.
            If you are experiencing a medical emergency or significant symptom change, please
            contact a healthcare professional.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-2">
            How it came to be
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-[#2C2C28]">
            Journey to <em className="italic text-sage-500">Somerva AI</em>
          </h2>
        </motion.div>

        <div>
          {TIMELINE.map((item, i) => (
            <TimelineItem key={item.year} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center pb-20 px-6"
      >
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-sage-500 text-white rounded-2xl font-body font-medium text-sm hover:bg-sage-600 transition-colors"
        >
          Explore exercises
        </Link>
        <p className="font-body text-xs text-[#9B9B8C] mt-3">No account. No pressure.</p>
      </motion.div>
    </div>
  )
}
