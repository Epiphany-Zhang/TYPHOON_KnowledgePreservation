/**
 * EyeInfo.tsx
 * Compact legend/description cards for EyeDiagram.
 * - Highlights a card when active
 * - Emits hover/focus events back to parent to sync with diagram
 */

import React from 'react'
import type { EyePart } from './EyeDiagram'
import styles from './EyeDiagram.module.css'

/** Data for a legend block */
interface LegendItem {
  key: EyePart
  title: string
  points: string[]
  accent: 'blue' | 'indigo' | 'slate'
}

/** Props for EyeInfo legend block list */
export default function EyeInfo({
  active,
  onActiveChange,
}: {
  active: EyePart
  onActiveChange: (p: EyePart) => void
}) {
  const items: LegendItem[] = [
    {
      key: 'eye',
      title: '台风眼',
      points: [
        '中心低压、下沉气流，天气相对平静',
        '能见度较好，环周被眼墙包围',
      ],
      accent: 'blue',
    },
    {
      key: 'wall',
      title: '台风眼墙',
      points: [
        '对流最旺盛区域，风雨最强',
        '眼墙置换时强度波动显著',
      ],
      accent: 'indigo',
    },
    {
      key: 'bands',
      title: '螺旋雨带',
      points: [
        '呈弧形/螺旋状向外延伸，输送水汽与角动量',
        '可在远离中心处造成强降雨',
      ],
      accent: 'slate',
    },
  ]

  const accentClasses: Record<LegendItem['accent'], string> = {
    blue: 'border-blue-300 bg-blue-50 dark:border-blue-800/60 dark:bg-blue-900/10',
    indigo: 'border-indigo-300 bg-indigo-50 dark:border-indigo-800/60 dark:bg-indigo-900/10',
    slate: 'border-slate-300 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-900/10',
  }

  return (
    <div className="grid gap-3">
      {items.map((it) => {
        const isActive = active === it.key
        return (
          <article
            key={it.title}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onMouseEnter={() => onActiveChange(it.key)}
            onFocus={() => onActiveChange(it.key)}
            onMouseLeave={() => onActiveChange(null)}
            onBlur={() => onActiveChange(null)}
            className={[
              'rounded-xl border p-4',
              'text-slate-800 dark:text-slate-200',
              accentClasses[it.accent],
              styles.legendCard,
              isActive ? styles.legendCardActive : '',
            ].join(' ')}
          >
            <h4 className="font-semibold mb-1">{it.title}</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {it.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        )
      })}
    </div>
  )
}