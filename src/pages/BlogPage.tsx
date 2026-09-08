import React, { useState } from "react";
import { ArrowRight, Search, FileText, Sparkles, Tag, Folder } from "lucide-react";
import { BlogPost } from "../types";
import { navigateTo } from "../lib/router";
import { SEOHead } from "../components/SEOHead";

interface BlogPageProps {
  blogs?: BlogPost[];
  onOpenAdmin?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ blogs = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "AI & Web Development", "Branding", "E-Commerce", "Digital Marketing", "UI/UX", "SEO"];

  const publishedBlogs = blogs.filter((p) => p.status !== "draft");

  const filteredPosts = publishedBlogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.focusKeyword && post.focusKeyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-16 bg-white min-h-screen">
      <SEOHead
        title="Blog & Insights | AI Web Development & Digital Growth"
        description="Actionable insights, tutorials, and strategy guides on AI web development, Generative Engine Optimization (GEO), premium branding, and e-commerce scaling."
        canonicalUrl="https://calvix-digitals.ai.studio/blog"
        type="website"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Insights & Digital Strategy
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            Strategies for <span className="text-[#2563EB]">Modern Business Growth.</span>
          </h1>
          <p className="text-[#64748B] text-base sm:text-lg">
            Actionable articles on AI web development, Generative Engine Optimization (GEO), conversion optimization, and brand identity.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, topic, or keyword..."
              className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {publishedBlogs.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-[32px] p-12 text-center space-y-3 max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#0F172A]">
              Articles Coming Soon
            </h3>
            <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              We are preparing our next series of digital growth and AI strategy dispatches.
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] text-sm">
            No articles match your search query or selected category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(`/blog/${post.slug}`);
                }}
                className="bg-white rounded-[24px] border border-slate-200/80 shadow-soft hover:shadow-soft-hover overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={post.coverImage}
                      alt={post.imageAlt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-white/95 backdrop-blur-md text-[#2563EB] text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                        {post.category}
                      </span>
                      {post.pdf_url && (
                        <span className="bg-emerald-600/90 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <FileText className="w-3 h-3" /> PDF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                      <span>By {post.author || "Calvix Digital"}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="font-heading font-extrabold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-[#64748B] text-xs leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#2563EB]">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
