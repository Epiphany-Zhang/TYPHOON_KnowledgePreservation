/**
 * InteractiveCard.tsx
 * 交互式小卡片：展示标题，点击后展开显示详细内容。
 * - 支持键盘操作与无障碍属性（aria-expanded/aria-controls）。
 * - 不同 accent（'amber' | 'blue' | 'green'）对应不同安全/风险配色。
 */

import React, { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

/** 卡片强调风格类型（风险=amber；安全/行动=blue/green）。 */
export type CardAccent = 'amber' | 'blue' | 'green'

/** InteractiveCard 组件属性 */
export interface InteractiveCardProps {
  /** 卡片标题（始终可见）。 */
  title: string
  /** 详情内容（点击后展开）。 */
  children: React.ReactNode
  /** 图标组件（可选）。 */
  icon?: React.ComponentType<{ className?: string }>
  /** 视觉强调风格。 */
  accent?: CardAccent
  /** 默认是否展开。 */
  defaultOpen?: boolean
}

/**
 * InteractiveCard
 * 小卡片容器，点击卡片头部切换展开区域的可见性。
 */
export default function InteractiveCard({
  title,
  children,
  icon: Icon,
  accent = 'blue',
  defaultOpen = false,
}: InteractiveCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  const palette = {
    amber: {
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400',
      ring: 'focus-visible:ring-amber-400/40',
    },
    blue: {
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      ring: 'focus-visible:ring-blue-400/40',
    },
    green: {
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
      ring: 'focus-visible:ring-emerald-400/40',
    },
  }[accent]

  return (
    <article
      className={`rounded-xl border ${palette.border} bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-md`}
    >
      <button
        type="button"
        className={`w-full text-left p-4 outline-none focus-visible:ring-2 ${palette.ring} rounded-xl`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {Icon ? (
              <span
                className={`shrink-0 inline-flex items-center justify-center rounded-lg px-2.5 py-2 ${palette.badge}`}
                aria-hidden
              >
                <Icon className={`h-5 w-5 ${palette.icon}`} />
              </span>
            ) : null}
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">
              {title}
            </h3>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-500 dark:text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </div>
      </button>

      <div
        id={panelId}
        role="region"
        hidden={!open}
        className="px-4 pb-4 pt-0 text-sm text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-top-1"
      >
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
          {children}
        </div>
      </div>
    </article>
  )
}
