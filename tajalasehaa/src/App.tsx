import { useEffect, useRef } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import { BookingProvider } from "@/components/booking/BookingContext";
import { captureAttribution } from "@/lib/attribution";
import { flushLeadQueue } from "@/lib/lead";
import { initTracking, trackPageView } from "@/lib/tracking";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import ThankYou from "@/pages/ThankYou";
import { routeMeta } from "@/seo";

/** One-time client setup + per-route title, page view and scroll reset. */
function Effects() {
  const [location] = useLocation();
  const first = useRef(true);

  useEffect(() => {
    captureAttribution();
    initTracking();
    void flushLeadQueue();
  }, []);

  useEffect(() => {
    const meta = routeMeta(location);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    trackPageView(location);
    if (!first.current && !window.location.hash) window.scrollTo({ top: 0 });
    first.current = false;
  }, [location]);

  return null;
}

export default function App({ ssrPath }: { ssrPath?: string }) {
  return (
    <Router ssrPath={ssrPath}>
      <BookingProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
        >
          تخطَّ إلى المحتوى
        </a>
        <Effects />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/lp/:slug">{(params) => <Landing slug={params.slug} />}</Route>
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/privacy" component={Privacy} />
          <Route component={NotFound} />
        </Switch>
      </BookingProvider>
    </Router>
  );
}
