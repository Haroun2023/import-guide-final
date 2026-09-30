import "@fontsource-variable/readex-pro/wght.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { hasCmsDemo } from "./cms/flag";

// Canonical paths have no trailing slash (matches vercel.json).
if (location.pathname.length > 1 && location.pathname.endsWith("/")) {
  history.replaceState(null, "", location.pathname.replace(/\/+$/, "") + location.search + location.hash);
}

// Glow cards: light and a slight tilt follow the mouse (see .glow-card in index.css).
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let last: PointerEvent | null = null;
  addEventListener(
    "pointermove",
    (e) => {
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const card = last && last.target instanceof Element ? last.target.closest<HTMLElement>(".glow-card") : null;
        if (!card || !last) return;
        const r = card.getBoundingClientRect();
        const x = last.clientX - r.left;
        const y = last.clientY - r.top;
        card.style.setProperty("--px", `${x}px`);
        card.style.setProperty("--py", `${y}px`);
        if (!still.matches) {
          card.style.setProperty("--ry", `${((x / r.width - 0.5) * 5).toFixed(2)}deg`);
          card.style.setProperty("--rx", `${((0.5 - y / r.height) * 5).toFixed(2)}deg`);
        }
      });
    },
    { passive: true },
  );
}

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
const reveal = () => document.documentElement.classList.remove("cms-pending");

if (location.pathname === "/admin" || location.pathname.startsWith("/admin/")) {
  // The demo CMS: its own bundle, loaded only here.
  import("./admin/boot").then((m) => m.boot(root)).finally(reveal);
} else if (hasCmsDemo()) {
  // This browser opened the demo CMS: show its edits (rendered fresh, since
  // they differ from the prerendered page).
  import("./cms/apply")
    .then(async ({ applyCms }) => {
      const { maintenance, redirectTo } = applyCms();
      if (redirectTo) return location.replace(redirectTo);
      root.textContent = "";
      if (maintenance) {
        const { MaintenancePage } = await import("./cms/SiteExtras");
        createRoot(root).render(<MaintenancePage />);
      } else createRoot(root).render(app);
    })
    .catch(() => {
      root.textContent = "";
      createRoot(root).render(app);
    })
    .finally(() => requestAnimationFrame(reveal));
} else if (root.dataset.route && root.dataset.route === location.pathname) {
  // Hydrate only when the prerendered HTML belongs to this exact route;
  // otherwise (dev server, fallback pages) render from scratch.
  // Let the browser paint the prerendered page first (faster FCP/LCP on slow
  // phones), then hydrate on the next frame.
  requestAnimationFrame(() => setTimeout(() => hydrateRoot(root, app), 0));
} else {
  root.textContent = "";
  createRoot(root).render(app);
}
