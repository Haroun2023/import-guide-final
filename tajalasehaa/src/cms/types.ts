/** Shapes of everything the demo CMS stores (one JSON document in this browser's localStorage). */

export type LeadStatus = "new" | "contacted" | "booked" | "attended" | "no_answer" | "cancelled";

export type Lead = {
  id: string;
  ref: string;
  createdAt: string;
  name: string;
  phone: string;
  complaint: string;
  complaintLabel: string;
  forWhom: string;
  mode: "clinic" | "home";
  time: string;
  therapist: string;
  payment: string;
  insurer: string;
  placement: string;
  source: string;
  campaign?: string;
  status: LeadStatus;
  appointment?: { date: string; time: string; therapist: string };
  notes: { at: string; by: string; text: string }[];
  spam?: boolean;
  /** seeded example, not a real person */
  demo?: boolean;
};

export type BlockType = "p" | "h2" | "h3" | "list" | "quote" | "image" | "callout" | "cta";
export type Block = { id: string; type: BlockType; text?: string; items?: string[]; src?: string; alt?: string };

export type PostStatus = "published" | "draft" | "scheduled";

export type Seo = { title: string; description: string; focus: string };

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  cover?: string;
  blocks: Block[];
  status: PostStatus;
  publishAt?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  seo: Seo;
  demo?: boolean;
};

export type MediaKind = "photo" | "device" | "icon" | "upload";
export type MediaItem = {
  id: string;
  name: string;
  /** a site URL, or "idb:<id>" for an upload kept in IndexedDB */
  src: string;
  kind: MediaKind;
  width?: number;
  height?: number;
  size?: number;
  alt: string;
  optimizedFrom?: number;
  createdAt: string;
  builtIn: boolean;
};

export type RoleId = "admin" | "editor" | "reception" | "marketing";
export type User = { id: string; name: string; email: string; role: RoleId; lastLogin?: string; twoFactor?: boolean };

export type Review = {
  id: string;
  name: string;
  context: string;
  text: string;
  rating: number;
  status: "approved" | "pending" | "hidden";
  source: "google" | "site" | "whatsapp";
  consent: boolean;
  createdAt: string;
  demo?: boolean;
};

export type Redirect = { id: string; from: string; to: string; code: 301 | 302; hits: number; note?: string; server?: boolean };

export type Activity = { id: string; at: string; user: string; action: string; target?: string };

export type PluginState = { installed: boolean; active: boolean; settings: Record<string, unknown> };

export type Faq = { q: string; a: string };

export type ProgramEdit = {
  id: string;
  title: string;
  short: string;
  points: string[];
  icon3d: string;
  track: "rehab" | "wellness";
  featured?: string;
  intro?: string;
  signs?: string[];
  approach?: { title: string; text: string }[];
  devices?: string[];
  faqs?: Faq[];
  seoTitle?: string;
  seoDescription?: string;
  status: "published" | "draft";
  custom?: boolean;
};

export type DeviceEdit = {
  id: string;
  name: string;
  model: string;
  short: string;
  how: string;
  feel: string;
  session: string;
  course: string;
  badge?: string;
  /** SFDA marketing authorization number, shown on the device page */
  mdma?: string;
  treats: string[];
  features: { title: string; text: string }[];
};

export type NavItem = { href: string; label: string };

/** One home section's text (every field optional: sections use different ones). */
export type CopyEntry = { eyebrow?: string; title?: string; lead?: string; leadShort?: string; phrases?: string[]; text?: string };

export type SiteEdit = {
  isDemo: boolean;
  name: string;
  fullName: string;
  tagline: string;
  city: string;
  contact: { phoneDisplay: string; phoneE164: string; whatsapp: string; email: string };
  responseTimeMinutes: number;
  /** daily opening time, closing time and the days the center opens (schema.org English day names) */
  hours: { opens: string; closes: string; days: string[] };
  address: string;
  social: { instagram: string; snapchat: string; tiktok: string; x: string };
  offer: { active: boolean; label: string; note: string; approval?: string };
  stats: { value: string; label: string }[];
  features: { femaleTherapists: boolean; homeVisits: boolean; installments: string[] };
  insurers: string[];
  license: { moh: string; cbahi: boolean };
  rating: null | { value: number; count: number; source: string; url: string };
};

export type Theme = { preset: string; brand: string; navy: string; radius: number };

export type CmsState = {
  v: 1;
  createdAt: string;
  site: SiteEdit;
  copy: Record<string, CopyEntry>;
  homeSections: { id: string; label: string; visible: boolean }[];
  programs: ProgramEdit[];
  devices: DeviceEdit[];
  faqs: Faq[];
  posts: Post[];
  leads: Lead[];
  media: MediaItem[];
  users: User[];
  reviews: Review[];
  redirects: Redirect[];
  menus: { header: NavItem[] };
  theme: Theme;
  plugins: Record<string, PluginState>;
  /** per-page search title and description (path → text) */
  seo: Record<string, Partial<Seo>>;
  activity: Activity[];
  /** broken links visitors hit in this browser (the redirects plugin's 404 log) */
  notFound: { path: string; hits: number; last: string }[];
  backups: { id: string; at: string; size: number; kind: "manual" | "auto" }[];
};
