'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronDown, Sparkles, Filter, X } from 'lucide-react'
import { EXERCISES, EXERCISE_CATEGORIES, MOTIVATIONAL_MESSAGES, getExercisesByCategory } from '@/lib/exercises'
import type { SomaticExercise, ExerciseCategory } from '@/lib/exercises'
import { ExerciseCard } from '@/components/exercises/ExerciseCard'
import { ExercisePreviewModal } from '@/components/exercises/ExercisePreviewModal'
import { CheckInModal } from '@/components/exercises/CheckInModal'

// ─── Education sections ───────────────────────────────────────────────────────

const EDU_SECTIONS = [
  {
    id: 'what-is-fibromyalgia',
    title: 'What is Fibromyalgia?',
    content: `Fibromyalgia is a condition involving widespread pain, deep fatigue, and heightened sensitivity to sensation — not because the body is damaged, but because the nervous system has become stuck in a state of high alert. The pain is real. The exhaustion is real. The brain and nervous system are simply processing signals differently than usual.

    People with fibromyalgia often also notice difficulty with sleep, memory and concentration (sometimes called "brain fog"), and sensations like tingling, temperature sensitivity, or tenderness to touch. It is not a disease that progressively damages the body — it is a nervous system condition that responds to gentle, consistent care.`,
  },
  {
    id: 'why-movement-is-hard',
    title: 'Why movement feels difficult',
    content: `In fibromyalgia, the body's pain signalling system has become amplified — a process called central sensitisation. What might feel like a small movement to someone else can register as significant effort or discomfort. This is not weakness. It is a sensitised nervous system doing its job too vigorously.

    The difficulty is compounded by fatigue that does not lift with rest, by the fear of flares that follow overexertion, and by a history of pushing through pain that has led to boom-and-bust cycles. The approach here is different: movement is a signal to the nervous system that safety is possible, not a performance to push through.`,
  },
  {
    id: 'nervous-system',
    title: 'Understanding the nervous system',
    content: `Your nervous system has two main modes: the sympathetic ("go") state, which governs alertness and survival responses, and the parasympathetic ("rest") state, which handles recovery, digestion, and healing. In fibromyalgia, the nervous system often gets stuck in sympathetic overdrive — constantly scanning for threat, constantly bracing.

    Gentle somatic movement is not about stretching or strengthening. It is about sending the nervous system repeated, gentle signals that it is safe to shift out of high alert. Over time, these small signals add up. The system begins to trust that calm is possible.`,
  },
  {
    id: 'somatic-experiencing',
    title: 'What is Somatic Experiencing?',
    content: `Somatic Experiencing (SE) is a body-centred approach developed by Dr Peter Levine. It is based on the observation that animals in the wild regularly discharge stress through trembling, shaking, and spontaneous movement after a threat passes — and that humans often suppress this natural process, leaving the nervous system "stuck."

    SE works by gently tracking sensations in the body, building tolerance for difficult feelings gradually, and supporting the natural completion of interrupted stress responses. You do not need to re-experience trauma for this to be helpful. Even simple practices — like noticing where your body is being held by the floor, or following a slow breath — create neurological shifts over time.`,
  },
  {
    id: 'why-gentle-movement',
    title: 'Why gentle movement helps',
    content: `When the body moves gently and safely, it sends regulatory signals through the vagus nerve — the main pathway of the parasympathetic system. Slow, rhythmic, and predictable movement tells the brain that the threat is over, and that it can begin to regulate down.

    Unlike vigorous exercise, gentle somatic movement does not demand energy the body does not have. It works with the nervous system rather than against it. Even five minutes of lying-down breath awareness can shift the body's internal state in a measurable way. Small, consistent practice over time creates real change.`,
  },
  {
    id: 'safety-principles',
    title: 'Safety principles for movement',
    content: `These practices are guided by principles developed specifically for fibromyalgia-safe movement:

    — Comfort, not performance. There is no correct amount of movement. If it hurts, it is too much.
    — Pacing over pushing. Short sessions followed by rest outperform long sessions followed by crashes.
    — Observation over effort. Simply noticing your body is a valid practice, equal to movement.
    — Gentleness is not laziness. Moving slowly and with care requires more skill than moving quickly and forcefully.
    — Rest is part of the practice. Moments of stillness between movements are not wasted time — they are integration time.`,
  },
  {
    id: 'when-not-to-push',
    title: 'When not to push the body',
    content: `Please do not practice movement when you are in a significant flare, experiencing new or unusual pain, have recently had a fall or injury, are feeling severely unwell, or when you feel that any movement will make things worse.

    Resting on difficult days is not giving up. It is intelligent pacing. You can always return tomorrow, or even in an hour. The most valuable skill in living with fibromyalgia is learning to honour your body's signals — and the practices here are designed to help you develop exactly that capacity.`,
  },
]

// ─── Education accordion item ─────────────────────────────────────────────────

function EduSection({ section, index }: { section: typeof EDU_SECTIONS[0]; index: number }) {
  const [open, setOpen] = useState(index === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-soft overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream-50 transition-colors"
      >
        <span className="font-display text-lg font-light text-[#2C2C28] pr-4">{section.title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
          <ChevronDown size={18} className="text-[#9B9B8C]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 border-t border-[rgba(0,0,0,0.04)]">
              {section.content.trim().split('\n\n').map((para, i) => (
                <p key={i} className="font-body text-sm text-[#6B6B60] leading-relaxed mt-3 first:mt-3 whitespace-pre-line">
                  {para.trim()}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Motivational banner ──────────────────────────────────────────────────────

function MotivationalBanner() {
  const [message, setMessage] = useState('')
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const pick = () => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
    setMessage(pick())

    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setMessage(pick())
        setFade(true)
      }, 400)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-center py-5 px-6 bg-gradient-to-r from-sage-50 to-teal-50 rounded-2xl border border-sage-100"
      style={{ background: 'linear-gradient(135deg, #EEF4EC 0%, #EAF2F0 100%)' }}
    >
      <motion.p
        animate={{ opacity: fade ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="font-display text-lg font-light text-[#2C2C28] italic"
      >
        "{message}"
      </motion.p>
    </motion.div>
  )
}

// ─── Category filter bar ──────────────────────────────────────────────────────

function CategoryFilter({
  active,
  onChange,
}: {
  active: ExerciseCategory | null
  onChange: (c: ExerciseCategory | null) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-xs font-medium border transition-all ${
            active === null
              ? 'bg-sage-500 text-white border-sage-500'
              : 'bg-white border-[rgba(0,0,0,0.08)] text-[#6B6B60] hover:bg-cream-100'
          }`}
        >
          <Filter size={11} />
          All
        </button>
        {EXERCISE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat === active ? null : cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-xs font-medium border transition-all ${
              active === cat
                ? 'bg-sage-500 text-white border-sage-500'
                : 'bg-white border-[rgba(0,0,0,0.08)] text-[#6B6B60] hover:bg-cream-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExercisesPage() {
  const router = useRouter()
  const [previewExercise, setPreviewExercise] = useState<SomaticExercise | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | null>(null)
  const [eduExpanded, setEduExpanded] = useState(false)

  const openPreview = (exercise: SomaticExercise) => {
    setPreviewExercise(exercise)
    setModalOpen(true)
  }

  const closePreview = () => {
    setModalOpen(false)
    setPreviewExercise(null)
  }

  const beginLiveFromExercises = () => {
    if (!previewExercise) return
    router.push(`/somatic-coach?exercise=${previewExercise.id}&live=1`)
  }

  const handleCheckInAccept = (exerciseId: string, categoryHint: string) => {
    setCheckInOpen(false)
    // Try to find the exercise by matching id or name slug
    const found = EXERCISES.find(
      (e) =>
        e.id === exerciseId ||
        e.name.toLowerCase().replace(/\s+/g, '-') === exerciseId ||
        e.category === categoryHint
    )
    if (found) {
      router.push(`/somatic-coach?exercise=${found.id}&live=0`)
    } else {
      // Fall back to filtering by the suggested category
      const catMatch = categoryHint as ExerciseCategory
      if (EXERCISE_CATEGORIES.includes(catMatch)) {
        setActiveCategory(catMatch)
      }
    }
  }

  const displayedExercises = activeCategory
    ? getExercisesByCategory(activeCategory)
    : EXERCISES

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#FAFAF6] px-6 py-12"
    >
      <div className="max-w-4xl mx-auto">

        {/* ── Page header ── */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-3">
            Understanding your body
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#2C2C28] mb-4">
            Movement <em className="italic text-sage-500">and healing</em>
          </h1>
          <p className="font-body text-[#6B6B60] text-base max-w-xl mx-auto leading-relaxed">
            Before we move, let us understand why we move this way. Gentle, informed movement
            is different from exercise. It is a conversation with your nervous system.
          </p>
        </motion.header>

        {/* ── Motivational banner ── */}
        <div className="mb-10">
          <MotivationalBanner />
        </div>

        {/* ── Educational sections ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-light text-[#2C2C28]">
              Your foundation
            </h2>
            <button
              type="button"
              onClick={() => setEduExpanded((v) => !v)}
              className="font-body text-xs text-sage-600 hover:text-sage-700 underline underline-offset-2"
            >
              {eduExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          </div>
          <p className="font-body text-sm text-[#9B9B8C] mb-5 leading-relaxed">
            Understanding what is happening in your body makes movement safer, more meaningful, and more effective.
          </p>
          <div className="flex flex-col gap-3">
            {EDU_SECTIONS.map((section, i) => (
              <EduSectionControlled
                key={section.id}
                section={section}
                index={i}
                forceOpen={eduExpanded}
              />
            ))}
          </div>
        </motion.section>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.06)]" />
          <span className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest">Your practice library</span>
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.06)]" />
        </div>

        {/* ── AI check-in CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-3xl border border-sage-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #EEF4EC 0%, #EAF2F0 100%)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-sage-500" />
              <span className="font-body text-xs font-medium text-sage-600 uppercase tracking-widest">AI Recommendation</span>
            </div>
            <p className="font-display text-lg font-light text-[#2C2C28]">Not sure where to start?</p>
            <p className="font-body text-sm text-[#6B6B60] mt-0.5 leading-relaxed">
              Answer five gentle questions and we will suggest the safest practice for how you feel right now.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCheckInOpen(true)}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium hover:bg-sage-600 transition-colors shadow-sm"
          >
            <Sparkles size={14} />
            Check in now
          </motion.button>
        </motion.div>

        {/* ── Category filter ── */}
        <div className="mb-6">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          {activeCategory && (
            <div className="flex items-center gap-2 mt-3">
              <span className="font-body text-xs text-[#9B9B8C]">
                Showing {displayedExercises.length} exercise{displayedExercises.length !== 1 ? 's' : ''} in
              </span>
              <span className="font-body text-xs font-medium text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                {activeCategory}
                <button type="button" onClick={() => setActiveCategory(null)}>
                  <X size={10} className="text-sage-500 hover:text-sage-700" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* ── Exercise grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory ?? 'all'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {displayedExercises.map((exercise, i) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={i}
                onPreview={openPreview}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom motivational note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="font-body text-sm text-[#9B9B8C] leading-relaxed max-w-sm mx-auto">
            You do not need to complete an exercise to have done something good today.
            Arriving here, reading this — that is already part of your practice.
          </p>
        </motion.div>

      </div>

      {/* ── Modals ── */}
      <ExercisePreviewModal
        exercise={previewExercise}
        open={modalOpen}
        onClose={closePreview}
        onBeginLive={beginLiveFromExercises}
      />

      <CheckInModal
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        onAccept={handleCheckInAccept}
      />
    </motion.div>
  )
}

// ── Controlled accordion (responds to parent forceOpen) ──────────────────────

function EduSectionControlled({
  section,
  index,
  forceOpen,
}: {
  section: typeof EDU_SECTIONS[0]
  index: number
  forceOpen: boolean
}) {
  const [open, setOpen] = useState(index === 0)

  useEffect(() => {
    setOpen(forceOpen || index === 0)
  }, [forceOpen, index])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-soft overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream-50 transition-colors"
      >
        <span className="font-display text-lg font-light text-[#2C2C28] pr-4">{section.title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
          <ChevronDown size={18} className="text-[#9B9B8C]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 border-t border-[rgba(0,0,0,0.04)]">
              {section.content.trim().split('\n\n').map((para, i) => (
                <p key={i} className="font-body text-sm text-[#6B6B60] leading-relaxed mt-3 whitespace-pre-line">
                  {para.trim()}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
