import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { TrustedByMarquee } from "./components/TrustedByMarquee";
import { ServicesSection } from "./components/ServicesSection";
import { TransformationSection } from "./components/TransformationSection";
import { FeaturedWork } from "./components/FeaturedWork";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ProcessSection } from "./components/ProcessSection";
import { IndustriesSection } from "./components/IndustriesSection";
import { PricingSection } from "./components/PricingSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FAQSection } from "./components/FAQSection";
import { FinalCTA } from "./components/FinalCTA";
import { SEOHead } from "./components/SEOHead";

// Modals
import { ConsultationModal } from "./components/ConsultationModal";
import { QuoteCalculatorModal } from "./components/QuoteCalculatorModal";
import { AIAuditModal } from "./components/AIAuditModal";
import { ProjectDetailModal } from "./components/ProjectDetailModal";

// Sub-Pages
import { PortfolioPage } from "./pages/PortfolioPage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { ContactPage } from "./pages/ContactPage";
import { LegalPage } from "./pages/LegalPage";
import { AdminPage } from "./pages/AdminPage";

import { PortfolioItem, BlogPost } from "./types";
import { parsePath, RouteState, navigateTo } from "./lib/router";
import { Sparkles } from "lucide-react";

export function App() {
  const [route, setRoute] = useState<RouteState>(() =>
    parsePath(typeof window !== "undefined" ? window.location.pathname : "/")
  );

  // Dynamic Content State from Database
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // Modal States
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationService, setConsultationService] = useState<string | undefined>(undefined);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState<PortfolioItem | null>(null);

  // Synchronize route with browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch Public Content from API
  const fetchPublicContent = async () => {
    try {
      const [projRes, blogRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/blogs"),
      ]);
      const projData = await projRes.json();
      const blogData = await blogRes.json();

      if (projData.success) {
        setProjects(projData.projects || []);
      }
      if (blogData.success) {
        setBlogs(blogData.blogs || []);
      }
    } catch (err) {
      console.error("Error loading database content:", err);
    }
  };

  useEffect(() => {
    fetchPublicContent();
  }, []);

  const handleOpenConsultation = (serviceName?: string) => {
    setConsultationService(serviceName);
    setIsConsultationOpen(true);
  };

  // Schemas for Homepage
  const homeOrgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Calvix Digitals",
    "alternateName": "Calvix Digital Agency",
    "url": "https://calvix-digitals.ai.studio",
    "logo": "https://calvix-digitals.ai.studio/logo.png",
    "description": "Calvix Digitals is an enterprise-grade digital agency engineering Next.js 15 websites, e-commerce applications, brand identity systems, and AI solutions.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Urdu"]
    },
    "sameAs": [
      "https://github.com/calvixdigitals",
      "https://linkedin.com/company/calvixdigitals",
      "https://instagram.com/calvixdigitals"
    ]
  };

  const homeWebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Calvix Digitals",
    "url": "https://calvix-digitals.ai.studio",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://calvix-digitals.ai.studio/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const homeWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Calvix Digitals | Premium AI-Powered Digital Agency",
    "url": "https://calvix-digitals.ai.studio",
    "description": "Enterprise AI web development, brand identity design, e-commerce storefronts, and UI/UX systems engineered for high conversion rates."
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased selection:bg-[#2563EB] selection:text-white flex flex-col justify-between">
      
      {/* Dynamic SEO Head based on active route tab */}
      {route.tab === "home" && (
        <SEOHead
          title="Calvix Digitals | Premium AI-Powered Digital Agency"
          description="Enterprise AI web development, Next.js 15, brand identity, e-commerce storefronts, and UI/UX design systems engineered for conversion."
          keywords="AI web development, Next.js digital agency, brand identity design, UI UX design, e-commerce solutions, GEO search optimization, Calvix Digitals"
          canonicalUrl="https://calvix-digitals.ai.studio/"
          schemas={[homeOrgSchema, homeWebSiteSchema, homeWebPageSchema]}
        />
      )}

      {/* Top Fixed Navbar (hidden on admin page) */}
      {route.tab !== "admin" && (
        <Navbar
          activeTab={route.tab}
          setActiveTab={(tabId) => {
            const mapPath: Record<string, string> = {
              home: "/",
              portfolio: "/portfolio",
              pricing: "/pricing",
              about: "/about",
              blog: "/blog",
              contact: "/contact",
              legal: "/privacy-policy",
              admin: "/admin",
            };
            navigateTo(mapPath[tabId] || "/");
          }}
          onOpenConsultation={() => handleOpenConsultation()}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {route.tab === "home" && (
          <>
            <HeroSection
              onOpenConsultation={() => handleOpenConsultation()}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onExploreWork={() => navigateTo("/portfolio")}
            />
            <TrustedByMarquee />
            <ServicesSection
              onOpenConsultation={handleOpenConsultation}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
            />
            <TransformationSection onOpenConsultation={() => handleOpenConsultation()} />
            <FeaturedWork
              projects={projects}
              onSelectProject={(proj) => setSelectedProjectModal(proj)}
              onViewAllWork={() => navigateTo("/portfolio")}
              onOpenAdmin={() => navigateTo("/admin")}
            />
            <WhyChooseUs />
            <ProcessSection />
            <IndustriesSection onOpenConsultation={() => handleOpenConsultation()} />
            <PricingSection
              onOpenConsultation={() => handleOpenConsultation()}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
            />
            <TestimonialsSection />
            <FAQSection />
            <FinalCTA
              onOpenConsultation={() => handleOpenConsultation()}
              onOpenAudit={() => setIsAuditOpen(true)}
            />
          </>
        )}

        {route.tab === "portfolio" && (
          <PortfolioPage
            projects={projects}
            onSelectProject={(proj) => setSelectedProjectModal(proj)}
            onBookCall={() => handleOpenConsultation()}
            onOpenAdmin={() => navigateTo("/admin")}
          />
        )}

        {route.tab === "pricing" && (
          <PricingPage
            onOpenConsultation={() => handleOpenConsultation()}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        )}

        {route.tab === "about" && (
          <AboutPage onOpenConsultation={() => handleOpenConsultation()} />
        )}

        {route.tab === "blog" && (
          <BlogPage
            blogs={blogs}
            onOpenAdmin={() => navigateTo("/admin")}
          />
        )}

        {route.tab === "blog-detail" && route.blogSlug && (
          <BlogDetailPage
            slug={route.blogSlug}
            blogs={blogs}
            onBookCall={() => handleOpenConsultation()}
          />
        )}

        {route.tab === "contact" && <ContactPage />}

        {route.tab === "legal" && <LegalPage />}

        {route.tab === "admin" && (
          <AdminPage
            onContentUpdated={fetchPublicContent}
            onNavigateHome={() => navigateTo("/")}
          />
        )}
      </main>

      {/* Footer (hidden on admin) */}
      {route.tab !== "admin" && (
        <Footer
          setActiveTab={(tabId) => {
            const mapPath: Record<string, string> = {
              home: "/",
              portfolio: "/portfolio",
              pricing: "/pricing",
              about: "/about",
              blog: "/blog",
              contact: "/contact",
              legal: "/privacy-policy",
              admin: "/admin",
            };
            navigateTo(mapPath[tabId] || "/");
          }}
          onOpenConsultation={() => handleOpenConsultation()}
        />
      )}

      {/* Floating Action Buttons */}
      {route.tab !== "admin" && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
          <button
            onClick={() => setIsAuditOpen(true)}
            className="pointer-events-auto bg-white text-[#0F172A] border border-slate-200 shadow-soft hover:shadow-soft-hover px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Free AI Audit</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        defaultService={consultationService}
        onClose={() => {
          setIsConsultationOpen(false);
          setConsultationService(undefined);
        }}
      />

      <QuoteCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onProceedToConsultation={() => {
          setIsCalculatorOpen(false);
          setIsConsultationOpen(true);
        }}
      />

      <AIAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        onBookCall={() => {
          setIsAuditOpen(false);
          setIsConsultationOpen(true);
        }}
      />

      <ProjectDetailModal
        project={selectedProjectModal}
        onClose={() => setSelectedProjectModal(null)}
        onBookCall={() => {
          setSelectedProjectModal(null);
          setIsConsultationOpen(true);
        }}
      />

    </div>
  );
}

export default App;
