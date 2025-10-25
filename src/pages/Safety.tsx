/**
 * Safety.tsx
 * 应急防范模块（Modal 版）：
 * - 点击卡片后以 Modal 展示详细内容/插图；
 * - 响应式布局，延续沉稳蓝 + 科技灰 + 风险 amber 的配色体系；
 * - 顶部横幅与旁侧卡片（图片区）高度调优，在中大屏保持协调尺寸。
 * 本次更新：
 * - 为“风险隐患”“防范措施”的所有要点均补充 image 字段，确保弹窗内必有配图。
 */

import React, { useMemo, useState } from 'react'
import { AlertTriangle, LifeBuoy, ShieldCheck, Phone } from 'lucide-react'
import Modal from '../components/Modal'
import OptimizedImage from '../components/Image/OptimizedImage'
import coastalImg from '../assets/image/海边与低洼地带.png'
import debrisImg from '../assets/image/高空坠物与玻璃破损.png'
import floodingImg from '../assets/image/城市内涝与山洪.png'
import powerOutageImg from '../assets/image/断电与通信中断.png'
import reinforcementImg from '../assets/image/加固检查.png'
import suppliesImg from '../assets/image/应急物资.png'
import travelAdjustmentImg from '../assets/image/行程调整.png'
import infoImg from '../assets/image/信息获取.png'
import emergencyContactImg from '../assets/image/紧急联络.png'
import safetyPointsImg from '../assets/image/避险要点.png'
import preventionImg from '../assets/image/防范.png'

/** 单条要点的数据结构（弹窗显示详细信息） */
interface SafetyPoint {
  /** 标题（卡片标题 + Modal 标题） */
  title: string
  /** 详细说明（Modal 展示） */
  desc: string
  /** 图标（卡片徽标） */
  icon: React.ComponentType<{ className?: string }>
  /** 视觉强调：风险=amber；建议=blue/green（视语义选择） */
  accent?: 'amber' | 'blue' | 'green'
  /** 在 Modal 中展示的大图 URL（现已对所有条目提供） */
  image: string
}

/** 单条要点卡片（按钮语义，点击打开 Modal） */
function PointCard({ point, onOpen }: { point: SafetyPoint; onOpen: (p: SafetyPoint) => void }) {
  const Icon = point.icon
  const isAmber = point.accent === 'amber'
  const badgeWrap =
    isAmber
      ? 'border-amber-200/80 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
      : point.accent === 'green'
        ? 'border-emerald-200/80 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
        : 'border-blue-200/80 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
  const badgeIcon =
    isAmber
      ? 'text-amber-600 dark:text-amber-400'
      : point.accent === 'green'
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-blue-600 dark:text-blue-400'

  return (
    <button
      type="button"
      onClick={() => onOpen(point)}
      className="group w-full text-left rounded-xl border border-slate-200 dark:border-slate-800
                 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
      aria-label={`查看 ${point.title} 详情`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 rounded-lg border ${badgeWrap} p-2`} aria-hidden>
          <Icon className={`h-5 w-5 ${badgeIcon}`} />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">{point.title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            点击查看详情
          </p>
        </div>
      </div>
    </button>
  )
}

/** 分组容器：标题 + 网格卡片 */
function PointSection({ title, points, onOpen }: { title: string; points: SafetyPoint[]; onOpen: (p: SafetyPoint) => void }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p) => (
          <PointCard key={p.title} point={p} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}

/** SafetyPage：点击卡片后以 Modal 展示详情（所有条目均带图） */
export default function SafetyPage() {
  const hazards: SafetyPoint[] = useMemo(() => [
    {
      title: '海边与低洼地带',
      desc:
        '风暴增水与巨浪在近岸叠加，低洼地势更易积水回流。请远离海滩、礁石与河口，勿在警戒区停留或拍照围观。如需撤离，请选择高处与坚固建筑并保持通讯畅通。',
      icon: AlertTriangle,
      accent: 'amber',
      image: coastalImg,
    },
    {
      title: '高空坠物与玻璃破损',
      desc:
        '强风可能掀起广告牌与脚手架；阳台花盆、门窗玻璃在冲击下易破裂。尽量避开临街高层建筑外侧，关闭与加固门窗，远离陈旧树木、临时搭建物与松动物件。',
      icon: AlertTriangle,
      accent: 'amber',
      image: debrisImg,
    },
    {
      title: '城市内涝与山洪',
      desc:
        '短时强降雨可致道路积水、隧道与地下空间进水。途经低洼路段时请绕行，切勿涉水通行。山区需警惕山洪与滑坡迹象（浑浊激增、水位急涨、异响），及时转移。',
      icon: AlertTriangle,
      accent: 'amber',
      image: floodingImg,
    },
    {
      title: '断电与通信中断',
      desc:
        '极端天气可能影响电力与通信服务。提前准备照明设备、移动电源与离线联络方式；必要时与家人约定集合地点与联络周期，避免因信号不稳造成焦虑与误判。',
      icon: AlertTriangle,
      accent: 'amber',
      image: powerOutageImg,
    },
  ], [])

  const measures: SafetyPoint[] = useMemo(() => [
    {
      title: '加固检查',
      desc:
        '提前加固门窗，清理阳台/楼顶杂物；车辆停放远离树木与广告牌。社区物业巡检公共区域，排查隐患，确保排水通畅。',
      icon: ShieldCheck,
      accent: 'blue',
      image: reinforcementImg,
    },
    {
      title: '应急物资',
      desc:
        '准备饮用水、干粮、常用药品、手电、移动电源、雨具与必要证件；考虑宠物安置与特殊人群（老人、婴幼儿、慢病患者）所需物资。',
      icon: LifeBuoy,
      accent: 'blue',
      image: suppliesImg,
    },
    {
      title: '行程调整',
      desc:
        '根据预警动态调整出行、上班上学与户外活动安排；尽量避免高峰与涉水路段，必要时居家避险，在单位/学校按指引就地安全留置。',
      icon: ShieldCheck,
      accent: 'blue',
      image: travelAdjustmentImg,
    },
    {
      title: '信息获取',
      desc:
        '通过官方渠道获取路径、风雨强度与预警等级信息；关注社区/物业通知，避免传播与相信未经证实消息。',
      icon: ShieldCheck,
      accent: 'green',
      image: infoImg,
    },
    {
      title: '紧急联络',
      desc:
        '保存应急电话与社区联系人；如遇险，先确保自身安全，再拨打求助电话并说明位置与环境状况，保持通话简洁清晰。',
      icon: Phone,
      accent: 'blue',
      image: emergencyContactImg,
    },
    {
      title: '避险要点',
      desc:
        '远离临时搭建物、玻璃幕墙与变压设施等风险点；如需转移，遵循指引有序撤离，切勿跨越警戒线或单独行动。',
      icon: LifeBuoy,
      accent: 'green',
      image: safetyPointsImg,
    },
  ], [])

  // Modal 控制与选中项
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<SafetyPoint | null>(null)

  /** 打开指定要点详情 */
  const openPoint = (p: SafetyPoint) => {
    setActive(p)
    setOpen(true)
  }

  /** 关闭弹窗 */
  const close = (next: boolean) => {
    setOpen(next)
    if (!next) setActive(null)
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* 顶部导语：蓝灰渐变 + 台风示意图（高度调优） */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-800 to-slate-700 text-white">
        {/* 固定可预期高度，让左右区域在中/大屏等高，移动端自然自适应 */}
        <div className="grid md:grid-cols-2 items-start gap-0">
          {/* 左侧文案区域：垂直居中，内边距适中 */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/15 px-2.5 py-1 text-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              台风应急防范指南
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold">应急防范</h1>
            <p className="mt-2 text-white/95">
              关注官方预警，提前做足准备；强风暴雨期间避免外出。若路径靠近，远离海边、河口及低洼地带，必要时按指令转移至安全区域。
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              行动优先 · 信息可靠 · 路线明确
            </div>
          </div>

          {/* 右侧图片区域：在中/大屏显示，保持原始比例自适应且不撑高左侧 */}
          <div className="relative hidden md:flex items-center justify-center p-4 md:max-h-[260px] lg:max-h-[320px]">
            <OptimizedImage
              src={preventionImg}
              alt="Typhoon schematic"
              className="object-contain w-full h-auto max-h-full"
              quality="high"
              webp={true}
            />
          </div>
        </div>
      </section>

      {/* 分组：风险隐患（点击卡片打开弹窗） */}
      <PointSection title="风险隐患" points={hazards} onOpen={openPoint} />

      {/* 分组：防范措施（点击卡片打开弹窗） */}
      <PointSection title="防范措施" points={measures} onOpen={openPoint} />

      {/* 友好提示 */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 p-4 text-slate-800 dark:text-slate-200">
        <p className="text-sm">
          小贴士：请随身携带雨具与备用电源，涉水行车风险极高；如遇突发险情，先转移到高处或坚固建筑内再拨打求助电话。
        </p>
      </section>

      {/* 弹窗：显示当前选中要点的详情（所有条目均有图片） */}
      <Modal open={open} onOpenChange={close} title={active?.title} size="md">
        {active ? (
          <div className="space-y-4">
            {/* 大图（按比例自适应） */}
            <OptimizedImage
              src={active.image}
              className="object-cover w-full h-auto rounded-lg"
              quality="high"
              webp={true}
            />
            {/* 详细文本说明 */}
            <div className="text-sm leading-6 text-slate-700 dark:text-slate-300">
              {active.desc}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
