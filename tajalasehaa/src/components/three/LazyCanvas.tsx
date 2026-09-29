import { Component, Suspense, useCallback, useState, type ErrorInfo, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { useMounted, usePrefersReducedMotion } from "@/hooks/useClient";

/**
 * Wrapper for every 3D scene:
 * - never renders WebGL on the server (the poster is in the SSR HTML)
 * - mounts only when the section is near the viewport, pauses when hidden
 * - requires WebGL2 (three.js ≥ r163) and falls back to the poster on errors
 */

export type SceneBaseProps = {
  /** false while the section is off-screen → scene should stop rendering */
  active: boolean;
  reducedMotion: boolean;
  onReady: () => void;
};

let webgl2: boolean | null = null;
function hasWebGL2() {
  if (webgl2 !== null) return webgl2;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    webgl2 = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl2 = false;
  }
  return webgl2;
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[3D] scene disabled:", error.message, info.componentStack?.split("\n")[1]?.trim());
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function LazyCanvas({
  children,
  poster,
  /** must include a positioning class (relative/absolute) and a height */
  className = "relative",
  rootMargin = "300px",
}: {
  children: (base: SceneBaseProps) => ReactNode;
  poster: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const mounted = useMounted();
  const reducedMotion = usePrefersReducedMotion();
  const { ref, near, visible } = useInView<HTMLDivElement>(rootMargin);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  const canRender = mounted && near && !failed && hasWebGL2();

  return (
    <div ref={ref} className={className}>
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${ready && !failed ? "opacity-0" : "opacity-100"}`}
        aria-hidden
      >
        {poster}
      </div>
      {canRender ? (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <SceneErrorBoundary onError={onError}>
            <Suspense fallback={null}>{children({ active: visible, reducedMotion, onReady })}</Suspense>
          </SceneErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}
