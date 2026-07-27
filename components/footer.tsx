import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 md:px-8">
        <p className="silkscreen">
          Matthew Ketas · <span className="text-trace">REV 2027</span>
        </p>
        <p className="silkscreen hidden md:block">Fab: Next.js / GitHub Pages</p>
        <div className="flex items-center gap-6">
          <a href={`mailto:${site.email}`} className="silkscreen transition-colors hover:text-fg">
            Email
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="silkscreen transition-colors hover:text-fg"
          >
            LinkedIn
          </a>
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="silkscreen transition-colors hover:text-fg"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
