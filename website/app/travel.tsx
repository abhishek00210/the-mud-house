import { cmsText, getSite, formatPrice, mediaById } from "../cms/client";
import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUp,
  Bus,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileText,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Star,
  UsersRound,
  Footprints,
  CircleX,
} from "lucide-react";
import {
  TravelPhoto,
  travelPackages,
  travelFAQs,
  type TravelPackage,
} from "./travel-data";
import { TravelEnquiryForm } from "./travel-request";
import "./travel.css";

type TravelProps = { onInfo: (title: string) => void };
type ExperienceFilter = "all" | TravelPackage["category"];

const packageFacts = [
  { title: "Duration", detail: cmsText("travel:8e7df9ab21e5", "Duration to confirm."), icon: Clock3 },
  { title: "Arrangement", detail: cmsText("travel:d6be8adb3ba5", "Arrangement to confirm."), icon: UsersRound },
  { title: "Highlights", detail: cmsText("travel:a8f14569a50a", "Route and highlights to confirm."), icon: Star },
  { title: "Inclusions", detail: cmsText("travel:4cf6fa822d70", "Inclusions to confirm."), icon: FileText },
  { title: "Exclusions", detail: cmsText("travel:e10a865249c6", "Exclusions to confirm."), icon: CircleX },
];

function initialPackage() {
  const requested = new URLSearchParams(window.location.search).get("package");
  return travelPackages.some((experience) => experience.id === requested)
    ? requested ?? ""
    : "";
}

export function TravelContent({ onInfo }: TravelProps) {
  const [filter, setFilter] = useState<ExperienceFilter>("all");
  const [selectedExperience, setSelectedExperience] = useState(initialPackage);
  const [requestKey, setRequestKey] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const shownPackages = travelPackages.filter(
    (experience) => filter === "all" || experience.category === filter,
  );

  function enquireAbout(packageId: string) {
    setSelectedExperience(packageId);
    setRequestKey((current) => current + 1);
  }

  return (
    <main className="travel-page" id="travel-top">
      <section className="travel-hero" aria-labelledby="travel-title">
        <div className="travel-hero-content">
          <nav className="travel-breadcrumb" aria-label="Breadcrumb">
            <a href="/">{cmsText("travel:3a78695388b3", "Home")}</a>
            <span>/</span>
            <span aria-current="page">{cmsText("travel:7b8c86d56da1", "Travel Packages & Experiences")}</span>
          </nav>
          <div className="travel-hero-copy">
            <p className="travel-eyebrow">{cmsText("travel:834d04476877", "Explore with The Mud House")}</p>
            <h1 id="travel-title">{cmsText("travel:7b8c86d56da1", "Travel Packages & Experiences")}</h1>
            <h2>{cmsText("travel:ef528b3a23af", "Discover Kashi, your way.")}</h2>
            <p>
              {cmsText("travel:dbd08c21df74", "From sacred rituals to timeless lanes, from riverside moments to cultural encounters — our travel experiences help you see a deeper, more authentic side of Varanasi.")}</p>
            <div className="travel-hero-actions">
              <a className="travel-button" href="#experiences">
                {cmsText("travel:1d8f84b0064a", "Browse Experiences")}</a>
              <button type="button" className="travel-button travel-button-outline" onClick={() => enquireAbout("help-me-plan")}>
                {cmsText("travel:696cc4caf6b9", "Help Me Plan")}</button>
            </div>
          </div>
        </div>
        <figure className="travel-hero-image">
          <TravelPhoto name="hero" />
          <figcaption>{cmsText("travel:93b24d566bd9", "Concept destination image — illustrative.")}</figcaption>
        </figure>
      </section>

      <p className="travel-notice">
        {cmsText("travel:43f826fa0df8", "Illustrative package concepts — itineraries, inclusions, prices, and availability await confirmation.")}</p>

      <section className="travel-container travel-experiences" id="experiences" aria-labelledby="experiences-title">
        <div className="travel-section-header">
          <div>
            <p className="travel-eyebrow">{cmsText("travel:1e68eeb39f8b", "Find your experience")}</p>
            <h2 className="travel-title" id="experiences-title">{cmsText("travel:8d09c1667478", "Choose what fits your visit.")}</h2>
          </div>
          <div className="travel-filters" role="group" aria-label="Filter experiences">
            {([
              ["all", "All Experiences"],
              ["tour", "Tours & Experiences"],
              ["stay-tour", "Stay + Tour"],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {shownPackages.length} {shownPackages.length === 1 ? "experience" : "experiences"} {cmsText("travel:a3c082279d53", "shown.")}</p>
        <div className="travel-package-grid">
          {shownPackages.map((experience) => (
            <article className="travel-package-card" key={experience.id} aria-labelledby={`package-${experience.id}`}>
              <div className="travel-package-image">
                <a href={`/travel-packages/${experience.id}`} aria-label={`Explore ${experience.name}`} style={{ display: "block", height: "100%" }}>
                  <TravelPhoto name={experience.photo} mediaId={experience.imageMediaId} />
                </a>
                <span className="travel-concept-badge">{cmsText("travel:3c19e96922d2", "Concept package")}</span>
              </div>
              <div className="travel-package-body">
                <h3 id={`package-${experience.id}`}><a href={`/travel-packages/${experience.id}`}>{experience.name}</a></h3>
                <p className="travel-package-description">{experience.description}</p>
                <dl className="travel-package-facts">
                  {packageFacts.map(({ title, detail, icon: Icon }) => (
                    <div className="travel-package-fact" key={title}>
                      <Icon aria-hidden="true" />
                      <div><dt>{title}</dt><dd>{title === "Duration" ? experience.duration || detail : title === "Inclusions" && experience.includes?.length ? experience.includes.join(" · ") : title === "Exclusions" && experience.excludes?.length ? experience.excludes.join(" · ") : detail}</dd></div>
                    </div>
                  ))}
                </dl>
                <div className="travel-package-quote">
                  <IndianRupee aria-hidden="true" />
                  <p><strong>{experience.price != null ? formatPrice(experience.price) : cmsText("travel:c105944f640e", "Request a quote —")}</strong><span>{experience.price != null ? "Confirm inclusions with the team." : cmsText("travel:f68d8c66b700", "pricing basis to confirm.")}</span></p>
                </div>
                <div className="travel-package-actions">
                  <a className="travel-button" href={`/travel-packages/${experience.id}#experience-itinerary`} aria-label={`View itinerary for ${experience.name}`}>{cmsText("travel:495ad139e098", "View Itinerary")}</a>
                  <button type="button" className="travel-button travel-button-outline" aria-label={`Enquire about ${experience.name}`} onClick={() => enquireAbout(experience.id)}>
                    {cmsText("travel:b8d489c57eb9", "Enquire About This Package")}</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="travel-process" aria-labelledby="travel-process-title">
        <div className="travel-container">
          <p className="travel-eyebrow">{cmsText("travel:de17083b9abd", "From an idea to a plan")}</p>
          <h2 className="travel-title" id="travel-process-title">{cmsText("travel:66bd256bff00", "Your experience starts with a conversation.")}</h2>
          <ol className="travel-steps">
            <li className="travel-step"><span className="travel-step-number" aria-hidden="true">1</span><div><h3>{cmsText("travel:8472ebb9fd0f", "Choose an experience")}</h3><p>{cmsText("travel:b146f15e2518", "Browse our packages and let us know what interests you.")}</p></div></li>
            <li className="travel-step"><span className="travel-step-number" aria-hidden="true">2</span><div><h3>{cmsText("travel:01c5b71841aa", "Share your preferences")}</h3><p>{cmsText("travel:e5d2ff978fd9", "Tell us your dates, group details and any special requirements.")}</p></div></li>
            <li className="travel-step"><span className="travel-step-number" aria-hidden="true">3</span><div><h3>{cmsText("travel:3bc6ac5f1c39", "Review the arrangements")}</h3><p>{cmsText("travel:380417eb0533", "We’ll get back to you with proposed details for your confirmation.")}</p></div></li>
          </ol>
        </div>
      </section>

      <section className="travel-container travel-practical" aria-labelledby="travel-practical-title">
        <p className="travel-eyebrow">{cmsText("travel:aab7685123cf", "Good to know")}</p>
        <h2 className="travel-title" id="travel-practical-title">{cmsText("travel:e5f223f35849", "A few details make a better plan.")}</h2>
        <div className="travel-practical-grid">
          {[
            { title: cmsText("travel:52de0c1cfaa1", "Meeting and transport"), icon: Bus },
            { title: cmsText("travel:80ffa3356de9", "Walking and access"), icon: Footprints },
            { title: cmsText("travel:6ead63547b83", "Operating arrangements"), icon: CalendarDays },
            { title: cmsText("travel:adca362ef7aa", "Changes and cancellation"), icon: ClipboardList },
          ].map(({ title, icon: Icon }) => (
            <div className="travel-practical-item" key={title}>
              <Icon aria-hidden="true" /><div><h3>{title}</h3><p>{cmsText("travel:c4fe4b7647b2", "Details awaiting confirmation.")}</p></div>
            </div>
          ))}
        </div>
        <div className="travel-requirements">
          <MessageCircle aria-hidden="true" />
          <p>{cmsText("travel:21aea0cb49c6", "Have access, timing, or group requirements?")}</p>
          <a className="travel-button" href="#travel-enquiry">{cmsText("travel:da36b20feddd", "Discuss My Requirements")}</a>
          <button type="button" className="travel-text-link" onClick={() => onInfo("Cancellation & Refund Policy")}>{cmsText("travel:c37d749a5861", "Read Cancellation & Refund Policy ")}<ArrowRight aria-hidden="true" /></button>
        </div>
      </section>

      <section className="travel-enquiry-section" id="travel-enquiry" aria-labelledby="travel-enquiry-title">
        <figure className="travel-enquiry-photo">
          <TravelPhoto name="steps" />
        </figure>
        <div className="travel-enquiry-panel">
          <TravelEnquiryForm onInfo={onInfo} selectedExperience={selectedExperience} requestKey={requestKey} />
        </div>
      </section>

      <section className="travel-container travel-faq-section" id="travel-faq" aria-labelledby="travel-faq-title">
        <p className="travel-eyebrow">{cmsText("travel:e956a9404b46", "Frequently asked questions")}</p>
        <h2 className="travel-title" id="travel-faq-title">{cmsText("travel:cbfff0be0867", "Before you set out.")}</h2>
        <div className="travel-faq-list">
          {travelFAQs.map((faq, index) => (
            <div className={`travel-faq-item ${openFAQ === index ? "is-open" : ""}`} key={faq.question}>
              <h3>
                <button type="button" id={`travel-question-${index}`} aria-expanded={openFAQ === index} aria-controls={`travel-answer-${index}`} onClick={() => setOpenFAQ(openFAQ === index ? null : index)}>
                  {faq.question}{openFAQ === index ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
                </button>
              </h3>
              <div id={`travel-answer-${index}`} role="region" aria-labelledby={`travel-question-${index}`} hidden={openFAQ !== index}><p>{faq.answer}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="travel-cta" aria-labelledby="travel-cta-title">
        <div className="travel-container travel-cta-inner">
          <div className="travel-cta-copy">
            <h2 id="travel-cta-title">{cmsText("travel:f38b803bb05a", "Let’s plan your time in Kashi.")}</h2>
            <p>{cmsText("travel:86dcf4bb216b", "Share your plans with us and we’ll help you create a meaningful experience in Varanasi — at your pace, in your own way.")}</p>
            <div className="travel-cta-actions"><a className="travel-button" href="#travel-enquiry">{cmsText("travel:23765bc8387b", "Make a Travel Enquiry")}</a><a className="travel-button travel-button-outline" href="#experiences">{cmsText("travel:1d8f84b0064a", "Browse Experiences")}</a></div>
          </div>
          <div className="travel-cta-art" aria-hidden="true"><TravelPhoto name="skyline" /><p>{cmsText("travel:6ed8baccd5db", "Same river.")}<br />{cmsText("travel:f39096f5c3de", "A deeper you.")}</p></div>
        </div>
      </section>

    </main>
  );
}

export function TravelFooter({ brand, onInfo, onGallery }: TravelProps & { brand: ReactNode; onGallery: () => void }) {
  return (
    <footer className="travel-footer">
      <div className="travel-container travel-footer-main">
        <div className="travel-footer-brand">{brand}<p>{cmsText("travel:46c219dacca3", "A quieter stay. A deeper Kashi.")}</p></div>
        <div className="travel-footer-column"><h3>{cmsText("travel:3b73900b8d29", "Explore")}</h3><a href="/rooms">{cmsText("travel:08fd1de4b04d", "Stay")}</a><a href="/restaurant">{cmsText("travel:e8f3e1ef84f0", "Dine")}</a><a href="/travel-packages">{cmsText("travel:3b73900b8d29", "Explore")}</a><a href="/gallery">{cmsText("travel:352cfc749e55", "Gallery")}</a><a href="/about">{cmsText("travel:4efca0d10c5f", "About")}</a><a href="/contact">{cmsText("travel:2b5c3d26721a", "Contact")}</a></div>
        <div className="travel-footer-column"><h3>{cmsText("travel:1cb0ba125f84", "Information")}</h3><a href="/faqs">{cmsText("travel:9856b7433f84", "FAQs")}</a><a href="/privacy-policy">{cmsText("travel:506ff3946215", "Privacy Policy")}</a><a href="/terms-and-conditions">{cmsText("travel:173f5f9f26b4", "Terms & Conditions")}</a><a href="/cancellation-refund-policy">{cmsText("travel:d5a3fb28c95e", "Cancellation & Refund Policy")}</a></div>
        <div className="travel-footer-column travel-footer-contact"><h3>{cmsText("travel:2b5c3d26721a", "Contact")}</h3><p><MapPin aria-hidden="true" /><span>{cmsText("travel:c6727b58e2fe", "Address to be confirmed.")}<br />{cmsText("travel:980252cc2b5c", "Varanasi, India.")}</span></p><p><Phone aria-hidden="true" /><span>{cmsText("travel:82bb6575d05f", "Phone number to confirm.")}</span></p><p><Mail aria-hidden="true" /><span>{cmsText("travel:7176c9a6871c", "Email address to confirm.")}</span></p></div>
      </div>
      <div className="travel-container travel-footer-bottom"><p>© {new Date().getFullYear()} {cmsText("travel:b25d8d260031", "The Mud House. All rights reserved.")}</p><div><a href="/privacy-policy">{cmsText("travel:506ff3946215", "Privacy Policy")}</a><a href="/terms-and-conditions">{cmsText("travel:173f5f9f26b4", "Terms & Conditions")}</a><a href="/cancellation-refund-policy">{cmsText("travel:d5a3fb28c95e", "Cancellation & Refund Policy")}</a></div><a className="travel-back-top" href="#home" aria-label="Back to top"><ArrowUp aria-hidden="true" /></a></div>
    </footer>
  );
}
