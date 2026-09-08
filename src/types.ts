export interface ServiceItem {
  id: string;
  category: "BUILD" | "GROW" | "AI" | "CREATE";
  number: string;
  emoji: string;
  title: string;
  shortDescription: string;
  outcome: string;
  startingPrice: string;
  capabilities: string[];
  idealFor: string;
  ctaText: string;
  badge?: string;
}

export interface ServiceCategory {
  id: "BUILD" | "GROW" | "AI" | "CREATE";
  name: string;
  heading: string;
  description: string;
  accentColor: string;
  tag: string;
  services: ServiceItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  industry: string;
  image: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  status?: "published" | "draft";
  createdAt?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  pricePKR: string;
  priceUSD: string;
  popular?: boolean;
  features: string[];
  idealFor: string;
  ctaText: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  rating: number;
  avatar: string;
  quote: string;
  highlight: string;
}

export interface BlogFAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  oldSlugs?: string[];
  category: "AI & Web Development" | "Digital Marketing" | "Business Growth" | "E-Commerce" | "Branding" | "UI/UX" | "SEO" | string;
  author: string;
  date: string;
  publishedAt?: string;
  updatedAt?: string;
  readTime: string;
  summary: string;
  coverImage: string;
  imageAlt?: string;
  content: string;
  tags: string[];
  status?: "published" | "draft";
  createdAt?: string;

  // PDF Version
  pdf_url?: string;
  pdf_file_name?: string;
  pdf_file_size?: number;
  pdf_uploaded_at?: string;

  // SEO Fields
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  // GEO & FAQ Fields
  answerIntro?: string;
  faqs?: BlogFAQItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Pricing" | "Timeline" | "Technology" | "SEO" | "Maintenance" | "General";
}

export interface IndustryItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  keyFeature: string;
}
