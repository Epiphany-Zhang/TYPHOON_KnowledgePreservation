/**
 * EyeDiagram.tsx
 * Interactive, accessible SVG diagram of a tropical cyclone's eye structure.
 * - Shows Eye (light blue), Eyewall (deep blue ring), Spiral rainbands (blue-gray arcs with arrows)
 * - Hover/focus highlights parts; emits onActiveChange for external legend sync
 * - Uses CSS Modules for transitions and responsiveness
 */

import React, { useId } from 'react'
import styles from './EyeDiagram.module.css'

/** Cyclone structural parts supported by the diagram */
export type EyePart = 'eye' | 'wall' | 'bands' | null

/** Props for EyeDiagram */
export interface EyeDiagramProps {
  /** Currently active part for highlight synchronization */
  active?: EyePart
  /** Notify parent when hover/focus changes the active part */
  onActiveChange?: (part: EyePart) => void
  /** Optional className for outer wrapper */
  className?: string
}

/**
 * EyeDiagram
 * Responsive SVG with leader lines and labels.
 * ViewBox coordinates: 0 0 640 420 (landscape canvas)
 */
export default function EyeDiagram({
  active = null,
  onActiveChange,
  className,
}: EyeDiagramProps) {
  const uid = useId()
  const eyeId = `${uid}-eye`
  const wallId = `${uid}-wall`
  const arrowId = `${uid}-arrow`

  // Helper to compute conditional class
  const cx = (...names: (string | false | null | undefined)[]) =>
    names.filter(Boolean).join(' ')

  return (
    <div className={cx(styles.root, 'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3')}>
      <div className={cx(styles.autoHeight, 'w-full rounded-xl overflow-hidden')}>
        <svg
          className={styles.svg}
          viewBox="0 0 640 420"
          aria-labelledby={`${uid}-title ${uid}-desc`}
          role="img"
        >
          <title id={`${uid}-title`}>台风眼结构示意图</title>
          <desc id={`${uid}-desc`}>包含台风眼、台风眼墙与螺旋雨带的结构示意，带交互高亮与标注引线。</desc>

          {/* Definitions: gradients, markers */}
          <defs>
            <radialGradient id={eyeId} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="70%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#93c5fd" />
            </radialGradient>
            {/* Eyewall deep blue gradient for subtle depth */}
            <linearGradient id={wallId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            {/* Arrow marker for spiral bands */}
            <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
          </defs>

          {/* Soft background ring field */}
          <g opacity="0.35">
            <circle cx="320" cy="210" r="170" fill="#e2e8f0" />
            <circle cx="320" cy="210" r="220" fill="#e2e8f0" opacity="0.5" />
          </g>

          {/* Eyewall (ring) */}
          <g
            role="button"
            tabIndex={0}
            aria-label="台风眼墙"
            className={cx(styles.part, styles.partFocus, active === 'wall' && styles.active)}
            onMouseEnter={() => onActiveChange?.('wall')}
            onFocus={() => onActiveChange?.('wall')}
            onMouseLeave={() => onActiveChange?.(null)}
            onBlur={() => onActiveChange?.(null)}
          >
            {/* Use thick stroke to form a ring */}
            <circle
              cx="320"
              cy="210"
              r="86"
              fill="transparent"
              stroke={active === 'wall' ? '#1d4ed8' : 'url(#' + wallId + ')'}
              strokeWidth="34"
            />
          </g>

          {/* Eye (center) */}
          <g
            role="button"
            tabIndex={0}
            aria-label="台风眼"
            className={cx(styles.part, styles.partFocus, active === 'eye' && styles.active)}
            onMouseEnter={() => onActiveChange?.('eye')}
            onFocus={() => onActiveChange?.('eye')}
            onMouseLeave={() => onActiveChange?.(null)}
            onBlur={() => onActiveChange?.(null)}
          >
            <circle
              cx="320"
              cy="210"
              r="48"
              fill={active === 'eye' ? '#93c5fd' : 'url(#' + eyeId + ')'}
              stroke={active === 'eye' ? '#2563eb' : '#60a5fa'}
              strokeWidth="2"
            />
          </g>

          {/* Spiral rainbands */}
          <g
            role="button"
            tabIndex={0}
            aria-label="螺旋雨带"
            className={cx(styles.part, styles.partFocus, active === 'bands' && styles.active)}
            onMouseEnter={() => onActiveChange?.('bands')}
            onFocus={() => onActiveChange?.('bands')}
            onMouseLeave={() => onActiveChange?.(null)}
            onBlur={() => onActiveChange?.(null)}
            opacity={active === 'bands' ? 1 : 0.95}
          >
            {/* Outer arcs swirling counter-clockwise */}
            <path
              d="M120,300 C220,220 300,260 420,180"
              fill="none"
              stroke={active === 'bands' ? '#334155' : '#475569'}
              strokeWidth="4"
              markerEnd={`url(#${arrowId})`}
              strokeLinecap="round"
            />
            <path
              d="M160,340 C260,260 320,260 460,200"
              fill="none"
              stroke={active === 'bands' ? '#334155' : '#64748b'}
              strokeWidth="3"
              markerEnd={`url(#${arrowId})`}
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M130,220 C240,170 360,170 470,150"
              fill="none"
              stroke={active === 'bands' ? '#334155' : '#64748b'}
              strokeWidth="3"
              markerEnd={`url(#${arrowId})`}
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M200,360 C280,300 360,300 520,240"
              fill="none"
              stroke={active === 'bands' ? '#334155' : '#64748b'}
              strokeWidth="2.5"
              markerEnd={`url(#${arrowId})`}
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>

          {/* Leader lines and labels */}
          {/* Eye label */}
          <g>
            <line x1="320" y1="162" x2="260" y2="110" className={styles.leader} />
            <text x="250" y="106" className={styles.label}>台风眼</text>
            <text x="250" y="122" className={styles.labelMuted}>Eye</text>
          </g>

          {/* Eyewall label */}
          <g>
            <line x1="390" y1="230" x2="520" y2="190" className={styles.leader} />
            <text x="530" y="187" className={styles.label}>台风眼墙</text>
            <text x="530" y="203" className={styles.labelMuted}>Eyewall</text>
          </g>

          {/* Bands label */}
          <g>
            <line x1="210" y1="330" x2="120" y2="380" className={styles.leader} />
            <text x="90" y="392" className={styles.label}>螺旋雨带</text>
            <text x="90" y="408" className={styles.labelMuted}>Spiral rainbands</text>
          </g>
        </svg>
      </div>
    </div>
  )
}