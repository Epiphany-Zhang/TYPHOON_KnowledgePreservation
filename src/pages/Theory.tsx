/**
 * Theory.tsx
 * 升级版“理论知识”页面：
 * - 顶部：台风眼结构示意模块（交互式 SVG + 说明卡片）。
 * - 中部：知识点折叠面板（分组、可展开/折叠）。
 * - 右侧/下方：知识结构可视化（可缩放、节点高亮、信息卡）。
 * - 响应式布局：lg 起两列并列，小屏纵向堆叠；底部留足安全间距防遮挡。
 */

import { useState } from 'react'
import EyeDiagram, { type EyePart } from '../components/Theory/EyeDiagram'
import EyeInfo from '../components/Theory/EyeInfo'

import KnowledgeAccordion, {
  KnowledgeGroup,
  KIcons,
} from '../components/Theory/KnowledgeAccordion'
import KnowledgeGraph, {
  KGEdge,
  KGNode,
} from '../components/Theory/KnowledgeGraph'

/** 页面主体 */
export default function TheoryPage() {
  // 台风眼示意交互状态（与说明联动）
  const [activePart, setActivePart] = useState<EyePart>(null)

  // 1) 折叠面板数据
  const groups: KnowledgeGroup[] = [
    {
      title: '生成与环境',
      items: [
        {
          title: '生成条件',
          summary: '海温≥26.5°C（50m 深以内）、充足水汽与扰动触发；弱垂直风切有利发展。',
          details: (
            <ul className="list-disc pl-5 space-y-1">
              <li>暖海面提供潜热，促使对流持续上升。</li>
              <li>低层辐合 + 高层辐散维持气旋结构。</li>
              <li>相对湿度较高、干冷空气侵入受限。</li>
            </ul>
          ),
          icon: KIcons.wind,
          accent: 'blue',
        },
        {
          title: '纬度与地转作用',
          summary: '距赤道约 ≥5° 更易受科里奥利力影响，形成旋转。',
          details: <p>过近赤道则偏向力不足，不利于闭合环流建立。</p>,
          icon: KIcons.chart,
        },
        {
          title: '垂直风切变',
          summary: '风切过大易破坏中低层对齐的暖心结构，导致减弱或倾斜。',
          details: <p>理想环境为小到中等风切（约 5–10 m/s），利于对流围绕中心组织。</p>,
          icon: KIcons.info,
        },
      ],
    },
    {
      title: '结构与演变',
      items: [
        {
          title: '台风眼与眼墙',
          summary: '中心台风眼低压、相对晴朗；周围眼墙对流最旺、风雨最强。',
          details: (
            <ul className="list-disc pl-5 space-y-1">
              <li>眼墙置换期间强度可剧烈波动。</li>
              <li>双眼墙结构常见于强台风阶段。</li>
            </ul>
          ),
          icon: KIcons.eye,
          accent: 'blue',
        },
        {
          title: '螺旋雨带',
          summary: '呈弧形/螺旋状对流带，输送水汽与角动量，影响范围广。',
          details: <p>外雨带与地形、季风相互作用，可在远离中心处造成强降雨。</p>,
          icon: KIcons.waves,
        },
        {
          title: '强度变化因素',
          summary: '海温、海气通量、风切、干空气侵入、海洋冷却与上岸摩擦等共同影响。',
          details: <p>快速增强往往与高海洋热含量、良好外流通道有关；登陆/冷水导致减弱。</p>,
          icon: KIcons.chart,
        },
      ],
    },
    {
      title: '影响与灾害',
      items: [
        {
          title: '风暴潮与增水',
          summary: '气压降低与强风推送抬升海面，近岸叠加天文潮可致严重淹没。',
          details: <p>低洼海岸、河口与湾区风险更高，需结合潮位预报制定防御。</p>,
          icon: KIcons.waves,
          accent: 'amber',
        },
        {
          title: '强风与降雨',
          summary: '大风破坏建筑与设施，暴雨引发内涝、山洪与滑坡。',
          details: <p>短时强降雨与地形抬升叠加时需特别关注中小河流洪水。</p>,
          icon: KIcons.alert,
          accent: 'amber',
        },
      ],
    },
    {
      title: '监测与预警',
      items: [
        {
          title: '观测手段',
          summary: '卫星云图、海面浮标、散射计与多普勒雷达综合监测。',
          details: <p>资料同化进入数值模式，支持路径与强度分析。</p>,
          icon: KIcons.radar,
          accent: 'green',
        },
        {
          title: '预警与路径',
          summary: '关注权威机构发布的预警等级、概率圈与引导气流（副高等）。',
          details: <p>不确定性通过集合预报给出；公众应基于最新预警调整计划。</p>,
          icon: KIcons.info,
          accent: 'green',
        },
      ],
    },
  ]

  // 2) 知识结构图数据
  const nodes: KGNode[] = [
    { id: 'gen', label: '生成条件', level: 0, info: '暖海面 + 水汽 + 扰动 + 低风切。' },
    { id: 'lat', label: '纬度要求', level: 1, info: '≥5° 的科里奥利力利于旋转建立。' },
    { id: 'shear', label: '风切变', level: 1, info: '小到中等风切利于组织。' },
    { id: 'struct', label: '结构', level: 2, info: '台风眼、眼墙、螺旋雨带。' },
    { id: 'eye', label: '台风眼', level: 3, info: '低压、下沉、相对晴朗。' },
    { id: 'wall', label: '眼墙', level: 3, info: '最强风雨，常发生置换。' },
    { id: 'bands', label: '雨带', level: 3, info: '弧状/螺旋状对流带。' },
    { id: 'impact', label: '影响', level: 2, info: '风、雨、风暴潮与地质灾害。' },
    { id: 'stormsurge', label: '风暴潮', level: 3, info: '近岸叠加天文潮增风险。' },
    { id: 'precip', label: '强降雨', level: 3, info: '致内涝与山洪。' },
    { id: 'monitor', label: '监测', level: 2, info: '卫星/雷达/浮标等观测。' },
    { id: 'warn', label: '预警', level: 3, info: '路径/强度预报与等级信号。' },
  ]

  const edges: KGEdge[] = [
    { from: 'gen', to: 'lat' },
    { from: 'gen', to: 'shear' },
    { from: 'gen', to: 'struct' },
    { from: 'struct', to: 'eye' },
    { from: 'struct', to: 'wall' },
    { from: 'struct', to: 'bands' },
    { from: 'gen', to: 'impact' },
    { from: 'impact', to: 'stormsurge' },
    { from: 'impact', to: 'precip' },
    { from: 'gen', to: 'monitor' },
    { from: 'monitor', to: 'warn' },
  ]

  // 简短事实卡片
  const facts = [
    { k: '生成条件', v: '海温≥26.5°C · 水汽充足 · 低风切' },
    { k: '结构', v: '台风眼 / 眼墙 / 螺旋雨带' },
    { k: '主要影响', v: '强风 · 暴雨 · 风暴潮' },
    { k: '预警关注', v: '官方路径与等级信号' },
  ]

  return (
    <div className="container mx-auto px-4 pt-10 pb-24 md:pb-28 space-y-8">
      {/* 顶部概览 */}
      <header className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          理论知识
        </h1>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          通过可折叠面板与知识结构图快速了解台风形成、结构与影响
        </p>
      </header>

      {/* 替换后的：台风眼结构示意模块 */}
      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100">
          台风眼结构示意图
        </h2>

        <div className="grid gap-6 lg:grid-cols-2 items-stretch">
          {/* SVG 示意图 */}
          <EyeDiagram active={activePart} onActiveChange={setActivePart} />

          {/* 说明卡片（大屏并排，小屏下方） */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
              结构说明
            </h3>
            <EyeInfo active={activePart} onActiveChange={setActivePart} />
          </div>
        </div>
      </section>

      {/* 核心交互区：左折叠/右知识图 */}
      <section className="grid gap-6 lg:grid-cols-2 items-start">
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              知识点折叠面板
            </h2>
            <KnowledgeAccordion groups={groups} />
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              知识结构可视化
            </h2>
            <KnowledgeGraph nodes={nodes} edges={edges} />
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              提示：点击任意节点查看说明，使用右上角按钮缩放/复位。
            </p>
          </div>
        </div>
      </section>

      {/* 简要知识卡片（视觉分组，便于扫读） */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">关键知识点</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div
              key={f.k}
              className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20"
            >
              <div className="text-xs text-blue-700 dark:text-blue-300">{f.k}</div>
              <div className="font-medium text-slate-900 dark:text-slate-100">{f.v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}