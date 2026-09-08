import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { navigateTo } from "../lib/router";
import { saveBookingToSupabase } from "../lib/supabase";

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation }) => {
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const result = await saveBookingToSupabase({
        full_name: "Newsletter Subscriber",
        email: trimmedEmail,
        service: "Newsletter Subscription",
        source: "Footer Newsletter",
        status: "New",
        notes: "Subscriber opted into monthly digital strategy dispatches",
      });

      if (result.success) {
        setSuccessMessage("Thank you! Your request has been received successfully. Our team will contact you shortly.");
        setEmailInput("");
        setTimeout(() => setSuccessMessage(null), 6000);
      }
    } catch (err) {
      console.error("Newsletter submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-20 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-slate-800">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#04060d] border border-slate-800 flex items-center justify-center shadow-blue-glow shrink-0 p-1">
                <img src="/logo.svg" alt="Calvix Digitals Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-white block leading-none">
                  CALVIX<span className="text-[#2563EB]">.</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mt-0.5">
                  DIGITALS
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              We build intelligent digital experiences that generate leads, build trust, and help ambitious businesses scale faster through AI, strategy, and modern engineering.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-medium text-xs rounded-xl shadow-blue-glow transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-white text-base tracking-wide">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo("/")} className="hover:text-white transition-colors cursor-pointer">
                   Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (window.location.pathname === "/") {
                      const el = document.getElementById("services");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                        return;
                      }
                    }
                    navigateTo("/");
                    setTimeout(() => {
                      const el = document.getElementById("services");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 150);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("/portfolio")} className="hover:text-white transition-colors cursor-pointer">
                  Work
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("/pricing")} className="hover:text-white transition-colors cursor-pointer">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("/blog")} className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("/about")} className="hover:text-white transition-colors cursor-pointer">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("/contact")} className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-white text-base tracking-wide">Growth Insights</h4>
            <p className="text-xs text-slate-400">
              Subscribe to our monthly digital strategy dispatch. No spam—only actionable AI, CRO, and design insights.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-11 bg-slate-900 border border-slate-700 rounded-xl px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1.5 h-8 px-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Join</span>}
                </button>
              </div>

              {successMessage && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-[11px] text-emerald-400 flex items-start gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Calvix Digitals. Built for growth. Designed for results.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => { navigateTo("/privacy-policy"); }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => { navigateTo("/terms"); }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => { navigateTo("/contact"); }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Support
            </button>
            <button
              onClick={() => { navigateTo("/admin"); }}
              className="hover:text-slate-300 text-slate-500 hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
              title="Admin Content Management Portal"
            >
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
