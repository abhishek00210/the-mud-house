import { imageOverride, mediaById } from "./client";

export function ManagedImage({ slot, mediaId, alt, className = "" }: { slot?: string; mediaId?: string; alt?: string; className?: string }) {
  const image = mediaById(mediaId) || (slot ? imageOverride(slot) : null);
  return image ? <img className={`managed-image ${className}`} src={image.url} alt={image.alt || alt || ""} style={{ objectFit: "cover", objectPosition: "position" in image ? String(image.position) : "center", width: "100%", height: "100%", display: "block" }} /> : null;
}
export function hasManagedImage(slot: string, mediaId?: string) { return !!(mediaById(mediaId) || imageOverride(slot)); }
