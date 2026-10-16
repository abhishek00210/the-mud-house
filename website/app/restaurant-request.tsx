import { cmsText } from "../cms/client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SendBookingRequest } from "./booking-request";
import { getSite } from "../cms/client";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UsersRound,
} from "lucide-react";

export type TableRequest = {
  date: string;
  time: string;
  guests: string;
  name: string;
  method: string;
  contact: string;
  requirements: string;
};

export function tableRequestEmail(request: TableRequest) {
  const body = [
    "Hello The Mud House,",
    "",
    "I would like to request a table. Please confirm availability for:",
    "",
    `Preferred date: ${request.date}`,
    `Preferred time: ${request.time} IST (Varanasi)`,
    `Guests (including children): ${request.guests}`,
    `Guest name: ${request.name.trim()}`,
    `Preferred contact method: ${request.method}`,
    `Contact details: ${request.contact.trim()}`,
    "",
    `Dietary, access or seating requests: ${request.requirements.trim() || "None specified"}`,
    "",
    "I understand this is a request and the reservation is confirmed only when the team confirms availability.",
    "",
    "Thank you!",
  ].join("\n");
  return `mailto:${getSite()?.settings.email || "hello@themudhouse.in"}?subject=${encodeURIComponent(`Table request · ${request.date} · ${request.guests} guests`)}&body=${encodeURIComponent(body)}`;
}

function restaurantDay(date: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function validateTableRequest(
  request: TableRequest,
  now = new Date(),
): { field: keyof TableRequest; message: string } | null {
  const requested = new Date(`${request.date}T${request.time}:00+05:30`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(request.date) ||
    Number.isNaN(requested.getTime()) ||
    restaurantDay(requested) !== request.date
  ) {
    return {
      field: "date",
      message: "Please choose a valid date for your visit.",
    };
  }
  if (request.date < restaurantDay(now))
    return { field: "date", message: "Please choose today or a future date." };
  if (
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(request.time) ||
    requested.getTime() < now.getTime()
  ) {
    return { field: "time", message: "Please choose a time in the future." };
  }
  const guests = Number(request.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 99)
    return {
      field: "guests",
      message: "Please enter between 1 and 99 guests.",
    };
  if (!request.name.trim())
    return { field: "name", message: "Please enter your name." };
  if (!["Email", "Phone", "WhatsApp"].includes(request.method))
    return {
      field: "method",
      message: "Please choose how you would like us to contact you.",
    };
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
        message:
          "Please enter a valid phone number, including your country code if needed.",
      };
  }
  return null;
}

export function TableRequestForm({
  onInfo,
}: {
  onInfo: (title: string) => void;
}) {
  const [request, setRequest] = useState<TableRequest>({
    date: "",
    time: "",
    guests: "",
    name: "",
    method: "",
    contact: "",
    requirements: "",
  });
  const [prepared, setPrepared] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);
  const hasPrepared = useRef(false);
  const today = restaurantDay(new Date());

  useEffect(() => {
    if (prepared) readyRef.current?.focus();
    else if (hasPrepared.current)
      formRef.current?.querySelector("input")?.focus();
  }, [prepared]);

  function update(field: keyof TableRequest, value: string) {
    setRequest((current) => ({
      ...current,
      [field]: value,
      ...(field === "method" ? { contact: "" } : {}),
    }));
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

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issue = validateTableRequest(request);
    if (issue) {
      const control = event.currentTarget.elements.namedItem(
        issue.field,
      ) as HTMLInputElement;
      control.setCustomValidity(issue.message);
      control.reportValidity();
      setError(issue.message);
      return;
    }
    setError("");
    hasPrepared.current = true;
    setPrepared(true);
  }

  if (prepared)
    return (
      <div className="dining-request-ready">
        <CheckCircle2 aria-hidden="true" />
        <h3 ref={readyRef} tabIndex={-1}>
          {cmsText("restaurant-request:e508779444ec", "Your table request is ready.")}</h3>
        <p>
          {cmsText("restaurant-request:5085bd11a3e5", "Review your details and send your request to our team. Your reservation is confirmed only when the team confirms availability.")}</p>
        <dl className="dining-request-summary">
          <div>
            <dt>{cmsText("restaurant-request:c3f9c0394377", "Preferred date & time")}</dt>
            <dd>
              {request.date} {cmsText("restaurant-request:c6841a08f37d", "at ")}{request.time} {cmsText("restaurant-request:3ac483217e19", "IST")}</dd>
          </div>
          <div>
            <dt>{cmsText("restaurant-request:3c8e0fde6fcc", "Guests")}</dt>
            <dd>{request.guests}{cmsText("restaurant-request:e19282274029", ", including children")}</dd>
          </div>
          <div>
            <dt>{cmsText("restaurant-request:e34006b5ed3b", "Guest name")}</dt>
            <dd>{request.name}</dd>
          </div>
          <div>
            <dt>{cmsText("restaurant-request:6c3fcd5195f4", "Contact by ")}{request.method}</dt>
            <dd>{request.contact}</dd>
          </div>
        </dl>
        {request.requirements && (
          <p className="dining-request-note">
            {cmsText("restaurant-request:6b63a317d5d3", "Your requests: ")}{request.requirements}
          </p>
        )}
        <SendBookingRequest input={{ type: "dining", name: request.name.trim(), method: request.method as "Email" | "Phone" | "WhatsApp", contact: request.contact.trim(), date: request.date, time: request.time, guests: Number(request.guests), message: request.requirements.trim() }} emailHref={tableRequestEmail(request)} onEdit={() => setPrepared(false)} />
      </div>
    );

  return (
    <form
      className="dining-request-form"
      ref={formRef}
      onSubmit={submit}
      aria-label="Table request"
    >
      <div className="dining-request-grid">
        <label className="dining-field">
          <span>{cmsText("restaurant-request:3bde12e87641", "Preferred date")}</span>
          <div>
            <input
              aria-label="Preferred date"
              name="date"
              type="date"
              required
              min={today}
              value={request.date}
              onChange={(event) => update("date", event.target.value)}
            />
            <CalendarDays aria-hidden="true" />
          </div>
        </label>
        <label className="dining-field">
          <span>{cmsText("restaurant-request:5091cff980cb", "Preferred time (IST)")}</span>
          <div>
            <input
              aria-label="Preferred time (IST)"
              name="time"
              type="time"
              required
              value={request.time}
              onChange={(event) => update("time", event.target.value)}
            />
            <Clock3 aria-hidden="true" />
          </div>
        </label>
        <label className="dining-field">
          <span>{cmsText("restaurant-request:f5650e494d88", "Number of guests (including children)")}</span>
          <div>
            <input
              aria-label="Number of guests (including children)"
              name="guests"
              type="number"
              required
              min="1"
              max="99"
              step="1"
              placeholder="Add guests"
              value={request.guests}
              onChange={(event) => update("guests", event.target.value)}
            />
            <UsersRound aria-hidden="true" />
          </div>
        </label>
        <label className="dining-field">
          <span>{cmsText("restaurant-request:e34006b5ed3b", "Guest name")}</span>
          <div>
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={120}
              placeholder="Your name"
              value={request.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </div>
        </label>
        <label className="dining-field">
          <span>{cmsText("restaurant-request:c16b4e117b15", "Preferred contact method")}</span>
          <div>
            <select
              name="method"
              required
              value={request.method}
              onChange={(event) => update("method", event.target.value)}
            >
              <option value="" disabled>
                {cmsText("restaurant-request:fb1cbc38fb40", "Select an option")}</option>
              <option>{cmsText("restaurant-request:969ccbd3cf63", "Email")}</option>
              <option>{cmsText("restaurant-request:63dceb8800b2", "Phone")}</option>
              <option>{cmsText("restaurant-request:6a40edf1fc87", "WhatsApp")}</option>
            </select>
          </div>
        </label>
        <label className="dining-field">
          <span>
            {request.method === "Email"
              ? "Email address"
              : request.method === "WhatsApp"
                ? "WhatsApp number"
                : request.method === "Phone"
                  ? "Phone number"
                  : "Contact details"}
          </span>
          <div>
            <input
              name="contact"
              type={
                request.method === "Email"
                  ? "email"
                  : request.method
                    ? "tel"
                    : "text"
              }
              autoComplete={request.method === "Email" ? "email" : "tel"}
              required
              maxLength={150}
              placeholder={
                request.method === "Email"
                  ? "you@example.com"
                  : request.method
                    ? "+91…"
                    : "Your contact details"
              }
              value={request.contact}
              onChange={(event) => update("contact", event.target.value)}
            />
          </div>
        </label>
        <label className="dining-field dining-field-wide">
          <span>{cmsText("restaurant-request:3d8e03c802cf", "Any dietary, access or seating requirements? (Optional)")}</span>
          <div>
            <textarea
              name="requirements"
              rows={1}
              maxLength={1500}
              placeholder="Let us know here."
              value={request.requirements}
              onChange={(event) => update("requirements", event.target.value)}
            />
          </div>
        </label>
      </div>
      {error && (
        <p className="dining-request-error" role="alert">
          {error}
        </p>
      )}
      <div className="dining-request-actions">
        <button className="button" type="submit">
          {cmsText("restaurant-request:eedf82840dfc", "Review Table Request ")}<ArrowRight aria-hidden="true" />
        </button>
        <p className="dining-request-note">
          {cmsText("restaurant-request:308f39c26848", "Review your details before sending. A table request is not a confirmed reservation.")}</p>
        <button
          className="text-link"
          type="button"
          onClick={() => onInfo("Privacy Policy")}
        >
          {cmsText("restaurant-request:506ff3946215", "Privacy Policy")}</button>
      </div>
    </form>
  );
}
