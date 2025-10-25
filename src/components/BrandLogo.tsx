/**
 * BrandLogo.tsx
 * Minimal, modern brand mark for "驭风知险":
 * - Spiral stroke suggests cyclonic wind/ocean swirl (control).
 * - Small amber dot denotes risk awareness.
 * - Works in light/dark mode; scalable via size prop.
 */

import React from 'react'

/** Props for BrandLogo. */
export interface BrandLogoProps {
  /** Pixel size of the square logo (width=height). Default 24. */
  size?: number
  /** Additional className for external styling. */
  className?: string
  /** Accessible title for screen readers. */
  title?: string
}

/**
 * BrandLogo
 * An inline SVG swirl with gradient stroke and a small amber "risk" dot.
 */
export default function BrandLogo({ size = 24, className, title = '驭风知险 Logo' }: BrandLogoProps) {
  return (
    <svg
      role="img"
      aria-label={title}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="brand-swirl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" /> {/* blue-900 */}
          <stop offset="60%" stopColor="#2563eb" /> {/* blue-600 */}
          <stop offset="100%" stopColor="#64748b" /> {/* slate-500 */}
        </linearGradient>
      </defs>

      {/* Outer subtle circle (tech gray, low alpha) */}
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="1" />

      {/* Swirl path (cyclone-like) */}
      <path
        d="M12 5.5c3 0 5.5 2.2 5.5 5 0 2.6-2.1 4.6-4.7 4.6-2.8 0-4.8-1.8-4.8-4.1 0-2.1 1.7-3.8 3.8-3.8 1.9 0 3.3 1.4 3.3 3.1 0 1.5-1.2 2.7-2.8 2.7"
        fill="none"
        stroke="url(#brand-swirl)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Risk awareness dot (amber) */}
      <circle cx="18.2" cy="7.2" r="1.6" fill="#f59e0b" /> {/* amber-500 */}
    </svg>
  )
}
