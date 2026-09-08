import React from "react";
import { XCircle, CheckCircle2, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

interface TransformationSectionProps {
  onOpenConsultation: () => void;
}

export const TransformationSection: React.FC<TransformationSectionProps> = ({ onOpenConsultation }) => {
  const beforeList = [
    "Outdated, slow website (5+ second load time)",
    "No inbound leads or online customer inquiry flow",
    "Weak visual branding that lowers client trust",
    "Frustrating mobile experience with broken layouts",
    "Manual, repetitive sales follow-up work",
    "Low search visibility on Google and AI assistants"
  ];

  const afterList = [
    "Modern sub-1 second Next.js web application",
    "Automated 24/7 AI lead capture & WhatsApp routing",
    "Premium brand identity that signals luxury & authority",
    "100% responsive, fluid mobile checkout & UX",
    "Automated client scheduling & quote engines",
    "Ranked & discoverable on Google & AI search engines"
  ];

  return (
    <section className="py-24 bg-[#F8FAFC] border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            The Calvix Transformation
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            How Calvix Transforms Your <span className="text-[#2563EB]">Digital Impact.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg">
            See the exact operational and revenue difference between a legacy digital presence and a modern Calvix Growth Stack.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Before Column (Red/Gray theme) */}
          <div className="bg-white rounded-[24px] p-8 border border-rose-200 shadow-soft relative space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-6 h-6" />
                <h3 className="font-heading font-extrabold text-xl text-[#0F172A]">Before Calvix Digitals</h3>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">Low Conversions</span>
            </div>

            <ul className="space-y-4 text-sm text-[#64748B]">
              {beforeList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After Column (Blue/Green Premium theme) */}
          <div className="bg-[#0F172A] text-white rounded-[24px] p-8 border border-blue-500/30 shadow-2xl relative space-y-6">
            {/* Top Badge */}
            <div className="absolute top-4 right-4 bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-blue-glow flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Growth Activated</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="font-heading font-extrabold text-xl text-white">After Working With Calvix</h3>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              {afterList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Average 3.5x Conversion Uplift</span>
              </div>

              <button
                onClick={onOpenConsultation}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Start Your Transformation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
