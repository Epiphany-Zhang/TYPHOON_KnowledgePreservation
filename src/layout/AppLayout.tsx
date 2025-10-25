/**
 * AppLayout.tsx
 * Site-wide layout: top navigation, main content outlet, and footer.
 * Updated background palette to calm blue + tech gray.
 */

import { Outlet } from 'react-router'
import { Toaster } from 'sonner'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import BottomNavCTA from '../components/BottomNavCTA'

/**
 * AppLayout
 * Provides the persistent shell for all pages with light/dark backgrounds.
 */
export default function AppLayout() {
  return (
    <div
      className="min-h-screen flex flex-col
                 bg-gradient-to-b from-slate-50 via-white to-blue-50 text-slate-900
                 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-slate-100"
    >
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Bottom CTA shown across pages to guide next step */}
      <BottomNavCTA />
      <Footer />
      <Toaster richColors closeButton position="top-center" />
    </div>
  )
}
