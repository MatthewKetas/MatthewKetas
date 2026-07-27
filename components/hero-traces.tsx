"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/**
 * Hand-routed PCB traces: horizontal runs with 45° bends, vias at
 * corners, pads at endpoints. pathLength is normalized so the CSS
 * power-on animation can draw each trace with dashoffset.
 *
 * The board re-powers every time it scrolls back into view: the
 * animated layers remount (keyed) on each re-entry, restarting the
 * CSS draw. Reduced motion still renders everything instantly — the
 * keyframes only run under prefers-reduced-motion: no-preference.
 */
export function HeroTraces() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [run, setRun] = useState(0);
  const wasInView = useRef(false);

  useEffect(() => {
    if (inView && !wasInView.current) setRun((r) => r + 1);
    wasInView.current = inView;
  }, [inView]);

  const traces = [
    { d: "M560 70 H430 L390 110 H270 L240 140 H182", pad: [170, 140], label: "U7", delay: 0 },
    { d: "M560 160 H465 L435 190 H325 L295 220 H226", pad: [214, 220], label: "C4", delay: 0.12 },
    { d: "M560 285 H480 L450 255 H350 L320 285 H262", pad: [250, 285], label: "R17", delay: 0.24 },
    { d: "M560 350 H440 L410 380 H310 L280 350 H212", pad: [200, 350], label: "J3", delay: 0.36 },
    { d: "M560 440 H475 L445 410 H355 L325 440 H252", pad: [240, 440], label: "C9", delay: 0.48 },
  ] as const;

  const vias: Array<[number, number]> = [
    [430, 70],
    [390, 110],
    [465, 160],
    [435, 190],
    [480, 285],
    [450, 255],
    [440, 350],
    [410, 380],
    [475, 440],
    [445, 410],
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 520"
      fill="none"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Dim under-layer: the unpowered copper */}
      <g stroke="var(--line)" strokeWidth="1.5">
        {traces.map((t) => (
          <path key={`ghost-${t.pad[0]}-${t.pad[1]}`} d={t.d} />
        ))}
      </g>
      {/* Powered layers remount per view entry so the draw replays */}
      <g key={run}>
        <g stroke="var(--trace)" strokeWidth="1.5" strokeLinecap="round">
          {traces.map((t) => (
            <path
              key={`live-${t.pad[0]}-${t.pad[1]}`}
              d={t.d}
              pathLength={1}
              className="hero-trace"
              style={{ animationDelay: `${t.delay}s` }}
            />
          ))}
        </g>
        <g stroke="var(--trace)" strokeOpacity="0.55">
          {vias.map(([x, y]) => (
            <circle key={`via-${x}-${y}`} cx={x} cy={y} r="3" />
          ))}
        </g>
        <g>
          {traces.map((t, i) => (
            <g
              key={`pad-${t.pad[0]}-${t.pad[1]}`}
              className="hero-pad"
              style={{ animationDelay: `${0.75 + i * 0.06}s` }}
            >
              <circle
                cx={t.pad[0]}
                cy={t.pad[1]}
                r="9"
                stroke="var(--trace)"
                strokeOpacity="0.6"
              />
              <circle cx={t.pad[0]} cy={t.pad[1]} r="3.5" fill="var(--trace-hot)" />
            </g>
          ))}
        </g>
      </g>
      {/* Silkscreen part numbers beside each component pad */}
      <g
        fill="var(--muted)"
        fillOpacity="0.55"
        fontSize="11"
        fontFamily="var(--font-plex-mono), monospace"
        letterSpacing="0.08em"
      >
        {traces.map((t) => (
          <text
            key={`label-${t.label}`}
            x={t.pad[0] - 16}
            y={t.pad[1] - 14}
            textAnchor="end"
          >
            {t.label}
          </text>
        ))}
      </g>
      {/* Dashed pin-header footprint (unpopulated) */}
      <g stroke="var(--muted)" strokeOpacity="0.35">
        <rect x="70" y="474" width="126" height="26" rx="3" strokeDasharray="5 4" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`pin-${i}`} cx={92 + i * 22} cy={487} r="3.5" />
        ))}
      </g>
      {/* Via-stitching field */}
      <g fill="var(--trace)" fillOpacity="0.22">
        {[0, 1, 2, 3, 4, 5].map((c) =>
          [0, 1, 2].map((r) => (
            <circle key={`stitch-${c}-${r}`} cx={464 + c * 16} cy={488 - r * 14} r="1.6" />
          )),
        )}
      </g>
    </svg>
  );
}
