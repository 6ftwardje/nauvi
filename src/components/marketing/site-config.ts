/** Public marketing configuration for the appointment area. */
export const marketingConfig = {
  calendlyUrl: "https://calendly.com/ward-janssen2020/30min?hide_event_type_details=1&hide_gdpr_banner=1",
  hostName: "Kjartan",
  hostPortrait: "/marketing/portraits/kjartan.webp",
};

export function calendlyEmbedUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "calendly.com" || url.username || url.password || url.pathname === "/") return;
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("embed_type", "Inline");
    if (typeof window !== "undefined") url.searchParams.set("embed_domain", window.location.host);
    url.searchParams.set("primary_color", "1768e7");
    return url.toString();
  } catch { return; }
}
