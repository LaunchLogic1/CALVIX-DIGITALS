export interface RouteState {
  path: string;
  tab: string;
  blogSlug?: string;
}

export function parsePath(pathname: string): RouteState {
  // Normalize path
  const path = pathname.toLowerCase().replace(/\/$/, "") || "/";

  if (path === "/" || path === "") {
    return { path: "/", tab: "home" };
  }
  if (path === "/about") {
    return { path: "/about", tab: "about" };
  }
  if (path === "/pricing") {
    return { path: "/pricing", tab: "pricing" };
  }
  if (path === "/portfolio") {
    return { path: "/portfolio", tab: "portfolio" };
  }
  if (path === "/blog" || path === "/insights") {
    return { path: "/blog", tab: "blog" };
  }
  if (path.startsWith("/blog/")) {
    const blogSlug = path.replace("/blog/", "");
    return { path, tab: "blog-detail", blogSlug };
  }
  if (path === "/contact") {
    return { path: "/contact", tab: "contact" };
  }
  if (path === "/privacy-policy" || path === "/privacy") {
    return { path: "/privacy-policy", tab: "legal" };
  }
  if (path === "/terms" || path === "/terms-and-conditions") {
    return { path: "/terms", tab: "legal" };
  }
  if (path === "/admin") {
    return { path: "/admin", tab: "admin" };
  }

  return { path: "/", tab: "home" };
}

export function navigateTo(targetPath: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, "", targetPath);
    window.dispatchEvent(new Event("popstate"));
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
