import React from "react";
import { X, ExternalLink, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { PortfolioItem } from "../types";

interface ProjectDetailModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
  onBookCall: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onBookCall,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-3xl w-full shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Sticky Header with Close */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full">
              {project.industry} Project Showcase
            </span>
            <h3 className="font-heading font-extrabold text-xl text-[#0F172A] mt-1">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Hero Banner Image */}
          <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-900">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-xs text-slate-300">Client Partner</p>
              <p className="font-heading font-bold text-lg">{project.client}</p>
            </div>
          </div>

          {/* Key Impact Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-[#0F172A] text-white p-4 rounded-2xl border border-slate-800 text-center">
            {project.results.map((res, i) => (
              <div key={i}>
                <p className="font-heading font-extrabold text-2xl text-[#2563EB]">{res.value}</p>
                <p className="text-[11px] text-slate-400">{res.label}</p>
              </div>
            ))}
          </div>

          {/* Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#64748B] leading-relaxed">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-heading font-bold text-sm text-[#0F172A]">The Business Challenge</h4>
              <p>{project.challenge}</p>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-1.5">
              <h4 className="font-heading font-bold text-sm text-[#2563EB]">The Calvix Solution</h4>
              <p>{project.solution}</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Technologies Utilized:</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span key={i} className="text-xs font-mono font-semibold text-[#0F172A] bg-slate-100 px-3 py-1 rounded-lg">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-[28px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64748B]">
            <p className="font-semibold text-[#0F172A]">Want similar transformation results for your brand?</p>
            <p>Schedule a free consultation call with our engineering team.</p>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookCall();
            }}
            className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Book Consultation Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
