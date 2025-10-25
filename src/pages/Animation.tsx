/**
 * Animation.tsx
 * Typhoon-themed interactive animation page.
 * - Layout: title → animation area + control panel → explanation + knowledge cards → interaction tips.
 * - Uses TyphoonCanvas for rendering; sliders update animation parameters in real time.
 * - Visual style: blue/gray tech palette with dark-mode support and strong contrast.
 */

import React, { useMemo, useState } from 'react'
import TyphoonCanvas from '../components/Typhoon/TyphoonCanvas'
import { RefreshCw, Wind, Route, RotateCw, Waves, CloudRain } from 'lucide-react'
import OptimizedImage from '../components/Image/OptimizedImage'
import typhoonWhatImg from '../assets/image/台风是什么.png'
import typhoonDestructiveImg from '../assets/image/台风的破坏力.png'
import typhoonForecastImg from '../assets/image/台风预测.png'

/** Parameter slider component with label and live value. */
function ParameterSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  suffix,
  id,
}: {
  label: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (v: number) => void
  suffix?: string
  id: string
}) {
  return (
    <label htmlFor={id} className="grid gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-800 dark:text-slate-100">{label}</span>
        <span className="tabular-nums text-slate-600 dark:text-slate-300">
          {value.toFixed(step < 1 ? (String(step).split('.')[1]?.length ?? 0) : 0)}
          {suffix ? ` ${suffix}` : ''}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-600"
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{min}{suffix ? ` ${suffix}` : ''}</span>
        <span>{max}{suffix ? ` ${suffix}` : ''}</span>
      </div>
    </label>
  )
}

/** Simple knowledge card item. */
function KnowledgeCard({
  title,
  desc,
  img,
}: {
  title: string
  desc: string
  img: string
}) {
  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="aspect-[16/9] w-full overflow-hidden">
        <OptimizedImage 
          src={img} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          quality="high"
          webp={true}
        />
      </div>
      <div className="p-4">
        <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
      </div>
    </div>
  )
}

/**
 * AnimationPage
 * Hosts the interactive typhoon animation with parameter sliders and learning sections.
 */
export default function AnimationPage() {
  // Defaults tuned for a calm, visible cyclone
  const defaults = useMemo(
    () => ({
      spin: 1.0, // rad/s
      travel: 80, // px/s
      wind: 0.9, // 0..1.6
      pathAmp: 60, // px
      bands: 5, // rain band count
    }),
    []
  )

  const [spin, setSpin] = useState(defaults.spin)
  const [travel, setTravel] = useState(defaults.travel)
  const [wind, setWind] = useState(defaults.wind)
  const [pathAmp, setPathAmp] = useState(defaults.pathAmp)
  const [bands, setBands] = useState(defaults.bands)

  const reset = () => {
    setSpin(defaults.spin)
    setTravel(defaults.travel)
    setWind(defaults.wind)
    setPathAmp(defaults.pathAmp)
    setBands(defaults.bands)
  }

  const rpm = (spin / (2 * Math.PI)) * 60
  
  // Knowledge cards content
  const cards = [
    {
      title: '台风是什么？',
      desc: '台风是形成于西北太平洋和南海的热带气旋，拥有清晰的台风眼与螺旋雨带。',
      img: typhoonWhatImg,
    },
    {
      title: '台风的破坏力',
      desc: '强风、暴雨与风暴潮共同作用，可能引发风倒、内涝与海岸侵蚀等灾害。',
      img: typhoonDestructiveImg,
    },
    {
      title: '台风与天气预报',
      desc: '数值模式与卫星雷达数据用于路径与强度预报，形成"预报锥"。',
      img: typhoonForecastImg,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-sky-700 to-slate-700 text-white p-6">
        <div className="inline-flex items-center gap-2 rounded-md bg-white/15 px-2.5 py-1 text-xs">
          台风动画演示
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold">Typhoon Animation</h1>
        <p className="mt-2 text-white/90">
          通过右侧滑块实时调整台风的旋转、行进与强度参数，观察动画如何响应变化。
        </p>
      </header>

      {/* Main: animation + controls */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Animation surface */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            {/* Keep a reasonable canvas height; responsive on large screens */}
            <div className="h-[320px] md:h-[420px] lg:h-[520px]">
              <TyphoonCanvas
                spin={spin}
                travel={travel}
                wind={wind}
                pathAmp={pathAmp}
                bands={bands}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <aside className="lg:col-span-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">参数调节</h2>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                aria-label="重置参数"
                title="重置参数"
              >
                <RefreshCw className="h-4 w-4" />
                重置
              </button>
            </div>

            <ParameterSlider
              id="spin"
              label="旋转速度"
              min={0}
              max={6}
              step={0.05}
              value={spin}
              onChange={setSpin}
              suffix="rad/s"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
              当前约 {(rpm).toFixed(1)} rpm
            </div>

            <ParameterSlider
              id="travel"
              label="前进速度"
              min={0}
              max={180}
              step={1}
              value={travel}
              onChange={setTravel}
              suffix="px/s"
            />

            <ParameterSlider
              id="wind"
              label="风速/强度"
              min={0}
              max={1.6}
              step={0.05}
              value={wind}
              onChange={setWind}
            />

            <ParameterSlider
              id="pathAmp"
              label="路径弯曲幅度"
              min={0}
              max={140}
              step={1}
              value={pathAmp}
              onChange={setPathAmp}
              suffix="px"
            />

            <ParameterSlider
              id="bands"
              label="雨带条数"
              min={2}
              max={8}
              step={1}
              value={bands}
              onChange={(v) => setBands(Math.round(v))}
            />

            {/* Legend */}
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="inline-flex items-center gap-2"><RotateCw className="h-4 w-4 text-sky-600" /> 旋转更快 → 云带更密</div>
              <div className="inline-flex items-center gap-2"><Route className="h-4 w-4 text-sky-600" /> 弯曲更大 → 路径更“摆动”</div>
              <div className="inline-flex items-center gap-2"><Wind className="h-4 w-4 text-sky-600" /> 强度更大 → 颜色更实线更粗</div>
              <div className="inline-flex items-center gap-2"><Waves className="h-4 w-4 text-sky-600" /> 前进更快 → 轨迹延伸更快</div>
            </div>
          </div>
        </aside>
      </section>

      {/* Explanation */}
      <section className="grid gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">台风结构与运动（简述）</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            台风是暖海面上发展的热带气旋，中心附近存在风弱且相对晴朗的“台风眼”，其周围的“眼墙”区域风雨最强；外侧伴随多条呈对数螺旋的雨带。动画中的旋转云团与雨带形态参考了这一结构。台风受副热带高压、槽线与低层引导气流影响沿路径移动，因此我们用“路径弯曲幅度”和“前进速度”模拟其大尺度引导与摆动。
          </p>
        </div>

        {/* Knowledge cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <KnowledgeCard key={c.title} title={c.title} desc={c.desc} img={c.img} />
          ))}
        </div>
      </section>

      {/* Bottom tips */}
      <footer className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">交互说明</h4>
        <ul className="mt-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5 space-y-1">
          <li>拖动“旋转速度”滑块可改变云团转速；转速越大，雨带越紧密。</li>
          <li>“前进速度”控制台风沿画布移动的快慢，轨迹线将随之延长。</li>
          <li>“风速/强度”影响云带的粗细与透明度，数值越大越强烈。</li>
          <li>“路径弯曲幅度”越大，台风路线摆动越明显。</li>
          <li>“雨带条数”改变可见的螺旋雨带数量，用于观察结构差异。</li>
        </ul>
      </footer>
    </div>
  )
}
