import { ButtonLink } from "@/components/ui/button";
import { education } from "@/content/resume";
import { HeroTraces } from "@/components/hero-traces";

/**
 * First viewport: name and thesis on the left, the board powering on
 * to the right. Traces redraw each time the board scrolls back into
 * view (CSS animation, remounted per entry, reduced-motion safe).
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[88vh] max-w-6xl grid-cols-1 items-center gap-10 px-5 py-20 portrait:min-h-[44rem] md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <p className="silkscreen flex items-center gap-3">
            <span className="text-trace">PWR</span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full border border-trace/60" />
            <span>Pitt ECE · Class of 2027</span>
          </p>
          <h1 className="mt-5 text-balance font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl">
            Matthew Ketas
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            I build across the hardware-software boundary — EEG signal pipelines,
            ESP32 firmware, industrial motion software in .NET, and the boards
            underneath them.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="#experience" size="lg">
              View experience
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost" size="lg">
              Get in touch
            </ButtonLink>
          </div>
          <p className="silkscreen mt-12 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>GPA {education.gpa}</span>
            <span aria-hidden className="text-line">/</span>
            <span>Frederick Honors College</span>
            <span aria-hidden className="text-line">/</span>
            <span>{education.minor}</span>
          </p>
        </div>

        <div aria-hidden className="pointer-events-none relative hidden h-[460px] select-none lg:block">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(closest-side at 45% 50%, color-mix(in srgb, var(--trace) 12%, transparent), transparent 70%)",
            }}
          />
          <HeroTraces />
        </div>
      </div>
      {/* Faint board texture behind small screens, masked away from the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] lg:hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 45%, black 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 45%, black 85%)",
        }}
      >
        <HeroTraces />
      </div>
    </section>
  );
}
