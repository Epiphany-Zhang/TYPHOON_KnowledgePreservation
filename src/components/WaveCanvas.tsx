/** 
 * WaveCanvas.tsx
 * Ocean 主题版：多层正弦波（海浪）采用蓝/青色系渐变与高光，流畅且具层次。
 * 特性保持：
 * - 多层波、渐变描边、柔光与泡沫粒子
 * - 指针涟漪交互、触摸振幅手势
 * - 响应式与 HiDPI 适配
 */

import { useEffect, useRef } from 'react'

/** Props controlling the wave animation. */
export interface WaveCanvasProps {
  /** Wave amplitude in pixels. */
  amplitude: number
  /** Wave speed factor. */
  speed: number
  /** Wave wavelength in pixels. */
  wavelength?: number
  /** Background color of canvas. */
  background?: string
  /** Primary wave color. */
  color?: string
}

/** Internal particle type representing foam/sparkle on wave crests. */
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

/** Ripple source for pointer-based wave disturbance. */
interface Ripple {
  x: number
  /** Current strength (decays over time). */
  strength: number
  /** Influence radius in px. */
  radius: number
  /** Exponential decay per frame. */
  decay: number
}

/**
 * WaveCanvas
 * Draws layered sine waves with requestAnimationFrame; adds gradients, glow, foam particles,
 * and pointer-based ripple interactions. Uses devicePixelRatio scaling for crisp rendering.
 * 
 * Ocean 主题调整：
 * - 默认主色更新为 #1E90FF；层级颜色在蓝/青色系中渐变（#1E90FF、#009ACD、#00CED1 等）
 * - Underfill/Highlight 渐变使用海洋色的半透明 RGBA
 */
export default function WaveCanvas({
  amplitude,
  speed,
  wavelength = 280,
  background = 'transparent',
  color = '#1E90FF', // Ocean 主色
}: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  // Animation state refs (mutable without re-render)
  const phaseRef = useRef(0)
  const ampRef = useRef(amplitude)
  const speedRef = useRef(speed)
  const wlRef = useRef(wavelength)

  // Interaction + visuals
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  })
  const ripplesRef = useRef<Ripple[]>([])
  const particlesRef = useRef<Particle[]>([])
  const gradientsRef = useRef<{
    underfill: CanvasGradient
    highlight: CanvasGradient
  } | null>(null)

  // Sync refs with props without re-creating the loop
  useEffect(() => {
    ampRef.current = amplitude
    speedRef.current = speed
    wlRef.current = wavelength
  }, [amplitude, speed, wavelength])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let mounted = true

    /** Resize canvas according to client size and device pixel ratio and (re)build gradients. */
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.floor(w * ratio)
      canvas.height = Math.floor(h * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

      // Recreate vertical gradients for underfill and highlight (Ocean scheme)
      const under = ctx.createLinearGradient(0, h * 0.35, 0, h)
      // 顶部偏亮蓝 → 中部青蓝 → 底部透明
      under.addColorStop(0.0, 'rgba(30,144,255,0.12)')  // #1E90FF
      under.addColorStop(0.55, 'rgba(0,154,205,0.10)')  // #009ACD
      under.addColorStop(1.0, 'rgba(0,206,209,0.00)')   // #00CED1 -> transparent

      const hi = ctx.createLinearGradient(0, 0, 0, h)
      hi.addColorStop(0.00, 'rgba(255,255,255,0.22)')
      hi.addColorStop(0.18, 'rgba(255,255,255,0.12)')
      hi.addColorStop(0.55, 'rgba(255,255,255,0.05)')
      hi.addColorStop(1.00, 'rgba(255,255,255,0.00)')

      gradientsRef.current = { underfill: under, highlight: hi }
    }

    /**
     * Compute additional vertical displacement from active ripples at position x.
     * Gaussian influence with decaying strength; light cosine modulation for realism.
     */
    const rippleOffset = (x: number, t: number) => {
      const ripples = ripplesRef.current
      let dy = 0
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        const sigma = r.radius * 0.6
        const dx = x - r.x
        const w = Math.max(0.12, 0.18 * speedRef.current)
        const envelope = Math.exp(-(dx * dx) / (2 * sigma * sigma))
        dy += r.strength * envelope * Math.cos((dx / sigma) * 2.2 - w * t)
        // Decay strength every frame; remove if too weak
        r.strength *= r.decay
        if (r.strength < 0.3) {
          ripples.splice(i, 1)
        }
      }
      return dy
    }

    /**
     * Move or spawn foam particles near main wave crest.
     * Particle count dynamically limited by canvas width for performance.
     */
    const updateAndDrawParticles = (t: number, crestYAtX: (x: number) => number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const particles = particlesRef.current
      const maxParticles = Math.max(40, Math.min(110, Math.floor(w / 8)))

      // Spawn a few particles each frame near random x along the crest
      const spawnCount = particles.length < maxParticles ? 4 : 1
      for (let i = 0; i < spawnCount; i++) {
        if (particles.length >= maxParticles) break
        const x = Math.random() * w
        const y = crestYAtX(x) - 4 + (Math.random() - 0.5) * 6
        particles.push({
          x,
          y,
          vx: 0.6 + Math.random() * 0.6 + speedRef.current * 0.2,
          vy: -0.15 + (Math.random() - 0.5) * 0.3,
          life: 0,
          maxLife: 60 + Math.random() * 60,
          size: 1.2 + Math.random() * 1.6,
          alpha: 0.8,
        })
      }

      // Pointer repulsion radius
      const pr = pointerRef.current
      const repelRadius = 38

      // Update + draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += 1
        p.x += p.vx
        p.y += p.vy

        // Gentle gravity to settle particles back
        p.vy += 0.003

        // Repel near pointer to give subtle interaction hint
        if (pr.inside) {
          const dx = p.x - pr.x
          const dy = p.y - pr.y
          const d2 = dx * dx + dy * dy
          if (d2 < repelRadius * repelRadius) {
            const d = Math.sqrt(d2) || 1
            p.vx += (dx / d) * 0.08
            p.vy += (dy / d) * 0.08
          }
        }

        // Fade out near end of life
        const lifeRatio = p.life / p.maxLife
        p.alpha = 0.8 * (1 - lifeRatio)

        if (p.life >= p.maxLife || p.x > w + 5 || p.y > h + 5) {
          particles.splice(i, 1)
          continue
        }

        // Draw as soft white dots (foam)
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, p.alpha))})`
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    /** Draw a single wave layer with optional glow and return a crest sampling function. */
    const drawWaveLayer = (layerIndex: number, t: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const baseAmp = ampRef.current
      const baseWl = wlRef.current
      const phase = phaseRef.current

      // Layer-specific parameters for depth & parallax
      const amp = baseAmp * (1 - layerIndex * 0.22)
      const wl = Math.max(80, baseWl - layerIndex * 44)
      const sp = speedRef.current * (1 + layerIndex * 0.1)
      const yBase = h * 0.5 + layerIndex * 6

      // Ocean 配色层级：蓝 → 青蓝 → 青绿 → 浅蓝 → 青
      const layerColors = [
        color,        // #1E90FF
        '#009ACD',    // 青蓝
        '#00CED1',    // 青绿
        '#38BDF8',    // sky-400
        '#22D3EE',    // cyan-400
      ]
      const strokeColor = layerColors[layerIndex % layerColors.length]

      // Determine crest path, considering ripples and pointer hint
      const pointer = pointerRef.current
      const pointerHint = (x: number) => {
        if (!pointer.inside) return 0
        const dx = Math.abs(x - pointer.x)
        const r = 90
        if (dx > r) return 0
        const k = 1 - dx / r
        return k * 2.5 // subtle lift near pointer
      }

      // Pre-pass to compute points and allow reuse for fill and highlight
      const pts: Array<{ x: number; y: number }> = []
      for (let x = 0; x <= w; x += 2) {
        const crest =
          Math.sin((x + phase * 60 * (layerIndex + 1)) / wl) * amp +
          rippleOffset(x, t) +
          pointerHint(x)
        pts.push({ x, y: yBase + crest })
      }

      // Optional glow for the front-most layer to add depth
      if (layerIndex === 0) {
        ctx.save()
        ctx.shadowBlur = 12
        ctx.shadowColor = `${strokeColor}88`
      }

      // Stroke path
      ctx.beginPath()
      for (let i = 0; i < pts.length; i++) {
        const { x, y } = pts[i]
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineWidth = layerIndex === 0 ? 2.2 : 1.6
      ctx.strokeStyle = strokeColor
      ctx.globalAlpha = layerIndex === 0 ? 0.95 : 0.78
      ctx.stroke()
      ctx.globalAlpha = 1

      if (layerIndex === 0) {
        ctx.restore()
      }

      // Under-curve subtle fill for the front-most layer to suggest volume
      if (layerIndex === 0 && gradientsRef.current) {
        ctx.save()
        ctx.beginPath()
        for (let i = 0; i < pts.length; i++) {
          const { x, y } = pts[i]
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        ctx.fillStyle = gradientsRef.current.underfill
        ctx.globalAlpha = 0.9
        ctx.fill()
        ctx.restore()
      }

      // Crest highlight (thin sheen)
      if (layerIndex === 0 && gradientsRef.current) {
        ctx.save()
        ctx.beginPath()
        for (let i = 0; i < pts.length; i++) {
          const { x, y } = pts[i]
          if (i === 0) ctx.moveTo(x, y - 1)
          else ctx.lineTo(x, y - 1)
        }
        ctx.lineWidth = 0.8
        ctx.strokeStyle = '#ffffff'
        ctx.globalAlpha = 0.35
        ctx.stroke()
        ctx.restore()
      }

      // Return crest sampler function for particles system
      return (x: number) => {
        // nearest even step index
        const idx = Math.max(0, Math.min(pts.length - 1, Math.round(x / 2)))
        return pts[idx].y
      }
    }

    /** Main draw loop */
    const draw = () => {
      if (!mounted) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      // Clear background
      ctx.clearRect(0, 0, w, h)
      if (background !== 'transparent') {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, w, h)
      }

      // Advance phase for base waves
      phaseRef.current += 0.02 * speedRef.current
      const t = performance.now() * 0.001

      // Draw multiple layered waves (front to back for better overlap)
      const layerCount = 5
      let crestSampler: ((x: number) => number) | null = null
      for (let i = layerCount - 1; i >= 0; i--) {
        const sampler = drawWaveLayer(i, t)
        if (i === 0) crestSampler = sampler
      }

      // Shoreline hint band: ocean-cyan tint
      ctx.fillStyle = 'rgba(0,206,209,0.18)' // #00CED1 with low alpha
      ctx.fillRect(0, h * 0.75, w, h * 0.25)

      // Particles (foam) drifting along the main crest
      if (crestSampler) {
        updateAndDrawParticles(t, crestSampler)
      }

      // Pointer soft spotlight to reinforce interactivity
      const pr = pointerRef.current
      if (pr.inside) {
        const grd = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, 80)
        grd.addColorStop(0, 'rgba(255,255,255,0.08)')
        grd.addColorStop(1, 'rgba(255,255,255,0.00)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, w, h)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    // Touch: vertical drag to change amplitude (kept from original)
    let lastY = 0
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      const dy = lastY - y
      lastY = y
      ampRef.current = Math.max(5, Math.min(120, ampRef.current + dy * 0.2))
    }

    // Mouse interactions: pointer position and ripple click
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current.x = e.clientX - rect.left
      pointerRef.current.y = e.clientY - rect.top
      pointerRef.current.inside = true
    }
    const onMouseLeave = () => {
      pointerRef.current.inside = false
    }
    const spawnRippleAt = (px: number) => {
      ripplesRef.current.push({
        x: px,
        strength: 18, // initial vertical displacement amplitude
        radius: 120,
        decay: 0.985, // per frame decay
      })
    }
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const px = e.clientX - rect.left
      spawnRippleAt(px)
    }

    // Touch tap to create ripple
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const rect = canvas.getBoundingClientRect()
        const px = e.changedTouches[0].clientX - rect.left
        spawnRippleAt(px)
      }
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd, { passive: true })
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('click', onClick)

    return () => {
      mounted = false
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('click', onClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [background, color])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[260px] md:h-[360px] rounded-xl border border-sky-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      aria-label="Typhoon wave animation"
    />
  )
}
