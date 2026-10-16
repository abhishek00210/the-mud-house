import { cmsText } from "../cms/client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { travelPackages, type TravelPackage } from "./travel-data";
import { validateTravelRequest } from "./travel-request";
import { SendBookingRequest } from "./booking-request";
import { getSite } from "../cms/client";

export type ExperienceRequest = {
  experience: string;
  date: string;
  endDate: string;
  adults: string;
  children: string;
  name: string;
  method: string;
  contact: string;
  requirements: string;
  privacy: boolean;
};

type RequestIssue = { field: keyof ExperienceRequest; message: string };

export function validateExperienceRequest(request: ExperienceRequest, now = new Date()): RequestIssue | null {
  if (!travelPackages.some((item) => item.id === request.experience))
    return { field: "experience", message: "Please choose an available experience." };
  const commonIssue = validateTravelRequest({ ...request, travellers: "1", accommodation: false }, now);
  if (commonIssue && ["experience", "date", "endDate"].includes(commonIssue.field))
    return commonIssue as RequestIssue;
  if (!/^\d+$/.test(request.adults) || Number(request.adults) < 1 || Number(request.adults) > 99)
    return { field: "adults", message: "Please enter between 1 and 99 adults." };
  if (request.children !== "" && (!/^\d+$/.test(request.children) || Number(request.children) > 99))
    return { field: "children", message: "Please enter between 0 and 99 children, or leave this blank." };
  if (commonIssue) return commonIssue as RequestIssue;
  if (!request.privacy)
    return { field: "privacy", message: "Please confirm you have read and agree to the Privacy Policy." };
  return null;
}

export function experienceRequestEmail(request: ExperienceRequest) {
  const name = travelPackages.find((item) => item.id === request.experience)?.name || request.experience;
  const body = [
    "Hello The Mud House,", "",
    "I would like to enquire about the following experience. Please share the proposed arrangements, availability and a quote.", "",
    `Selected package: ${name}`,
    `Preferred date${request.endDate ? " range" : ""}: ${request.date}${request.endDate ? ` to ${request.endDate}` : ""} (Varanasi)`,
    `Adults: ${Number(request.adults)}`,
    `Children: ${Number(request.children || 0)}`,
    `Guest name: ${request.name.trim()}`,
    `Preferred contact method: ${request.method}`,
    `Contact details: ${request.contact.trim()}`, "",
    `Optional requirements or questions: ${request.requirements.trim() || "None specified"}`, "",
    "I have read and agree to the Privacy Policy.",
    "I understand this is an enquiry, not a confirmed booking. Please confirm the itinerary, inclusions, pricing, access arrangements and booking terms for my review.", "", "Thank you!",
  ].join("\n");
  return `mailto:${getSite()?.settings.email || "hello@themudhouse.in"}?subject=${encodeURIComponent(`Experience enquiry · ${name} · ${request.date}`)}&body=${encodeURIComponent(body)}`;
}

function varanasiToday() {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find((value) => value.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function ExperienceEnquiryForm({ experience, onInfo }: { experience: TravelPackage; onInfo: (title: string) => void }) {
  const [request, setRequest] = useState<ExperienceRequest>({ experience: experience.id, date: "", endDate: "", adults: "", children: "", name: "", method: "Email", contact: "", requirements: "", privacy: false });
  const [showEndDate, setShowEndDate] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [issue, setIssue] = useState<RequestIssue | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);
  const hasPrepared = useRef(false);
  const today = varanasiToday();

  useEffect(() => {
    setRequest((current) => ({ ...current, experience: experience.id }));
    setPrepared(false);
    setIssue(null);
  }, [experience.id]);

  useEffect(() => {
    if (prepared) readyRef.current?.focus();
    else if (hasPrepared.current) (formRef.current?.elements.namedItem("date") as HTMLInputElement | null)?.focus({ preventScroll: true });
  }, [prepared]);

  function update<K extends keyof ExperienceRequest>(field: K, value: ExperienceRequest[K]) {
    setRequest((current) => ({ ...current, [field]: value, ...(field === "method" ? { contact: "" } : {}) }));
    setIssue(null);
  }

  function invalid(field: keyof ExperienceRequest) {
    return { "aria-invalid": issue?.field === field ? true : undefined, "aria-describedby": issue?.field === field ? "experience-form-error" : undefined };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateExperienceRequest(request);
    setIssue(error);
    if (error) {
      (formRef.current?.elements.namedItem(error.field) as HTMLElement | null)?.focus();
      return;
    }
    hasPrepared.current = true;
    setPrepared(true);
  }

  return <>
    <div className="experience-form-heading"><h2>{cmsText("experience-request:e80e44458080", "Enquire about ")}{experience.name}</h2><p>{cmsText("experience-request:a769d1ff7e68", "An enquiry is not a confirmed booking. We’ll help you discuss your requirements.")}</p></div>
    {prepared ? <div className="experience-form-ready">
      <CheckCircle2 aria-hidden="true" />
      <h3 ref={readyRef} tabIndex={-1}>{cmsText("experience-request:666c68dc30ca", "Your enquiry is ready to review.")}</h3>
      <p>{cmsText("experience-request:0c7337a3f4b6", "Check your details below, then send your request to the hotel team.")}</p>
      <dl className="experience-form-summary">
        <div className="experience-form-wide"><dt>{cmsText("experience-request:2828786b0993", "Selected package")}</dt><dd>{experience.name}</dd></div>
        <div><dt>{cmsText("experience-request:fa7e93c78405", "Preferred ")}{request.endDate ? "date range" : "date"}</dt><dd>{request.date}{request.endDate && ` to ${request.endDate}`}</dd></div>
        <div><dt>{cmsText("experience-request:334d7a4bbd61", "Travellers")}</dt><dd>{Number(request.adults)} {Number(request.adults) === 1 ? "adult" : "adults"} · {Number(request.children || 0)} {Number(request.children || 0) === 1 ? "child" : "children"}</dd></div>
        <div><dt>{cmsText("experience-request:e34006b5ed3b", "Guest name")}</dt><dd>{request.name.trim()}</dd></div>
        <div><dt>{cmsText("experience-request:71126d3c5005", "Preferred contact — ")}{request.method}</dt><dd>{request.contact.trim()}</dd></div>
      </dl>
      {request.requirements.trim() && <p className="experience-form-note">{request.requirements.trim()}</p>}
      <SendBookingRequest input={{ type: "experience", itemId: request.experience, name: request.name.trim(), method: request.method as "Email" | "Phone" | "WhatsApp", contact: request.contact.trim(), date: request.date, endDate: request.endDate || undefined, guests: Number(request.adults) + Number(request.children || 0), message: `Adults: ${Number(request.adults)}\nChildren: ${Number(request.children || 0)}\n${request.requirements.trim()}` }} privacyAcknowledged={request.privacy} emailHref={experienceRequestEmail(request)} onEdit={() => setPrepared(false)} />
      <p>{cmsText("experience-request:4e92ed458626", "Availability, arrangements and rates will be confirmed by the team.")}</p>
    </div> : <form ref={formRef} aria-label={`Enquiry about ${experience.name}`} noValidate onSubmit={submit}>
      <div className="experience-form-grid">
        <label className="experience-form-field"><span>{cmsText("experience-request:2828786b0993", "Selected package")}</span><input name="experience" readOnly value={experience.name} {...invalid("experience")} /></label>
        <div className="experience-form-field">
          <label className="experience-form-field"><span>{showEndDate ? "Preferred start date" : "Preferred date or date range"}</span><input name="date" type="date" min={today} required value={request.date} onChange={(event) => update("date", event.target.value)} {...invalid("date")} /></label>
          <button className="experience-form-date-toggle" type="button" aria-expanded={showEndDate} aria-controls="experience-end-date" onClick={() => { setShowEndDate(!showEndDate); if (showEndDate) update("endDate", ""); }}>{showEndDate ? "Remove end date" : "+ Add an end date"}</button>
          {showEndDate && <label id="experience-end-date" className="experience-form-field"><span>{cmsText("experience-request:ba73c38a6d88", "Preferred end date (optional)")}</span><input name="endDate" type="date" min={request.date || today} value={request.endDate} onChange={(event) => update("endDate", event.target.value)} {...invalid("endDate")} /></label>}
        </div>
        <label className="experience-form-field"><span>{cmsText("experience-request:c8a7592805b7", "Adults")}</span><input name="adults" type="number" min="1" max="99" step="1" inputMode="numeric" required placeholder="e.g. 2" value={request.adults} onChange={(event) => update("adults", event.target.value)} {...invalid("adults")} /></label>
        <label className="experience-form-field"><span>{cmsText("experience-request:7a1199ab6bea", "Children (if any)")}</span><input name="children" type="number" min="0" max="99" step="1" inputMode="numeric" placeholder="e.g. 0" value={request.children} onChange={(event) => update("children", event.target.value)} {...invalid("children")} /></label>
        <label className="experience-form-field"><span>{cmsText("experience-request:e34006b5ed3b", "Guest name")}</span><input name="name" autoComplete="name" maxLength={120} required placeholder="Your full name" value={request.name} onChange={(event) => update("name", event.target.value)} {...invalid("name")} /></label>
        <label className="experience-form-field"><span>{cmsText("experience-request:c16b4e117b15", "Preferred contact method")}</span><select name="method" value={request.method} required onChange={(event) => update("method", event.target.value)} {...invalid("method")}><option>{cmsText("experience-request:969ccbd3cf63", "Email")}</option><option>{cmsText("experience-request:63dceb8800b2", "Phone")}</option><option>{cmsText("experience-request:6a40edf1fc87", "WhatsApp")}</option></select></label>
        <label className="experience-form-field experience-form-wide"><span>{cmsText("experience-request:9681395de456", "Contact details")}</span><input name="contact" type={request.method === "Email" ? "email" : "tel"} autoComplete={request.method === "Email" ? "email" : "tel"} maxLength={150} required placeholder={request.method === "Email" ? "Your email address" : "Your phone number, with country code"} value={request.contact} onChange={(event) => update("contact", event.target.value)} {...invalid("contact")} /></label>
        <label className="experience-form-field experience-form-wide"><span>{cmsText("experience-request:7c34bf85441a", "Optional requirements or questions")}</span><textarea name="requirements" rows={3} maxLength={1500} placeholder="Tell us more (optional)" value={request.requirements} onChange={(event) => update("requirements", event.target.value)} /></label>
      </div>
      {issue && <p className="experience-form-error" id="experience-form-error" role="alert">{issue.message}</p>}
      <div className="experience-form-actions">
        <div className="experience-form-privacy"><input id="experience-privacy" name="privacy" aria-label="I have read and agree to the Privacy Policy" type="checkbox" required checked={request.privacy} onChange={(event) => update("privacy", event.target.checked)} {...invalid("privacy")} /><span><label htmlFor="experience-privacy">{cmsText("experience-request:29dfbc0a5a01", "I have read and agree to the ")}</label><button type="button" onClick={() => onInfo("Privacy Policy")}>{cmsText("experience-request:506ff3946215", "Privacy Policy")}</button></span></div>
        <button className="experience-button" type="submit">{cmsText("experience-request:67dbb0cc2b04", "Review Enquiry ")}<ArrowRight /></button>
      </div>
      <p className="experience-caption" style={{ marginTop: 12 }}>{cmsText("experience-request:0c33e190b5bf", "Review your details before sending them to the hotel team.")}</p>
    </form>}
  </>;
}
