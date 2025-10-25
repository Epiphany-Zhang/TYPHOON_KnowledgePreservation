/**
 * KnowledgeGraph.tsx
 * 简洁的 SVG 知识结构/树图，可点击节点高亮并弹出信息卡。
 * - 自适应容器尺寸（ResizeObserver）。
 * - 缩放控制（± / 复位），平滑过渡。
 * - 节点/连线颜色与全站蓝灰风格一致，支持暗色模式。
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react'

/** 图节点 */
export interface KGNode {
  id: string
  label: string
  /** 层级（从 0 开始，纵向排列） */
  level: number
  /** 说明文本（弹窗显示） */
  info?: string
}

/** 图连线（无向/有向均可） */
export interface KGEdge {
  from: string
  to: string
}

/**
 * 计算布局：按 level 分行，行内等距分布。
 * @returns Map<NodeId, {x,y}>
 */
function layoutNodes(
  nodes: KGNode[],
  width: number,
  height: number,
  padding = 24
) {
  const levels = Array.from(new Set(nodes.map((n) => n.level))).sort((a, b) => a - b)
  const levelMap = new Map<number, KGNode[]>()
  levels.forEach((lv) => levelMap.set(lv, nodes.filter((n) => n.level === lv)))

  const innerW = Math.max(200, width - padding * 2)
  const innerH = Math.max(160, height - padding * 2)
  const stepY = levels.length > 1 ? innerH / (levels.length - 1) : 0

  const pos = new Map<string, { x: number; y: number }>()
  levels.forEach((lv, i) => {
    const row = levelMap.get(lv) || []
    const stepX = row.length > 0 ? innerW / (row.length + 1) : innerW
    row.forEach((node, j) => {
      const x = padding + stepX * (j + 1)
      const y = padding + stepY * i
      pos.set(node.id, { x, y })
    })
  })
  return pos
}

/**
 * 监听元素尺寸
 */
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 600, height: 360 })
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ob = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setSize({ width: r.width, height: r.height })
    })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])
  return { ref, size }
}

/**
 * KnowledgeGraph
 * 渲染交互式知识树图。
 */
export default function KnowledgeGraph(props: {
  nodes: KGNode[]
  edges: KGEdge[]
  /** 节点半径（px） */
  r?: number
}) {
  const { nodes, edges, r = 18 } = props
  const { ref, size } = useElementSize<HTMLDivElement>()
  const [scale, setScale] = useState(1)
  const [active, setActive] = useState<string | null>(null)

  const positions = useMemo(
    () => layoutNodes(nodes, size.width, size.height, 24),
    [nodes, size]
  )

  const activeNode = useMemo(
    () => nodes.find((n) => n.id === active) || null,
    [active, nodes]
  )

  /** 控件：缩放 */
  const zoom = (delta: number) =>
    setScale((s) => Math.min(1.6, Math.max(0.8, +(s + delta).toFixed(2))))
  const reset = () => setScale(1)

  return (
    <div
      ref={ref}
      className="relative w-full h-[420px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* 缩放控件 */}
      <div className="absolute right-3 top-3 z-10 flex gap-1">
        <button
          type="button"
          onClick={() => zoom(0.1)}
          aria-label="放大"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => zoom(-0.1)}
          aria-label="缩小"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="复位"
          className="inline-flex h-8 px-2 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* SVG 画布 */}
      <svg width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
        <g transform={`scale(${scale})`}>
          {/* 连线 */}
          {edges.map((e, idx) => {
            const a = positions.get(e.from)
            const b = positions.get(e.to)
            if (!a || !b) return null
            const isActive = active && (e.from === active || e.to === active)
            return (
              <line
                key={idx}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isActive ? '#2563eb' : 'rgba(100,116,139,0.6)'}
                strokeWidth={isActive ? 3 : 2}
              />
            )
          })}

          {/* 节点 */}
          {nodes.map((n) => {
            const p = positions.get(n.id)
            if (!p) return null
            const isActive = active === n.id
            return (
              <g
                key={n.id}
                onClick={() => setActive(n.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill={isActive ? '#DBEAFE' : '#EFF6FF'}
                  stroke={isActive ? '#2563eb' : '#60A5FA'}
                  strokeWidth={isActive ? 3 : 2}
                />
                <text
                  x={p.x}
                  y={p.y + r + 16}
                  textAnchor="middle"
                  className="select-none"
                  fontSize={12}
                  fill="#0f172a"
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* 节点信息卡（绝对定位，跟随缩放） */}
      {activeNode ? (
        <div
          className="absolute z-10 w-64 rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-md dark:border-slate-700 dark:bg-slate-900"
          /* 修复：style 需传入对象，而非 IIFE */
          style={{
            left: (positions.get(activeNode.id)?.x ?? 0) * scale + 12,
            top: (positions.get(activeNode.id)?.y ?? 0) * scale + 12,
          }}
          role="dialog"
          aria-label={activeNode.label}
        >
          <div className="font-medium text-slate-900 dark:text-slate-100">
            {activeNode.label}
          </div>
          <p className="mt-1 text-slate-700 dark:text-slate-300">
            {activeNode.info || '点击其他节点以查看关联说明。'}
          </p>
        </div>
      ) : null}
    </div>
  )
}
