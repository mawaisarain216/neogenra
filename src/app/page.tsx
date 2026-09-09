import { getCmsPage } from '@/lib/cms-page';
import { RenderBlocks } from '@/lib/blocks';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { projects, services, industries } from '@/lib/content';
import ProjectCard from '@/components/ProjectCard';
import type { CSSProperties } from 'react';
import CinematicHero from '@/components/visual/CinematicHero';

export default async function Home() {
  const cms = await getCmsPage('home');

  if (cms) {
    return (
      <main>
        <CinematicHero />
        <div className="px-6 pb-32 pt-20">
          <div className="mx-auto max-w-6xl">
            <RenderBlocks blocks={cms.content} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <CinematicHero />
      <section className="experience-intro" data-reveal>
        <div className="experience-intro-inner">
          <p className="eyebrow">A connected creative system</p>
          <h2>
            Not another agency website.
            <br />
            <span>A living demonstration of what Neogenra can build.</span>
          </h2>
          <p className="lede">
            Strategy becomes identity. Identity becomes experience. Experience becomes demand. Every layer is designed to move the business forward.
          </p>
        </div>
      </section>

      <section className="px-6 py-32" data-reveal>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[.25em] text-white/40">Selected work</div>
              <h2 className="section-title">Built to move.</h2>
            </div>
            <Link href="/work" className="hidden text-white/50 hover:text-white md:block">View all →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
          </div>
        </div>
      </section>

      <section className="capability-section" data-reveal>
        <div className="mx-auto max-w-6xl px-6 py-32">
          <div className="mb-12 max-w-3xl">
            <div className="mb-3 text-xs uppercase tracking-[.25em] text-white/40">Capabilities</div>
            <h2 className="section-title">One studio.<br /><span className="text-white/35">Five ways to grow.</span></h2>
          </div>
          <div className="divide-y divide-white/10">
            {services.map(([name, desc], i) => (
              <Link href="/services" key={name} className="capability-row group">
                <div className="flex items-center gap-5">
                  <span className="text-sm text-white/30">0{i + 1}</span>
                  <span className="text-3xl font-semibold tracking-[-.04em]">{name}</span>
                </div>
                <div className="hidden max-w-md text-sm leading-6 text-white/45 md:block">{desc}</div>
                <Plus className="text-white/35 transition group-hover:rotate-45 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-32" data-reveal>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-xs uppercase tracking-[.25em] text-white/40">Industries</div>
          <div className="industry-cloud">
            {industries.map((x, i) => <span key={x} style={{ '--i': i } as CSSProperties}>{x}</span>)}
          </div>
        </div>
      </section>

      <section className="px-6 pb-32" data-reveal>
        <div className="contact-glass mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] p-8 md:p-16">
          <div className="contact-glow" />
          <div className="relative max-w-3xl">
            <div className="mb-5 text-xs uppercase tracking-[.25em] text-white/40">Start something</div>
            <h2 className="section-title">Have a business problem worth solving?</h2>
            <Link href="/contact" className="magnetic-cta mt-10 inline-flex">
              Build a project brief <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
