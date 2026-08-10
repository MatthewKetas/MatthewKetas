/**
 * DIRECTION CONTRACT
 * THESIS: A computer engineer's portfolio rendered as a powered-on PCB; refuses
 * the generic dark-hero-with-cards portfolio arrangement.
 * OWN-WORLD: Near-black navy board (#05090F), cyan traces (#35C4F2) with one
 * cyan→violet gradient bundle, silkscreen mono labels (PWR/EDU/XP/LAB/ORG/IO),
 * pill buttons, pad-and-via SVG geometry with exact 45° bends.
 * STORY: A recruiter lands, reads "hardware-software boundary," follows the
 * trace bundle through three jobs, sees research proof, downloads the resume or
 * sends a message.
 * FIRST VIEWPORT: Name + thesis left; board powering on right (traces draw once,
 * pads pulse); primary CTA "View experience," ghost "Get in touch"; silkscreen
 * GPA/honors legend beneath.
 * FORM: Pinned by user-approved reference screenshots and SYSTEM_DESIGN.md —
 * no seed roll; staging: alternating timeline with measured trace geometry.
 */
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Academics } from "@/components/academics";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Projects } from "@/components/projects";
import { Leadership } from "@/components/leadership";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Section } from "@/components/ui/section";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Academics />
        <Section id="experience" refdes="XP" title="Experience" className="bg-board">
          <ExperienceTimeline />
        </Section>
        <Projects />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
