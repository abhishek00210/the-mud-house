import { cmsText, getSite, formatPrice, mediaById } from "../cms/client";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  ChevronRight,
  Clock3,
  Coffee,
  ConciergeBell,
  CreditCard,
  Mail,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Plus,
  Snowflake,
  UserRound,
  UsersRound,
  Utensils,
  Wifi,
} from "lucide-react";
import {
  RoomPhoto,
  roomCatalog,
  roomFAQs,
  type StaySelection,
} from "./rooms-data";
import "./rooms.css";

type RoomsProps = {
  onEnquire: (title?: string, selection?: StaySelection) => void;
  onDetails: (index: number, selection?: StaySelection) => void;
  onFloorPlan: (index: number, selection?: StaySelection) => void;
};

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function nextDay(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return localDate(new Date(year, month - 1, day + 1));
}

export function RoomsContent({
  onEnquire,
  onDetails,
  onFloorPlan,
}: RoomsProps) {
  const today = localDate(new Date());
  const stayForm = useRef<HTMLFormElement>(null);
  const [selection, setSelection] = useState<StaySelection>({
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1,
  });
  const [openFAQs, setOpenFAQs] = useState<number[]>([0]);

  function validOptionalStay() {
    return (
      (!selection.checkIn && !selection.checkOut) ||
      Boolean(stayForm.current?.reportValidity())
    );
  }

  function requestEnquiry(title: string) {
    if (validOptionalStay()) onEnquire(title, selection);
  }

  function viewRoom(index: number, floorPlan = false) {
    if (!validOptionalStay()) return;
    if (floorPlan) onFloorPlan(index, selection);
    else onDetails(index, selection);
  }

  function searchAvailability(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const checkOut = event.currentTarget.elements.namedItem(
      "checkOut",
    ) as HTMLInputElement;
    if (selection.checkOut <= selection.checkIn) {
      checkOut.setCustomValidity(
        "Please choose a check-out date after your check-in date.",
      );
      checkOut.reportValidity();
      return;
    }
    onEnquire("Room availability", selection);
  }

  return (
    <main className="rooms-page">
      <section className="stay-hero" aria-labelledby="rooms-title">
        <div className="stay-hero-photo">
          <RoomPhoto
            name="hero"
            alt="Warm guest room with a bed beside a sunlit balcony — concept photograph"
          />
        </div>
        <div className="stay-hero-wash" />
        <div className="container stay-hero-content">
          <nav className="stay-breadcrumb" aria-label="Breadcrumb">
            <a href="/">{cmsText("rooms:3a78695388b3", "Home")}</a>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{cmsText("rooms:c14bcb47fccc", "Rooms & Suites")}</span>
          </nav>
          <div className="stay-hero-copy">
            <p className="eyebrow">{cmsText("rooms:c14bcb47fccc", "Rooms & Suites")}</p>
            <h1 id="rooms-title">{cmsText("rooms:c14bcb47fccc", "Rooms & Suites")}</h1>
            <h2>{cmsText("rooms:afd13d78ffd6", "Find your space to unwind.")}</h2>
            <p>
              {cmsText("rooms:2e6b416cd855", "Thoughtfully designed rooms for every kind of traveller — from couples and families to groups on an adventure.")}</p>
            <div className="hero-actions">
              <a className="button" href="#room-list">
                {cmsText("rooms:43a05fdc5497", "Browse Rooms")}</a>
              <a className="button button-outline" href="#included">
                {cmsText("rooms:8da258386825", "Why Stay With Us?")}</a>
            </div>
          </div>
        </div>
        <span className="stay-hero-caption">
          {cmsText("rooms:b1a3c1c197ab", "A peaceful stay, a more meaningful tomorrow.")}</span>
      </section>

      <section
        className="container stay-search"
        id="availability"
        aria-labelledby="stay-search-title"
      >
        <div className="stay-search-heading">
          <h2 id="stay-search-title">{cmsText("rooms:bb570bb4bb12", "Tell us about your stay")}</h2>
          <p>{cmsText("rooms:bbd5d44fa5b8", "Plan your getaway with ease. Enquire directly with us.")}</p>
        </div>
        <form
          ref={stayForm}
          className="stay-search-form"
          onSubmit={searchAvailability}
        >
          <label className="stay-search-field">
            <span>{cmsText("rooms:20e82b4d236a", "Check in")}</span>
            <div className="stay-input-wrap">
              <CalendarDays aria-hidden="true" />
              <input
                aria-label="Check-in date"
                name="checkIn"
                type="date"
                required
                min={today}
                value={selection.checkIn}
                onChange={(event) =>
                  setSelection({
                    ...selection,
                    checkIn: event.target.value,
                    checkOut:
                      selection.checkOut > event.target.value
                        ? selection.checkOut
                        : "",
                  })
                }
              />
            </div>
          </label>
          <label className="stay-search-field">
            <span>{cmsText("rooms:326e405a5be3", "Check out")}</span>
            <div className="stay-input-wrap">
              <CalendarDays aria-hidden="true" />
              <input
                aria-label="Check-out date"
                name="checkOut"
                type="date"
                required
                min={nextDay(selection.checkIn || today)}
                value={selection.checkOut}
                onChange={(event) => {
                  event.target.setCustomValidity("");
                  setSelection({ ...selection, checkOut: event.target.value });
                }}
              />
            </div>
          </label>
          <label className="stay-search-field">
            <span>{cmsText("rooms:3c8e0fde6fcc", "Guests")}</span>
            <div className="stay-input-wrap">
              <UserRound aria-hidden="true" />
              <select
                name="guests"
                value={selection.guests}
                onChange={(event) =>
                  setSelection({
                    ...selection,
                    guests: Number(event.target.value),
                  })
                }
              >
                {Array.from({ length: 12 }, (_, index) => index + 1).map(
                  (count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? "guest" : "guests"}
                    </option>
                  ),
                )}
              </select>
            </div>
          </label>
          <label className="stay-search-field">
            <span>{cmsText("rooms:bd32f6cedb5f", "Rooms")}</span>
            <div className="stay-input-wrap">
              <BedDouble aria-hidden="true" />
              <select
                name="rooms"
                value={selection.rooms}
                onChange={(event) =>
                  setSelection({
                    ...selection,
                    rooms: Number(event.target.value),
                  })
                }
              >
                {Array.from({ length: 6 }, (_, index) => index + 1).map(
                  (count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? "room" : "rooms"}
                    </option>
                  ),
                )}
              </select>
            </div>
          </label>
          <button className="button" type="submit">
            {cmsText("rooms:c568fbb3c310", "Search Availability")}</button>
        </form>
      </section>

      <section
        className="container room-list"
        id="room-list"
        aria-labelledby="room-list-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">{cmsText("rooms:23f1ebe35319", "Our Rooms")}</p>
            <h2 id="room-list-title">{cmsText("rooms:928ce934c352", "A closer look at your stay.")}</h2>
          </div>
          <p className="rooms-concept-note">
            {cmsText("rooms:5d478c648ec0", "All photos are concept images. Room details are subject to availability.")}</p>
        </div>
        {roomCatalog.map((room, index) => {
          if (!room.enabled) return null;
          const dormitory = room.image === "dormitory";
          return (
            <article
              className="stay-room-card"
              id={`${room.image}-room`}
              key={room.name}
              aria-labelledby={`${room.image}-title`}
            >
              <figure className="stay-room-photo">
                <RoomPhoto
                  name={room.image}
                  alt={`${room.name} interior — concept photograph`}
                />
                <figcaption>{room.caption}</figcaption>
              </figure>
              <div className="stay-room-copy">
                <h3 id={`${room.image}-title`}>{room.name}</h3>
                <p className="description">{room.description}</p>
                {room.rate !== null && <p className="cms-managed-price">{cmsText("rooms:e484a95dcc85", "From ")}{formatPrice(room.rate)} {cmsText("rooms:85e5ec161240", "per night")}</p>}
                <a className="cms-booking-link" href={`/booking?type=stay&item=${room.image}-room`}>{room.bookingOpen ? "Request this room" : "Check with the team"}</a>
                <div
                  className={`stay-room-facts${dormitory ? " dorm-facts" : ""}`}
                >
                  <div>
                    <UserRound aria-hidden="true" />
                    <div>
                      <strong>{cmsText("rooms:e3564ac54f0c", "Occupancy")}</strong>
                      <small>
                        {room.occupancy}
                        {dormitory && (
                          <>
                            <br />
                            {cmsText("rooms:b5e7ba9927cd", "(multiple beds)")}</>
                        )}
                      </small>
                    </div>
                  </div>
                  <div>
                    <BedDouble aria-hidden="true" />
                    <div>
                      <strong>{room.beds}</strong>
                      <small>{room.bedDetail}</small>
                    </div>
                  </div>
                  <div>
                    {room.image === "premium" ? (
                      <Bath aria-hidden="true" />
                    ) : (
                      <Snowflake aria-hidden="true" />
                    )}
                    <div>
                      <strong>
                        {room.image === "premium" ? "Attached" : "Air"}
                      </strong>
                      <small>
                        {room.image === "premium" ? "Bathroom" : "Conditioned"}
                      </small>
                    </div>
                  </div>
                  {dormitory ? (
                    <>
                      <div>
                        <Bath aria-hidden="true" />
                        <div>
                          <strong>{cmsText("rooms:5834e3de2530", "Bathroom")}</strong>
                          <small>
                            {cmsText("rooms:ec5ba0abb717", "Access")}<br />
                            {cmsText("rooms:7e90de3739af", "(confirm arrangement)")}</small>
                        </div>
                      </div>
                      <div>
                        <UsersRound aria-hidden="true" />
                        <div>
                          <strong>{cmsText("rooms:f7cb5647f0c5", "Ideal for")}</strong>
                          <small>
                            {cmsText("rooms:dd6c63fea04e", "Groups /")}<br />
                            {cmsText("rooms:2f150676fe9c", "budget travellers")}</small>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <Wifi aria-hidden="true" />
                      <div>
                        <strong>{cmsText("rooms:40a759107d74", "Complimentary")}</strong>
                        <small>{cmsText("rooms:337253f2e8d4", "Wi-Fi")}</small>
                      </div>
                    </div>
                  )}
                </div>
                <p className="stay-room-facilities">
                  <strong>{cmsText("rooms:a1dec8ca2ced", "Key facilities:")}</strong>{" "}
                  {room.features.map((feature, featureIndex) => (
                    <span key={feature}>
                      {featureIndex > 0 && (
                        <span aria-hidden="true" className="facility-divider">
                          {" "}
                          |{" "}
                        </span>
                      )}
                      {feature}
                    </span>
                  ))}
                </p>
                <div className="stay-room-meta">
                  <p>
                    <strong>{cmsText("rooms:396138f0c380", "Meal plan:")}</strong> {cmsText("rooms:d57a3de5ba91", "Breakfast inclusion unconfirmed")}</p>
                  <button
                    className="text-link"
                    type="button"
                    onClick={() => viewRoom(index)}
                  >
                    {cmsText("rooms:460bca0addc1", "View room details ")}<ArrowRight aria-hidden="true" />
                  </button>
                </div>
                <div className="stay-room-actions">
                  <p>{cmsText("rooms:3f30510b7173", "Room is subject to availability.")}</p>
                  <button
                    className="button button-outline"
                    type="button"
                    onClick={() => viewRoom(index, true)}
                  >
                    {cmsText("rooms:97b6ec94e314", "View Floor Plan")}</button>
                  <button
                    className="button"
                    type="button"
                    onClick={() => requestEnquiry(room.name)}
                  >
                    {cmsText("rooms:53553949f5d6", "Check Rates & Book")}</button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section
        className="stay-included"
        id="included"
        aria-labelledby="stay-included-title"
      >
        <div className="container">
          <div className="section-heading">
            <h2 id="stay-included-title">{cmsText("rooms:011a3b0d74e6", "Know what’s included.")}</h2>
            <a className="text-link" href="/about#practical">
              {cmsText("rooms:174f1839da87", "Explore All Amenities ")}<ArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="stay-included-grid">
            <article className="stay-included-item">
              <Utensils aria-hidden="true" />
              <div>
                <h3>
                  {cmsText("rooms:7a2b28336c4d", "Room with")}<br />
                  {cmsText("rooms:94136ac6ec00", "breakfast (unconfirmed).")}</h3>
                <p>{cmsText("rooms:80e5edc0ccee", "Ask about your selected rate.")}</p>
                <small>{cmsText("rooms:ee64e34f6349", "A satisfying start to your day.")}</small>
              </div>
            </article>
            <article className="stay-included-item">
              <Coffee aria-hidden="true" />
              <div>
                <h3>
                  {cmsText("rooms:35d1508c5525", "Tea & coffee facilities")}<br />
                  {cmsText("rooms:35287768f97c", "in selected room categories.")}</h3>
                <p>{cmsText("rooms:ef7cf2b3eaeb", "A quiet moment, at your pace.")}</p>
                <small>{cmsText("rooms:c16ed4732118", "Details vary by room type.")}</small>
              </div>
            </article>
            <article className="stay-included-item">
              <ConciergeBell aria-hidden="true" />
              <div>
                <h3>
                  {cmsText("rooms:c47c792839c5", "Multi-cuisine dining")}<br />
                  {cmsText("rooms:24576513d592", "at The Mud House Café.")}</h3>
                <p>{cmsText("rooms:1742fe72c76d", "Come together over good food.")}</p>
                <small>{cmsText("rooms:1e231ace47de", "Local flavours, fresh ingredients.")}</small>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="container stay-planning"
        aria-labelledby="stay-planning-title"
      >
        <h2 id="stay-planning-title">{cmsText("rooms:9983cbf3c7d8", "The details that help you plan.")}</h2>
        <div className="stay-planning-grid">
          <div className="stay-policy-grid">
            <article className="stay-policy">
              <Clock3 aria-hidden="true" />
              <div>
                <h3>{cmsText("rooms:c832b0d0d927", "Check-in & Check-out")}</h3>
                <p>
                  {cmsText("rooms:2508103a49ac", "Arrival and departure times are unconfirmed. Please check with us before travelling.")}</p>
              </div>
            </article>
            <article className="stay-policy">
              <UsersRound aria-hidden="true" />
              <div>
                <h3>{cmsText("rooms:9b5796d78db2", "Children and extra beds")}</h3>
                <p>
                  {cmsText("rooms:3235637a3127", "Extra beds depend on availability and room type. Share your family’s needs when enquiring.")}</p>
              </div>
            </article>
            <article className="stay-policy">
              <PawPrint aria-hidden="true" />
              <div>
                <h3>{cmsText("rooms:bfc8abe9aab0", "Pets policy")}</h3>
                <p>
                  {cmsText("rooms:101e11a2937c", "Please contact our team to confirm the current pet policy before booking.")}</p>
              </div>
            </article>
            <article className="stay-policy">
              <CreditCard aria-hidden="true" />
              <div>
                <h3>{cmsText("rooms:ce1cd9374cce", "Payments and cancellation")}</h3>
                <p>
                  {cmsText("rooms:e0adba6ef7b1", "Terms may vary by rate plan. Please check payment and cancellation details with your quote.")}</p>
              </div>
            </article>
          </div>
          <aside className="stay-group-card">
            <h3>
              {cmsText("rooms:1620320f5bb5", "Have a special request")}<br />
              {cmsText("rooms:480dba88a231", "or travelling as a group?")}</h3>
            <p>
              {cmsText("rooms:921ad97b3fdb", "Let us know, and we’ll do our best to make your stay memorable.")}</p>
            <button
              className="button"
              type="button"
              onClick={() => requestEnquiry("Group stay or special request")}
            >
              {cmsText("rooms:bf2527e92575", "Enquire / Plan a Group Stay ")}<ArrowRight aria-hidden="true" />
            </button>
          </aside>
        </div>
      </section>

      <section
        className="container stay-faq"
        id="room-faq"
        aria-labelledby="room-faq-title"
      >
        <div className="section-heading">
          <h2 id="room-faq-title">{cmsText("rooms:96d1e2c75c54", "A few things you may be wondering.")}</h2>
          <button
            className="text-link"
            type="button"
            onClick={() =>
              setOpenFAQs(
                openFAQs.length === roomFAQs.length
                  ? [0]
                  : roomFAQs.map((_, index) => index),
              )
            }
          >
            {openFAQs.length === roomFAQs.length
              ? "Show Fewer FAQs"
              : "View All FAQs"}{" "}
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="stay-faq-list">
          {roomFAQs.map((faq, index) => (
            <details key={faq.question} open={openFAQs.includes(index)}>
              <summary
                onClick={(event) => {
                  event.preventDefault();
                  setOpenFAQs((current) =>
                    current.includes(index)
                      ? current.filter((item) => item !== index)
                      : [...current, index],
                  );
                }}
              >
                <ChevronRight aria-hidden="true" />
                <span>{faq.question}</span>
                <Plus aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="stay-final-cta" aria-labelledby="stay-cta-title">
        <div className="container stay-final-inner">
          <svg
            className="stay-cta-arch"
            viewBox="0 0 100 110"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 108V45L50 8l42 37v63M20 108V50l30-27 30 27v58M4 42 50 2l46 40M31 108V58l19-17 19 17v50"
              stroke="currentColor"
            />
          </svg>
          <div>
            <h2 id="stay-cta-title">{cmsText("rooms:d49f7f00d78b", "Let’s find the right room for you.")}</h2>
            <p>
              {cmsText("rooms:8826dd02c98b", "A stay at The Mud House is more than a room — it’s a deeper connection to place, people and possibility.")}</p>
          </div>
          <div className="stay-final-actions">
            <a className="button button-gold" href="#availability">
              {cmsText("rooms:c5edae1a2223", "Check Rates & Availability")}</a>
            <button
              className="button button-light"
              type="button"
              onClick={() => requestEnquiry("Group stay")}
            >
              {cmsText("rooms:93c366c6db62", "Plan a Group Stay")}</button>
            <small>{cmsText("rooms:dad2977bc415", "Questions? We’re happy to help. Enquire anytime.")}</small>
          </div>
        </div>
      </section>
    </main>
  );
}

export function RoomsFooter({
  brand,
  onInfo,
  onGallery,
}: {
  brand: ReactNode;
  onInfo: (title: string) => void;
  onGallery: () => void;
}) {
  return (
    <footer className="stay-footer">
      <div className="container stay-footer-main">
        <div className="stay-footer-brand">
          {brand}
          <p>
            {cmsText("rooms:61696ebd0a3a", "A soulful stay in the heart of Varanasi.")}<br />
            {cmsText("rooms:f03a13749609", "Comfort, culture and conscious travel")}<br />
            {cmsText("rooms:f93342c679d7", "for a more meaningful tomorrow.")}</p>
        </div>
        <div className="stay-footer-column">
          <h4>{cmsText("rooms:3b73900b8d29", "Explore")}</h4>
          <a href="/rooms">{cmsText("rooms:c14bcb47fccc", "Rooms & Suites")}</a>
          <a href="/restaurant">{cmsText("rooms:8ec581f650bf", "Dine With Us")}</a>
          <a href="/travel-packages">{cmsText("rooms:4fba88743a3c", "Things to Do")}</a>
          <a href="/gallery">{cmsText("rooms:352cfc749e55", "Gallery")}</a>
          <a href="/about">{cmsText("rooms:601462346fbd", "About The Mud House")}</a>
        </div>
        <div className="stay-footer-column">
          <h4>{cmsText("rooms:65561052edd2", "More from Us")}</h4>
          <a href="/travel-packages">{cmsText("rooms:8aac89740ef6", "Offers & Packages")}</a>
          <a href="/rooms/family-room">{cmsText("rooms:3f6970b3f6d8", "Family Stays")}</a>
          <a href="/contact?topic=groups#enquiry">{cmsText("rooms:78a5c5080877", "Group Stays")}</a>
          <a href="/contact">{cmsText("rooms:2b5c3d26721a", "Contact")}</a>
          <a href="/faqs">{cmsText("rooms:9856b7433f84", "FAQs")}</a>
        </div>
        <div className="stay-footer-column stay-footer-social">
          <h4>{cmsText("rooms:a344e93d547f", "Let’s Stay Connected")}</h4>
          <a href="/contact">
            <MapPin aria-hidden="true" />
            <span>{cmsText("rooms:82494ef5163e", "Varanasi · Address to confirm")}</span>
          </a>
          <a href="/contact#enquiry">
            <Phone aria-hidden="true" />
            <span>{cmsText("rooms:4e6be8b9b54f", "Request contact details")}</span>
          </a>
          <a href="/contact#enquiry">
            <MessageCircle aria-hidden="true" />
            <span>{cmsText("rooms:3d8baaa59f7d", "Chat with our team")}</span>
          </a>
          <a href="mailto:hello@themudhouse.in">
            <Mail aria-hidden="true" />
            <span>{cmsText("rooms:5b8b6b4b919a", "hello@themudhouse.in")}</span>
          </a>
        </div>
      </div>
      <div className="container stay-footer-bottom">
        <p>© {new Date().getFullYear()} {cmsText("rooms:b25d8d260031", "The Mud House. All rights reserved.")}</p>
        <div>
          <a href="/privacy-policy">{cmsText("rooms:506ff3946215", "Privacy Policy")}</a>
          <a href="/terms-and-conditions">{cmsText("rooms:173f5f9f26b4", "Terms & Conditions")}</a>
          <a href="/cancellation-refund-policy">{cmsText("rooms:8d41eb41c75f", "Cancellation Policy")}</a>
        </div>
      </div>
    </footer>
  );
}
