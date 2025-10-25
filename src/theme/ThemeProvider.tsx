/**
 * ThemeProvider.tsx
 * Global theme context for light/dark mode with persistence and system preference fallback.
 * - Initializes synchronously from localStorage or prefers-color-scheme to minimize flicker.
 * - Applies/removes the "dark" class on &lt;html&gt; using useLayoutEffect for early paint.
 */

import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

/** Theme type union. */
export type ThemeMode = 'light' | 'dark'

/** Context shape for theme control. */
interface ThemeContextValue {
  /** Current theme mode. */
  theme: ThemeMode
  /** Force set theme mode. */
  setTheme: (t: ThemeMode) => void
  /** Toggle between light/dark. */
  toggleTheme: () => void
}

/**
 * Derive initial theme:
 * - 1) localStorage 'theme' if valid;
 * - 2) OS preference via matchMedia;
 * - 3) fallback 'light'.
 */
function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * ThemeProvider
 * Provides theme state and syncs the "dark" class on document.documentElement.
 * Using useLayoutEffect reduces first-paint mismatch when toggling themes.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme)

  // Apply to document root and persist as early as possible to avoid flash.
  useLayoutEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  /** Update theme directly. */
  const setTheme = (t: ThemeMode) => setThemeState(t)
  /** Toggle theme. */
  const toggleTheme = () =>
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * useTheme
 * Hook to access theme context.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
