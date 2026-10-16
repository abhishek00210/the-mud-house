import type { BookingInput, CmsState } from "./types";

let site: CmsState | null = null;
export function getSite() { return site; }
export async function loadSite() {
  const response = await fetch("/api/site", { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error("The hotel service is unavailable. Please refresh or try again shortly.");
  site = await response.json() as CmsState;
  const root = document.documentElement;
  root.style.setProperty("--wine", site.settings.accentColor);
  root.style.setProperty("--cream", site.settings.backgroundColor);
  root.style.setProperty("--cms-accent", site.settings.accentColor);
  root.style.setProperty("--cms-background", site.settings.backgroundColor);
  return site;
}
export function cmsText(key: string, fallback: string) {
  if (site?.content[key] !== undefined) return site.content[key];
  if (site && fallback === "The Mud House") return site.settings.name;
  if (site && fallback.trim() === "hello@themudhouse.in") return site.settings.email;
  if (site?.settings.phone && /^Phone number to confirm\.?$/.test(fallback)) return site.settings.phone;
  return fallback;
}
export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN",{style:"currency",currency:site?.settings.currency || "INR",maximumFractionDigits:0}).format(value);
}
export function imageOverride(slot: string) {
  const override = site?.images[slot];
  const media = override && site?.media.find((item) => item.id === override.mediaId);
  return media ? { ...media, alt: override.alt || media.alt, position: override.position || "center" } : null;
}
export function mediaById(id?: string) { return site?.media.find((item) => item.id === id); }
export async function submitBooking(input: BookingInput): Promise<{ id: string; reference: string; status: string }> {
  const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input), signal: AbortSignal.timeout(20000) });
  const body = await response.json().catch(() => ({ error: "The request could not be sent. Please try again." }));
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : body.error?.message || body.message || "The request could not be sent.");
  return body;
}
