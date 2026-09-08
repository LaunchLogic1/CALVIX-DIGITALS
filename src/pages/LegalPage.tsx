import React from "react";
import { ShieldCheck } from "lucide-react";

export const LegalPage: React.FC = () => {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-[#0F172A]">
        
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>TERMS & PRIVACY POLICY</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F172A]">
            Terms of Service & Data Privacy
          </h1>
          <p className="text-xs text-[#64748B]">Last updated: January 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#64748B] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">1. Intellectual Property & Code Ownership</h2>
            <p>
              Upon complete settlement of agreed project fees, Calvix Digitals assigns 100% full intellectual property ownership, design assets, and source code repositories to the client. Calvix Digitals retains the non-exclusive right to showcase completed work in agency portfolio galleries unless a non-disclosure agreement (NDA) is executed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">2. Payment Terms & Milestones</h2>
            <p>
              All standard projects are structured under milestone-based payments (typically 50% upfront initial deposit and 50% upon final production sign-off before server transfer). Custom payment schedules can be accommodated for enterprise plans.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">3. Data Privacy & AI Processing</h2>
            <p>
              Calvix Digitals prioritizes client data confidentiality. Information provided in consultation forms or AI audit tools is used solely to generate business recommendations and project quotes. We do not sell or share client data with third-party advertising networks.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">4. Post-Launch Guarantees & Support</h2>
            <p>
              All projects include a 30 to 90-day bug-fix guarantee covering technical defects, layout regressions, or server integration errors directly associated with delivered scope.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};
