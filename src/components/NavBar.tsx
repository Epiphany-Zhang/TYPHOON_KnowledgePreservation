/**
 * NavBar.tsx
 * 站点顶部导航栏（品牌区 + 主导航 + 主题切换 + 移动端菜单）。
 * 本次更新：交换“互动测试(quiz)”与“安全防范(safety)”的显示顺序。
 * - 使用数据驱动的导航数组，便于后续维护与扩展。
 * - 桌面端显示整排菜单；移动端折叠菜单。
 */

import React, { useState } from 'react'
import { Waves, BookOpenText, CirclePlay, ShieldCheck, SquareCheckBig, Menu } from 'lucide-react'
import BrandLogo from './BrandLogo'
import ThemeToggle from './ThemeToggle'

/** 单个导航项的结构 */
interface NavItem {
  /** 文本标签 */
  label: string
  /** 哈希路由地址 */
  href: string
  /** 图标组件 */
  icon: React.ComponentType<{ className?: string }>
}

/**
 * 顶部导航组件
 * - 使用哈希锚点与 react-router 的 HashRouter 兼容
 * - 仅调整顺序，不改动路由或页面结构
 */
export default function NavBar() {
  const [open, setOpen] = useState(false)

  // 导航顺序：Home → Theory → Animation → Safety → Quiz
  const navItems: NavItem[] = [
    { label: '首页', href: '#/', icon: Waves },
    { label: '理论知识', href: '#/theory', icon: BookOpenText },
    { label: '图形动画', href: '#/animation', icon: CirclePlay },
    // 已按要求将“安全防范”放在“互动测试”之前
    { label: '安全防范', href: '#/safety', icon: ShieldCheck },
    { label: '互动测试', href: '#/quiz', icon: SquareCheckBig },
  ]

  /** 渲染一个导航链接（桌面与移动共用） */
  const renderLink = (item: NavItem) => {
    const Icon = item.icon
    return (
      <a
        key={item.href}
        href={item.href}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                   text-slate-700 hover:text-slate-900 hover:bg-blue-50
                   dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition"
      >
        <Icon className="h-4 w-4" aria-hidden />
        {item.label}
      </a>
    )
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* 品牌区 */}
        <a href="#/" className="flex items-center gap-2" aria-label="返回首页">
          <BrandLogo className="h-5 w-5" />
          <span className="font-bold tracking-wide text-slate-900 dark:text-slate-100">驭风知险</span>
        </a>

        {/* 桌面端主导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(renderLink)}
        </nav>

        {/* 右侧：主题切换（桌面可见） */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
        </div>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900"
          aria-label="打开主菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* 移动端抽屉式菜单 */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.href} onClick={() => setOpen(false)}>
                {renderLink(item)}
              </div>
            ))}
            <div className="pt-2">
              <ThemeToggle compact />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
