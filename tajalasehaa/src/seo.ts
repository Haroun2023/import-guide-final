import { campaignBySlug, campaigns } from "./config/campaigns";
import { centerPhotos, programs } from "./config/content";
import { site } from "./config/site";

export type RouteMeta = { title: string; description: string; noindex?: boolean };

export function routeMeta(path: string): RouteMeta {
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
  if (path === "/thank-you") {
    return { title: `تم استلام طلبك | ${site.name}`, description: "شكرًا لتواصلك معنا، سيتصل بك فريقنا قريبًا لتأكيد الموعد.", noindex: true };
  }
  if (path === "/privacy") {
    return { title: `سياسة الخصوصية | ${site.name}`, description: `كيف يجمع ${site.name} بياناتك ويستخدمها ويحميها وفق نظام حماية البيانات الشخصية.` };
  }
  return { title: `الصفحة غير موجودة | ${site.name}`, description: "", noindex: true };
}

export const prerenderRoutes = ["/", "/privacy", "/thank-you", ...campaigns.map((c) => `/lp/${c.slug}`)];

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
