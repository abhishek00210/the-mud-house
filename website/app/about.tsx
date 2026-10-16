import { ManagedImage, hasManagedImage } from "../cms/managed-image";
import { cmsText } from "../cms/client";
import { informationHref } from "./guest-routes";
import type { ReactNode } from "react";
import {
  Accessibility,
  ArrowRight,
  BedDouble,
  Building2,
  Car,
  Coffee,
  ConciergeBell,
  Flower2,
  Heart,
  House,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  PawPrint,
  Phone,
  Plane,
  Snowflake,
  Tv,
  UserRound,
  UsersRound,
  Utensils,
  Vault,
  WashingMachine,
  Wifi,
  Clock3,
  DoorOpen,
} from "lucide-react";
import "./about.css";

export const aboutCrops: Record<string, [number, number, number, number]> = {
  story: [35, 306, 269, 173],
  entrance: [35, 811, 244, 288],
  reception: [289, 811, 177, 126],
  room: [476, 811, 213, 126],
  restaurant: [289, 975, 219, 124],
  bathroom: [518, 975, 171, 124],
};
export const aboutGallery = [
  "entrance",
  "reception",
  "room",
  "restaurant",
  "bathroom",
];
const spaceLabels: Record<string, string> = {
  story: "The Mud House entrance",
  entrance: "Hotel entrance",
  reception: "Reception / shared space",
  room: "Guest room",
  restaurant: "Restaurant",
  bathroom: "Bathroom / property detail",
};
export function AboutPhoto({
  name,
  alt,
  className = "",
}: {
  name: string;
  alt?: string;
  className?: string;
}) {
  if (hasManagedImage(`about:${name}`, undefined)) return <ManagedImage slot={`about:${name}`} mediaId={undefined} alt={alt} className={`about-photo ${className}`} />;
  const [x, y, w, h] = aboutCrops[name];
  return (
    <svg
      className={`about-photo ${className}`}
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt ?? spaceLabels[name]}
    >
      <image href="/images/about-reference.png" width="724" height="2172" />
    </svg>
  );
}

type AboutProps = {
  onEnquire: (title?: string) => void;
  onGallery: (index?: number) => void;
};
const approaches = [
  {
    Icon: UserRound,
    title: cmsText("about:844e15b35255", "A personal welcome"),
    description:
      cmsText("about:565f2364e248", "A friendly face, a little local knowledge, and space to settle in at your own pace."),
  },
  {
    Icon: Flower2,
    title: cmsText("about:4f189fe2a64d", "Care in everyday details"),
    description:
      cmsText("about:41934945322b", "Thoughtful comforts and the small touches that make a stay feel like your own."),
  },
  {
    Icon: Building2,
    title: cmsText("about:c4be90918f59", "A connection to Varanasi"),
    description:
      cmsText("about:794eb2806e75", "Discover the city through its people, its flavours, and its everyday rhythms."),
  },
];
type AmenityStatus = "available" | "pending" | "request" | "charge";
const statusText: Record<AmenityStatus, string> = {
  available: "Available",
  pending: "Awaiting confirmation",
  request: "On request",
  charge: "Additional charge",
};
const amenityGroups = [
  {
    title: "In the rooms",
    Icon: BedDouble,
    items: [
      {
        Icon: Wifi,
        title: "Wi-Fi",
        detail: cmsText("about:c35c0df1e2b0", "High-speed internet"),
        status: "available",
      },
      {
        Icon: Snowflake,
        title: cmsText("about:312860ed22f9", "Air conditioning"),
        detail: cmsText("about:1023eee75989", "For a comfortable stay"),
        status: "available",
      },
      {
        Icon: Coffee,
        title: cmsText("about:6728ce2fcb3b", "Tea & coffee maker"),
        detail: cmsText("about:6b3917125139", "A quiet moment, any time"),
        status: "available",
      },
      {
        Icon: Tv,
        title: "Television",
        detail: cmsText("about:0e3bdfab462f", "Please check with our team"),
        status: "pending",
      },
      {
        Icon: Vault,
        title: "In-room safe",
        detail: cmsText("about:870b1b6a52b1", "For your personal belongings"),
        status: "available",
      },
    ],
  },
  {
    title: cmsText("about:3860ef162ed1", "Around the property"),
    Icon: Building2,
    items: [
      {
        Icon: Utensils,
        title: "Restaurant",
        detail: cmsText("about:97540e456d98", "Thoughtful, unhurried dining"),
        status: "available",
      },
      {
        Icon: Flower2,
        title: cmsText("about:c01e6ef8b48e", "Rooftop terrace"),
        detail: cmsText("about:0e3bdfab462f", "Please check with our team"),
        status: "pending",
      },
      {
        Icon: Car,
        title: "Parking",
        detail: cmsText("about:6a0a3d9dea8b", "Please check before arrival"),
        status: "pending",
      },
      {
        Icon: DoorOpen,
        title: "Lift access",
        detail: cmsText("about:f72e4e7b3294", "Ask about access to your room"),
        status: "available",
      },
      {
        Icon: PawPrint,
        title: "Pet policy",
        detail: cmsText("about:b8a4f3b6e564", "Discuss your stay with us"),
        status: "request",
      },
    ],
  },
  {
    title: cmsText("about:95129df7dbad", "Guest services"),
    Icon: ConciergeBell,
    items: [
      {
        Icon: UserRound,
        title: "Concierge",
        detail: cmsText("about:bc79e9d7d855", "Help with your time in Kashi"),
        status: "available",
      },
      {
        Icon: Car,
        title: cmsText("about:bcce6391fb20", "Airport transfers"),
        detail: cmsText("about:dd94782e2411", "Arrange before your arrival"),
        status: "request",
      },
      {
        Icon: WashingMachine,
        title: cmsText("about:3f75c95072cd", "Laundry service"),
        detail: cmsText("about:a020f1fd4724", "Ask for current service details"),
        status: "charge",
      },
      {
        Icon: UsersRound,
        title: "Guided tours",
        detail: cmsText("about:98267b4a7c49", "Explore with a local guide"),
        status: "request",
      },
      {
        Icon: Clock3,
        title: cmsText("about:e6438cea77f2", "24-hour support"),
        detail: cmsText("about:4fc39506607e", "For help during your stay"),
        status: "available",
      },
    ],
  },
];
const arrivalDetails = [
  {
    Icon: Plane,
    title: "Arrival",
    text: "Contact our team for airport, railway station and transfer guidance.",
  },
  {
    Icon: MapPinned,
    title: cmsText("about:473af4a89f46", "Getting around"),
    text: "Let us help you plan local transport and explore the lanes of Varanasi.",
  },
  {
    Icon: Accessibility,
    title: cmsText("about:a4136d052c87", "Rooms and bathrooms"),
    text: "Please confirm room access, steps and bathroom arrangements before booking.",
  },
  {
    Icon: UsersRound,
    title: "Assistance",
    text: "Share any specific assistance or arrangements you may need.",
  },
];
const reasons = [
  {
    Icon: House,
    title: cmsText("about:79cde121b7a8", "A calm place to return to"),
    text: "Comfortable rooms for a slower rhythm after a day in the city.",
    link: "Rooms & Suites",
    href: "/rooms",
  },
  {
    Icon: Utensils,
    title: cmsText("about:0cbe3a8efab9", "Thoughtful dining"),
    text: "Local flavours and good company, with time to savour both.",
    link: "Restaurant",
    href: "/restaurant",
  },
  {
    Icon: MapPin,
    title: cmsText("about:b3c6e0003e76", "A deeper Varanasi experience"),
    text: "Discover the stories behind the places you come to see.",
    link: "Travel Packages",
    href: "/travel-packages",
  },
  {
    Icon: Heart,
    title: cmsText("about:ba25b93dc6bd", "Warm, attentive service"),
    text: "A personal welcome and a little care in the everyday details.",
    link: "Our Approach",
    href: "#our-approach",
  },
];

export function AboutContent({ onEnquire, onGallery }: AboutProps) {
  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-image" />
        <div className="about-hero-wash" />
        <div className="container about-hero-content">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">{cmsText("about:3a78695388b3", "Home")}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{cmsText("about:58cb20ad5e4d", "About Our Hotel")}</span>
          </nav>
          <div className="about-hero-copy">
            <p className="eyebrow">{cmsText("about:309d1ec1cde0", "ABOUT THE MUD HOUSE")}</p>
            <h1 id="about-title">
              {cmsText("about:169f73718293", "Behind the doors")}<br />
              {cmsText("about:911e0854cb20", "of The Mud House.")}</h1>
            <p>
              {cmsText("about:91c145bdca13", "Get to know the spaces, the people, and the approach")}<br className="desktop-break" /> {cmsText("about:95d5d198e9d0", "behind your stay in Varanasi.")}</p>
            <div className="hero-actions">
              <a className="button" href="#our-story">
                {cmsText("about:a88c60852684", "Explore Our Story ")}<ArrowRight />
              </a>
              <a className="button button-outline" href="/rooms">
                {cmsText("about:0c69aca0e3f5", "View Our Rooms")}</a>
            </div>
          </div>
        </div>
        <span className="hero-image-caption">
          {cmsText("about:a9bc22e42d29", "Concept image · A glimpse of the atmosphere")}</span>
      </section>
      <section className="container about-story reveal" id="our-story">
        <figure className="story-photo">
          <AboutPhoto name="story" />
          <figcaption>{cmsText("about:a7123cf2870e", "Concept image · The Mud House")}</figcaption>
        </figure>
        <div className="story-copy">
          <p className="eyebrow">{cmsText("about:be832cc455c7", "OUR STORY")}</p>
          <h2>
            {cmsText("about:69c7b403f0a0", "A place to pause.")}<br />{cmsText("about:17c761fea1d9", "A story to share.")}</h2>
          <p>{cmsText("about:1217b533a193", "A warm, contemporary stay in the timeless city of Varanasi.")}</p>
          <p>{cmsText("about:b4d34d98a529", "Rooted in local heritage and shaped around the way you travel.")}</p>
          <p>
            {cmsText("about:dadab58780c8", "A comfortable base to rest, relish and explore the many layers of Kashi.")}</p>
        </div>
      </section>
      <section className="about-approach reveal" id="our-approach">
        <div className="container">
          <p className="eyebrow">{cmsText("about:52cae1e20f81", "OUR APPROACH")}</p>
          <h2>{cmsText("about:70c5573ac2cc", "Hospitality, in the details.")}</h2>
          <div className="approach-grid">
            {approaches.map(({ Icon, title, description }) => (
              <article className="approach-item" key={title}>
                <Icon strokeWidth={1.2} />
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="approach-rule" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container about-spaces reveal" id="spaces">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{cmsText("about:fcfd519a247c", "THE SPACES")}</p>
            <h2>{cmsText("about:50722f1d6fcb", "Take a closer look.")}</h2>
          </div>
          <button className="text-link" onClick={() => onGallery()}>
            {cmsText("about:d35c25e1c4d6", "View Full Gallery ")}<ArrowRight />
          </button>
        </div>
        <div className="spaces-grid">
          {aboutGallery.map((name, index) => (
            <button
              key={name}
              className={`space-tile ${index === 0 ? "space-tile-tall" : ""}`}
              onClick={() => onGallery(index)}
              aria-label={`View ${spaceLabels[name].toLowerCase()}`}
            >
              <figure>
                <AboutPhoto name={name} />
                <figcaption>
                  <small>{cmsText("about:db9569d53a2b", "Concept image · Property inspiration")}</small>
                  <span>{spaceLabels[name]}</span>
                </figcaption>
              </figure>
            </button>
          ))}
        </div>
      </section>
      <section className="container about-practical reveal" id="practical">
        <p className="eyebrow">{cmsText("about:9f2c5886d2fe", "YOUR STAY, MADE CLEAR")}</p>
        <h2>{cmsText("about:33cdb44a5d3c", "The practical details.")}</h2>
        <div className="practical-grid">
          {amenityGroups.map(({ title, Icon, items }) => (
            <div className="amenity-group" key={title}>
              <h3>
                <Icon strokeWidth={1.35} />
                {title}
              </h3>
              {items.map(({ Icon: ItemIcon, title, detail, status }) => (
                <div className="amenity-row" key={title}>
                  <ItemIcon strokeWidth={1.5} />
                  <div className="amenity-copy">
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </div>
                  <span className={`status status-${status}`}>
                    {statusText[status as AmenityStatus]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="container about-arrival reveal" id="arrival">
        <p className="eyebrow">{cmsText("about:bb5479bd9cdd", "ACCESSIBILITY & ARRIVAL")}</p>
        <h2>{cmsText("about:93fdcf602dbb", "Know what to expect before you arrive.")}</h2>
        <div className="arrival-grid">
          <div className="arrival-list">
            {arrivalDetails.map(({ Icon, title, text }) => (
              <div className="arrival-row" key={title}>
                <Icon strokeWidth={1.5} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <aside className="access-card">
            <div className="access-arch" aria-hidden="true" />
            <h3>
              {cmsText("about:041cf3b8241d", "Let’s discuss your")}<br />
              {cmsText("about:5ded5d66a13d", "access needs.")}</h3>
            <p>
              {cmsText("about:694ec55df19b", "Contact the team to discuss the arrangements you need before making a booking.")}</p>
            <button
              className="button"
              onClick={() =>
                onEnquire("Accessibility and arrival arrangements")
              }
            >
              {cmsText("about:5b58159f8951", "Ask About Accessibility ")}<ArrowRight />
            </button>
          </aside>
        </div>
      </section>
      <section className="container about-reasons reveal">
        <p className="eyebrow">{cmsText("about:608278719b09", "WHY THE MUD HOUSE")}</p>
        <h2>{cmsText("about:bb6658402c43", "Find what fits your visit.")}</h2>
        <div className="reasons-grid">
          {reasons.map(({ Icon, title, text, link, href }) => (
            <article className="reason-item" key={title}>
              <Icon strokeWidth={1.3} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
                <a className="text-link" href={href}>
                  {link} <ArrowRight />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="about-cta">
        <div className="container about-cta-inner">
          <div className="about-cta-arch" aria-hidden="true" />
          <div>
            <p className="eyebrow">{cmsText("about:19bec50065df", "YOUR STAY, OUR CARE")}</p>
            <h2>{cmsText("about:eb9210c8d445", "Let’s make your visit feel more personal.")}</h2>
            <p>{cmsText("about:bbfdd0dd1d59", "Tell us about your stay, dining plans, or time in Varanasi.")}</p>
          </div>
          <div className="about-cta-actions">
            <button className="button button-gold" onClick={() => onEnquire()}>
              {cmsText("about:3226316c5fb8", "Make an Enquiry ")}<ArrowRight />
            </button>
            <a className="button button-light" href="/rooms">
              {cmsText("about:bef8bfe2d330", "Explore Rooms")}</a>
            <a
              className="about-whatsapp"
              href="/contact#enquiry"
            >
              <MessageCircle />
              {cmsText("about:5fbc0ca89a61", "Talk to our team")}</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AboutFooter({
  brand,
  onInfo,
  onGallery,
  onMenu,
}: {
  brand: ReactNode;
  onInfo: (title: string) => void;
  onGallery: () => void;
  onMenu: () => void;
}) {
  return (
    <footer className="about-footer">
      <div className="container about-footer-main">
        <div className="about-footer-brand">
          {brand}
          <p>
            {cmsText("about:3b01cd92edba", "A place to stay, dine and experience")}<br />
            {cmsText("about:ff0fc99cff9e", "the timeless spirit of Varanasi.")}</p>
          <p>{cmsText("about:443b0209ae4e", "Varanasi, India")}</p>
        </div>
        <div className="footer-column">
          <h4>{cmsText("about:3b73900b8d29", "Explore")}</h4>
          <a href="/rooms">{cmsText("about:c14bcb47fccc", "Rooms & Suites")}</a>
          <a href="/restaurant">{cmsText("about:1212ea9e2094", "Restaurant")}</a>
          <a href="/food-menu">{cmsText("about:5ca82dd533e0", "Food Menu")}</a>
          <a href="/travel-packages">{cmsText("about:cd03931583f9", "Travel Packages")}</a>
          <a href="/explore-varanasi">{cmsText("about:b00680485f5a", "Explore Varanasi")}</a>
        </div>
        <div className="footer-column">
          <h4>{cmsText("about:1cb0ba125f84", "Information")}</h4>
          <a href="/about" aria-current="page">
            {cmsText("about:58cb20ad5e4d", "About Our Hotel")}</a>
          <a href="/gallery">{cmsText("about:352cfc749e55", "Gallery")}</a>
          <a href="/faqs">{cmsText("about:9856b7433f84", "FAQs")}</a>
          <a href="/contact">{cmsText("about:2b5c3d26721a", "Contact")}</a>
        </div>
        <div className="footer-column about-footer-contact">
          <h4>{cmsText("about:2b5c3d26721a", "Contact")}</h4>
          <a href="/contact">
            <MapPin />
            <span>
              {cmsText("about:6decded18038", "Address to confirm,")}<br />
              {cmsText("about:fbb0421af070", "Varanasi, Uttar Pradesh, India")}</span>
          </a>
          <a href="/contact#enquiry">
            <Phone />
            {cmsText("about:4e6be8b9b54f", "Request contact details")}</a>
          <a href="mailto:hello@themudhouse.in">
            <Mail />
            {cmsText("about:5b8b6b4b919a", "hello@themudhouse.in")}</a>
          <a href="/contact#enquiry">
            <MessageCircle />
            {cmsText("about:3d8baaa59f7d", "Chat with our team")}</a>
        </div>
      </div>
      <div className="container about-footer-bottom">
        <p>© {new Date().getFullYear()} {cmsText("about:b25d8d260031", "The Mud House. All rights reserved.")}</p>
        <div>
          {[
            "Privacy Policy",
            "Terms & Conditions",
            "Cancellation & Refund Policy",
          ].map((title) => (
            <a key={title} href={informationHref(title)}>{title}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
