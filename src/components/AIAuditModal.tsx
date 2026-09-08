import React, { useState } from "react";
import { X, Sparkles, Loader2, CheckCircle2, AlertTriangle, TrendingUp, ShieldAlert, ArrowRight, AlertCircle } from "lucide-react";
import { saveBookingToSupabase } from "../lib/supabase";

interface AIAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCall: () => void;
}

export const AIAuditModal: React.FC<AIAuditModalProps> = ({ isOpen, onClose, onBookCall }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Real Estate & Property Development");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [goal, setGoal] = useState("Get more inbound customer calls & WhatsApp leads");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<{
    title: string;
    score: number;
    keyStrengths: string[];
    criticalGaps: string[];
    recommendations: string[];
    calvixImpactEstimate: string;
  } | null>(null);

  if (!isOpen) return null;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Save audit request lead to Supabase `bookings` table
      await saveBookingToSupabase({
        full_name: trimmedName,
        email: trimmedEmail,
        business_name: businessCategory,
        service: "AI Website Audit",
        message: `Goal: ${goal.trim()} | Website: ${websiteUrl.trim() || "N/A"}`,
        status: "New",
        source: "AI Audit Tool",
      });

      const res = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl,
          businessCategory,
          goal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAuditResult(data.audit);
      } else {
        setErrorMessage(data.error || "Failed to generate AI Audit result.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error connecting to Calvix AI engine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI WEBSITE & CONVERSION AUDIT</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-[#0F172A]">
            Free 5-Second AI Business Audit
          </h3>
          <p className="text-xs text-[#64748B]">
            Our server-side Gemini AI engine evaluates your industry digital gaps and generates instant actionable recommendations.
          </p>
        </div>

        {auditResult ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Score & Impact Banner */}
            <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Audit Health Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-heading font-extrabold text-4xl text-emerald-400">
                    {auditResult.score} / 100
                  </span>
                  <span className="text-xs text-slate-300">
                    ({auditResult.score > 70 ? "Moderate Potential" : "High Growth Upside"})
                  </span>
                </div>
              </div>

              <div className="bg-emerald-950/80 px-4 py-2 rounded-xl text-center border border-emerald-800/60">
                <p className="text-[10px] text-slate-300 uppercase">Estimated Impact</p>
                <p className="text-xs font-bold text-emerald-400">{auditResult.calvixImpactEstimate}</p>
              </div>
            </div>

            {/* Critical Gaps Identified */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Critical Conversion Gaps Found:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
                {auditResult.criticalGaps?.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Recommendations */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Calvix Growth Recommendations:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
                {auditResult.recommendations?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setAuditResult(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs rounded-xl cursor-pointer"
              >
                Run Another Audit
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookCall();
                }}
                className="flex-1 h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Discuss Fixes With Senior Strategist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRunAudit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kamran Shah"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kamran@company.com"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Business Industry / Category *
              </label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Real Estate & Property Development">Real Estate & Property Development</option>
                <option value="E-Commerce & Retail Brand">E-Commerce & Retail Brand</option>
                <option value="Medical Clinic & Healthcare">Medical Clinic & Healthcare</option>
                <option value="Restaurant & Food Service">Restaurant & Food Service</option>
                <option value="Educational Institute / Academy">Educational Institute / Academy</option>
                <option value="Law Firm / Consultancy">Law Firm / Consultancy</option>
                <option value="SaaS & Software Startup">SaaS & Software Startup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Existing Website URL (Optional)
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourbusiness.com"
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Primary Business Growth Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Increase qualified leads, build premium trust, scale online sales..."
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI Analyzing Digital Gaps...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Free AI Audit</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
