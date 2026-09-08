import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Calculator
} from "lucide-react";
import { navigateTo } from "../lib/router";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConsultation,
  onOpenCalculator,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "services", label: "Services", path: "/#services" },
    { id: "portfolio", label: "Work", path: "/portfolio" },
    { id: "pricing", label: "Pricing", path: "/pricing" },
    { id: "blog", label: "Blog", path: "/blog" },
    { id: "about", label: "About", path: "/about" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  const handleNavClick = (id: string, path?: string) => {
    setIsMobileMenuOpen(false);
    if (id === "services") {
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
      return;
    }
    setActiveTab(id);
    if (path) {
      navigateTo(path);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[80px] flex items-center ${
        isScrolled
          ? "bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-soft"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick("home", "/")}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#04060d] border border-slate-800 flex items-center justify-center shadow-blue-glow transition-transform duration-300 group-hover:scale-105 shrink-0 p-1">
            <img src="/logo.svg" alt="Calvix Digitals Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-[#0F172A] block leading-none">
              CALVIX<span className="text-[#2563EB]">.</span>
            </span>
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest block mt-0.5">
              DIGITALS
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.path)}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer relative ${
                  isActive
                    ? "text-[#2563EB] font-semibold"
                    : "text-[#0F172A] hover:text-[#2563EB]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <button
            onClick={onOpenCalculator}
            className="px-3.5 py-2 text-xs font-semibold text-[#0F172A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Calculate Instant Estimate"
          >
            <Calculator className="w-3.5 h-3.5 text-[#2563EB]" />
            Instant Quote
          </button>

          <button
            onClick={onOpenConsultation}
            className="h-[48px] px-5 bg-[#2563EB] text-white font-medium text-sm rounded-2xl shadow-blue-glow hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span>Book Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenConsultation}
            className="px-3 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-xl shadow-blue-glow"
          >
            Consult
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#0F172A] hover:text-[#2563EB] rounded-xl focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[80px] bg-white border-b border-slate-200 shadow-2xl p-6 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.path)}
                className={`w-full text-left py-3 px-4 rounded-xl text-base font-semibold transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-[#2563EB]"
                    : "text-[#0F172A] hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCalculator();
              }}
              className="w-full py-3 bg-slate-100 text-[#0F172A] text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#2563EB]" />
              Calculate Instant Quote
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl shadow-blue-glow flex items-center justify-center gap-2"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
