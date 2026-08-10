import { Section } from "@/components/ui/section";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/reveal";
import { education } from "@/content/resume";

export function Academics() {
  return (
    <Section id="academics" refdes="EDU" title="Academics">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <Reveal>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-fg md:text-3xl">
            {education.school}
          </h3>
          <p className="silkscreen mt-3">{education.units}</p>
          <p className="mt-6 text-lg text-fg">{education.degree}</p>
          <p className="mt-1 text-muted">
            {education.minor} · Graduating {education.graduation}
          </p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display text-5xl font-semibold tracking-tight text-trace">
              {education.gpa.split(" ")[0]}
            </span>
            <span className="silkscreen">/ 4.0 GPA</span>
          </div>
        </Reveal>

        <div className="space-y-10">
          <Reveal delay={0.06}>
            <p className="silkscreen mb-4">Relevant coursework</p>
            <div className="flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="silkscreen mb-4">International study</p>
            <div className="grid grid-cols-3 gap-3">
              {education.abroad.map((a) => (
                <a
                  key={a.code}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Read the study-abroad blog from ${a.place}`}
                  aria-label={`Read the study-abroad blog from ${a.place} (opens in a new tab)`}
                  className="group relative rounded-xl border border-line bg-raised px-4 py-3 text-center transition-colors hover:border-trace/40"
                >
                  <span
                    aria-hidden
                    className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full border border-trace/35 transition-colors duration-200 group-hover:border-trace-hot group-hover:bg-trace-hot"
                  />
                  <p className="font-display text-lg font-semibold text-fg">{a.code}</p>
                  <p className="silkscreen mt-1">{a.year}</p>
                  <p className="mt-1 text-xs text-muted transition-colors group-hover:text-trace-hot">
                    {a.place}
                  </p>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
