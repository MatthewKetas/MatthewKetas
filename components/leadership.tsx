import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { leadership } from "@/content/resume";

export function Leadership() {
  return (
    <Section id="leadership" refdes="ORG" title="Leadership" className="bg-board">
      <div className="divide-y divide-line border-y border-line">
        {leadership.map((entry, i) => (
          <Reveal key={entry.org} delay={i * 0.06}>
            <div className="grid gap-3 py-8 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
                  {entry.org}
                </h3>
                <p className="mt-1 text-sm font-medium text-trace">{entry.role}</p>
                <p className="silkscreen mt-2">{entry.dates}</p>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-muted md:self-center">{entry.line}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
