import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS_DATA } from "../data/agencyData";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Client Success Stories
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            Trusted by Business Leaders <span className="text-[#2563EB]">Worldwide.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg">
            Hear directly from CEOs, founders, and directors who scaled their revenue with Calvix Digitals.
          </p>
        </div>

        {/* Testimonials 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-[#F8FAFC] rounded-[24px] p-8 border border-slate-200/80 shadow-soft hover:shadow-soft-hover transition-all duration-300 relative space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Top Rating & Highlight */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                    {t.highlight}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#2563EB]/20"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#0F172A]">{t.name}</h4>
                  <p className="text-xs text-[#64748B]">{t.role}, <span className="font-semibold text-slate-800">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
