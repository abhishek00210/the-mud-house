import { cmsText } from "../cms/client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { travelPackages } from "./travel-data";
import { SendBookingRequest } from "./booking-request";
import { getSite } from "../cms/client";

export type TravelRequest = {
  experience: string;
  date: string;
  endDate: string;
  travellers: string;
  accommodation: boolean;
  name: string;
  method: string;
  contact: string;
  requirements: string;
};

function experienceName(id: string) {
  return id === "help-me-plan"
    ? "Help me plan my visit"
    : travelPackages.find((experience) => experience.id === id)?.name || id;
}

function varanasiDay(date: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

export function validateTravelRequest(
  request: TravelRequest,
  now = new Date(),
): { field: keyof TravelRequest; message: string } | null {
  if (
    request.experience !== "help-me-plan" &&
    !travelPackages.some((experience) => experience.id === request.experience)
  )
    return { field: "experience", message: "Please choose an experience, or let us help you plan." };
  if (!isCalendarDate(request.date))
    return { field: "date", message: "Please choose a valid date for your visit." };
  if (request.date < varanasiDay(now))
    return { field: "date", message: "Please choose today or a future date in Varanasi." };
  if (request.endDate && !isCalendarDate(request.endDate))
    return { field: "endDate", message: "Please choose a valid end date." };
  if (request.endDate && request.endDate < request.date)
    return { field: "endDate", message: "Your end date must be on or after your preferred date." };
  if (!["1", "2", "3", "4", "5", "6", "7+"].includes(request.travellers))
    return { field: "travellers", message: "Please select the number of travellers." };
  if (!request.name.trim())
    return { field: "name", message: "Please enter your name." };
  if (!["Email", "Phone", "WhatsApp"].includes(request.method))
    return { field: "method", message: "Please choose your preferred contact method." };
  if (
    request.method === "Email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.contact.trim())
  )
    return { field: "contact", message: "Please enter a valid email address." };
  if (request.method !== "Email") {
    const digits = request.contact.replace(/\D/g, "");
    if (
      !/^[+\d() .-]+$/.test(request.contact.trim()) ||
      digits.length < 7 ||
      digits.length > 15
    )
      return {
        field: "contact",
        message: "Please enter a valid phone number, including your country code if needed.",
      };
  }
  return null;
}

export function travelRequestEmail(request: TravelRequest) {
  const dates = request.endDate
    ? `${request.date} to ${request.endDate}`
    : request.date;
  const body = [
    "Hello The Mud House,",
    "",
    "I would like help planning an experience in Varanasi. Please confirm the arrangements and a quote for:",
    "",
    `Experience or package: ${experienceName(request.experience)}`,
    `Preferred date${request.endDate ? " range" : ""}: ${dates} (Varanasi)`,
    `Travellers: ${request.travellers === "7+" ? "7 or more — please discuss group size" : request.travellers}`,
    `Accommodation interest: ${request.accommodation ? "Yes, please include accommodation options at The Mud House" : "No additional accommodation requested"}`,
    `Guest name: ${request.name.trim()}`,
    `Preferred contact method: ${request.method}`,
    `Contact details: ${request.contact.trim()}`,
    "",
    `Access, timing or other requirements: ${request.requirements.trim() || "None specified"}`,
    "",
    "I understand this is an enquiry, not a confirmed booking. Please share availability, itinerary, inclusions, pricing and booking terms for my review.",
    "",
    "Thank you!",
  ].join("\n");
  return `mailto:${getSite()?.settings.email || "hello@themudhouse.in"}?subject=${encodeURIComponent(`Travel enquiry · ${experienceName(request.experience)} · ${request.date}`)}&body=${encodeURIComponent(body)}`;
}

const emptyRequest: TravelRequest = {
  experience: "",
  date: "",
  endDate: "",
  travellers: "",
  accommodation: false,
  name: "",
  method: "",
  contact: "",
  requirements: "",
};

export function TravelEnquiryForm({
  onInfo,
  selectedExperience,
  requestKey = 0,
}: {
  onInfo: (title: string) => void;
  selectedExperience?: string;
  requestKey?: number;
}) {
  const [request, setRequest] = useState<TravelRequest>(emptyRequest);
  const [showEndDate, setShowEndDate] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);
  const hasPrepared = useRef(false);
  const today = varanasiDay(new Date());

  function clearErrors() {
    setError("");
    Array.from(formRef.current?.elements ?? []).forEach((control) => {
      if (
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement
      )
        control.setCustomValidity("");
    });
  }

  useEffect(() => {
    if (
      selectedExperience &&
      (selectedExperience === "help-me-plan" ||
        travelPackages.some((experience) => experience.id === selectedExperience))
    ) {
      setRequest((current) => ({
        ...current,
        experience: selectedExperience,
        accommodation: selectedExperience === "stay-explore-kashi" || current.accommodation,
      }));
      setPrepared(false);
      clearErrors();
    }
    if (requestKey > 0) {
      const frame = requestAnimationFrame(() => {
        const firstControl = formRef.current?.elements.namedItem("experience") as HTMLSelectElement | null;
        firstControl?.focus({ preventScroll: true });
        formRef.current?.closest(".travel-enquiry-panel")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [selectedExperience, requestKey]);

  useEffect(() => {
    if (prepared) readyRef.current?.focus();
    else if (hasPrepared.current)
      (formRef.current?.elements.namedItem("experience") as HTMLSelectElement | null)?.focus({ preventScroll: true });
  }, [prepared]);

  function update<K extends keyof TravelRequest>(field: K, value: TravelRequest[K]) {
    setRequest((current) => ({
      ...current,
      [field]: value,
      ...(field === "method" ? { contact: "" } : {}),
    }));
    clearErrors();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issue = validateTravelRequest(request);
    if (issue) {
      const control = event.currentTarget.elements.namedItem(issue.field) as HTMLInputElement | HTMLSelectElement;
      control.setCustomValidity(issue.message);
      control.reportValidity();
      setError(issue.message);
      return;
    }
    setError("");
    hasPrepared.current = true;
    setPrepared(true);
  }

  return (
    <>
      <div className="travel-request-heading">
        <p className="eyebrow">{cmsText("travel-request:a18022d1cebb", "Let’s plan your time")}</p>
        <h2 id="travel-enquiry-title">{cmsText("travel-request:f420fdc4c26e", "Tell us what you have in mind.")}</h2>
      </div>
      {prepared ? (
        <div className="travel-request-ready">
          <CheckCircle2 aria-hidden="true" />
          <h3 ref={readyRef} tabIndex={-1}>{cmsText("travel-request:101194543eac", "Your travel enquiry is ready.")}</h3>
          <p>{cmsText("travel-request:dd5c14e60527", "Review your details, then send your request to our team. Your enquiry is not a confirmed booking.")}</p>
          <dl className="travel-request-summary">
            <div><dt>{cmsText("travel-request:8eab0f09df01", "Experience")}</dt><dd>{experienceName(request.experience)}</dd></div>
            <div><dt>{cmsText("travel-request:f60508fbafe4", "Preferred dates")}</dt><dd>{request.date}{request.endDate ? ` to ${request.endDate}` : ""}</dd></div>
            <div><dt>{cmsText("travel-request:334d7a4bbd61", "Travellers")}</dt><dd>{request.travellers === "7+" ? "7 or more — group enquiry" : request.travellers}</dd></div>
            <div><dt>{cmsText("travel-request:2588c62b85f7", "Accommodation interest")}</dt><dd>{request.accommodation ? "Please include accommodation options" : "No additional accommodation requested"}</dd></div>
            <div><dt>{cmsText("travel-request:e34006b5ed3b", "Guest name")}</dt><dd>{request.name.trim()}</dd></div>
            <div><dt>{cmsText("travel-request:6c3fcd5195f4", "Contact by ")}{request.method}</dt><dd>{request.contact.trim()}</dd></div>
          </dl>
          {request.requirements.trim() && <p className="travel-request-note">{cmsText("travel-request:b3f62253d3f6", "Your requirements: ")}{request.requirements.trim()}</p>}
          <SendBookingRequest input={{ type: "experience", itemId: request.experience === "help-me-plan" ? undefined : request.experience, name: request.name.trim(), method: request.method as "Email" | "Phone" | "WhatsApp", contact: request.contact.trim(), date: request.date, endDate: request.endDate || undefined, guests: Number.parseInt(request.travellers, 10), message: [request.requirements.trim(), request.travellers === "7+" ? "Group of 7 or more; please discuss exact group size." : "", request.accommodation ? "Also interested in accommodation at The Mud House." : ""].filter(Boolean).join("\n") }} emailHref={travelRequestEmail(request)} onEdit={() => setPrepared(false)} />
        </div>
      ) : (
        <form className="travel-request-form" aria-label="Travel enquiry" ref={formRef} onSubmit={submit}>
          <div className="travel-request-grid">
            <label className="travel-field">
              <span>{cmsText("travel-request:8e65a6452d0a", "Experience or package")}</span>
              <select name="experience" required value={request.experience} onChange={(event) => update("experience", event.target.value)}>
                <option value="" disabled>{cmsText("travel-request:52c6edec3a28", "Select an experience")}</option>
                {travelPackages.map((experience) => <option key={experience.id} value={experience.id}>{experience.name}</option>)}
                <option value="help-me-plan">{cmsText("travel-request:98442d91f907", "Help me plan my visit")}</option>
              </select>
            </label>
            <div className="travel-date-fields">
              <label className="travel-field">
                <span>{showEndDate ? "Preferred start date" : "Preferred date or date range"}</span>
                <input name="date" type="date" min={today} required value={request.date} onChange={(event) => update("date", event.target.value)} />
              </label>
              <button className="travel-date-range-toggle" type="button" aria-expanded={showEndDate} aria-controls="travel-end-date" onClick={() => {
                setShowEndDate((current) => !current);
                if (showEndDate) update("endDate", "");
              }}>{showEndDate ? "Remove end date" : "+ Add an end date"}</button>
              {showEndDate && <label className="travel-field travel-end-date" id="travel-end-date">
                <span>{cmsText("travel-request:ba73c38a6d88", "Preferred end date (optional)")}</span>
                <input name="endDate" type="date" min={request.date || today} value={request.endDate} onChange={(event) => update("endDate", event.target.value)} />
              </label>}
            </div>
            <label className="travel-field">
              <span>{cmsText("travel-request:334d7a4bbd61", "Travellers")}</span>
              <select name="travellers" required value={request.travellers} onChange={(event) => update("travellers", event.target.value)}>
                <option value="" disabled>{cmsText("travel-request:ef2f8efa27e1", "Select number of travellers")}</option>
                {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={String(count)}>{count} {count === 1 ? "traveller" : "travellers"}</option>)}
                <option value="7+">{cmsText("travel-request:27783a9870cd", "7 or more — group enquiry")}</option>
              </select>
            </label>
            <div className="travel-field">
              <span>{cmsText("travel-request:001da40b6e70", "Accommodation interest (optional)")}</span>
              <label className="travel-checkbox-field">
                <input name="accommodation" type="checkbox" checked={request.accommodation} onChange={(event) => update("accommodation", event.target.checked)} />
                <span>{cmsText("travel-request:8550db895110", "I’m also interested in accommodation at The Mud House")}</span>
              </label>
            </div>
            <label className="travel-field">
              <span>{cmsText("travel-request:e34006b5ed3b", "Guest name")}</span>
              <input name="name" autoComplete="name" maxLength={120} required placeholder="Your full name" value={request.name} onChange={(event) => update("name", event.target.value)} />
            </label>
            <label className="travel-field">
              <span>{cmsText("travel-request:c16b4e117b15", "Preferred contact method")}</span>
              <select name="method" required value={request.method} onChange={(event) => update("method", event.target.value)}>
                <option value="" disabled>{cmsText("travel-request:3f047e8f65b9", "Select a method")}</option>
                <option>{cmsText("travel-request:969ccbd3cf63", "Email")}</option><option>{cmsText("travel-request:63dceb8800b2", "Phone")}</option><option>{cmsText("travel-request:6a40edf1fc87", "WhatsApp")}</option>
              </select>
            </label>
            <label className="travel-field">
              <span>{request.method === "Email" ? "Email address" : request.method === "WhatsApp" ? "WhatsApp number" : request.method === "Phone" ? "Phone number" : "Contact details"}</span>
              <input name="contact" type={request.method === "Email" ? "email" : request.method ? "tel" : "text"} autoComplete={request.method === "Email" ? "email" : "tel"} required maxLength={150} placeholder={request.method === "Email" ? "you@example.com" : request.method ? "+91…" : "Email address or phone number"} value={request.contact} onChange={(event) => update("contact", event.target.value)} />
            </label>
            <label className="travel-field travel-requirements-field">
              <span>{cmsText("travel-request:200ad9d2df49", "Optional requirements")}</span>
              <textarea name="requirements" rows={3} maxLength={1500} placeholder="Tell us anything else…" value={request.requirements} onChange={(event) => update("requirements", event.target.value)} />
            </label>
          </div>
          {error && <p className="travel-request-error" role="alert">{error}</p>}
          <div className="travel-request-actions"><button className="button travel-button" type="submit">{cmsText("travel-request:dbc6b405c35e", "Review Travel Enquiry")}</button></div>
          <p className="travel-request-disclaimer">{cmsText("travel-request:23634c4d1e3e", "Review your details before sending. An enquiry is not a confirmed booking. ")}<button className="text-link" type="button" onClick={() => onInfo("Privacy Policy")}>{cmsText("travel-request:506ff3946215", "Privacy Policy")}</button></p>
        </form>
      )}
    </>
  );
}
