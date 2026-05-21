'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { clsx } from 'clsx'
import { useNavigation } from '@/hooks/useNavigation'
import { MobileMenu } from './MobileMenu'

const navLinkClass = (active: boolean) =>
  clsx(
    'relative px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-200',
    active
      ? 'text-sage-700'
      : 'text-[#2C2C28]/80 hover:text-[#2C2C28] hover:bg-white/30'
  )

export function Navbar() {
  const { navLinks, isActive } = useNavigation()

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-white/20 bg-[rgba(255,255,255,0.4)] backdrop-blur-xl backdrop-saturate-150"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-start gap-6 sm:gap-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
          aria-label="Somerva AI home"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage-400 to-teal-500 flex items-center justify-center shadow-soft"
          >
            <Leaf size={15} className="text-white" />
          </motion.div>
          <span className="font-display text-xl font-semibold tracking-tight text-[#2C2C28]">
            Somerva<span className="text-sage-500"> AI</span>
          </span>
        </Link>

        <motion.div
          className="hidden md:flex items-center gap-1"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link key={link.href} href={link.href} className={navLinkClass(active)}>
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl bg-white/50 border border-white/40"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  />
                )}
                {link.label}
              </Link>
            )
          })}
        </motion.div>

        <div className="ml-auto md:hidden">
          <MobileMenu />
        </div>
      </div>
    </motion.nav>
  )
}
