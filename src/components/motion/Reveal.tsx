import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

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

export default function Reveal({
  children,
  className,
  style,
  y = 28,
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.2,
}: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={style}
      data-framer-reveal
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
