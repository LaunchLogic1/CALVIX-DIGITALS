import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  Check,
  BarChart3,
  Bot,
  Laptop,
  CheckCircle2,
  Calculator
} from "lucide-react";

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
  onExploreWork: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onOpenCalculator,
  onExploreWork,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<"website" | "ai-agent" | "metrics">("website");
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "Hello! Welcome to Calvix Digitals. How can we help grow your business today?" },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatMessage("");

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Thanks for reaching out! Our AI lead engine indicates your business is a great fit for our Growth Stack. Would you like to schedule a 15-min discovery call?`,
        },
      ]);
    }, 600);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Subtle Background Radial Blue Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-sky-100/40 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/80 text-[#2563EB] text-xs font-semibold tracking-wide mx-auto">
          <Sparkles className="w-4 h-4" />
          <span>AI-POWERED DIGITAL AGENCY</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.12] text-[#0F172A] tracking-tight max-w-3xl mx-auto">
          AI-Powered Digital Experiences That <span className="text-[#2563EB]">Grow Your Business.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg lg:text-xl text-[#64748B] leading-relaxed font-normal max-w-2xl mx-auto">
          We design, build, and scale modern websites, brands, and AI-powered digital solutions for ambitious businesses.
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto h-[56px] px-8 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-base rounded-[16px] shadow-blue-glow hover:shadow-blue-glow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Book a Free Consultation</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExploreWork}
            className="w-full sm:w-auto h-[56px] px-6 bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 font-semibold text-base rounded-[16px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Portfolio</span>
            <ArrowRight className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>

        {/* Calculator Secondary Trigger */}
        <div className="pt-1">
          <button
            onClick={onOpenCalculator}
            className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1.5 cursor-pointer bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Want an instant price estimate? Try our AI Scope Calculator →</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-[#64748B] font-medium max-w-xl mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">★★★★★</span>
            <span className="text-[#0F172A] font-bold">5.0</span>
            <span>(50+ Projects)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#2563EB]" />
            <span>0.8s Sub-Second Speed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Responsive</span>
          </div>
        </div>

      </div>
    </section>
  );
};
