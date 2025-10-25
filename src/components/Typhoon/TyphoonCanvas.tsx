/**
 * TyphoonCanvas.tsx
 * Interactive typhoon animation rendered on Canvas.
 * - Visuals: rotating log-spiral cloud bands, a clear eye, and an evolving track path.
 * - Interactivity: responds to props (spin, travel, wind, path curvature, band count) in real time.
 * - Performance: requestAnimationFrame loop, devicePixelRatio scaling, and lightweight drawing.
 */

import { useEffect, useRef } from 'react'

/** Props controlling the typhoon animation. */
export interface TyphoonCanvasProps {
  /** Spiral rotation speed in radians per second. */
  spin: number
  /** Forward translation speed in pixels per second. */
  travel: number
  /** Wind strength [0..1.6], affects band opacity/width and density. */
  wind: number
  /** Path curvature amplitude in pixels (vertical sine meander). */
  pathAmp: number
  /** Number of spiral rain bands (2-8 recommended). */
  bands: number
  /** Optional background fill color (uses container bg if omitted). */
  background?: string
}

/**
 * TyphoonCanvas
 * Draws a stylized tropical cyclone with log-spiral bands and a trail.
 * - The cyclone center moves across the canvas with slight sine meander to imitate steering flow.
 * - Track trail fades by alpha gradient.
 */
export default function TyphoonCanvas({
  spin,
  travel,
  wind,
  pathAmp,
  bands,
  background,
}: TyphoonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  // Mutable runtime state and latest props (avoid re-renders in RAF)
  const startTimeRef = useRef<number>(performance.now())
  const centersRef = useRef<Array<{ x: number; y: number }>>([])
  const spinRef = useRef(spin)
  const travelRef = useRef(travel)
  const windRef = useRef(wind)
  const pathAmpRef = useRef(pathAmp)
  const bandsRef = useRef(bands)
  const bgRef = useRef(background)

  useEffect(() => {
    spinRef.current = spin
  }, [spin])
  useEffect(() => {
    travelRef.current = travel
  }, [travel])
  useEffect(() => {
    windRef.current = wind
  }, [wind])
  useEffect(() => {
    pathAmpRef.current = pathAmp
  }, [pathAmp])
  useEffect(() => {
    bandsRef.current = bands
  }, [bands])
  useEffect(() => {
    bgRef.current = background
  }, [background])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    /** Resize canvas by CSS size and DPR. */
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(cssW * ratio))
      canvas.height = Math.max(1, Math.floor(cssH * ratio))
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Reset trail when size changes or on mount
    centersRef.current = []
    startTimeRef.current = performance.now()

    /** Sample cyclone center based on elapsed time. */
    const sampleCenter = (tSec: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      // Base path: move left->right; wrap after exiting screen
      const speed = travelRef.current // px/s
      const totalX = (tSec * speed) % (w + 240) // extra span then wrap
      const x = -120 + totalX

      // Meander with sine; amplitude controlled by pathAmp
      const amp = pathAmpRef.current
      const k = 2 * Math.PI / Math.max(360, w) // 2 full meanders across width
      const y = h * 0.5 + amp * Math.sin((x + 160) * k)

      return { x, y }
    }

    /** Draw the cyclone spiral bands around center. */
    const drawCyclone = (cx: number, cy: number, timeSec: number) => {
      const windK = Math.max(0, Math.min(1.6, windRef.current))
      const bandCount = Math.max(1, Math.min(10, Math.round(bandsRef.current)))
      const rot = timeSec * spinRef.current

      // Spiral parameters (log-spiral r = a * e^(b*theta))
      const a = 3 + 3 * windK // starting radius
      const b = 0.18 // tightness
      const turns = 5 // visible turns per band
      const thetaMax = turns * Math.PI * 2
      const seg = 0.18 // angle step

      // Cloud color palette (blue-ish, stronger wind => more opaque and wider)
      const baseAlpha = 0.08 + 0.18 * windK
      const lineBase = Math.max(0.6, 1.0 * windK)
      const hue = 205 // sky blue
      const sat = 90

      for (let k = 0; k < bandCount; k++) {
        const offset = (k * 2 * Math.PI) / bandCount
        ctx.beginPath()
        let started = false
        for (let th = 0; th <= thetaMax; th += seg) {
          const r = a * Math.exp(b * th)
          const ang = th + rot + offset
          const x = cx + r * Math.cos(ang)
          const y = cy + r * Math.sin(ang)
          if (!started) {
            ctx.moveTo(x, y)
            started = true
          } else {
            ctx.lineTo(x, y)
          }
        }
        const alpha = Math.max(0.02, baseAlpha * (1 - k / (bandCount + 1)))
        ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${windK > 1 ? 60 : 65}%, ${alpha})`
        ctx.lineWidth = lineBase + (bandCount - k) * 0.25
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      // Eye (calm center) and eyewall ring accent
      const eyeR = 8 + 3 * windK
      // Eye fill
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeR * 2.2)
      grd.addColorStop(0, 'rgba(255,255,255,0.95)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(cx, cy, eyeR * 2.2, 0, Math.PI * 2)
      ctx.fill()

      // Eyewall
      ctx.beginPath()
      ctx.arc(cx, cy, eyeR, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(56,189,248,${0.35 + windK * 0.15})` // sky-400
      ctx.lineWidth = 2
      ctx.stroke()
    }

    /** Draw fading track trail from centersRef. */
    const drawTrail = () => {
      const pts = centersRef.current
      if (pts.length < 2) return
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      // Gradient alpha along the path
      const grad = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[pts.length - 1].x, pts[pts.length - 1].y)
      grad.addColorStop(0, 'rgba(148,163,184,0.15)') // slate-400
      grad.addColorStop(1, 'rgba(56,189,248,0.55)') // sky-400
      ctx.strokeStyle = grad
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    let lastTrailSample = 0

    const loop = () => {
      const now = performance.now()
      const tSec = (now - startTimeRef.current) / 1000

      // Clear
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (bgRef.current) {
        ctx.fillStyle = bgRef.current
        ctx.fillRect(0, 0, w, h)
      } else {
        ctx.clearRect(0, 0, w, h)
      }

      // Sample center & record trail with mild down-sampling
      const c = sampleCenter(tSec)
      if (now - lastTrailSample > 40) {
        const pts = centersRef.current
        if (pts.length === 0 || Math.hypot(pts[pts.length - 1].x - c.x, pts[pts.length - 1].y - c.y) > 2) {
          pts.push(c)
          // Limit trail length
          if (pts.length > 400) pts.splice(0, pts.length - 400)
        }
        lastTrailSample = now
      }

      // Trail first (behind), cyclone on top
      drawTrail()
      drawCyclone(c.x, c.y, tSec)

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-label="Typhoon animation canvas"
    />
  )
}
