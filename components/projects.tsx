import { Section } from "@/components/ui/section";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/reveal";
import { projects, skills } from "@/content/resume";
import { site } from "@/content/site";

export function Projects() {
  return (
    <Section id="projects" refdes="LAB" title="Research & Projects">
      <div className="space-y-8">
        {projects.map((p, i) => (
          <Reveal key={p.refdes} delay={i * 0.06}>
            <article className="group rounded-xl border border-line bg-raised p-6 transition-colors hover:border-trace/40 md:p-9">
              <div className={`grid gap-8 md:grid-cols-[1fr_1.4fr] ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <p className="silkscreen flex items-center gap-3">
                    <span className="text-trace">{p.refdes}</span>
                    <span>{p.dates}</span>
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{p.role}</p>
                  <p className="mt-4 text-fg">{p.summary}</p>
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <ul className="max-w-[70ch] space-y-2.5 text-[0.9375rem] leading-relaxed text-muted">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5">
                        <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-trace/60" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-14 border-t border-line pt-8">
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-3">
              <span className="silkscreen text-trace">BOM</span>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full border border-trace/60" />
              <span className="silkscreen">Bill of materials</span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
            <h3 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Skills
            </h3>
          </div>
          <div className="flex flex-wrap items-start gap-x-12 gap-y-6">
            <div>
              <p className="silkscreen mb-3">Languages</p>
              <div className="flex max-w-xl flex-wrap gap-2">
                {skills.languages.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="silkscreen mb-3">Tools & platforms</p>
              <div className="flex max-w-xl flex-wrap gap-2">
                {skills.tools.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-muted">
            More on{" "}
            <a
              href={site.links.github}
              className="text-trace underline-offset-4 transition-colors hover:text-trace-hot hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
