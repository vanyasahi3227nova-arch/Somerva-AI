'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Lock, MessageSquare } from 'lucide-react'

export default function BrainFogPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF6] px-6 py-12 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 border border-teal-200 rounded-full text-teal-600 text-xs font-medium mb-4">
            <Sparkles size={10} />
            Gemini-powered assistant
          </div>
          <h1 className="font-display text-5xl font-light text-[#2C2C28] mb-2">
            Brain Fog Assistant
          </h1>
          <p className="font-body text-[#6B6B60] text-sm max-w-lg leading-relaxed">
            When mental clarity is low, Somerva simplifies your world — breaking complex tasks into calm, gentle steps.
          </p>
        </div>

        {/* Chat interface preview */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.05)] shadow-soft overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={15} className="text-teal-500" />
              <span className="font-body text-sm font-medium text-[#2C2C28]">Brain Fog Mode</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-teal-100 border border-teal-200 rounded-full">
              <Lock size={10} className="text-teal-500" />
              <span className="font-body text-xs text-teal-600">Coming soon</span>
            </div>
          </div>

          {/* Mock messages */}
          <div className="p-6 space-y-4 opacity-50 pointer-events-none">
            {[
              { role: 'user', text: 'I need to email my doctor but I can not think clearly today.' },
              { role: 'assistant', text: 'I understand. Let me help make this easier. What do you need to tell your doctor? Just a few words is enough — I will do the rest.' },
              { role: 'user', text: 'my pain has been worse this week and I want to ask about my medication' },
              { role: 'assistant', text: "Here is a simple email I can send for you:\n\n\"Dear Dr. [Name], I am writing to let you know my pain has been more intense this week. I would appreciate discussing my current medication. Could we schedule a brief call? Thank you.\"" },
            ].map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed font-body ${
                  msg.role === 'user'
                    ? 'bg-sage-100 text-sage-800'
                    : 'bg-cream-200 text-[#2C2C28]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.05)] opacity-40 pointer-events-none">
            <div className="flex items-center gap-3 px-4 py-3 bg-cream-100 rounded-2xl">
              <MessageSquare size={15} className="text-[#9B9B8C]" />
              <span className="font-body text-sm text-[#9B9B8C]">
                Tell me what you need help with today…
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Task Simplification', desc: 'Break down complex tasks into small, manageable steps.' },
            { title: 'Email & Message Help', desc: 'Draft communications when forming words feels hard.' },
            { title: 'Gentle Reminders', desc: 'Calm, non-alarming prompts for important tasks.' },
            { title: 'Cognitive Pacing', desc: 'Learn which times of day your clarity is highest.' },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-soft p-5 opacity-60"
            >
              <h3 className="font-display text-base font-medium text-[#2C2C28] mb-1">{card.title}</h3>
              <p className="font-body text-xs text-[#9B9B8C] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
