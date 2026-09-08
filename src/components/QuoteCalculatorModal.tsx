import React, { useState } from "react";
import { X, Calculator, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { saveBookingToSupabase } from "../lib/supabase";

interface QuoteCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToConsultation: () => void;
}

export const QuoteCalculatorModal: React.FC<QuoteCalculatorModalProps> = ({
  isOpen,
  onClose,
  onProceedToConsultation,
}) => {
  const [projectType, setProjectType] = useState("Custom Digital Project");
  const [urgency, setUrgency] = useState<"standard" | "rush">("standard");
  const [businessType, setBusinessType] = useState("Small Business / Startup");
  const [projectScope, setProjectScope] = useState("Standard Scope");
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<{
    estimatedTotalPKR: number;
    estimatedUSD: number;
    timelineDays: string;
    lineItems: { service: string; pricePKR: number; description: string }[];
    executiveRecommendation: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/quote-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType,
          projectScope,
          urgency,
          businessType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuoteResult(data);

        // Record request in Supabase `bookings` table
        await saveBookingToSupabase({
          full_name: "Quote Prospect",
          email: "quote-prospect@website.com",
          business_name: businessType,
          service: `${projectType} (${projectScope})`,
          budget: `Rs. ${data.estimatedTotalPKR?.toLocaleString()} (~$${data.estimatedUSD} USD)`,
          message: `Delivery speed: ${urgency} (${data.timelineDays})`,
          status: "New",
          source: "Quote Calculator Modal",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>PROJECT SCOPE & PRICE ESTIMATOR</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-[#0F172A]">
            Calculate Your Custom Estimate
          </h3>
          <p className="text-xs text-[#64748B]">
            Select your project parameters to receive an instant transparent pricing breakdown and AI executive analysis.
          </p>
        </div>

        {quoteResult ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Total Summary Banner */}
            <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Total Investment</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#2563EB]">
                    Rs. {quoteResult.estimatedTotalPKR.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-300">
                    (~ ${quoteResult.estimatedUSD} USD)
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 px-4 py-2 rounded-xl text-center border border-slate-700/60">
                <p className="text-[10px] text-slate-400 uppercase">Estimated Timeline</p>
                <p className="text-xs font-bold text-emerald-400">{quoteResult.timelineDays}</p>
              </div>
            </div>

            {/* AI Executive Analysis */}
            <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                <Sparkles className="w-4 h-4" />
                <span>AI Executive Scope Analysis:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{quoteResult.executiveRecommendation}"
              </p>
            </div>

            {/* Itemized Line Items */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Itemized Breakdown:</p>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl p-3 bg-slate-50 text-xs">
                {quoteResult.lineItems.map((item, i) => (
                  <div key={i} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#0F172A]">{item.service}</p>
                      <p className="text-[11px] text-[#64748B]">{item.description}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 shrink-0">
                      Rs. {item.pricePKR.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setQuoteResult(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs rounded-xl cursor-pointer"
              >
                Recalculate
              </button>

              <button
                onClick={() => {
                  onClose();
                  onProceedToConsultation();
                }}
                className="flex-1 h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lock In This Quote & Book Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Project Scale / Scope Level
              </label>
              <select
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Starter Growth">Starter Growth (Rs. 10,000 / $35)</option>
                <option value="Business Scale">Business Scale (Rs. 25,000 / $90)</option>
                <option value="Enterprise Custom">Enterprise Custom (Rs. 50,000+ / $180+)</option>
              </select>
            </div>

            {/* Business Type & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Business Industry / Stage
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Small Business / Startup">Small Business / Startup</option>
                  <option value="E-Commerce Brand">E-Commerce Brand</option>
                  <option value="Real Estate / Construction">Real Estate / Construction</option>
                  <option value="Clinic / Healthcare">Clinic / Healthcare</option>
                  <option value="Law / Consulting Firm">Law / Consulting Firm</option>
                  <option value="SaaS / Tech Enterprise">SaaS / Tech Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Timeline Speed
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as "standard" | "rush")}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="standard">Standard Delivery (10-14 Days)</option>
                  <option value="rush">Express Delivery (5-7 Days)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculating Scope & Pricing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Itemized Estimate</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
