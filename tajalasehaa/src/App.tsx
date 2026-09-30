import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import { BookingProvider } from "@/components/booking/BookingContext";
import { captureAttribution } from "@/lib/attribution";
import { flushLeadQueue } from "@/lib/lead";
import { initTracking, trackPageView } from "@/lib/tracking";
import AboutPage from "@/pages/AboutPage";
import BookPage from "@/pages/BookPage";
import ConditionsPage from "@/pages/ConditionsPage";
import DevicesPage from "@/pages/DevicesPage";
import FaqPage from "@/pages/FaqPage";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import ProgramPage from "@/pages/ProgramPage";
import ProgramsPage from "@/pages/ProgramsPage";
import ThankYou from "@/pages/ThankYou";
import VisitPage from "@/pages/VisitPage";
import { routeMeta } from "@/seo";

/** Articles from the demo CMS (only where it is open; see src/cms/Blog.tsx). */
const Blog = lazy(() => import("@/cms/Blog"));

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
    // New page: start at the top (unless jumping to a section, or the page only
    // synced its URL, e.g. picking another device on /devices/<id>).
    const keepScroll = (history.state as { keepScroll?: boolean } | null)?.keepScroll;
    if (!first.current && !window.location.hash && !keepScroll) window.scrollTo({ top: 0 });
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
          <Route path="/programs" component={ProgramsPage} />
          <Route path="/programs/:id">{(params) => <ProgramPage id={params.id} />}</Route>
          <Route path="/devices/:id?">{(params) => <DevicesPage id={params.id} />}</Route>
          <Route path="/conditions" component={ConditionsPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/visit" component={VisitPage} />
          <Route path="/faq" component={FaqPage} />
          <Route path="/book" component={BookPage} />
          <Route path="/lp/:slug">{(params) => <Landing slug={params.slug} />}</Route>
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/blog/:slug?">
            {(params) => (
              <Suspense fallback={null}>
                <Blog slug={params.slug} />
              </Suspense>
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </BookingProvider>
    </Router>
  );
}
