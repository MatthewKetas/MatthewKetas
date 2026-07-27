import Link from "next/link";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="sticky top-4 z-40 px-4">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center gap-4 rounded-full border border-line bg-board/70 py-2.5 pl-5 pr-2.5 backdrop-blur-md md:pl-6"
      >
        <Link
          href="#top"
          className="shrink-0 font-display text-sm font-semibold tracking-tight text-fg"
        >
          Matthew Ketas
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-start gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center md:gap-7">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap py-2 text-xs text-muted transition-colors hover:text-fg pointer-coarse:py-3 md:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <ButtonLink href="#contact" size="md" className="shrink-0">
          Contact
        </ButtonLink>
      </nav>
    </header>
  );
}
