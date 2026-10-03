import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { trackEngagement } from "@/lib/tracking";

export type BookingPrefill = {
  complaint?: string;
  mode?: "clinic" | "home";
  /** where the booking was opened from — stored with the lead */
  placement: string;
};

type Ctx = {
  openBooking: (prefill: BookingPrefill) => void;
};

const BookingCtx = createContext<Ctx>({ openBooking: () => {} });

const BookingDialog = lazy(() => import("./BookingDialog"));

export function BookingProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<BookingPrefill | null>(null);
  const [openCount, setOpenCount] = useState(0);

  const openBooking = useCallback((p: BookingPrefill) => {
    setPrefill(p);
    setOpenCount((n) => n + 1);
    trackEngagement("booking_open", { placement: p.placement });
  }, []);

  const close = useCallback(() => setPrefill(null), []);
  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingCtx.Provider value={value}>
      {children}
      {openCount > 0 ? (
        <Suspense fallback={null}>
          <BookingDialog prefill={prefill} onClose={close} />
        </Suspense>
      ) : null}
    </BookingCtx.Provider>
  );
}

export const useBooking = () => useContext(BookingCtx);
