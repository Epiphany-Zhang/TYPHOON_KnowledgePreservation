/**
 * Hero.tsx
 * 首页顶级横幅（“驭风知险”）：沉稳蓝 + 科技灰配色，突出品牌与行动入口。
 * - 科技渐变主标题（蓝系），高对比按钮（主色蓝 / 次色科技灰）。
 * - 背景海洋/台风场景叠透明遮罩，强化可读性。
 */

import { Waves, Shield } from 'lucide-react'
import OptimizedImage from './Image/OptimizedImage'
import heroImage from '../assets/image/驭风知险.jpg'

/**
 * Hero
 * 首页主视觉横幅，提供进入“台风知识”和“应急防范”的快速操作。
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* 背景图片：海洋科技氛围 */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={heroImage}
          className="object-cover w-full h-full opacity-40 dark:opacity-35"
          quality="high"
          webp={true}
        />
        {/* 渐变遮罩增强可读性 */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-blue-900/20 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-18 md:py-24 text-center">
        {/* 顶部标签 */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur border border-slate-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 mb-5">
          海洋科技 · 防灾科普
        </div>

        {/* 大标题：科技感渐变字 */}
        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-wide">
          <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-slate-300 bg-clip-text text-transparent">
            驭风知险
          </span>
        </h1>

        {/* 小标题：台风主题说明 */}
        <p className="mt-3 md:mt-4 text-base md:text-lg text-slate-800 dark:text-slate-200 max-w-2xl mx-auto">
          台风的形成与防范指南
        </p>

        {/* 行动按钮：高对比主次按钮 */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#/theory"
            className="px-5 py-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition inline-flex items-center justify-center gap-2 shadow-sm"
          >
            <Waves className="h-4 w-4" />
            开始学习
          </a>
          <a
            href="#/safety"
            className="px-5 py-3 rounded-lg bg-white text-slate-900 border border-slate-300 hover:bg-slate-50
                       dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition inline-flex items-center justify-center gap-2"
          >
            <Shield className="h-4 w-4 text-amber-600" />
            应急防范
          </a>
        </div>
      </div>
    </section>
  )
}
