import React, { useState } from "react";
import { CheckCircle2, ArrowRight, Sparkles, HelpCircle, Calculator } from "lucide-react";
import { PRICING_PLANS } from "../data/agencyData";

interface PricingSectionProps {
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onOpenConsultation,
  onOpenCalculator,
}) => {
  const [currency, setCurrency] = useState<"PKR" | "USD">("PKR");

  return (
    <section className="py-24 bg-[#F8FAFC] border-y border-slate-200" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Transparent Investment
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            Premium Quality, <span className="text-[#2563EB]">Transparent Pricing.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg">
            No hidden costs. Clear, value-based investment packages built to deliver immediate business ROI.
          </p>

          {/* Currency Toggle */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-slate-200/80 p-1 rounded-xl inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
              <button
                onClick={() => setCurrency("PKR")}
                className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currency === "PKR" ? "bg-[#2563EB] text-white shadow-sm" : "hover:text-[#0F172A]"
                }`}
              >
                PKR (Pakistan)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currency === "USD" ? "bg-[#2563EB] text-white shadow-sm" : "hover:text-[#0F172A]"
                }`}
              >
                USD (International)
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {PRICING_PLANS.map((plan) => {
            return (
              <div
                key={plan.id}
                className={`rounded-[24px] p-8 border transition-all duration-300 flex flex-col justify-between relative ${
                  plan.popular
                    ? "bg-[#0F172A] text-white border-[#2563EB] shadow-2xl scale-105 z-10"
                    : "bg-white text-[#0F172A] border-slate-200 shadow-soft hover:shadow-soft-hover"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-blue-glow flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className={`font-heading font-extrabold text-2xl ${plan.popular ? "text-white" : "text-[#0F172A]"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs mt-2 ${plan.popular ? "text-slate-300" : "text-[#64748B]"}`}>
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="mb-6 pb-6 border-b border-slate-200/40">
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-extrabold text-4xl tracking-tight">
                        {currency === "PKR" ? plan.pricePKR : plan.priceUSD}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 font-medium ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`}>
                      Ideal for: {plan.idealFor}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 text-xs mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-emerald-400" : "text-[#2563EB]"}`} />
                        <span className={plan.popular ? "text-slate-200" : "text-slate-700"}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className={`w-full h-12 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-[#2563EB] hover:bg-blue-600 text-white shadow-blue-glow"
                      : "bg-[#0F172A] hover:bg-slate-800 text-white"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* AI Calculator Trigger Banner */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-[#0F172A]">Need a precise itemized price quote?</h4>
              <p className="text-xs text-[#64748B]">Use our AI Scope Calculator to select specific features and receive an instant breakdown.</p>
            </div>
          </div>

          <button
            onClick={onOpenCalculator}
            className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-blue-glow shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Launch AI Scope Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
