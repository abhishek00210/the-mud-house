import { getSite, mediaById } from "../cms/client";
import "./site-brand.css";

export function SiteBrand({ className = "" }: { className?: string; location?: string }) {
  const settings = getSite()?.settings;
  const customLogo = mediaById(settings?.logoMediaId);
  return (
    <a className={`brand site-brand ${className}`} href="/" aria-label={`${settings?.name || "The Mud House"} home`}>
      <img
        className="site-brand-image"
        src={customLogo?.url || "/images/the-mud-house-logo.svg"}
        alt={customLogo ? settings?.name || "The Mud House" : "The Mud House by Aditi"}
        width="940"
        height="770"
      />
    </a>
  );
}
