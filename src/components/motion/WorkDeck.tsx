import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { useRef, useEffect, useState, type ReactNode } from 'react';

// ---- types matching site data shape ----
type WorkItem = {
  slug: string;
  title: string;
  industry: string;
  year: string;
  stat: string;
  image: string;
  services: readonly string[];
  summary: string;
};

// Per-card accent colors cycling through the iridescent palette
const CARD_ACCENTS = [
  { glow: 'rgba(139,92,246,0.18)', border: 'rgba(139,92,246,0.35)', label: 'violet' },
  { glow: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.30)', label: 'pink' },
  { glow: 'rgba(34,211,238,0.14)', border: 'rgba(34,211,238,0.28)', label: 'cyan' },
  { glow: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.28)', label: 'amber' },
];

// ---- Single card that applies scroll-driven scale + brightness recede ----
// The recede is driven by ONE shared container scroll progress (passed in), mapped to a
// per-card window — robust, with no fragile inter-card ref wiring. As you scroll deeper
// into the deck, each card (except the last) recedes (scale down + dim) while the next
// card stacks over it; the last card stays full-size and only recedes gently at the very end.
type CardTransformProps = {
  children: ReactNode;
  progress: MotionValue<number>;
  index: number;
  total: number;
  isDesktop: boolean;
};

function CardTransform({ children, progress, index, total, isDesktop }: CardTransformProps) {
  const reduce = useReducedMotion();
  const isLast = index === total - 1;

  // Recede window for this card within the container's [0,1] scroll progress.
  // Non-last: dims across its slice as the next card rises to cover it.
  // Last: stays full until ~85% then a slight, gentle recede as the section scrolls away.
  const start = isLast ? 0.85 : index / total;
  const end = isLast ? 1 : (index + 1) / total;

  const scale = useTransform(progress, [start, end], [1, isLast ? 0.96 : 0.9]);
  const brightness = useTransform(progress, [start, end], [1, isLast ? 0.78 : 0.5]);
  const filterStr = useTransform(brightness, (b) => `brightness(${b})`);

  // Cards are ALWAYS visible (opacity 1) — never gate the case-study content behind
  // an opacity entrance. Desktop gets the scroll-driven stacking recede (scale + dim);
  // mobile renders the cards plainly in flow. `isDesktop` starts false on the server, so
  // the SSR/first paint has no transform and is fully visible (SSR-safe, no-JS-safe).
  const useDesktopRecede = isDesktop && !reduce;

  return (
    <motion.article
      className="group relative origin-top overflow-hidden rounded-3xl border border-white/10 bg-ink-soft shadow-2xl shadow-black/60 transition-[border-color,box-shadow] duration-500 hover:border-white/20 md:grid md:grid-cols-[1fr_1fr]"
      style={useDesktopRecede ? { scale, filter: filterStr } : undefined}
    >
      {children}
    </motion.article>
  );
}

// ---- The deck island ----
export default function WorkDeck({ projects }: { projects: readonly WorkItem[] }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = projects.length;

  // One scroll tracker for the whole deck: progress 0 when the container's top reaches the
  // top of the viewport, 1 when its bottom does — i.e. across the full sticky-deck scroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div ref={containerRef} className="mt-8">
      {projects.map((w, i) => {
        const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
        const caseNum = String(i + 1).padStart(2, '0');

        return (
          <div
            key={w.slug}
            className="static mb-6 md:sticky md:mb-10"
            style={{
              top: `calc(6rem + ${i} * 2rem)`,
              zIndex: i + 1,
            }}
          >
            <CardTransform progress={scrollYProgress} index={i} total={total} isDesktop={isDesktop}>
              {/* Accent glow behind entire card */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  boxShadow: `0 0 80px 0 ${accent.glow}, inset 0 0 40px 0 ${accent.glow}`,
                }}
              />

              {/* ---- Image column ---- */}
              <div className="relative overflow-hidden md:min-h-[28rem]">
                <img
                  src={w.image}
                  alt={`${w.title} — ${w.industry}`}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full min-h-[220px] w-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Bottom-to-top gradient so content reads over image */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Case index badge — top-left */}
                <div
                  className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-xs font-bold tracking-widest text-white/80 backdrop-blur-sm"
                  style={{ borderColor: accent.border }}
                >
                  {caseNum}
                </div>

                {/* Industry pill — top-right */}
                <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm">
                  {w.industry}
                </div>

                {/* Stat hero — bottom of image, large and prominent */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <p className="iridescent-text font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl md:text-5xl">
                    {w.stat}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/50">
                    Key result
                  </p>
                </div>
              </div>

              {/* ---- Content column ---- */}
              <div className="flex flex-col justify-between p-7 sm:p-9 md:p-10">
                <div>
                  {/* Year + case number meta */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                      {w.year}
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{ color: accent.border }}
                    >
                      {caseNum}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-[2rem] md:leading-tight">
                    {w.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-4 text-base leading-relaxed text-white/60 sm:mt-5">
                    {w.summary}
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  {/* Service chips */}
                  <div className="flex flex-wrap gap-2">
                    {w.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/65 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Divider + metadata row */}
                  <div className="mt-5 flex items-center gap-6 border-t border-white/8 pt-5 text-sm">
                    <div>
                      <span className="block text-[10px] font-medium uppercase tracking-widest text-white/35">
                        Industry
                      </span>
                      <span className="mt-0.5 block font-semibold text-white/90">
                        {w.industry}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <span className="block text-[10px] font-medium uppercase tracking-widest text-white/35">
                        Year
                      </span>
                      <span className="mt-0.5 block font-semibold text-white/90">
                        {w.year}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <span className="block text-[10px] font-medium uppercase tracking-widest text-white/35">
                        Result
                      </span>
                      <span
                        className="mt-0.5 block font-bold"
                        style={{ color: accent.border }}
                      >
                        {w.stat}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle accent border line at top of card */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${accent.border}, transparent)` }}
              />
            </CardTransform>
          </div>
        );
      })}
    </div>
  );
}
