import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { saveBookingToSupabase } from "../lib/supabase";

export const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!trimmedMessage) {
      setErrorMessage("Please enter a message describing your project requirements.");
      return;
    }

    setLoading(true);

    try {
      const result = await saveBookingToSupabase({
        full_name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || undefined,
        service: trimmedSubject || "Contact Inquiry",
        message: trimmedMessage,
        status: "New",
        source: "Contact Page",
      });

      if (result.success) {
        setSubmittedMessage("Thank you! Your request has been received successfully. Our team will contact you shortly.");
        // Clear all form fields
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setErrorMessage(result.error || "Something went wrong while sending your message. Please try again.");
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      setErrorMessage("Unable to send message right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Get In Touch
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight">
            Start Your Next Digital Project <span className="text-[#2563EB]">With Calvix.</span>
          </h2>
          <p className="text-[#64748B] text-base sm:text-lg">
            Have questions about pricing, timeline, or technical scope? Contact our team for an immediate response.
          </p>
        </div>

        {/* 2 Cols: Form on Left, Direct Info on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left 7 Cols: Contact Form */}
          <div className="lg:col-span-7 bg-[#F8FAFC] rounded-[32px] p-8 sm:p-10 border border-slate-200/80 shadow-soft">
            {submittedMessage ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="font-heading font-extrabold text-2xl text-[#0F172A]">Request Received!</h3>
                <p className="text-sm text-[#334155] leading-relaxed font-medium bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 max-w-md mx-auto">
                  {submittedMessage}
                </p>
                <button
                  onClick={() => setSubmittedMessage(null)}
                  className="px-6 py-2.5 bg-[#2563EB] text-white font-semibold text-xs rounded-xl cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-4">
                  Send Us a Direct Message
                </h3>

                {errorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kamran Shah"
                      className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. kamran@company.com"
                      className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Your contact number"
                      className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">Project Subject / Goal</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. New Web Project"
                      className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Project Details / Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project requirements, target goals, or questions..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Direct Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right 5 Cols: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0F172A] text-white rounded-[32px] p-8 sm:p-10 space-y-8 shadow-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Direct Contact</span>
                <h3 className="font-heading font-extrabold text-2xl">Connect Directly</h3>
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-[#2563EB]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Direct Email</p>
                    <a href="mailto:info@calvixdigitals.com" className="font-semibold text-white hover:text-blue-400 transition-colors">
                      info@calvixdigitals.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">WhatsApp / Direct Line</p>
                    <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-emerald-400 transition-colors">
                      +92 300 0000000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Working Hours</p>
                    <p className="font-semibold text-white">Monday - Saturday (9:00 AM - 8:00 PM PKT)</p>
                    <p className="text-xs text-slate-400 mt-0.5">Response within 2 hours</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Need an immediate quote? Use our interactive calculator in the top navigation or book a free discovery call.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
