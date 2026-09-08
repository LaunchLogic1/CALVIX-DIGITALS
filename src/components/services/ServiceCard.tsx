import React from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { ServiceItem } from "../../types";

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
  onBook: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  onBook,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "BUILD":
        return {
          borderHover: "hover:border-blue-500/80",
          glow: "hover:shadow-blue-500/10",
          badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
          accentText: "text-blue-600",
          outcomeBg: "bg-blue-50/60 border-blue-100",
          btnHover: "hover:bg-blue-600",
        };
      case "GROW":
        return {
          borderHover: "hover:border-emerald-500/80",
          glow: "hover:shadow-emerald-500/10",
          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          accentText: "text-emerald-600",
          outcomeBg: "bg-emerald-50/60 border-emerald-100",
          btnHover: "hover:bg-emerald-600",
        };
      case "AI":
        return {
          borderHover: "hover:border-purple-500/80",
          glow: "hover:shadow-purple-500/10",
          badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
          accentText: "text-purple-600",
          outcomeBg: "bg-purple-50/60 border-purple-100",
          btnHover: "hover:bg-purple-600",
        };
      case "CREATE":
        return {
          borderHover: "hover:border-amber-500/80",
          glow: "hover:shadow-amber-500/10",
          badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
          accentText: "text-amber-600",
          outcomeBg: "bg-amber-50/60 border-amber-100",
          btnHover: "hover:bg-amber-600",
        };
      default:
        return {
          borderHover: "hover:border-blue-500/80",
          glow: "hover:shadow-blue-500/10",
          badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
          accentText: "text-blue-600",
          outcomeBg: "bg-blue-50/60 border-blue-100",
          btnHover: "hover:bg-blue-600",
        };
    }
  };

  const colors = getCategoryColor(service.category);

  return (
    <div
      onClick={() => onSelect(service)}
      className={`group relative bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/90 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer ${colors.borderHover} ${colors.glow}`}
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          {/* Emoji & Number */}
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs transition-transform duration-300 group-hover:scale-110">
              {service.emoji}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              #{service.number}
            </span>
          </div>

          {/* Badge */}
          {service.badge && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${colors.badgeBg}`}>
              {service.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-heading font-extrabold text-xl text-[#0F172A] tracking-tight group-hover:text-[#2563EB] transition-colors mb-2">
          {service.title}
        </h4>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-4">
          {service.shortDescription}
        </p>

        {/* Distinct Outcome Statement */}
        <div className={`p-3.5 rounded-2xl border ${colors.outcomeBg} mb-5 space-y-1`}>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Target Outcome</span>
          </div>
          <p className="text-xs font-semibold text-[#0F172A] leading-snug">
            "{service.outcome}"
          </p>
        </div>

        {/* Top 3 Capabilities Quick List */}
        <div className="space-y-1.5 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Capabilities</p>
          <div className="space-y-1">
            {service.capabilities.slice(0, 3).map((cap, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#334155]">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{cap}</span>
              </div>
            ))}
            {service.capabilities.length > 3 && (
              <span className="text-[11px] text-blue-600 font-medium pl-5 block">
                +{service.capabilities.length - 3} more capabilities...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Starting Price */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Investment</span>
          <span className="font-heading font-extrabold text-sm sm:text-base text-[#0F172A]">
            {service.startingPrice}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(service);
          }}
          className="h-10 px-4 bg-[#0F172A] group-hover:bg-[#2563EB] text-white font-semibold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:shadow-blue-glow group-hover:pl-4.5"
        >
          <span>{service.ctaText.replace(" →", "")}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
