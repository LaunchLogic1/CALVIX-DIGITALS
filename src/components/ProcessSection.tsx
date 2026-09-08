import React from "react";
import { Search, Compass, Layout, Code2, Rocket, TrendingUp } from "lucide-react";

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Discovery & Blueprint",
      desc: "We analyze your business model, target market, and goals to build a clear technical blueprint.",
    },
    {
      num: "02",
      icon: Compass,
      title: "Strategy & Architecture",
      desc: "We map out conversion pathways, content hierarchy, SEO metadata, and AI integration points.",
    },
    {
      num: "03",
      icon: Layout,
      title: "UI/UX & Visual Design",
      desc: "We craft custom, high-contrast user interfaces with 8pt grid precision and interactive prototypes.",
    },
    {
      num: "04",
      icon: Code2,
      title: "Next.js & AI Development",
      desc: "We engineer fast, secure code using React, TypeScript, and serverless AI endpoints.",
    },
    {
      num: "05",
      icon: Rocket,
      title: "Testing & Launch",
      desc: "Rigorous PageSpeed, security, and mobile responsiveness audits before going live.",
    },
    {
      num: "06",
      icon: TrendingUp,
      title: "Optimization & Growth",
      desc: "Continuous post-launch monitoring, conversion tracking, and ongoing enhancements.",
    },
  ];

  return (
    <section className="py-24 bg-[#F8FAFC] border-y border-slate-200" id="process">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            How We Work
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            A Proven 6-Step <span className="text-[#2563EB]">Growth Blueprint.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg">
            No guesswork. Our structured process ensures predictable timelines, flawless quality, and measurable ROI.
          </p>
        </div>

        {/* 6 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[24px] p-8 border border-slate-200/80 shadow-soft hover:shadow-soft-hover hover:border-[#2563EB]/40 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="font-heading font-extrabold text-2xl text-slate-300 group-hover:text-[#2563EB] transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                  <span>✓ Guaranteed Execution Quality</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
