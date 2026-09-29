import { site } from "@/config/site";
import { CrownMark } from "./Icons";

export function Logo({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label={site.fullName}>
      <CrownMark size={compact ? 34 : 40} />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.2rem] font-bold tracking-tight ${tone === "light" ? "text-white" : "text-ink"}`}>{site.name}</span>
        <span
          dir="ltr"
          className={`mt-1 text-[0.58rem] font-medium uppercase tracking-[0.22em] ${tone === "light" ? "text-gold-300/80" : "text-gold-600"}`}
        >
          Taj Al-Asehaa · Rehab
        </span>
      </span>
    </span>
  );
}
