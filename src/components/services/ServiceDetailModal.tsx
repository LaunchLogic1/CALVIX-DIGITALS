import React, { useEffect } from "react";
import { X, Sparkles, CheckCircle2, ArrowRight, Layers, Target, ShieldCheck } from "lucide-react";
import { ServiceItem } from "../../types";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBook: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBook,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="text-3xl sm:text-4xl p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
            {service.emoji}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SERVICE #{service.number}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                CATEGORY: {service.category}
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Outcome Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Expected Business Outcome</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#0F172A] leading-relaxed">
            "{service.outcome}"
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Full Capabilities & Deliverables</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {service.capabilities.map((cap, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-[#1E293B]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-medium">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ideal For */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Target className="w-3.5 h-3.5 text-purple-600" />
            <span>Ideal For:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            {service.idealFor}
          </p>
        </div>

        {/* Pricing & CTA Banner */}
        <div className="p-6 rounded-2xl bg-[#0F172A] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">Starting Investment</span>
            <span className="font-heading font-extrabold text-2xl text-blue-400">
              {service.startingPrice}
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBook(service);
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{service.ctaText.replace(" →", "")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
