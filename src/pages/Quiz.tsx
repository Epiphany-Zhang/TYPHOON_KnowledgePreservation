/**
 * Quiz.tsx
 * Typhoon-themed interactive quiz page.
 * - Loads questions from an external JSON file (data/typhoon-quiz.json)
 * - Single-question view with Prev/Next navigation and progress bar
 * - Submit at the end; shows total score and per-question answer + explanation
 * - Blue/gray theme visuals with subtle animated weather icons; fully dark-mode compatible
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Cloud, CloudRain, Droplets, Wind, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import data from '../data/typhoon-quiz.json'
import TyphoonQuizQuestion, { TyphoonQuestion } from '../components/Quiz/TyphoonQuizQuestion'

/** Helper: letter label for an option index. */
function letter(idx: number) {
  return ['A', 'B', 'C', 'D'][idx] ?? ''
}

/**
 * AnimatedBackdrop
 * Subtle weather-themed animated icons for atmosphere.
 */
function AnimatedBackdrop() {
  return (
    <>
      <style>
        {`
        @keyframes driftX { 0% { transform: translateX(0px) } 100% { transform: translateX(40px) } }
        @keyframes floatY { 0% { transform: translateY(0px) } 50% { transform: translateY(-10px) } 100% { transform: translateY(0px) } }
        .animate-drift { animation: driftX 12s ease-in-out infinite alternate; }
        .animate-float { animation: floatY 6s ease-in-out infinite; }
      `}
      </style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Cloud className="absolute top-4 left-6 h-6 w-6 text-sky-400/40 dark:text-sky-300/30 animate-drift" />
        <Wind className="absolute top-10 right-8 h-6 w-6 text-slate-400/50 dark:text-slate-300/30 animate-float" />
        <CloudRain className="absolute bottom-6 left-10 h-6 w-6 text-sky-500/40 dark:text-sky-200/30 animate-drift" />
        <Droplets className="absolute bottom-4 right-6 h-6 w-6 text-sky-400/40 dark:text-sky-200/30 animate-float" />
      </div>
    </>
  )
}

/**
 * QuizPage
 * Hosts the Typhoon quiz: sequential answering, submit & result summary.
 */
export default function QuizPage() {
  // Load and memoize questions from JSON
  const questions = useMemo(() => data as TyphoonQuestion[], [])

  // State: current index and answers
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, null]))
  )
  const [submitted, setSubmitted] = useState(false)

  // Derived: current question and selection
  const q = questions[current]
  const picked = answers[q.id]

  // Derived: all answered & score
  const allAnswered = useMemo(
    () => questions.every((qq) => answers[qq.id] !== null),
    [answers, questions]
  )

  const score = useMemo(() => {
    if (!submitted) return 0
    return questions.reduce((acc, qq) => acc + (answers[qq.id] === qq.answer ? 1 : 0), 0)
  }, [submitted, questions, answers])

  // Handlers
  const onPick = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: idx }))
  }

  const next = useCallback(() => {
    setCurrent((i) => Math.min(i + 1, questions.length - 1))
  }, [questions.length])
  const prev = useCallback(() => {
    setCurrent((i) => Math.max(i - 1, 0))
  }, [])

  const submit = () => setSubmitted(true)

  const reset = () => {
    setAnswers(Object.fromEntries(questions.map((qq) => [qq.id, null])))
    setCurrent(0)
    setSubmitted(false)
  }

  // Keyboard navigation (Left/Right)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (submitted) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, submitted])

  // Progress percent (1-based when viewing)
  const progress = ((current + 1) / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Header with animated backdrop */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-sky-700 to-slate-700 text-white">
        <AnimatedBackdrop />
        <div className="relative p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/15 px-2.5 py-1 text-xs">
            台风知识互动测试
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold">Typhoon Quiz</h1>
          <p className="mt-2 text-white/95">
            依次回答问题并提交，系统将统计得分并展示每题解析。请勿在台风期间前往海边、低洼与桥下区域停留。
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full rounded bg-white/20">
            <div
              className="h-2 rounded bg-white"
              style={{ width: `${progress}%`, transition: 'width 240ms ease' }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              role="progressbar"
            />
          </div>
        </div>
      </section>

      {/* Main quiz card */}
      <TyphoonQuizQuestion
        question={q}
        index={current + 1}
        total={questions.length}
        picked={picked}
        submitted={submitted}
        onPick={onPick}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={submitted || current === 0}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一题
          </button>
          <button
            type="button"
            onClick={next}
            disabled={submitted || current === questions.length - 1 || picked === null}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一题
          </button>
        </div>

        <div className="flex items-center gap-3">
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={!allAnswered}
              className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-white transition-colors duration-200"
            >
              提交答卷
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              重新作答
            </button>
          )}
        </div>
      </div>

      {/* Result summary */}
      {submitted && (
        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 p-4 flex items-center justify-between">
            <div className="text-slate-800 dark:text-slate-200">
              成绩：{score} / {questions.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              感谢作答，查看下方每题解析巩固知识点。
            </div>
          </div>

          <div className="grid gap-4">
            {questions.map((qq, i) => {
              const pickedIdx = answers[qq.id]
              const correct = pickedIdx === qq.answer
              return (
                <div
                  key={`rs-${qq.id}`}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-sm px-2 py-1 rounded bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                      Q{i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {qq.title}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        {correct ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-700 dark:text-emerald-300">
                              你的作答：{letter(pickedIdx!)}（正确）
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-rose-600" />
                            <span className="text-rose-700 dark:text-rose-300">
                              你的作答：{pickedIdx === null ? '未作答' : letter(pickedIdx)}（错误）
                            </span>
                          </>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                        正确答案：{letter(qq.answer)} — {qq.options[qq.answer]}
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{qq.explain}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
