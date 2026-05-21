'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-light text-[#2C2C28] mb-3">
        Something went quiet for a moment
      </h1>
      <p className="font-body text-sm text-[#6B6B60] max-w-md leading-relaxed mb-8">
        We could not load this page. You can try again, return home, or continue to your exercises
        — your practice data is safe.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-sage-500 text-white rounded-2xl font-body text-sm font-bold hover:bg-sage-600 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white/60 border border-white/40 rounded-2xl font-body text-sm font-bold text-[#2C2C28] hover:bg-white transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/exercises"
          className="px-6 py-3 bg-cream-200 rounded-2xl font-body text-sm font-bold text-[#2C2C28] hover:bg-cream-300 transition-colors"
        >
          Exercises
        </Link>
      </div>
    </div>
  )
}
