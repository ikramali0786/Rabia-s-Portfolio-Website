import { useRef, useState } from 'react';
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Total scroll duration for one full loop (seconds). Default 40s matches old CSS. */
  duration?: number;
  className?: string;
};

export default function Marquee({ children, duration = 40, className }: Props) {
  const reduce = useReducedMotion();

  // Static / reduced-motion path: horizontally scrollable, no animation
  if (reduce) {
    return (
      <div
        className={className}
        style={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div style={{ display: 'flex', width: 'max-content', gap: '1.25rem', padding: '0.5rem 0' }}>
          {children}
        </div>
      </div>
    );
  }

  return <MarqueeInner duration={duration} className={className}>{children}</MarqueeInner>;
}

/** Separated so hooks only run when motion is allowed */
function MarqueeInner({ children, duration = 40, className }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const track = trackRef.current;
    if (!track) return;

    // The track contains TWO copies; half the scrollWidth = width of one copy
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth === 0) return;

    // px/ms → px per frame
    const speed = halfWidth / (duration * 1000);
    const next = x.get() - speed * delta;

    // When we've scrolled a full copy-width, snap back seamlessly
    x.set(next <= -halfWidth ? next + halfWidth : next);
  });

  return (
    <div
      className={className}
      style={{ overflow: 'hidden' }}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <motion.div
        ref={trackRef}
        style={{
          x,
          display: 'flex',
          width: 'max-content',
          gap: '1.25rem',
          padding: '0.5rem 0',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
        aria-live="off"
      >
        {/* First copy — real, accessible content */}
        {children}
        {/* Second copy — visually seamless, aria-hidden */}
        <span aria-hidden="true" style={{ display: 'contents' }}>
          {children}
        </span>
      </motion.div>
    </div>
  );
}
