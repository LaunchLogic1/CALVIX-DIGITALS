import React from "react";
import { Cpu, Zap, Shield, TrendingUp, Sparkles, Award } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const stats = [
    { value: "50+", label: "Projects Delivered", desc: "Across Pakistan & International Markets" },
    { value: "99/100", label: "Lighthouse Performance", desc: "Sub-second loading speed guaranteed" },
    { value: "3.5x", label: "Average Conversion Uplift", desc: "Measurable revenue & lead growth" },
    { value: "100%", label: "Client Satisfaction", desc: "Long-term partnership focus" },
  ];

  const pillars = [
    {
      icon: Cpu,
      title: "AI-First Development",
      desc: "We embed intelligent AI workflows, automated lead engines, and generative media directly into your web stack.",
    },
    {
      icon: Zap,
      title: "Built for Performance",
      desc: "Every line of code is optimized for sub-1 second page loads, mobile fluidity, and maximum search engine authority.",
    },
    {
      icon: TrendingUp,
      title: "Strategy Before Design",
      desc: "We analyze your audience, sales funnel, and competitors before drawing a single wireframe. Design serves business growth.",
    },
    {
      icon: Shield,
      title: "Transparent & Reliable",
      desc: "Clear upfront pricing with no hidden fees, guaranteed timelines, and 100% full source code ownership upon completion.",
    },
  ];

  return (
    <section className="py-24 bg-white" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Why Choose Calvix
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            Built for Businesses That <span className="text-[#2563EB]">Want to Scale.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg">
            We bridge the gap between creative design, AI innovation, and real commercial results.
          </p>
        </div>

        {/* 4 Key Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {pillars.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-[24px] p-8 border border-slate-200/80 hover:border-[#2563EB] hover:bg-white hover:shadow-soft transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white text-[#2563EB] flex items-center justify-center shadow-sm mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <IconComp className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Statistics Banner */}
        <div className="bg-[#0F172A] text-white rounded-[32px] p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {stats.map((stat, idx) => (
              <div key={idx} className={`space-y-1.5 text-center ${idx !== 0 ? "pt-4 sm:pt-0" : ""}`}>
                <p className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#2563EB]">
                  {stat.value}
                </p>
                <p className="font-semibold text-sm text-slate-200">{stat.label}</p>
                <p className="text-[11px] text-slate-400">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
