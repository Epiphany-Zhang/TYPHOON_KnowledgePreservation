/**
 * Footer.tsx
 * 站点页脚：品牌、模块入口与版权信息。
 * 本次更新：移除“联系”入口与所有指向 "#/contact" 的跳转。
 */

import React from 'react'
import BrandLogo from './BrandLogo'

/**
 * Footer
 * 简洁现代的页脚组件，不包含“联系”相关链接。
 */
export default function Footer() {
  const links: Array<{ label: string; href: string }> = [
    { label: '首页', href: '#/' },
    { label: '理论知识', href: '#/theory' },
    { label: '图形动画', href: '#/animation' },
    { label: '安全防范', href: '#/safety' },
    { label: '互动测试', href: '#/quiz' },
    // 注意：不包含“联系”，且不添加 "#/sources" 等未在路由中声明的路径
  ]

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* 顶部：品牌与简介 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo className="h-5 w-5" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              驭风知险
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            海洋科技 · 防灾科普。通过清晰的结构化内容与交互演示，帮助公众理解台风知识并提升应急意识。
          </p>
        </div>

        {/* 中部：导航链接（不包含“联系”） */}
        <nav className="mt-6 flex flex-wrap items-center gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                         text-slate-700 hover:text-slate-900 hover:bg-blue-50
                         dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition"
              aria-label={l.label}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* 底部：版权与说明 */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} 驭风知险 · 用于科普教学和非商业传播
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            数据与图像以权威机构实时信息为准
          </p>
        </div>
      </div>
    </footer>
  )
}
