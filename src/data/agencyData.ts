import {
  ServiceItem,
  ServiceCategory,
  PortfolioItem,
  PricingPlan,
  Testimonial,
  BlogPost,
  FAQItem,
  IndustryItem,
} from "../types";

export const SERVICES_DATA: ServiceItem[] = [
  // CATEGORY 01 — BUILD
  {
    id: "ai-web-development",
    category: "BUILD",
    number: "01",
    emoji: "🤖",
    title: "AI Web Development",
    shortDescription: "Build modern, intelligent websites that combine premium design, powerful functionality, and AI-powered experiences.",
    outcome: "Turn your online presence into a powerful digital asset that attracts and converts customers.",
    startingPrice: "From PKR 20,000",
    capabilities: [
      "AI-powered websites",
      "Business websites",
      "Landing pages",
      "Responsive development",
      "AI integrations",
      "Forms and lead capture",
      "API integrations",
      "Analytics",
      "Performance optimization"
    ],
    idealFor: "Growing businesses, clinics, e-commerce, and professional service firms needing a modern, intelligent web presence.",
    ctaText: "Build My Website →",
    badge: "Core Foundation"
  },
  {
    id: "saas-mvp-building",
    category: "BUILD",
    number: "02",
    emoji: "🚀",
    title: "SaaS MVP Building",
    shortDescription: "Turn your software idea into a functional MVP designed to validate, launch, and improve.",
    outcome: "Turn your idea into a working SaaS product without spending months building unnecessary features.",
    startingPrice: "From PKR 29,999",
    capabilities: [
      "SaaS MVP development",
      "Full-stack development",
      "Authentication",
      "User dashboards",
      "Databases",
      "API integrations",
      "AI features",
      "Payments",
      "Admin panels",
      "MVP architecture"
    ],
    idealFor: "Startup founders, innovators, and businesses looking to rapidly validate and ship software products.",
    ctaText: "Build My SaaS →",
    badge: "Fast Launch"
  },
  {
    id: "ui-ux-design",
    category: "BUILD",
    number: "03",
    emoji: "🎨",
    title: "UI/UX Design for SaaS & Business Websites",
    shortDescription: "Create intuitive, premium digital experiences that make your product easier to understand, use, and love.",
    outcome: "Turn complex ideas into intuitive experiences that users love and businesses can grow with.",
    startingPrice: "From PKR 25,000",
    capabilities: [
      "SaaS UI/UX",
      "Website UI/UX",
      "Landing pages",
      "User flows",
      "Wireframes",
      "Prototypes",
      "Design systems",
      "Responsive design",
      "Conversion-focused interfaces"
    ],
    idealFor: "Software teams, web applications, and brands that need high-retention, conversion-engineered interfaces.",
    ctaText: "Design My Experience →",
    badge: "Design Systems"
  },

  // CATEGORY 02 — GROW
  {
    id: "digital-marketing-lead-gen",
    category: "GROW",
    number: "04",
    emoji: "📈",
    title: "Digital Marketing + Lead Generation",
    shortDescription: "Build a strategic digital presence designed to attract the right audience and generate qualified opportunities.",
    outcome: "Turn attention into qualified leads and consistent business opportunities.",
    startingPrice: "From PKR 30,000/month",
    capabilities: [
      "Digital marketing strategy",
      "Lead generation",
      "SEO",
      "Social media strategy",
      "Content marketing",
      "Marketing funnels",
      "Landing pages",
      "Conversion optimization",
      "Analytics"
    ],
    idealFor: "B2B businesses, agencies, clinics, and professional firms seeking consistent inbound lead flow.",
    ctaText: "Grow My Business →",
    badge: "Recurring Growth"
  },
  {
    id: "google-ads-ppc",
    category: "GROW",
    number: "05",
    emoji: "🎯",
    title: "Google Ads / PPC",
    shortDescription: "Reach customers actively searching for your products or services through targeted, performance-focused advertising.",
    outcome: "Put your business in front of high-intent customers who are ready to take action.",
    startingPrice: "From PKR 20,000/month",
    capabilities: [
      "Google Search Ads",
      "PPC campaigns",
      "Keyword research",
      "Ad copy",
      "Campaign setup",
      "Conversion tracking",
      "Landing-page optimization",
      "Performance monitoring",
      "Campaign optimization"
    ],
    idealFor: "Businesses seeking high-intent search traffic, direct phone calls, and immediate customer inquiries.",
    ctaText: "Start My Campaign →",
    badge: "High Intent"
  },
  {
    id: "affiliate-marketing-growth",
    category: "GROW",
    number: "06",
    emoji: "🔗",
    title: "Affiliate Marketing & Growth Systems",
    shortDescription: "Build structured affiliate systems that turn strategic partnerships into measurable acquisition channels.",
    outcome: "Build new acquisition channels that turn strategic partnerships into measurable growth.",
    startingPrice: "From PKR 25,000",
    capabilities: [
      "Affiliate strategy",
      "Affiliate program setup",
      "Tracking systems",
      "Commission structures",
      "Partner onboarding",
      "Campaign management",
      "Performance tracking",
      "Growth optimization"
    ],
    idealFor: "E-Commerce brands, digital products, and SaaS platforms looking to leverage referral and creator networks.",
    ctaText: "Build My Affiliate System →",
    badge: "Partner Channels"
  },

  // CATEGORY 03 — AI
  {
    id: "ai-customer-support-bots",
    category: "AI",
    number: "07",
    emoji: "💬",
    title: "AI Customer Support Bots",
    shortDescription: "Deploy intelligent AI assistants that answer questions, support customers, and qualify leads around the clock.",
    outcome: "Turn customer questions into instant answers, qualified leads, and better support.",
    startingPrice: "From PKR 19,999",
    capabilities: [
      "Website AI chat",
      "FAQ automation",
      "Knowledge-base integration",
      "RAG-powered responses",
      "Lead qualification",
      "Customer support",
      "Human handoff",
      "Multilingual support",
      "Business-specific AI knowledge"
    ],
    idealFor: "E-Commerce stores, real estate agencies, healthcare clinics, and service businesses wanting 24/7 response.",
    ctaText: "Build My AI Assistant →",
    badge: "24/7 Availability"
  },
  {
    id: "ai-voice-agents",
    category: "AI",
    number: "08",
    emoji: "🎙️",
    title: "AI Voice Agents",
    shortDescription: "Give your business an AI-powered voice agent capable of handling conversations, qualifying leads, and booking appointments.",
    outcome: "Turn every call into an opportunity with AI-powered conversations, qualification, and bookings.",
    startingPrice: "From PKR 50,000",
    capabilities: [
      "AI phone agents",
      "Inbound calls",
      "Outbound calls",
      "Lead qualification",
      "Appointment booking",
      "Customer enquiries",
      "Call routing",
      "CRM integration",
      "Automated follow-ups"
    ],
    idealFor: "Clinics, real estate agencies, auto dealerships, and sales teams receiving high daily call volume.",
    ctaText: "Build My Voice Agent →",
    badge: "Voice Automation"
  },
  {
    id: "ai-automation-integrations",
    category: "AI",
    number: "09",
    emoji: "⚙️",
    title: "AI Automation & Integrations",
    shortDescription: "Connect your tools and automate repetitive workflows so your business can operate faster and smarter.",
    outcome: "Eliminate repetitive work and connect your business into one intelligent automated system.",
    startingPrice: "From PKR 29,999",
    capabilities: [
      "AI workflows",
      "Business automation",
      "CRM automation",
      "API integrations",
      "Webhooks",
      "Lead automation",
      "Automated follow-ups",
      "Data synchronization",
      "AI agents",
      "n8n / Make / Zapier integrations"
    ],
    idealFor: "Companies wanting to eliminate manual data entry, connect CRM pipelines, and trigger automated actions.",
    ctaText: "Automate My Business →",
    badge: "Workflow Efficiency"
  },

  // CATEGORY 04 — CREATE
  {
    id: "ai-product-visuals-video",
    category: "CREATE",
    number: "10",
    emoji: "🎥",
    title: "AI Product Visuals & Video",
    shortDescription: "Create premium AI-powered product visuals and videos designed for advertising, social media, e-commerce, and brand campaigns.",
    outcome: "Make your products impossible to ignore with premium visuals built to capture attention and drive sales.",
    startingPrice: "From PKR 9,999",
    capabilities: [
      "AI product photography",
      "Product advertising visuals",
      "AI-generated product scenes",
      "Social media creatives",
      "Product videos",
      "UGC-style advertisements",
      "Short-form video content",
      "Campaign creatives"
    ],
    idealFor: "D2C brands, Amazon/Shopify merchants, and marketing teams needing high-end visual content without studio costs.",
    ctaText: "Create My Visuals →",
    badge: "Studio Quality"
  }
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "BUILD",
    name: "BUILD",
    heading: "BUILD",
    description: "Build the digital foundation your business needs to launch, compete, and scale.",
    accentColor: "#2563EB",
    tag: "Foundation & Software",
    services: SERVICES_DATA.filter((s) => s.category === "BUILD")
  },
  {
    id: "GROW",
    name: "GROW",
    heading: "GROW",
    description: "Turn attention into traffic, leads, customers, and measurable business growth.",
    accentColor: "#059669",
    tag: "Acquisition & Performance",
    services: SERVICES_DATA.filter((s) => s.category === "GROW")
  },
  {
    id: "AI",
    name: "AI",
    heading: "AI",
    description: "Use intelligent systems to improve customer experiences and automate repetitive business operations.",
    accentColor: "#7C3AED",
    tag: "Intelligent Systems",
    services: SERVICES_DATA.filter((s) => s.category === "AI")
  },
  {
    id: "CREATE",
    name: "CREATE",
    heading: "CREATE",
    description: "Create premium AI-powered visual content designed to make your products impossible to ignore.",
    accentColor: "#D97706",
    tag: "Visuals & Media",
    services: SERVICES_DATA.filter((s) => s.category === "CREATE")
  }
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: "apex-horizon-real-estate",
    title: "Apex Horizon Real Estate Web Platform",
    client: "Apex Horizon Real Estate",
    category: "ai-web",
    industry: "Real Estate & Construction",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    summary: "Ultra-fast Next.js property platform with embedded AI property matchmaker and GEO search markup.",
    challenge: "Apex Horizon was losing 65% of mobile site traffic due to 4.8-second loading times and static property listings. High-net-worth buyers could not get real-time property answers.",
    solution: "Re-engineered on Next.js 15 & Tailwind CSS, achieving 600ms load speed. Deployed Gemini-powered AI Lead Assistant answering property queries and booking viewing appointments directly on agent calendars.",
    results: [
      { label: "Lead Increase", value: "+240%" },
      { label: "Page Load Speed", value: "0.6s" },
      { label: "Conversion Lift", value: "3.5x" }
    ],
    technologies: ["Next.js 15", "Gemini AI", "Tailwind CSS", "GEO Schema", "WhatsApp Engine"],
    status: "published",
    createdAt: "2026-07-20T00:00:00.000Z"
  },
  {
    id: "luxe-couture-apparel",
    title: "Luxe Couture E-Commerce Storefront",
    client: "Luxe Couture Apparel",
    category: "e-commerce",
    industry: "E-Commerce & Retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    summary: "High-converting fashion store with 2-step checkout drawer, regional payment sync, and 4K AI lifestyle photography.",
    challenge: "Luxe Couture struggled with 72% mobile cart abandonment and expensive physical studio photo shoots limiting seasonal expansions.",
    solution: "Crafted high-speed slide-out cart checkout, automated payment verification, and 4K AI-rendered lifestyle media pipeline.",
    results: [
      { label: "Revenue Jump", value: "+310%" },
      { label: "Cart Abandonment Drop", value: "-45%" },
      { label: "Photo Shoot Savings", value: "90%" }
    ],
    technologies: ["Next.js E-Commerce", "AI Visual Pipeline", "Stripe API", "Tailwind CSS"],
    status: "published",
    createdAt: "2026-07-15T00:00:00.000Z"
  },
  {
    id: "novacare-healthcare-clinic",
    title: "NovaCare Clinic Patient Booking Portal",
    client: "NovaCare Clinic",
    category: "ai-web",
    industry: "Healthcare & Medical",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80",
    summary: "Automated patient appointment scheduling portal with WhatsApp reminders and clinic specialist search.",
    challenge: "Reception team spent 25+ hours weekly answering routine calls, resulting in high clinic no-show rates.",
    solution: "Deployed clinic booking portal with real-time doctor availability and automated WhatsApp reminders.",
    results: [
      { label: "Missed Appointments", value: "-60%" },
      { label: "Admin Hours Saved", value: "25 Hrs/Wk" },
      { label: "Google Local Ranking", value: "#1 Spot" }
    ],
    technologies: ["Next.js", "Express API", "Clinic Schema", "WhatsApp Webhooks"],
    status: "published",
    createdAt: "2026-07-02T00:00:00.000Z"
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Growth",
    tagline: "Essential digital presence designed to establish trust and generate qualified leads.",
    pricePKR: "Rs. 10,000",
    priceUSD: "$35",
    idealFor: "Startups, Local Businesses & Personal Brands",
    ctaText: "Get Started Now",
    features: [
      "Custom High-Speed Website (3-5 Pages)",
      "100% Mobile & Tablet Responsive Layout",
      "Basic On-Page SEO & Google Indexing",
      "WhatsApp & Direct Contact Form Integration",
      "SSL Certificate & Fast Cloud Hosting Setup",
      "Sub-1 Second Loading Speed Optimization",
      "1 Month Free Technical Maintenance"
    ]
  },
  {
    id: "professional",
    name: "Business Scale",
    tagline: "Comprehensive web platform built for high conversions, e-commerce, or brand scaling.",
    pricePKR: "Rs. 25,000",
    priceUSD: "$90",
    popular: true,
    idealFor: "E-Commerce Stores, Growing Agencies & Clinics",
    ctaText: "Book Business Scale",
    features: [
      "Full E-Commerce or Multi-Page App (Up to 10 Pages)",
      "Payment Gateway Integration (Stripe, Local Gateways, COD)",
      "Brand Identity Kit (Logo, Colors, Fonts & Assets)",
      "AI-Powered Lead Agent / Chat Assistant Setup",
      "Advanced SEO & GEO (AI Search Engine) Schema Markup",
      "Custom Interactive Features (Calculators, Filters, CMS)",
      "3 Months Technical Maintenance & Security Auditing"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise Custom",
    tagline: "Tailored full-stack solution with dedicated creative direction, custom backend & ongoing growth.",
    pricePKR: "Rs. 50,000+",
    priceUSD: "$180+",
    idealFor: "SaaS Platforms, Corporate Firms & Large Brands",
    ctaText: "Request Custom Quote",
    features: [
      "Custom Web Application / SaaS Platform",
      "Full Design System & Figma Prototype Specs",
      "Custom API Integration & Serverless Node.js Backend",
      "AI Visual Media Suite (15+ 4K Product Renders)",
      "30-Day Social Media Growth & Creative Strategy",
      "24/7 Priority Support & Dedicated Project Strategist",
      "Continuous Conversion Rate Optimization (CRO)"
    ]
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "t1",
    name: "Kamran Shah",
    role: "CEO & Founder",
    company: "Apex Horizon Real Estate",
    industry: "Real Estate",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    highlight: "+240% increase in online qualified leads",
    quote: "Calvix Digitals completely transformed our digital presence. Our new website loads under a second, looks incredibly modern, and our client inquiries surged by 240% in the first month. Highly recommended!"
  },
  {
    id: "t2",
    name: "Sarah Ahmed",
    role: "Managing Director",
    company: "Luxe Couture Apparel",
    industry: "E-Commerce",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    highlight: "Smooth payment checkout & 310% revenue jump",
    quote: "The e-commerce experience built by Calvix is seamless. They integrated local payment gateways smoothly and fixed our mobile cart drop-offs. Working with them was fast, transparent, and results-driven."
  },
  {
    id: "t3",
    name: "Dr. Tariq Mahmood",
    role: "Lead Medical Director",
    company: "NovaCare Clinic",
    industry: "Healthcare",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
    highlight: "Saved 15 hours of manual receptionist work every week",
    quote: "Our patients love booking appointments online now. The automated WhatsApp reminders reduced our missed appointments by 60%. Calvix Digitals understands business efficiency better than any agency."
  },
  {
    id: "t4",
    name: "Omar Farooq",
    role: "Head of Product",
    company: "Pulse Analytics",
    industry: "SaaS",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    highlight: "World-class UI/UX design that boosted trial conversion",
    quote: "The level of design craftsmanship Calvix delivered rivaled top international design studios. Their 8pt grid system and sleek dark mode UI helped us increase our free-to-paid subscription rate by 65%."
  }
];

export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: "startups",
    name: "Startups & SaaS",
    iconName: "Rocket",
    description: "Launch fast with high-converting landing pages, interactive SaaS dashboards, and trial conversion engines.",
    keyFeature: "Rapid MVP Web Deployment"
  },
  {
    id: "e-commerce",
    name: "E-Commerce & Retail",
    iconName: "ShoppingBag",
    description: "Scale store revenues with frictionless mobile checkout, payment gateway sync, and 4K AI product visuals.",
    keyFeature: "Frictionless Checkout Flow"
  },
  {
    id: "realestate",
    name: "Real Estate & Construction",
    iconName: "Building2",
    description: "Attract buyers with luxury property portals, 3D floorplan showcases, and instant WhatsApp lead routing.",
    keyFeature: "Luxury Property Portals"
  },
  {
    id: "healthcare",
    name: "Healthcare & Clinics",
    iconName: "Activity",
    description: "Automate patient scheduling, showcase medical expertise, and eliminate missed clinic appointments.",
    keyFeature: "Automated Patient Booking"
  },
  {
    id: "restaurants",
    name: "Restaurants & Cafes",
    iconName: "Utensils",
    description: "Drive table reservations and direct digital orders with mouth-watering UI layouts and menu systems.",
    keyFeature: "Direct Ordering Systems"
  },
  {
    id: "education",
    name: "Educational Institutes",
    iconName: "GraduationCap",
    description: "Increase student enrollments with interactive course directories, portal logins, and virtual campus tours.",
    keyFeature: "Student Admissions Portals"
  },
  {
    id: "law",
    name: "Law Firms & Consultants",
    iconName: "Shield",
    description: "Establish undeniable authority with sleek legal consultation portals, case history, and client trust signals.",
    keyFeature: "Authority Lead Engines"
  },
  {
    id: "travel",
    name: "Travel & Hospitality",
    iconName: "Compass",
    description: "Captivate travelers with itinerary builders, resort booking showcases, and multi-currency support.",
    keyFeature: "Interactive Tour Booking"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "generative-engine-optimization-geo",
    title: "Generative Engine Optimization (GEO)",
    slug: "generative-engine-optimization-geo",
    oldSlugs: [],
    category: "AI & Web Development",
    author: "Calvix Digital",
    date: "August 10, 2026",
    publishedAt: "2026-08-10T15:14:22.565Z",
    updatedAt: "2026-08-10T15:14:22.565Z",
    readTime: "5 min read",
    summary: "Generative Engine Optimization (GEO) is changing how businesses approach online visibility in the age of AI-powered search. This guide explains what GEO is, how it differs from traditional SEO, and how businesses can optimize their websites for AI-driven search experiences.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Generative Engine Optimization (GEO)",
    tags: ["AI Web Development", "Digital Strategy", "GEO", "SEO"],
    status: "published",
    createdAt: "2026-08-10T15:14:22.565Z",
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/generative-engine-optimization-geo",
    seoTitle: "Generative Engine Optimization (GEO) | Calvix Digital",
    metaDescription: "Generative Engine Optimization (GEO) is changing how businesses approach online visibility in the age of AI-powered search. Learn how to optimize for AI search engines like Gemini and ChatGPT.",
    focusKeyword: "Generative Engine Optimization",
    secondaryKeywords: ["GEO digital marketing", "AI search optimization", "ChatGPT SEO"],
    ogTitle: "Generative Engine Optimization (GEO)",
    ogDescription: "Generative Engine Optimization (GEO) is changing how businesses approach online visibility in the age of AI-powered search.",
    ogImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    content: `Generative Engine Optimization (GEO) is changing how businesses approach online visibility in the age of AI-powered search. This guide explains what GEO is, how it differs from traditional SEO, and how businesses can optimize their websites for AI-driven search experiences.`
  },
  {
    id: "how-much-does-an-ai-website-design-cost-in-2026",
    title: "How Much Does an AI Website Design Cost in 2026?",
    slug: "how-much-does-an-ai-website-design-cost-in-2026",
    oldSlugs: [],
    category: "AI & Web Development",
    author: "Calvix Digital",
    date: "August 10, 2026",
    publishedAt: "2026-08-10T15:13:11.800Z",
    updatedAt: "2026-08-10T15:13:11.800Z",
    readTime: "5 min read",
    summary: "How much does an AI website cost in 2026? This guide breaks down AI website pricing, from simple AI-assisted business websites to advanced AI-powered web applications.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    imageAlt: "How Much Does an AI Website Design Cost in 2026?",
    tags: ["AI Web Development", "Pricing", "Web Design"],
    status: "published",
    createdAt: "2026-08-10T15:13:11.800Z",
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/how-much-does-an-ai-website-design-cost-in-2026",
    seoTitle: "How Much Does an AI Website Design Cost in 2026?",
    metaDescription: "How much does an AI website cost in 2026? This guide breaks down AI website pricing, features, and cost factors.",
    content: `AI website development is becoming one of the fastest-growing areas of digital development in 2026. Discover cost breakdowns, architecture considerations, and pricing tiers.`
  },
  {
    id: "what-is-geo-in-digital-marketing-the-complete-guide-to-generative-engine-optimization-in-2026",
    title: "What Is GEO in Digital Marketing? The Complete Guide to Generative Engine Optimization in 2026",
    slug: "what-is-geo-in-digital-marketing-the-complete-guide-to-generative-engine-optimization-in-2026",
    oldSlugs: [],
    category: "AI & Web Development",
    author: "Calvix Digital",
    date: "August 10, 2026",
    publishedAt: "2026-08-10T15:10:30.093Z",
    updatedAt: "2026-08-10T15:10:30.093Z",
    readTime: "5 min read",
    summary: "Generative Engine Optimization (GEO) is changing how businesses approach online visibility in the age of AI-powered search.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    imageAlt: "What Is GEO in Digital Marketing?",
    tags: ["GEO", "SEO", "Digital Marketing"],
    status: "published",
    createdAt: "2026-08-10T15:10:30.093Z",
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/what-is-geo-in-digital-marketing-the-complete-guide-to-generative-engine-optimization-in-2026",
    seoTitle: "What Is GEO in Digital Marketing? Complete Guide 2026",
    metaDescription: "Learn what GEO (Generative Engine Optimization) is, how it differs from traditional SEO, and how to optimize for ChatGPT & AI search.",
    content: `Generative Engine Optimization (GEO) is an emerging digital marketing discipline focused on improving a company's visibility across generative AI-powered search experiences.`
  },
  {
    id: "ai-web-dev-2026",
    title: "Why AI-Powered Websites Outperform Traditional WordPress Sites in 2026",
    slug: "why-ai-powered-websites-outperform-traditional-wordpress-sites-in-2026",
    oldSlugs: ["ai-web-dev-2026"],
    category: "AI & Web Development",
    author: "Calvix Digital",
    date: "August 2, 2026",
    readTime: "5 min read",
    summary: "Discover how embedded AI agents, sub-second Next.js architecture, and GEO (AI Search Engine Optimization) are revolutionizing web conversion rates.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    tags: ["AI Web", "Next.js", "SEO", "GEO"],
    status: "published",
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/why-ai-powered-websites-outperform-traditional-wordpress-sites-in-2026",
    seoTitle: "Why AI-Powered Websites Outperform WordPress Sites in 2026",
    metaDescription: "Learn how sub-second Next.js performance, embedded AI agents, and Generative Engine Optimization (GEO) triple conversion rates over legacy WordPress sites.",
    content: `In 2026, a static brochure website built on bloated, slow legacy plugins is no longer enough to win customer trust. Modern visitors expect instant sub-second page loads, intelligent personalized answers, and frictionless mobile experiences.`
  },
  {
    id: "brand-identity-trust",
    title: "The Psychology of Premium Brand Identity: How Design Drives Pricing Power",
    slug: "psychology-of-premium-brand-identity-how-design-drives-pricing-power",
    oldSlugs: ["brand-identity-trust"],
    category: "Branding",
    author: "Calvix Digital",
    date: "July 28, 2026",
    readTime: "4 min read",
    summary: "How subtle typography scales, 8pt grid spacing, and disciplined color palettes signal high luxury and allow businesses to charge higher rates.",
    coverImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
    tags: ["Branding", "UI/UX", "Design Math"],
    status: "published",
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/psychology-of-premium-brand-identity-how-design-drives-pricing-power",
    seoTitle: "Psychology of Premium Brand Identity & Design Pricing Power",
    metaDescription: "Discover how mathematical grid spacing, typographic hierarchy, and intentional color palettes build instant trust and justify 5x higher pricing.",
    content: `Why do customers pay 5x more for the exact same underlying product or service from a premium brand? The answer lies in subconscious design cues.`
  },
  {
    id: "cro-checkout-tactics",
    title: "5 E-Commerce Conversion Hacks That Reduced Cart Abandonment by 45%",
    slug: "5-e-commerce-conversion-hacks-that-reduced-cart-abandonment-by-45",
    oldSlugs: ["cro-checkout-tactics"],
    category: "E-Commerce",
    author: "Calvix Digital",
    date: "July 18, 2026",
    readTime: "6 min read",
    summary: "Actionable UX improvements for e-commerce stores: 2-step fast checkouts, local payment methods, and instant WhatsApp order confirmations.",
    coverImage: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80",
    tags: ["E-Commerce", "CRO", "Checkout"],
    status: "published",
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/5-e-commerce-conversion-hacks-that-reduced-cart-abandonment-by-45",
    seoTitle: "5 E-Commerce Conversion Hacks to Reduce Cart Abandonment",
    metaDescription: "Reduce e-commerce cart abandonment by up to 45% using slide-out cart drawers, 2-step checkouts, and local payment integration.",
    content: `Cart abandonment is the silent revenue killer for online stores. Here are the exact conversion optimization strategies Calvix Digital implements to maximize store profits.`
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    id: "faq1",
    category: "Pricing",
    question: "How is pricing structured for projects?",
    answer: "We offer transparent, upfront packages tailored to your exact business scale and goals. You can explore our standard packages on our Pricing page or request a customized quote."
  },
  {
    id: "faq2",
    category: "Timeline",
    question: "How fast can you deliver my project?",
    answer: "Most standard business websites and branding projects are delivered within 7 to 10 days. E-Commerce platforms and full-stack web applications take 10 to 14 days. Express 5-day delivery is available upon request."
  },
  {
    id: "faq3",
    category: "Technology",
    question: "What technologies do you use to build websites?",
    answer: "We use modern, industry-standard technologies: React, Next.js, TypeScript, Tailwind CSS, Express, and Node.js. For e-commerce, we build custom Next.js stores or high-converting Shopify/WooCommerce platforms."
  },
  {
    id: "faq4",
    category: "SEO",
    question: "Will my website be optimized for Google Search and AI assistants?",
    answer: "Yes, 100%! All websites engineered by Calvix Digitals include core technical SEO, fast sub-1 second loading speeds, mobile-first responsiveness, and structured JSON-LD Schema markup for GEO (Generative Engine Optimization)."
  },
  {
    id: "faq5",
    category: "Maintenance",
    question: "Do you provide post-launch support and hosting maintenance?",
    answer: "Yes, every project includes free post-launch support (ranging from 1 to 3 months depending on the plan). We also offer optional monthly maintenance retainers for continuous performance monitoring, updates, and backups."
  },
  {
    id: "faq6",
    category: "General",
    question: "Do I own all source code and master files upon project completion?",
    answer: "Yes. Once the project is completed and final payment is settled, 100% legal ownership of all source code, Figma design files, vector logo assets, and content transfers entirely to you."
  }
];
