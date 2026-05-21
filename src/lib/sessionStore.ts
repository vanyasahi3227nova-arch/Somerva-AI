// ─── Persistent session store (localStorage) ─────────────────────────────────
// All session data originates from actual Somatic Coach interactions.
// No synthetic values are generated or written here.

export interface SessionRecord {
  sessionId: string
  timestamp: number                          // Unix ms at session end
  exerciseId: string
  exerciseName: string
  exerciseCategory: string
  sessionDurationSeconds: number
  movementQualityScore: number               // 0–100
  stabilityScore: number                     // 0–100 (from classifier stableScore)
  completionStatus: 'completed' | 'early_exit'
  feedbackCount: number
}

const STORAGE_KEY = 'somerva_sessions'
const MAX_RECORDS  = 100                     // rolling window

// ─── Load ─────────────────────────────────────────────────────────────────────

export function loadSessions(): SessionRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SessionRecord[]
  } catch {
    return []
  }
}

// ─── Save ─────────────────────────────────────────────────────────────────────

export function saveSession(
  record: Omit<SessionRecord, 'sessionId' | 'timestamp'>
): SessionRecord {
  const existing = loadSessions()
  const newRecord: SessionRecord = {
    sessionId: `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    ...record,
  }
  const updated = [newRecord, ...existing].slice(0, MAX_RECORDS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage quota exceeded — discard oldest entry and retry once
    try {
      const trimmed = [newRecord, ...existing].slice(0, Math.floor(MAX_RECORDS / 2))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch {
      // silent fail
    }
  }
  return newRecord
}

// ─── Computed metrics ─────────────────────────────────────────────────────────

export function sessionsThisWeek(sessions: SessionRecord[]): SessionRecord[] {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
  return sessions.filter((s) => s.timestamp >= cutoff)
}

export function totalPracticeSeconds(sessions: SessionRecord[]): number {
  return sessions.reduce((acc, s) => acc + s.sessionDurationSeconds, 0)
}

export function averageQuality(sessions: SessionRecord[]): number {
  if (sessions.length === 0) return 0
  return Math.round(sessions.reduce((acc, s) => acc + s.movementQualityScore, 0) / sessions.length)
}

export function averageStability(sessions: SessionRecord[]): number {
  if (sessions.length === 0) return 0
  return Math.round(sessions.reduce((acc, s) => acc + s.stabilityScore, 0) / sessions.length)
}

export function activeStreakDays(sessions: SessionRecord[]): number {
  if (sessions.length === 0) return 0
  const uniqueDays = new Set(sessions.map((s) => toDateKey(s.timestamp)))
  let streak = 0
  const cursor = new Date()
  while (uniqueDays.has(toDateKey(cursor.getTime()))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function last7DayActivity(sessions: SessionRecord[]): boolean[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = toDateKey(d.getTime())
    return sessions.some((s) => toDateKey(s.timestamp) === key)
  })
}

export function last7DayLabels(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()]
  })
}

export function qualityTrend(sessions: SessionRecord[]): 'up' | 'down' | 'stable' {
  if (sessions.length < 4) return 'stable'
  const recent = averageQuality(sessions.slice(0, 3))
  const prior  = averageQuality(sessions.slice(3, 6))
  if (recent > prior + 3) return 'up'
  if (recent < prior - 3) return 'down'
  return 'stable'
}

export function movementStateLabel(stabilityScore: number): string {
  if (stabilityScore >= 70) return 'Smooth'
  if (stabilityScore >= 50) return 'Stable'
  if (stabilityScore >= 35) return 'Guarded'
  return 'Tense'
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function relativeDate(timestamp: number): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffDays = Math.floor((now.setHours(0,0,0,0) - then.setHours(0,0,0,0)) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

// ─── Rule-based future steps ──────────────────────────────────────────────────

export interface FutureStep {
  title: string
  body: string
}

const STATIC_STEPS: FutureStep[] = [
  {
    title: 'Maintain consistency over intensity',
    body: 'Small, regular sessions of 4 to 8 minutes have more lasting effect on central sensitization than longer infrequent sessions.',
  },
  {
    title: 'Pace around your energy envelope',
    body: 'Track how you feel in the 24 hours after a session and adjust accordingly. Fibromyalgia responds poorly to high exertion followed by crash.',
  },
  {
    title: 'Notice tension patterns between sessions',
    body: 'A few moments of noticing jaw, shoulder, and breath patterns throughout the day builds the same neural pathways as a formal practice.',
  },
  {
    title: 'Explore vagus nerve activation',
    body: 'Humming, extended exhale, and cool water on the face are three low effort vagus nerve activators you can use outside of practice whenever the nervous system feels activated.',
  },
]

export function buildFutureSteps(sessions: SessionRecord[]): FutureStep[] {
  if (sessions.length === 0) return STATIC_STEPS.slice(0, 4)

  const steps: FutureStep[] = []
  const week = sessionsThisWeek(sessions)
  const uniqueDaysThisWeek = new Set(week.map((s) => toDateKey(s.timestamp))).size
  const avgQ = averageQuality(sessions.slice(0, 5))
  const earlyExits = sessions.filter((s) => s.completionStatus === 'early_exit').length
  const hasShoulderFocus = sessions.some((s) =>
    s.exerciseCategory.toLowerCase().includes('shoulder') ||
    s.exerciseCategory.toLowerCase().includes('neck')
  )

  if (uniqueDaysThisWeek < 3) {
    steps.push({
      title: 'Build consistency with shorter sessions',
      body: 'Even 3 to 4 minutes of somatic practice daily produces more cumulative benefit than longer sessions done irregularly. Consider beginning your day with a brief grounding exercise.',
    })
  }

  if (hasShoulderFocus) {
    steps.push({
      title: 'Continue exploring shoulder and neck release',
      body: 'You have been gravitating toward shoulder focused work. Gentle neck release exercises can complement this well and extend the benefit of what you have already been doing.',
    })
  }

  if (avgQ > 0 && avgQ < 65) {
    steps.push({
      title: 'Consider a lower intensity approach',
      body: 'Your recent movement quality scores suggest your nervous system may be working harder than usual. Dropping to the lightest exercises for a few days can help restore baseline regulation.',
    })
  }

  if (sessions.length >= 3 && earlyExits / sessions.length > 0.4) {
    steps.push({
      title: 'Flare friendly routines may suit you better right now',
      body: 'Based on your session patterns, shorter Seated Flare Friendly exercises may be a better fit for your current capacity. These are designed specifically for higher symptom days.',
    })
  }

  const needed = Math.max(0, 4 - steps.length)
  steps.push(...STATIC_STEPS.slice(0, needed))
  return steps.slice(0, 4)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}
