/**
 * KnowledgeAccordion.tsx
 * 分组式知识点折叠面板（使用站内 InteractiveCard 视觉风格）。
 * - 支持多项同时展开。
 * - 每组含标题与若干可折叠条目。
 */

import React from 'react'
import InteractiveCard, { CardAccent } from '../../components/Safety/InteractiveCard'
import {
  Wind,
  Waves,
  Eye,
  Radar,
  AlertTriangle,
  Info,
  LineChart
} from 'lucide-react'

/** 单条知识点条目 */
export interface KnowledgeItem {
  /** 简短标题 */
  title: string
  /** 摘要/概要（展开前可见，放在卡片正文顶部） */
  summary: string
  /** 详细内容（展开后显示） */
  details: React.ReactNode
  /** 图标（默认 Info） */
  icon?: React.ComponentType<{ className?: string }>
  /** 强调色 */
  accent?: CardAccent
}

/** 知识分组 */
export interface KnowledgeGroup {
  /** 组标题 */
  title: string
  /** 分组内条目 */
  items: KnowledgeItem[]
}

/** 根据语义建议的默认图标集合（可在数据中覆盖） */
export const KIcons = {
  wind: Wind,
  waves: Waves,
  eye: Eye,
  radar: Radar,
  alert: AlertTriangle,
  info: Info,
  chart: LineChart,
}

/**
 * KnowledgeAccordion
 * 渲染多个分组，每组下为若干可展开的 InteractiveCard。
 */
export default function KnowledgeAccordion(props: { groups: KnowledgeGroup[] }) {
  const { groups } = props
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <section
          key={g.title}
          aria-label={g.title}
          className="space-y-3 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {g.title}
          </h3>
          <div className="space-y-3">
            {g.items.map((item) => {
              const Icon = item.icon ?? KIcons.info
              return (
                <InteractiveCard
                  key={item.title}
                  title={item.title}
                  icon={Icon}
                  accent={item.accent ?? 'blue'}
                >
                  <p className="text-slate-700 dark:text-slate-300">
                    {item.summary}
                  </p>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {item.details}
                  </div>
                </InteractiveCard>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
