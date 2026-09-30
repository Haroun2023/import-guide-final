import * as L from "lucide-react";
import type { CmsState, RoleId } from "@/cms/types";

/** What each role may open (WordPress roles, simplified for a clinic). */
export type Cap = "dashboard" | "leads" | "content" | "media" | "design" | "plugins" | "users" | "settings" | "tools" | "marketing";

export const ROLES: Record<RoleId, { label: string; caps: Cap[]; desc: string }> = {
  admin: { label: "مدير", caps: ["dashboard", "leads", "content", "media", "design", "plugins", "users", "settings", "tools", "marketing"], desc: "كل الصلاحيات، ومنها الإضافات والمستخدمون والإعدادات." },
  editor: { label: "محرر محتوى", caps: ["dashboard", "content", "media", "design"], desc: "المقالات والصفحات والبرامج والأجهزة والوسائط والمظهر." },
  reception: { label: "استقبال", caps: ["dashboard", "leads"], desc: "الحجوزات والمواعيد فقط، دون تعديل الموقع." },
  marketing: { label: "تسويق", caps: ["dashboard", "leads", "content", "media", "marketing"], desc: "المقالات وتحسين البحث والعروض والتحليلات، ويرى الحجوزات." },
};

export type MenuChild = { href: string; label: string; plugin?: string };
export type MenuItem = {
  href: string;
  label: string;
  icon: L.LucideIcon;
  cap: Cap;
  group: "main" | "site" | "plugins";
  plugin?: string;
  badge?: (s: CmsState) => number;
  children?: MenuChild[];
};

export const MENU: MenuItem[] = [
  { href: "/", label: "لوحة المعلومات", icon: L.LayoutDashboard, cap: "dashboard", group: "main" },
  {
    href: "/leads",
    label: "الحجوزات",
    icon: L.Inbox,
    cap: "leads",
    group: "main",
    badge: (s) => s.leads.filter((l) => l.status === "new" && !l.spam).length,
    children: [
      { href: "/leads", label: "كل الطلبات" },
      { href: "/leads?view=board", label: "لوحة المتابعة" },
      { href: "/leads?view=calendar", label: "تقويم المواعيد", plugin: "appointments" },
    ],
  },
  { href: "/posts", label: "المقالات", icon: L.Newspaper, cap: "content", group: "main", children: [{ href: "/posts", label: "كل المقالات" }, { href: "/posts/new", label: "أضف مقالًا" }] },
  { href: "/media", label: "الوسائط", icon: L.Images, cap: "media", group: "main" },
  { href: "/pages", label: "الصفحات", icon: L.Files, cap: "content", group: "main", children: [{ href: "/pages", label: "كل الصفحات" }, { href: "/pages/home", label: "منشئ الرئيسية" }] },
  { href: "/programs", label: "البرامج", icon: L.HeartPulse, cap: "content", group: "main", children: [{ href: "/programs", label: "كل البرامج" }, { href: "/programs/new", label: "أضف برنامجًا" }] },
  { href: "/devices", label: "الأجهزة", icon: L.Cpu, cap: "content", group: "main" },
  { href: "/faqs", label: "الأسئلة الشائعة", icon: L.CircleHelp, cap: "content", group: "main" },
  { href: "/reviews", label: "آراء المراجعين", icon: L.Star, cap: "content", group: "main", plugin: "reviews", badge: (s) => s.reviews.filter((r) => r.status === "pending").length },
  {
    href: "/appearance",
    label: "المظهر",
    icon: L.Palette,
    cap: "design",
    group: "site",
    children: [
      { href: "/appearance", label: "الألوان والشكل" },
      { href: "/appearance/menus", label: "القوائم" },
      { href: "/pages/home", label: "أقسام الرئيسية" },
    ],
  },
  { href: "/plugins", label: "الإضافات", icon: L.Plug, cap: "plugins", group: "site", children: [{ href: "/plugins", label: "الإضافات المثبّتة" }, { href: "/plugins/new", label: "أضف إضافة" }] },
  { href: "/users", label: "المستخدمون", icon: L.Users, cap: "users", group: "site" },
  {
    href: "/tools",
    label: "الأدوات",
    icon: L.Wrench,
    cap: "tools",
    group: "site",
    children: [
      { href: "/tools", label: "صحة الموقع" },
      { href: "/backups", label: "النسخ الاحتياطي", plugin: "backups" },
      { href: "/activity", label: "سجل النشاط", plugin: "activity" },
      { href: "/tools/export", label: "تصدير واستيراد" },
    ],
  },
  { href: "/settings", label: "الإعدادات", icon: L.Settings, cap: "settings", group: "site" },
  { href: "/seo", label: "تحسين البحث", icon: L.Search, cap: "marketing", group: "plugins", plugin: "seo" },
  { href: "/analytics", label: "التحليلات", icon: L.ChartLine, cap: "marketing", group: "plugins", plugin: "analytics" },
  { href: "/redirects", label: "التحويلات", icon: L.Shuffle, cap: "marketing", group: "plugins", plugin: "redirects" },
  { href: "/security", label: "الأمان", icon: L.ShieldCheck, cap: "settings", group: "plugins", plugin: "security" },
  { href: "/performance", label: "الأداء", icon: L.Gauge, cap: "settings", group: "plugins", plugin: "cache" },
];

export const pluginOn = (s: CmsState, id?: string) => !id || (!!s.plugins[id]?.installed && !!s.plugins[id]?.active);
