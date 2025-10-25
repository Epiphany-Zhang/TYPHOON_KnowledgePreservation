/**
 * Modal.tsx
 * 轻量受控 Modal 组件：
 * - 半透明遮罩，居中弹窗，圆角卡片；
 * - 点击遮罩/ESC 关闭，右上角关闭按钮；
 * - 打开时锁定页面滚动，关闭后恢复；
 * - 内容区域可滚动，适配移动端与桌面端。
 */

import React, { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

/** 支持的尺寸选项。 */
export type ModalSize = 'sm' | 'md' | 'lg'

/** Modal 组件属性。 */
export interface ModalProps {
  /** 是否打开弹窗（受控）。 */
  open: boolean
  /** 打开状态变更回调。 */
  onOpenChange: (next: boolean) => void
  /** 标题（用于 aria，可选）。 */
  title?: string
  /** 弹窗主体内容。 */
  children: React.ReactNode
  /** 弹窗尺寸。 */
  size?: ModalSize
}

/**
 * Modal
 * 受控模式的轻量弹窗组件，负责可访问性与交互细节。
 */
export default function Modal({ open, onOpenChange, title, children, size = 'md' }: ModalProps) {
  const labelId = useId()
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const lastActiveRef = useRef<Element | null>(null)

  // 锁定背景滚动 + 焦点管理
  useEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // 初始聚焦关闭按钮
      const t = setTimeout(() => closeBtnRef.current?.focus(), 0)
      return () => {
        clearTimeout(t)
        document.body.style.overflow = originalOverflow
        if (lastActiveRef.current instanceof HTMLElement) {
          lastActiveRef.current.focus()
        }
      }
    }
  }, [open])

  // ESC 关闭
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  // 尺寸映射
  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg md:max-w-xl',
    lg: 'max-w-2xl',
  }[size]

  if (!open) return null

  /** 点击遮罩关闭（阻止内部冒泡） */
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onOpenChange(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-labelledby={labelId}
      aria-modal="true"
      role="dialog"
      onMouseDown={handleBackdropClick}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* 弹窗主体 */}
      <div
        className={`relative z-[101] w-[92vw] ${sizeClass}
                    rounded-xl border border-slate-200/70 dark:border-slate-800
                    bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
                    shadow-xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-start justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 id={labelId} className="text-base font-semibold leading-6">
            {title}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="关闭弹窗"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md
                       border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-900
                       text-slate-600 dark:text-slate-300
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 可滚动内容区 */}
        <div className="p-4 max-h-[78vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
