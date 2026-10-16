import { cmsText } from "../cms/client";
export const guestRoutes = {
  "/booking": {title:cmsText("guest-routes:8a635639c458", "Booking & Enquiries"),description:cmsText("guest-routes:9eb4c49307af", "Request a room, table or experience with The Mud House. Send your dates and plans directly to the team.")},
  "/gallery": { title: "Gallery", description: cmsText("guest-routes:ffbe8429c4a5", "Explore the rooms, dining spaces and Varanasi inspirations behind The Mud House in our concept photography gallery.") },
  "/contact": { title: cmsText("guest-routes:24e236eeac29", "Contact & Arrival"), description: cmsText("guest-routes:f5ccde1b4b9d", "Plan a stay, a meal or time in Kashi. Contact The Mud House about dates, group visits and arrival or access requirements.") },
  "/faqs": { title: cmsText("guest-routes:a3d458e1bd1e", "Frequently Asked Questions"), description: cmsText("guest-routes:e1771af7d404", "Find answers about rooms, dining, experiences, arrival and enquiries at The Mud House, Varanasi.") },
  "/explore-varanasi": { title: cmsText("guest-routes:b00680485f5a", "Explore Varanasi"), description: cmsText("guest-routes:9f35cf1cda1e", "Get to know Kashi through its riverfront, old lanes and cultural places, then plan an experience with The Mud House.") },
  "/privacy-policy": { title: cmsText("guest-routes:506ff3946215", "Privacy Policy"), description: cmsText("guest-routes:2e886fa848c8", "Understand how this website prepares enquiries and which hotel privacy details still need confirmation.") },
  "/terms-and-conditions": { title: cmsText("guest-routes:173f5f9f26b4", "Terms & Conditions"), description: cmsText("guest-routes:c48dd236906a", "Information to review before booking a stay, meal or experience with The Mud House.") },
  "/cancellation-refund-policy": { title: cmsText("guest-routes:d5a3fb28c95e", "Cancellation & Refund Policy"), description: cmsText("guest-routes:4b813a1e6fec", "How to request the cancellation, change and refund terms that apply to your booking.") },
  "/house-rules": { title: "House Rules", description: cmsText("guest-routes:042ea98f5d92", "Questions to confirm with The Mud House before your visit, including arrival, room arrangements and property rules.") },
} as const;
export type GuestRoute = keyof typeof guestRoutes;
export function getGuestRoute(pathname: string): GuestRoute | undefined {
  const path = pathname.replace(/\/+$/, "") || "/";
  return Object.hasOwn(guestRoutes, path) ? path as GuestRoute : undefined;
}
export function informationHref(title: string): string | undefined {
  return ({
    "FAQs": "/faqs",
    "Travel Tips": "/explore-varanasi#practical",
    "House Rules": "/house-rules",
    "Privacy Policy": "/privacy-policy",
    "Terms & Conditions": "/terms-and-conditions",
    "Cancellation & Refund Policy": "/cancellation-refund-policy",
    "Offers & Packages": "/travel-packages",
  } as Record<string,string>)[title];
}
