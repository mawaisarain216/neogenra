import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) })

const services = [
  ['brand-design', 'Brand Design', 'Premium brand identities, logos, visual systems, and marketing visuals that make businesses bold, professional, and memorable.'],
  ['website-development', 'Development', 'Modern, fast, mobile-friendly websites and landing pages designed to build trust and convert visitors into business leads.'],
  ['digital-marketing', 'Digital Marketing', 'Smart marketing strategies, Meta ads, lead generation campaigns, content planning, and performance-focused execution.'],
  ['social-media-creative', 'Social Media Creative', 'Scroll-stopping social posts, reels covers, carousels, captions, and monthly content systems.'],
  ['ecommerce-creatives', 'eCommerce Creatives', 'High-converting product visuals, ad creatives, banners, and promotional content for online stores.'],
  ['creative-support', 'Creative Support', 'Ongoing creative direction, design support, marketing consultation, and campaign assistance.'],
]

const team = [
  ['obaid-ur-rehman', 'Obaid ur Rehman (Doctor Moon)', 'Founder & CEO'],
  ['atif-hussain', 'Atif Hussain', 'Co-Founder & Managing Director'],
  ['wajid-khanzada', 'Wajid Khanzada', 'Creative Lead'],
]

const testimonials = [
  ['Ali Shah Bungalows', 'Real Estate Brand', 'A Game-Changer for Our Real Estate Marketing! Neogenra delivered visually impressive graphic design and high-performing video ad campaigns that elevated our brand.'],
  ['Padel & Play Nawabshah', 'Sports & Recreation Brand', 'Professional, Creative, and Highly Supportive! Neogenra helped us with branding, social awareness campaigns, and launch media coverage.'],
  ['Qureshi Builders & Developers', 'Real Estate Developers', 'They Helped Us Expand Reach and Drive Results! Neogenra improved our online presence and social campaign performance with responsive, strategic execution.'],
]

const projectNames = [
  'Nutridana — Organic Food Brand Identity',
  'SIP Popular Water — Brand Identity',
  'QB FoodBasket — Food Delivery App Social Media',
  'Shaikh CCTV Solution — Social Media Design',
  'Padel & Play Nawabshah — Brand Identity',
  'Research & Diagnostic Centre — Branding',
  'Mughal Autos & Bike Parts — Branding Case Study',
  'Annnnovation.SYS — Apple-Inspired Tech Branding',
  'The Bright Future Academy — Brand Identity',
  'Qureshi Builders & Developers — Brand Identity',
  'Saleem Electronics — Brand Identity',
  'Ghulam Jillani — Brand Identity',
  'Piatto Cafe — Film / Social / Campaign',
  'Nawabshah Mall — TVC / Production',
]

const articles = [
  ['why-brand-systems-beat-one-off-logos', 'Why brand systems beat one-off logos', 'A strong brand is a repeatable operating system, not a single mark.', 'Brand'],
  ['designing-websites-that-sell', 'Designing websites that sell, not just impress', 'A premium website should make the next business action obvious.', 'Digital'],
  ['ai-is-changing-agency-production', 'AI is changing agency production', 'The opportunity is not replacing taste; it is increasing the surface area of good ideas.', 'AI'],
  ['what-makes-a-local-brand-feel-global', 'What makes a local brand feel global', 'Global perception comes from consistency, clarity and confidence—not geography.', 'Growth'],
]

const pages = [
  { slug: 'home', title: 'Neogenra — Premium Digital Creative Agency', description: 'Brand, creative, digital, growth and AI systems for ambitious businesses.', blocks: [
    { id: 'home-scene', type: 'scene3d', props: { eyebrow: 'NEOGENRA / EXPERIENCE ENGINE', title: 'A living system for brands that want to move.' } },
    { id: 'home-marquee', type: 'marquee', props: { items: ['BRAND', 'DIGITAL', 'CONTENT', 'GROWTH', 'AI'], speed: 24 } },
    { id: 'home-projects', type: 'projects', props: { title: 'Built to move.', limit: 6 } },
    { id: 'home-services', type: 'services', props: { title: 'One studio. Multiple ways to grow.', limit: 6 } },
    { id: 'home-stats', type: 'stats', props: { items: [{ value: '7+', label: 'Years of experience' }, { value: '100+', label: 'Projects delivered' }, { value: '10+', label: 'Industries served' }] } },
    { id: 'home-cta', type: 'cta', props: { kicker: 'START SOMETHING', title: 'Have a business problem worth solving?', cta: 'Build a project brief →', href: '/contact' } },
  ] },
  { slug: 'about', title: 'About Neogenra', description: 'A future-focused digital creative agency.', blocks: [{ id: 'about-hero', type: 'hero', props: { kicker: 'ABOUT NEOGENRA', title: 'A future-focused digital creative agency.', body: 'We combine strategy, design, technology and creative execution to help modern businesses grow.', cta: 'Start a project', href: '/contact' } }] },
  { slug: 'services', title: 'Services', description: 'Future-ready creative and digital solutions.', blocks: [{ id: 'services-hero', type: 'hero', props: { kicker: 'SERVICES', title: 'Future-ready creative & digital solutions.', body: 'Branding, websites, social creative, video, eCommerce creative and digital marketing.', cta: 'Book a strategy call', href: '/contact' } }, { id: 'services-live', type: 'services', props: { title: 'How can we help you?', limit: 6 } }] },
  { slug: 'work', title: 'Work', description: 'Selected Neogenra projects and case studies.', blocks: [{ id: 'work-hero', type: 'hero', props: { kicker: 'SELECTED WORK', title: 'Work that makes businesses move.', body: 'Brand systems, campaigns, digital experiences and growth work built around real business problems.' } }, { id: 'work-live', type: 'projects', props: { title: 'Selected work', limit: 12 } }] },
  { slug: 'industries', title: 'Industries', description: 'Creative and digital systems adapted to the way each industry buys and grows.', blocks: [{ id: 'industries-hero', type: 'hero', props: { kicker: 'INDUSTRIES', title: 'Different industries. Same obsession with growth.', body: 'Strategy, creative and digital systems adapted to how each category actually buys and grows.', cta: 'Start a project', href: '/contact' } }, { id: 'industries-copy', type: 'richText', props: { body: 'Real Estate · Sports & Recreation · Food & Beverage · Education · eCommerce · Professional Services · Technology · Retail' } }] },
  { slug: 'team', title: 'Team', description: 'The people behind Neogenra.', blocks: [{ id: 'team-hero', type: 'hero', props: { kicker: 'THE PEOPLE', title: 'Small team. Big ambition.', body: 'Strategy, creative, production and technology working as one studio.' } }, { id: 'team-live', type: 'team', props: { title: 'Meet the team', limit: 6 } }] },
  { slug: 'lab', title: 'Neogenra Lab', description: 'Experiments for what comes next.', blocks: [{ id: 'lab-hero', type: 'hero', props: { kicker: 'NEOGENRA LAB', title: 'Experiments for what comes next.', body: 'AI creative systems, interactive 3D, agentic websites, generative identity, automation and spatial commerce.' } }, { id: 'lab-copy', type: 'richText', props: { body: 'Prototype → test → learn → turn emerging technology into something useful.' } }] },
  { slug: 'insights', title: 'Insights', description: 'Ideas worth sharing from the Neogenra studio.', blocks: [{ id: 'insights-hero', type: 'hero', props: { kicker: 'INSIGHTS', title: 'Ideas worth sharing.', body: 'Practical thinking on brand systems, websites, growth, creative production and AI.' } }, { id: 'insights-copy', type: 'richText', props: { body: 'Why brand systems beat one-off logos\n\nDesigning websites that sell, not just impress\n\nAI is changing agency production\n\nWhat makes a local brand feel global' } }] },
  { slug: 'contact', title: 'Contact Neogenra', description: 'Start a project with Neogenra.', blocks: [{ id: 'contact-hero', type: 'hero', props: { kicker: 'START A PROJECT', title: 'Let’s build something powerful.', body: 'Tell us about your brand, challenge or next big idea.', cta: 'Send inquiry', href: '#contact' } }, { id: 'contact-form', type: 'contactForm', props: { title: 'Tell us what you are building.' } }] },
]

async function main() {
  for (let i = 0; i < services.length; i++) {
    const [slug, title, shortDescription] = services[i]
    await prisma.service.upsert({ where: { slug }, update: { title, shortDescription, sortOrder: i, published: true }, create: { slug, title, shortDescription, content: { blocks: [] }, sortOrder: i, published: true } })
  }

  for (let i = 0; i < team.length; i++) {
    const [slug, name, role] = team[i]
    await prisma.teamMember.upsert({ where: { slug }, update: { name, role, sortOrder: i, published: true }, create: { slug, name, role, sortOrder: i, published: true } })
  }

  for (let i = 0; i < testimonials.length; i++) {
    const [company, companyType, quote] = testimonials[i]
    const existing = await prisma.testimonial.findFirst({ where: { company } })
    const data = { name: company, company: companyType, quote, sortOrder: i, published: true }
    if (existing) await prisma.testimonial.update({ where: { id: existing.id }, data })
    else await prisma.testimonial.create({ data })
  }

  for (let i = 0; i < projectNames.length; i++) {
    const title = projectNames[i]
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const data = { slug, title, category: 'Portfolio', excerpt: 'Neogenra portfolio project.', content: { blocks: [{ id: `${i}-hero`, type: 'hero', props: { kicker: 'CASE STUDY', title, body: 'A focused creative system designed around the client challenge and business context.', cta: 'Start a project', href: '/contact' } }] }, featured: i < 6, status: 'PUBLISHED' }
    await prisma.project.upsert({ where: { slug }, update: data, create: data })
  }

  for (let i = 0; i < articles.length; i++) {
    const [slug, title, excerpt, category] = articles[i]
    const data = { slug, title, excerpt, category, status: 'PUBLISHED', publishedAt: new Date(`2026-${String(i + 1).padStart(2, '0')}-15T09:00:00Z`), content: { blocks: [{ id: `article-${i}`, type: 'richText', props: { body: excerpt } }] } }
    await prisma.article.upsert({ where: { slug }, update: data, create: data })
  }

  for (const page of pages) {
    const data = { title: page.title, description: page.description, content: { blocks: page.blocks }, status: 'PUBLISHED' }
    await prisma.page.upsert({ where: { slug: page.slug }, update: data, create: { slug: page.slug, ...data } })
  }

  const settings = {
    'brand.name': 'Neogenra',
    'brand.tagline': 'Premium Digital Creative Agency',
    'brand.logoText': 'NEOGENRA',
    'site.description': 'Neogenra helps businesses grow through branding, creative, websites, video, digital marketing and AI.',
    'site.locations': 'Nawabshah & Islamabad, Pakistan',
    'site.email': 'hello@neogenra.com',
    'site.phone': '+92 314 2710374',
    'design.theme': 'obsidian',
    'stats.experience': '7+',
    'stats.projects': '100+',
    'stats.industries': '10+',
    'stats.rating': '5.0',
  }
  for (const [key, value] of Object.entries(settings)) await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })

  const nav = [['Work', '/work'], ['Services', '/services'], ['Industries', '/industries'], ['About', '/about'], ['Team', '/team'], ['Lab', '/lab'], ['Insights', '/insights']]
  for (let i = 0; i < nav.length; i++) {
    const [label, href] = nav[i]
    await prisma.navigationItem.upsert({ where: { id: `seed-nav-${i}` }, update: { label, href, sortOrder: i, enabled: true }, create: { id: `seed-nav-${i}`, label, href, sortOrder: i, enabled: true } })
  }

  await prisma.builderTemplate.upsert({
    where: { slug: 'neogenra-cinematic-hero' },
    update: { name: 'Neogenra Cinematic Hero', type: 'SECTION', description: 'Reusable cinematic hero section.', content: { blocks: [{ id: 'template-hero', type: 'hero', props: { kicker: 'NEOGENRA', title: 'Ideas that become impossible to ignore.', body: 'Strategy, design and technology for ambitious brands.', cta: 'Start a project', href: '/contact' } }] } },
    create: { slug: 'neogenra-cinematic-hero', name: 'Neogenra Cinematic Hero', type: 'SECTION', description: 'Reusable cinematic hero section.', content: { blocks: [{ id: 'template-hero', type: 'hero', props: { kicker: 'NEOGENRA', title: 'Ideas that become impossible to ignore.', body: 'Strategy, design and technology for ambitious brands.', cta: 'Start a project', href: '/contact' } }] } },
  })

  console.log('Neogenra seed complete')
}

main().catch(error => { console.error(error); process.exitCode = 1 }).finally(() => prisma.$disconnect())
