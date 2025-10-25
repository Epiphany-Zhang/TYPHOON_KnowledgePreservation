/**
 * BottomNavCTA.tsx
 * A prominent bottom call-to-action button shown on every page to guide users to the next step.
 * - High-contrast design with gradient background, rounded pill, shadow and hover/active feedback.
 * - Uses react-router (HashRouter) navigate; ScrollToTop ensures users land at the top after route change.
 * - Accessible: clear aria-label, focus ring, adequate hit area.
 */

import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { BookOpenText, CirclePlay, Shield, SquareCheckBig, Home } from 'lucide-react'

/** CTA config for each route */
interface CtaConfig {
  /** Current route base (startsWith match) */
  base: string
  /** Target route to navigate */
  to: string
  /** Button text label */
  label: string
  /** Icon element (React node) */
  icon: React.ReactNode
}

/**
 * Derive CTA by matching current path prefix.
 * Ensures "/" only matches home route precisely.
 */
function getCtaForPath(pathname: string): CtaConfig | null {
  const configs: CtaConfig[] = [
    { base: '/', to: '/theory', label: '开始学习 · 理论知识', icon: <BookOpenText className="h-5 w-5" aria-hidden="true" /> },
    { base: '/theory', to: '/animation', label: '前往图形动画', icon: <CirclePlay className="h-5 w-5" aria-hidden="true" /> },
    { base: '/animation', to: '/safety', label: '前往安全防范', icon: <Shield className="h-5 w-5" aria-hidden="true" /> },
    { base: '/safety', to: '/quiz', label: '去做互动测试', icon: <SquareCheckBig className="h-5 w-5" aria-hidden="true" /> },
    { base: '/quiz', to: '/', label: '返回首页', icon: <Home className="h-5 w-5" aria-hidden="true" /> },
  ]

  // Home precise match
  if (pathname === '/' || pathname === '') {
    return configs[0]
  }

  // Other pages: find the first prefix match (skip index 0 which is home)
  for (let i = 1; i < configs.length; i++) {
    if (pathname.startsWith(configs[i].base)) return configs[i]
  }
  return null
}

/**
 * BottomNavCTA
 * Renders a large pill-shaped button with gradient background and hover/focus feedback.
 * Uses navigate() to switch route; ScrollToTop will run after route update to scroll to top.
 */
export default function BottomNavCTA() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const cta = getCtaForPath(pathname)
  if (!cta) return null

  /** Handle CTA click: navigate to target path. */
  const handleClick = () => {
    navigate(cta.to)
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-10">
      <div className="flex justify-center">
        <button
          type="button"
          aria-label={cta.label}
          onClick={handleClick}
          className="footer-nav-button inline-flex items-center gap-2 rounded-full
                     bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500
                     text-white text-base md:text-lg font-medium
                     px-6 md:px-8 py-4
                     shadow-lg shadow-blue-600/20
                     hover:from-blue-700 hover:via-blue-600 hover:to-indigo-600
                     active:scale-[0.99]
                     transition-all duration-200
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500"
        >
          {cta.icon}
          <span>{cta.label}</span>
        </button>
      </div>
    </div>
  )
}
