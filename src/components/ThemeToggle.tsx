/**
 * ThemeToggle.tsx
 * Theme mode toggle button showing the CURRENT state (icon + label).
 * - Visual: current mode (dark = Moon + "深色", light = Sun + "浅色").
 * - Action: aria-label describes the next mode (for accessibility).
 */

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme/ThemeProvider'

/**
 * ThemeToggle
 * Provides a button to switch between light and dark themes with proper status display.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  // Label shows CURRENT state; aria-label describes the next action.
  const nextActionLabel = isDark ? '切换为浅色模式' : '切换为深色模式'
  const statusText = isDark ? '深色' : '浅色'

  return (
    <button
      type="button"
      aria-label={nextActionLabel}
      title={nextActionLabel}
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm
                 bg-white hover:bg-slate-50 text-slate-800
                 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-100 transition"
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-sky-400" />
      ) : (
        <Sun className="h-4 w-4 text-amber-500" />
      )}
      <span className="hidden sm:inline">{statusText}</span>
    </button>
  )
}
