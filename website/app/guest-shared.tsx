import { cmsText } from "../cms/client";
import type { ReactNode } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AboutPhoto } from "./about";
import { RoomPhoto, type RoomPhotoName } from "./rooms-data";
import { RestaurantPhoto, type RestaurantPhotoName } from "./restaurant-data";
import { TravelPhoto, type TravelPhotoName } from "./travel-data";
import { ExperiencePhoto, type ExperiencePhotoName } from "./experience-data";
import "./guest-shared.css";

export function GuestPhoto({ source, name, alt, className = "" }: {
  source: "about" | "rooms" | "restaurant" | "travel" | "experience";
  name: string; alt?: string; className?: string;
}) {
  const props = { alt, className: `guest-photo ${className}` };
  if (source === "about") return <AboutPhoto name={name} {...props} />;
  if (source === "rooms") return <RoomPhoto name={name as RoomPhotoName} {...props} />;
  if (source === "restaurant") return <RestaurantPhoto name={name as RestaurantPhotoName} {...props} />;
  if (source === "travel") return <TravelPhoto name={name as TravelPhotoName} {...props} />;
  return <ExperiencePhoto name={name as ExperiencePhotoName} {...props} />;
}

export function GuestBreadcrumb({ current }: { current: string }) {
  return <nav className="guest-container guest-breadcrumb" aria-label="Breadcrumb"><a href="/">{cmsText("guest-shared:3a78695388b3", "Home")}</a><ChevronRight aria-hidden="true" /><span aria-current="page">{current}</span></nav>;
}

export function GuestHero({ eyebrow, title, description, photo, children, compact = false }: {
  eyebrow: string; title: ReactNode; description: string; photo?: ReactNode; children?: ReactNode; compact?: boolean;
}) {
  return <section className={`guest-hero ${compact ? "guest-hero--compact" : ""} ${photo ? "" : "guest-hero--text"}`}>
    <div className="guest-container guest-hero-inner">
      <div className="guest-hero-copy"><p className="guest-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="guest-hero-description">{description}</p>{children && <div className="guest-hero-actions">{children}</div>}</div>
      {photo && <div className="guest-hero-photo">{photo}</div>}
    </div>
  </section>;
}

export function GuestCTA({ title, description, href, label }: { title: string; description: string; href: string; label: string }) {
  return <section className="guest-cta"><div className="guest-container guest-cta-inner"><div><p className="guest-eyebrow">{cmsText("guest-shared:fedc0f2627b6", "YOUR NEXT CHAPTER IN KASHI")}</p><h2>{title}</h2><p>{description}</p></div><a className="guest-button" href={href}>{label}<ArrowRight aria-hidden="true" /></a></div></section>;
}

export function GuestFooter({ brand }: { brand: ReactNode }) {
  return <footer className="guest-footer"><div className="guest-container guest-footer-main">
    <div className="guest-footer-brand">{brand}<p>{cmsText("guest-shared:46c219dacca3", "A quieter stay. A deeper Kashi.")}</p><p>{cmsText("guest-shared:60a94ddc49b8", "Warm spaces and thoughtful hospitality in Varanasi.")}</p></div>
    <div><h3>{cmsText("guest-shared:3b73900b8d29", "Explore")}</h3><a href="/rooms">{cmsText("guest-shared:268a8cd16d85", "Rooms & suites")}</a><a href="/restaurant">{cmsText("guest-shared:f9c9ea03b360", "Dining")}</a><a href="/food-menu">{cmsText("guest-shared:c2fd78a33864", "Food menu")}</a><a href="/travel-packages">{cmsText("guest-shared:09d58234caf9", "Travel experiences")}</a><a href="/gallery">{cmsText("guest-shared:352cfc749e55", "Gallery")}</a><a href="/about">{cmsText("guest-shared:c4dba508ea8f", "About our hotel")}</a></div>
    <div><h3>{cmsText("guest-shared:1cb0ba125f84", "Information")}</h3><a href="/faqs">{cmsText("guest-shared:9856b7433f84", "FAQs")}</a><a href="/house-rules">{cmsText("guest-shared:152b8e467b19", "House rules")}</a><a href="/privacy-policy">{cmsText("guest-shared:506ff3946215", "Privacy Policy")}</a><a href="/terms-and-conditions">{cmsText("guest-shared:173f5f9f26b4", "Terms & Conditions")}</a><a href="/cancellation-refund-policy">{cmsText("guest-shared:d5a3fb28c95e", "Cancellation & Refund Policy")}</a></div>
    <div><h3>{cmsText("guest-shared:d3ff4e33d665", "Let’s talk")}</h3><p>{cmsText("guest-shared:fbb0421af070", "Varanasi, Uttar Pradesh, India")}</p><a href="/contact">{cmsText("guest-shared:fff15906a7b4", "Contact & enquiries")}</a><a href="/contact#arrival">{cmsText("guest-shared:468da1e4f075", "Arrival & access")}</a><a href="/explore-varanasi">{cmsText("guest-shared:b00680485f5a", "Explore Varanasi")}</a><p className="guest-note">{cmsText("guest-shared:40cea1a72f10", "Exact address and contact details await confirmation.")}</p></div>
  </div><div className="guest-container guest-footer-bottom"><p>© {new Date().getFullYear()} {cmsText("guest-shared:b25d8d260031", "The Mud House. All rights reserved.")}</p><span>{cmsText("guest-shared:96399b8d4208", "SAME ROOTS. NEW STORIES.")}</span><a href="/admin" className="cms-account-link">{cmsText("guest-shared:a481fe1c7a9a", "Staff login")}</a></div></footer>;
}

export function GuestNotFound() {
  return <main className="guest-page guest-not-found"><GuestHero eyebrow={cmsText("guest-shared:ec1d6b345342", "404 · A SMALL DETOUR")} title={<>{cmsText("guest-shared:eba25bdd3023", "Let’s find your")}<br />{cmsText("guest-shared:db470b4b0a09", "way back.")}</>} description={cmsText("guest-shared:85b5cef1d015", "We couldn’t find the page you’re looking for. There’s still plenty to discover at The Mud House.")} photo={<figure><GuestPhoto source="about" name="entrance" /><figcaption>{cmsText("guest-shared:c531936f74fc", "Concept photography · Illustrative")}</figcaption></figure>}><a className="guest-button" href="/">{cmsText("guest-shared:4b40138e1ae9", "Back to the hotel")}<ArrowRight aria-hidden="true" /></a><a className="guest-button guest-button--outline" href="/contact">{cmsText("guest-shared:47aaf31b83d6", "Contact us")}</a><div className="guest-recovery-links"><a href="/rooms">{cmsText("guest-shared:559aaf6fb9da", "Find a room")}</a><a href="/restaurant">{cmsText("guest-shared:b399ba05c11f", "Discover dining")}</a><a href="/travel-packages">{cmsText("guest-shared:4fd5b40eca36", "Explore Kashi")}</a></div></GuestHero></main>;
}
