import React from "react";
import { ArrowRight, Sparkles, MessageSquare } from "lucide-react";

interface ServicesCTAProps {
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
}

export const ServicesCTA: React.FC<ServicesCTAProps> = ({
  onOpenConsultation,
  onOpenCalculator,
}) => {
  return (
    <div className="w-full bg-[#0F172A] text-white rounded-[32px] p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden text-center max-w-5xl mx-auto">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3.5 py-1 rounded-full border border-blue-800/80">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NOT SURE WHERE TO START?</span>
        </span>

        <h3 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
          Tell Us What You <span className="text-[#4F8CFF]">Want to Grow.</span>
        </h3>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tell us about your business, your goals, and what's slowing you down. We'll recommend the right combination of technology, AI, marketing, content, and automation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto h-12 px-7 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-blue-glow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get My Growth Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCalculator}
            className="w-full sm:w-auto h-12 px-6 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Start a Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
