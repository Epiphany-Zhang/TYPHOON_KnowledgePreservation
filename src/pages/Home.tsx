/**
 * Home.tsx
 * “驭风知险”首页：主视觉 + 入口卡片（台风知识 / 动态演示 / 应急防范）+ 温馨提示。
 * 调色：沉稳蓝 + 科技灰为主，风险相关使用 amber 点缀。
 * - 移除“联系我们”入口。
 */

import Hero from '../components/Hero'
import { BookOpenText, PlayCircle, ShieldCheck } from 'lucide-react'
import typhoonKnowledgeImg from '../assets/image/台风知识.png'
import dynamicDemoImg from '../assets/image/动态演示.png'
import emergencyPreventionImg from '../assets/image/应急防范.png'

/**
 * HomePage
 * 提供清晰入口以便用户快速进入各模块。
 */
export default function HomePage() {
  const entries = [
    {
      title: '台风知识',
      desc: '形成条件、结构与等级，快速入门',
      icon: BookOpenText,
      href: '#/theory',
      img: typhoonKnowledgeImg,
    },
    {
      title: '动态演示',
      desc: '风场/浪场示意，观察海面变化趋势',
      icon: PlayCircle,
      href: '#/animation',
      img: dynamicDemoImg,
    },
    {
      title: '应急防范',
      desc: '来临前后准备要点、避险原则与清单',
      icon: ShieldCheck,
      href: '#/safety',
      img: emergencyPreventionImg,
    }
  ]

  return (
    <div>
      <Hero />

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          模块导航
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          从基础认知到防灾实践，系统掌握台风相关知识。
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => {
            const Icon = e.icon
            return (
              <a
                key={e.href}
                href={e.href}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md bg-white dark:bg-slate-900 transition"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={e.img}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{e.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{e.desc}</p>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="rounded-2xl bg-gradient-to-r from-blue-800 to-slate-700 text-white p-6 md:p-10">
          <h3 className="text-xl md:text-2xl font-bold">出行与安全提示</h3>
          <p className="mt-2 text-white/95">
            关注权威预警，远离海边与低洼地带。台风来临时避免户外活动，远离广告牌、老旧树木与临时搭建物。
          </p>
        </div>
      </section>
    </div>
  )
}
