import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  y?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
};

// Motion tuned after Emil Kowalski's principles: an expo ease-out so elements decelerate as
// they "arrive" (feels fast and responsive), a small blur-in for a premium focus-in effect,
// and compositor-friendly props only (opacity / transform / filter, one-shot on enter).
// A gentle upper clamp keeps every section snappy even if a caller passes a long duration.
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Reveal({
  children,
  className,
  style,
  y = 22,
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
}: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;

  const dur = Math.min(duration, 0.7);
  return (
    <motion.div
      className={className}
      style={style}
      data-framer-reveal
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{
        duration: dur,
        ease: EASE_OUT_EXPO,
        delay,
        // Clear the blur a touch faster than the move settles — sharpens perceived speed.
        filter: { duration: dur * 0.7, ease: EASE_OUT_EXPO, delay },
      }}
    >
      {children}
    </motion.div>
  );
}
