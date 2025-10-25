/**
 * ScrollToTop.tsx
 * Global scroll-to-top on route changes for better navigation UX on all pages.
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * ScrollToTop
 * Listens to location.pathname changes and scrolls window to the top.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Use instant scroll to align with requirement: always start at top on new page
    // Fallback-safe for older browsers
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
