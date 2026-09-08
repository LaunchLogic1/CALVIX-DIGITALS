import React from "react";
import { ArrowRight, Sparkles, MessageSquare, PhoneCall } from "lucide-react";

interface FinalCTAProps {
  onOpenConsultation: () => void;
  onOpenAudit: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenConsultation, onOpenAudit }) => {
  return (
    <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
      {/* Background Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2563EB]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>READY TO BUILD SOMETHING EXCEPTIONAL?</span>
        </div>

        {/* Headline */}
        <h2 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
          Let's Create a Digital Experience Your Customers <span className="text-[#2563EB]">Will Remember.</span>
        </h2>

        {/* Description */}
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Book a free 15-minute consultation with our senior strategy team. We'll analyze your current online presence, discuss your growth goals, and deliver a tailored proposal.
        </p>

        {/* Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenConsultation}
            className="h-[56px] px-8 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-base rounded-[16px] shadow-blue-glow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2.5 w-full sm:w-auto"
          >
            <span>Book a Free Consultation</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenAudit}
            className="h-[56px] px-6 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-base rounded-[16px] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Run Free AI Growth Audit</span>
          </button>
        </div>

        {/* Direct Contact Links */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <a
            href="https://wa.me/923000000000?text=Hello%20Calvix%20Digitals,%20I%20would%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Message on WhatsApp</span>
          </a>

          <span className="hidden sm:inline">•</span>

          <a href="mailto:hello@calvixdigitals.com" className="hover:text-white transition-colors">
            hello@calvixdigitals.com
          </a>
        </div>

      </div>
    </section>
  );
};
