const privateHeaders = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
};

export function GET(request: Request) {
  const configuredUrl = process.env.SYNAPS_APP_URL?.trim() ?? "";
  const target = URL.canParse(configuredUrl) ? new URL(configuredUrl) : undefined;
  const incoming = new URL(request.url);

  if (!target || !["http:", "https:"].includes(target.protocol) || target.username || target.password || target.origin === incoming.origin) {
    return new Response("De Synaps-omgeving is hier nog niet gekoppeld.", {
      status: 503,
      headers: { ...privateHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  for (const key of ["invite", "token"]) {
    const values = incoming.searchParams.getAll(key);
    if (values.length === 1 && values[0]) target.searchParams.set(key, values[0]);
  }

  return new Response(null, { status: 307, headers: { ...privateHeaders, Location: target.href } });
}
