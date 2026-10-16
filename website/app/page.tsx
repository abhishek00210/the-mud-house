import { SiteBrand as Brand } from "./site-brand";
import { SendBookingRequest } from "./booking-request";
import { ManagedImage, hasManagedImage } from "../cms/managed-image";
import { cmsText, getSite, mediaById, imageOverride } from "../cms/client";
"use client";

import { getGuestRoute, guestRoutes, informationHref } from "./guest-routes";
import { GuestFooter, GuestNotFound } from "./guest-shared";
import { PolicyContent } from "./guest-policy";
import { policyHref, isPolicySlug } from "./guest-policy-data";
import { RoomsContent, RoomsFooter } from "./rooms";
import { RestaurantContent, RestaurantFooter } from "./restaurant";
import { FoodMenuContent } from "./food-menu";
import { TravelContent, TravelFooter } from "./travel";
import { ExperienceDetailPage, ExperienceFooter, ExperienceBrand } from "./experience-detail";
import { TravelPhoto, travelGallery, travelPackages, type TravelPhotoName } from "./travel-data";
import {
  RestaurantPhoto,
  restaurantGallery,
  type RestaurantPhotoName,
} from "./restaurant-data";
import { RoomDetailPage } from "./room-detail";
import {
  DetailPhotoView,
  roomDetails,
  roomDetailHref,
  readStaySelection,
  normalizeStayForRoom,
} from "./room-detail-data";
import {
  RoomPhoto,
  roomCatalog,
  type RoomPhotoName,
  type StaySelection,
} from "./rooms-data";
import { RoomDetailContent, FloorPlanContent } from "./rooms-dialogs";

import { AboutContent, AboutFooter, AboutPhoto, aboutGallery } from "./about";

import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Expand,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  UsersRound,
  Utensils,
  X,
  Binoculars,
  Wifi,
  Wind,
  Coffee,
  Navigation,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const GuestPage = lazy(() => import("./guest-pages"));

function Instagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
    </svg>
  );
}
function Facebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5A25 25 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v9z" />
    </svg>
  );
}
function Youtube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3z" fill="#f8f5f0" />
    </svg>
  );
}

const crops: Record<string, [number, number, number, number]> = {
  lounge: [420, 335, 264, 167],
  stay: [42, 515, 203, 86],
  food: [261, 515, 203, 86],
  boat: [480, 515, 203, 86],
  deluxe: [43, 790, 201, 100],
  premium: [262, 790, 201, 100],
  family: [481, 790, 201, 100],
  restaurant: [43, 1085, 288, 165],
  curry: [341, 1085, 112, 165],
  sunrise: [43, 1329, 201, 84],
  walk: [262, 1329, 201, 84],
  ghats: [481, 1329, 201, 84],
  map: [43, 1757, 288, 165],
};

function Photo({
  name,
  alt,
  className = "",
}: {
  name: string;
  alt: string;
  className?: string;
}) {
  if (hasManagedImage(`home:${name}`, undefined)) return <ManagedImage slot={`home:${name}`} mediaId={undefined} alt={alt} className={`photo ${className}`} />;
  const [x, y, w, h] = crops[name];
  return (
    <svg
      className={`photo ${className}`}
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt}
    >
      <image href="/images/reference.png" width="724" height="2172" />
    </svg>
  );
}
const originalRooms = [
  {
    name: "Deluxe Room",
    photo: "deluxe",
    description:
      cmsText("page:4d463e455e5b", "A comfortable and calming space with everything you need for a relaxed stay."),
    guests: 2,
    beds: "King Bed",
    size: 280,
  },
  {
    name: "Premium Room",
    photo: "premium",
    description:
      cmsText("page:6706b996ad8b", "Spacious and elegant, with a touch of local charm and modern amenities."),
    guests: 3,
    beds: "King Bed",
    size: 320,
  },
  {
    name: "Family Room",
    photo: "family",
    description:
      cmsText("page:0e298c99e27e", "Designed for families, with extra space to stay together comfortably."),
    guests: 4,
    beds: "2 Beds",
    size: 400,
  },
];
const rooms = originalRooms.map(room=>{const managed=getSite()?.rooms.find(item=>item.image===room.photo);return managed?{...room,name:managed.name,description:managed.description,guests:managed.guests,beds:managed.beds,enabled:managed.enabled}: {...room,enabled:true};}).filter(room=>room.enabled);
const originalExperiences = [
  {
    name: "Sunrise on the Ganga",
    photo: "sunrise",
    description:
      cmsText("page:01880f018d4f", "Experience the magic of Varanasi at dawn with a guided boat ride."),
    time: "2–3 Hours",
    includes: "Boat Ride | Guide",
    detail:
      cmsText("page:94ec0ea4a10f", "Begin before the city stirs. Drift along the ghats as the first light touches the river, with a local guide sharing the stories behind this timeless ritual."),
  },
  {
    name: "Varanasi Heritage Walk",
    photo: "walk",
    description:
      cmsText("page:881075b5b33e", "Explore ancient lanes, temples and living culture with a local guide."),
    time: "3–4 Hours",
    includes: "Guide | Refreshments",
    detail:
      cmsText("page:92a5b81c204f", "Follow the winding lanes of the old city, discover neighbourhood shrines and artisan workshops, and pause for a cup of chai. A slower way to discover the soul of Kashi."),
  },
  {
    name: "Stay & Explore Kashi",
    photo: "ghats",
    description:
      cmsText("page:df038cc1a0b5", "A curated stay with experiences, designed for a deeper connection to the city."),
    time: "2 Nights / 3 Days",
    includes: "Stay | Tours | Transfers",
    detail:
      cmsText("page:7fc084fe0f9f", "Settle into The Mud House and let us help shape your time in Kashi. Combine a restful stay with a sunrise boat ride, a heritage walk, and time to explore at your own pace."),
  },
];
const experiences = travelPackages.slice(0,3).map((item,index)=>({name:item.name,photo:item.photo==="heritage"?"walk":item.photo==="stay"?"ghats":"sunrise",description:item.description,time:item.duration||"To confirm",includes:item.includes?.join(" | ")||"Inclusions to confirm",detail:item.concept,imageMediaId:item.imageMediaId,id:item.id}));
const stories = [
  {
    quote:
      "A beautiful stay in the heart of Varanasi. The rooms are comfortable, the staff is warm, and the location is perfect for exploring.",
    name: "Priya S.",
    city: "New Delhi",
  },
  {
    quote:
      "The food was amazing and the team helped us plan a memorable boat ride. It felt like a home away from home.",
    name: "Rahul M.",
    city: "Bengaluru",
  },
  {
    quote:
      "Thoughtful hospitality, great location and authentic experiences. Highly recommended!",
    name: "Ananya K.",
    city: "Mumbai",
  },
];
type Modal = {
  kind:
    | "enquiry"
    | "room"
    | "experience"
    | "menu"
    | "gallery"
    | "info"
    | "catalog-room"
    | "floor-plan";
  title: string;
  index?: number;
} | null;
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
function nextDay(date: string) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Home() {
  const isAbout = /^\/about\/?$/.test(window.location.pathname);
  const isRestaurant = /^\/(restaurant|dine)\/?$/.test(
    window.location.pathname,
  );
  const isFoodMenu = /^\/(food-menu|restaurant\/menu)\/?$/.test(window.location.pathname);
  const isDiningSection = isRestaurant || isFoodMenu;
  const isTravel = /^\/(travel-packages|experiences|explore)\/?$/.test(window.location.pathname);
  const experienceRoute = window.location.pathname.match(/^\/(?:travel-packages|experiences)\/([a-z0-9-]+)\/?$/);
  const experiencePackage = travelPackages.find((experience) => experience.id === experienceRoute?.[1]);
  const isExperiencePath = !isTravel && /^\/(?:travel-packages|experiences)\//.test(window.location.pathname);
  const isTravelSection = isTravel || isExperiencePath;
  const isRooms = /^\/rooms\/?$/.test(window.location.pathname);
  const roomRoute = window.location.pathname.match(/^\/rooms\/([a-z0-9-]+)\/?$/);
  const detailSlug = roomRoute?.[1] ?? "";
  const roomDetail = Object.hasOwn(roomDetails, detailSlug)
    ? roomDetails[detailSlug]
    : undefined;
  const isRoomPath = window.location.pathname.startsWith("/rooms/");
  const isRoomSection = isRooms || isRoomPath;
  const guestRoute = getGuestRoute(window.location.pathname);
  const isUnknownPath = !guestRoute && window.location.pathname !== "/" && !isAbout && !isDiningSection && !isTravelSection && !isRoomSection;
  const isGuestSection = !!guestRoute || isUnknownPath;
  const initialStay = readStaySelection(roomDetail?.isDormitory ? 1 : 2);
  const homeAnchor = (id: string) =>
    id === "stay"
      ? "/rooms"
      : id === "dine"
        ? "/restaurant"
        : id === "explore"
          ? "/travel-packages"
          : id === "contact" ? "/contact" : id === "gallery" ? "/gallery"
          : `${isAbout || isRoomSection || isDiningSection || isTravelSection ? "/" : ""}#${id}`;
  useEffect(() => {
    document.title = guestRoute ? `${guestRoutes[guestRoute].title} · The Mud House, Varanasi` : isUnknownPath ? "Page not found · The Mud House" : experiencePackage
      ? `${experiencePackage.name} · The Mud House, Varanasi`
      : isExperiencePath
      ? "Experience not found · The Mud House"
      : isTravel
      ? "Travel Packages & Experiences · The Mud House, Varanasi"
      : isFoodMenu
      ? "Food Menu · The Mud House, Varanasi"
      : isRestaurant
      ? "Dining at The Mud House · Varanasi"
      : roomDetail
        ? `${roomDetail.name} · The Mud House, Varanasi`
        : isRoomPath
          ? "Room not found · The Mud House"
          : isAbout
            ? "About Our Hotel · The Mud House, Varanasi"
            : isRooms
              ? "Rooms & Suites · The Mud House, Varanasi"
              : "The Mud House · Stay. Savour. Discover Kashi.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        guestRoute ? guestRoutes[guestRoute].description : isUnknownPath ? "Find your way to rooms, dining, experiences and guest information at The Mud House, Varanasi." : experiencePackage
          ? experiencePackage.concept
          : isExperiencePath
          ? "Browse travel packages and experiences at The Mud House, Varanasi, and find a visit that fits your plans."
          : isTravel
          ? "Discover Kashi, your way. Browse sunrise river experiences, heritage walks and stay-and-tour concepts, then plan your visit with The Mud House."
          : isFoodMenu
          ? "Find something to savour at The Mud House. Browse starters, main courses, breads, desserts and beverages, and plan your next meal with us."
          : isRestaurant
          ? "Good food. Unhurried moments. Explore dining at The Mud House in Varanasi, view the setting and request a table for your visit."
          : roomDetail
            ? roomDetail.intro
            : isAbout
              ? "Get to know The Mud House in Varanasi: our story, spaces, amenities and arrival information for a thoughtful stay in Kashi."
              : isRooms
                ? "Find your space to unwind at The Mud House. Explore Deluxe, Premium, Family and Dormitory rooms and enquire about your stay in Varanasi."
                : "A warm, contemporary stay in Varanasi. Discover thoughtful rooms, soulful dining and curated experiences at The Mud House in Varanasi.",
      );
  }, [isAbout, isRooms, roomDetail, detailSlug, isRestaurant, isFoodMenu, isTravel, experiencePackage, isExperiencePath, guestRoute, isUnknownPath]);
  const [modal, setModal] = useState<Modal>(null);
  const modalReturnFocus = useRef<HTMLElement | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [checkIn, setCheckIn] = useState(initialStay.checkIn);
  const [checkOut, setCheckOut] = useState(initialStay.checkOut);
  const [guests, setGuests] = useState(String(initialStay.guests));
  const [requestedRooms, setRequestedRooms] = useState(initialStay.rooms);
  const [requestedUnit, setRequestedUnit] = useState(
    initialStay.unit ?? "rooms",
  );
  const [storyIndex, setStoryIndex] = useState(0);
  const [prepared, setPrepared] = useState(false);
  const [enquiryDraft, setEnquiryDraft] = useState({ name: "", email: "", phone: "", message: "" });
  const [emailLink, setEmailLink] = useState("");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const gallery = isTravelSection
    ? travelGallery
    : isDiningSection
    ? restaurantGallery
    : roomDetail
      ? roomDetail.photos.map((photo) => photo.id)
      : isRooms
        ? roomCatalog.map((room) => room.image)
        : isAbout
          ? aboutGallery
          : modal?.title === "Our rooms"
            ? ["deluxe", "premium", "family"]
            : [
                "lounge",
                "deluxe",
                "premium",
                "family",
                "restaurant",
                "sunrise",
                "walk",
                "ghats",
              ];
  function open(value: Modal) {
    if (!modal) {
      modalReturnFocus.current = mobileMenu
        ? document.querySelector<HTMLElement>(".menu-toggle")
        : document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }
    setPrepared(false);
    setGalleryIndex(0);
    setModal(value);
    setMobileMenu(false);
  }
  const enquire = (
    title = roomDetail
      ? `Enquire about ${roomDetail.name}`
      : "Plan your time in Kashi",
  ) => open({ kind: "enquiry", title });
  function retainStaySelection(selection?: StaySelection) {
    if (!selection) return;
    setCheckIn(selection.checkIn);
    setCheckOut(selection.checkOut);
    setGuests(String(selection.guests));
    setRequestedRooms(selection.rooms);
    setRequestedUnit(selection.unit ?? "rooms");
  }
  function enquireStay(
    title = "Your stay at The Mud House",
    selection?: StaySelection,
  ) {
    retainStaySelection(
      selection && /Dormitory Room/i.test(title)
        ? normalizeStayForRoom("dormitory-room", selection)
        : selection,
    );
    enquire(title);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.07 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const context = (
      document as unknown as {
        modelContext?: {
          registerTool: (tool: unknown, options: unknown) => Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: "view_mud_house_rooms",
          description:
            cmsText("page:6f3b5797fa42", "Read the available room categories at The Mud House. Does not check availability or make a reservation."),
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true },
          execute: (input: unknown) => {
            if (
              !input ||
              typeof input !== "object" ||
              Object.keys(input).length
            )
              throw new Error("No parameters are supported.");
            return roomCatalog.filter(room => room.enabled !== false).map(
              ({ name, guests, occupancy, beds, bedDetail }) => ({
                name,
                guests,
                occupancy,
                beds,
                bedArrangement: bedDetail,
              }),
            );
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
    return () => lifecycle.abort();
  }, []);
  function availability(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    enquire("Your stay at The Mud House");
  }
  function prepareEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setEnquiryDraft({ name: String(values.get("name") ?? ""), email: String(values.get("email") ?? ""), phone: String(values.get("phone") ?? ""), message: String(values.get("message") ?? "") });
    const stayDetails = isDiningSection || isTravelSection
      ? ""
      : `\nCheck-in: ${checkIn || "Flexible"}\nCheck-out: ${checkOut || "Flexible"}\nGuests: ${guests}\n${requestedUnit === "beds" ? "Beds" : "Rooms"} requested: ${requestedRooms}`;
    const body = `Hello The Mud House,\n\nI would like to enquire about: ${modal?.title}.\n\nName: ${values.get("name")}\nEmail: ${values.get("email")}\nPhone: ${values.get("phone") || "Not provided"}${stayDetails}\n\n${values.get("message") || "Please share availability and further details."}\n\nThank you!`;
    setEmailLink(
      `mailto:${getSite()?.settings.email || "hello@themudhouse.in"}?subject=${encodeURIComponent(`Enquiry: ${modal?.title}`)}&body=${encodeURIComponent(body)}`,
    );
    setPrepared(true);
  }
  return (
    <>
      <header
        className={
          isGuestSection ? "site-header guest-header" : isExperiencePath
            ? "site-header experience-header"
            : isTravel
            ? "site-header travel-header"
            : isDiningSection
            ? "site-header restaurant-header"
            : isAbout
              ? "site-header about-header"
              : isRoomSection
                ? "site-header rooms-header"
                : "site-header"
        }
        id="home"
      >
        <div className="header-inner">
          {isExperiencePath ? <ExperienceBrand /> : <Brand location={isDiningSection ? "VARANASI, INDIA" : "VARANASI"} />}
          <nav
            className={mobileMenu ? "main-nav menu-open" : "main-nav"}
            aria-label="Main navigation"
          >
            {[
              [isRooms ? "Stays" : "Stay", "stay"],
              ["Dine", "dine"],
              ["Explore", "explore"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={homeAnchor(id)}
                aria-current={
                  (isRoomSection && id === "stay") ||
                  (isDiningSection && id === "dine") ||
                  ((isTravelSection || guestRoute === "/explore-varanasi") && id === "explore")
                    ? "page"
                    : undefined
                }
                onClick={() => setMobileMenu(false)}
              >
                {label}
              </a>
            ))}
            <a href="/gallery" aria-current={window.location.pathname.replace(/\/$/, "") === "/gallery" ? "page" : undefined} onClick={() => setMobileMenu(false)}>{cmsText("page:352cfc749e55", "Gallery")}</a>
            <a
              href="/about"
              aria-current={isAbout ? "page" : undefined}
              onClick={() => setMobileMenu(false)}
            >
              {cmsText("page:4efca0d10c5f", "About")}</a>
            <a
              href={homeAnchor("contact")}
              aria-current={window.location.pathname.replace(/\/$/, "") === "/contact" ? "page" : undefined}
              onClick={() => setMobileMenu(false)}
            >
              {isRooms ? "Find Us" : "Contact"}
            </a>
          </nav>
          {isGuestSection ? (
            <a className="button header-enquire" href="/booking" onClick={() => setMobileMenu(false)}>{cmsText("page:b169e6eff1a6", "Enquire Now ")}<ArrowRight /></a>
          ) : isExperiencePath ? (
            <a className="button header-enquire" href={experiencePackage ? "#experience-enquiry" : "/travel-packages#travel-enquiry"} onClick={() => setMobileMenu(false)}>
              {cmsText("page:02bb40ea674e", "Enquire Now")}</a>
          ) : isTravel ? (
            <a className="button header-enquire" href="#travel-enquiry" onClick={() => setMobileMenu(false)}>
              {cmsText("page:f0ff7174f738", "Plan Your Experience")}</a>
          ) : isDiningSection ? (
            <a
              className="button header-enquire"
              href="/restaurant#table-request"
              onClick={() => setMobileMenu(false)}
            >
              {cmsText("page:fde6c6c3f0cb", "Request a Table ")}<ArrowRight />
            </a>
          ) : roomDetail ? (
            <a className="button header-enquire" href="#room-enquiry">
              {cmsText("page:02bb40ea674e", "Enquire Now")}</a>
          ) : isRooms ? (
            <a className="button header-enquire" href="#availability">
              {cmsText("page:f412b03c1700", "Book Your Stay")}</a>
          ) : (
            <a className="button header-enquire" href="/booking">{cmsText("page:b169e6eff1a6", "Enquire Now ")}<ArrowRight /></a>
          )}
          {isExperiencePath && <span className="experience-header-motto">{cmsText("page:59231dcd7bdb", "A deeper")}<br />{cmsText("page:fd8b8383ddf2", "Kashi")}<br />{cmsText("page:6747916693a0", "awaits")}</span>}
          <button
            className="menu-toggle"
            aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {getSite() && !getSite()!.settings.bookingsOpen && <div className="cms-request-banner">{getSite()!.settings.closedMessage} <a href="/contact">{cmsText("page:44635127331a", "Contact the team")}</a></div>}
      {guestRoute ? (
        <Suspense fallback={<main className="guest-page"><div className="guest-container" role="status" style={{ paddingBlock: 100 }}>{cmsText("page:332784265992", "Opening your page…")}</div></main>}><GuestPage route={guestRoute} /></Suspense>
      ) : isUnknownPath ? <GuestNotFound /> : experiencePackage ? (
        <ExperienceDetailPage packageId={experiencePackage.id} onInfo={(title) => open({ kind: "info", title })} />
      ) : isExperiencePath ? (
        <main className="container experience-not-found" style={{ paddingBlock: "100px", minHeight: "60vh" }}>
          <p className="eyebrow">{cmsText("page:b391621c4356", "THE MUD HOUSE · VARANASI")}</p>
          <h1>{cmsText("page:139f0465ecd5", "We couldn’t find that experience.")}</h1>
          <p style={{ marginBlock: "24px" }}>{cmsText("page:925aeb3690df", "Explore our current travel packages and find another way to discover Kashi.")}</p>
          <a className="button" href="/travel-packages">{cmsText("page:daf2dba98b63", "View All Experiences ")}<ArrowRight /></a>
        </main>
      ) : isTravel ? (
        <TravelContent onInfo={(title) => open({ kind: "info", title })} />
      ) : isFoodMenu ? (
        <FoodMenuContent onContact={enquire} />
      ) : isRestaurant ? (
        <RestaurantContent
          onInfo={(title) => open({ kind: "info", title })}
          onContact={enquire}
        />
      ) : roomDetail ? (
        <RoomDetailPage
          room={roomDetail}
          onEnquire={enquireStay}
          onInfo={(title) => open({ kind: "info", title })}
        />
      ) : isRoomPath ? (
        <main
          className="container room-not-found"
          style={{ paddingBlock: "100px", minHeight: "60vh" }}
        >
          <p className="eyebrow">{cmsText("page:b391621c4356", "THE MUD HOUSE · VARANASI")}</p>
          <h1>{cmsText("page:16322427dd0b", "We couldn’t find that room.")}</h1>
          <p style={{ marginBlock: "24px" }}>
            {cmsText("page:ba7226c998bb", "Explore our room collection to find your space to unwind.")}</p>
          <a className="button" href="/rooms">
            {cmsText("page:c57c2df65d81", "View All Accommodation ")}<ArrowRight />
          </a>
        </main>
      ) : isAbout ? (
        <AboutContent
          onEnquire={enquire}
          onGallery={(index = 0) =>
            open({
              kind: "gallery",
              title: cmsText("page:cd7ee592b727", "The spaces at The Mud House"),
              index,
            })
          }
        />
      ) : isRooms ? (
        <RoomsContent
          onEnquire={enquireStay}
          onDetails={(index, selection) => {
            window.location.assign(
              roomDetailHref(`${roomCatalog[index].image}-room`, selection),
            );
          }}
          onFloorPlan={(index, selection) => {
            retainStaySelection(
              selection
                ? normalizeStayForRoom(
                    `${roomCatalog[index].image}-room`,
                    selection,
                  )
                : selection,
            );
            open({
              kind: "floor-plan",
              title: `${roomCatalog[index].name} floor plan`,
              index,
            });
          }}
        />
      ) : (
        <main>
          <section className="hero" aria-labelledby="hero-heading">
            <div className="hero-image" style={imageOverride("home:hero") ? {backgroundImage:`url(${imageOverride("home:hero")!.url})`,backgroundPosition:imageOverride("home:hero")!.position} : undefined} />
            <div className="hero-wash" />
            <div className="container hero-content">
              <p className="eyebrow">{cmsText("page:b391621c4356", "THE MUD HOUSE · VARANASI")}</p>
              <h1 id="hero-heading">
                {cmsText("page:04c6ba517923", "Stay. Savour.")}<br />
                {cmsText("page:754a161c5e68", "Discover Kashi.")}</h1>
              <p className="hero-description">
                {cmsText("page:f519b0a9b718", "Find your Varanasi rhythm through a welcoming stay,")}<br className="desktop-break" /> {cmsText("page:c423873a33ce", "memorable meals, and thoughtfully planned local")}<br className="desktop-break" /> {cmsText("page:b0c5b4297cbf", "experiences.")}</p>
              <div className="hero-actions">
                <a className="button" href="/rooms">
                  {cmsText("page:d8d1ae158618", "Explore Rooms ")}<ArrowRight />
                </a>
                <a className="button button-outline" href="/travel-packages">
                  {cmsText("page:7807c9ae4d21", "Discover Experiences")}</a>
              </div>
            </div>
            <div className="hero-note" aria-hidden="true">
              {cmsText("page:c939327ca16d", "Good")}<br />
              {cmsText("page:7db20897053b", "People")}<br />
              {cmsText("page:7bf8c23d17f1", "Better")}<br />
              {cmsText("page:8a9531258a92", "Journeys")}<span>⟶</span>
            </div>
          </section>
          <div className="container booking-wrap">
            <form className="booking-bar" onSubmit={availability}>
              <label className="booking-field">
                <CalendarDays />
                <span>
                  <strong>{cmsText("page:adc719587244", "Check-in")}</strong>
                  <input
                    aria-label="Check-in date"
                    type="date"
                    required
                    value={checkIn}
                    min={today()}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut <= e.target.value) setCheckOut("");
                    }}
                  />
                </span>
              </label>
              <label className="booking-field">
                <CalendarDays />
                <span>
                  <strong>{cmsText("page:93061eff839d", "Check-out")}</strong>
                  <input
                    aria-label="Check-out date"
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn ? nextDay(checkIn) : nextDay(today())}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </span>
              </label>
              <label className="booking-field">
                <UsersRound />
                <span>
                  <strong>{cmsText("page:3c8e0fde6fcc", "Guests")}</strong>
                  <select
                    aria-label="Number of guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option value={n} key={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
              <button className="button" type="submit">
                {cmsText("page:5fb720e45744", "Request Availability ")}<ArrowRight />
              </button>
            </form>
          </div>
          <section
            id="about"
            className="container intro-section section reveal"
          >
            <div className="intro-copy">
              <p className="eyebrow">{cmsText("page:2c84e303d4d8", "WELCOME TO THE MUD HOUSE")}</p>
              <h2>
                {cmsText("page:69c7b403f0a0", "A place to pause.")}<br />{cmsText("page:d5fb0b39d2c1", "A city to discover.")}</h2>
              <p>
                {cmsText("page:f662319ffde5", "The Mud House is a warm, contemporary stay in the timeless city of Varanasi. Rooted in local heritage and designed for today’s traveller, we offer a comfortable base to rest, relish and explore the many layers of Kashi.")}</p>
              <a className="text-link" href="/about">
                {cmsText("page:881174b394c2", "Discover Our Story ")}<ArrowRight />
              </a>
            </div>
            <Photo
              name="lounge"
              className="intro-photo"
              alt="A quiet sandstone lounge with soft cushions and the words Same City Different You"
            />
          </section>
          <section
            className="container pillars reveal"
            aria-label="Discover The Mud House"
          >
            {[
              {
                title: "Stay",
                image: "stay",
                Icon: BedDouble,
                text: "Thoughtful rooms, modern comforts and a warm, local welcome.",
                link: "Explore Rooms",
                id: "stay",
              },
              {
                title: "Dine",
                image: "food",
                Icon: Utensils,
                text: "Authentic flavours, fresh ingredients and a relaxed dining experience.",
                link: "Discover Dining",
                id: "dine",
              },
              {
                title: "Explore",
                image: "boat",
                Icon: Binoculars,
                text: "Curated experiences to help you see a deeper, more meaningful Kashi.",
                link: "View Experiences",
                id: "explore",
              },
            ].map(({ title, image, Icon, text, link, id }) => (
              <a className="pillar-card" key={title} href={homeAnchor(id)}>
                <div className="image-clip">
                  <Photo name={image} alt={`${title} at The Mud House`} />
                </div>
                <div className="pillar-body">
                  <Icon className="feature-icon" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="text-link">
                    {link} <ArrowRight />
                  </span>
                </div>
              </a>
            ))}
          </section>
          <section className="container section rooms-section reveal" id="stay">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{cmsText("page:01e4a0220bf7", "STAY WITH US")}</p>
                <h2>{cmsText("page:afd13d78ffd6", "Find your space to unwind.")}</h2>
              </div>
              <a className="text-link" href="/rooms">
                {cmsText("page:9860c4be8e1e", "View All Rooms ")}<ArrowRight />
              </a>
            </div>
            <div className="three-grid">
              {rooms.map((room, index) => (
                <article className="room-card" key={room.name}>
                  <button
                    className="image-button image-clip"
                    onClick={() =>
                      window.location.assign(
                        roomDetailHref(`${room.photo}-room`, {
                          checkIn,
                          checkOut,
                          guests: Number(guests),
                          rooms: requestedRooms,
                        }),
                      )
                    }
                    aria-label={`View ${room.name}`}
                  >
                    <RoomPhoto
                      name={room.photo as RoomPhotoName}
                      alt={`${room.name} with warm earthy interiors and comfortable beds`}
                    />
                    <span className="image-view">
                      <Expand /> {cmsText("page:38c1eb82beec", "View room")}</span>
                  </button>
                  <div className="room-body">
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <div className="amenities">
                      <span>
                        <UsersRound />
                        {room.guests} {cmsText("page:3c8e0fde6fcc", "Guests")}</span>
                      <span>
                        <BedDouble />
                        {room.beds}
                      </span>
                      <span>
                        <Expand />
                        {room.size} {cmsText("page:460c560f4303", "sq ft")}</span>
                    </div>
                    <div className="card-actions">
                      <button
                        className="button button-outline"
                        onClick={() =>
                          window.location.assign(
                            roomDetailHref(`${room.photo}-room`, {
                              checkIn,
                              checkOut,
                              guests: Number(guests),
                              rooms: requestedRooms,
                            }),
                          )
                        }
                      >
                        {cmsText("page:bd234ab46801", "View Room")}</button>
                      <button
                        className="button"
                        onClick={() => enquire(room.name)}
                      >
                        {cmsText("page:3e55d5d9c75d", "Enquire")}</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section
            className="container section dining-section reveal"
            id="dine"
          >
            <p className="eyebrow">{cmsText("page:34610b5ead14", "DINE AT THE MUD HOUSE")}</p>
            <h2>{cmsText("page:225953b02820", "Good food. Unhurried moments.")}</h2>
            <div className="dining-grid">
              <Photo
                name="restaurant"
                alt="The Mud House restaurant with warm lighting, wooden tables and arched sandstone walls"
              />
              <Photo
                name="curry"
                alt="Freshly prepared Indian curry served in a traditional bowl"
              />
              <div className="dining-copy">
                <p>
                  {cmsText("page:1d313362598c", "A relaxed dining space that celebrates the flavours of Varanasi and beyond. From traditional favourites to contemporary dishes, our kitchen brings people together over honest, soulful food.")}</p>
                <div className="dining-detail">
                  <Utensils />
                  <span>
                    <strong>{cmsText("page:6814ffa9a348", "Cuisine")}</strong>
                    <small>{cmsText("page:0c33a5a0eb60", "Menu and cuisine to confirm")}</small>
                  </span>
                </div>
                <div className="dining-detail">
                  <Clock3 />
                  <span>
                    <strong>{cmsText("page:7d48fab9b9d8", "Opening Hours")}</strong>
                    <small>{cmsText("page:9acba841c61e", "Please confirm service hours with our team")}</small>
                  </span>
                </div>
                <div className="card-actions">
                  <a
                    className="button button-outline"
                    href="/food-menu"
                  >
                    {cmsText("page:7420908456e4", "View Menu")}</a>
                  <a className="button" href="/restaurant#table-request">
                    {cmsText("page:f15cb5f4fd2a", "Request a Table")}</a>
                </div>
              </div>
            </div>
          </section>
          <section
            className="container section experiences-section reveal"
            id="explore"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">{cmsText("page:64dc8d0dc13e", "EXPLORE VARANASI")}</p>
                <h2>{cmsText("page:d59d88c1aaa1", "More than a visit. An experience.")}</h2>
              </div>
              <a
                className="text-link"
                href="/travel-packages"
              >
                {cmsText("page:31981fa26cf9", "Explore All Packages ")}<ArrowRight />
              </a>
            </div>
            <div className="three-grid">
              {experiences.map((experience, index) => (
                <article className="experience-card" key={experience.name}>
                  <a
                    className="image-button image-clip"
                    aria-label={`Discover ${experience.name}`}
                    href={`/travel-packages/${experience.id}`}
                  >
                    {mediaById(experience.imageMediaId) ? <ManagedImage mediaId={experience.imageMediaId} alt={experience.name} className="photo" /> : <Photo name={experience.photo} alt={experience.name} />}
                  </a>
                  <div className="experience-body">
                    <h3>{experience.name}</h3>
                    <p>{experience.description}</p>
                    <div className="amenities">
                      <span>
                        <Clock3 />
                        {experience.time}
                      </span>
                      <span>
                        <UsersRound />
                        {experience.includes}
                      </span>
                    </div>
                    <a
                      className="text-link"
                      href={`/travel-packages/${experience.id}`}
                    >
                      {cmsText("page:ea48c66d0f22", "View Package ")}<ArrowRight />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section
            className="container section stories-section reveal"
            aria-label="Guest stories"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">{cmsText("page:fcd900f103a0", "GUEST STORIES")}</p>
                <h2>{cmsText("page:5ba1b24b7aa9", "Memories, in their words.")}</h2>
              </div>
              <div className="story-controls">
                <span>
                  0{storyIndex + 1} <i>{cmsText("page:45218396d38b", "/ 03")}</i>
                </span>
                <button
                  aria-label="Previous guest story"
                  onClick={() => setStoryIndex((storyIndex + 2) % 3)}
                >
                  <ChevronLeft />
                </button>
                <button
                  aria-label="Next guest story"
                  onClick={() => setStoryIndex((storyIndex + 1) % 3)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="three-grid story-grid" aria-live="polite">
              {[0, 1, 2].map((offset) => {
                const story = stories[(storyIndex + offset) % stories.length];
                return (
                  <figure className="story-card" key={story.name}>
                    <span className="quote-mark">“</span>
                    <blockquote>“{story.quote}”</blockquote>
                    <figcaption>
                      <strong>{story.name}</strong>
                      <span>{story.city}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
          <section
            className="container section contact-section reveal"
            id="contact"
          >
            <p className="eyebrow">{cmsText("page:861d4a44907f", "FIND THE MUD HOUSE")}</p>
            <h2>{cmsText("page:914d9e0e2340", "Your Varanasi journey starts here.")}</h2>
            <div className="contact-grid">
              <a
                className="map-link"
                href="/contact#arrival"
                aria-label="Plan your arrival in Varanasi"
              >
                <TravelPhoto name="hero" className="photo" alt="Illustrative view of Varanasi’s riverfront" />
                <span>
                  <Navigation /> {cmsText("page:5df1d7f62739", "Plan Your Arrival")}</span>
              </a>
              <div className="contact-details">
                <div>
                  <MapPin />
                  <span>
                    <strong>{cmsText("page:56ef8f20955f", "Address")}</strong>
                    <p>
                      {cmsText("page:fbb0421af070", "Varanasi, Uttar Pradesh, India")}<br />
                      {cmsText("page:89d4a4978f56", "Exact address to confirm")}</p>
                  </span>
                </div>
                <div>
                  <Phone />
                  <span>
                    <strong>{cmsText("page:63dceb8800b2", "Phone")}</strong>
                    <a href="/contact#enquiry">{cmsText("page:4e6be8b9b54f", "Request contact details")}</a>
                  </span>
                </div>
                <div>
                  <Mail />
                  <span>
                    <strong>{cmsText("page:969ccbd3cf63", "Email")}</strong>
                    <a href={`mailto:${getSite()?.settings.email || "hello@themudhouse.in"}`}>
                      {cmsText("page:5b8b6b4b919a", "hello@themudhouse.in")}</a>
                  </span>
                </div>
                <div>
                  <MapPin />
                  <span>
                    <strong>{cmsText("page:d7c5285d8dc5", "How to Reach")}</strong>
                    <p>
                      {cmsText("page:eaa990fca243", "Ask the team to confirm your arrival point,")}<br />{cmsText("page:3a106f0fed25", "transfers and the final approach to the hotel.")}</p>
                  </span>
                </div>
                <div className="card-actions">
                  <a
                    className="button button-outline"
                    href="/contact#arrival"
                  >
                    {cmsText("page:1f0c4220bb26", "Plan Arrival")}</a>
                  <button
                    className="button"
                    onClick={() => enquire("Get in touch")}
                  >
                    {cmsText("page:98b67063cf8e", "Contact Us")}</button>
                </div>
              </div>
              <div className="story-arch" aria-hidden="true">
                <span>
                  {cmsText("page:2a98b1deb68c", "Same")}<br />
                  {cmsText("page:e4c31dfdbb83", "Roots")}<br />
                  {cmsText("page:18fdd549b2ed", "New")}<br />
                  {cmsText("page:6d09cf574882", "Stories")}<i>—</i>
                </span>
              </div>
            </div>
          </section>
          <section className="final-cta">
            <div className="container cta-inner">
              <div className="cta-arch" aria-hidden="true" />
              <div>
                <p className="eyebrow">{cmsText("page:6a25eb5ad04d", "YOUR NEXT CHAPTER AWAITS")}</p>
                <h2>{cmsText("page:f38b803bb05a", "Let’s plan your time in Kashi.")}</h2>
                <p>
                  {cmsText("page:c52024952013", "Room, table or a curated journey — we’re here to help you create a meaningful experience.")}</p>
                <span className="cta-services">
                  {cmsText("page:bd9c713a443f", "Stay ")}<i /> {cmsText("page:9306e5dcf088", "Restaurant Table ")}<i /> {cmsText("page:d21cfd1e73b6", "Travel Package ")}<i /> {cmsText("page:1ae99c009ab3", "Stay + Tour")}</span>
              </div>
              <div className="cta-actions">
                <button
                  className="button button-gold"
                  onClick={() => enquire()}
                >
                  {cmsText("page:3226316c5fb8", "Make an Enquiry ")}<ArrowRight />
                </button>
                <a
                  className="button button-light"
                  href="/contact#enquiry"
                >
                  <MessageCircle /> {cmsText("page:f51067b3df35", "Talk to Our Team")}</a>
              </div>
            </div>
          </section>
        </main>
      )}
      {isGuestSection ? <GuestFooter brand={<Brand />} /> : isExperiencePath ? (
        <ExperienceFooter
          fallback={!experiencePackage}
          brand={<ExperienceBrand />}
          onInfo={(title) => open({ kind: "info", title })}
          onGallery={() => open({ kind: "gallery", title: cmsText("page:729d82bcfeeb", "A glimpse of Kashi") })}
        />
      ) : isTravel ? (
        <TravelFooter
          brand={<Brand />}
          onInfo={(title) => open({ kind: "info", title })}
          onGallery={() => open({ kind: "gallery", title: cmsText("page:729d82bcfeeb", "A glimpse of Kashi") })}
        />
      ) : isDiningSection ? (
        <RestaurantFooter
          brand={<Brand location="VARANASI, INDIA" />}
          onInfo={(title) => open({ kind: "info", title })}
        />
      ) : isAbout ? (
        <AboutFooter
          brand={<Brand />}
          onInfo={(title) => open({ kind: "info", title })}
          onGallery={() =>
            open({ kind: "gallery", title: cmsText("page:cd7ee592b727", "The spaces at The Mud House") })
          }
          onMenu={() => window.location.assign("/food-menu")}
        />
      ) : isRoomSection ? (
        <RoomsFooter
          brand={<Brand />}
          onInfo={(title) => open({ kind: "info", title })}
          onGallery={() => open({ kind: "gallery", title: "Our rooms" })}
        />
      ) : (
        <footer>
          <div className="container footer-main">
            <div className="footer-brand">
              <Brand />
              <p>{cmsText("page:416546797714", "A warmer way to experience Kashi.")}</p>
              <div className="social-links">
                {[
                  { Icon: Instagram, name: "Instagram" },
                  { Icon: Facebook, name: "Facebook" },
                  { Icon: Youtube, name: "YouTube" },
                ].map(({ Icon, name }) => (
                  <button
                    key={name}
                    aria-label={name}
                    onClick={() =>
                      open({ kind: "info", title: `Follow The Mud House` })
                    }
                  >
                    <Icon />
                  </button>
                ))}
              </div>
            </div>
            <div className="footer-column">
              <h4>{cmsText("page:3b73900b8d29", "Explore")}</h4>
              {["Stay", "Dine", "Explore", "Gallery", "About", "Contact"].map(
                (item) =>
                  item === "Gallery" ? (
<a key={item} href="/gallery">{item}</a>
                  ) : (
                    <a
                      key={item}
                      href={
                        item === "About"
                          ? "/about"
                          : homeAnchor(item.toLowerCase())
                      }
                    >
                      {item}
                    </a>
                  ),
              )}
            </div>
            <div className="footer-column">
              <h4>{cmsText("page:1cb0ba125f84", "Information")}</h4>
              {[
                "FAQs",
                "Travel Tips",
                "House Rules",
                "Privacy Policy",
                "Terms & Conditions",
                "Cancellation & Refund Policy",
              ].map((item) => (
<a key={item} href={informationHref(item)}>{item}</a>
              ))}
            </div>
            <div className="footer-column footer-contact">
              <h4>{cmsText("page:2b5c3d26721a", "Contact")}</h4>
              <a href="#contact">
                <MapPin />
                <span>
                  {cmsText("page:6decded18038", "Address to confirm,")}<br />
                  {cmsText("page:fbb0421af070", "Varanasi, Uttar Pradesh, India")}</span>
              </a>
              <a href="/contact#enquiry">
                <Phone />
                {cmsText("page:4e6be8b9b54f", "Request contact details")}</a>
              <a href={`mailto:${getSite()?.settings.email || "hello@themudhouse.in"}`}>
                <Mail />
                {cmsText("page:5b8b6b4b919a", "hello@themudhouse.in")}</a>
            </div>
          </div>
          <div className="footer-bottom container">
            <p>
              © {new Date().getFullYear()} {cmsText("page:b25d8d260031", "The Mud House. All rights reserved.")}</p>
            <div>
              {[
                "Privacy Policy",
                "Terms & Conditions",
                "Cancellation & Refund Policy",
              ].map((item) => (
<a key={item} href={informationHref(item)}>{item}</a>
              ))}
            </div>
          </div>
        </footer>
      )}
      <Dialog
        open={!!modal}
        onOpenChange={(isOpen) => {
          if (!isOpen) setModal(null);
        }}
      >
        <DialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            modalReturnFocus.current?.focus();
          }}
          className={`hotel-dialog ${modal?.kind === "gallery" ? "gallery-dialog" : ""}`}
        >
          <p className="eyebrow">{cmsText("page:b391621c4356", "THE MUD HOUSE · VARANASI")}</p>
          <DialogTitle className="dialog-title">{modal?.title}</DialogTitle>
          <DialogDescription className="dialog-description">
            {modal?.kind === "enquiry"
              ? "A few details are all we need to help you plan your visit."
              : "Take a little time. Make yourself at home."}
          </DialogDescription>
          {modal?.kind === "enquiry" &&
            (prepared ? (
              <div className="enquiry-ready">
                <h3>{cmsText("page:5d752fc7757f", "Your request is ready to review.")}</h3>
                <p>{enquiryDraft.name} · {enquiryDraft.email}</p>
                <p>{enquiryDraft.message || modal.title}</p>
                <SendBookingRequest input={{type: checkIn && checkOut && !isDiningSection && !isTravelSection ? "stay" : "general", itemId: checkIn && checkOut && !isDiningSection && !isTravelSection ? roomDetail?.slug || getSite()?.rooms.find(room=>modal.title.includes(room.name))?.id : undefined, name:enquiryDraft.name, contact:enquiryDraft.email, method:"Email",date:checkIn||undefined,endDate:checkIn && checkOut ? checkOut : undefined,guests:Number(guests),rooms:requestedRooms,message:`${modal.title}\n${enquiryDraft.message}\nPhone: ${enquiryDraft.phone || "Not provided"}`}} emailHref={emailLink} onEdit={()=>setPrepared(false)} />
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={prepareEnquiry}>
                {!isDiningSection && !isTravelSection && (checkIn || checkOut || isRoomSection) && (
                  <div className="enquiry-summary">
                    <CalendarDays />
                    {checkIn
                      ? `${checkIn} → ${checkOut || "Flexible"}`
                      : "Flexible dates"}{" "}
                    · {guests} {guests === "1" ? "guest" : "guests"}
                    {isRoomSection && (
                      <>
                        {" "}
                        · {requestedRooms}{" "}
                        {requestedUnit === "beds"
                          ? requestedRooms === 1
                            ? "bed"
                            : "beds"
                          : requestedRooms === 1
                            ? "room"
                            : "rooms"}
                      </>
                    )}
                  </div>
                )}
                <div className="form-row">
                  <label>
                    {cmsText("page:2c6b2e253c01", "Your name")}<input
                      name="name"
                    defaultValue={enquiryDraft.name}
                      autoComplete="name"
                      required
                      placeholder="Full name"
                    />
                  </label>
                  <label>
                    {cmsText("page:f2488fd4ef4a", "Email address")}<input
                      name="email"
                    defaultValue={enquiryDraft.email}
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
                <label>
                  {cmsText("page:8549beac5d40", "Phone ")}<small>{cmsText("page:0059798b7f70", "(optional)")}</small>
                  <input
                    name="phone"
                    defaultValue={enquiryDraft.phone}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91"
                  />
                </label>
                <label>
                  {cmsText("page:0fcca76d365e", "Anything you have in mind?")}<textarea
                    name="message"
                    defaultValue={enquiryDraft.message}
                    rows={3}
                    placeholder={
                      isTravelSection
                        ? "Your travel dates, interests, or group requirements…"
                        : isDiningSection
                        ? "Menu questions, dietary needs, or access requirements…"
                        : "Your dates, preferred room, or a special occasion…"
                    }
                  />
                </label>
                <p className="form-note">
                  {cmsText("page:00144f6bfe58", "Review your details before sending your request to our team.")}</p>
                <button className="button" type="submit">
                  {cmsText("page:3627248f4a62", "Prepare Enquiry ")}<ArrowRight />
                </button>
              </form>
            ))}
          {modal?.kind === "catalog-room" && (
            <RoomDetailContent
              index={modal.index ?? 0}
              onEnquire={enquireStay}
            />
          )}
          {modal?.kind === "floor-plan" && (
            <FloorPlanContent
              index={modal.index ?? 0}
              onEnquire={enquireStay}
            />
          )}
          {modal?.kind === "room" &&
            (() => {
              const room = rooms[modal.index ?? 0];
              return (
                <div className="room-details">
                  <Photo name={room.photo} alt={room.name} />
                  <p>{room.description}</p>
                  <div className="detail-amenities">
                    <span>
                      <UsersRound />
                      {room.guests} {cmsText("page:21d1f8ed9293", "guests")}</span>
                    <span>
                      <BedDouble />
                      {room.beds}
                    </span>
                    <span>
                      <Expand />
                      {room.size} {cmsText("page:460c560f4303", "sq ft")}</span>
                    <span>
                      <Wifi />
                      {cmsText("page:337253f2e8d4", "Wi-Fi")}</span>
                    <span>
                      <Wind />
                      {cmsText("page:312860ed22f9", "Air conditioning")}</span>
                    <span>
                      <Coffee />
                      {cmsText("page:c9baaf5bf557", "Tea & coffee")}</span>
                  </div>
                  <p className="form-note">
                    {cmsText("page:0bd864b8d34d", "Contact our team for current rates and availability.")}</p>
                  <button className="button" onClick={() => enquire(room.name)}>
                    {cmsText("page:b5008cc6f7cb", "Enquire About This Room ")}<ArrowRight />
                  </button>
                </div>
              );
            })()}
          {modal?.kind === "experience" && (
            <div className="package-details">
              {(modal.index === undefined
                ? experiences
                : [experiences[modal.index]]
              ).map((exp) => (
                <article key={exp.name}>
                  <Photo name={exp.photo} alt={exp.name} />
                  <h3>{exp.name}</h3>
                  <p>{exp.detail}</p>
                  <div className="amenities">
                    <span>
                      <Clock3 />
                      {exp.time}
                    </span>
                    <span>
                      <UsersRound />
                      {exp.includes}
                    </span>
                  </div>
                  <button className="button" onClick={() => enquire(exp.name)}>
                    {cmsText("page:5136a411bccd", "Enquire About This Experience ")}<ArrowRight />
                  </button>
                </article>
              ))}
            </div>
          )}
          {modal?.kind === "menu" && (
            <div className="menu-content">
              <Photo name="food" alt="A selection of Indian dishes" />
              <p>
                {cmsText("page:e6688d5b0de7", "From a slow breakfast to a comforting dinner, discover North Indian favourites, local specialities and Continental dishes.")}</p>
              <div className="menu-row">
                <Utensils />
                <span>{cmsText("page:de8209db507b", "Seasonal, freshly prepared food")}</span>
              </div>
              <div className="menu-row">
                <Clock3 />
                <span>{cmsText("page:e8f6581849e8", "Every day · 7:00 AM – 11:00 PM")}</span>
              </div>
              <p className="form-note">
                {cmsText("page:7ad1b88b86a9", "Our menu changes with the season. Ask our team for the current menu, prices and dietary options.")}</p>
              <a
                className="button button-outline"
                href="mailto:hello@themudhouse.in?subject=Please%20share%20your%20current%20menu"
              >
                {cmsText("page:7ea47097bb1f", "Request Current Menu ")}<ArrowRight />
              </a>
              <button
                className="button"
                onClick={() => enquire("A table at The Mud House")}
              >
                {cmsText("page:f15cb5f4fd2a", "Request a Table")}</button>
            </div>
          )}
          {modal?.kind === "gallery" && (
            <div className="gallery-content">
              {isTravelSection ? (
                <>
                  <TravelPhoto name={gallery[(galleryIndex + (modal.index ?? 0)) % gallery.length] as TravelPhotoName} />
                  <p className="gallery-concept-note">{cmsText("page:46c1bf01fcfd", "Concept destination photography · Illustrative")}</p>
                </>
              ) : isDiningSection ? (
                <>
                  <RestaurantPhoto
                    name={
                      gallery[
                        (galleryIndex + (modal.index ?? 0)) % gallery.length
                      ] as RestaurantPhotoName
                    }
                  />
                  <p className="gallery-concept-note">
                    {cmsText("page:5bb37e9b26fb", "Concept photography · Restaurant details to confirm")}</p>
                </>
              ) : roomDetail ? (
                <>
                  <DetailPhotoView
                    photo={
                      roomDetail.photos[
                        (galleryIndex + (modal.index ?? 0)) % gallery.length
                      ]
                    }
                  />
                  <p className="gallery-concept-note">
                    {
                      roomDetail.photos[
                        (galleryIndex + (modal.index ?? 0)) % gallery.length
                      ].label
                    }
                  </p>
                </>
              ) : isRooms ? (
                <>
                  <RoomPhoto
                    name={
                      gallery[
                        (galleryIndex + (modal.index ?? 0)) % gallery.length
                      ] as RoomPhotoName
                    }
                  />
                  <p className="gallery-concept-note">
                    {cmsText("page:e92d3d7fa4cd", "Concept imagery · Room details are subject to availability.")}</p>
                </>
              ) : isAbout ? (
                <>
                  <AboutPhoto
                    name={
                      gallery[
                        (galleryIndex + (modal.index ?? 0)) % gallery.length
                      ]
                    }
                  />
                  <p className="gallery-concept-note">
                    {cmsText("page:afd9c5ec2a6e", "Concept imagery · Property inspiration")}</p>
                </>
              ) : (
                <Photo
                  name={
                    gallery[
                      (galleryIndex + (modal.index ?? 0)) % gallery.length
                    ]
                  }
                  alt="The Mud House gallery"
                />
              )}
              <div className="gallery-controls">
                <button
                  className="button button-outline"
                  aria-label="Previous photo"
                  onClick={() =>
                    setGalleryIndex(
                      (galleryIndex + gallery.length - 1) % gallery.length,
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <span aria-live="polite" aria-atomic="true">
                  {((galleryIndex + (modal.index ?? 0)) % gallery.length) + 1} /{" "}
                  {gallery.length}
                </span>
                <button
                  className="button button-outline"
                  aria-label="Next photo"
                  onClick={() =>
                    setGalleryIndex((galleryIndex + 1) % gallery.length)
                  }
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          )}
          {modal?.kind === "info" && (
            <div className="info-content">
              {policyHref(modal.title) && isPolicySlug(policyHref(modal.title)!.slice(1)) ? (
                <PolicyContent slug={policyHref(modal.title)!.slice(1) as import("./guest-policy-data").PolicySlug} compact />
              ) : modal.title === "Our story" ? (
                <>
                  <Photo name="lounge" alt="A quiet corner at The Mud House" />
                  <p>
                    {cmsText("page:f662319ffde5", "The Mud House is a warm, contemporary stay in the timeless city of Varanasi. Rooted in local heritage and designed for today’s traveller, we offer a comfortable base to rest, relish and explore the many layers of Kashi.")}</p>
                  <p>
                    {cmsText("page:daaf9292b5a4", "Thoughtful rooms. Honest food. A city full of stories. We look forward to being part of yours.")}</p>
                </>
              ) : modal.title === "Travel Tips" ? (
                <p>
                  {cmsText("page:8718127f0c6b", "Bring comfortable walking shoes for the old city’s lanes, dress respectfully when visiting temples, and make time for an early morning by the river. Our team can help you plan local experiences and transfers.")}</p>
              ) : modal.title === "FAQs" ? (
                <>
                  <h3>{cmsText("page:fcc92f1b1603", "How do I check availability?")}</h3>
                  <p>
                    {cmsText("page:6050a9a36905", "Choose your dates and send an enquiry. Our team will share availability and current rates.")}</p>
                  <h3>{cmsText("page:e7c08ca7df7a", "Can you help plan local experiences?")}</h3>
                  <p>
                    {cmsText("page:f493527f81a3", "Yes. Enquire about sunrise boat rides, heritage walks or a stay and explore package.")}</p>
                </>
              ) : modal.title === "Follow The Mud House" ? (
                <p>
                  {cmsText("page:d29f4de4ac5c", "Get in touch with our team for our official social channels and the latest stories from Kashi.")}</p>
              ) : (
                <p>
                  {cmsText("page:c69cb54bc80e", "Please contact our team for the current")}{" "}
                  {modal.title.toLowerCase()} {cmsText("page:1429763d1b56", "and any details relevant to your stay.")}</p>
              )}
              <button className="button" onClick={() => enquire(modal.title)}>
                {cmsText("page:22642da5ff18", "Talk to Our Team ")}<ArrowRight />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
