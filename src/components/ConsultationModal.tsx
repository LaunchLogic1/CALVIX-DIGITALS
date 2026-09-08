import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { saveBookingToSupabase } from "../lib/supabase";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultService,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    projectGoal: defaultService || "",
    budget: "Rs. 10,000 - 25,000",
    projectDetails: "",
  });

  React.useEffect(() => {
    if (defaultService) {
      setFormData((prev) => ({ ...prev, projectGoal: defaultService }));
    }
  }, [defaultService, isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedBusiness = formData.businessName.trim();
    const trimmedGoal = formData.projectGoal.trim();
    const trimmedDetails = formData.projectDetails.trim();

    // Validation
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
      // Save directly to Supabase table `bookings`
      const result = await saveBookingToSupabase({
        full_name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || undefined,
        business_name: trimmedBusiness || undefined,
        service: trimmedGoal || "General Consultation",
        budget: formData.budget,
        message: trimmedDetails || undefined,
        status: "New",
        source: "Book Consultation Modal",
      });

      if (result.success) {
        setSuccessMessage("Thank you! Your request has been received successfully. Our team will contact you shortly.");
        // Clear all form fields
        setFormData({
          name: "",
          email: "",
          phone: "",
          businessName: "",
          projectGoal: "",
          budget: "Rs. 10,000 - 25,000",
          projectDetails: "",
        });
        setStep(1);
      } else {
        setErrorMessage(result.error || "Something went wrong while submitting your request. Please try again.");
      }
    } catch (err) {
      console.error("Consultation submission error:", err);
      setErrorMessage("Unable to submit request right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        {successMessage ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-heading font-extrabold text-2xl text-[#0F172A]">Request Received!</h3>
            
            <p className="text-sm text-[#334155] leading-relaxed font-medium bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              {successMessage}
            </p>

            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full mb-2">
                <Sparkles className="w-3 h-3" />
                <span>FREE 15-MIN DISCOVERY CALL</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-[#0F172A]">
                Book a Free Consultation
              </h3>
              <p className="text-xs text-[#64748B]">
                Tell us about your business goals and receive a tailored growth strategy.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Primary Project Goal or Scope
                    </label>
                    <input
                      type="text"
                      value={formData.projectGoal}
                      onChange={(e) => setFormData({ ...formData, projectGoal: e.target.value })}
                      placeholder="e.g. Website development, brand redesign, custom software..."
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Project Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="Rs. 10,000 - 25,000">Rs. 10,000 - Rs. 25,000 ($35 - $90 USD)</option>
                      <option value="Rs. 25,000 - 50,000">Rs. 25,000 - Rs. 50,000 ($90 - $180 USD)</option>
                      <option value="Rs. 50,000+">Rs. 50,000+ ($180+ USD Custom)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Brief Project Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      placeholder="Tell us briefly about your business, current website, or what you'd like to build..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Your Contact Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kamran Shah"
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. kamran@business.com"
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Company / Brand Name</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Apex Horizon Group"
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs rounded-xl cursor-pointer"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm & Book Consultation</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
