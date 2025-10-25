import { HashRouter, Route, Routes } from 'react-router'
import AppLayout from './layout/AppLayout'
import HomePage from './pages/Home'
import TheoryPage from './pages/Theory'
import AnimationPage from './pages/Animation'
import QuizPage from './pages/Quiz'
import SafetyPage from './pages/Safety'
import SourcesPage from './pages/Sources'

import { ThemeProvider } from './theme/ThemeProvider'
import ScrollToTop from './components/ScrollToTop'

/**
 * App.tsx
 * Main routing file using react-router with hash navigation.
 * Wrapped by ThemeProvider to support site-wide dark mode.
 * "创新案例" 路由已移除。
 */
export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        {/* Global scroll restoration */}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="theory" element={<TheoryPage />} />
            <Route path="animation" element={<AnimationPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="safety" element={<SafetyPage />} />
            {/* Removed: <Route path="cases" element={<CasesPage />} /> */}

          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
