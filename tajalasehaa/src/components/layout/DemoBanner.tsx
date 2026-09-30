import { site } from "@/config/site";

/** Visible while `site.isDemo` is true, so unverified data never ships silently. */
export function DemoBanner() {
  if (!site.isDemo) return null;
  return (
    <div className="relative z-[60] bg-leaf-200 px-4 py-1.5 text-center text-[0.78rem] font-medium text-leaf-700">
      نسخة عرض — بعض البيانات بانتظار اعتماد المركز
      <span className="hidden sm:inline">
        {" "}
        (راجع <span dir="ltr">src/config/site.ts</span>)
      </span>
    </div>
  );
}
