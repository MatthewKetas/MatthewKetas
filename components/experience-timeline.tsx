"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { experience } from "@/content/resume";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/reveal";

/**
 * The signature element: a PCB trace bundle running down the section,
 * drawn in sync with scroll, cyan fading to violet (the page's one
 * gradient). Jobs branch off it as pads. Geometry is measured from the
 * rendered rows so 45° bends stay exact at every width.
 */

type Geom = { w: number; h: number; cx: number; ys: number[] };

function lanePath(x: number, h: number, jogs: Array<{ y: number; dx: number }>): string {
  let d = `M ${x} 0`;
  for (const j of jogs) {
    const step = Math.abs(j.dx);
    // down to the jog, 45° out, short run, 45° back to the lane
    d += ` L ${x} ${j.y} L ${x + j.dx} ${j.y + step} L ${x + j.dx} ${j.y + step + 34} L ${x} ${j.y + step * 2 + 34}`;
  }
  d += ` L ${x} ${h}`;
  return d;
}

function buildLanes(geom: Geom) {
  const { h, cx, ys } = geom;
  const unit = cx > 60 ? 14 : 8;
  const offsets = [0, -unit, unit, -unit * 2, unit * 2];
  return offsets.map((off, lane) => {
    const jogs: Array<{ y: number; dx: number }> = [];
    // jog once inside each gap between consecutive nodes, staggered per lane
    for (let g = 0; g < ys.length - 1; g++) {
      const mid = (ys[g] + ys[g + 1]) / 2;
      const y = mid - 40 + lane * 18;
      const dir = (g + lane) % 2 === 0 ? 1 : -1;
      jogs.push({ y, dx: dir * unit * 0.85 });
    }
    // one settling jog after the last node
    const last = ys[ys.length - 1];
    if (last && h - last > 120) {
      jogs.push({ y: last + 50 + lane * 14, dx: (lane % 2 === 0 ? -1 : 1) * unit * 0.85 });
    }
    return { d: lanePath(cx + off, h, jogs), main: lane === 0, startX: cx + off };
  });
}

export function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [geom, setGeom] = useState<Geom | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      // only visible nodes — each row renders a hidden twin for the other breakpoint
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]")).filter(
        (n) => n.getBoundingClientRect().width > 0,
      );
      if (nodes.length === 0) return;
      const ys = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top - rect.top + r.height / 2;
      });
      const first = nodes[0].getBoundingClientRect();
      const cx = first.left - rect.left + first.width / 2;
      setGeom({ w: rect.width, h: rect.height, cx, ys });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lanes = geom ? buildLanes(geom) : [];

  return (
    <div ref={containerRef} className="relative">
      {geom && (
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${geom.w} ${geom.h}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient
              id="trace-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2={geom.h}
            >
              <stop offset="0" stopColor="var(--trace)" />
              <stop offset="1" stopColor="var(--violet)" />
            </linearGradient>
            <filter id="trace-glow" x="-200%" y="-20%" width="500%" height="140%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          {/* Unpowered copper beneath */}
          <g stroke="var(--line)" strokeWidth="1.5">
            {lanes.map((l, i) => (
              <path key={`ghost-${i}`} d={l.d} />
            ))}
          </g>
          {/* Soft LED glow under the main lane */}
          {lanes
            .filter((l) => l.main)
            .map((l) => (
              <motion.path
                key="glow"
                d={l.d}
                stroke="var(--trace)"
                strokeWidth="5"
                strokeOpacity="0.22"
                filter="url(#trace-glow)"
                style={{ pathLength: reduced ? 1 : progress }}
              />
            ))}
          {/* Powered bundle draws with scroll */}
          <g strokeWidth="1.5" strokeLinecap="round">
            {lanes.map((l, i) => (
              <motion.path
                key={`live-${i}`}
                d={l.d}
                stroke="url(#trace-gradient)"
                strokeOpacity={l.main ? 1 : 0.45}
                style={{ pathLength: reduced ? 1 : progress }}
              />
            ))}
          </g>
          {/* Fan-out terminations: entry pads at top, exit pads at bottom */}
          <g>
            {lanes.map((l, i) => {
              const x = l.startX;
              return (
                <g key={`term-${i}`}>
                  <circle cx={x} cy={3} r="2.5" fill="var(--trace)" fillOpacity="0.5" />
                  <circle
                    cx={x}
                    cy={geom.h - 3}
                    r="2.5"
                    fill="var(--violet)"
                    fillOpacity="0.5"
                  />
                </g>
              );
            })}
          </g>
        </svg>
      )}

      <ol className="relative space-y-16 md:space-y-20">
        {experience.map((job, i) => {
          const left = i % 2 === 0;
          const body = (
            <Reveal>
              <h3 className="font-display text-xl font-semibold tracking-tight text-fg md:text-2xl">
                {job.company}
              </h3>
              <p className="mt-1 text-sm font-medium text-trace">{job.role}</p>
              <p className="silkscreen mt-2 md:hidden">
                {job.dates} · {job.location}
              </p>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-muted">
                {job.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-trace/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </Reveal>
          );
          const meta = (
            <Reveal className={`hidden md:block ${left ? "text-left" : "text-right"}`}>
              <p className="silkscreen">{job.dates}</p>
              <p className="silkscreen mt-1">{job.location}</p>
            </Reveal>
          );
          return (
            <li
              key={job.refdes}
              className="grid grid-cols-[56px_1fr] gap-x-4 md:grid-cols-[1fr_140px_1fr] md:gap-x-8"
            >
              {/* mobile: node column */}
              <div className="flex justify-center md:hidden">
                <TimelineNode refdes={job.refdes} />
              </div>
              <div className="md:hidden">{body}</div>

              {/* desktop: alternating sides — natural grid order is col1 | node | col3 */}
              <div className="hidden md:block">{left ? body : meta}</div>
              <div className="hidden justify-center md:flex">
                <TimelineNode refdes={job.refdes} side={left ? "left" : "right"} />
              </div>
              <div className="hidden md:block">{left ? meta : body}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TimelineNode({ refdes, side }: { refdes: string; side?: "left" | "right" }) {
  return (
    <div className="relative flex h-10 items-center" data-node>
      {/* branch stub toward the content card */}
      {side && (
        <span
          aria-hidden
          className="absolute top-1/2 h-px w-10 -translate-y-1/2 bg-trace/30"
          style={side === "left" ? { right: "100%" } : { left: "100%" }}
        />
      )}
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-trace/50 bg-abyss shadow-[0_0_16px_2px_color-mix(in_srgb,var(--trace)_25%,transparent)]">
        <span className="silkscreen text-[0.65rem] text-trace">{refdes}</span>
      </span>
    </div>
  );
}
