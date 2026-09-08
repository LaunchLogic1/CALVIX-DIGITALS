import React, { useState, useEffect } from "react";
import { BLOG_POSTS } from "../data/agencyData";
import { BlogPost } from "../types";
import { SEOHead } from "../components/SEOHead";
import { Breadcrumbs, buildBreadcrumbSchema } from "../components/Breadcrumbs";
import { navigateTo } from "../lib/router";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  Tag,
  FileText,
  Download,
  Copy,
  Check,
  HelpCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface BlogDetailPageProps {
  slug: string;
  blogs: BlogPost[];
  onBookCall: () => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug, blogs = [], onBookCall }) => {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const allBlogs = blogs.length > 0 ? blogs : BLOG_POSTS;

  // Search for post by current slug, oldSlugs, or ID
  const matchedPost = allBlogs.find(
    (b) => b.slug === slug || (b.oldSlugs && b.oldSlugs.includes(slug)) || b.id === slug
  );

  // If found via an old slug, handle canonical client-side redirect
  useEffect(() => {
    if (matchedPost && matchedPost.slug !== slug) {
      navigateTo(`/blog/${matchedPost.slug}`);
    }
  }, [matchedPost, slug]);

  // Handle 404 / Article Not Found
  if (!matchedPost || matchedPost.status === "draft") {
    return (
      <div className="bg-white min-h-screen text-[#0F172A] pt-32 pb-24 flex items-center justify-center px-4">
        <SEOHead
          title="Article Not Found | Calvix Digital"
          description="The requested blog article could not be found or has been moved."
          canonicalUrl="https://calvix-digitals.ai.studio/blog"
          robots="noindex, follow"
        />
        <div className="max-w-md w-full bg-slate-50 border border-slate-200/80 rounded-[32px] p-8 sm:p-10 text-center space-y-6 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">404 Error</span>
            <h1 className="font-heading font-extrabold text-2xl text-[#0F172A]">Article Not Found</h1>
            <p className="text-xs text-[#64748B] leading-relaxed">
              The article you are looking for doesn't exist, may have been renamed, or has been removed.
            </p>
          </div>
          <button
            onClick={() => navigateTo("/blog")}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Articles</span>
          </button>
        </div>
      </div>
    );
  }

  const post = matchedPost;
  const articleUrl = `https://calvix-digitals.ai.studio/blog/${post.slug}`;

  // Related Articles
  const relatedPosts = allBlogs
    .filter((b) => b.id !== post.id && b.status !== "draft")
    .filter((b) => b.category === post.category || b.tags?.some((t) => post.tags?.includes(t)))
    .slice(0, 3);

  // Fallback if not enough matching category/tags
  const finalRelated =
    relatedPosts.length >= 2
      ? relatedPosts
      : allBlogs.filter((b) => b.id !== post.id && b.status !== "draft").slice(0, 3);

  // Breadcrumbs
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Blog", path: "/blog" },
    { label: post.title, path: `/blog/${post.slug}` },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  // Article JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "url": articleUrl,
    "headline": post.seoTitle || post.title,
    "description": post.metaDescription || post.summary,
    "image": [post.ogImage || post.coverImage],
    "author": {
      "@type": "Organization",
      "name": post.author || "Calvix Digital",
      "url": "https://calvix-digitals.ai.studio",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Calvix Digital",
      "logo": {
        "@type": "ImageObject",
        "url": "https://calvix-digitals.ai.studio/logo.png",
      },
    },
    "datePublished": post.publishedAt || post.createdAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.publishedAt || post.createdAt || new Date().toISOString(),
  };

  // FAQPage JSON-LD schema (if FAQs exist)
  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": post.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer,
            },
          })),
        }
      : null;

  const schemasToInject: any[] = [articleSchema, breadcrumbSchema];
  if (faqSchema) schemasToInject.push(faqSchema);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const finalCanonicalUrl = post.canonicalUrl && post.canonicalUrl.startsWith("http") && !post.canonicalUrl.endsWith("/blog")
    ? post.canonicalUrl
    : articleUrl;

  return (
    <div className="bg-white min-h-screen text-[#0F172A] pt-24 pb-20">
      <SEOHead
        title={post.seoTitle || `${post.title} | Calvix Digital`}
        description={post.metaDescription || post.summary}
        keywords={
          post.focusKeyword
            ? `${post.focusKeyword}, ${post.secondaryKeywords ? post.secondaryKeywords.join(", ") : ""}, Calvix Digital`
            : post.tags?.join(", ") + ", Calvix Digital"
        }
        canonicalUrl={finalCanonicalUrl}
        robots="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        type="article"
        image={post.ogImage || post.coverImage}
        publishedDate={post.publishedAt || post.date}
        authorName={post.author || "Calvix Digital"}
        schemas={schemasToInject}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Visible Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.date}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-[#0F172A]">
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {(post.author || "C").charAt(0)}
            </div>
            <div>
              <p className="font-bold">{post.author || "Calvix Digital"}</p>
              <p className="text-[10px] text-slate-500 font-normal">Digital Growth Strategist at Calvix Digital</p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="h-80 sm:h-96 rounded-[32px] overflow-hidden border border-slate-200 shadow-md relative bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.imageAlt || post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article PDF CTA Banner (if PDF attached) */}
        {post.pdf_url && (
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                  READ OFFLINE
                </span>
                {post.pdf_file_size && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    •{" "}
                    {post.pdf_file_size / (1024 * 1024) < 1
                      ? `${Math.round(post.pdf_file_size / 1024)} KB`
                      : `${(post.pdf_file_size / (1024 * 1024)).toFixed(1)} MB`}
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                Download Article PDF Version
              </h3>
              <p className="text-xs text-slate-400">
                Download the PDF document version of this article for offline reading and team reference.
              </p>
            </div>

            <a
              href={post.pdf_url}
              download={post.pdf_file_name || `${post.slug}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-blue-glow inline-flex items-center gap-2 shrink-0 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
              <Download className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        )}

        {/* GEO Answer-First Intro Box */}
        {post.answerIntro && (
          <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Quick Summary & Executive Key Takeaway (GEO)</span>
            </div>
            <p className="text-sm text-[#0F172A] font-medium leading-relaxed">
              {post.answerIntro}
            </p>
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none text-[#0F172A] text-base leading-relaxed space-y-6 pt-2">
          {post.content.split("\n\n").map((paragraph, idx) => {
            if (paragraph.startsWith("### ")) {
              return (
                <h2 key={idx} className="font-heading font-extrabold text-2xl text-[#0F172A] pt-4">
                  {paragraph.replace("### ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={idx} className="font-heading font-extrabold text-2xl text-[#0F172A] pt-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            return (
              <p key={idx} className="text-[#475569] text-base leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Visible FAQ Section */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#2563EB]" />
              <h3 className="font-heading font-extrabold text-xl text-[#0F172A]">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="space-y-3">
              {post.faqs.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-[#0F172A] cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="text-[#2563EB] text-lg font-bold ml-2">
                      {openFaqIndex === fIdx ? "−" : "+"}
                    </span>
                  </button>
                  {openFaqIndex === fIdx && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#64748B] leading-relaxed border-t border-slate-200/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags & Social Share Section */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-[#2563EB]" />
            {post.tags?.map((tag, tIdx) => (
              <span key={tIdx} className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium mr-1">Share:</span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-[#2563EB] bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"
              title="Share on LinkedIn"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied ? "bg-emerald-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Article Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Related Articles Section */}
        {finalRelated.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-2xl text-[#0F172A]">
                Related Insights & Guides
              </h3>
              <button
                onClick={() => navigateTo("/blog")}
                className="text-xs font-bold text-[#2563EB] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {finalRelated.map((rel) => (
                <a
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(`/blog/${rel.slug}`);
                  }}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="h-32 rounded-xl overflow-hidden bg-slate-900">
                      <img src={rel.coverImage} alt={rel.imageAlt || rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
                      {rel.category}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="pt-3 text-[11px] font-semibold text-[#2563EB] flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Calvix Digital Consultation CTA */}
        <div className="bg-[#0F172A] text-white rounded-[28px] p-8 sm:p-10 space-y-4 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Transform Your Web & Digital Growth
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Ready to Upgrade to an AI-Powered Web Stack?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Calvix Digital engineers custom Next.js web applications with sub-second page performance, GEO metadata optimization, and 24/7 AI lead capture.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigateTo("/services/ai-web-development")}
                className="px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-blue-glow flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore AI Web Development</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onBookCall}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Book Strategy Consultation
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};