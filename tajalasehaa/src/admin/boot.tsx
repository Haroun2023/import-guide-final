import "./admin.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./AdminApp";

/** Mounts the demo CMS (/admin). Loaded only on admin pages. */
export function boot(root: HTMLElement) {
  document.title = "لوحة التحكم | تاج الأصحاء";
  const robots = document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex, nofollow";
  document.head.appendChild(robots);
  root.textContent = "";
  root.style.height = "100%";
  createRoot(root).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>,
  );
}
