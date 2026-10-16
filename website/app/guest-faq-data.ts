import { getSite, mediaById } from "../cms/client";
import { restaurantFAQs } from "./restaurant-data";
import { roomFAQs } from "./rooms-data";
import { travelFAQs } from "./travel-data";

export const categories = [
  { id: "all", label: "All questions" },
  { id: "stay", label: "Your stay" },
  { id: "dining", label: "Dining" },
  { id: "experiences", label: "Experiences" },
  { id: "arrival", label: "Arrival & access" },
  { id: "enquiries", label: "Enquiries & booking" },
] as const;

export type FAQCategory = (typeof categories)[number]["id"];

export type GuestFAQ = {
  id: string;
  category: Exclude<FAQCategory, "all">;
  question: string;
  answer: string;
  href?: string;
  linkLabel?: string;
};

const stayIds = ["dormitory", "air-conditioning", "breakfast", "group-rooms", "long-stays"];
const diningIds = ["non-resident-dining", "cuisine", "service-hours", "table-requests", "dietary-needs"];
const experienceIds = ["package-accommodation", "package-pricing", "private-or-shared", "experience-requirements"];

const originalGuestFAQs: GuestFAQ[] = [
  ...roomFAQs.map((faq, index): GuestFAQ => ({
    ...faq,
    id: stayIds[index],
    category: "stay",
    href: index === 0 ? "/rooms/dormitory-room" : "/rooms",
    linkLabel: index === 0 ? "Explore the dormitory" : "Explore our rooms",
  })),
  {
    id: "children-extra-beds",
    category: "stay",
    question: "Can children stay, and can an extra bed be arranged?",
    answer: "Share the number and ages of children, your room preference and any extra bedding needs when you enquire. Extra beds depend on room type and availability. Sleeping arrangements and any additional charges need to be confirmed with your quote.",
    href: "/rooms/family-room",
    linkLabel: "Explore the Family Room",
  },
  {
    id: "pet-policy",
    category: "stay",
    question: "Can I bring a pet?",
    answer: "Please contact the team to confirm the current pet policy before booking. The policy and any arrangements are awaiting confirmation.",
    href: "/contact?topic=stay",
    linkLabel: "Ask about your stay",
  },
  ...restaurantFAQs.map((faq, index): GuestFAQ => ({
    ...faq,
    answer: index === 1
      ? "Our cuisine and menu approach are still to be confirmed. Browse the food concepts on the Food Menu page, then ask the team for the current menu and available dishes."
      : faq.answer,
    id: diningIds[index],
    category: "dining",
    href: index === 1 ? "/food-menu" : "/restaurant#table-request",
    linkLabel: index === 1 ? "Browse the food menu" : "Plan your meal",
  })),
  ...travelFAQs.slice(0, 4).map((faq, index): GuestFAQ => ({
    ...faq,
    id: experienceIds[index],
    category: "experiences",
    href: "/travel-packages#travel-enquiry",
    linkLabel: "Plan an experience",
  })),
  {
    id: "arrival-departure-times",
    category: "arrival",
    question: "What are the check-in and check-out times?",
    answer: "Arrival and departure times are unconfirmed. Please ask the team before travelling. Include any early arrival or late departure request in your enquiry so the available arrangements can be discussed.",
    href: "/contact?topic=arrival",
    linkLabel: "Discuss your arrival",
  },
  {
    id: "directions-transfers",
    category: "arrival",
    question: "How do I reach the hotel, and can you help with transfers?",
    answer: "Contact the team for the confirmed address, airport and railway station guidance, and local transport options. Transfer availability, pickup arrangements and charges need to be confirmed before you travel.",
    href: "/contact?topic=arrival",
    linkLabel: "Ask for arrival guidance",
  },
  {
    id: "room-access",
    category: "arrival",
    question: "How can I check whether the hotel meets my access needs?",
    answer: "Tell the team about any access or assistance requirements before booking. Ask them to confirm the floor level, lift or steps, door widths, bathroom arrangement and route to the room offered. Verified room dimensions and floor plans are not currently available on the website.",
    href: "/contact?topic=accessibility",
    linkLabel: "Discuss access requirements",
  },
  {
    id: "availability-rates",
    category: "enquiries",
    question: "How do I check room availability and rates?",
    answer: "Choose your dates, guest count and room preference, then prepare an enquiry for the team. The website does not show live availability or confirmed rates. The team will need to confirm availability, the proposed room and a quote for your dates.",
    href: "/rooms#availability",
    linkLabel: "Enquire about a room",
  },
  {
    ...travelFAQs[4],
    id: "booking-confirmation",
    category: "enquiries",
    href: "/contact?topic=booking",
    linkLabel: "Talk to the team",
  },
  {
    id: "sending-an-enquiry",
    category: "enquiries",
    question: "Does submitting a website form send my enquiry automatically?",
    answer: "Review your details, accept the privacy notice, and select Send request to send your enquiry to our team. A reference number confirms that it was received. Our team will contact you about availability and arrangements; the request itself is not a confirmed booking. If sending fails, you can try again or use the email option.",
    href: "/contact",
    linkLabel: "Prepare an enquiry",
  },
  {
    id: "payment-deposits",
    category: "enquiries",
    question: "How do payments and deposits work?",
    answer: "Payment methods, deposit requirements, taxes and any additional charges are to be confirmed with your quote. Terms may vary by room, rate plan or experience. The website does not collect payments.",
    href: "/contact?topic=booking",
    linkLabel: "Ask about your quote",
  },
  {
    id: "cancellation-refunds",
    category: "enquiries",
    question: "What are the cancellation, change and refund terms?",
    answer: "Cancellation, booking changes and refund conditions are awaiting confirmation and may vary by rate plan or arrangement. Ask the team for the terms that apply to your quote before confirming a booking; no cancellation deadline, fee or refund entitlement is confirmed on this website.",
    href: "/cancellation-refund-policy",
    linkLabel: "Read cancellation information",
  },
];

export const guestFAQs: GuestFAQ[] = (getSite()?.faqs.filter(faq=>faq.enabled) as GuestFAQ[] | undefined) ?? originalGuestFAQs;

export function filterGuestFAQs(query: string, category: FAQCategory): GuestFAQ[] {
  const search = query.trim().toLocaleLowerCase().replace(/\s+/g, " ");
  return guestFAQs.filter((faq) => {
    if (category !== "all" && faq.category !== category) return false;
    const content = `${faq.question} ${faq.answer}`.toLocaleLowerCase().replace(/\s+/g, " ");
    return !search || content.includes(search);
  });
}
