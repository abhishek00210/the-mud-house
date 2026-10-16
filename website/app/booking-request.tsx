import { cmsText } from "../cms/client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, LoaderCircle, ShieldCheck } from "lucide-react";
import { getSite, submitBooking } from "../cms/client";
import type { BookingInput, CmsState, DateBlock } from "../cms/types";
import { GuestBreadcrumb, GuestPhoto } from "./guest-shared";
import "./booking-request.css";

type PublicRequest = Omit<BookingInput, "requestId" | "consent">;
type Receipt = { id: string; reference: string; status: string };

export function bookingAvailability(input: Pick<BookingInput, "type" | "itemId" | "date" | "endDate">, site = getSite()): string | null {
  if (!site || input.type === "general") return null;
  const settings = site.settings;
  if (!settings.bookingsOpen || (input.type === "stay" && !settings.staysOpen) || (input.type === "dining" && !settings.diningOpen) || (input.type === "experience" && !settings.experiencesOpen)) {
    return settings.closedMessage || "We’re not accepting new requests for this service right now. Please contact us with any questions.";
  }
  const item = input.type === "stay" ? site.rooms.find((room) => room.id === input.itemId) : input.type === "experience" ? site.packages.find((experience) => experience.id === input.itemId) : undefined;
  if (input.itemId && input.type !== "dining" && !item) return "This option is no longer available. Please choose another.";
  if (item && (!item.enabled || !item.bookingOpen)) return "Requests for this option are currently closed. Please choose another option or contact us.";
  if (item && input.date && overlapsBlockedDate(input.type, input.date, input.endDate, item.blockedDates)) return "Your dates overlap an unavailable period. Please choose different dates or another option.";
  return null;
}

function overlapsBlockedDate(type: BookingInput["type"], date: string, endDate: string | undefined, blocks: DateBlock[]) {
  return blocks.some((block) => date <= block.to && (type === "stay" && endDate ? endDate > block.from : (endDate || date) >= block.from));
}

/** One review keeps its request ID through uncertain network retries. */
export function SendBookingRequest({ input, privacyAcknowledged = false, emailHref, className = "", onEdit }: {
  input: PublicRequest;
  privacyAcknowledged?: boolean;
  emailHref?: string;
  className?: string;
  onEdit?: () => void;
}) {
  const [consent, setConsent] = useState(privacyAcknowledged);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const requestId = useRef(crypto.randomUUID());
  const busy = useRef(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const unavailable = bookingAvailability(input);

  useEffect(() => { if (receipt) responseRef.current?.focus(); }, [receipt]);

  async function send() {
    if (busy.current || receipt) return;
    if (!consent) { setError("Please acknowledge the privacy information before sending."); return; }
    if (unavailable) { setError(unavailable); return; }
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const result = await submitBooking({ ...input, consent: true, requestId: requestId.current });
      setReceipt(result);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "We couldn’t send your request. Your details are still here; please try again.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  if (receipt) return <div className={`booking-delivery booking-delivery--received ${className}`} ref={responseRef} tabIndex={-1} role="status">
    <CheckCircle2 aria-hidden="true" /><div><h3>{cmsText("booking-request:2508ed4a8444", "Request received.")}</h3><p>{cmsText("booking-request:08e968290930", "Your reference is ")}<strong>{receipt.reference}</strong>.</p><p>{cmsText("booking-request:fbed14f05999", "It is saved for the hotel team to review. Your booking is not confirmed; the team will need to confirm availability and arrangements with you.")}</p></div>
  </div>;

  return <div className={`booking-delivery ${className}`} aria-busy={pending}>
    {!privacyAcknowledged && <label className="booking-consent"><input type="checkbox" checked={consent} disabled={pending} onChange={(event) => { setConsent(event.target.checked); setError(""); }} /><span>{cmsText("booking-request:d2533d04d958", "I have read the ")}<a href="/privacy-policy" target="_blank" rel="noreferrer">{cmsText("booking-request:d5f03bc24d3c", "privacy information")}</a> {cmsText("booking-request:920e8ce6b168", "and agree to send these details to the hotel.")}</span></label>}
    {unavailable && <p className="booking-closed-message" role="status">{unavailable} <a href="/contact">{cmsText("booking-request:44635127331a", "Contact the team")}</a></p>}
    {error && <p className="booking-delivery-error" role="alert">{error}</p>}
    <div className="booking-delivery-actions"><button className="booking-primary" type="button" disabled={pending || !!unavailable || !consent} onClick={send}>{pending ? <><LoaderCircle className="booking-spinner" aria-hidden="true" /> {cmsText("booking-request:94b1ce97199d", "Sending request…")}</> : <>{cmsText("booking-request:068c2ff45cff", "Send request to hotel ")}<ArrowRight aria-hidden="true" /></>}</button>{onEdit && <button className="booking-secondary" type="button" disabled={pending} onClick={onEdit}>{cmsText("booking-request:e2898fd9d575", "Edit your request")}</button>}</div>
    <p className="booking-delivery-note">{cmsText("booking-request:b1b8c93aa37f", "An enquiry is not a confirmed booking. No payment is taken here.")}</p>
    {emailHref && error && <a className="booking-email-fallback" href={emailHref}>{cmsText("booking-request:f3daf1a5e30d", "Prefer email? Open an email draft instead ")}<ArrowRight aria-hidden="true" /></a>}
  </div>;
}

type BookingForm = { type: BookingInput["type"]; itemId: string; name: string; method: BookingInput["method"]; contact: string; date: string; endDate: string; time: string; guests: string; rooms: string; message: string; consent: boolean; website: string };
type BookingIssue = { field: keyof BookingForm; message: string };

function hotelToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function realDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateBookingForm(request: BookingForm, site: CmsState | null, now = new Date()): BookingIssue | null {
  if (!["stay", "dining", "experience", "general"].includes(request.type)) return { field: "type", message: "Please choose a request type." };
  if ((request.type === "stay" || request.type === "experience") && !request.itemId) return { field: "itemId", message: "Please choose a room or experience." };
  if (request.type !== "general" || request.date) {
    if (!realDate(request.date) || request.date < hotelToday(now)) return { field: "date", message: "Please choose today or a future date in Varanasi." };
  }
  if (request.type === "stay" && (!realDate(request.endDate) || request.endDate <= request.date)) return { field: "endDate", message: "Check-out must be after your check-in date." };
  if (request.type === "experience" && request.endDate && (!realDate(request.endDate) || request.endDate < request.date)) return { field: "endDate", message: "The end date must be on or after your preferred date." };
  if (request.type === "dining" && (!/^([01]\d|2[0-3]):[0-5]\d$/.test(request.time) || new Date(`${request.date}T${request.time}:00+05:30`).getTime() <= now.getTime())) return { field: "time", message: "Please choose a future time in Varanasi (IST)." };
  const availability = bookingAvailability(request, site);
  if (availability) return { field: request.itemId ? "date" : "type", message: availability };
  if (!/^\d+$/.test(request.guests) || Number(request.guests) < 1 || Number(request.guests) > 99) return { field: "guests", message: "Please enter between 1 and 99 guests." };
  if (request.type === "stay" && (!/^\d+$/.test(request.rooms) || Number(request.rooms) < 1 || Number(request.rooms) > 20)) return { field: "rooms", message: "Please enter between 1 and 20 rooms or beds." };
  if (!request.name.trim() || request.name.trim().length > 120) return { field: "name", message: "Please enter your name, using up to 120 characters." };
  if (!["Email", "Phone", "WhatsApp"].includes(request.method)) return { field: "method", message: "Please choose a preferred contact method." };
  const contact = request.contact.trim();
  if (request.method === "Email" ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) : !/^\+?[\d\s().-]+$/.test(contact) || contact.replace(/\D/g, "").length < 7 || contact.replace(/\D/g, "").length > 15) return { field: "contact", message: `Please enter a valid ${request.method === "Email" ? "email address" : "phone number"}.` };
  if (!request.consent) return { field: "consent", message: "Please acknowledge the privacy information." };
  return null;
}

function initialBooking(): BookingForm {
  const params = new URLSearchParams(window.location.search);
  const selectedType = params.get("type");
  const type: BookingInput["type"] = selectedType === "dining" || selectedType === "experience" || selectedType === "general" ? selectedType : "stay";
  return { type, itemId: params.get("item") || "", name: "", method: "Email", contact: "", date: params.get("date") || "", endDate: params.get("endDate") || "", time: "", guests: params.get("guests") || "2", rooms: "1", message: "", consent: false, website: "" };
}

function toInput(request: BookingForm): PublicRequest {
  return { type: request.type, itemId: request.type === "stay" || request.type === "experience" ? request.itemId : undefined, name: request.name.trim(), contact: request.contact.trim(), method: request.method, date: request.date || undefined, endDate: request.type === "stay" || request.type === "experience" ? request.endDate || undefined : undefined, time: request.type === "dining" ? request.time : undefined, guests: Number(request.guests), rooms: request.type === "stay" ? Number(request.rooms) : undefined, message: request.message.trim(), website: request.website };
}

export function BookingRequestPage() {
  const site = getSite();
  const [request, setRequest] = useState<BookingForm>(initialBooking);
  const [issue, setIssue] = useState<BookingIssue | null>(null);
  const [prepared, setPrepared] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const rooms = site?.rooms.filter((room) => room.enabled) || [];
  const packages = site?.packages.filter((experience) => experience.enabled) || [];
  const options = request.type === "stay" ? rooms : packages;
  const selected = options.find((item) => item.id === request.itemId);
  const unavailable = bookingAvailability(request, site);
  const typeName = { stay: "Room request", dining: "Table request", experience: "Experience enquiry", general: "General enquiry" }[request.type];
  const imageSource = request.type === "dining" ? "restaurant" : request.type === "experience" ? "travel" : "rooms";

  useEffect(() => { if (prepared) reviewRef.current?.focus(); }, [prepared]);

  function update<K extends keyof BookingForm>(field: K, value: BookingForm[K]) {
    setRequest((current) => ({ ...current, [field]: value, ...(field === "type" ? { itemId: "", endDate: "", time: "" } : {}), ...(field === "method" ? { contact: "" } : {}) }));
    setIssue(null);
  }
  function invalid(field: keyof BookingForm) { return { "aria-invalid": issue?.field === field || undefined, "aria-describedby": issue?.field === field ? "booking-form-error" : undefined }; }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateBookingForm(request, site);
    setIssue(validation);
    if (validation) { (formRef.current?.elements.namedItem(validation.field) as HTMLElement | null)?.focus(); return; }
    setPrepared(true);
  }

  return <main className="guest-page booking-page"><GuestBreadcrumb current="Plan your booking" /><section className="guest-container booking-layout">
    <aside className="booking-intro"><p className="guest-eyebrow">{cmsText("booking-request:b391621c4356", "THE MUD HOUSE · VARANASI")}</p><h1>{cmsText("booking-request:245af558d28f", "A little planning.")}<br />{cmsText("booking-request:2963d5376ce0", "A warmer welcome.")}</h1><p>{cmsText("booking-request:15649646b363", "Tell us about your visit. We’ll review your request and get in touch about availability and the details.")}</p><figure><GuestPhoto source={imageSource} name="hero" alt={`${request.type === "dining" ? "Warm restaurant" : request.type === "experience" ? "Varanasi riverfront" : "Warm guest room"} concept photograph`} /><figcaption>{cmsText("booking-request:c531936f74fc", "Concept photography · Illustrative")}</figcaption></figure><ol className="booking-next-steps"><li><CalendarDays aria-hidden="true" /><div><h2>{cmsText("booking-request:e69a46fa64a1", "Share your plans")}</h2><p>{cmsText("booking-request:8eed9ce96860", "Choose your dates and what you have in mind.")}</p></div></li><li><Clock3 aria-hidden="true" /><div><h2>{cmsText("booking-request:527b562daa6d", "Hear from the team")}</h2><p>{cmsText("booking-request:602299dd8da4", "We’ll review availability, pricing and your requirements.")}</p></div></li><li><ShieldCheck aria-hidden="true" /><div><h2>{cmsText("booking-request:a11d27e7bca7", "Confirm together")}</h2><p>{cmsText("booking-request:37beb8954610", "Your booking is confirmed only after the hotel agrees the arrangements with you.")}</p></div></li></ol><a className="guest-text-link" href="/contact">{cmsText("booking-request:a81347c27c71", "Have a question first? Contact us ")}<ArrowRight aria-hidden="true" /></a></aside>
    <div className="booking-form-panel">{prepared ? <section className="booking-review"><p className="guest-eyebrow">{cmsText("booking-request:1409d0d4c00e", "REVIEW YOUR REQUEST")}</p><h2 ref={reviewRef} tabIndex={-1}>{cmsText("booking-request:182bf2ce919b", "Ready when you are.")}</h2><p>{cmsText("booking-request:a00572b9dab4", "Check your details, then send your request to the hotel.")}</p><dl><div><dt>{cmsText("booking-request:59f03d642b41", "Request")}</dt><dd>{typeName}</dd></div>{selected && <div><dt>{request.type === "stay" ? "Room" : "Experience"}</dt><dd>{selected.name}</dd></div>}{request.date && <div><dt>{cmsText("booking-request:f60508fbafe4", "Preferred dates")}</dt><dd>{request.date}{request.endDate && ` to ${request.endDate}`}{request.type === "dining" && ` at ${request.time} IST`}</dd></div>}<div><dt>{cmsText("booking-request:3c8e0fde6fcc", "Guests")}</dt><dd>{request.guests}{request.type === "stay" && ` · ${request.rooms} ${request.itemId === "dormitory-room" ? "bed(s)" : "room(s)"}`}</dd></div><div><dt>{cmsText("booking-request:e34006b5ed3b", "Guest name")}</dt><dd>{request.name.trim()}</dd></div><div><dt>{cmsText("booking-request:269930f8106e", "Reply by ")}{request.method}</dt><dd>{request.contact.trim()}</dd></div>{request.message.trim() && <div><dt>{cmsText("booking-request:51a5da410235", "Your requirements")}</dt><dd>{request.message.trim()}</dd></div>}</dl><SendBookingRequest input={toInput(request)} privacyAcknowledged onEdit={() => { setPrepared(false); requestAnimationFrame(() => (formRef.current?.elements.namedItem("type") as HTMLElement | null)?.focus()); }} /></section> : <form ref={formRef} className="booking-form" onSubmit={prepare} noValidate aria-labelledby="booking-form-title"><div className="booking-form-heading"><p className="guest-eyebrow">{cmsText("booking-request:03d55a0f6a91", "PLAN YOUR VISIT")}</p><h2 id="booking-form-title">{cmsText("booking-request:f420fdc4c26e", "Tell us what you have in mind.")}</h2><p>{cmsText("booking-request:b5afeb7702e9", "Every request is reviewed by our team.")}</p></div>
      <div className="booking-form-grid"><label className="booking-field booking-field-wide"><span>{cmsText("booking-request:0789b4549e11", "I’d like to enquire about")}</span><select name="type" value={request.type} onChange={(event) => update("type", event.target.value as BookingInput["type"])} {...invalid("type")}><option value="stay">{cmsText("booking-request:018271574b0c", "A room or stay")}</option><option value="dining">{cmsText("booking-request:455cf76025f6", "A meal or table")}</option><option value="experience">{cmsText("booking-request:ca59355eef96", "An experience or package")}</option><option value="general">{cmsText("booking-request:cc7284314484", "Something else")}</option></select></label>
      {(request.type === "stay" || request.type === "experience") && <label className="booking-field booking-field-wide"><span>{request.type === "stay" ? "Room type" : "Experience"}</span><select name="itemId" value={request.itemId} required onChange={(event) => update("itemId", event.target.value)} {...invalid("itemId")}><option value="">{cmsText("booking-request:86a9b212c3cf", "Choose ")}{request.type === "stay" ? "a room" : "an experience"}</option>{options.map((item) => <option key={item.id} value={item.id} disabled={!item.bookingOpen}>{item.name}{!item.bookingOpen ? " · Requests closed" : ""}</option>)}</select></label>}
      {unavailable && <p className="booking-closed-message booking-field-wide" role="status">{unavailable}</p>}
      <label className="booking-field"><span>{request.type === "stay" ? "Check-in" : `Preferred date${request.type === "general" ? " (optional)" : ""}`}</span><input name="date" type="date" min={hotelToday()} required={request.type !== "general"} value={request.date} onChange={(event) => update("date", event.target.value)} {...invalid("date")} /></label>
      {(request.type === "stay" || request.type === "experience") && <label className="booking-field"><span>{request.type === "stay" ? "Check-out" : "End date (optional)"}</span><input name="endDate" type="date" min={request.date || hotelToday()} required={request.type === "stay"} value={request.endDate} onChange={(event) => update("endDate", event.target.value)} {...invalid("endDate")} /></label>}
      {request.type === "dining" && <label className="booking-field"><span>{cmsText("booking-request:5091cff980cb", "Preferred time (IST)")}</span><input name="time" type="time" value={request.time} required onChange={(event) => update("time", event.target.value)} {...invalid("time")} /></label>}
      <label className="booking-field"><span>{cmsText("booking-request:58661c161764", "Guests, including children")}</span><input name="guests" type="number" min="1" max="99" step="1" required value={request.guests} onChange={(event) => update("guests", event.target.value)} {...invalid("guests")} /></label>
      {request.type === "stay" && <label className="booking-field"><span>{request.itemId === "dormitory-room" ? "Beds requested" : "Rooms requested"}</span><input name="rooms" type="number" min="1" max="20" step="1" required value={request.rooms} onChange={(event) => update("rooms", event.target.value)} {...invalid("rooms")} /></label>}
      <label className="booking-field booking-field-wide"><span>{cmsText("booking-request:e34006b5ed3b", "Guest name")}</span><input name="name" autoComplete="name" maxLength={120} required placeholder="Your full name" value={request.name} onChange={(event) => update("name", event.target.value)} {...invalid("name")} /></label>
      <label className="booking-field"><span>{cmsText("booking-request:c16b4e117b15", "Preferred contact method")}</span><select name="method" value={request.method} onChange={(event) => update("method", event.target.value as BookingInput["method"])} {...invalid("method")}><option>{cmsText("booking-request:969ccbd3cf63", "Email")}</option><option>{cmsText("booking-request:63dceb8800b2", "Phone")}</option><option>{cmsText("booking-request:6a40edf1fc87", "WhatsApp")}</option></select></label>
      <label className="booking-field"><span>{request.method === "Email" ? "Email address" : `${request.method === "WhatsApp" ? "WhatsApp" : "Phone"} number`}</span><input name="contact" type={request.method === "Email" ? "email" : "tel"} autoComplete={request.method === "Email" ? "email" : "tel"} maxLength={150} required placeholder={request.method === "Email" ? "you@example.com" : "+91…"} value={request.contact} onChange={(event) => update("contact", event.target.value)} {...invalid("contact")} /></label>
      <label className="booking-field booking-field-wide"><span>{cmsText("booking-request:576fba46f866", "Anything else we should know? (optional)")}</span><textarea name="message" rows={4} maxLength={3000} value={request.message} placeholder="Access needs, dietary preferences, group plans…" onChange={(event) => update("message", event.target.value)} /></label>
      <div className="booking-trap" aria-hidden="true"><label>{cmsText("booking-request:b5a229ac8bec", "Website")}<input name="website" tabIndex={-1} autoComplete="off" value={request.website} onChange={(event) => update("website", event.target.value)} /></label></div>
      </div><label className="booking-consent"><input name="consent" type="checkbox" required checked={request.consent} onChange={(event) => update("consent", event.target.checked)} {...invalid("consent")} /><span>{cmsText("booking-request:d2533d04d958", "I have read the ")}<a href="/privacy-policy" target="_blank" rel="noreferrer">{cmsText("booking-request:d5f03bc24d3c", "privacy information")}</a> {cmsText("booking-request:920e8ce6b168", "and agree to send these details to the hotel.")}</span></label>
      {issue && <p className="booking-delivery-error" id="booking-form-error" role="alert">{issue.message}</p>}<button className="booking-primary" type="submit" disabled={!!unavailable}>{cmsText("booking-request:485f191561fa", "Review your request ")}<ArrowRight aria-hidden="true" /></button><p className="booking-delivery-note">{cmsText("booking-request:f1f39ec4f56d", "No payment is taken. Submitting a request does not confirm a booking.")}</p></form>}</div>
  </section><div className="guest-container booking-back"><a className="guest-text-link" href="/rooms"><ArrowLeft aria-hidden="true" /> {cmsText("booking-request:a75c490b2e2b", "Explore our rooms")}</a><a className="guest-text-link" href="/travel-packages">{cmsText("booking-request:e5384fa6fe2b", "Discover experiences ")}<ArrowRight aria-hidden="true" /></a></div></main>;
}
