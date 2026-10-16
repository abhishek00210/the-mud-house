import { cmsText } from "../cms/client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Accessibility, ArrowRight, CheckCircle2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { GuestBreadcrumb, GuestHero, GuestPhoto } from "./guest-shared";
import { PolicyContent } from "./guest-policy";
import { SendBookingRequest } from "./booking-request";
import { getSite } from "../cms/client";
import "./guest-contact.css";

export const contactTopics = [
  { value: "general", label: "General enquiry" },
  { value: "stay", label: "A room or stay" },
  { value: "dining", label: "A meal or table" },
  { value: "travel", label: "A travel experience" },
  { value: "groups", label: "A group visit" },
  { value: "accessibility", label: "Access requirements" },
  { value: "arrival", label: "Arrival & directions" },
  { value: "booking", label: "A quote or booking question" },
] as const;

export type ContactEnquiry = {
  topic: string;
  name: string;
  method: string;
  contact: string;
  date: string;
  guests: string;
  message: string;
  privacy: boolean;
};
type ContactIssue = { field: keyof ContactEnquiry; message: string };

function localDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function validateContactEnquiry(request: ContactEnquiry, now = new Date()): ContactIssue | null {
  if (!contactTopics.some((topic) => topic.value === request.topic)) return { field: "topic", message: "Please choose an enquiry topic." };
  if (!request.name.trim() || request.name.trim().length > 120) return { field: "name", message: "Please enter your name, using up to 120 characters." };
  if (!["Email", "Phone", "WhatsApp"].includes(request.method)) return { field: "method", message: "Please choose a preferred contact method." };
  const contact = request.contact.trim();
  if (request.method === "Email") {
    if (contact.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return { field: "contact", message: "Please enter a valid email address." };
  } else if (!/^\+?[\d\s().-]+$/.test(contact) || contact.replace(/\D/g, "").length < 7 || contact.replace(/\D/g, "").length > 15) {
    return { field: "contact", message: "Please enter a phone number with 7 to 15 digits, including your country code where needed." };
  }
  if (request.date) {
    const date = new Date(`${request.date}T12:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(request.date) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== request.date) return { field: "date", message: "Please enter a valid calendar date, or leave this optional field blank." };
    if (request.date < localDate(now)) return { field: "date", message: "Please choose today or a future date in Varanasi." };
  }
  if (request.guests && (!/^\d+$/.test(request.guests) || Number(request.guests) < 1 || Number(request.guests) > 200)) return { field: "guests", message: "Please enter a whole number of guests from 1 to 200, or leave this blank." };
  if (!request.message.trim() || request.message.trim().length > 3000) return { field: "message", message: "Please tell us how we can help, using up to 3,000 characters." };
  if (!request.privacy) return { field: "privacy", message: "Please read and acknowledge the privacy information before preparing your enquiry." };
  return null;
}

export function contactEnquiryEmail(request: ContactEnquiry) {
  const topic = contactTopics.find((item) => item.value === request.topic)?.label ?? "General enquiry";
  const body = [
    "Hello The Mud House,", "", `I would like to discuss: ${topic}.`, "",
    `Guest name: ${request.name.trim()}`,
    `Preferred contact method: ${request.method}`,
    `Contact details: ${request.contact.trim()}`,
    `Preferred date: ${request.date || "Not specified"}${request.date ? " (Varanasi)" : ""}`,
    `Guests: ${request.guests ? Number(request.guests) : "Not specified"}`, "",
    request.message.trim(), "",
    "I have read the privacy information available on the website.",
    "I understand this is an enquiry, not a confirmed booking. Please confirm availability, arrangements and any applicable rates and terms.", "", "Thank you!",
  ].join("\n");
  return `mailto:${getSite()?.settings.email || "hello@themudhouse.in"}?subject=${encodeURIComponent(`${topic} · The Mud House`)}&body=${encodeURIComponent(body)}`;
}

function initialRequest(): ContactEnquiry {
  const topic = new URLSearchParams(window.location.search).get("topic");
  return { topic: contactTopics.some((item) => item.value === topic) ? topic! : "general", name: "", method: "Email", contact: "", date: "", guests: "", message: "", privacy: false };
}

export function ContactPage() {
  const settings = getSite()?.settings;
  const [request, setRequest] = useState<ContactEnquiry>(initialRequest);
  const [prepared, setPrepared] = useState(false);
  const [issue, setIssue] = useState<ContactIssue | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);
  const hasPrepared = useRef(false);
  const topicName = contactTopics.find((item) => item.value === request.topic)?.label;
  const onward = request.topic === "stay" || request.topic === "groups"
    ? { href: "/rooms#availability", label: "Browse rooms & availability enquiries" }
    : request.topic === "dining" ? { href: "/restaurant#table-request", label: "Prefer to request a table?" }
    : request.topic === "travel" ? { href: "/travel-packages#travel-enquiry", label: "Explore packages & travel enquiries" } : null;

  useEffect(() => {
    if (prepared) readyRef.current?.focus();
    else if (hasPrepared.current) (formRef.current?.elements.namedItem("topic") as HTMLSelectElement | null)?.focus({ preventScroll: true });
  }, [prepared]);

  function update<K extends keyof ContactEnquiry>(field: K, value: ContactEnquiry[K]) {
    setRequest((current) => ({ ...current, [field]: value, ...(field === "method" ? { contact: "" } : {}) }));
    if (issue?.field === field || (field === "method" && issue?.field === "contact")) setIssue(null);
  }

  function invalid(field: keyof ContactEnquiry) {
    return { "aria-invalid": issue?.field === field ? true : undefined, "aria-describedby": issue?.field === field ? "guest-contact-error" : undefined };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextIssue = validateContactEnquiry(request);
    setIssue(nextIssue);
    if (nextIssue) {
      (formRef.current?.elements.namedItem(nextIssue.field) as HTMLElement | null)?.focus();
      return;
    }
    hasPrepared.current = true;
    setPrepared(true);
  }

  function discussAccess() {
    setRequest((current) => ({ ...current, topic: "accessibility" }));
    setPrepared(false);
    setIssue(null);
    window.requestAnimationFrame(() => {
      document.getElementById("enquiry")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      (formRef.current?.elements.namedItem("message") as HTMLTextAreaElement | null)?.focus({ preventScroll: true });
    });
  }

  return <main className="guest-page guest-contact-page">
    <GuestBreadcrumb current="Contact" />
    <GuestHero eyebrow={cmsText("guest-contact:c29047a57e28", "Your plans. Our attention.")} title={<>{cmsText("guest-contact:e76cfdc8051f", "Let’s make time")}<br />{cmsText("guest-contact:6d41cd12b5f9", "for your visit.")}</>} description={cmsText("guest-contact:518912dd29a3", "A stay, a meal, a day exploring Kashi. Tell us what you have in mind and we’ll help you take the next step.")} compact photo={<figure className="guest-contact-hero-photo"><GuestPhoto source="about" name="reception" alt="Warm shared lounge with wooden seating and greenery — concept photograph" /><figcaption>{cmsText("guest-contact:c531936f74fc", "Concept photography · Illustrative")}</figcaption></figure>}>
      <div className="guest-contact-actions"><a className="guest-button" href="#enquiry">{cmsText("guest-contact:0c2087425af7", "Make an enquiry ")}<ArrowRight aria-hidden="true" /></a><a className="guest-text-link" href="#arrival">{cmsText("guest-contact:810124b34bdc", "Planning your arrival")}</a></div>
    </GuestHero>

    <section className="guest-contact-main">
      <div className="guest-container guest-contact-layout">
        <div className="guest-contact-intro"><p className="guest-eyebrow">{cmsText("guest-contact:a884ad708858", "Here to help")}</p><h2>{cmsText("guest-contact:9e89c6f83315", "A personal conversation.")}</h2><p>{cmsText("guest-contact:e6e3e5dac9fb", "Share a little about your visit. For dates, rates and specific arrangements, our team will confirm the details with you.")}</p>
          <div className="guest-contact-method"><MapPin aria-hidden="true" /><div><h3>{cmsText("guest-contact:823c489ecb5d", "Find us in Varanasi")}</h3><p>{settings?.address || "Varanasi, Uttar Pradesh, India"}</p>{settings?.mapUrl ? <a href={settings.mapUrl} target="_blank" rel="noreferrer">{cmsText("guest-contact:ae9652aaccad", "Get directions ")}<ArrowRight aria-hidden="true" /></a> : <small>{cmsText("guest-contact:cc677e5b5908", "Contact the team for exact arrival directions.")}</small>}</div></div>
          <div className="guest-contact-method"><Mail aria-hidden="true" /><div><h3>{cmsText("guest-contact:ffda6bf9a256", "Write to the team")}</h3>{settings?.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : <><p>{cmsText("guest-contact:658eb2ad7332", "Use the enquiry form below.")}</p><small>{cmsText("guest-contact:0ae2e7bd5380", "Email contact details await confirmation.")}</small></>}</div></div>
          {settings?.phone && <div className="guest-contact-method"><Phone aria-hidden="true" /><div><h3>{cmsText("guest-contact:1509fcf3cc7e", "Call the team")}</h3><a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>{settings.phone}</a></div></div>}
          {settings?.whatsapp && <div className="guest-contact-method"><MessageCircle aria-hidden="true" /><div><h3>{cmsText("guest-contact:80f6ac1699e6", "Chat on WhatsApp")}</h3><a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{settings.whatsapp}</a></div></div>}
          <p className="guest-note">{cmsText("guest-contact:3eecc38e3916", "For rooms, tables and experiences, an enquiry does not confirm a booking.")}</p>
          <a className="guest-text-link guest-contact-faq-link" href="/faqs">{cmsText("guest-contact:ec6604f7b572", "A question before you enquire? ")}<ArrowRight aria-hidden="true" /></a>
        </div>

        <div id="enquiry" className="guest-contact-form-panel">
          {prepared ? <section className="guest-contact-review" aria-labelledby="contact-review-title">
            <CheckCircle2 className="guest-contact-review-check" aria-hidden="true" /><p className="guest-eyebrow">{cmsText("guest-contact:cfe3b835962c", "Ready for your review")}</p><h2 id="contact-review-title" ref={readyRef} tabIndex={-1}>{cmsText("guest-contact:2927935cba85", "Your enquiry is prepared.")}</h2><p>{cmsText("guest-contact:61e9b265f02a", "Check your details, then send your enquiry to the hotel team.")}</p>
            <dl><div><dt>{cmsText("guest-contact:7e61847d61d6", "Topic")}</dt><dd>{topicName}</dd></div><div><dt>{cmsText("guest-contact:2c6b2e253c01", "Your name")}</dt><dd>{request.name.trim()}</dd></div><div><dt>{cmsText("guest-contact:269930f8106e", "Reply by ")}{request.method.toLowerCase()}</dt><dd>{request.contact.trim()}</dd></div>{request.date && <div><dt>{cmsText("guest-contact:3bde12e87641", "Preferred date")}</dt><dd>{new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" }).format(new Date(`${request.date}T12:00:00Z`))}</dd></div>}{request.guests && <div><dt>{cmsText("guest-contact:3c8e0fde6fcc", "Guests")}</dt><dd>{Number(request.guests)}</dd></div>}<div className="guest-contact-review-message"><dt>{cmsText("guest-contact:7a057bd996a3", "Your message")}</dt><dd>{request.message.trim()}</dd></div></dl>
            <SendBookingRequest input={{ type: "general", name: request.name.trim(), method: request.method as "Email" | "Phone" | "WhatsApp", contact: request.contact.trim(), date: request.date || undefined, guests: request.guests ? Number(request.guests) : undefined, message: `Topic: ${topicName}\n${request.message.trim()}` }} privacyAcknowledged={request.privacy} emailHref={contactEnquiryEmail(request)} onEdit={() => setPrepared(false)} />
          </section> : <form ref={formRef} className="guest-contact-form" noValidate onSubmit={submit} aria-labelledby="contact-form-title">
            <h2 id="contact-form-title">{cmsText("guest-contact:f420fdc4c26e", "Tell us what you have in mind.")}</h2><p>{cmsText("guest-contact:ab660d6d0ab6", "A few details will help us point you in the right direction.")}</p>
            <div className="guest-contact-form-grid">
              <label className="guest-contact-field guest-contact-field-wide"><span>{cmsText("guest-contact:8ed542b6c844", "What would you like to discuss?")}</span><select name="topic" value={request.topic} onChange={(event) => update("topic", event.target.value)} {...invalid("topic")}>{contactTopics.map((topic) => <option value={topic.value} key={topic.value}>{topic.label}</option>)}</select></label>
              {onward && <a className="guest-text-link guest-contact-onward" href={onward.href}>{onward.label} <ArrowRight aria-hidden="true" /></a>}
              <label className="guest-contact-field"><span>{cmsText("guest-contact:2c6b2e253c01", "Your name")}</span><input name="name" autoComplete="name" required maxLength={120} placeholder="Full name" value={request.name} onChange={(event) => update("name", event.target.value)} {...invalid("name")} /></label>
              <label className="guest-contact-field"><span>{cmsText("guest-contact:c16b4e117b15", "Preferred contact method")}</span><select name="method" value={request.method} onChange={(event) => update("method", event.target.value)} {...invalid("method")}><option>{cmsText("guest-contact:969ccbd3cf63", "Email")}</option><option>{cmsText("guest-contact:63dceb8800b2", "Phone")}</option><option>{cmsText("guest-contact:6a40edf1fc87", "WhatsApp")}</option></select></label>
              <label className="guest-contact-field guest-contact-field-wide"><span>{request.method === "Email" ? "Email address" : request.method === "WhatsApp" ? "WhatsApp number" : "Phone number"}</span><input name="contact" type={request.method === "Email" ? "email" : "tel"} autoComplete={request.method === "Email" ? "email" : "tel"} required maxLength={254} placeholder={request.method === "Email" ? "Your email address" : "+91 Your phone number"} value={request.contact} onChange={(event) => update("contact", event.target.value)} {...invalid("contact")} /></label>
              <label className="guest-contact-field"><span>{cmsText("guest-contact:4d4c456d92b3", "Preferred date ")}<small>{cmsText("guest-contact:0059798b7f70", "(optional)")}</small></span><input name="date" type="date" min={localDate()} value={request.date} onChange={(event) => update("date", event.target.value)} {...invalid("date")} /></label>
              <label className="guest-contact-field"><span>{cmsText("guest-contact:d138da6df120", "Guests ")}<small>{cmsText("guest-contact:0059798b7f70", "(optional)")}</small></span><input name="guests" type="number" inputMode="numeric" min="1" max="200" step="1" placeholder="Number of guests" value={request.guests} onChange={(event) => update("guests", event.target.value)} {...invalid("guests")} /></label>
              <label className="guest-contact-field guest-contact-field-wide"><span>{cmsText("guest-contact:7b56e0d0b308", "How can we help?")}</span><textarea name="message" required maxLength={3000} rows={4} placeholder="Tell us about your plans or requirements…" value={request.message} onChange={(event) => update("message", event.target.value)} {...invalid("message")} /></label>
            </div>
            <div className="guest-contact-privacy"><input id="contact-privacy" name="privacy" type="checkbox" aria-label="I have read the privacy information" required checked={request.privacy} onChange={(event) => update("privacy", event.target.checked)} {...invalid("privacy")} /><div><label htmlFor="contact-privacy">{cmsText("guest-contact:d2533d04d958", "I have read the ")}</label><Dialog><DialogTrigger asChild><button type="button" className="guest-contact-inline-link">{cmsText("guest-contact:d5f03bc24d3c", "privacy information")}</button></DialogTrigger><DialogContent className="guest-contact-policy-dialog"><DialogTitle>{cmsText("guest-contact:62551b437a04", "Privacy information")}</DialogTitle><DialogDescription>{cmsText("guest-contact:0a71f764265d", "Read the current website information without leaving your enquiry.")}</DialogDescription><PolicyContent slug="privacy-policy" compact /></DialogContent></Dialog><label htmlFor="contact-privacy">.</label></div></div>
            {issue && <p id="guest-contact-error" className="guest-contact-error" role="alert">{issue.message}</p>}
            <div className="guest-contact-submit"><button className="guest-button" type="submit">{cmsText("guest-contact:ac6445df6afa", "Review enquiry ")}<ArrowRight aria-hidden="true" /></button><p>{cmsText("guest-contact:60fe38372226", "Check your details before sending")}<br />{cmsText("guest-contact:10b481819aab", "your request to the hotel.")}</p></div>
          </form>}
        </div>
      </div>
    </section>

    <section id="arrival" className="guest-contact-arrival"><div className="guest-container guest-contact-arrival-layout"><div><p className="guest-eyebrow">{cmsText("guest-contact:468da1e4f075", "Arrival & access")}</p><h2>{cmsText("guest-contact:69825510faed", "A little planning, a warmer welcome.")}</h2><div className="guest-contact-arrival-list"><div><h3>{cmsText("guest-contact:bd3c64fb7a3b", "Before you travel")}</h3><p>{cmsText("guest-contact:91b447099644", "Ask the team to confirm our exact address, your arrival plans and the easiest meeting point.")}</p></div><div><h3>{cmsText("guest-contact:ecb4213bb230", "Getting here")}</h3><p>{cmsText("guest-contact:cfcb43fb58c8", "Share your airport or railway arrival details if you would like to discuss transfer arrangements.")}</p></div></div></div><aside className="guest-contact-access"><Accessibility aria-hidden="true" /><h3>{cmsText("guest-contact:81d34016ae55", "Every visit is different.")}</h3><p>{cmsText("guest-contact:852c1212fee3", "Tell us about steps, mobility, seating, dietary or other requirements so the team can discuss what may be possible.")}</p><button type="button" className="guest-button guest-button--outline" onClick={discussAccess}>{cmsText("guest-contact:560b709368ed", "Discuss your requirements ")}<ArrowRight aria-hidden="true" /></button></aside></div></section>
  </main>;
}
