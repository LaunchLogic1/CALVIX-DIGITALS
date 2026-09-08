import React, { useState } from "react";
import { ArrowRight, ExternalLink, Sparkles, FolderPlus, Plus } from "lucide-react";
import { PortfolioItem } from "../types";

interface FeaturedWorkProps {
  projects?: PortfolioItem[];
  onSelectProject: (project: PortfolioItem) => void;
  onViewAllWork: () => void;
  onOpenAdmin?: () => void;
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({
  projects = [],
  onSelectProject,
  onViewAllWork,
  onOpenAdmin,
}) => {
  const [filter, setFilter] = useState<string>("all");

  const filteredProjects = projects.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  return (
    <section className="py-24 bg-white" id="featured-work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Featured Projects
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
              Work Designed for <span className="text-[#2563EB]">Measurable Results.</span>
            </h2>
            <p className="text-[#64748B] text-base leading-relaxed">
              Explore how we combined AI strategy, premium UI/UX, and modern web development to help our clients scale.
            </p>
          </div>

          <button
            onClick={onViewAllWork}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer self-start md:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB]" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-slate-100 pb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              filter === "all" ? "bg-[#2563EB] text-white" : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            All Featured Work
          </button>
          <button
            onClick={() => setFilter("ai-web")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              filter === "ai-web" ? "bg-[#2563EB] text-white" : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            AI Web Apps
          </button>
          <button
            onClick={() => setFilter("e-commerce")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              filter === "e-commerce" ? "bg-[#2563EB] text-white" : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            E-Commerce
          </button>
          <button
            onClick={() => setFilter("ui-ux")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              filter === "ui-ux" ? "bg-[#2563EB] text-white" : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            UI/UX Systems
          </button>
          <button
            onClick={() => setFilter("branding")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              filter === "branding" ? "bg-[#2563EB] text-white" : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            Brand Identity
          </button>
        </div>

        {/* Empty state when 0 projects */}
        {projects.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-[32px] p-12 text-center space-y-3 max-w-xl mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#0F172A]">
              Projects Gallery Updating
            </h3>
            <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              We are currently updating our latest client success stories. Contact our team directly to request custom work samples.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] text-sm">
            No projects found in this category.
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => {
              const isLarge = idx === 0 || idx === 3;
              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className={`bg-white rounded-[24px] border border-slate-200/80 shadow-soft hover:shadow-soft-hover overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col ${
                    isLarge ? "lg:col-span-2" : "lg:col-span-1"
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />

                    {/* Industry & Client Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-white/90 backdrop-blur-md text-[#0F172A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {project.industry}
                      </span>
                      <span className="bg-[#2563EB]/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {project.client}
                      </span>
                    </div>

                    {/* Quick Action Button */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white text-[#2563EB] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-heading font-extrabold text-xl text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-[#64748B] text-sm leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    {/* Results Metrics Banner */}
                    {project.results && project.results.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-2xl">
                        {project.results.map((res, i) => (
                          <div key={i}>
                            <p className="text-xs font-extrabold text-[#2563EB]">{res.value}</p>
                            <p className="text-[10px] text-[#64748B] truncate">{res.label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Pill Suite */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {project.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
