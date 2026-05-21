'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu } from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useNavigation } from '@/hooks/useNavigation'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { navLinks, isActive } = useNavigation()

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-xl bg-white/40 border border-white/30 flex items-center justify-center hover:bg-white/60 transition-colors backdrop-blur-sm"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu size={20} className="text-[#2C2C28]" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
              aria-label="Close menu overlay"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[min(100%,300px)] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl border-r border-white/30 shadow-soft-lg flex flex-col"
              aria-label="Mobile navigation"
            >
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between px-5 h-16 border-b border-white/30"
              >
                <span className="font-display text-lg font-semibold text-[#2C2C28]">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center hover:bg-white/80 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} className="text-[#2C2C28]" />
                </button>
              </motion.div>

              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link, i) => {
                  const active = isActive(link.href)
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={clsx(
                          'block px-4 py-3.5 rounded-2xl font-body text-sm font-bold transition-colors',
                          active
                            ? 'bg-sage-100/90 text-sage-700'
                            : 'text-[#2C2C28]/80 hover:bg-white/60 hover:text-[#2C2C28]'
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
