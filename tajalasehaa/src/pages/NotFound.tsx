import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CrownMark } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <>
      <Header overDark={false} />
      <main id="main" className="grid min-h-[70vh] place-items-center bg-sand-50 px-4 pt-28 text-center">
        <div>
          <CrownMark size={64} className="mx-auto" />
          <h1 className="mt-6 text-3xl font-bold">الصفحة غير موجودة</h1>
          <p className="mt-3 text-muted">ربما تغيّر الرابط. يمكنك العودة للرئيسية أو حجز تقييمك مباشرة.</p>
          <a href="/" className="btn btn-primary mt-8">
            العودة للرئيسية
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
