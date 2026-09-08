import React, { useState } from "react";
import { ArrowRight, ExternalLink, Sparkles, FolderPlus, Plus } from "lucide-react";
import { PortfolioItem } from "../types";

interface PortfolioPageProps {
  projects?: PortfolioItem[];
  onSelectProject: (project: PortfolioItem) => void;
  onBookCall: () => void;
  onOpenAdmin?: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  projects = [],
  onSelectProject,
  onBookCall,
  onOpenAdmin,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "ai-web", label: "AI Web Apps" },
    { id: "e-commerce", label: "E-Commerce" },
    { id: "ui-ux", label: "UI/UX Design" },
    { id: "branding", label: "Brand Identity" },
  ];

  const filteredProjects = projects.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Client Success Gallery
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            Featured Projects Built on <span className="text-[#2563EB]">Real Results.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg">
            Explore our featured client partnerships across real estate, e-commerce, healthcare, and technology startups.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-slate-100 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#2563EB] text-white shadow-blue-glow"
                  : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Empty state when 0 projects in database */}
        {projects.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-[32px] p-12 text-center space-y-3 max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#0F172A]">
              Portfolio Updating
            </h3>
            <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Our latest project showcases are currently being finalized. Reach out to schedule a consultation and view relevant client demos.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] text-sm">
            No projects found in this category.
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-white rounded-[24px] border border-slate-200/80 shadow-soft hover:shadow-soft-hover overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-white/90 backdrop-blur-md text-[#0F172A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {project.industry}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs font-bold">{project.client}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-heading font-extrabold text-xl text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[#64748B] text-xs leading-relaxed">
                      {project.summary}
                    </p>
                  </div>
                </div>

                {/* Bottom Metrics */}
                <div className="p-6 pt-0">
                  {project.results && project.results.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4">
                      {project.results.map((res, i) => (
                        <div key={i}>
                          <p className="text-xs font-extrabold text-[#2563EB]">{res.value}</p>
                          <p className="text-[10px] text-[#64748B] truncate">{res.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-bold text-[#2563EB] pt-2 border-t border-slate-100">
                    <span>View Project Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bg-[#0F172A] text-white rounded-[32px] p-8 sm:p-12 text-center space-y-6">
          <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Have a custom digital project in mind?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            We partner with forward-thinking brands to engineer custom software, AI workflows, and high-conversion e-commerce engines.
          </p>
          <button
            onClick={onBookCall}
            className="px-8 py-4 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Book Consultation Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
