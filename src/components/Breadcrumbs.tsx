import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { navigateTo } from "../lib/router";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const fullItems = [{ label: "Home", path: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-1">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-[#64748B]">
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              {index === 0 && <Home className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mr-0.5" />}
              {isLast || !item.path ? (
                <span className="font-semibold text-[#0F172A] truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => navigateTo(item.path!)}
                  className="hover:text-[#2563EB] hover:underline transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  const fullItems = [{ label: "Home", path: "/" }, ...items];
  const DOMAIN = "https://calvix-digitals.ai.studio";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": fullItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${DOMAIN}${item.path || ""}`,
    })),
  };
}
