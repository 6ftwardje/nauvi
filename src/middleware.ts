import { NextResponse, type NextRequest } from "next/server";

/**
 * Only the production hosts may be indexed. Branch deploys (seo-legal-p1p2--nauvi.netlify.app),
 * deploy permalinks and local servers answer with X-Robots-Tag: noindex, nofollow.
 */
const indexableHosts = ["nauvi.ai", "www.nauvi.ai"];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const host = (request.headers.get("host") ?? "").toLowerCase().replace(/:\d+$/, "");
  if (!indexableHosts.includes(host)) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
