/**
 * QuizEngine.tsx
 * Reusable quiz engine for multiple-choice questions with instant feedback and detailed rationales.
 * Enhancements:
 * - OptionItem subcomponent with radio-like single-selection behaviors and accessible keyboard controls
 * - High-contrast highlight for selected option with smooth transitions
 * - When a question is answered incorrectly after submit, show detailed rationales for all options (rich text)
 */

import { useMemo, useState, KeyboardEvent, useId } from 'react'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

/** Single quiz question structure. */
export interface QuizQuestion {
  id: string
  title: string
  options: string[]
  /** index of correct option */
  answer: number
  /** brief explanation shown after submit */
  explain?: string
  /**
   * Detailed per-option rationales (rich text allowed). If provided and the user answers wrong,
   * the engine will render a breakdown card that lists every option with explanations.
   * Length should match options.length; extra/missing entries are ignored gracefully.
   */
  rationales?: string[]
}

/** Props for the quiz engine. */
export interface QuizEngineProps {
  questions: QuizQuestion[]
}

/**
 * OptionItem
 * A11y-friendly, single option item with radio semantics and highlight styles.
 */
function OptionItem({
  label,
  selected,
  submitted,
  isPicked,
  isCorrect,
  onSelect,
  optionId
}: {
  /** Visible label of the option */
  label: string
  /** Whether this option is currently selected */
  selected: boolean
  /** Whether the question has been submitted */
  submitted: boolean
  /** Whether this option is the one the user picked */
  isPicked: boolean
  /** Whether this option is the correct answer (if submitted) */
  isCorrect: boolean
  /** Selection callback */
  onSelect: () => void
  /** Unique id for aria attributes */
  optionId: string
}) {
  /**
   * Handle keyboard selection for accessibility.
   * - Enter or Space confirms selection.
   */
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  // Base and state styles with high contrast and smooth transitions.
  const base =
    'w-full text-left px-3 py-2 rounded-lg border transition-colors duration-200 ease-out ' +
    'focus:outline-none focus:ring-2 grid grid-cols-[auto,1fr] items-start gap-3 ' +
    'hover:bg-slate-50 dark:hover:bg-slate-800'

  // Selected (pre-submit) highlight uses brand blue; after submit, use success/error colors for the picked option.
  const selectedClz =
    'border-sky-500 bg-sky-50 ring-2 ring-sky-500/40 dark:border-sky-500 ' +
    'dark:bg-sky-900/30 dark:ring-sky-500/30 shadow-sm'

  const defaultClz = 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'

  const pickedCorrectClz =
    'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/40 ' +
    'dark:border-emerald-600 dark:bg-emerald-900/20 dark:ring-emerald-600/30 shadow-sm'

  const pickedWrongClz =
    'border-rose-500 bg-rose-50 ring-2 ring-rose-400/40 ' +
    'dark:border-rose-600 dark:bg-rose-900/20 dark:ring-rose-600/30 shadow-sm'

  // Determine visual state
  let stateClz = defaultClz
  if (submitted && isPicked) {
    stateClz = isCorrect ? pickedCorrectClz : pickedWrongClz
  } else if (!submitted && selected) {
    stateClz = selectedClz
  }

  // Left indicator dot color
  const dotClz =
    submitted && isPicked
      ? isCorrect
        ? 'bg-emerald-600'
        : 'bg-rose-600'
      : selected
      ? 'bg-sky-600'
      : 'bg-slate-300 dark:bg-slate-600'

  return (
    <button
      id={optionId}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      tabIndex={0}
      className={`${base} ${stateClz}`}
    >
      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dotClz}`} aria-hidden />
      <span
        className={`text-sm ${
          submitted && isPicked ? 'font-semibold' : ''
        } text-slate-900 dark:text-slate-100`}
      >
        {label}
      </span>
    </button>
  )
}

/**
 * OptionRationaleItem
 * Single rationale row with icon, label and rich-text explanation.
 */
function OptionRationaleItem({
  label,
  html,
  correct
}: {
  /** Option label text */
  label: string
  /** Rich text HTML (controlled content) */
  html: string
  /** Whether this option is correct */
  correct: boolean
}) {
  const Icon = correct ? CheckCircle2 : XCircle
  const borderClz = correct
    ? 'border-emerald-300 dark:border-emerald-700'
    : 'border-rose-300 dark:border-rose-700'
  const iconClz = correct ? 'text-emerald-600' : 'text-rose-600'
  const bgClz = correct
    ? 'bg-emerald-50 dark:bg-emerald-900/20'
    : 'bg-rose-50 dark:bg-rose-900/20'

  return (
    <div
      className={`rounded-lg border ${borderClz} ${bgClz} p-3`}
      role="group"
      aria-label={`选项${label}的辨析`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`h-4 w-4 ${iconClz} mt-0.5`} aria-hidden />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {label} {correct ? '（正确）' : '（错误）'}
          </div>
          {/* Rich text container: only render trusted content */}
          <div
            className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
            // The HTML here is authored by us. Avoid passing any untrusted input.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * RationalesBlock
 * Container showing all options' rationales when user answered incorrectly.
 */
function RationalesBlock({
  question,
  picked
}: {
  question: QuizQuestion
  picked: number | null
}) {
  // Guard: show only when we have rationales and a picked answer
  const hasRationales =
    Array.isArray(question.rationales) && question.rationales.length > 0

  if (!hasRationales || picked === null) return null

  return (
    <section
      className="mt-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <Info className="h-4 w-4 text-sky-600" aria-hidden />
        <h4 className="text-sm font-semibold">选项辨析</h4>
      </div>

      <div className="mt-3 grid gap-2">
        {question.options.map((opt, idx) => {
          const correct = idx === question.answer
          const html =
            question.rationales?.[idx] ??
            (correct
              ? '该选项为正确答案。'
              : '该选项不符合台风形成或发展的气象规律。')
          return (
            <OptionRationaleItem
              key={`${question.id}-r-${idx}`}
              label={opt}
              html={html}
              correct={correct}
            />
          )
        })}
      </div>
    </section>
  )
}

/**
 * QuizEngine
 * Manages answers, grading, and feedback UI. Accessible and mobile-friendly.
 * - Uses radio-like interaction for options
 * - Ensures one highlighted option at any moment per question
 * - Shows per-option rationales when user answers incorrectly (rich text supported)
 */
export default function QuizEngine({ questions }: QuizEngineProps) {
  const [answers, setAnswers] = useState<Record<string, number | null>>(
    () => Object.fromEntries(questions.map((q) => [q.id, null]))
  )
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    if (!submitted) return 0
    return questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.answer ? 1 : 0)
    }, 0)
  }, [submitted, answers, questions])

  const allAnswered = useMemo(
    () => questions.every((q) => answers[q.id] !== null),
    [answers, questions]
  )

  const onPick = (qid: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }))
  }

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const picked = answers[q.id]
        const isSubmittedCorrect = submitted && picked === q.answer
        const groupLabelId = useId()
        return (
          <div
            key={q.id}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 text-sm px-2 py-1 rounded bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                Q{qi + 1}
              </div>
              <h3
                id={groupLabelId}
                className="font-semibold text-slate-900 dark:text-slate-100"
              >
                {q.title}
              </h3>
            </div>

            {/* Options as a radiogroup for single selection */}
            <div className="mt-3 grid gap-2" role="radiogroup" aria-labelledby={groupLabelId}>
              {q.options.map((opt, idx) => {
                const selected = picked === idx
                const isPicked = selected
                const isCorrect = idx === q.answer
                const optionId = `${q.id}-opt-${idx}`
                return (
                  <OptionItem
                    key={optionId}
                    optionId={optionId}
                    label={opt}
                    selected={selected}
                    submitted={submitted}
                    isPicked={isPicked}
                    isCorrect={isCorrect}
                    onSelect={() => onPick(q.id, idx)}
                  />
                )
              })}
            </div>

            {/* Result feedback */}
            {submitted && (
              <div className="mt-3 flex items-center gap-2 text-sm" aria-live="polite">
                {isSubmittedCorrect ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-300">
                      回答正确
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-rose-700 dark:text-rose-300">
                      回答错误，正确选项为：{q.options[q.answer]}
                    </span>
                  </>
                )}
              </div>
            )}
            {submitted && q.explain && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{q.explain}</p>
            )}

            {/* Detailed rationales block — only when answered incorrectly */}
            {submitted && picked !== null && picked !== q.answer && (
              <RationalesBlock question={q} picked={picked} />
            )}
          </div>
        )
      })}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-white transition-colors duration-200"
        >
          提交答案
        </button>
        {submitted && (
          <div className="text-slate-700 dark:text-slate-300 text-sm">
            成绩：{score} / {questions.length}
          </div>
        )}
      </div>
    </div>
  )
}
