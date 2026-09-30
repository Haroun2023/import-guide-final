import { useEffect } from "react";
import { Link } from "wouter";
import { cmsRuntime } from "@/cms/flag";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NAV } from "@/components/layout/nav";
import { BrandMark } from "@/components/ui/Logo";

export default function NotFound() {
  // Demo CMS: record the broken link for the redirects plugin's 404 log
  useEffect(() => {
    if (cmsRuntime.active) void import("@/cms/capture").then((m) => m.log404(location.pathname));
  }, []);
  return (
    <>
      <Header overDark={false} />
      <main id="main" className="grid min-h-[70vh] place-items-center bg-mist-50 px-4 pb-16 pt-28 text-center">
        <div>
          <BrandMark size={64} className="mx-auto" />
          <h1 className="mt-6 text-3xl font-bold">الصفحة غير موجودة</h1>
          <p className="mt-3 text-muted">يبدو أن هذه الصفحة انتقلت أو لم تعد موجودة. عد إلى الرئيسية، أو احجز تقييمك مباشرة.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/book" className="btn btn-primary">
              احجز تقييمك
            </Link>
            <Link href="/" className="btn btn-ghost">
              العودة للرئيسية
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="chip">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
