import React from "react";
import { PricingSection } from "../components/PricingSection";
import { FAQSection } from "../components/FAQSection";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface PricingPageProps {
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onOpenConsultation,
  onOpenCalculator,
}) => {
  return (
    <div className="py-8 bg-white min-h-screen">
      {/* Embedded Pricing Section */}
      <PricingSection
        onOpenConsultation={onOpenConsultation}
        onOpenCalculator={onOpenCalculator}
      />

      {/* Comparison & Guarantee Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#0F172A] text-white rounded-[32px] p-8 sm:p-12 border border-slate-800 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#2563EB] mx-auto sm:mx-0" />
            <h4 className="font-heading font-bold text-lg text-white">100% Code Ownership</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upon final payment, full intellectual property and source code repositories are transferred to your business. No lock-ins.
            </p>
          </div>

          <div className="space-y-2">
            <Sparkles className="w-8 h-8 text-emerald-400 mx-auto sm:mx-0" />
            <h4 className="font-heading font-bold text-lg text-white">Guaranteed Milestones</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every project includes clear timeline deadlines with milestone reviews before final sign-off.
            </p>
          </div>

          <div className="space-y-2">
            <CheckCircle2 className="w-8 h-8 text-sky-400 mx-auto sm:mx-0" />
            <h4 className="font-heading font-bold text-lg text-white">Post-Launch Care</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              All plans include 30-90 days of free bug-fix guarantees, server health monitoring, and security updates.
            </p>
          </div>
        </div>
      </div>

      <FAQSection />
    </div>
  );
};
