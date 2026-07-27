import type { ReactNode } from "react";

/**
 * Board section frame. The silkscreen header reads like a PCB print:
 * reference designator, net name, and a hairline running to the edge.
 */
export function Section({
  id,
  refdes,
  title,
  children,
  className = "",
}: {
  id: string;
  refdes: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-3">
            <span className="silkscreen text-trace">{refdes}</span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full border border-trace/60" />
            <span className="silkscreen">{title}</span>
            <span aria-hidden className="h-px flex-1 bg-line" />
          </div>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
            <SectionTitle title={title} />
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

/* Title-cases the silkscreen net name for the visible heading. */
function SectionTitle({ title }: { title: string }) {
  return <>{title.toLowerCase().replace(/(^|\s|&\s)\S/g, (c) => c.toUpperCase())}</>;
}
