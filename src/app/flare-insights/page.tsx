'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, Lock } from 'lucide-react'

const mockFlareData = [
  { day: 'Mon', level: 3 },
  { day: 'Tue', level: 5 },
  { day: 'Wed', level: 4 },
  { day: 'Thu', level: 2 },
  { day: 'Fri', level: 6 },
  { day: 'Sat', level: 4 },
  { day: 'Sun', level: 3 },
]

export default function FlareInsightsPage() {
  const maxLevel = 10

  return (
    <div className="min-h-screen bg-[#FAFAF6] px-6 py-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-warm-100 border border-warm-200 rounded-full text-warm-500 text-xs font-medium mb-4">
              <Sparkles size={10} />
              Powered by Gemini AI
            </div>
            <h1 className="font-display text-5xl font-light text-[#2C2C28] mb-2">
              Flare Insights
            </h1>
            <p className="font-body text-[#6B6B60] text-sm max-w-md leading-relaxed">
              Your AI learns your unique patterns — and offers early awareness before a flare intensifies.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-warm-100 border border-warm-200 rounded-2xl">
            <Lock size={13} className="text-warm-500" />
            <span className="font-body text-xs text-warm-600">Coming soon</span>
          </div>
        </div>

        {/* Preview chart */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-warm-400" />
            <h2 className="font-body text-sm font-medium text-[#2C2C28]">7-day symptom pattern</h2>
            <span className="ml-auto font-body text-xs text-[#9B9B8C]">Preview — mock data</span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {mockFlareData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.level / maxLevel) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                  className="w-full rounded-xl"
                  style={{
                    background: d.level >= 5
                      ? 'linear-gradient(to top, #C4A06C, #EAD8BC)'
                      : 'linear-gradient(to top, #8ABFB8, #B8D8D4)',
                    minHeight: 8,
                  }}
                />
                <span className="font-body text-xs text-[#9B9B8C]">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature preview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Pattern Recognition', desc: 'AI detects recurring triggers — sleep, activity, stress — before they cascade into a flare.' },
            { title: 'Early Warning Signals', desc: 'Receive a gentle notification when early patterns suggest a flare may be building.' },
            { title: 'Intervention Suggestions', desc: 'Personalised somatic exercises recommended at the right moment to interrupt the flare cycle.' },
            { title: 'Weekly Narrative Report', desc: 'A compassionate written summary of your week, written by AI in language you can share with your care team.' },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5 opacity-60"
            >
              <h3 className="font-display text-lg font-medium text-[#2C2C28] mb-1">{card.title}</h3>
              <p className="font-body text-xs text-[#9B9B8C] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
