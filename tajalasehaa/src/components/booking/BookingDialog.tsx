import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { site } from "@/config/site";
import { CrownMark } from "@/components/ui/Icons";
import { BookingWizard } from "./BookingWizard";
import type { BookingPrefill } from "./BookingContext";

/** Accessible modal (bottom sheet on phones) hosting the booking wizard. */
export default function BookingDialog({ prefill, onClose }: { prefill: BookingPrefill | null; onClose: () => void }) {
  const open = prefill !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("input, button")?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      root.style.overflow = prevOverflow;
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    open ? (
      <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
        <div className="absolute inset-0 animate-[fade-in_0.25s_ease] bg-deep/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          className="relative max-h-[92dvh] w-full animate-[sheet-in_0.32s_cubic-bezier(0.2,0.7,0.2,1)] overflow-y-auto rounded-t-[1.75rem] bg-sand-50 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-xl sm:rounded-[1.75rem] sm:p-8"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CrownMark size={36} />
              <div>
                <h2 id="booking-title" className="text-lg font-bold leading-tight">
                  احجز تقييمك في {site.name}
                </h2>
                <p className="text-sm text-muted">أقل من دقيقة · بدون أي التزام</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-sand-200" aria-label="إغلاق">
              <X size={20} aria-hidden />
            </button>
          </div>
          <BookingWizard prefill={prefill} onDone={onClose} />
        </div>
      </div>
    ) : null,
    document.body,
  );
}
