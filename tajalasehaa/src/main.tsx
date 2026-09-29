import "@fontsource-variable/readex-pro/wght.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

// Canonical paths have no trailing slash (matches vercel.json).
if (location.pathname.length > 1 && location.pathname.endsWith("/")) {
  history.replaceState(null, "", location.pathname.replace(/\/+$/, "") + location.search + location.hash);
}

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Hydrate only when the prerendered HTML belongs to this exact route;
// otherwise (dev server, fallback pages) render from scratch.
if (root.dataset.route && root.dataset.route === location.pathname) {
  // Let the browser paint the prerendered page first (faster FCP/LCP on slow
  // phones), then hydrate on the next frame.
  requestAnimationFrame(() => setTimeout(() => hydrateRoot(root, app), 0));
} else {
  root.textContent = "";
  createRoot(root).render(app);
}
