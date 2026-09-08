import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  getProjects,
  saveProject,
  deleteProject,
  getBlogs,
  saveBlog,
  deleteBlog,
  verifyAdminPassword,
  saveUploadImage,
  saveUploadPdf,
  deleteUploadFileByUrl,
  getUploadFilePath,
  getLocalBookings,
  saveLocalBooking,
  updateLocalBookingStatus,
  deleteLocalBooking,
} from "./src/server/dbStore";
import { saveBookingToSupabase, getBookingsFromSupabase } from "./src/lib/supabase";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // Google Search Console Verification Files
  app.get("/google16576adbda03af7.html", (_req, res) => {
    res.type("text/html");
    res.send("google-site-verification: google16576adbda03af7.html");
  });

  app.get("/googlec16576adbda03af7.html", (_req, res) => {
    res.type("text/html");
    res.send("google-site-verification: googlec16576adbda03af7.html");
  });

  // Dynamic robots.txt
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://calvix-digitals.ai.studio/sitemap.xml
`);
  });

  // Dynamic sitemap.xml
  app.get("/sitemap.xml", (_req, res) => {
    const DOMAIN = "https://calvix-digitals.ai.studio";
    const staticRoutes = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/about", priority: "0.8", changefreq: "monthly" },
      { url: "/pricing", priority: "0.8", changefreq: "weekly" },
      { url: "/portfolio", priority: "0.8", changefreq: "weekly" },
      { url: "/blog", priority: "0.9", changefreq: "daily" },
      { url: "/contact", priority: "0.8", changefreq: "monthly" },
      { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
      { url: "/terms", priority: "0.3", changefreq: "yearly" },
    ];

    let publishedBlogs: any[] = [];
    try {
      publishedBlogs = getBlogs(false);
    } catch (err) {
      console.warn("Could not load blogs for sitemap:", err);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    staticRoutes.forEach((route) => {
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}${route.url}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    publishedBlogs.forEach((blog) => {
      const lastMod = blog.updatedAt || blog.publishedAt || blog.createdAt || new Date().toISOString();
      const dateStr = new Date(lastMod).toISOString().split("T")[0];
      xml += `  <url>\n`;
      xml += `    <loc>${DOMAIN}/blog/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${dateStr}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // Serve uploaded images statically
  app.get("/api/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = getUploadFilePath(filename);
    if (!filePath) {
      return res.status(404).send("File not found");
    }
    res.sendFile(filePath);
  });

  // API Route: Admin Login / Verification
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const isValid = verifyAdminPassword(password);
    if (isValid) {
      return res.json({ success: true, token: "admin-session-authenticated" });
    }
    return res.status(401).json({ error: "Invalid admin password" });
  });

  // API Route: Image Upload
  app.post("/api/upload", (req, res) => {
    const { filename, dataUrl } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: "Data URL is required" });
    }
    try {
      const imageUrl = saveUploadImage(filename || "upload.png", dataUrl);
      return res.json({ success: true, url: imageUrl });
    } catch (err: any) {
      console.error("Image upload error:", err);
      return res.status(500).json({ error: "Failed to save uploaded image" });
    }
  });

  // API Route: PDF Upload
  app.post("/api/upload-pdf", (req, res) => {
    const { filename, dataUrl } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: "Data URL is required" });
    }

    const name = filename || "document.pdf";
    const isPdfExt = name.toLowerCase().endsWith(".pdf");
    const isPdfMime = dataUrl.startsWith("data:application/pdf");

    if (!isPdfExt && !isPdfMime) {
      return res.status(400).json({ error: "Please upload a valid PDF file." });
    }

    // Estimate base64 byte size
    const base64Length = dataUrl.length - (dataUrl.indexOf(",") + 1);
    const approxByteSize = (base64Length * 3) / 4;
    const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20 MB

    if (approxByteSize > MAX_PDF_SIZE) {
      return res.status(400).json({ error: "This PDF is too large. Please upload a smaller file." });
    }

    try {
      const result = saveUploadPdf(name, dataUrl);
      return res.json({ success: true, ...result });
    } catch (err: any) {
      console.error("PDF upload error:", err);
      return res.status(500).json({ error: "Failed to save uploaded PDF file." });
    }
  });

  // API Route: Delete Uploaded File
  app.post("/api/delete-upload", (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ error: "fileUrl is required" });
    }
    try {
      const deleted = deleteUploadFileByUrl(fileUrl);
      return res.json({ success: true, deleted });
    } catch (err: any) {
      console.error("Delete file error:", err);
      return res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // API Route: Work (Projects)
  app.get("/api/projects", (_req, res) => {
    const projects = getProjects(false);
    res.json({ success: true, projects });
  });

  app.get("/api/projects/all", (_req, res) => {
    const projects = getProjects(true);
    res.json({ success: true, projects });
  });

  app.post("/api/projects", (req, res) => {
    try {
      const project = saveProject(req.body);
      return res.json({ success: true, project });
    } catch (err: any) {
      console.error("Save project error:", err);
      return res.status(500).json({ error: "Failed to save project" });
    }
  });

  app.put("/api/projects/:id", (req, res) => {
    try {
      const project = saveProject({ ...req.body, id: req.params.id });
      return res.json({ success: true, project });
    } catch (err: any) {
      console.error("Update project error:", err);
      return res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", (req, res) => {
    try {
      const deleted = deleteProject(req.params.id);
      if (deleted) {
        return res.json({ success: true, message: "Project deleted successfully" });
      }
      return res.status(404).json({ error: "Project not found" });
    } catch (err: any) {
      console.error("Delete project error:", err);
      return res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // API Route: Insights (Blog Posts)
  app.get("/api/blogs", (_req, res) => {
    const blogs = getBlogs(false);
    res.json({ success: true, blogs });
  });

  app.get("/api/blogs/all", (_req, res) => {
    const blogs = getBlogs(true);
    res.json({ success: true, blogs });
  });

  app.post("/api/blogs", (req, res) => {
    try {
      const blog = saveBlog(req.body);
      return res.json({ success: true, blog });
    } catch (err: any) {
      console.error("Save blog error:", err);
      return res.status(500).json({ error: "Failed to save blog post" });
    }
  });

  app.put("/api/blogs/:id", (req, res) => {
    try {
      const blog = saveBlog({ ...req.body, id: req.params.id });
      return res.json({ success: true, blog });
    } catch (err: any) {
      console.error("Update blog error:", err);
      return res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/blogs/:id", (req, res) => {
    try {
      const deleted = deleteBlog(req.params.id);
      if (deleted) {
        return res.json({ success: true, message: "Blog post deleted successfully" });
      }
      return res.status(404).json({ error: "Blog post not found" });
    } catch (err: any) {
      console.error("Delete blog error:", err);
      return res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // API Route: Check Slug Availability
  app.post("/api/blogs/check-slug", (req, res) => {
    const { slug, currentId } = req.body;
    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }
    const clean = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const allBlogs = getBlogs(true);
    const existing = allBlogs.find(
      (b) => b.id !== currentId && (b.slug === clean || b.oldSlugs?.includes(clean))
    );

    if (existing) {
      return res.json({
        available: false,
        message: "This blog URL is already in use. Please choose a different URL.",
      });
    }

    return res.json({ available: true, slug: clean });
  });

  // Lazy initialization helper for server-side Gemini API
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Route: Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", agency: "Calvix Digitals", timestamp: new Date().toISOString() });
  });

  // API Route: Contact & Consultation Request (Saves to Supabase AND local database)
  app.post("/api/consultation", async (req, res) => {
    const {
      name,
      fullName,
      full_name,
      email,
      phone,
      businessName,
      business_name,
      service,
      message,
      projectDetails,
      budget,
      projectType,
      project_type,
      source,
      notes,
    } = req.body;

    const clientName = (full_name || fullName || name || "").trim();
    const clientEmail = email?.trim()?.toLowerCase();

    if (!clientName || !clientEmail) {
      return res.status(400).json({ error: "Please provide both full name and a valid email address." });
    }

    const clientIp = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "";

    const bookingPayload = {
      full_name: clientName,
      email: clientEmail,
      phone: phone?.trim() || undefined,
      business_name: (business_name || businessName || "").trim() || undefined,
      service: (service || "General Inquiry").trim(),
      message: (message || projectDetails || "").trim() || undefined,
      budget: (budget || "").trim() || undefined,
      project_type: (project_type || projectType || "").trim() || undefined,
      status: "New",
      source: source || "Website Form",
      ip_address: clientIp,
      notes: notes || undefined,
    };

    // Save to local file store
    let localSaved: any = null;
    try {
      localSaved = saveLocalBooking(bookingPayload);
    } catch (err) {
      console.warn("Could not save to local dbStore:", err);
    }

    // Also attempt saving to Supabase
    try {
      await saveBookingToSupabase({
        ...bookingPayload,
        phone: bookingPayload.phone || null,
        business_name: bookingPayload.business_name || null,
        message: bookingPayload.message || null,
        budget: bookingPayload.budget || null,
        project_type: bookingPayload.project_type || null,
        notes: bookingPayload.notes || null,
      });
    } catch (supaErr) {
      console.warn("Supabase background sync note:", supaErr);
    }

    return res.json({
      success: true,
      message: "Thank you! Your request has been received successfully. Our team will contact you shortly.",
      booking: localSaved,
    });
  });

  // API Route: Get All Bookings (Merges Supabase & Local Database)
  app.get("/api/bookings", async (_req, res) => {
    try {
      const localBookings = getLocalBookings();
      const supabaseResult = await getBookingsFromSupabase();
      const supabaseList = supabaseResult.bookings || [];

      // Combine bookings, deduplicating by ID or email+created_at
      const map = new Map<string, any>();

      // Put local bookings in map
      localBookings.forEach((item) => {
        map.set(item.id, item);
      });

      // Overlay supabase bookings
      supabaseList.forEach((item: any) => {
        const id = item.id ? String(item.id) : `sb-${item.email}-${item.created_at}`;
        const existing = map.get(id);
        map.set(id, {
          id,
          created_at: item.created_at || existing?.created_at || new Date().toISOString(),
          createdAt: item.created_at || existing?.createdAt || new Date().toISOString(),
          full_name: item.full_name || item.name || existing?.full_name || "Client",
          name: item.full_name || item.name || existing?.name || "Client",
          email: item.email || existing?.email || "",
          phone: item.phone || existing?.phone || "",
          business_name: item.business_name || item.businessName || existing?.business_name || "",
          businessName: item.business_name || item.businessName || existing?.businessName || "",
          service: item.service || existing?.service || "General Inquiry",
          message: item.message || item.projectDetails || existing?.message || "",
          projectDetails: item.message || item.projectDetails || existing?.projectDetails || "",
          budget: item.budget || existing?.budget || "",
          project_type: item.project_type || item.projectType || existing?.project_type || "",
          projectType: item.project_type || item.projectType || existing?.projectType || "",
          status: item.status || existing?.status || "New",
          source: item.source || existing?.source || "Website Form",
          ip_address: item.ip_address || existing?.ip_address || "",
          notes: item.notes || existing?.notes || "",
        });
      });

      const combined = Array.from(map.values()).sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      return res.json({
        success: true,
        bookings: combined,
      });
    } catch (err: any) {
      console.error("Fetch bookings error:", err);
      const fallback = getLocalBookings();
      return res.json({
        success: true,
        bookings: fallback,
      });
    }
  });

  // API Route: Update Booking Status & Notes
  app.put("/api/bookings/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updated = updateLocalBookingStatus(id, status, notes);
      return res.json({ success: true, updated });
    } catch (err: any) {
      console.error("Update booking error:", err);
      return res.status(500).json({ error: "Failed to update booking" });
    }
  });

  // API Route: Delete Booking
  app.delete("/api/bookings/:id", (req, res) => {
    try {
      const { id } = req.params;
      const deleted = deleteLocalBooking(id);
      return res.json({ success: true, deleted });
    } catch (err: any) {
      console.error("Delete booking error:", err);
      return res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  // API Route: AI Website & Growth Audit Tool
  app.post("/api/ai-audit", async (req, res) => {
    const { websiteUrl, businessCategory, goal } = req.body;

    if (!businessCategory) {
      return res.status(400).json({ error: "Business category is required." });
    }

    try {
      const ai = getGenAI();
      if (!ai) {
        // Fallback realistic response if GEMINI_API_KEY is not configured
        return res.json({
          success: true,
          audit: {
            title: `Growth & Digital Opportunity Audit for ${businessCategory}`,
            score: 78,
            keyStrengths: [
              "Clear industry positioning potential",
              "High upside for conversion rate optimization",
            ],
            criticalGaps: [
              "Outdated mobile viewport responsiveness & typography hierarchy",
              "Lack of AI-assisted lead capture or instant consultation booking",
              "Slow page performance and missing Schema.org structured data",
            ],
            recommendations: [
              "Redesign visual identity using high-contrast typography and 8pt grid spacing",
              "Implement an AI-powered conversational lead agent to capture 24/7 client inquiries",
              "Optimize core web vitals for sub-1 second loading speed and 95+ Lighthouse score",
            ],
            calvixImpactEstimate: "3.5x conversion lift with modern AI Web Stack",
          },
        });
      }

      const prompt = `You are a Senior Digital Strategist & Conversion Engineer at Calvix Digitals agency.
Perform an expert, actionable 5-second Digital & Conversion Audit for a business in the '${businessCategory}' industry${websiteUrl ? ` with website URL: ${websiteUrl}` : ""}. Goal: '${goal || "Increase conversions & build trust"}'.

Respond STRICTLY in valid JSON matching this schema:
{
  "title": "Short title describing the audit scope",
  "score": 72,
  "keyStrengths": ["Strength 1", "Strength 2"],
  "criticalGaps": ["Gap 1", "Gap 2", "Gap 3"],
  "recommendations": ["Actionable Rec 1", "Actionable Rec 2", "Actionable Rec 3"],
  "calvixImpactEstimate": "Expected growth outcome (e.g. 3x leads in 30 days)"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const auditData = JSON.parse(response.text || "{}");
      return res.json({ success: true, audit: auditData });
    } catch (err: any) {
      console.error("AI Audit generation error:", err);
      return res.status(500).json({
        error: "Unable to complete AI audit at this moment. Please try again or contact our team directly.",
      });
    }
  });

  // API Route: AI Instant Quote & Scope Builder
  app.post("/api/quote-calculator", async (req, res) => {
    const { projectType, projectScope, urgency, businessType } = req.body;

    let basePricePKR = 10000;
    if (projectScope === "Business Scale") {
      basePricePKR = 25000;
    } else if (projectScope === "Enterprise Custom") {
      basePricePKR = 50000;
    }

    const items = [
      {
        service: projectType || "Custom Digital Project",
        pricePKR: basePricePKR,
        description: `${projectScope || "Standard"} tailored solution for ${businessType || "business"}`
      }
    ];

    let aiScopeAnalysis = "Custom tailored scope designed for maximum ROI and rapid deployment.";

    try {
      const ai = getGenAI();
      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Act as Creative Director at Calvix Digitals. Write a 2-sentence executive technical recommendation for a ${businessType || "business"} client requesting: ${projectType || "Digital Transformation"} at ${projectScope || "Standard"} tier. Emphasize how this scope drives growth, trust, and conversions.`,
        });
        if (response.text) {
          aiScopeAnalysis = response.text.trim();
        }
      }
    } catch (e) {
      console.warn("Gemini quote summary skipped:", e);
    }

    return res.json({
      success: true,
      estimatedTotalPKR: basePricePKR,
      estimatedUSD: Math.round(basePricePKR / 278),
      timelineDays: urgency === "rush" ? "5-7 Days (Express)" : "10-14 Days",
      lineItems: items,
      executiveRecommendation: aiScopeAnalysis,
    });
  });

  // Helper for SEO HTML Injection
  const DOMAIN = "https://calvix-digitals.ai.studio";

  const escapeHtml = (str: string) =>
    (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const injectSeoIntoHtml = (
    htmlTemplate: string,
    seo: {
      title: string;
      description: string;
      canonicalUrl: string;
      robots: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
      ogType?: string;
      ogUrl?: string;
      jsonLd?: any[];
    }
  ) => {
    const titleTag = `<title>${escapeHtml(seo.title)}</title>`;
    const metaDesc = `<meta name="description" content="${escapeHtml(seo.description)}" />`;
    const metaRobots = `<meta name="robots" content="${escapeHtml(seo.robots)}" />`;
    const linkCanonical = `<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`;
    const ogTitle = `<meta property="og:title" content="${escapeHtml(seo.ogTitle || seo.title)}" />`;
    const ogDesc = `<meta property="og:description" content="${escapeHtml(seo.ogDescription || seo.description)}" />`;
    const ogUrl = `<meta property="og:url" content="${escapeHtml(seo.ogUrl || seo.canonicalUrl)}" />`;
    const ogType = `<meta property="og:type" content="${escapeHtml(seo.ogType || "website")}" />`;
    const ogImg = seo.ogImage ? `<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />` : "";
    const twCard = `<meta name="twitter:card" content="summary_large_image" />`;
    const twTitle = `<meta name="twitter:title" content="${escapeHtml(seo.ogTitle || seo.title)}" />`;
    const twDesc = `<meta name="twitter:description" content="${escapeHtml(seo.ogDescription || seo.description)}" />`;
    const twImg = seo.ogImage ? `<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />` : "";

    let jsonLdScripts = "";
    if (seo.jsonLd && seo.jsonLd.length > 0) {
      seo.jsonLd.forEach((ld, idx) => {
        jsonLdScripts += `\n    <script type="application/ld+json" data-seo-jsonld="true" data-schema-index="${idx}">${JSON.stringify(ld)}</script>`;
      });
    }

    const seoBlock = `\n    ${metaRobots}\n    ${linkCanonical}\n    ${ogUrl}\n    ${ogType}\n    ${ogTitle}\n    ${ogDesc}\n    ${ogImg}\n    ${twCard}\n    ${twTitle}\n    ${twDesc}\n    ${twImg}${jsonLdScripts}\n`;

    let result = htmlTemplate.replace(/<title>.*?<\/title>/i, titleTag);
    result = result.replace(/<meta\s+name=["']description["'].*?>/i, metaDesc);
    result = result.replace("</head>", `${seoBlock}</head>`);
    return result;
  };

  const getHtmlTemplate = () => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = isProd
      ? path.join(process.cwd(), "dist", "index.html")
      : path.join(process.cwd(), "index.html");
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    return `<!doctype html><html><head><title>Calvix Digitals</title></head><body><div id="root"></div></body></html>`;
  };

  // Blog Page Server Route
  app.get("/blog", (req, res, next) => {
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      const htmlTemplate = getHtmlTemplate();
      const seoData = {
        title: "Blog & Insights | AI Web Development & Digital Growth | Calvix Digital",
        description: "Actionable insights, tutorials, and strategy guides on AI web development, Generative Engine Optimization (GEO), premium branding, and e-commerce scaling.",
        canonicalUrl: `${DOMAIN}/blog`,
        robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
        ogTitle: "Blog & Insights | AI Web Development & Digital Growth",
        ogDescription: "Actionable insights, tutorials, and strategy guides on AI web development, Generative Engine Optimization (GEO), premium branding, and e-commerce scaling.",
        ogUrl: `${DOMAIN}/blog`,
        ogType: "website",
      };
      const renderedHtml = injectSeoIntoHtml(htmlTemplate, seoData);
      return res.send(renderedHtml);
    }
    next();
  });

  // Blog Article Detail Server Route
  app.get("/blog/:slug", (req, res, next) => {
    const { slug } = req.params;
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      const blogs = getBlogs(false);
      const matchedPost = blogs.find(
        (b) => b.slug === slug || (b.oldSlugs && b.oldSlugs.includes(slug)) || b.id === slug
      );

      if (matchedPost && matchedPost.status !== "draft") {
        const articleUrl = `${DOMAIN}/blog/${matchedPost.slug}`;
        const canonicalUrl = matchedPost.canonicalUrl && matchedPost.canonicalUrl.startsWith("http") && !matchedPost.canonicalUrl.endsWith("/blog")
          ? matchedPost.canonicalUrl
          : articleUrl;

        const articleSchema = {
          "@context": "https://schema.org",
          "@type": "Article",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl,
          },
          "url": articleUrl,
          "headline": matchedPost.seoTitle || matchedPost.title,
          "description": matchedPost.metaDescription || matchedPost.summary,
          "image": [matchedPost.ogImage || matchedPost.coverImage],
          "author": {
            "@type": "Organization",
            "name": matchedPost.author || "Calvix Digital",
            "url": DOMAIN,
          },
          "publisher": {
            "@type": "Organization",
            "name": "Calvix Digital",
            "logo": {
              "@type": "ImageObject",
              "url": `${DOMAIN}/logo.png`,
            },
          },
          "datePublished": matchedPost.publishedAt || matchedPost.createdAt || new Date().toISOString(),
          "dateModified": matchedPost.updatedAt || matchedPost.publishedAt || matchedPost.createdAt || new Date().toISOString(),
        };

        const seoData = {
          title: matchedPost.seoTitle || `${matchedPost.title} | Calvix Digital`,
          description: matchedPost.metaDescription || matchedPost.summary,
          canonicalUrl: canonicalUrl,
          robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
          ogTitle: matchedPost.ogTitle || matchedPost.seoTitle || matchedPost.title,
          ogDescription: matchedPost.ogDescription || matchedPost.metaDescription || matchedPost.summary,
          ogImage: matchedPost.ogImage || matchedPost.coverImage,
          ogUrl: articleUrl,
          ogType: "article",
          jsonLd: [articleSchema],
        };

        const htmlTemplate = getHtmlTemplate();
        const renderedHtml = injectSeoIntoHtml(htmlTemplate, seoData);
        return res.send(renderedHtml);
      } else {
        // Draft or 404
        const htmlTemplate = getHtmlTemplate();
        const seoData = {
          title: "Article Not Found | Calvix Digital",
          description: "The requested blog article could not be found or has been moved.",
          canonicalUrl: `${DOMAIN}/blog`,
          robots: "noindex, follow",
        };
        const renderedHtml = injectSeoIntoHtml(htmlTemplate, seoData);
        return res.status(404).send(renderedHtml);
      }
    }
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Calvix Digitals Agency Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
