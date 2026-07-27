"use client";

import { useState } from "react";
import { Section } from "@/components/ui/section";
import { Button, ButtonLink } from "@/components/ui/button";
import { contactSchema } from "@/lib/contact-schema";
import { site } from "@/content/site";

type Status = { kind: "idle" } | { kind: "opened" } | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-lg border border-line bg-raised px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/80 transition-colors focus:border-trace/50 pointer-coarse:py-3";

// Static site, no backend: hand off to the visitor's own mail client.
function buildMailto(name: string, email: string, subject: string, message: string): string {
  const body = `${message}\n\n— ${name} (${email})`;
  const params = new URLSearchParams({ subject: `[Portfolio] ${subject}`, body });
  return `mailto:${site.email}?${params.toString()}`;
}

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      setStatus({ kind: "error", message: parsed.error.issues[0]?.message ?? "Check the form and try again." });
      return;
    }
    setFieldErrors({});
    const { name, email, subject, message } = parsed.data;
    window.location.href = buildMailto(name, email, subject, message);
    setStatus({ kind: "opened" });
  }

  return (
    <Section id="contact" refdes="IO" title="Contact">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-line bg-raised p-6 md:p-8"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="silkscreen mb-2 block">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                autoComplete="name"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                className={`${inputClass} ${fieldErrors.name ? "border-error/70" : ""}`}
              />
              <FieldError id="name-error" message={fieldErrors.name} />
            </div>
            <div>
              <label htmlFor="email" className="silkscreen mb-2 block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className={`${inputClass} ${fieldErrors.email ? "border-error/70" : ""}`}
              />
              <FieldError id="email-error" message={fieldErrors.email} />
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="subject" className="silkscreen mb-2 block">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              required
              placeholder="Let's build something, research, IEEE…"
              aria-invalid={!!fieldErrors.subject}
              aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
              className={`${inputClass} ${fieldErrors.subject ? "border-error/70" : ""}`}
            />
            <FieldError id="subject-error" message={fieldErrors.subject} />
          </div>
          <div className="mt-5">
            <label htmlFor="message" className="silkscreen mb-2 block">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? "message-error" : undefined}
              className={`${inputClass} ${fieldErrors.message ? "border-error/70" : ""}`}
            />
            <FieldError id="message-error" message={fieldErrors.message} />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div aria-live="polite" className="text-sm">
              {status.kind === "opened" && (
                <p className="text-trace-hot">
                  Your email app should open with this message ready to send.
                </p>
              )}
              {status.kind === "error" && <p className="text-error">{status.message}</p>}
            </div>
            <Button type="submit">Send message</Button>
          </div>
        </form>

        <div className="flex flex-col justify-between gap-8 rounded-xl border border-line bg-raised p-6 md:p-8">
          <div>
            <p className="silkscreen mb-4">Connect</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center gap-3 text-fg transition-colors hover:text-trace-hot"
                >
                  <MailIcon />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-fg transition-colors hover:text-trace-hot"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-fg transition-colors hover:text-trace-hot"
                >
                  <GitHubIcon />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm text-muted">
              Interested in seeing the full picture? Download the resume here.
            </p>
            <ButtonLink href={site.resumePath} size="lg" className="w-full" download>
              Download resume
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-error">
      {message}
    </p>
  );
}

const iconClass = "h-5 w-5 text-trace transition-colors group-hover:text-trace-hot";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.25h4.52V23H.24V8.25ZM8.34 8.25h4.33v2.01h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.92V23h-4.52v-7.13c0-1.7-.03-3.89-2.37-3.89-2.37 0-2.73 1.85-2.73 3.76V23H8.34V8.25Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.05.78 2.13v3.16c0 .3.2.67.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
