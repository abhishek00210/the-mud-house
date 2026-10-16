import { cmsText, getSite, formatPrice, mediaById } from "../cms/client";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Armchair,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  ConciergeBell,
  CreditCard,
  Droplets,
  Eye,
  FileText,
  Headphones,
  IndianRupee,
  Leaf,
  MapPin,
  MessageCircle,
  Monitor,
  Percent,
  Plus,
  Ruler,
  Shirt,
  ShowerHead,
  Snowflake,
  Square,
  Tag,
  Tv,
  UserRound,
  UsersRound,
  Utensils,
  Vault,
  Wifi,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type RoomDetailData,
  type DetailPhoto,
  DetailPhotoView,
  roomDetails,
  roomDetailHref,
  readStaySelection,
} from "./room-detail-data";
import type { StaySelection } from "./rooms-data";
import "./room-detail.css";

type RoomDetailProps = {
  room: RoomDetailData;
  onEnquire: (title: string, selection?: StaySelection) => void;
  onInfo: (title: string) => void;
};

function DetailFact({
  icon,
  label,
  value,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rd-fact ${className}`}>
      {icon}
      <div>
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
    </div>
  );
}

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function nextDay(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return localDate(new Date(year, month - 1, day + 1));
}

function amenityIcon(amenity: string) {
  if (/air conditioning/i.test(amenity)) return Snowflake;
  if (/wi-fi/i.test(amenity)) return Wifi;
  if (/bed|bunk/i.test(amenity)) return BedDouble;
  if (/tea|coffee/i.test(amenity)) return Coffee;
  if (/television/i.test(amenity)) return Tv;
  if (/safe|locker/i.test(amenity)) return Vault;
  if (/desk|charging/i.test(amenity)) return Monitor;
  if (/seating|spaces/i.test(amenity)) return Armchair;
  if (/bathroom/i.test(amenity)) return ShowerHead;
  if (/housekeeping/i.test(amenity)) return ConciergeBell;
  return Square;
}

function PhotoButton({
  photo,
  index,
  onOpen,
  className = "",
}: {
  photo: DetailPhoto;
  index: number;
  onOpen: (index: number, opener: HTMLElement) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`rd-photo-button ${className}`}
      aria-label={`View ${photo.alt}`}
      onClick={(event) => onOpen(index, event.currentTarget)}
    >
      <DetailPhotoView photo={photo} />
      <span className="rd-photo-caption">{photo.label}</span>
    </button>
  );
}
const hotelServices = [
  { icon: Utensils, label: "Restaurant on-site" },
  { icon: Clock3, label: "Front desk assistance" },
  { icon: Headphones, label: "Travel assistance" },
  { icon: Tag, label: "Luggage storage" },
  { icon: Shirt, label: "Laundry service" },
  { icon: UserRound, label: "Concierge support" },
];

export function RoomDetailPage({ room, onEnquire, onInfo }: RoomDetailProps) {
  const [selection, setSelection] = useState<StaySelection>(() => {
    const initial = readStaySelection(room.isDormitory ? 1 : 2);
    return {
      ...initial,
      rooms: Math.min(initial.rooms, room.isDormitory ? 12 : 6),
    };
  });
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const galleryOpener = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const today = localDate(new Date());
  useEffect(() => {
    const ids = [
      "overview",
      "amenities",
      "bathroom-access",
      "rates-policies",
      "room-questions",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  const gallery = [room.hero, ...room.photos];
  const bathroomPhoto = room.accessPhoto;
  if (!gallery.some((photo) => photo.id === bathroomPhoto.id))
    gallery.push(bathroomPhoto);
  const relatedRooms = room.related
    .map((slug) => roomDetails[slug])
    .filter((related): related is RoomDetailData => Boolean(related));

  function requestStay(title: string, requireDates = false) {
    if (
      (requireDates || selection.checkIn || selection.checkOut) &&
      !formRef.current?.reportValidity()
    ) {
      return;
    }
    onEnquire(title, selection);
  }

  function submitStay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    requestStay(`Enquire About ${room.name}`, true);
  }

  function openGallery(index: number, opener: HTMLElement) {
    galleryOpener.current = opener;
    setGalleryIndex(index);
  }

  function moveGallery(direction: number) {
    setGalleryIndex((current) =>
      current === null
        ? null
        : (current + direction + gallery.length) % gallery.length,
    );
  }

  return (
    <main className="room-detail-page">
      <div className="rd-container">
        <nav className="rd-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <a href="/">{cmsText("room-detail:3a78695388b3", "Home")}</a>
            </li>
            <li>
              <a href="/rooms">{cmsText("room-detail:c14bcb47fccc", "Rooms & Suites")}</a>
            </li>
            <li aria-current="page">{room.name}</li>
          </ol>
          <a href="/rooms" className="rd-back-link">
            <ArrowLeft aria-hidden="true" /> {cmsText("room-detail:ac8d756fe3fe", "Back to All Accommodation")}</a>
        </nav>

        <section className="rd-hero" aria-labelledby="room-detail-title">
          <div className="rd-hero-copy">
            <p className="rd-eyebrow">{cmsText("room-detail:1c43134d94cd", "Stay at The Mud House")}</p>
            <h1 id="room-detail-title">{room.name}</h1>
            {getSite()?.rooms.find(item=>item.id===room.slug)?.rate != null && <p className="cms-managed-price">{cmsText("room-detail:e484a95dcc85", "From ")}{formatPrice(getSite()!.rooms.find(item=>item.id===room.slug)!.rate!)} {cmsText("room-detail:85e5ec161240", "per night")}</p>}
            <a className="cms-booking-link" href={`/booking?type=stay&item=${room.slug}`}>{cmsText("room-detail:54d165a9cb2f", "Request this room")}</a>
            <p className="rd-category">{room.category}</p>
            <p className="rd-hero-description">{room.intro}</p>
            <p className="rd-concept-note">
              {cmsText("room-detail:88982f829370", "Room arrangements are subject to confirmation.")}</p>
          </div>
          <PhotoButton
            onOpen={openGallery}
            photo={room.hero}
            index={0}
            className="rd-hero-image"
          />
        </section>

        <div
          className="rd-photo-strip"
          aria-label={`${room.name} photo gallery`}
        >
          {room.photos.map((photo, index) => (
            <PhotoButton
              onOpen={openGallery}
              key={photo.id}
              photo={photo}
              index={index + 1}
            />
          ))}
        </div>

        <section className="rd-glance" aria-labelledby="room-glance-title">
          <h2 id="room-glance-title" className="rd-eyebrow">
            {cmsText("room-detail:46b396c85919", "At a glance")}</h2>
          <div className="rd-glance-grid">
            <DetailFact icon={<Ruler />} label={cmsText("room-detail:b0e831c41147", "Room size")} value="To confirm" />
            <DetailFact
              icon={<BedDouble />}
              label={cmsText("room-detail:2d0d2749f172", "Bed configuration")}
              value={room.bed}
            />
            <DetailFact
              icon={<UsersRound />}
              label={cmsText("room-detail:a66cf1355f83", "Maximum occupancy")}
              value={room.occupancy}
            />
            <DetailFact
              icon={<ShowerHead />}
              label={cmsText("room-detail:e741dc32bad3", "Bathroom arrangement")}
              value={room.bathroom}
            />
            <DetailFact icon={<Eye />} label={cmsText("room-detail:4503d116674e", "Actual view")} value={room.view} />
          </div>
        </section>

        <div className="rd-body-grid">
          <div className="rd-main">
            <nav className="rd-tabs" aria-label="Room detail sections">
              {[
                ["overview", "Overview"],
                ["amenities", "Amenities"],
                ["bathroom-access", "Bathroom & Access"],
                ["rates-policies", "Rates & Policies"],
                ["room-questions", "FAQs"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={activeSection === id ? "location" : undefined}
                  onClick={() => setActiveSection(id)}
                >
                  {label}
                </a>
              ))}
            </nav>

            <section
              className="rd-section rd-overview"
              id="overview"
              aria-labelledby="overview-title"
            >
              <p className="rd-eyebrow">{cmsText("room-detail:478e47e459be", "Your space")}</p>
              <h2 id="overview-title" className="rd-section-title">
                {cmsText("room-detail:54b0754a35c0", "Get to know your stay.")}</h2>
              <p className="rd-overview-description">{room.overview}</p>
              <div className="rd-overview-facts">
                <DetailFact
                  icon={<Square />}
                  label={cmsText("room-detail:eb0591067098", "Room area")}
                  value="To confirm"
                />
                <DetailFact
                  icon={<BedDouble />}
                  label={cmsText("room-detail:48a346aff9f2", "Bed type")}
                  value={room.bed}
                />
                <DetailFact
                  icon={<UsersRound />}
                  label={cmsText("room-detail:a66cf1355f83", "Maximum occupancy")}
                  value={room.occupancy}
                />
                <DetailFact
                  icon={<BedDouble />}
                  label={cmsText("room-detail:6d221d6b7a59", "Extra bed arrangement")}
                  value={room.extraBed}
                />
                <DetailFact
                  icon={<MapPin />}
                  label={cmsText("room-detail:f683af49008a", "Room location")}
                  value="To confirm"
                />
              </div>
            </section>

            <section
              className="rd-section rd-amenities"
              id="amenities"
              aria-labelledby="amenities-title"
            >
              <p className="rd-eyebrow">{cmsText("room-detail:de86553cc409", "In the details")}</p>
              <h2 id="amenities-title" className="rd-section-title">
                {cmsText("room-detail:f4f1e3d7bcbe", "What comes with your stay.")}</h2>
              <div className="rd-amenities-box">
                <h3>{cmsText("room-detail:fa7a5f35ea11", "Room Amenities")}</h3>
                <ul className="rd-amenities-list">
                  {room.amenities.map((amenity) => {
                    const Icon = amenityIcon(amenity);
                    return (
                      <li key={amenity}>
                        <Icon aria-hidden="true" />
                        <span>{amenity}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="rd-hotel-services">
                  <h3>{cmsText("room-detail:3741f4936026", "Hotel-wide Services")}</h3>
                  <ul className="rd-amenities-list">
                    {hotelServices.map(({ icon: Icon, label }) => (
                      <li key={label}>
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="rd-small-note">
                    {cmsText("room-detail:fcdbb781786d", "Please confirm facilities and any additional charges with the team.")}</p>
                </div>
              </div>
            </section>

            <section
              className="rd-section rd-access"
              id="bathroom-access"
              aria-labelledby="access-title"
            >
              <p className="rd-eyebrow">{cmsText("room-detail:52cb30acd65c", "Bathroom & access")}</p>
              <h2 id="access-title" className="rd-section-title">
                {cmsText("room-detail:5a9b5607aa93", "Know the details before you arrive.")}</h2>
              <div className="rd-access-grid">
                <PhotoButton
                  onOpen={openGallery}
                  photo={bathroomPhoto}
                  index={Math.max(
                    0,
                    gallery.findIndex((photo) => photo.id === bathroomPhoto.id),
                  )}
                  className="rd-bathroom-image"
                />
                <div className="rd-access-facts">
                  <DetailFact
                    icon={<ShowerHead />}
                    label={cmsText("room-detail:e741dc32bad3", "Bathroom arrangement")}
                    value={room.bathroom}
                  />
                  <DetailFact
                    icon={<Droplets />}
                    label={cmsText("room-detail:653689e0a761", "Hot water")}
                    value="Awaiting confirmation"
                  />
                  <DetailFact
                    icon={<Eye />}
                    label={cmsText("room-detail:52e195dbe944", "Actual view from room")}
                    value={room.view}
                  />
                  <DetailFact
                    icon={<MapPin />}
                    label={cmsText("room-detail:07fefcab4b7c", "Floor level")}
                    value="Awaiting confirmation"
                  />
                  <DetailFact
                    icon={<ArrowRight />}
                    label={cmsText("room-detail:b45580470187", "Lift or steps")}
                    value="Awaiting confirmation"
                  />
                  <DetailFact
                    icon={<Accessibility />}
                    label={cmsText("room-detail:7f4bc20fa3d5", "Room access details")}
                    value="Awaiting confirmation"
                  />
                </div>
              </div>
              <div className="rd-access-request">
                <Accessibility aria-hidden="true" />
                <div>
                  <h3>{cmsText("room-detail:a4f73c3cd0b7", "Have a particular access or sleeping requirement?")}</h3>
                  <p>
                    {cmsText("room-detail:3a2c82cbb557", "Let us know and we'll do our best to accommodate your needs.")}</p>
                </div>
                <button
                  type="button"
                  className="rd-button rd-button-primary"
                  onClick={() =>
                    requestStay(`${room.name}: access or sleeping requirements`)
                  }
                >
                  {cmsText("room-detail:da36b20feddd", "Discuss My Requirements")}</button>
              </div>
            </section>

            <section
              className="rd-section rd-rates"
              id="rates-policies"
              aria-labelledby="rates-title"
            >
              <p className="rd-eyebrow">{cmsText("room-detail:760a6ac46491", "Plan with clarity")}</p>
              <h2 id="rates-title" className="rd-section-title">
                {cmsText("room-detail:2b6f151cf78a", "Rates, inclusions, and the useful details.")}</h2>
              <div className="rd-rate-facts">
                <DetailFact
                  icon={<IndianRupee />}
                  label={room.isDormitory ? "Bed rate" : "Room rate"}
                  value="Request a rate for your dates"
                />
                <DetailFact
                  icon={<FileText />}
                  label={cmsText("room-detail:d7e008583472", "Booking basis")}
                  value="To confirm"
                />
                <DetailFact
                  icon={<Utensils />}
                  label={cmsText("room-detail:dbb3fc7d9ca4", "Meal plan")}
                  value="To confirm"
                />
                <DetailFact
                  icon={<Percent />}
                  label={cmsText("room-detail:1bb2e5e8fe57", "Taxes & charges")}
                  value="To confirm"
                />
                <DetailFact
                  icon={<Clock3 />}
                  label={cmsText("room-detail:a38b8d21eab4", "Check-in / Check-out")}
                  value="To confirm"
                />
                <DetailFact
                  icon={<CreditCard />}
                  label={cmsText("room-detail:bf75ba3dc3f1", "Payment / deposit")}
                  value="To confirm"
                />
                <DetailFact
                  icon={<CalendarDays />}
                  label={cmsText("room-detail:53c8fc0bacc0", "Cancellation")}
                  value="To confirm"
                />
              </div>
              <button
                type="button"
                className="rd-text-link"
                onClick={() => onInfo("Cancellation & Refund Policy")}
              >
                {cmsText("room-detail:ae4f127cb3d7", "Read Cancellation & Refund Policy")}{" "}
                <ArrowRight aria-hidden="true" />
              </button>
            </section>
          </div>

          <aside
            className="rd-sidebar"
            aria-label={`${room.name} enquiry and recommendations`}
          >
            <div className="rd-enquiry-card" id="room-enquiry">
              <h2>{cmsText("room-detail:1b6f4b312e23", "Enquire About ")}{room.name}</h2>
              <div className="rd-enquiry-room">
                <DetailPhotoView photo={room.hero} />
                <div>
                  <h3>{room.name}</h3>
                  <p>{room.category}</p>
                </div>
              </div>
              <form
                ref={formRef}
                onSubmit={submitStay}
                className="rd-stay-form"
              >
                <div className="rd-form-grid">
                  <label className="rd-form-field">
                    <span>{cmsText("room-detail:adc719587244", "Check-in")}</span>
                    <div>
                      <CalendarDays aria-hidden="true" />
                      <input
                        aria-label="Check-in"
                        type="date"
                        name="checkIn"
                        min={today}
                        required
                        value={selection.checkIn}
                        onChange={(event) => {
                          const value = event.target.value;
                          setSelection((current) => ({
                            ...current,
                            checkIn: value,
                            checkOut:
                              current.checkOut && current.checkOut <= value
                                ? ""
                                : current.checkOut,
                          }));
                        }}
                      />
                    </div>
                  </label>
                  <label className="rd-form-field">
                    <span>{cmsText("room-detail:93061eff839d", "Check-out")}</span>
                    <div>
                      <CalendarDays aria-hidden="true" />
                      <input
                        aria-label="Check-out"
                        type="date"
                        name="checkOut"
                        min={
                          selection.checkIn
                            ? nextDay(selection.checkIn)
                            : nextDay(today)
                        }
                        required
                        value={selection.checkOut}
                        onChange={(event) =>
                          setSelection((current) => ({
                            ...current,
                            checkOut: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </label>
                  <label className="rd-form-field">
                    <span>{cmsText("room-detail:3c8e0fde6fcc", "Guests")}</span>
                    <div>
                      <UserRound aria-hidden="true" />
                      <select
                        aria-label="Guests"
                        name="guests"
                        value={selection.guests}
                        onChange={(event) =>
                          setSelection((current) => ({
                            ...current,
                            guests: Number(event.target.value),
                            rooms: room.isDormitory
                              ? Math.max(
                                  current.rooms,
                                  Number(event.target.value),
                                )
                              : current.rooms,
                          }))
                        }
                      >
                        {Array.from(
                          { length: 12 },
                          (_, index) => index + 1,
                        ).map((count) => (
                          <option key={count} value={count}>
                            {count} {count === 1 ? "guest" : "guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                  <label className="rd-form-field">
                    <span>
                      {room.isDormitory ? "Beds requested" : "Rooms requested"}
                    </span>
                    <div>
                      <BedDouble aria-hidden="true" />
                      <select
                        aria-label={
                          room.isDormitory
                            ? "Beds requested"
                            : "Rooms requested"
                        }
                        name="rooms"
                        value={selection.rooms}
                        onChange={(event) =>
                          setSelection((current) => ({
                            ...current,
                            rooms: Number(event.target.value),
                          }))
                        }
                      >
                        {Array.from(
                          { length: room.isDormitory ? 12 : 6 },
                          (_, index) => index + 1,
                        ).map((count) => (
                          <option
                            key={count}
                            value={count}
                            disabled={
                              room.isDormitory && count < selection.guests
                            }
                          >
                            {count}{" "}
                            {room.isDormitory
                              ? count === 1
                                ? "bed"
                                : "beds"
                              : count === 1
                                ? "room"
                                : "rooms"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
                <div className="rd-rate-request">
                  <Tag aria-hidden="true" />
                  <div>
                    <h3>{cmsText("room-detail:17dbd4494ed9", "Request a rate for your dates")}</h3>
                    <p>
                      {cmsText("room-detail:c41bc72a6113", "Availability and rates will be confirmed by the hotel.")}</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="rd-button rd-button-primary rd-enquiry-submit"
                >
                  {cmsText("room-detail:fae9df9ee9bd", "Continue to Enquiry")}</button>
              </form>
              <div className="rd-next-steps">
                <p className="rd-eyebrow">{cmsText("room-detail:9f49b64d9a44", "Your details (next step)")}</p>
                <DetailFact
                  icon={<UserRound />}
                  label={cmsText("room-detail:e34006b5ed3b", "Guest name")}
                  value="To be provided"
                />
                <DetailFact
                  icon={<MessageCircle />}
                  label={cmsText("room-detail:c16b4e117b15", "Preferred contact method")}
                  value="Email, with an optional phone number"
                />
                <DetailFact
                  icon={<Leaf />}
                  label={cmsText("room-detail:202dd79d8b81", "Any special requirements? (Optional)")}
                  value="E.g. extra bed, accessibility, early check-in"
                />
              </div>
              <div className="rd-enquiry-notice">
                <CheckCircle2 aria-hidden="true" />
                <p>
                  <strong>{cmsText("room-detail:171cccc0bbc4", "This is an enquiry, not a confirmed booking.")}</strong>{" "}
                  {cmsText("room-detail:f927a6344568", "Our team will get back to you with availability and rate details.")}</p>
              </div>
            </div>

            <div className="rd-help-card">
              <Headphones aria-hidden="true" />
              <div>
                <h3>{cmsText("room-detail:3c9b7d044c3d", "Need help choosing?")}</h3>
                <p>
                  {cmsText("room-detail:bea2b2d06b8e", "Our team is here to assist you with room details and recommendations.")}</p>
                <button
                  type="button"
                  className="rd-button rd-button-outline"
                  onClick={() =>
                    requestStay(`Help choosing a stay: ${room.name}`)
                  }
                >
                  {cmsText("room-detail:98b67063cf8e", "Contact Us")}</button>
              </div>
            </div>

            <section className="rd-related" aria-labelledby="related-title">
              <p className="rd-eyebrow">{cmsText("room-detail:925a46fefcd1", "You may also like")}</p>
              <h2 id="related-title" className="rd-section-title">
                {cmsText("room-detail:f6662df06197", "Explore another way to stay.")}</h2>
              <div className="rd-related-grid">
                {relatedRooms.map((related) => (
                  <article className="rd-related-card" key={related.slug}>
                    <a
                      href={roomDetailHref(related.slug, selection)}
                      className="rd-related-image"
                      aria-label={`View ${related.name}`}
                    >
                      <DetailPhotoView photo={related.hero} />
                      <span className="rd-photo-caption">{cmsText("room-detail:cc8a6aec1060", "Concept image")}</span>
                    </a>
                    <div className="rd-related-copy">
                      <h3>{related.name}</h3>
                      <p>{related.intro}</p>
                      <a
                        href={roomDetailHref(related.slug, selection)}
                        className="rd-text-link"
                      >
                        {cmsText("room-detail:adaa39192dfd", "View Details ")}<ArrowRight aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section
          className="rd-faq-section"
          id="room-questions"
          aria-labelledby="room-questions-title"
        >
          <p className="rd-eyebrow">{cmsText("room-detail:170c554f6d94", "Questions & answers")}</p>
          <h2 id="room-questions-title" className="rd-section-title">
            {cmsText("room-detail:1db26b10b7ca", "Questions about this stay.")}</h2>
          <div className="rd-faq-grid">
            {room.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="rd-faq-item"
                open={index === 0 ? true : undefined}
              >
                <summary>
                  <ChevronRight aria-hidden="true" />
                  <span>{faq.question}</span>
                  <Plus className="rd-faq-plus" aria-hidden="true" />
                  <ChevronDown className="rd-faq-minus" aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <section className="rd-bottom-cta" aria-labelledby="room-cta-title">
        <div className="rd-container">
          <Leaf className="rd-cta-art" aria-hidden="true" />
          <div>
            <h2 id="room-cta-title">{cmsText("room-detail:3af43e4cfdc1", "Let's plan your stay at The Mud House.")}</h2>
            <p>
              {cmsText("room-detail:f107021380d6", "Share your travel plans and we'll be happy to help you with availability and details.")}</p>
          </div>
          <div className="rd-cta-actions">
            <button
              type="button"
              className="rd-button rd-button-gold"
              onClick={() => requestStay(`Enquire About ${room.name}`)}
            >
              {cmsText("room-detail:5a613a469b6a", "Enquire About This Stay")}</button>
            <a href="/rooms" className="rd-button rd-button-outline">
              {cmsText("room-detail:8044c7a25e99", "View All Accommodation")}</a>
          </div>
        </div>
      </section>

      <Dialog
        open={galleryIndex !== null}
        onOpenChange={(open) => {
          if (!open) setGalleryIndex(null);
        }}
      >
        <DialogContent
          className="rd-gallery-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            galleryOpener.current?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveGallery(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              moveGallery(1);
            }
          }}
        >
          <DialogTitle>{room.name} {cmsText("room-detail:ce387d5e0a29", "gallery")}</DialogTitle>
          <DialogDescription>
            {cmsText("room-detail:9e3133d55a3f", "Concept imagery. Actual room photographs and views are pending confirmation.")}</DialogDescription>
          {galleryIndex !== null && (
            <>
              <DetailPhotoView
                photo={gallery[galleryIndex]}
                className="rd-gallery-photo"
              />
              <div className="rd-gallery-controls">
                <button
                  type="button"
                  className="rd-button rd-button-outline"
                  aria-label="Previous photograph"
                  onClick={() => moveGallery(-1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <p aria-live="polite">
                  {galleryIndex + 1} {cmsText("room-detail:4acb731c0d11", "of ")}{gallery.length} ·{" "}
                  {gallery[galleryIndex].alt}
                </p>
                <button
                  type="button"
                  className="rd-button rd-button-outline"
                  aria-label="Next photograph"
                  onClick={() => moveGallery(1)}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
