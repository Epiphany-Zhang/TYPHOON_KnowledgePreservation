/**
 * TyphoonQuizQuestion.tsx
 * Single-question card for the Typhoon quiz with immediate grading.
 * - As soon as the user picks an option, the component shows correctness and renders the explanation block.
 * - After "submitted" becomes true (from parent), options are disabled to lock answers.
 * - High-contrast feedback and rationale area for clear separation of option list, feedback, and explanation.
 */

import React, { KeyboardEvent, useId } from 'react'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

/** Question shape for the Typhoon quiz. */
export interface TyphoonQuestion {
  /** Unique question id */
  id: string
  /** Question title */
  title: string
  /** Options (A-D) */
  options: string[]
  /** Correct option index (0-based) */
  answer: number
  /** Explanation text shown beneath the feedback */
  explain: string
  /** Optional per-option rationales (not required for immediate grading) */
  rationales?: string[]
}

/** Props for a single Typhoon quiz question card. */
export interface TyphoonQuizQuestionProps {
  /** The question data */
  question: TyphoonQuestion
  /** 1-based index of current question */
  index: number
  /** Total questions count */
  total: number
  /** Picked option index (null if not picked) */
  picked: number | null
  /** Whether the whole quiz has been submitted (locks selection) */
  submitted: boolean
  /** Selection handler */
  onPick: (idx: number) => void
}

/**
 * OptionItem
 * Accessible radio-like option item with state-based highlight.
 */
function OptionItem({
  label,
  selected,
  isPicked,
  isCorrect,
  onSelect,
  optionId,
  disabled,
  submitted
}: {
  label: string
  selected: boolean
  isPicked: boolean
  isCorrect: boolean
  onSelect: () => void
  optionId: string
  disabled?: boolean
  submitted?: boolean
}) {
  /** Handle keyboard activation (Enter/Space). */
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  // Base + state styles
  const base =
    'w-full text-left px-3 py-2 rounded-lg border transition-colors duration-200 ease-out ' +
    'focus:outline-none focus:ring-2 grid grid-cols-[auto,1fr] items-start gap-3 ' +
    'hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed'

  const defaultClz = 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
  const selectedClz =
    'border-sky-500 bg-sky-50 ring-2 ring-sky-500/40 dark:border-sky-500 dark:bg-sky-900/30 dark:ring-sky-500/30 shadow-sm'

  // When submitted or already graded, color the picked option using success/error colors
  const pickedCorrectClz =
    'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/40 ' +
    'dark:border-emerald-600 dark:bg-emerald-900/20 dark:ring-emerald-600/30 shadow-sm'
  const pickedWrongClz =
    'border-rose-500 bg-rose-50 ring-2 ring-rose-400/40 ' +
    'dark:border-rose-600 dark:bg-rose-900/20 dark:ring-rose-600/30 shadow-sm'

  // Determine visual state:
  // - If the option is the one the user picked, we immediately show correct/wrong colors.
  // - If not picked but selected focus (pre-submit), show selectedClz.
  let stateClz = defaultClz
  if (isPicked) {
    stateClz = isCorrect ? pickedCorrectClz : pickedWrongClz
  } else if (!submitted && selected) {
    stateClz = selectedClz
  }

  const dotClz =
    isPicked ? (isCorrect ? 'bg-emerald-600' : 'bg-rose-600') : selected ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'

  return (
    <button
      id={optionId}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={onKeyDown}
      tabIndex={0}
      className={`${base} ${stateClz}`}
      disabled={disabled}
    >
      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dotClz}`} aria-hidden />
      <span className={`text-sm ${isPicked ? 'font-semibold' : ''} text-slate-900 dark:text-slate-100`}>{label}</span>
    </button>
  )
}

/**
 * FeedbackBanner
 * Shows "correct" / "wrong" inline result banner under the options, with vivid color and icon.
 */
function FeedbackBanner({
  correct,
  correctLabel
}: {
  correct: boolean
  correctLabel: string
}) {
  const Icon = correct ? CheckCircle2 : XCircle
  const textClz = correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
  const iconClz = correct ? 'text-emerald-600' : 'text-rose-600'

  return (
    <div className="mt-3 flex items-center gap-2 text-sm" aria-live="polite">
      <Icon className={`h-4 w-4 ${iconClz}`} aria-hidden />
      {correct ? (
        <span className={textClz}>回答正确</span>
      ) : (
        <span className={textClz}>回答错误，正确选项为：{correctLabel}</span>
      )}
    </div>
  )
}

/**
 * ExplanationCard
 * Prominent bordered block for rationale/explanation; color-tinted by correctness.
 */
function ExplanationCard({
  correct,
  text
}: {
  correct: boolean
  text: string
}) {
  const borderClz = correct ? 'border-emerald-300 dark:border-emerald-700' : 'border-rose-300 dark:border-rose-700'
  const bgClz = correct ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'
  const titleClz = correct ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'

  return (
    <section className={`mt-3 rounded-lg border ${borderClz} ${bgClz} p-3`} aria-live="polite">
      <div className="flex items-center gap-2">
        <Info className={`h-4 w-4 ${titleClz}`} aria-hidden />
        <h4 className={`text-sm font-semibold ${titleClz}`}>解析</h4>
      </div>
      <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{text}</p>
    </section>
  )
}

/**
 * TyphoonQuizQuestion
 * Renders the question card with options. Immediate grading appears once an option is picked,
 * showing a feedback banner and an explanation card. When submitted is true, options are disabled.
 */
export default function TyphoonQuizQuestion({
  question,
  index,
  total,
  picked,
  submitted,
  onPick
}: TyphoonQuizQuestionProps) {
  const groupLabelId = useId()
  const correct = picked !== null ? picked === question.answer : false

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
      {/* Header: index and title */}
      <div className="flex items-start gap-3">
        <div className="mt-1 text-sm px-2 py-1 rounded bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
          Q{index}/{total}
        </div>
        <h2 id={groupLabelId} className="font-semibold text-slate-900 dark:text-slate-100">
          {question.title}
        </h2>
      </div>

      {/* Options */}
      <div className="mt-3 grid gap-2" role="radiogroup" aria-labelledby={groupLabelId}>
        {question.options.map((opt, idx) => {
          const optionId = `${question.id}-opt-${idx}`
          const isPicked = picked === idx
          const isCorrect = idx === question.answer
          return (
            <OptionItem
              key={optionId}
              optionId={optionId}
              label={opt}
              selected={picked === idx}
              isPicked={isPicked}
              isCorrect={isCorrect}
              onSelect={() => onPick(idx)}
              disabled={submitted}
              submitted={submitted}
            />
          )
        })}
      </div>

      {/* Immediate feedback + explanation (only when an option has been picked) */}
      {picked !== null && (
        <>
          <FeedbackBanner correct={correct} correctLabel={question.options[question.answer]} />
          {question.explain && <ExplanationCard correct={correct} text={question.explain} />}
        </>
      )}
    </section>
  )
}
