import React from "react"
import styles from "./brain-animation.module.css"

export default function BrainAnimation() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Brain outline */}
        <path
          d="M100,30
            C70,10 40,40 60,70
            C30,80 30,120 60,130
            C40,160 80,190 100,170
            C120,190 160,160 140,130
            C170,120 170,80 140,70
            C160,40 130,10 100,30
            Z"
          fill="#181c23"
          stroke="#61dafb"
          strokeWidth="5"
          filter="url(#glow)"
        />
        {/* Orbits */}
        <ellipse className={styles.orbit + ' ' + styles.orbit1} cx="100" cy="100" rx="80" ry="35" />
        <ellipse className={styles.orbit + ' ' + styles.orbit2} cx="100" cy="100" rx="80" ry="35" transform="rotate(60 100 100)" />
        <ellipse className={styles.orbit + ' ' + styles.orbit3} cx="100" cy="100" rx="80" ry="35" transform="rotate(-60 100 100)" />
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  )
} 