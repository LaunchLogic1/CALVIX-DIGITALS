import React from "react";

export const TrustedByMarquee: React.FC = () => {
  const logos = [
    { name: "Apex Horizon Real Estate", label: "APEX HORIZON" },
    { name: "Luxe Couture E-Com", label: "LUXE APPAREL" },
    { name: "NovaCare Medical Clinics", label: "NOVACARE HEALTH" },
    { name: "PulseAnalytics SaaS", label: "PULSE ANALYTICS" },
    { name: "Artisan Roasters", label: "ARTISAN COFFEE" },
    { name: "Solaris Clean Energy", label: "SOLARIS ENERGY" },
    { name: "OmniTech Solutions", label: "OMNITECH B2B" },
    { name: "Vanguard Law Firm", label: "VANGUARD LEGAL" },
  ];

  return (
    <section className="py-10 bg-[#F8FAFC] border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">
          Trusted by modern businesses, ambitious startups & industry leaders
        </p>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap">
          {/* Duplicate loop for infinite smooth scroll */}
          {[...logos, ...logos].map((company, index) => (
            <div
              key={index}
              className="flex items-center gap-2 group cursor-pointer transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-200 group-hover:bg-[#2563EB] text-slate-700 group-hover:text-white font-extrabold text-xs flex items-center justify-center transition-colors">
                {company.label.substring(0, 2)}
              </div>
              <span className="font-heading font-extrabold text-sm sm:text-base text-slate-700 group-hover:text-[#0F172A] tracking-tight">
                {company.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
