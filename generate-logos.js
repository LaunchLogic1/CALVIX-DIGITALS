import fs from "fs";
import path from "path";
import { Resvg } from "@resvg/resvg-js";

// SVG with dark background for app icon / social media / favicons
const svgDarkBg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="blueMain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="blueRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1E40AF" />
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#2563EB" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Dark Background Container -->
  <rect width="512" height="512" rx="96" fill="#04060d" />

  <g filter="url(#subtleGlow)">
    <!-- White C Body -->
    <path fill="#FFFFFF" d="
      M 256 68
      L 418 162
      L 352 200
      L 284 160
      L 174 223
      L 174 289
      L 284 352
      L 256 444
      L 94 350
      L 94 162
      Z
    " />

    <!-- Bottom-Right Electric Blue Facet -->
    <path fill="url(#blueRight)" d="
      M 284 352
      L 352 312
      L 418 350
      L 256 444
      Z
    " />

    <!-- Central Blue Gem / Arrowhead -->
    <polygon points="214,256 252,224 312,224 284,256 312,288 252,288" fill="url(#blueMain)" />
  </g>
</svg>`;

// SVG with transparent background for inline vector usage
const svgTransparent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="blueMainT" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="blueRightT" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1E40AF" />
    </linearGradient>
    <filter id="glowT" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#2563EB" flood-opacity="0.35" />
    </filter>
  </defs>

  <g filter="url(#glowT)">
    <!-- White C Body -->
    <path fill="#FFFFFF" d="
      M 256 68
      L 418 162
      L 352 200
      L 284 160
      L 174 223
      L 174 289
      L 284 352
      L 256 444
      L 94 350
      L 94 162
      Z
    " />

    <!-- Bottom-Right Electric Blue Facet -->
    <path fill="url(#blueRightT)" d="
      M 284 352
      L 352 312
      L 418 350
      L 256 444
      Z
    " />

    <!-- Central Blue Gem / Arrowhead -->
    <polygon points="214,256 252,224 312,224 284,256 312,288 252,288" fill="url(#blueMainT)" />
  </g>
</svg>`;

function renderPng(svg, size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  });
  return resvg.render().asPng();
}

console.log("Generating logo assets...");

const publicDir = "./public";
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write SVGs
fs.writeFileSync(path.join(publicDir, "logo.svg"), svgDarkBg);
fs.writeFileSync(path.join(publicDir, "calvix-logo.svg"), svgDarkBg);
fs.writeFileSync(path.join(publicDir, "logo-transparent.svg"), svgTransparent);

// Generate PNGs at various resolutions
const size1024 = renderPng(svgDarkBg, 1024);
const size512 = renderPng(svgDarkBg, 512);
const size192 = renderPng(svgDarkBg, 192);
const size32 = renderPng(svgDarkBg, 32);
const size16 = renderPng(svgDarkBg, 16);

fs.writeFileSync(path.join(publicDir, "calvix-logo.png"), size1024);
fs.writeFileSync(path.join(publicDir, "calvix-logo-trimmed.png"), size512);
fs.writeFileSync(path.join(publicDir, "logo.png"), size512);
fs.writeFileSync(path.join(publicDir, "logo512.png"), size512);
fs.writeFileSync(path.join(publicDir, "logo192.png"), size192);
fs.writeFileSync(path.join(publicDir, "favicon-32x32.png"), size32);
fs.writeFileSync(path.join(publicDir, "favicon-16x16.png"), size16);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), size32);

// Ensure verification files exist in public and dist
const vFile1 = "google16576adbda03af7.html";
const vFile2 = "googlec16576adbda03af7.html";

fs.writeFileSync(path.join(publicDir, vFile1), `google-site-verification: google16576adbda03af7.html`);
fs.writeFileSync(path.join(publicDir, vFile2), `google-site-verification: googlec16576adbda03af7.html`);

// Copy to dist if dist exists
const distDir = "./dist";
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, "logo.svg"), svgDarkBg);
  fs.writeFileSync(path.join(distDir, "calvix-logo.png"), size1024);
  fs.writeFileSync(path.join(distDir, "calvix-logo-trimmed.png"), size512);
  fs.writeFileSync(path.join(distDir, "logo.png"), size512);
  fs.writeFileSync(path.join(distDir, "logo512.png"), size512);
  fs.writeFileSync(path.join(distDir, "logo192.png"), size192);
  fs.writeFileSync(path.join(distDir, "favicon-32x32.png"), size32);
  fs.writeFileSync(path.join(distDir, "favicon-16x16.png"), size16);
  fs.writeFileSync(path.join(distDir, "favicon.ico"), size32);
  fs.writeFileSync(path.join(distDir, vFile1), `google-site-verification: google16576adbda03af7.html`);
  fs.writeFileSync(path.join(distDir, vFile2), `google-site-verification: googlec16576adbda03af7.html`);
}

console.log("All logo assets generated successfully!");
