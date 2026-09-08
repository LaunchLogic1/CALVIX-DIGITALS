import React, { useState } from "react";
import { Sparkles, Layers, ArrowUpRight } from "lucide-react";
import { SERVICE_CATEGORIES, SERVICES_DATA } from "../data/agencyData";
import { ServiceItem } from "../types";
import { ServiceCard } from "./services/ServiceCard";
import { ServiceDetailModal } from "./services/ServiceDetailModal";
import { ServicesCTA } from "./services/ServicesCTA";

interface ServicesSectionProps {
  onOpenConsultation: (serviceName?: string) => void;
  onOpenCalculator: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenConsultation,
  onOpenCalculator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const categories = ["ALL", "BUILD", "GROW", "AI", "CREATE"];

  const handleBookService = (service: ServiceItem) => {
    onOpenConsultation(service.title);
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#F8FAFC] relative overflow-hidden">
      {/* Decorative subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Section Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#2563EB]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR CAPABILITIES</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight">
            Everything Your Business <span className="text-[#2563EB]">Needs to Grow.</span>
          </h2>

          <p className="text-[#64748B] text-base sm:text-lg leading-relaxed">
            From building your digital foundation to attracting customers, creating premium content, deploying intelligent AI systems, and automating your operations — Calvix brings your growth stack together under one roof.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0F172A] text-white shadow-md shadow-slate-900/10 scale-105"
                      : "bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  {cat === "ALL" ? "All 10 Services" : `${cat} Track`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories & Service Cards Grid */}
        <div className="space-y-16">
          {SERVICE_CATEGORIES.filter(
            (cat) => selectedCategory === "ALL" || selectedCategory === cat.id
          ).map((category) => (
            <div key={category.id} className="space-y-8">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      CATEGORY
                    </span>
                    <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
                      {category.heading}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl">
                    {category.description}
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-500 shrink-0">
                  {category.services.length} {category.services.length === 1 ? "Service" : "Services"}
                </span>
              </div>

              {/* Service Cards Grid */}
              <div className={`grid grid-cols-1 gap-6 ${
                category.services.length === 1
                  ? "sm:grid-cols-1 max-w-xl mx-auto"
                  : category.services.length === 2
                  ? "sm:grid-cols-2"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              }`}>
                {category.services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onSelect={(s) => setSelectedService(s)}
                    onBook={(s) => handleBookService(s)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Final Section CTA */}
        <ServicesCTA
          onOpenConsultation={() => onOpenConsultation("General Growth Recommendation")}
          onOpenCalculator={onOpenCalculator}
        />

      </div>

      {/* Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={(s) => handleBookService(s)}
      />
    </section>
  );
};
