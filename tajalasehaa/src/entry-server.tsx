import { renderToString } from "react-dom/server";
import App from "./App";

export { site } from "./config/site";
export { jsonLdFor, prerenderRoutes, routeMeta } from "./seo";

/** Used by scripts/prerender.mjs to produce static HTML for every route. */
export function render(url: string) {
  return renderToString(<App ssrPath={url} />);
}
