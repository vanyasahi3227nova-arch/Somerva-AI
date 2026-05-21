'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity, Clock, Target, Flame,
  TrendingUp, TrendingDown, Minus,
  CheckCircle2, ArrowRight, BarChart2,
} from 'lucide-react'
import Link from 'next/link'
import {
  type SessionRecord,
  loadSessions,
  sessionsThisWeek,
  totalPracticeSeconds,
  averageQuality,
  averageStability,
  activeStreakDays,
  last7DayActivity,
  last7DayLabels,
  qualityTrend,
  movementStateLabel,
  formatDuration,
  relativeDate,
  buildFutureSteps,
} from '@/lib/sessionStore'

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ value, color = 'sage' }: { value: number; color?: string }) {
  const barColors: Record<string, string> = {
    sage: 'bg-sage-400',
    teal: 'bg-teal-400',
    warm: 'bg-warm-400',
  }
  return (
    <div className="w-full bg-cream-100 rounded-full h-1.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full ${barColors[color] ?? 'bg-sage-400'}`}
      />
    </div>
  )
}

const stateColors: Record<string, string> = {
  Smooth:  'bg-teal-50 text-teal-600',
  Stable:  'bg-sage-100 text-sage-600',
  Guarded: 'bg-warm-50 text-warm-600',
  Tense:   'bg-red-50 text-red-500',
}

function formatSessionDuration(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m === 0) return `${sec}s`
  return `${m}m ${sec}s`
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-3xl bg-sage-100 flex items-center justify-center mb-5">
        <BarChart2 size={26} className="text-sage-400" />
      </div>
      <h2 className="font-display text-2xl font-light text-[#2C2C28] mb-3">
        Your progress insights will appear here after your first guided session.
      </h2>
      <p className="font-body text-sm text-[#9B9B8C] max-w-md leading-relaxed mb-8">
        Complete a somatic session to begin tracking your movement quality and progress over time.
      </p>
      <Link href="/somatic-coach">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(106,143,98,0.22)' }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-sage-500 text-white rounded-2xl font-body font-medium text-sm hover:bg-sage-600 transition-colors"
        >
          Begin your first session
          <ArrowRight size={15} />
        </motion.button>
      </Link>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([])
  const [loaded, setLoaded]     = useState(false)

  useEffect(() => {
    setSessions(loadSessions())
    setLoaded(true)
  }, [])

  // ── Computed metrics ─────────────────────────────────────────────────────
  const weekSessions  = sessionsThisWeek(sessions)
  const totalSecs     = totalPracticeSeconds(sessions)
  const avgQ          = averageQuality(sessions)
  const streak        = activeStreakDays(sessions)
  const dayActivity   = last7DayActivity(sessions)
  const dayLabels     = last7DayLabels()
  const trend         = qualityTrend(sessions)
  const avgStab       = averageStability(sessions.slice(0, 5))
  const recentSessions = sessions.slice(0, 5)
  const futureSteps   = buildFutureSteps(sessions)

  const trendIcon = trend === 'up'
    ? <TrendingUp size={16} className="text-teal-500" />
    : trend === 'down'
      ? <TrendingDown size={16} className="text-red-400" />
      : <Minus size={16} className="text-[#9B9B8C]" />

  const trendLabel = trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'
  const trendColor = trend === 'up' ? 'text-teal-600' : trend === 'down' ? 'text-red-500' : 'text-[#9B9B8C]'

  const SUMMARY_STATS = [
    {
      label: 'Sessions this week',
      value: loaded ? String(weekSessions.length) : '--',
      icon: Activity,
      color: 'sage',
    },
    {
      label: 'Total practice time',
      value: loaded && sessions.length > 0 ? formatDuration(totalSecs) : '--',
      icon: Clock,
      color: 'teal',
    },
    {
      label: 'Avg. quality score',
      value: loaded && sessions.length > 0 ? String(avgQ) : '--',
      icon: Target,
      color: 'warm',
    },
    {
      label: 'Active streak',
      value: loaded && streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : '--',
      icon: Flame,
      color: 'sage',
    },
  ]

  const colorMap = {
    sage: { bg: 'bg-sage-100', icon: 'text-sage-500' },
    teal: { bg: 'bg-teal-100', icon: 'text-teal-500' },
    warm: { bg: 'bg-warm-100', icon: 'text-warm-500' },
  }

  // Bar heights — deterministic, based on index
  const BAR_HEIGHTS = [36, 44, 32, 40, 48, 28, 36]

  return (
    <div className="min-h-screen bg-[#FAFAF6] px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-1">Somerva AI</p>
          <h1 className="font-display text-5xl font-light text-[#2C2C28] mb-2">Your Reports</h1>
          <p className="font-body text-sm text-[#9B9B8C]">
            A gentle overview of your practice and how your nervous system is responding.
          </p>
        </motion.div>

        {/* Show empty state if no sessions */}
        {loaded && sessions.length === 0 && <EmptyState />}

        {/* Main content — only shown once sessions exist */}
        {loaded && sessions.length > 0 && (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {SUMMARY_STATS.map((stat, i) => {
                const colors = colorMap[stat.color as keyof typeof colorMap]
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5"
                  >
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                      <Icon size={18} className={colors.icon} />
                    </div>
                    <div className="font-display text-3xl font-light text-[#2C2C28]">{stat.value}</div>
                    <div className="font-body text-xs text-[#9B9B8C] mt-0.5">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Session cards + infographic */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-8">

              {/* Recent sessions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-6"
              >
                <h2 className="font-display text-xl font-medium text-[#2C2C28] mb-5">Recent Sessions</h2>
                <div className="flex flex-col gap-4">
                  {recentSessions.map((session, i) => {
                    const stateLabel = movementStateLabel(session.stabilityScore)
                    return (
                      <motion.div
                        key={session.sessionId}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="p-4 bg-[#FAFAF6] rounded-2xl border border-[rgba(0,0,0,0.04)]"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-display text-base font-medium text-[#2C2C28]">
                              {session.exerciseName}
                            </p>
                            <p className="font-body text-xs text-[#9B9B8C] mt-0.5">
                              {session.exerciseCategory} · {relativeDate(session.timestamp)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`font-body text-[10px] font-medium px-2 py-0.5 rounded-full ${stateColors[stateLabel] ?? 'bg-cream-100 text-[#9B9B8C]'}`}>
                              {stateLabel}
                            </span>
                            <span className="font-body text-xs text-[#9B9B8C]">
                              {formatSessionDuration(session.sessionDurationSeconds)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-body text-[10px] text-[#9B9B8C]">Movement quality</span>
                              <span className="font-body text-[10px] font-medium text-[#2C2C28]">
                                {session.movementQualityScore}
                              </span>
                            </div>
                            <ScoreBar value={session.movementQualityScore} color="teal" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-body text-[10px] text-[#9B9B8C]">Stability</span>
                              <span className="font-body text-[10px] font-medium text-[#2C2C28]">
                                {session.stabilityScore}
                              </span>
                            </div>
                            <ScoreBar value={session.stabilityScore} color="sage" />
                          </div>
                        </div>

                        {session.completionStatus === 'early_exit' && (
                          <p className="font-body text-[10px] text-[#9B9B8C] mt-2 italic">
                            Session ended early
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Infographic panel */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4"
              >
                {/* Weekly consistency */}
                <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5">
                  <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-4">
                    Weekly consistency
                  </p>
                  <div className="flex gap-1.5 mb-3 items-end">
                    {dayLabels.map((day, i) => {
                      const practiced = dayActivity[i]
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.35 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                            style={{
                              transformOrigin: 'bottom',
                              height: practiced ? BAR_HEIGHTS[i] : 8,
                            }}
                            className={`w-full rounded-md ${practiced ? 'bg-sage-400' : 'bg-cream-200'}`}
                          />
                          <span className="font-body text-[9px] text-[#9B9B8C]">{day}</span>
                        </div>
                      )
                    })}
                  </div>
                  <p className="font-body text-xs text-sage-600 font-medium">
                    {weekSessions.length} of 7 days this week
                  </p>
                </div>

                {/* Quality trend */}
                <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5">
                  <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-3">
                    Quality trend
                  </p>
                  <div className={`flex items-center gap-2 mb-1 ${trendColor}`}>
                    {trendIcon}
                    <span className="font-display text-xl font-light">{trendLabel}</span>
                  </div>
                  <p className="font-body text-xs text-[#9B9B8C] leading-relaxed">
                    {sessions.length < 4
                      ? 'Complete more sessions to see your quality trend over time.'
                      : trend === 'up'
                        ? 'Your recent sessions show improving movement quality.'
                        : trend === 'down'
                          ? 'Consider trying a lower intensity exercise for a few days.'
                          : 'Your movement quality is holding steady.'}
                  </p>
                </div>

                {/* Stability average */}
                {sessions.length >= 2 && (
                  <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5">
                    <p className="font-body text-xs text-[#9B9B8C] uppercase tracking-widest mb-3">
                      Avg. stability
                    </p>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="font-display text-4xl font-light text-[#2C2C28]">{avgStab}</span>
                      <span className="font-body text-[10px] text-[#9B9B8C] mb-1.5">/ 100</span>
                    </div>
                    <ScoreBar value={avgStab} color="teal" />
                    <p className="font-body text-[10px] text-[#9B9B8C] mt-2 leading-relaxed">
                      Stability reflects how regulated your nervous system movement patterns are.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Future Steps */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-6 mb-8"
            >
              <div className="mb-6">
                <h2 className="font-display text-xl font-medium text-[#2C2C28]">
                  Future Steps for Chronic Pain Management
                </h2>
                <p className="font-body text-xs text-[#9B9B8C] mt-1">
                  Guidance shaped by your actual session patterns
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {futureSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-3 p-4 bg-[#FAFAF6] rounded-2xl border border-[rgba(0,0,0,0.04)]"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center mt-0.5">
                      <CheckCircle2 size={13} className="text-sage-500" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-medium text-[#2C2C28] mb-1">{step.title}</p>
                      <p className="font-body text-xs text-[#6B6B60] leading-relaxed">{step.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <Link href="/somatic-coach">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(106,143,98,0.22)' }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-sage-500 text-white rounded-2xl font-body font-medium text-sm hover:bg-sage-600 transition-colors"
                >
                  Start a new session
                  <ArrowRight size={15} />
                </motion.button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
