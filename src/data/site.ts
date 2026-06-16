export const site = {
  name: 'Rabia Gul',
  role: 'Shopify Expert',
  email: 'contact@rabia-gul.com',
  whatsapp: '923482351478', // wa.me intl format (PK +92)
  bookingUrl: '#',
  web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
  url: 'https://rabia-gul.com',
  description:
    'Freelance Shopify Expert building high-converting, scalable Shopify and Shopify Plus stores — development, design, migration, integrations and growth.',
  socials: [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'WhatsApp', href: 'https://wa.me/923482351478' },
  ],
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    badge: 'Available for freelance projects',
    titleStart: 'Shopify Expert for ',
    titleHighlight: 'high-converting',
    titleEnd: ' & scalable stores',
    subtitle:
      'I design, build and optimize Shopify & Shopify Plus stores that load fast, convert better and scale with your brand.',
  },
  logos: [
    { name: 'Brand One', src: '/logos/logo-1.svg' },
    { name: 'Brand Two', src: '/logos/logo-2.svg' },
    { name: 'Brand Three', src: '/logos/logo-3.svg' },
    { name: 'Brand Four', src: '/logos/logo-4.svg' },
    { name: 'Brand Five', src: '/logos/logo-5.svg' },
    { name: 'Brand Six', src: '/logos/logo-6.svg' },
  ],
  services: [
    { title: 'Development', shape: '/shapes/shape-1.svg', points: ['Custom themes', 'Apps & extensions', 'Speed optimization', 'Headless & B2B'] },
    { title: 'Design', shape: '/shapes/shape-2.svg', points: ['UX / UI', 'Conversion-led design', 'Usability audits'] },
    { title: 'Migration', shape: '/shapes/shape-3.svg', points: ['WooCommerce → Shopify', 'Magento → Shopify', 'Data & SEO preservation'] },
    { title: 'Integrations', shape: '/shapes/shape-4.svg', points: ['ERP / PIM / CRM', 'Payments & shipping', 'Marketplaces'] },
    { title: 'Growth / CRO', shape: '/shapes/shape-5.svg', points: ['Conversion optimization', 'Email & SEO', 'Analytics & consulting'] },
  ],
  workIntro: 'Real stories, real results — see what I’ve made possible.',
  work: [
    { slug: 'case-1', client: 'Brand One', logo: '/logos/logo-1.svg', title: 'Placeholder Case Study One', industry: 'Fashion', year: '2025', stat: '+38% conversion', image: '/work/work-1.svg', services: ['Development', 'Design', 'CRO'], summary: 'Replace with a real case study: the problem, what Rabia built, and the measurable result.' },
    { slug: 'case-2', client: 'Brand Two', logo: '/logos/logo-2.svg', title: 'Placeholder Case Study Two', industry: 'Beauty', year: '2025', stat: '2.1s → 0.9s LCP', image: '/work/work-2.svg', services: ['Migration', 'Speed', 'Integrations'], summary: 'Replace with a real case study: the problem, what Rabia built, and the measurable result.' },
    { slug: 'case-3', client: 'Brand Three', logo: '/logos/logo-3.svg', title: 'Placeholder Case Study Three', industry: 'Home & Decor', year: '2024', stat: '+24% AOV', image: '/work/work-3.svg', services: ['Theme', 'Klaviyo', 'Growth'], summary: 'Replace with a real case study: the problem, what Rabia built, and the measurable result.' },
  ],
  stats: [
    { value: '50+', label: 'Stores launched' },
    { value: '90%', label: 'Client satisfaction' },
    { value: '4.9/5', label: 'Average rating' },
    { value: 'Partner', label: 'Shopify Partner' },
  ],
  about: {
    photo: '/avatars/rabia.svg',
    bio: "Placeholder bio — replace with Rabia’s story: years of Shopify experience, specialties, the kinds of brands she works with, and what makes her approach different.",
    skills: ['Shopify Plus', 'Liquid', 'Hydrogen', 'Tailwind', 'JavaScript', 'Klaviyo', 'GA4', 'CRO'],
  },
  testimonialsIntro: 'Trusted by founders to ship stores that perform.',
  testimonials: [
    { quote: 'Placeholder testimonial — replace with a real client quote that highlights the result Rabia delivered and what it was like to work with her.', author: 'Client Name', role: 'Founder', company: 'Brand One', avatar: '/avatars/client-1.svg', rating: 5, featured: true },
    { quote: 'Placeholder testimonial — replace with a real client quote.', author: 'Client Name', role: 'CEO', company: 'Brand Two', avatar: '/avatars/client-2.svg', rating: 5, featured: false },
    { quote: 'Placeholder testimonial — replace with a real client quote.', author: 'Client Name', role: 'Head of Ecommerce', company: 'Brand Three', avatar: '/avatars/client-1.svg', rating: 5, featured: false },
  ],
  footer: {
    cta: 'Let’s talk about your next project',
    availability: 'Available for freelance projects',
    hours: 'Mon–Fri · 9am–6pm (PKT, GMT+5)',
    serviceLinks: ['Development', 'Design', 'Migration', 'Integrations', 'Growth / CRO'],
  },
} as const;

export type Site = typeof site;
