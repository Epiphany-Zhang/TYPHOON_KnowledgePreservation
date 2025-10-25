/**
 * ShoalingCanvas.tsx
 * Ocean 主题版“趋浅增幅（shoaling）”海面动画：
 * - 调整为更贴合海洋氛围的蓝/青色三段渐变（#1E90FF → #009ACD → #00CED1）
 * - 高光描边保持白色，但整体透明度更柔和，突出层次感
 * - 其余交互、性能与响应式逻辑保持不变
 */

import { useEffect, useRef } from 'react'

/** 组件入参：与原版保持兼容（新增可选 waterMid 渐变中段色） */
export interface ShoalingCanvasProps {
  /** 深海基准振幅（像素） */
  amplitude: number
  /** 推进速度系数（无量纲） */
  speed: number
  /** 可选调色板（默认采用 ocean 主题蓝青渐变） */
  palette?: {
    /** 水体顶层高光色（偏亮蓝） */
    waterTop: string
    /** 水体底部色（偏青绿） */
    waterBottom: string
    /** 可选：渐变中段过渡色（青蓝） */
    waterMid?: string
    /** 水面描边高光 */
    waterStroke: string
    /** 海床颜色（深蓝灰） */
    seabed: string
  }
}

/** 内部粒子（泡沫）结构 */
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  alpha: number
}

/** 涟漪源（沿 x 方向调制的附加位移） */
interface Ripple {
  x: number
  strength: number
  decay: number
  radius: number
}

/**
 * ShoalingCanvas
 * 使用可变波数/振幅的行进波构造水面：累计相位法实现 λ(x) 随 x 递减（近岸压缩）。
 * 用海床折线 + 水面折线构成闭合多边形进行水体填充。
 */
export default function ShoalingCanvas({
  amplitude,
  speed,
  palette = {
    // Ocean 主题默认配色：蓝 → 青蓝 → 青绿
    waterTop: '#1E90FF', // DodgerBlue
    waterBottom: '#00CED1', // DarkTurquoise
    waterStroke: '#FFFFFF',
    seabed: '#2A3340', // 深蓝灰
    // waterMid 为可选；如未提供，内部使用 #009ACD
  },
}: ShoalingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  // 动画状态
  const ampRef = useRef(amplitude)
  const speedRef = useRef(speed)
  const timeRef = useRef(0)

  // 交互数据
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  })
  const ripplesRef = useRef<Ripple[]>([])
  const particlesRef = useRef<Particle[]>([])

  // 同步外部 props
  useEffect(() => {
    ampRef.current = amplitude
  }, [amplitude])
  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let mounted = true

    /** 视网膜/响应式缩放 */
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.floor(w * ratio)
      canvas.height = Math.floor(h * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    /** 海床轮廓 y(x)：左侧深，x 到一定位置开始爬升，最后平台 */
    const seabedY = (x: number, w: number, h: number) => {
      const base = h - Math.max(8, h * 0.03) // 左下基线略上提，避免出界
      const slopeStart = w * 0.18
      const slopeEnd = w * 0.72
      const topY = h * 0.46 // 平台高度
      if (x <= slopeStart) return base
      if (x <= slopeEnd) {
        const t = (x - slopeStart) / (slopeEnd - slopeStart)
        return base + (topY - base) * t
      }
      return topY
    }

    /** 近岸进程（0~1）：用于映射振幅与波长 */
    const shoalProgress = (x: number, w: number) => {
      const slopeStart = w * 0.18
      const slopeEnd = w * 0.72
      if (x <= slopeStart) return 0
      if (x >= slopeEnd) return 1
      const t = (x - slopeStart) / (slopeEnd - slopeStart)
      // 平滑曲线（更自然的增幅/压缩）
      return t * t * (3 - 2 * t) // smoothstep
    }

    /** 根据 x 计算局部参数：振幅 A(x)、波长 λ(x) */
    const A = (x: number, w: number) => {
      // 深海振幅 amp0，近岸增幅到 ~2.4 倍，匹配示意“右侧更高”的视觉
      const amp0 = ampRef.current
      const p = shoalProgress(x, w)
      return amp0 * (1 + 1.4 * p)
    }
    const lambda = (x: number, w: number) => {
      // 深海长波 ~260px，近岸缩短到 ~70px
      const deep = 260
      const shallow = 70
      const p = shoalProgress(x, w)
      return deep + (shallow - deep) * p
    }

    /** 叠加涟漪：以高斯包络影响竖向位移 */
    const rippleOffset = (x: number) => {
      const arr = ripplesRef.current
      let dy = 0
      for (let i = arr.length - 1; i >= 0; i--) {
        const r = arr[i]
        const dx = x - r.x
        const sigma = r.radius * 0.6
        const env = Math.exp(-(dx * dx) / (2 * sigma * sigma))
        dy += r.strength * env
        r.strength *= r.decay
        if (r.strength < 0.25) arr.splice(i, 1)
      }
      return dy
    }

    /**
     * 更新并绘制泡沫粒子（主要在浅水区）
     * @param crest 传入采样函数：给定 x 返回波峰 y
     */
    const updateParticles = (crest: (x: number) => number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const ps = particlesRef.current
      const max = Math.max(36, Math.min(120, Math.floor(w / 8)))

      // 生成：在右半区/浅水区靠近波峰附近
      const spawnN = ps.length < max ? 3 : 1
      for (let i = 0; i < spawnN; i++) {
        const x = w * (0.45 + Math.random() * 0.5)
        const y = crest(x) - 3 + (Math.random() - 0.5) * 4
        ps.push({
          x,
          y,
          vx: 0.8 + Math.random() * 0.8 + speedRef.current * 0.4,
          vy: -0.12 + (Math.random() - 0.5) * 0.24,
          life: 0,
          maxLife: 60 + Math.random() * 70,
          size: 1 + Math.random() * 1.8,
          alpha: 0.85,
        })
      }

      const pr = pointerRef.current
      const repelR2 = 40 * 40

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.004

        if (pr.inside) {
          const dx = p.x - pr.x
          const dy = p.y - pr.y
          const d2 = dx * dx + dy * dy
          if (d2 < repelR2) {
            const d = Math.sqrt(d2) || 1
            p.vx += (dx / d) * 0.08
            p.vy += (dy / d) * 0.08
          }
        }

        const r = p.life / p.maxLife
        p.alpha = 0.9 * (1 - r)

        if (p.life >= p.maxLife || p.x > w + 6 || p.y > h + 6) {
          ps.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, p.alpha))})`
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    /** 核心：绘制一帧 */
    const draw = () => {
      if (!mounted) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      // 清屏（透明背景，交由父级渐变/底色控制）
      ctx.clearRect(0, 0, w, h)

      // 时间推进
      const t = (timeRef.current += 0.016 * (0.9 + speedRef.current * 0.4))
      const baseY = h * 0.38 // 深海基准水位（示意版）

      // 预计算水体渐变（Ocean 三段）
      const waterGrad = ctx.createLinearGradient(0, 0, 0, h)
      const mid = palette.waterMid ?? '#009ACD'
      waterGrad.addColorStop(0, palette.waterTop)
      waterGrad.addColorStop(0.5, mid)
      waterGrad.addColorStop(1, palette.waterBottom)

      // 1) 海床多边形
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, seabedY(0, w, h))
      for (let x = 0; x <= w; x += 3) {
        ctx.lineTo(x, seabedY(x, w, h))
      }
      ctx.lineTo(w, h)
      ctx.closePath()
      ctx.fillStyle = palette.seabed
      ctx.fill()

      // 2) 水面路径（可变 λ 与 A）：累计相位
      const pts: Array<{ x: number; y: number }> = []
      let theta = -2.2 * t // 角频率近似随时间推进
      const dx = 2
      for (let x = 0; x <= w; x += dx) {
        const lam = lambda(x, w)
        const k = (2 * Math.PI) / lam
        theta += k * dx // 累计相位，形成空间变频
        // 近点交互提升（悬停抬升）
        const pr = pointerRef.current
        let lift = 0
        if (pr.inside) {
          const d = Math.abs(x - pr.x)
          const r = 90
          if (d < r) lift = (1 - d / r) * 2.2
        }
        // 基准振幅 + 涟漪扰动
        const Ay = A(x, w)
        const yWave = baseY + Ay * Math.sin(theta) + rippleOffset(x) + lift

        // 与海床保持安全间隙，避免穿透
        const bed = seabedY(x, w, h)
        const y = Math.min(yWave, bed - 2)

        pts.push({ x, y })
      }

      // 3) 填充水体（上：水面路径；下：沿海床回到起点）
      ctx.save()
      ctx.beginPath()
      // 水面
      for (let i = 0; i < pts.length; i++) {
        const { x, y } = pts[i]
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      // 连接到海床平台边缘
      ctx.lineTo(w, seabedY(w, w, h))
      // 沿海床反向回到 x=0
      for (let x = w; x >= 0; x -= 3) {
        ctx.lineTo(x, seabedY(x, w, h))
      }
      ctx.closePath()
      ctx.fillStyle = waterGrad
      ctx.globalAlpha = 0.96
      ctx.fill()
      ctx.restore()

      // 4) 水面高光描边与轻度光晕（Ocean 风格：更柔和的白色高光）
      ctx.save()
      ctx.beginPath()
      for (let i = 0; i < pts.length; i++) {
        const { x, y } = pts[i]
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineWidth = 1.5
      ctx.strokeStyle = palette.waterStroke
      ctx.globalAlpha = 0.42
      ctx.stroke()
      // 光晕
      ctx.shadowBlur = 10
      ctx.shadowColor = '#FFFFFF66'
      ctx.globalAlpha = 0.16
      ctx.stroke()
      ctx.restore()

      // 5) 浅水段泡沫粒子
      const crestSampler = (x: number) => {
        // 最近的采样点
        const idx = Math.max(0, Math.min(pts.length - 1, Math.round(x / dx)))
        return pts[idx].y
      }
      updateParticles(crestSampler)

      // 6) 指针柔光
      const pr = pointerRef.current
      if (pr.inside) {
        const g = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, 80)
        g.addColorStop(0, 'rgba(255,255,255,0.10)')
        g.addColorStop(1, 'rgba(255,255,255,0.00)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    // 首次准备
    resize()
    draw()
    window.addEventListener('resize', resize)

    // 交互：触摸纵向滑动 = 调整深海振幅
    let lastY = 0
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      const dy = lastY - y
      lastY = y
      ampRef.current = Math.max(6, Math.min(120, ampRef.current + dy * 0.22))
    }

    // 指针移动/离开
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current.x = e.clientX - rect.left
      pointerRef.current.y = e.clientY - rect.top
      pointerRef.current.inside = true
    }
    const onMouseLeave = () => {
      pointerRef.current.inside = false
    }

    // 生成涟漪
    const spawnRipple = (x: number) => {
      ripplesRef.current.push({
        x,
        strength: 10,
        radius: 120,
        decay: 0.985,
      })
    }
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      spawnRipple(e.clientX - rect.left)
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const rect = canvas.getBoundingClientRect()
        spawnRipple(e.changedTouches[0].clientX - rect.left)
      }
    }

    // 绑定
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd, { passive: true })

    // 清理
    return () => {
      mounted = false
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [palette])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[260px] md:h-[360px] rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      aria-label="Shoaling wave animation (typhoon waves)"
    />
  )
}
