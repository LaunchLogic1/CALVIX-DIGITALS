import React, { useState, useEffect } from "react";
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Eye,
  LogOut,
  FolderPlus,
  FileText,
  Sparkles,
  Upload,
  ExternalLink,
  Tag,
  Search,
  Check,
  X,
  Globe,
  Clock,
  User,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Save,
  Database,
  Calendar,
  FileDown,
  RefreshCw,
  Download,
  Link as LinkIcon,
  HelpCircle,
  Share2,
  BarChart2,
} from "lucide-react";
import { PortfolioItem, BlogPost } from "../types";
import { generateSlug, validateSlug, analyzeSEOHealth } from "../lib/seoUtils";

interface AdminPageProps {
  onContentUpdated: () => void;
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onContentUpdated,
  onNavigateHome,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("calvix_admin_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<"work" | "blogs">("work");

  // Projects State
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [editingProject, setEditingProject] = useState<Partial<PortfolioItem> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Blog Posts State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [blogSearch, setBlogSearch] = useState("");
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Bookings (Supabase) State
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingSearch, setBookingSearch] = useState("");

  // Common UI State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<"project" | "blog" | null>(null);

  // PDF Upload & Management State
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [isRemovePdfModalOpen, setIsRemovePdfModalOpen] = useState(false);
  const [pendingPdfFile, setPendingPdfFile] = useState<File | null>(null);
  const [isReplacePdfModalOpen, setIsReplacePdfModalOpen] = useState(false);

  // SEO & GEO Management State
  const [activeBlogTab, setActiveBlogTab] = useState<"content" | "seo" | "geo" | "previews" | "health">("content");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [faqQuestionInput, setFaqQuestionInput] = useState("");
  const [faqAnswerInput, setFaqAnswerInput] = useState("");
  const [selectedInternalRoute, setSelectedInternalRoute] = useState("/portfolio");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes <= 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const executePdfUpload = async (file: File) => {
    setPdfUploadError(null);
    setIsUploadingPdf(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch("/api/upload-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name, dataUrl: base64Data }),
          });
          const data = await res.json();
          if (data.success && data.url) {
            setEditingBlog((prev) => ({
              ...prev,
              pdf_url: data.url,
              pdf_file_name: data.fileName,
              pdf_file_size: data.fileSize,
              pdf_uploaded_at: data.uploadedAt,
            }));
            showToast("Article PDF attached successfully!");
          } else {
            setPdfUploadError(data.error || "Please upload a valid PDF file.");
          }
        } catch (err) {
          console.error("PDF upload error:", err);
          setPdfUploadError("Failed to upload PDF. Network error.");
        } finally {
          setIsUploadingPdf(false);
        }
      };
      reader.onerror = () => {
        setPdfUploadError("Failed to read selected PDF file.");
        setIsUploadingPdf(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("FileReader error:", err);
      setPdfUploadError("Failed to read selected PDF file.");
      setIsUploadingPdf(false);
    }
  };

  const handlePdfSelected = (file: File, isReplacing: boolean) => {
    setPdfUploadError(null);

    // Validate type
    const isPdfType = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdfType) {
      setPdfUploadError("Please upload a valid PDF file.");
      return;
    }

    // Validate size (20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setPdfUploadError("This PDF is too large. Please upload a smaller file.");
      return;
    }

    if (isReplacing && editingBlog?.pdf_url) {
      setPendingPdfFile(file);
      setIsReplacePdfModalOpen(true);
    } else {
      executePdfUpload(file);
    }
  };

  const handleConfirmRemovePdf = async () => {
    if (editingBlog?.pdf_url) {
      try {
        await fetch("/api/delete-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl: editingBlog.pdf_url }),
        });
      } catch (err) {
        console.warn("Could not delete file from disk:", err);
      }
    }

    setEditingBlog((prev) => ({
      ...prev,
      pdf_url: undefined,
      pdf_file_name: undefined,
      pdf_file_size: undefined,
      pdf_uploaded_at: undefined,
    }));

    setIsRemovePdfModalOpen(false);
    showToast("PDF removed from article.");
  };

  const handleConfirmReplacePdf = () => {
    if (pendingPdfFile) {
      executePdfUpload(pendingPdfFile);
      setPendingPdfFile(null);
    }
    setIsReplacePdfModalOpen(false);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("calvix_admin_auth", "true");
        showToast("Authenticated successfully. Welcome to Admin Panel!");
      } else {
        setLoginError(data.error || "Incorrect admin password.");
      }
    } catch (err) {
      setLoginError("Failed to verify password. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("calvix_admin_auth");
    showToast("Logged out of Admin Panel.");
  };

  // Fetch Projects from API
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch("/api/projects/all");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Fetch Blogs from API
  const fetchBlogs = async () => {
    setIsLoadingBlogs(true);
    try {
      const res = await fetch("/api/blogs/all");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  // Fetch Bookings from Supabase API
  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) {
        throw new Error(`Server returned HTTP status ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response content type; expected JSON");
      }
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings from Supabase:", err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Send a Test Booking directly to Supabase to verify sync
  const sendTestBooking = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Sample Client",
          email: "sample.client@example.com",
          phone: "+1 (555) 234-5678",
          businessName: "Calvix Test Enterprise",
          service: "ai-web",
          budget: "$5,000 - $10,000",
          projectDetails: "This is a test booking created to verify Supabase backend integration.",
          type: "consultation",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Test booking sent! Ref: ${data.bookingReference}`);
        setTimeout(() => setToastMessage(null), 3000);
        await fetchBookings();
      } else {
        alert("Failed to create test booking: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error creating test booking: " + err.message);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchBlogs();
      fetchBookings();
    }
  }, [isAuthenticated]);

  // Image Upload Handler
  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, dataUrl: base64Data }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          callback(data.url);
          showToast("Image uploaded successfully!");
        } else {
          alert("Image upload failed.");
        }
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload failed:", err);
      setIsUploadingImage(false);
      alert("Error uploading image.");
    }
  };

  // Save / Update Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) {
      alert("Project title is required.");
      return;
    }

    const payload = {
      ...editingProject,
      results: editingProject.results || [],
      technologies: editingProject.technologies || [],
      status: editingProject.status || "published",
    };

    const isEdit = !!editingProject.id;
    const url = isEdit ? `/api/projects/${editingProject.id}` : "/api/projects";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast(isEdit ? "Project updated successfully!" : "New project published successfully!");
        setIsProjectModalOpen(false);
        setEditingProject(null);
        fetchProjects();
        onContentUpdated();
      } else {
        alert(data.error || "Failed to save project.");
      }
    } catch (err) {
      console.error("Save project failed:", err);
      alert("Error saving project to database.");
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Project deleted from database.");
        setDeletingItemId(null);
        setDeletingType(null);
        fetchProjects();
        onContentUpdated();
      } else {
        alert(data.error || "Failed to delete project.");
      }
    } catch (err) {
      console.error("Delete project error:", err);
    }
  };

  // Save / Update Blog Post
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlugError(null);

    if (!editingBlog?.title || !editingBlog.title.trim()) {
      alert("Article title is required.");
      return;
    }

    const targetSlug = generateSlug(editingBlog.slug || editingBlog.title);
    if (!targetSlug) {
      setSlugError("Please enter a valid URL slug.");
      setActiveBlogTab("content");
      return;
    }

    // Check for duplicate slug against existing blogs
    const duplicate = blogs.find(
      (b) => b.id !== editingBlog.id && (b.slug === targetSlug || b.oldSlugs?.includes(targetSlug))
    );

    if (duplicate) {
      setSlugError("This blog URL is already in use. Please choose a different URL.");
      setActiveBlogTab("content");
      return;
    }

    const payload = {
      ...editingBlog,
      slug: targetSlug,
      tags: editingBlog.tags || ["Article"],
      status: editingBlog.status || "published",
      date: editingBlog.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      canonicalUrl: editingBlog.canonicalUrl || `https://calvix-digitals.ai.studio/blog/${targetSlug}`,
      seoTitle: editingBlog.seoTitle || editingBlog.title,
      metaDescription: editingBlog.metaDescription || editingBlog.summary,
    };

    const isEdit = !!editingBlog.id;
    const url = isEdit ? `/api/blogs/${editingBlog.id}` : "/api/blogs";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast(isEdit ? "Blog article updated!" : "New article published!");
        setIsBlogModalOpen(false);
        setEditingBlog(null);
        fetchBlogs();
        onContentUpdated();
      } else {
        setSlugError(data.error || "Failed to save article.");
      }
    } catch (err) {
      console.error("Save blog error:", err);
      alert("Error saving article to database.");
    }
  };

  // Delete Blog Post
  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Blog post deleted.");
        setDeletingItemId(null);
        setDeletingType(null);
        fetchBlogs();
        onContentUpdated();
      } else {
        alert(data.error || "Failed to delete blog post.");
      }
    } catch (err) {
      console.error("Delete blog error:", err);
    }
  };

  // Helper to open project form
  const openNewProjectModal = () => {
    setEditingProject({
      title: "",
      client: "",
      category: "ai-web",
      industry: "Technology",
      image: "",
      summary: "",
      challenge: "",
      solution: "",
      results: [
        { label: "Page Speed", value: "0.8s" },
        { label: "Conversion Lift", value: "+180%" }
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      liveUrl: "",
      githubUrl: "",
      status: "published",
    });
    setIsProjectModalOpen(true);
  };

  // Helper to open blog form
  const openNewBlogModal = () => {
    setSlugError(null);
    setActiveBlogTab("content");
    setEditingBlog({
      title: "",
      slug: "",
      category: "AI & Web Development",
      author: "Calvix Digital",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      summary: "",
      coverImage: "",
      imageAlt: "",
      content: "",
      tags: ["AI Web Development", "Digital Strategy"],
      status: "published",
      seoTitle: "",
      metaDescription: "",
      focusKeyword: "",
      secondaryKeywords: [],
      canonicalUrl: "",
      answerIntro: "",
      faqs: [],
    });
    setIsBlogModalOpen(true);
  };

  // LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#2563EB] mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-white">
              Calvix Digitals Admin Panel
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Authenticate to manage work projects, blog articles, and live content directly in the database.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Security Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#2563EB] text-white px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? "Authenticating..." : "Unlock Admin Dashboard"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center">
            <button
              onClick={onNavigateHome}
              className="text-[#2563EB] hover:underline cursor-pointer"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.client.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.industry.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
      b.category.toLowerCase().includes(blogSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(blogSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#04060d] border border-slate-800 flex items-center justify-center shrink-0 p-1">
              <img src="/logo.svg" alt="Calvix Digitals Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                  Calvix Admin
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Database Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Content Management & Live Publishing System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("work")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "work"
                  ? "bg-[#2563EB] text-white shadow-blue-glow"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Work Management</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "blogs"
                  ? "bg-[#2563EB] text-white shadow-blue-glow"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Insights (Blog)</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                {blogs.length}
              </span>
            </button>
          </div>

          <div>
            {activeTab === "work" && (
              <button
                onClick={openNewProjectModal}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-blue-glow transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Project</span>
              </button>
            )}
            {activeTab === "blogs" && (
              <button
                onClick={openNewBlogModal}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-blue-glow transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Blog Post</span>
              </button>
            )}
            {activeTab === "bookings" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={sendTestBooking}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-emerald-glow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Send Test Booking</span>
                </button>
                <button
                  onClick={fetchBookings}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Sync Supabase</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* WORK MANAGEMENT VIEW */}
        {activeTab === "work" && (
          <div className="space-y-6">
            
            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search projects by title, client..."
                  className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
                <span>Published: <strong className="text-white">{projects.filter(p => p.status !== "draft").length}</strong></span>
                <span>Drafts: <strong className="text-amber-400">{projects.filter(p => p.status === "draft").length}</strong></span>
              </div>
            </div>

            {/* Projects List */}
            {isLoadingProjects ? (
              <div className="p-12 text-center text-slate-500 text-sm">Loading projects from database...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                  <FolderPlus className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-white">No Projects Found</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  The Work section is currently empty. Click "Upload New Project" above to publish your first project.
                </p>
                <button
                  onClick={openNewProjectModal}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload First Project</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-slate-950 overflow-hidden">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md ${
                              project.status === "draft"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {project.status === "draft" ? "Draft" : "Published"}
                          </span>
                          <span className="bg-slate-950/80 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-800">
                            {project.industry}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold text-[#2563EB]">{project.client}</p>
                          <span className="text-[10px] font-mono text-slate-500">{project.category}</span>
                        </div>
                        <h4 className="font-heading font-bold text-base text-white group-hover:text-[#2563EB] transition-colors line-clamp-1">
                          {project.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {project.summary}
                        </p>
                        {project.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {project.technologies.map((t, idx) => (
                              <span key={idx} className="text-[9px] font-mono bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setIsProjectModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setDeletingItemId(project.id);
                          setDeletingType("project");
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INSIGHTS (BLOG) MANAGEMENT VIEW */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            
            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  placeholder="Search articles by title, author, category..."
                  className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
                <span>Published: <strong className="text-white">{blogs.filter(b => b.status !== "draft").length}</strong></span>
                <span>Drafts: <strong className="text-amber-400">{blogs.filter(b => b.status === "draft").length}</strong></span>
              </div>
            </div>

            {/* Blogs List */}
            {isLoadingBlogs ? (
              <div className="p-12 text-center text-slate-500 text-sm">Loading blog articles from database...</div>
            ) : filteredBlogs.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-white">No Blog Articles Found</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  No articles found matching search criteria. Click "Create Blog Post" to add new content.
                </p>
                <button
                  onClick={openNewBlogModal}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Blog Post</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div className="w-20 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 hidden sm:block">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              blog.status === "draft"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {blog.status === "draft" ? "Draft" : "Published"}
                          </span>
                          {blog.pdf_url ? (
                            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" title={blog.pdf_file_name || "PDF attached"}>
                              <FileText className="w-3 h-3 text-[#2563EB]" />
                              <span>✓ PDF</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono font-normal opacity-60">— PDF</span>
                          )}
                          <span className="text-[11px] font-semibold text-[#2563EB]">{blog.category}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] text-slate-400">{blog.date}</span>
                        </div>

                        <h4 className="font-heading font-bold text-base text-white">
                          {blog.title}
                        </h4>

                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-500" />
                            {blog.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {blog.readTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => {
                          setEditingBlog(blog);
                          setIsBlogModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeletingItemId(blog.id);
                          setDeletingType("blog");
                        }}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* PROJECT EDITOR MODAL */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB]/20 text-[#2563EB] flex items-center justify-center font-bold">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  {editingProject.id ? "Edit Project Details" : "Upload New Portfolio Project"}
                </h3>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5 text-xs">
              
              {/* Status & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. Apex Horizon Luxury Real Estate Portal"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Publication Status</label>
                  <select
                    value={editingProject.status || "published"}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as "published" | "draft" })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                  >
                    <option value="published">Published (Public)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Client & Industry & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Name</label>
                  <input
                    type="text"
                    value={editingProject.client || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    placeholder="e.g. Apex Horizon Group"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Industry</label>
                  <input
                    type="text"
                    value={editingProject.industry || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, industry: e.target.value })}
                    placeholder="e.g. Real Estate"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingProject.category || "ai-web"}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                  >
                    <option value="ai-web">AI Web Apps</option>
                    <option value="e-commerce">E-Commerce</option>
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="branding">Brand Identity</option>
                    <option value="full-stack">Full-Stack Application</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Dropzone & URL Input */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Featured Cover Image</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={editingProject.image || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    placeholder="Image URL or upload local file..."
                    className="flex-1 w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                  />

                  <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl cursor-pointer shrink-0 flex items-center gap-2 border border-slate-700">
                    <Upload className="w-4 h-4 text-[#2563EB]" />
                    <span>{isUploadingImage ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (url) => {
                            setEditingProject({ ...editingProject, image: url });
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                {editingProject.image && (
                  <div className="h-32 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative">
                    <img src={editingProject.image} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 text-slate-300 text-[10px] px-2 py-0.5 rounded">Preview</span>
                  </div>
                )}
              </div>

              {/* Short Summary */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Project Summary</label>
                <textarea
                  rows={2}
                  value={editingProject.summary || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  placeholder="A short 1-2 sentence description for portfolio cards..."
                  className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Challenge</label>
                  <textarea
                    rows={3}
                    value={editingProject.challenge || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                    placeholder="What problem was the client facing before?"
                    className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Engineered Solution</label>
                  <textarea
                    rows={3}
                    value={editingProject.solution || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    placeholder="How did Calvix Digitals solve it?"
                    className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Results / Key Metrics */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Key Metrics & Results</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(editingProject.results || []).map((res, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        placeholder="Label"
                        value={res.label}
                        onChange={(e) => {
                          const newRes = [...(editingProject.results || [])];
                          newRes[i].label = e.target.value;
                          setEditingProject({ ...editingProject, results: newRes });
                        }}
                        className="w-1/2 bg-transparent text-slate-300 outline-none text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={res.value}
                        onChange={(e) => {
                          const newRes = [...(editingProject.results || [])];
                          newRes[i].value = e.target.value;
                          setEditingProject({ ...editingProject, results: newRes });
                        }}
                        className="w-1/2 bg-transparent text-emerald-400 font-bold outline-none text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Technologies Used (Comma-separated)</label>
                <input
                  type="text"
                  value={(editingProject.technologies || []).join(", ")}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Next.js, TypeScript, Tailwind CSS, Gemini API"
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* External Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://client-demo.com"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GitHub Repo URL (Optional)</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/org/repo"
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-blue-glow inline-flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProject.id ? "Update Project" : "Publish Project"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* BLOG EDITOR MODAL */}
      {isBlogModalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2563EB]/20 text-[#2563EB] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    {editingBlog.id ? "Edit Article Details & SEO" : "Create New Blog Post"}
                  </h3>
                  <p className="text-[11px] text-slate-400">SEO + GEO + Canonical URL + PDF + Internal Linking System</p>
                </div>
              </div>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message Header if Slug Duplicate */}
            {slugError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold">URL Validation Issue</p>
                  <p className="text-[11px] text-red-300 mt-0.5">{slugError}</p>
                </div>
              </div>
            )}

            {/* Modal Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveBlogTab("content")}
                className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeBlogTab === "content"
                    ? "bg-[#2563EB] text-white shadow-blue-glow font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Article Content</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveBlogTab("seo")}
                className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeBlogTab === "seo"
                    ? "bg-[#2563EB] text-white shadow-blue-glow font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>2. SEO & Meta Tags</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveBlogTab("geo")}
                className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeBlogTab === "geo"
                    ? "bg-[#2563EB] text-white shadow-blue-glow font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>3. GEO & FAQs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveBlogTab("previews")}
                className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeBlogTab === "previews"
                    ? "bg-[#2563EB] text-white shadow-blue-glow font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>4. Google & Social Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveBlogTab("health")}
                className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeBlogTab === "health"
                    ? "bg-[#2563EB] text-white shadow-blue-glow font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>5. SEO Analyzer</span>
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-6 text-xs">
              
              {/* TAB 1: ARTICLE CONTENT */}
              {activeBlogTab === "content" && (
                <div className="space-y-5">
                  {/* Title & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-slate-300 font-semibold">Article Title *</label>
                      <input
                        type="text"
                        required
                        value={editingBlog.title || ""}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setEditingBlog({
                            ...editingBlog,
                            title: newTitle,
                            slug: editingBlog.slug ? editingBlog.slug : generateSlug(newTitle),
                            seoTitle: editingBlog.seoTitle ? editingBlog.seoTitle : newTitle,
                          });
                        }}
                        placeholder="e.g. How Much Does an AI Website Design Cost?"
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-300 font-semibold">Publication Status</label>
                      <select
                        value={editingBlog.status || "published"}
                        onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as "published" | "draft" })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                      >
                        <option value="published">Published (Public URL)</option>
                        <option value="draft">Save as Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* URL SLUG MANAGEMENT */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-slate-200 font-bold flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-[#2563EB]" />
                        <span>Clean Public URL Slug *</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const auto = generateSlug(editingBlog.title || "");
                          setEditingBlog({ ...editingBlog, slug: auto });
                        }}
                        className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer self-start sm:self-auto"
                      >
                        [ Auto-Generate Slug from Title ]
                      </button>
                    </div>

                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:border-[#2563EB]">
                      <span className="px-3 py-2.5 text-slate-400 font-mono text-[11px] bg-slate-950 border-r border-slate-800 shrink-0">
                        https://calvix-digitals.ai.studio/blog/
                      </span>
                      <input
                        type="text"
                        required
                        value={editingBlog.slug || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, slug: generateSlug(e.target.value) })}
                        placeholder="how-much-does-an-ai-website-design-cost"
                        className="w-full bg-transparent text-white px-3 py-2.5 font-mono text-xs outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Live Article URL: <span className="font-mono text-blue-400">https://calvix-digitals.ai.studio/blog/{editingBlog.slug || "your-clean-slug"}</span>
                    </p>
                  </div>

                  {/* Category, Author, Read Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Category</label>
                      <input
                        type="text"
                        value={editingBlog.category || "AI & Web Development"}
                        onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                        placeholder="e.g. AI & Web Development"
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Author Name</label>
                      <input
                        type="text"
                        value={editingBlog.author || "Calvix Digital"}
                        onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                        placeholder="e.g. Calvix Digital"
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Read Time</label>
                      <input
                        type="text"
                        value={editingBlog.readTime || "5 min read"}
                        onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  {/* Featured Cover Image & Alt Text */}
                  <div className="space-y-3">
                    <label className="block text-slate-300 font-semibold">Featured Image & Image SEO</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingBlog.coverImage || ""}
                          onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                          placeholder="Cover image URL..."
                          className="flex-1 bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                        />
                        <label className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl cursor-pointer shrink-0 flex items-center gap-1.5 border border-slate-700">
                          <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (url) => {
                                  setEditingBlog({ ...editingBlog, coverImage: url });
                                });
                              }
                            }}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={editingBlog.imageAlt || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, imageAlt: e.target.value })}
                        placeholder="Image Alt Text (e.g. Calvix Digital AI Web Development Team)"
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  {/* Internal Link Helper */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-200 font-bold flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4 text-[#2563EB]" />
                        <span>Internal Linking Tool</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Insert internal links into article body</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedInternalRoute}
                        onChange={(e) => setSelectedInternalRoute(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none"
                      >
                        <option value="/portfolio">Public Case Studies / Portfolio</option>
                        <option value="/pricing">Investment & Pricing Packages</option>
                        <option value="/about">About Calvix Digital</option>
                        <option value="/contact">Contact & Strategy Call Booking</option>
                        <option value="/blog">All Agency Articles & Insights</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const labelMap: Record<string, string> = {
                            "/portfolio": "Calvix Digital Work Portfolio",
                            "/pricing": "Calvix Digital Pricing Packages",
                            "/about": "About Calvix Digital",
                            "/contact": "Book a Free Strategy Consultation",
                            "/blog": "Calvix Digital Insights",
                          };
                          const label = labelMap[selectedInternalRoute] || "Calvix Digital";
                          const mdLink = `\n\nLearn more about our [${label}](https://calvix-digitals.ai.studio${selectedInternalRoute}) to elevate your online results.\n\n`;
                          setEditingBlog({
                            ...editingBlog,
                            content: (editingBlog.content || "") + mdLink,
                          });
                          showToast("Internal link inserted into body!");
                        }}
                        className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white font-bold rounded-xl cursor-pointer shrink-0"
                      >
                        Insert Internal Link
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Article Excerpt / Teaser Summary *</label>
                    <textarea
                      rows={2}
                      required
                      value={editingBlog.summary || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                      placeholder="A short summary displayed on article cards and search snippets..."
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Article Markdown Content */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Article Content (Markdown supported) *</label>
                    <textarea
                      rows={9}
                      required
                      value={editingBlog.content || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                      placeholder="Write full article content using markdown headers (### Header) and paragraphs..."
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl font-mono text-xs outline-none focus:border-[#2563EB] leading-relaxed"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={(editingBlog.tags || []).join(", ")}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="e.g. AI Web Development, Next.js, Conversion Rate Optimization"
                      className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* PDF Upload Card (Retained Intact) */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileDown className="w-4 h-4 text-[#2563EB]" />
                          <h4 className="font-heading font-bold text-sm text-white">Article PDF Attachment</h4>
                          {editingBlog.pdf_url && (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>PDF Attached</span>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                          Attach an optional downloadable PDF document version for offline reading.
                        </p>
                      </div>
                    </div>

                    {pdfUploadError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{pdfUploadError}</span>
                      </div>
                    )}

                    {editingBlog.pdf_url ? (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#2563EB] flex items-center justify-center shrink-0 font-bold">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5 break-all">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              {editingBlog.pdf_file_name || "Article Document.pdf"}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {editingBlog.pdf_file_size ? formatFileSize(editingBlog.pdf_file_size) : "PDF Document"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={editingBlog.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span>Open PDF</span>
                          </a>

                          <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer">
                            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              className="hidden"
                              disabled={isUploadingPdf}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePdfSelected(file, true);
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setIsRemovePdfModalOpen(true)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-5 text-center space-y-2 transition-colors bg-slate-900/40">
                        <p className="text-xs font-semibold text-slate-300">
                          No PDF attached. Accepted format: .pdf (Max 20MB)
                        </p>
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-blue-glow cursor-pointer transition-all disabled:opacity-50">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingPdf ? "Uploading PDF..." : "Upload Article PDF"}</span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            disabled={isUploadingPdf}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePdfSelected(file, false);
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SEO META TAGS */}
              {activeBlogTab === "seo" && (
                <div className="space-y-5">
                  {/* SEO Title */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-300 font-semibold">SEO Meta Title (Title Tag)</label>
                      <span className={`text-[11px] font-mono ${(editingBlog.seoTitle || editingBlog.title || "").length > 60 ? "text-amber-400" : "text-emerald-400"}`}>
                        {(editingBlog.seoTitle || editingBlog.title || "").length} / 60 Chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editingBlog.seoTitle || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, seoTitle: e.target.value })}
                      placeholder={editingBlog.title || "e.g. How Much Does an AI Website Design Cost? | Calvix Digital"}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-300 font-semibold">Meta Description (Search Snippet Summary)</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (editingBlog.summary) {
                              setEditingBlog({ ...editingBlog, metaDescription: editingBlog.summary });
                              showToast("Copied from article excerpt!");
                            }
                          }}
                          className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                        >
                          [ Copy Excerpt ]
                        </button>
                        <span className={`text-[11px] font-mono ${(editingBlog.metaDescription || editingBlog.summary || "").length > 160 ? "text-amber-400" : "text-emerald-400"}`}>
                          {(editingBlog.metaDescription || editingBlog.summary || "").length} / 160 Chars
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={editingBlog.metaDescription || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, metaDescription: e.target.value })}
                      placeholder={editingBlog.summary || "Comprehensive guide detailing the exact cost of custom AI web development..."}
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Focus & Secondary Keywords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-300 font-semibold">Primary Focus Keyword *</label>
                      <input
                        type="text"
                        value={editingBlog.focusKeyword || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, focusKeyword: e.target.value })}
                        placeholder="e.g. ai website design cost"
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-300 font-semibold">Secondary Target Keywords (Comma-separated)</label>
                      <input
                        type="text"
                        value={(editingBlog.secondaryKeywords || []).join(", ")}
                        onChange={(e) =>
                          setEditingBlog({
                            ...editingBlog,
                            secondaryKeywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g. custom web app pricing, nextjs agency cost"
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-semibold">Canonical URL (Prevents Duplicate Content Indexing)</label>
                    <input
                      type="text"
                      value={editingBlog.canonicalUrl || `https://calvix-digitals.ai.studio/blog/${editingBlog.slug || ""}`}
                      onChange={(e) => setEditingBlog({ ...editingBlog, canonicalUrl: e.target.value })}
                      placeholder="https://calvix-digitals.ai.studio/blog/your-slug"
                      className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-[#2563EB] font-mono text-xs"
                    />
                  </div>

                  {/* Social Open Graph Sync Tool */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Share2 className="w-4 h-4 text-[#2563EB]" />
                        <span>Open Graph (Facebook, LinkedIn, X) Custom Card Meta Tags</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlog({
                            ...editingBlog,
                            ogTitle: editingBlog.seoTitle || editingBlog.title,
                            ogDescription: editingBlog.metaDescription || editingBlog.summary,
                            ogImage: editingBlog.coverImage,
                            twitterTitle: editingBlog.seoTitle || editingBlog.title,
                            twitterDescription: editingBlog.metaDescription || editingBlog.summary,
                            twitterImage: editingBlog.coverImage,
                          });
                          showToast("Synced SEO Title & Description to OpenGraph!");
                        }}
                        className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        [ Sync SEO Meta to OpenGraph ]
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editingBlog.ogTitle || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, ogTitle: e.target.value })}
                        placeholder="OG Card Title (Facebook / LinkedIn)"
                        className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none"
                      />
                      <input
                        type="text"
                        value={editingBlog.ogImage || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, ogImage: e.target.value })}
                        placeholder="OG Social Image URL"
                        className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GEO & FAQS */}
              {activeBlogTab === "geo" && (
                <div className="space-y-5">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-xs text-blue-200 leading-relaxed space-y-1">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#2563EB]" />
                      <span>Generative Engine Optimization (GEO) Strategy</span>
                    </p>
                    <p>
                      AI Search Engines (Google AI Overviews, ChatGPT, Gemini, Perplexity) extract direct concise answers from web content. Providing an executive answer summary and structured FAQs vastly improves AI citation rates.
                    </p>
                  </div>

                  {/* GEO Executive Answer-First Summary */}
                  <div className="space-y-1">
                    <label className="block text-slate-300 font-semibold">Answer-First Executive Summary (GEO)</label>
                    <textarea
                      rows={3}
                      value={editingBlog.answerIntro || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, answerIntro: e.target.value })}
                      placeholder="e.g. A custom AI-powered web design application typically costs between $3,500 and $12,000 depending on integrations..."
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Structured FAQs Manager */}
                  <div className="space-y-3">
                    <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                      <span>Article FAQs (Generates FAQPage JSON-LD Schema)</span>
                    </label>

                    {/* Current FAQ items */}
                    {(editingBlog.faqs || []).map((faq, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white text-xs">FAQ #{idx + 1}: {faq.question}</p>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedFaqs = (editingBlog.faqs || []).filter((_, i) => i !== idx);
                              setEditingBlog({ ...editingBlog, faqs: updatedFaqs });
                            }}
                            className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-slate-400 text-xs">{faq.answer}</p>
                      </div>
                    ))}

                    {/* Add New FAQ Form */}
                    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                      <h5 className="font-bold text-white text-xs">Add Question & Answer Pair</h5>
                      <input
                        type="text"
                        value={faqQuestionInput}
                        onChange={(e) => setFaqQuestionInput(e.target.value)}
                        placeholder="Question (e.g. How long does an AI web project take?)"
                        className="w-full bg-slate-900 border border-slate-800 text-white px-3.5 py-2 rounded-xl outline-none"
                      />
                      <textarea
                        rows={2}
                        value={faqAnswerInput}
                        onChange={(e) => setFaqAnswerInput(e.target.value)}
                        placeholder="Direct Answer..."
                        className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (faqQuestionInput.trim() && faqAnswerInput.trim()) {
                            const newFaqs = [
                              ...(editingBlog.faqs || []),
                              { question: faqQuestionInput.trim(), answer: faqAnswerInput.trim() },
                            ];
                            setEditingBlog({ ...editingBlog, faqs: newFaqs });
                            setFaqQuestionInput("");
                            setFaqAnswerInput("");
                            showToast("FAQ item added!");
                          }
                        }}
                        className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-blue-glow cursor-pointer"
                      >
                        + Add FAQ Item
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PREVIEWS */}
              {activeBlogTab === "previews" && (
                <div className="space-y-6">
                  {/* Google Search Result Card */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-emerald-400" />
                      <span>Live Google Search Result Preview</span>
                    </h4>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-[#1a0dab] space-y-1 font-sans shadow-md">
                      <div className="text-[11px] text-[#202124] flex items-center gap-1">
                        <span className="font-semibold">Calvix Digital</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[#006621] text-[11px] font-mono">
                          https://calvix-digitals.ai.studio › blog › {editingBlog.slug || "your-article-slug"}
                        </span>
                      </div>
                      <h3 className="text-lg font-normal text-[#1a0dab] hover:underline leading-snug cursor-pointer">
                        {editingBlog.seoTitle || editingBlog.title || "Your Article Title Will Appear Here"}
                      </h3>
                      <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                        {editingBlog.metaDescription || editingBlog.summary || "Your meta description or excerpt preview snippet will display here in Google search engine results..."}
                      </p>
                    </div>
                  </div>

                  {/* Social Share Card Preview */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-blue-400" />
                      <span>Social Media OpenGraph Card Preview (LinkedIn / Facebook / X)</span>
                    </h4>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg max-w-lg">
                      <div className="h-44 bg-slate-900 relative">
                        {editingBlog.ogImage || editingBlog.coverImage ? (
                          <img
                            src={editingBlog.ogImage || editingBlog.coverImage}
                            alt="Card Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                            No Cover Image Uploaded
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-1 bg-slate-900 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                          CALVIXDIGITAL.COM
                        </span>
                        <h4 className="font-bold text-white text-xs line-clamp-1">
                          {editingBlog.ogTitle || editingBlog.seoTitle || editingBlog.title || "Social Card Title"}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {editingBlog.ogDescription || editingBlog.metaDescription || editingBlog.summary || "Social card description..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SEO HEALTH ANALYZER */}
              {activeBlogTab === "health" && (
                <div className="space-y-4">
                  {(() => {
                    const health = analyzeSEOHealth(editingBlog as BlogPost);
                    return (
                      <div className="space-y-4">
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SEO Health Score</span>
                            <h4 className="font-heading font-extrabold text-3xl text-white mt-1">
                              {health.score} <span className="text-sm font-normal text-slate-400">/ 100 Points</span>
                            </h4>
                          </div>
                          <div
                            className={`px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider ${
                              health.score >= 80
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : health.score >= 50
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {health.score >= 80 ? "SEO Optimized" : health.score >= 50 ? "Needs Improvement" : "Action Required"}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {health.checks.map((item, iIdx) => (
                            <div key={iIdx} className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                {item.status === "good" ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <AlertCircle className={`w-4 h-4 shrink-0 ${item.status === "warning" ? "text-amber-400" : "text-red-400"}`} />
                                )}
                                <div>
                                  <p className="font-bold text-white text-xs">{item.label}</p>
                                  <p className="text-[11px] text-slate-400">{item.message}</p>
                                </div>
                              </div>
                              <span
                                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shrink-0 ${
                                  item.status === "good"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : item.status === "warning"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Submit / Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 hidden sm:block">
                  URL: <span className="font-mono text-blue-400">/blog/{editingBlog.slug || "your-slug"}</span>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsBlogModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingPdf}
                    className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-blue-glow inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isUploadingPdf ? "Processing PDF..." : editingBlog.id ? "Update Article" : "Publish Article"}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingItemId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-extrabold text-lg text-white">
              Confirm Permanent Deletion?
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Are you sure you want to delete this {deletingType === "project" ? "project" : "blog post"} from the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setDeletingItemId(null);
                  setDeletingType(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deletingType === "project") handleDeleteProject(deletingItemId);
                  else if (deletingType === "blog") handleDeleteBlog(deletingItemId);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM REMOVE PDF MODAL */}
      {isRemovePdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-extrabold text-lg text-white">
              Remove this PDF?
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Visitors will no longer be able to download the PDF from this article.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsRemovePdfModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemovePdf}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Remove PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM REPLACE PDF MODAL */}
      {isReplacePdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-extrabold text-lg text-white">
              Replace existing PDF?
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Uploading {pendingPdfFile?.name ? <strong className="text-white">{pendingPdfFile.name}</strong> : "a new PDF"} will replace the current file associated with this article.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsReplacePdfModalOpen(false);
                  setPendingPdfFile(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReplacePdf}
                className="px-5 py-2 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-blue-glow"
              >
                Replace PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
