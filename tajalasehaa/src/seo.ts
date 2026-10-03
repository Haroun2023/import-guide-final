import { campaignBySlug, campaigns } from "./config/campaigns";
import { centerPhotos, faqs, programById, programs } from "./config/content";
import { devices } from "./config/devices";
import { site } from "./config/site";

export type RouteMeta = { title: string; description: string; noindex?: boolean };

/** Titles and descriptions set in the CMS (demo browsers only; empty on the server). */
export const seoOverrides: Record<string, { title?: string; description?: string }> = {};

export function routeMeta(path: string): RouteMeta {
  const base = baseMeta(path);
  const o = seoOverrides[path];
  if (!o) return base;
  return { ...base, ...(o.title ? { title: o.title } : {}), ...(o.description ? { description: o.description } : {}) };
}

function baseMeta(path: string): RouteMeta {
  if (path === "/") {
    return {
      title: `${site.name} | علاج طبيعي وتأهيل طبي في ${site.city}`,
      description: `${site.fullName}: تقييم شامل وخطة تأهيل شخصية بأجهزة عالمية منها AlterG المضاد للجاذبية، مع أخصائيات لصحة المرأة وعلاج طبيعي منزلي. احجز تقييمك الآن.`,
    };
  }
  const lp = path.match(/^\/lp\/([^/]+)$/);
  if (lp) {
    const c = campaignBySlug(lp[1]);
    if (c) return { title: c.seoTitle, description: c.seoDescription };
  }
  if (path === "/programs") {
    return {
      title: `البرامج العلاجية في ${site.city} | ${site.name}`,
      description: `برامج علاج طبيعي وتأهيل في ${site.city}: الظهر والرقبة، المفاصل، الإصابات الرياضية، ما بعد العمليات، صحة المرأة، والعلاج المنزلي. كل برنامج يبدأ بتقييم وخطة مكتوبة.`,
    };
  }
  const prog = path.match(/^\/programs\/([^/]+)$/);
  if (prog) {
    const p = programById(prog[1]);
    if (p) return { title: p.seoTitle ?? `${p.title} في ${site.city} | ${site.name}`, description: p.seoDescription ?? p.short };
  }
  if (path === "/devices") {
    return {
      title: `أجهزة العلاج الطبيعي والتأهيل | ${site.name}`,
      description: `تعرّف على أجهزتنا في ${site.city} بصور حقيقية: المشي المضاد للجاذبية AlterG، والموجات التصادمية، والعلاج الكهربائي، وعلاج الظهر بالتحفيز والحرارة.`,
    };
  }
  const dev = path.match(/^\/devices\/([^/]+)$/);
  if (dev) {
    const d = devices.find((x) => x.id === dev[1]);
    if (d) return { title: `${d.name} في ${site.city} | ${site.name}`, description: `${d.short} تعرّف على مزاياه ومدة جلسته وما تشعر به أثناءها.` };
  }
  if (path === "/conditions") {
    return {
      title: `أين يؤلمك؟ الحالات التي نعالجها | ${site.name}`,
      description: `حدّد موضع الألم على مجسّم تفاعلي، واعرف الحالات الشائعة في الظهر والرقبة والركبة والكتف وغيرها، وكيف نبدأ علاجها في ${site.city}.`,
    };
  }
  if (path === "/about") {
    return { title: `من نحن | ${site.name}`, description: `${site.fullName} في ${site.city}، الفرع السعودي لمجموعة ${site.partner.name}. تعرّف على قصتنا وفريقنا ووعودنا لك.` };
  }
  if (path === "/visit") {
    return {
      title: `العنوان وأوقات العمل وصور المركز | ${site.name}`,
      description: `${site.branches[0]?.address ?? site.city}. الاتجاهات في خرائط Google، وأوقات العمل، وصور حقيقية من المركز، وطرق التواصل.`,
    };
  }
  if (path === "/faq") {
    return { title: `الأسئلة الشائعة | ${site.name}`, description: `إجابات عن التقييم الأول، وعدد الجلسات، والتأمين، والأخصائيات، والعلاج المنزلي، وبرنامج المعتمرين في ${site.name}.` };
  }
  if (path === "/book") {
    return { title: `احجز تقييمك | ${site.name}`, description: `احجز تقييمك في ${site.name} بالمدينة المنورة خلال أقل من دقيقة، ونتصل بك خلال ${site.responseTimeMinutes} دقيقة في أوقات العمل.` };
  }
  if (path === "/thank-you") {
    return { title: `تم استلام طلبك | ${site.name}`, description: "شكرًا لتواصلك معنا، سيتصل بك فريقنا قريبًا لتأكيد الموعد.", noindex: true };
  }
  if (path === "/privacy") {
    return { title: `سياسة الخصوصية | ${site.name}`, description: `كيف يجمع ${site.name} بياناتك ويستخدمها ويحميها وفق نظام حماية البيانات الشخصية.` };
  }
  return { title: `الصفحة غير موجودة | ${site.name}`, description: "", noindex: true };
}

export const prerenderRoutes = [
  "/",
  "/programs",
  ...programs.map((p) => `/programs/${p.id}`),
  "/devices",
  ...devices.map((d) => `/devices/${d.id}`),
  "/conditions",
  "/about",
  "/visit",
  "/faq",
  "/book",
  "/privacy",
  "/thank-you",
  ...campaigns.map((c) => `/lp/${c.slug}`),
];

/** Breadcrumb trail (schema.org) for inner pages. */
function breadcrumbs(path: string) {
  const parts = path.split("/").filter(Boolean);
  if (!parts.length || parts[0] === "lp") return null;
  const names: Record<string, string> = { programs: "البرامج", devices: "الأجهزة", conditions: "أين يؤلمك؟", about: "من نحن", visit: "زُر مركزنا", faq: "الأسئلة الشائعة", book: "احجز تقييمك", privacy: "سياسة الخصوصية" };
  const items = [{ name: site.name, url: `${site.url}/` }];
  let acc = "";
  for (const [i, seg] of parts.entries()) {
    acc += `/${seg}`;
    const name =
      i === 0 ? names[seg] : parts[0] === "programs" ? programById(seg)?.title : parts[0] === "devices" ? devices.find((d) => d.id === seg)?.name : undefined;
    if (!name) return null;
    items.push({ name, url: `${site.url}${acc}` });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

const faqPage = (list: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

/** All structured data blocks for a route. */
export function jsonLdFor(path: string): object[] {
  const out: object[] = [];
  if (path === "/" || path === "/about" || path === "/visit" || path.startsWith("/lp/")) out.push(jsonLd());
  if (path === "/faq") out.push(faqPage(faqs));
  const prog = path.match(/^\/programs\/([^/]+)$/);
  const p = prog ? programById(prog[1]) : undefined;
  if (p?.faqs?.length) out.push(faqPage(p.faqs));
  const crumbs = breadcrumbs(path);
  if (crumbs) out.push(crumbs);
  return out;
}

/** Structured data for local search (schema.org MedicalClinic). */
export function jsonLd() {
  const branch = site.branches[0];
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${site.url}/#clinic`,
    name: site.fullName,
    alternateName: [site.name, site.nameEn],
    url: site.url,
    telephone: site.contact.phoneE164,
    image: [`${site.url}/og.jpg`, ...centerPhotos.map((p) => `${site.url}/photos/${p.id}-${p.widths[p.widths.length - 1]}.webp`)],
    logo: `${site.url}/brand/logo.png`,
    medicalSpecialty: ["Physiotherapy", "Musculoskeletal"],
    address: {
      "@type": "PostalAddress",
      streetAddress: [branch?.street, branch?.district].filter(Boolean).join("، ") || branch?.address,
      addressLocality: site.city,
      postalCode: branch?.postalCode,
      addressCountry: "SA",
    },
    ...(branch?.mapsUrl ? { hasMap: branch.mapsUrl } : {}),
    ...(branch?.geo ? { geo: { "@type": "GeoCoordinates", latitude: branch.geo.lat, longitude: branch.geo.lng } } : {}),
    openingHoursSpecification: site.openingHoursSpec.map((o) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: o.days,
      opens: o.opens,
      closes: o.closes,
    })),
    availableService: programs
      .filter((p) => p.track === "rehab")
      .map((p) => ({ "@type": "MedicalTherapy", name: p.title, description: p.short })),
    areaServed: { "@type": "City", name: site.city },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}
