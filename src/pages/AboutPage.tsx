import React from "react";
import { Cpu, Target, Eye, Award, CheckCircle2, ArrowRight } from "lucide-react";

interface AboutPageProps {
  onOpenConsultation: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            About Calvix Digitals
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            Architecting the Future of <span className="text-[#2563EB]">Intelligent Business.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg leading-relaxed">
            Founded with a vision to eliminate slow, bloated legacy web development, Calvix Digitals combines strategy, AI technology, and high-contrast aesthetic design to scale ambitious brands.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#F8FAFC] rounded-[28px] p-8 sm:p-10 border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-[#0F172A]">Our Mission</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              To empower Pakistani and international businesses with modern AI web infrastructure, high-converting brand identities, and automated lead generation engines that deliver predictable revenue growth.
            </p>
          </div>

          <div className="bg-[#0F172A] text-white rounded-[28px] p-8 sm:p-10 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/60 text-[#2563EB] flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-white">Our Vision</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              To become South Asia's benchmark digital innovation agency—recognized globally for technical speed, transparent pricing, and measurable client success stories.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-heading font-extrabold text-3xl text-[#0F172A]">Our Core Engineering Values</h3>
            <p className="text-xs text-[#64748B]">The guiding principles that dictate every line of code and wireframe we produce.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="font-heading font-bold text-base text-[#0F172A]">1. Zero Bloat Speed</p>
              <p className="text-xs text-[#64748B]">We write clean Next.js and Tailwind code that achieves sub-second loading speeds on mobile networks.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="font-heading font-bold text-base text-[#0F172A]">2. AI Automation First</p>
              <p className="text-xs text-[#64748B]">Every website we build is equipped with intelligent chatbots and automated lead routing.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="font-heading font-bold text-base text-[#0F172A]">3. Transparent Pricing</p>
              <p className="text-xs text-[#64748B]">No surprise invoices or hidden charges. Upfront itemized quotes with full source code transfer.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="font-heading font-bold text-base text-[#0F172A]">4. Client First Partnership</p>
              <p className="text-xs text-[#64748B]">We treat your business metrics as our own. We succeed only when your revenue and leads grow.</p>
            </div>
          </div>
        </div>

        {/* Founder / Leadership Statement */}
        <div className="bg-[#F8FAFC] rounded-[32px] p-8 sm:p-12 border border-slate-200 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 sm:w-32 sm:w-32 rounded-3xl bg-[#0F172A] text-white flex items-center justify-center font-heading font-extrabold text-3xl shrink-0 shadow-lg border-2 border-[#2563EB]">
            CD
          </div>

          <div className="space-y-3 text-center md:text-left">
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
              "We built Calvix Digitals to solve a clear market problem: businesses were paying massive fees for outdated websites that generated zero leads. We combine AI technology, sub-second performance, and luxury visual design to deliver websites that actually pay for themselves."
            </p>
            <div>
              <p className="font-heading font-bold text-base text-[#0F172A]">Leadership Team</p>
              <p className="text-xs text-[#2563EB] font-medium">Calvix Digitals Agency</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Partner With Calvix Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
