import { BlogPost } from "../types";

/**
 * Converts any string into a clean, lowercased, hyphen-separated SEO slug.
 * Removes special characters, accents, and trailing/duplicate hyphens.
 */
export function generateSlug(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with single hyphen
    .replace(/-+/g, "-") // remove consecutive hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Validates whether a slug is non-empty, properly formatted, and unique.
 */
export function validateSlug(
  slug: string,
  currentId?: string,
  existingBlogs: BlogPost[] = []
): { isValid: boolean; error?: string } {
  const clean = generateSlug(slug);

  if (!clean) {
    return { isValid: false, error: "URL slug cannot be empty." };
  }

  const duplicate = existingBlogs.find(
    (b) => b.id !== currentId && (b.slug === clean || b.oldSlugs?.includes(clean))
  );

  if (duplicate) {
    return {
      isValid: false,
      error: "This blog URL is already in use. Please choose a different URL.",
    };
  }

  return { isValid: true };
}

export interface SEOHealthCheck {
  id: string;
  label: string;
  status: "good" | "warning" | "missing";
  message: string;
}

/**
 * Generates an SEO & GEO Health checklist and overall score for an article.
 */
export function analyzeSEOHealth(blog: Partial<BlogPost>): { score: number; checks: SEOHealthCheck[] } {
  const checks: SEOHealthCheck[] = [];

  // 1. Title
  if (!blog.title || blog.title.trim().length === 0) {
    checks.push({ id: "title", label: "Article Title", status: "missing", message: "Title is missing." });
  } else if (blog.title.length < 20) {
    checks.push({ id: "title", label: "Article Title", status: "warning", message: "Title is somewhat short." });
  } else {
    checks.push({ id: "title", label: "Article Title", status: "good", message: "Strong headline title." });
  }

  // 2. Slug
  const slug = blog.slug || "";
  if (!slug) {
    checks.push({ id: "slug", label: "URL Slug", status: "missing", message: "Slug is missing." });
  } else if (slug !== generateSlug(slug)) {
    checks.push({ id: "slug", label: "URL Slug", status: "warning", message: "Slug contains invalid characters." });
  } else {
    checks.push({ id: "slug", label: "URL Slug", status: "good", message: `Clean URL: /blog/${slug}` });
  }

  // 3. SEO Title
  const seoTitle = blog.seoTitle || blog.title || "";
  if (!seoTitle) {
    checks.push({ id: "seoTitle", label: "SEO Title", status: "missing", message: "No SEO title configured." });
  } else if (seoTitle.length > 60) {
    checks.push({ id: "seoTitle", label: "SEO Title", status: "warning", message: `${seoTitle.length}/60 chars (may truncate in search).` });
  } else {
    checks.push({ id: "seoTitle", label: "SEO Title", status: "good", message: `${seoTitle.length}/60 chars (Optimal length).` });
  }

  // 4. Meta Description
  const metaDesc = blog.metaDescription || blog.summary || "";
  if (!metaDesc) {
    checks.push({ id: "metaDesc", label: "Meta Description", status: "missing", message: "Meta description is missing." });
  } else if (metaDesc.length < 50 || metaDesc.length > 160) {
    checks.push({ id: "metaDesc", label: "Meta Description", status: "warning", message: `${metaDesc.length}/160 chars (Aim for 120–160 chars).` });
  } else {
    checks.push({ id: "metaDesc", label: "Meta Description", status: "good", message: `${metaDesc.length}/160 chars (Optimal length).` });
  }

  // 5. Focus Keyword
  const focusKw = (blog.focusKeyword || "").toLowerCase().trim();
  if (!focusKw) {
    checks.push({ id: "focusKw", label: "Focus Keyword", status: "warning", message: "No primary focus keyword defined." });
  } else {
    const inTitle = (blog.title || "").toLowerCase().includes(focusKw);
    const inContent = (blog.content || "").toLowerCase().includes(focusKw) || (blog.summary || "").toLowerCase().includes(focusKw);
    if (inTitle || inContent) {
      checks.push({ id: "focusKw", label: "Focus Keyword", status: "good", message: `Keyword "${focusKw}" found naturally in content.` });
    } else {
      checks.push({ id: "focusKw", label: "Focus Keyword", status: "warning", message: `Keyword "${focusKw}" not found in title or content body.` });
    }
  }

  // 6. Featured Image & Alt Text
  if (!blog.coverImage) {
    checks.push({ id: "image", label: "Featured Image", status: "missing", message: "Cover image missing." });
  } else if (!blog.imageAlt) {
    checks.push({ id: "image", label: "Featured Image Alt Text", status: "warning", message: "Alt text missing for search accessibility." });
  } else {
    checks.push({ id: "image", label: "Featured Image & Alt Text", status: "good", message: "Image and descriptive alt text set." });
  }

  // 7. Canonical URL
  if (blog.canonicalUrl) {
    checks.push({ id: "canonical", label: "Canonical URL", status: "good", message: "Explicit canonical tag set." });
  } else {
    checks.push({ id: "canonical", label: "Canonical URL", status: "good", message: `Defaults to https://calvix-digitals.ai.studio/blog/${slug || "..."}` });
  }

  // 8. Content Length
  const wordCount = (blog.content || "").split(/\s+/).filter(Boolean).length;
  if (wordCount < 100) {
    checks.push({ id: "contentLength", label: "Content Depth", status: "warning", message: `${wordCount} words (Short content).` });
  } else {
    checks.push({ id: "contentLength", label: "Content Depth", status: "good", message: `${wordCount} words (Good length).` });
  }

  // 9. Answer-First Intro / GEO
  if (blog.answerIntro) {
    checks.push({ id: "geo", label: "GEO Answer-First Intro", status: "good", message: "Direct concise answer configured for AI Search engines." });
  } else {
    checks.push({ id: "geo", label: "GEO Answer-First Intro", status: "warning", message: "Add a concise direct answer summary for AI Search optimization." });
  }

  // 10. FAQs
  if (blog.faqs && blog.faqs.length > 0) {
    checks.push({ id: "faqs", label: "Structured FAQs", status: "good", message: `${blog.faqs.length} FAQ item(s) configured (Generates FAQPage schema).` });
  } else {
    checks.push({ id: "faqs", label: "Structured FAQs", status: "warning", message: "No FAQ items added." });
  }

  let score = 0;
  checks.forEach((c) => {
    if (c.status === "good") score += 10;
    else if (c.status === "warning") score += 5;
  });

  return { score, checks };
}
