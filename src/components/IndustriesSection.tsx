import React from "react";
import {
  Rocket,
  ShoppingBag,
  Building2,
  Activity,
  Utensils,
  GraduationCap,
  Shield,
  Compass,
  ArrowRight
} from "lucide-react";
import { INDUSTRIES_DATA } from "../data/agencyData";

interface IndustriesSectionProps {
  onOpenConsultation: () => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ onOpenConsultation }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Rocket": return Rocket;
      case "ShoppingBag": return ShoppingBag;
      case "Building2": return Building2;
      case "Activity": return Activity;
      case "Utensils": return Utensils;
      case "GraduationCap": return GraduationCap;
      case "Shield": return Shield;
      case "Compass": return Compass;
      default: return Rocket;
    }
  };

  return (
    <section className="py-24 bg-white" id="industries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Target Industries
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            Tailored Solutions for Your <span className="text-[#2563EB]">Specific Market.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg">
            Every industry has unique conversion drivers. We engineer custom digital experiences tailored to your domain.
          </p>
        </div>

        {/* Industries 4x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES_DATA.map((ind) => {
            const IconComp = getIcon(ind.iconName);
            return (
              <div
                key={ind.id}
                onClick={onOpenConsultation}
                className="bg-[#F8FAFC] rounded-[24px] p-6 border border-slate-200/80 hover:bg-white hover:border-[#2563EB] hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#2563EB] flex items-center justify-center shadow-sm mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <IconComp className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-2">
                    {ind.name}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                    {ind.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-[#2563EB]">
                  <span>{ind.keyFeature}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
