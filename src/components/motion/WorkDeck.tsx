import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
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

// ---- Single card that applies scroll-driven scale + brightness ----
// cardRef   = the <article> itself
// triggerRef = the element whose scroll position drives the transform
// isLast    = controls the target values and offset interpretation
// isDesktop = if false, use whileInView staggered entrance instead
type CardTransformProps = {
  children: ReactNode;
  triggerRef: React.RefObject<HTMLElement | null>;
  isLast: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  index: number;
  isDesktop: boolean;
};

function CardTransform({
  children,
  triggerRef,
  isLast,
  containerRef,
  index,
  isDesktop,
}: CardTransformProps) {
  const reduce = useReducedMotion();

  // Desktop: scroll-driven recede via the next card wrapper (or container for last)
  const { scrollYProgress: progressFromNext } = useScroll({
    target: triggerRef as React.RefObject<HTMLElement>,
    offset: isLast ? ['end 85%', 'end start'] : ['start end', 'start center'],
  });

  const scale = useTransform(
    progressFromNext,
    [0, 1],
    [1, isLast ? 0.96 : 0.9],
  );
  const brightness = useTransform(
    progressFromNext,
    [0, 1],
    [1, isLast ? 0.78 : 0.5],
  );
  const filterStr = useTransform(brightness, (b) => `brightness(${b})`);

  // Cards are ALWAYS visible (opacity 1) — never gate the case-study content behind
  // an opacity entrance. Desktop gets the scroll-driven stacking recede (scale + dim);
  // mobile renders the cards plainly in flow. `isDesktop` starts false on the server, so
  // the SSR/first paint has no transform and is fully visible (SSR-safe, no-JS-safe).
  const useDesktopRecede = isDesktop && !reduce;

  return (
    <motion.article
      className="group grid origin-top overflow-hidden rounded-3xl border border-white/10 bg-ink-soft shadow-2xl shadow-black/60 transition-[border-color] duration-300 hover:border-white/25 md:grid-cols-2"
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

  // Refs for each sticky wrapper (one per card) — drives "next card" trigger
  const wrapperRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
    projects.map(() => ({ current: null })),
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div ref={containerRef} className="mt-6 pb-6 md:pb-[8vh]">
      {projects.map((w, i) => {
        const isLast = i === projects.length - 1;
        // Non-last: trigger = next card's sticky wrapper
        // Last: trigger = the container itself
        const triggerRef = isLast
          ? (containerRef as React.RefObject<HTMLElement | null>)
          : (wrapperRefs.current[i + 1] as React.RefObject<HTMLElement | null>);

        return (
          <div
            key={w.slug}
            ref={wrapperRefs.current[i] as React.Ref<HTMLDivElement>}
            className="static mb-6 md:sticky md:mb-10"
            style={{
              top: `calc(6rem + ${i} * 2rem)`,
              zIndex: i + 1,
            }}
          >
            <CardTransform
              triggerRef={triggerRef}
              isLast={isLast}
              containerRef={containerRef as React.RefObject<HTMLElement | null>}
              index={i}
              isDesktop={isDesktop}
            >
              {/* Image */}
              <div className="relative overflow-hidden md:min-h-[24rem]">
                <img
                  src={w.image}
                  alt={`${w.title} — ${w.industry}`}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute right-[-15%] top-[-15%] h-1/2 w-1/2 rounded-full opacity-25 blur-3xl iridescent" />
                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70 backdrop-blur">
                  Case 0{i + 1}
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center p-7 sm:p-9 md:p-10">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  {w.title}
                </h3>
                <p className="mt-3 max-w-xl text-white/65 sm:mt-4">{w.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                  {w.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5 text-sm sm:mt-8 sm:pt-6">
                  <div>
                    <span className="block text-white/40">Industry</span>
                    <span className="font-medium">{w.industry}</span>
                  </div>
                  <div>
                    <span className="block text-white/40">Year</span>
                    <span className="font-medium">{w.year}</span>
                  </div>
                  <div>
                    <span className="block text-white/40">Result</span>
                    <span className="font-medium">{w.stat}</span>
                  </div>
                </div>
              </div>
            </CardTransform>
          </div>
        );
      })}
    </div>
  );
}
