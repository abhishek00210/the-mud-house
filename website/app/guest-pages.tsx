import { BookingRequestPage } from "./booking-request";
import { useEffect } from "react";
import { GalleryPage } from "./guest-gallery";
import { ExploreVaranasiPage } from "./guest-city";
import { ContactPage } from "./guest-contact";
import { FAQsPage } from "./guest-faqs";
import { PolicyPage } from "./guest-policy";
import { isPolicySlug } from "./guest-policy-data";
import { GuestNotFound } from "./guest-shared";
import type { GuestRoute } from "./guest-routes";

export default function GuestPage({ route }: { route: GuestRoute }) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const hash = window.location.hash.slice(1);
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [route]);
  if (route === "/booking") return <BookingRequestPage />;
  if (route === "/gallery") return <GalleryPage />;
  if (route === "/contact") return <ContactPage />;
  if (route === "/faqs") return <FAQsPage />;
  if (route === "/explore-varanasi") return <ExploreVaranasiPage />;
  const slug = route.slice(1);
  return isPolicySlug(slug) ? <PolicyPage slug={slug} /> : <GuestNotFound />;
}
