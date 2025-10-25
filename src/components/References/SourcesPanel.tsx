/**
 * SourcesPanel.tsx
 * A reusable, semantic aside panel showing "资料来源与致谢".
 * Matches the site's card aesthetics and supports light/dark themes.
 */

import { BookOpen, Info } from 'lucide-react'
import React from 'react'
import OptimizedImage from '../Image/OptimizedImage'
import typhoonWhatImg from '../../assets/image/台风是什么.png'
import typhoonForecastImg from '../../assets/image/台风预测.png'

/**
 * Figure card with image and caption text.
 */
function SourceFigure(props: { src: string; caption: string; alt?: string }) {
  const { src, caption, alt } = props
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <OptimizedImage 
        src={src} 
        alt={alt ?? 'source'} 
        className="object-cover w-full h-52 sm:h-56"
        quality="high"
        webp={true}
      />
      <figcaption className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">
        {caption}
      </figcaption>
    </figure>
  )
}

/**
 * SourcesPanel
 * The exact presentation of the "资料来源与致谢" block used across pages.
 */
export default function SourcesPanel() {
  return (
    <aside
      aria-label="资料来源与致谢"
      className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900"
    >
      {/* Title */}
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          资料来源与致谢
        </h2>
      </div>

      {/* Sources list */}
      <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200">
        <li>• 中国气象局 · 台风监测与预警公开信息</li>
        <li>• 中央气象台 · 台风路径与预警信号科普</li>
        <li>• NOAA/NHC · Hurricane Basics</li>
        <li>• WMO 世界气象组织 · Tropical Cyclone Guidelines</li>
      </ul>

      {/* Image pair */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SourceFigure
          src={typhoonWhatImg}
          alt="light building under blue sky"
          caption="本作品用于地学科普教学与公众传播，欢迎非商业使用与二次创作（请注明来源）。"
        />
        <SourceFigure
          src={typhoonForecastImg}
          alt="satellite view of icy water"
          caption="设计与开发：科普创作团队（前端/可视化/内容校对） · 版本 v1.0"
        />
      </div>

      {/* Note */}
      <p className="mt-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>注：图像为示意或公共素材，请以权威机构实时信息为准。</span>
      </p>
    </aside>
  )
}
