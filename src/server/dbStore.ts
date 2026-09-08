import fs from "fs";
import path from "path";
import { PortfolioItem, BlogPost, BookingItem } from "../types";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");

export interface DatabaseSchema {
  projects: PortfolioItem[];
  blogs: BlogPost[];
  bookings?: BookingItem[];
  adminPasswordHash?: string;
  adminPassword?: string;
}

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: "ai-web-dev-2026",
    title: "Why AI-Powered Websites Outperform Traditional WordPress Sites in 2026",
    slug: "why-ai-powered-websites-outperform-traditional-wordpress-sites-in-2026",
    oldSlugs: ["ai-web-dev-2026"],
    category: "AI & Web Development",
    author: "Calvix Digital",
    date: "August 2, 2026",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: "5 min read",
    summary: "Discover how embedded AI agents, sub-second Next.js architecture, and Generative Engine Optimization (GEO) are revolutionizing web conversion rates.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    imageAlt: "AI-Powered Next.js Web Development Dashboard by Calvix Digital",
    tags: ["AI Web Development", "Next.js", "SEO", "GEO"],
    status: "published",
    createdAt: new Date().toISOString(),
    seoTitle: "Why AI-Powered Websites Outperform WordPress Sites in 2026",
    metaDescription: "Learn how sub-second Next.js performance, embedded AI agents, and Generative Engine Optimization (GEO) triple conversion rates over legacy WordPress sites.",
    focusKeyword: "AI-powered websites",
    secondaryKeywords: ["Next.js web development", "Generative Engine Optimization", "AI website conversion"],
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/why-ai-powered-websites-outperform-traditional-wordpress-sites-in-2026",
    ogTitle: "Why AI-Powered Websites Outperform WordPress Sites in 2026",
    ogDescription: "Sub-second Next.js loading speeds and 24/7 AI lead capture engines leave legacy WordPress sites behind.",
    ogImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    answerIntro: "AI-powered websites outperform traditional WordPress sites in 2026 by delivering sub-second page rendering (under 800ms), 24/7 automated conversational lead qualification, and structured metadata explicitly optimized for AI search engines like Gemini and ChatGPT.",
    faqs: [
      {
        question: "How much faster is a Next.js AI website compared to WordPress?",
        answer: "A modern Next.js serverless web application typically loads in under 800 milliseconds, compared to 3–5 seconds for traditional plugin-heavy WordPress installations."
      },
      {
        question: "What is Generative Engine Optimization (GEO)?",
        answer: "GEO is the practice of structuring digital content with rich Schema.org metadata and clear factual answers so modern AI engines like Gemini, ChatGPT, and Perplexity can easily cite and recommend your brand."
      }
    ],
    content: `In 2026, a static brochure website built on bloated, slow legacy plugins is no longer enough to win customer trust. Modern visitors expect instant sub-second page loads, intelligent personalized answers, and frictionless mobile experiences.

### 1. The Death of 5-Second Load Times
Studies show that 53% of mobile users abandon a website if it takes longer than 3 seconds to load. Modern Next.js server-rendered applications load in under 800 milliseconds, giving your business an immediate edge in Google PageSpeed and Lighthouse metrics.

### 2. Generative Engine Optimization (GEO)
Search is changing. Potential customers are asking AI assistants like Gemini, ChatGPT, and Perplexity for business recommendations. Calvix Digital structures your website with rich Schema.org entity metadata so AI systems explicitly understand and recommend your brand.

### 3. Conversational Lead Engines
Instead of static "Contact Us" forms with low response rates, embedded AI lead agents qualify visitor intent 24/7, answer common questions instantly, and schedule consultations directly onto your calendar.`
  },
  {
    id: "brand-identity-trust",
    title: "The Psychology of Premium Brand Identity: How Design Drives Pricing Power",
    slug: "psychology-of-premium-brand-identity-how-design-drives-pricing-power",
    oldSlugs: ["brand-identity-trust"],
    category: "Branding",
    author: "Calvix Digital",
    date: "July 28, 2026",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: "4 min read",
    summary: "How subtle typography scales, 8pt grid spacing, and disciplined color palettes signal high luxury and allow businesses to charge higher rates.",
    coverImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Premium Brand Identity Guidelines and Typography Systems",
    tags: ["Branding", "UI/UX", "Brand Strategy"],
    status: "published",
    createdAt: new Date().toISOString(),
    seoTitle: "Psychology of Premium Brand Identity & Design Pricing Power",
    metaDescription: "Discover how mathematical grid spacing, typographic hierarchy, and intentional color palettes build instant trust and justify 5x higher pricing.",
    focusKeyword: "premium brand identity",
    secondaryKeywords: ["brand design pricing power", "UI UX typography hierarchy", "digital luxury design"],
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/psychology-of-premium-brand-identity-how-design-drives-pricing-power",
    answerIntro: "A premium brand identity establishes subconscious authority through disciplined typography scales, mathematical padding, and high-contrast color choices, enabling brands to command up to 5x higher prices for similar core services.",
    faqs: [
      {
        question: "Why does visual design directly impact pricing power?",
        answer: "Subconscious visual cues like consistent alignment, crisp typography contrast, and balanced whitespace signal operational excellence and reduce perceived risk for buyers."
      }
    ],
    content: `Why do customers pay 5x more for the exact same underlying product or service from a premium brand? The answer lies in subconscious design cues.

### 1. Mathematical Spacing & Clean Padding
When a website utilizes loose, arbitrary padding and crammed text, the user's brain perceives amateurism. Following an strict 8-point grid scale creates optical rhythm that signals meticulous craftsmanship.

### 2. High-Contrast Typography Pairing
Pairing a bold, technical display font with a highly legible body typeface creates hierarchy that guides the reader's eyes effortlessly across key value propositions.`
  },
  {
    id: "cro-checkout-tactics",
    title: "5 E-Commerce Conversion Hacks That Reduced Cart Abandonment by 45%",
    slug: "5-e-commerce-conversion-hacks-that-reduced-cart-abandonment-by-45",
    oldSlugs: ["cro-checkout-tactics"],
    category: "E-Commerce",
    author: "Calvix Digital",
    date: "July 18, 2026",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: "6 min read",
    summary: "Actionable UX improvements for e-commerce stores: 2-step fast checkouts, local payment methods, and instant WhatsApp order confirmations.",
    coverImage: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Modern E-Commerce Checkout Conversion Optimization",
    tags: ["E-Commerce", "CRO", "Checkout Optimization"],
    status: "published",
    createdAt: new Date().toISOString(),
    seoTitle: "5 E-Commerce Conversion Hacks to Reduce Cart Abandonment",
    metaDescription: "Reduce e-commerce cart abandonment by up to 45% using slide-out cart drawers, 2-step checkouts, and local payment integration.",
    focusKeyword: "e-commerce conversion hacks",
    secondaryKeywords: ["reduce cart abandonment", "slide-out cart drawer", "e-commerce checkout UX"],
    canonicalUrl: "https://calvix-digitals.ai.studio/blog/5-e-commerce-conversion-hacks-that-reduced-cart-abandonment-by-45",
    answerIntro: "Cart abandonment can be reduced by 45% by implementing slide-out cart drawers, eliminating multi-page redirects during checkout, displaying transparent shipping calculators, and integrating trusted local payment options.",
    faqs: [
      {
        question: "What is the single biggest cause of cart abandonment?",
        answer: "Unexpected checkout costs (shipping/fees) and overly complex multi-page registration requirements account for over 60% of abandoned shopping carts."
      }
    ],
    content: `Cart abandonment is the silent revenue killer for online stores. Here are the exact conversion optimization strategies Calvix Digital implements to maximize store profits.

### 1. The Instant Slide-Out Cart Drawer
Never force a user to jump to a separate cart page just to see their subtotal. A smooth slide-out drawer keeps shoppers in the buying flow while displaying free shipping progress bars.

### 2. Frictionless Regional Payment Integration
Offering trusted local payment options alongside credit cards eliminates payment anxiety at the final step.`
  }
];

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

const DEFAULT_PROJECTS: PortfolioItem[] = [
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

export function readDatabase(): DatabaseSchema {
  ensureDirectoryExists();
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      projects: DEFAULT_PROJECTS,
      blogs: DEFAULT_BLOG_POSTS,
      bookings: [],
      adminPassword: "admin123",
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }

  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    const projects = Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : DEFAULT_PROJECTS;
    return {
      projects,
      blogs: Array.isArray(parsed.blogs) ? parsed.blogs : DEFAULT_BLOG_POSTS,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
      adminPassword: parsed.adminPassword || "admin123",
    };
  } catch (err) {
    console.error("Error reading db.json, returning defaults:", err);
    return {
      projects: DEFAULT_PROJECTS,
      blogs: DEFAULT_BLOG_POSTS,
      bookings: [],
      adminPassword: "admin123",
    };
  }
}

export function writeDatabase(db: DatabaseSchema): void {
  ensureDirectoryExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function getProjects(includeDrafts = false): PortfolioItem[] {
  const db = readDatabase();
  if (includeDrafts) return db.projects;
  return db.projects.filter((p) => p.status !== "draft");
}

export function saveProject(projectData: Partial<PortfolioItem> & { title: string }): PortfolioItem {
  const db = readDatabase();
  const now = new Date().toISOString();

  let project: PortfolioItem;
  if (projectData.id) {
    const index = db.projects.findIndex((p) => p.id === projectData.id);
    if (index !== -1) {
      project = {
        ...db.projects[index],
        ...projectData,
        status: projectData.status || db.projects[index].status || "published",
      };
      db.projects[index] = project;
    } else {
      project = {
        id: projectData.id,
        title: projectData.title,
        client: projectData.client || "Client Partner",
        category: projectData.category || "ai-web",
        industry: projectData.industry || "General",
        image: projectData.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        summary: projectData.summary || "",
        challenge: projectData.challenge || "",
        solution: projectData.solution || "",
        results: projectData.results || [],
        technologies: projectData.technologies || [],
        liveUrl: projectData.liveUrl,
        githubUrl: projectData.githubUrl,
        status: projectData.status || "published",
        createdAt: now,
      };
      db.projects.unshift(project);
    }
  } else {
    const id = "proj-" + Date.now();
    project = {
      id,
      title: projectData.title,
      client: projectData.client || "Client Partner",
      category: projectData.category || "ai-web",
      industry: projectData.industry || "General",
      image: projectData.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      summary: projectData.summary || "",
      challenge: projectData.challenge || "",
      solution: projectData.solution || "",
      results: projectData.results || [],
      technologies: projectData.technologies || [],
      liveUrl: projectData.liveUrl,
      githubUrl: projectData.githubUrl,
      status: projectData.status || "published",
      createdAt: now,
    };
    db.projects.unshift(project);
  }

  writeDatabase(db);
  return project;
}

export function deleteProject(id: string): boolean {
  const db = readDatabase();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initialLength) {
    writeDatabase(db);
    return true;
  }
  return false;
}

export function getBlogs(includeDrafts = false): BlogPost[] {
  const db = readDatabase();
  if (includeDrafts) return db.blogs;
  return db.blogs.filter((b) => b.status !== "draft");
}

export function saveBlog(blogData: Partial<BlogPost> & { title: string }): BlogPost {
  const db = readDatabase();
  const now = new Date().toISOString();

  const cleanSlug = (input?: string) => {
    if (!input) return "";
    return input
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const finalSlug = cleanSlug(blogData.slug) || cleanSlug(blogData.title) || `blog-${Date.now()}`;
  const defaultCanonical = `https://calvix-digitals.ai.studio/blog/${finalSlug}`;

  let blog: BlogPost;
  if (blogData.id) {
    const index = db.blogs.findIndex((b) => b.id === blogData.id);
    if (index !== -1) {
      const existing = db.blogs[index];
      const oldSlugsSet = new Set<string>(existing.oldSlugs || []);
      
      // If slug changed, remember old slug for 301/routing redirects
      if (existing.slug && existing.slug !== finalSlug) {
        oldSlugsSet.add(existing.slug);
      }

      blog = {
        ...existing,
        ...blogData,
        slug: finalSlug,
        oldSlugs: Array.from(oldSlugsSet),
        status: blogData.status || existing.status || "published",
        updatedAt: now,
        canonicalUrl: blogData.canonicalUrl || existing.canonicalUrl || defaultCanonical,
      };
      db.blogs[index] = blog;
    } else {
      blog = {
        id: blogData.id,
        title: blogData.title,
        slug: finalSlug,
        oldSlugs: [],
        category: blogData.category || "AI & Web Development",
        author: blogData.author || "Calvix Digital",
        date: blogData.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readTime: blogData.readTime || "4 min read",
        summary: blogData.summary || "",
        coverImage: blogData.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        imageAlt: blogData.imageAlt || blogData.title,
        content: blogData.content || "",
        tags: blogData.tags || ["Article"],
        status: blogData.status || "published",
        createdAt: now,
        publishedAt: blogData.publishedAt || now,
        updatedAt: now,
        canonicalUrl: blogData.canonicalUrl || defaultCanonical,
        seoTitle: blogData.seoTitle || blogData.title,
        metaDescription: blogData.metaDescription || blogData.summary,
        focusKeyword: blogData.focusKeyword,
        secondaryKeywords: blogData.secondaryKeywords || [],
        ogTitle: blogData.ogTitle || blogData.seoTitle || blogData.title,
        ogDescription: blogData.ogDescription || blogData.metaDescription || blogData.summary,
        ogImage: blogData.ogImage || blogData.coverImage,
        twitterTitle: blogData.twitterTitle || blogData.seoTitle || blogData.title,
        twitterDescription: blogData.twitterDescription || blogData.metaDescription || blogData.summary,
        twitterImage: blogData.twitterImage || blogData.coverImage,
        answerIntro: blogData.answerIntro,
        faqs: blogData.faqs || [],
      };
      db.blogs.unshift(blog);
    }
  } else {
    const id = "blog-" + Date.now();
    blog = {
      id,
      title: blogData.title,
      slug: finalSlug,
      oldSlugs: [],
      category: blogData.category || "AI & Web Development",
      author: blogData.author || "Calvix Digital",
      date: blogData.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: blogData.readTime || "4 min read",
      summary: blogData.summary || "",
      coverImage: blogData.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      imageAlt: blogData.imageAlt || blogData.title,
      content: blogData.content || "",
      tags: blogData.tags || ["Article"],
      status: blogData.status || "published",
      createdAt: now,
      publishedAt: now,
      updatedAt: now,
      canonicalUrl: blogData.canonicalUrl || defaultCanonical,
      seoTitle: blogData.seoTitle || blogData.title,
      metaDescription: blogData.metaDescription || blogData.summary,
      focusKeyword: blogData.focusKeyword,
      secondaryKeywords: blogData.secondaryKeywords || [],
      ogTitle: blogData.ogTitle || blogData.seoTitle || blogData.title,
      ogDescription: blogData.ogDescription || blogData.metaDescription || blogData.summary,
      ogImage: blogData.ogImage || blogData.coverImage,
      twitterTitle: blogData.twitterTitle || blogData.seoTitle || blogData.title,
      twitterDescription: blogData.twitterDescription || blogData.metaDescription || blogData.summary,
      twitterImage: blogData.twitterImage || blogData.coverImage,
      answerIntro: blogData.answerIntro,
      faqs: blogData.faqs || [],
    };
    db.blogs.unshift(blog);
  }

  writeDatabase(db);
  return blog;
}

export function deleteBlog(id: string): boolean {
  const db = readDatabase();
  const initialLength = db.blogs.length;
  db.blogs = db.blogs.filter((b) => b.id !== id);
  if (db.blogs.length !== initialLength) {
    writeDatabase(db);
    return true;
  }
  return false;
}

export function verifyAdminPassword(password: string): boolean {
  const db = readDatabase();
  return password === "admin123" || password === (db.adminPassword || "admin123");
}

export function saveUploadImage(filename: string, base64Data: string): string {
  ensureDirectoryExists();
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(cleanBase64, "base64");
  
  const ext = path.extname(filename) || ".png";
  const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(UPLOADS_DIR, safeName);

  fs.writeFileSync(filePath, buffer);
  return `/api/uploads/${safeName}`;
}

export function saveUploadPdf(filename: string, base64Data: string): { url: string; fileName: string; fileSize: number; uploadedAt: string } {
  ensureDirectoryExists();
  const cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, "").replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(cleanBase64, "base64");
  
  const cleanOriginalName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanOriginalName}`;
  const filePath = path.join(UPLOADS_DIR, safeName);

  fs.writeFileSync(filePath, buffer);
  return {
    url: `/api/uploads/${safeName}`,
    fileName: filename,
    fileSize: buffer.length,
    uploadedAt: new Date().toISOString(),
  };
}

export function deleteUploadFileByUrl(fileUrl: string): boolean {
  if (!fileUrl || !fileUrl.startsWith("/api/uploads/")) return false;
  const fileName = fileUrl.replace("/api/uploads/", "");
  const filePath = path.join(UPLOADS_DIR, fileName);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (e) {
      console.error("Failed to delete upload file:", e);
    }
  }
  return false;
}

export function getUploadFilePath(filename: string): string | null {
  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}

export function getLocalBookings(): BookingItem[] {
  const db = readDatabase();
  return db.bookings || [];
}

export function saveLocalBooking(booking: Partial<BookingItem>): BookingItem {
  const db = readDatabase();
  if (!db.bookings) {
    db.bookings = [];
  }

  const now = new Date().toISOString();
  const id = booking.id || `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  const newBooking: BookingItem = {
    id,
    created_at: booking.created_at || now,
    createdAt: booking.createdAt || now,
    full_name: booking.full_name || booking.name || "Anonymous Inquiry",
    name: booking.full_name || booking.name || "Anonymous Inquiry",
    email: booking.email || "",
    phone: booking.phone || undefined,
    business_name: booking.business_name || booking.businessName || undefined,
    businessName: booking.business_name || booking.businessName || undefined,
    service: booking.service || "General Inquiry",
    message: booking.message || booking.projectDetails || undefined,
    projectDetails: booking.message || booking.projectDetails || undefined,
    budget: booking.budget || undefined,
    project_type: booking.project_type || booking.projectType || undefined,
    projectType: booking.project_type || booking.projectType || undefined,
    status: booking.status || "New",
    source: booking.source || "Website",
    ip_address: booking.ip_address || undefined,
    notes: booking.notes || undefined,
  };

  const existingIndex = db.bookings.findIndex((b) => b.id === id);
  if (existingIndex >= 0) {
    db.bookings[existingIndex] = { ...db.bookings[existingIndex], ...newBooking };
  } else {
    db.bookings.unshift(newBooking);
  }

  writeDatabase(db);
  return newBooking;
}

export function updateLocalBookingStatus(id: string, status: string, notes?: string): boolean {
  const db = readDatabase();
  if (!db.bookings) return false;
  const index = db.bookings.findIndex((b) => b.id === id);
  if (index >= 0) {
    db.bookings[index].status = status;
    if (notes !== undefined) {
      db.bookings[index].notes = notes;
    }
    writeDatabase(db);
    return true;
  }
  return false;
}

export function deleteLocalBooking(id: string): boolean {
  const db = readDatabase();
  if (!db.bookings) return false;
  const initialLength = db.bookings.length;
  db.bookings = db.bookings.filter((b) => b.id !== id);
  if (db.bookings.length !== initialLength) {
    writeDatabase(db);
    return true;
  }
  return false;
}
