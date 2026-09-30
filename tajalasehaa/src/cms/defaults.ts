import { complaints } from "@/config/booking";
import { centerPhotos, faqs, programs, stories } from "@/config/content";
import { copy, homeSections } from "@/config/copy";
import { devices } from "@/config/devices";
import { site } from "@/config/site";
import { NAV } from "@/components/layout/nav";
import { PLUGINS } from "./plugins";
import type { Block, CmsState, Lead, LeadStatus, MediaItem, Post, Review } from "./types";

/**
 * A fresh demo: the site's real content (from src/config) plus clearly marked
 * example records (bookings, articles, reviews) so every screen has something
 * to show. Built once per browser; «إعادة ضبط العرض» rebuilds it.
 */

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
export const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

/** Deterministic example data (same demo every time, relative to today). */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const NAMES = [
  "عبدالله الحربي", "نورة العتيبي", "محمد الجهني", "سارة المطيري", "فهد الأحمدي", "ريم الشهري", "خالد الرحيلي", "منى السناني",
  "سلطان الصاعدي", "هند المالكي", "عمر باعشن", "أمل الردادي", "يوسف المزيني", "لمى الحازمي", "تركي العوفي", "جود القرشي",
  "بندر السهلي", "مها الزهراني", "ماجد العمري", "دانة الغامدي", "إبراهيم الشنقيطي", "رهف البلوي", "حسن الأنصاري", "غادة الجابري",
];
const VISITORS = [
  { name: "أحمد عبدالرحمن (زائر من مصر)", phone: "+201001234567" },
  { name: "فاطمة سوليحة (زائرة من إندونيسيا)", phone: "+6281234567890" },
];
const SOURCES: { source: string; placement: string; campaign?: string }[] = [
  { source: "Snapchat", placement: "lp:back-pain", campaign: "ظهر-سبتمبر" },
  { source: "Snapchat", placement: "lp:knee", campaign: "ركبة-سبتمبر" },
  { source: "TikTok", placement: "lp:alterg", campaign: "AlterG-فيديو" },
  { source: "Google Ads", placement: "lp:shockwave", campaign: "بحث-موجات" },
  { source: "Google", placement: "hero" },
  { source: "Instagram", placement: "lp:women", campaign: "صحة-المرأة" },
  { source: "WhatsApp", placement: "program:umrah:signs" },
  { source: "مباشر", placement: "booking-section" },
];
const STATUSES: LeadStatus[] = ["new", "new", "new", "new", "contacted", "contacted", "contacted", "booked", "booked", "booked", "booked", "attended", "attended", "no_answer", "cancelled"];
export const THERAPISTS = ["أخصائي العظام والعمود الفقري", "أخصائية صحة المرأة", "أخصائي التأهيل الرياضي", "فريق الزيارات المنزلية"];
const TIMES = ["10:00", "11:30", "13:00", "16:00", "17:30", "19:00", "20:30", "21:15"];

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

function demoLeads(now: Date): Lead[] {
  const r = rng(7);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const people = [...NAMES.map((name) => ({ name, phone: "" })), ...VISITORS];
  return people.map((p, i) => {
    // The first three arrived in the last two hours; the rest over the past two weeks.
    const minutesAgo = i < 3 ? i * 47 + 12 : (Math.floor(r() * 24 * 13) + 6) * 60;
    const created = new Date(now.getTime() - minutesAgo * 60_000);
    const c = p.name.includes("زائر") ? complaints.find((x) => x.id === "umrah")! : pick(complaints.filter((x) => x.id !== "other"));
    const src = p.name.includes("زائر") ? SOURCES[6] : pick(SOURCES);
    const status: LeadStatus = i < 3 ? "new" : pick(STATUSES);
    const female = /ة |ى |نورة|سارة|ريم|منى|هند|أمل|لمى|جود|مها|دانة|رهف|غادة|فاطمة/.test(`${p.name} `);
    const phone = p.phone || `+9665${String(Math.floor(r() * 1e8)).padStart(8, "0")}`;
    const lead: Lead = {
      id: `demo-${i + 1}`,
      ref: `TA-${"KMPRHNBCXQZTWD"[i % 14]}${"7423956"[i % 7]}${String(1000 + i * 37).slice(-4)}`,
      createdAt: created.toISOString(),
      name: p.name,
      phone,
      complaint: c.id,
      complaintLabel: c.label,
      forWhom: i % 5 === 3 ? "لأحد والديّ" : i % 7 === 4 ? "لطفلي" : "لنفسي",
      mode: c.id === "umrah" || i % 6 !== 2 ? "clinic" : "home",
      time: pick(["أقرب موعد متاح", "صباحًا", "بعد الظهر", "مساءً"]),
      therapist: female && r() > 0.3 ? "أخصائية" : "بدون تفضيل",
      payment: r() > 0.55 ? "تأمين طبي" : "دفع مباشر",
      insurer: "",
      placement: src.placement,
      source: src.source,
      campaign: src.campaign,
      status,
      notes: [],
      demo: true,
    };
    if (lead.payment === "تأمين طبي") lead.insurer = pick(["بوبا", "التعاونية", "ميدغلف", "تكافل الراجحي"]);
    if (status === "booked" || status === "attended") {
      const offset = status === "attended" ? -Math.ceil(r() * 5) : Math.floor(r() * 7);
      const day = new Date(now.getTime() + offset * 864e5);
      lead.appointment = {
        date: isoDate(day),
        time: pick(TIMES),
        therapist: lead.therapist === "أخصائية" || c.id === "women" ? THERAPISTS[1] : lead.mode === "home" ? THERAPISTS[3] : c.id === "sports" || c.id === "knee" ? THERAPISTS[2] : THERAPISTS[0],
      };
    }
    if (status !== "new") {
      lead.notes.push({
        at: new Date(created.getTime() + 11 * 60_000).toISOString(),
        by: "الاستقبال",
        text:
          status === "no_answer"
            ? "اتصلنا مرتين ولم يرد. أرسلنا رسالة واتساب."
            : status === "cancelled"
              ? "اعتذر عن الموعد، وطلب التواصل الشهر القادم."
              : "تواصلنا معه وشرحنا خطوات التقييم الأول.",
      });
    }
    return lead;
  });
}

const b = (type: Block["type"], text: string, items?: string[]): Block => ({ id: uid("b"), type, text, items });

function demoPosts(now: Date): Post[] {
  const day = (n: number) => new Date(now.getTime() - n * 864e5).toISOString();
  return [
    {
      id: "post-desk",
      slug: "back-at-work",
      title: "خمس عادات صغيرة تريح ظهرك في يوم العمل",
      excerpt: "ساعات الجلوس الطويلة من أكثر ما يرهق الظهر والرقبة. هذه عادات بسيطة تخفف الحمل عنهما، ومتى تحتاج تقييمًا.",
      category: "الظهر والرقبة",
      tags: ["الظهر", "العمل المكتبي"],
      cover: "/photos/hall-960.webp",
      blocks: [
        b("p", "يقضي كثير منا ثماني ساعات أو أكثر أمام الشاشة، ثم ساعة أخرى خلف المقود. ومع الوقت يبدأ الشد في الرقبة وأسفل الظهر. هذه عادات صغيرة نوصي بها كثيرًا في جلساتنا."),
        b("h2", "غيّر وضعيتك كل نصف ساعة"),
        b("p", "لا توجد جلسة مثالية تبقى عليها طوال اليوم. قف، وامشِ خطوات قليلة، أو غيّر طريقة جلوسك. الحركة المتكررة أهم من الوضعية نفسها."),
        b("h2", "اجعل الشاشة في مستوى عينيك"),
        b("p", "إن كانت الشاشة منخفضة فستميل رقبتك إلى الأمام طوال اليوم. ارفعها حتى يكون أعلاها قريبًا من مستوى نظرك."),
        b("h2", "ثبّت قدميك على الأرض"),
        b("p", "حين تتدلى قدماك أو تنثني تحت الكرسي، يتحمل أسفل ظهرك جزءًا أكبر من وزنك. استخدم مسند قدمين إن احتجت."),
        b("list", "", ["قرّب لوحة المفاتيح حتى ترتاح مرفقاك بجانب جسمك", "اشرب الماء، فهو يذكّرك بالقيام أيضًا", "مدّد صدرك وكتفيك مرتين في اليوم"]),
        b("callout", "إن امتد الألم من الظهر إلى الساق، أو صاحبه تنميل أو ضعف، فاحجز تقييمًا ولا تكتفِ بالتمارين العامة."),
        b("cta", "احجز تقييمك"),
      ],
      status: "published",
      author: "فريق المحتوى",
      createdAt: day(9),
      updatedAt: day(9),
      seo: { title: "عادات تريح ظهرك في العمل المكتبي | تاج الأصحاء", description: "خمس عادات بسيطة تخفف الحمل عن ظهرك ورقبتك في يوم العمل، ومتى تحتاج تقييمًا من أخصائي العلاج الطبيعي.", focus: "ألم الظهر من الجلوس" },
      demo: true,
    },
    {
      id: "post-first-visit",
      slug: "first-visit",
      title: "ماذا يحدث في زيارتك الأولى للعلاج الطبيعي؟",
      excerpt: "من الاستقبال إلى الخطة المكتوبة: ما يجري في التقييم الأول، وماذا تحضر معك.",
      category: "قبل زيارتك",
      tags: ["التقييم", "الزيارة الأولى"],
      cover: "/photos/reception-960.webp",
      blocks: [
        b("p", "كثيرون يترددون في الحجز لأنهم لا يعرفون ما ينتظرهم. هذا ما يحدث في زيارتك الأولى، خطوة بخطوة."),
        b("h2", "نستمع إليك أولًا"),
        b("p", "نسألك عن ألمك: أين هو، ومتى بدأ، وما الذي يزيده أو يخففه، وعن صحتك وأدويتك. ونسألك أيضًا عما تريد العودة إليه."),
        b("h2", "نفحص حركتك"),
        b("p", "نفحص مدى الحركة وقوة العضلات وطريقة المشي، ونراجع تقاريرك وأشعتك إن وُجدت."),
        b("h2", "تخرج بخطة مكتوبة"),
        b("p", "نشرح لك ما وجدناه، ونتفق معك على أهداف واضحة وعدد تقديري للجلسات، ونراجعها كلما تقدّمت."),
        b("quote", "لا نبدأ العلاج قبل أن نفهم حالتك ونشرح لك ما وجدناه."),
        b("h3", "ماذا تحضر معك؟"),
        b("list", "", ["أي تقارير أو أشعة سابقة", "قائمة بأدويتك", "ملابس رياضية مريحة"]),
        b("cta", "احجز تقييمك الأول"),
      ],
      status: "published",
      author: "فريق المحتوى",
      createdAt: day(4),
      updatedAt: day(3),
      seo: { title: "زيارتك الأولى للعلاج الطبيعي في المدينة | تاج الأصحاء", description: "ما يحدث في التقييم الأول للعلاج الطبيعي، وماذا تحضر معك، وكيف تُكتب خطتك.", focus: "الزيارة الأولى للعلاج الطبيعي" },
      demo: true,
    },
    {
      id: "post-alterg",
      slug: "walking-after-knee-surgery",
      title: "المشي بعد عملية الركبة: لماذا نبدأ بجزء من وزنك؟",
      excerpt: "جهاز AlterG يرفع جزءًا من وزنك بضغط الهواء، فتمشي بخطوات طبيعية وحِمل أخف على ركبتك.",
      category: "الأجهزة",
      tags: ["AlterG", "الركبة", "بعد العمليات"],
      cover: "/devices/alterg-800.webp",
      blocks: [
        b("p", "بعد عملية الركبة يطلب الجرّاح غالبًا أن تعود إلى المشي تدريجيًا. هنا يساعد جهاز AlterG: يرفع جزءًا من وزنك، حتى 80%، بضغط الهواء."),
        b("h2", "كيف يعمل؟"),
        b("p", "ترتدي سروالًا خاصًا يُثبَّت بغرفة هواء حول الجهاز. يضبط الأخصائي النسبة، فتمشي بخطوات طبيعية بوزن أخف."),
        b("callout", "يحدد الأخصائي النسبة المناسبة لحالتك بالتنسيق مع تعليمات جرّاحك، ثم يرفعها تدريجيًا."),
      ],
      status: "draft",
      author: "إدارة المركز",
      createdAt: day(1),
      updatedAt: day(1),
      seo: { title: "", description: "", focus: "المشي بعد عملية الركبة" },
      demo: true,
    },
  ];
}

function demoReviews(now: Date): Review[] {
  const day = (n: number) => new Date(now.getTime() - n * 864e5).toISOString();
  return [
    ...stories.map((s, i): Review => ({
      id: `rv-${i + 1}`,
      name: s.name,
      context: s.context,
      text: s.quote,
      rating: 5,
      status: "approved",
      source: "site",
      consent: false,
      createdAt: day(20 - i * 4),
      demo: true,
    })),
    { id: "rv-4", name: "مراجعة", context: "آلام الرقبة", text: "الأخصائية شرحت لي التمارين بهدوء وتابعتني على واتساب بين الجلسات.", rating: 5, status: "pending", source: "whatsapp", consent: true, createdAt: day(2), demo: true },
    { id: "rv-5", name: "مراجع", context: "إصابة رياضية", text: "المكان نظيف والمواعيد دقيقة، وتمنيت لو كانت المواقف أوسع.", rating: 4, status: "pending", source: "google", consent: false, createdAt: day(1), demo: true },
  ];
}

function builtInMedia(now: string): MediaItem[] {
  const photos = centerPhotos.map((p): MediaItem => ({ id: `photo-${p.id}`, name: `${p.id}.webp`, src: `/photos/${p.id}-960.webp`, kind: "photo", width: 960, alt: p.alt, createdAt: now, builtIn: true }));
  const devs = devices.map((d): MediaItem => ({ id: `device-${d.id}`, name: `${d.image.id}.webp`, src: `/devices/${d.image.id}-${d.image.widths[d.image.widths.length - 1]}.webp`, kind: "device", width: d.image.widths[d.image.widths.length - 1], alt: d.name, createdAt: now, builtIn: true }));
  const icons = [...new Set(programs.map((p) => p.icon3d))].map((n): MediaItem => ({ id: `icon-${n}`, name: `${n}.webp`, src: `/icons3d/${n}.webp`, kind: "icon", width: 256, height: 256, alt: "", createdAt: now, builtIn: true }));
  return [...photos, ...devs, ...icons];
}

export function buildDefaults(): CmsState {
  const now = new Date();
  const nowIso = now.toISOString();
  const spec = site.openingHoursSpec[0];
  const plugins: CmsState["plugins"] = {};
  for (const p of PLUGINS) plugins[p.id] = { installed: p.installed, active: p.active, settings: clone(p.settings) };
  plugins.smtp.settings.email = site.contact.email;

  return {
    v: 1,
    createdAt: nowIso,
    site: {
      isDemo: site.isDemo,
      name: site.name,
      fullName: site.fullName,
      tagline: site.tagline,
      city: site.city,
      contact: clone(site.contact),
      responseTimeMinutes: site.responseTimeMinutes,
      hours: { opens: spec?.opens ?? "10:00", closes: spec?.closes ?? "23:00", days: clone(spec?.days ?? []) },
      address: site.branches[0]?.address ?? "",
      social: clone(site.social),
      offer: clone(site.offer),
      stats: clone(site.stats),
      features: clone(site.features),
      insurers: clone(site.insurers),
      license: clone(site.license),
      rating: clone(site.rating),
    },
    copy: clone(copy) as CmsState["copy"],
    homeSections: clone(homeSections),
    programs: programs.map((p) => ({
      id: p.id,
      title: p.title,
      short: p.short,
      points: clone(p.points),
      icon3d: p.icon3d,
      track: p.track,
      featured: p.featured,
      intro: p.intro,
      signs: clone(p.signs ?? []),
      approach: clone(p.approach ?? []),
      devices: clone(p.devices ?? []),
      faqs: clone(p.faqs ?? []),
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      status: "published",
    })),
    devices: devices.map((d) => ({
      id: d.id,
      name: d.name,
      model: d.model,
      short: d.short,
      how: d.how,
      feel: d.feel,
      session: d.session,
      course: d.course,
      badge: d.badge,
      mdma: d.mdma ?? "",
      treats: clone(d.treats),
      features: clone(d.features),
    })),
    faqs: clone(faqs),
    posts: demoPosts(now),
    leads: demoLeads(now),
    media: builtInMedia(nowIso),
    users: [
      { id: "u-admin", name: "إدارة المركز", email: "admin@tajalasehaa.sa", role: "admin", twoFactor: true, lastLogin: nowIso },
      { id: "u-editor", name: "فريق المحتوى", email: "content@tajalasehaa.sa", role: "editor" },
      { id: "u-reception", name: "الاستقبال", email: "reception@tajalasehaa.sa", role: "reception" },
      { id: "u-marketing", name: "التسويق", email: "marketing@tajalasehaa.sa", role: "marketing" },
    ],
    reviews: demoReviews(now),
    redirects: [
      { id: "r1", from: "/about-us", to: "/about", code: 301, hits: 0, note: "من الموقع القديم", server: true },
      { id: "r2", from: "/optional-home-physiotherapy", to: "/programs/home", code: 301, hits: 0, note: "من الموقع القديم", server: true },
      { id: "r3", from: "/techniques-technologies", to: "/devices", code: 301, hits: 0, note: "من الموقع القديم", server: true },
      { id: "r4", from: "/advanced-rehab-tech", to: "/devices", code: 301, hits: 0, note: "من الموقع القديم", server: true },
      { id: "r5", from: "/alterg", to: "/devices/antigravity", code: 302, hits: 0, note: "رابط قصير للمطبوعات ورمز QR" },
    ],
    menus: { header: [...NAV.map((n) => ({ href: n.href, label: n.label })), { href: "/blog", label: "المقالات" }] },
    theme: { preset: "logo", brand: "#0c8456", navy: "#24475d", radius: 1.5 },
    plugins,
    seo: {},
    activity: [
      { id: uid("a"), at: nowIso, user: "النظام", action: "أُعدّت نسخة العرض من محتوى الموقع الحالي" },
      { id: uid("a"), at: new Date(now.getTime() - 864e5).toISOString(), user: "إدارة المركز", action: "حفظ مسودة مقال", target: "المشي بعد عملية الركبة" },
      { id: uid("a"), at: new Date(now.getTime() - 3 * 864e5).toISOString(), user: "فريق المحتوى", action: "نشر مقالًا", target: "ماذا يحدث في زيارتك الأولى للعلاج الطبيعي؟" },
    ],
    notFound: [],
    backups: [1, 2, 3].map((n) => ({ id: uid("bk"), at: new Date(now.getTime() - n * 864e5 + 3 * 3600_000).toISOString(), size: 182_000 + n * 3100, kind: "auto" as const })),
  };
}
