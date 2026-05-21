'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { ExerciseSelector, EXERCISES } from '@/components/ExerciseSelector'
import { CameraPanel } from '@/components/CameraPanel'
import { FeedbackPanel } from '@/components/FeedbackPanel'
import { SessionControls, SessionState } from '@/components/SessionControls'
import { GuidancePanel } from '@/components/GuidancePanel'
import { ExercisePreviewModal } from '@/components/exercises/ExercisePreviewModal'
import { useSomaticFeedback } from '@/hooks/useSomaticFeedback'
import { getExerciseById } from '@/lib/exercises'
import { saveSession } from '@/lib/sessionStore'

function SomaticCoachContent() {
  const searchParams = useSearchParams()
  const exerciseParam = searchParams.get('exercise')
  const liveParam = searchParams.get('live')

  const initialExercise =
    (exerciseParam && getExerciseById(exerciseParam)?.id) || EXERCISES[0].id

  const [selectedExercise, setSelectedExercise] = useState(initialExercise)
  const [liveUnlocked, setLiveUnlocked] = useState(liveParam === '1')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sessionState, setSessionState] = useState<SessionState>('idle')
  const [elapsed, setElapsed] = useState(0)

  const exerciseObj = EXERCISES.find((e) => e.id === selectedExercise)
  const activeCategory = exerciseObj?.category ?? null

  const {
    feedback,
    score,
    guidanceStep,
    movementScore,
    baselineComparison,
    calibrationProgress,
    isCalibrating,
    classifierOutput,
    referenceComparison,
    processFeedback,
    updateMovementScore,
    resetFeedback,
  } = useSomaticFeedback(activeCategory)

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const feedbackRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scoreRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  // Stable callback refs — always point to latest version without recreating effect
  const processFeedbackRef     = useRef(processFeedback)
  const updateMovementScoreRef = useRef(updateMovementScore)
  processFeedbackRef.current     = processFeedback
  updateMovementScoreRef.current = updateMovementScore

  const isSessionActiveRef = useRef(false)

  // Snapshot ref — holds latest session values for save operations
  // Updated every render so handleEnd/handleReset always read current state
  const snapshotRef = useRef({ score, elapsed, classifierOutput, feedback, exerciseObj, selectedExercise })
  snapshotRef.current = { score, elapsed, classifierOutput, feedback, exerciseObj, selectedExercise }

  const exercise = exerciseObj

  useEffect(() => {
    if (exerciseParam && getExerciseById(exerciseParam)) {
      setSelectedExercise(exerciseParam)
    }
    if (liveParam === '1') {
      setLiveUnlocked(true)
    }
  }, [exerciseParam, liveParam])

  // ── Session intervals — ONLY depends on sessionState ──────────────────────
  useEffect(() => {
    const active = sessionState === 'active'
    isSessionActiveRef.current = active

    if (timerRef.current)    clearInterval(timerRef.current)
    if (feedbackRef.current) clearInterval(feedbackRef.current)
    if (scoreRef.current)    clearInterval(scoreRef.current)

    if (!active) return

    timerRef.current = setInterval(() => {
      if (isSessionActiveRef.current) setElapsed((t) => t + 1)
    }, 1000)

    feedbackRef.current = setInterval(() => {
      if (isSessionActiveRef.current) processFeedbackRef.current()
    }, 8000)
    processFeedbackRef.current()

    scoreRef.current = setInterval(() => {
      if (isSessionActiveRef.current) updateMovementScoreRef.current()
    }, 500)
    updateMovementScoreRef.current()

    return () => {
      isSessionActiveRef.current = false
      if (timerRef.current)    clearInterval(timerRef.current)
      if (feedbackRef.current) clearInterval(feedbackRef.current)
      if (scoreRef.current)    clearInterval(scoreRef.current)
    }
  }, [sessionState])

  // ── Session persistence helpers ────────────────────────────────────────────

  function persistSession(status: 'completed' | 'early_exit') {
    const { score, elapsed, classifierOutput, feedback, exerciseObj, selectedExercise } = snapshotRef.current
    // Only save sessions that lasted at least 20 seconds and had some movement data
    if (elapsed < 20 && status === 'early_exit') return
    const stabilityScore = classifierOutput?.subScores?.stableScore ?? Math.round(score * 0.88)
    saveSession({
      exerciseId:            selectedExercise,
      exerciseName:          exerciseObj?.name ?? '',
      exerciseCategory:      exerciseObj?.category ?? '',
      sessionDurationSeconds: elapsed,
      movementQualityScore:  score,
      stabilityScore:        Math.round(stabilityScore),
      completionStatus:      status,
      feedbackCount:         feedback.length,
    })
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleStartPreview = () => setPreviewOpen(true)

  const handleBeginLive = () => {
    setPreviewOpen(false)
    setLiveUnlocked(true)
  }

  const handleStart = () => {
    if (!liveUnlocked) {
      setPreviewOpen(true)
      return
    }
    setSessionState('active')
  }

  const handlePause  = () => setSessionState('paused')
  const handleResume = () => setSessionState('active')

  const handleEnd = () => {
    persistSession('completed')
    setSessionState('ended')
  }

  const handleReset = () => {
    // If session was in progress (not yet saved), save as early exit
    if (sessionState === 'active' || sessionState === 'paused') {
      persistSession('early_exit')
    }
    setSessionState('idle')
    setElapsed(0)
    resetFeedback()
  }

  const handleExerciseChange = (id: string) => {
    setSelectedExercise(id)
    setLiveUnlocked(false)
    handleReset()
  }

  return (
    <div className="min-h-screen bg-[#FAFAF6] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest">Somerva AI</span>
            <span className="text-[#9B9B8C]">/</span>
            <span className="font-body text-xs text-sage-500 uppercase tracking-widest">Somatic Coach</span>
          </div>
          <h1 className="font-display text-4xl font-light text-[#2C2C28]">Your Practice Space</h1>
          <p className="font-body text-sm text-[#9B9B8C] mt-1">
            Choose an exercise, preview the movements, then begin your live session when you feel ready.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={liveUnlocked ? 'live' : 'select'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-5"
          >
            {/* Left column: exercise selector + session summary */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-5"
            >
              <ExerciseSelector
                selected={selectedExercise}
                onSelect={handleExerciseChange}
                onStartExercise={handleStartPreview}
                liveUnlocked={liveUnlocked}
              />

              {sessionState === 'ended' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5"
                >
                  <h3 className="font-display text-lg font-medium text-[#2C2C28] mb-3">
                    Session Complete
                  </h3>
                  <motion.div layout className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-body text-xs text-[#9B9B8C]">Duration</span>
                      <span className="font-body text-xs text-[#2C2C28] font-medium">
                        {Math.floor(elapsed / 60)}m {elapsed % 60}s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-xs text-[#9B9B8C]">Avg. quality</span>
                      <span className="font-body text-xs text-sage-600 font-medium">{score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-xs text-[#9B9B8C]">Observations</span>
                      <span className="font-body text-xs text-[#2C2C28] font-medium">{feedback.length}</span>
                    </div>
                  </motion.div>
                  <p className="font-body text-xs text-teal-600 mt-4 leading-relaxed">
                    You showed up for yourself today. That is meaningful.
                  </p>
                  <p className="font-body text-[10px] text-[#9B9B8C] mt-2 italic">
                    This session has been saved to Your Reports.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Centre column: camera + controls + guidance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col gap-5"
            >
              <CameraPanel
                sessionState={sessionState}
                exerciseName={exercise?.name ?? ''}
                cameraAllowed={liveUnlocked}
              />
              <SessionControls
                state={sessionState}
                elapsed={elapsed}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onEnd={handleEnd}
                onReset={handleReset}
              />
              {liveUnlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GuidancePanel
                    exercise={exercise}
                    sessionState={sessionState}
                    currentStep={guidanceStep}
                  />
                </motion.div>
              )}
              {!liveUnlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-6 text-center"
                >
                  <p className="font-display text-lg text-[#2C2C28] mb-2">Ready to begin?</p>
                  <p className="font-body text-sm text-[#9B9B8C] mb-4 leading-relaxed">
                    Watch a short preview and read through the instructions before connecting your camera.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleStartPreview}
                    className="px-6 py-3 bg-sage-500 text-white rounded-2xl font-body text-sm font-medium hover:bg-sage-600 transition-colors"
                  >
                    Preview {exercise?.name}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Right column: feedback + scoring */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FeedbackPanel
                feedback={feedback}
                score={score}
                sessionState={sessionState}
                movementScore={movementScore}
                baselineComparison={baselineComparison}
                calibrationProgress={calibrationProgress}
                isCalibrating={isCalibrating}
                classifierOutput={classifierOutput}
                referenceComparison={referenceComparison}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <ExercisePreviewModal
        exercise={exercise ?? null}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onBeginLive={handleBeginLive}
      />
    </div>
  )
}

export default function SomaticCoachPage() {
  return (
    <Suspense
      fallback={
        <motion.div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center">
          <p className="font-body text-sm text-[#9B9B8C]">Loading your practice space…</p>
        </motion.div>
      }
    >
      <SomaticCoachContent />
    </Suspense>
  )
}
