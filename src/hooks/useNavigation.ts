'use client'

import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/exercises', label: 'Exercises' },
  { href: '/somatic-coach', label: 'Somatic Coach' },
  { href: '/dashboard', label: 'Your Reports' },
  { href: '/about', label: 'About' },
] as const

export function useNavigation() {
  const pathname = usePathname()

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/'
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname]
  )

  return { pathname, navLinks: NAV_LINKS, isActive }
}
