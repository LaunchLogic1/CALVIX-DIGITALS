import React, { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  type?: "website" | "article" | "service";
  image?: string;
  publishedDate?: string;
  authorName?: string;
  robots?: string;
  schemas?: any[];
}

const DOMAIN = "https://calvix-digitals.ai.studio";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords = "AI web development, digital agency, brand identity design, UI UX design, e-commerce solutions, AI product photography, Calvix Digitals",
  canonicalUrl,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  publishedDate,
  authorName = "Calvix Digitals Strategy Team",
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  schemas = [],
}) => {
  const currentUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href : DOMAIN);

  useEffect(() => {
    // 1. Update Title (ensuring <= 60 chars)
    let formattedTitle = title;
    if (!formattedTitle.includes("Calvix Digitals")) {
      formattedTitle = `${title} | Calvix Digitals`;
    }
    if (formattedTitle.length > 60) {
      formattedTitle = formattedTitle.substring(0, 57) + "...";
    }
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMeta = (attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentVal);
    };

    // Helper for link tags
    const setLink = (relVal: string, hrefVal: string) => {
      let element = document.querySelector(`link[rel="${relVal}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", relVal);
        document.head.appendChild(element);
      }
      element.setAttribute("href", hrefVal);
    };

    // 2. Set Meta Tags
    let cleanDesc = description;
    if (cleanDesc.length > 155) {
      cleanDesc = cleanDesc.substring(0, 152) + "...";
    }
    setMeta("name", "description", cleanDesc);
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", robots);
    setMeta("name", "viewport", "width=device-width, initial-scale=1.0");
    setMeta("name", "theme-color", "#2563EB");
    setMeta("name", "author", authorName);

    // 3. Open Graph
    setMeta("property", "og:title", formattedTitle);
    setMeta("property", "og:description", cleanDesc);
    setMeta("property", "og:type", type === "article" ? "article" : "website");
    setMeta("property", "og:url", currentUrl);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", "Calvix Digitals");

    // 4. Twitter Cards
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", formattedTitle);
    setMeta("name", "twitter:description", cleanDesc);
    setMeta("name", "twitter:image", image);

    // 5. Canonical URL
    setLink("canonical", currentUrl);

    // 6. JSON-LD Schemas Injection
    // Remove existing dynamic json-ld scripts
    const existingScripts = document.querySelectorAll("script[data-seo-jsonld='true']");
    existingScripts.forEach((s) => s.remove());

    schemas.forEach((schemaObj, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.setAttribute("data-schema-index", index.toString());
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });
  }, [title, description, keywords, currentUrl, type, image, publishedDate, authorName, robots, schemas]);

  return null;
};
