import { SiteBrand } from "./site-brand";
import { cmsText, getSite, formatPrice } from "../cms/client";
import { informationHref } from "./guest-routes";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Bus, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleX, Clock3, Coffee, FileText, Flag, Footprints, Info, Leaf, Mail, MapPin, Minus, PersonStanding, Phone, Plus, Ship, Sun, University, UserRound, UsersRound, Accessibility } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { TravelPhoto, travelPackages } from "./travel-data";
import { ExperiencePhoto, getExperienceDetails, type ExperiencePhotoName } from "./experience-data";
import { ExperienceEnquiryForm } from "./experience-request";
import "./experience-detail.css";

const sections = [
  ["overview", "Overview"], ["itinerary", "Itinerary"], ["inclusions", "Inclusions"],
  ["practical", "Practical Info"], ["policies", "Policies"], ["faqs", "FAQs"],
] as const;
const glance = [
  ["Duration", Clock3], ["Start point", MapPin], ["End point", Flag],
  ["Arrangement", UsersRound], ["Transport", Bus], ["Guide", UserRound],
] as const;
const arrangements = [
  { title: cmsText("experience-detail:f83d10ab4109", "Start and Meeting Point"), icon: MapPin, details: ["Meeting point: To confirm", "Hotel address (if pickup): To confirm"] },
  { title: "Transport", icon: Bus, details: ["Mode of transport: To confirm", "Transfer details: To confirm"] },
  { title: "Guide", icon: UserRound, details: ["Guide provided: To confirm", "Language(s): To confirm"] },
  { title: cmsText("experience-detail:cbbc741dcbfe", "Meals / Refreshments"), icon: Coffee, details: ["Meals included: To confirm", "Refreshments: To confirm"] },
];

export function ExperienceBrand() {
  return <SiteBrand className="experience-brand" />;
}

export function ExperienceDetailPage({ packageId, onInfo }: { packageId: string; onInfo: (title: string) => void }) {
  const details = getExperienceDetails(packageId)!;
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryOpener = useRef<HTMLElement | null>(null);
  const experience = details.travelPackage;
  const photos: ExperiencePhotoName[] = experience.photo === "sunrise" ? ["main", "temple", "diya"] : experience.photo === "heritage" ? ["heritage", "temple", "main"] : ["stay", "main", "heritage"];
  const related = travelPackages.filter((item) => item.id !== packageId);
  function renderGalleryPhoto(index: number) {
    return index === 0 ? <TravelPhoto name={experience.photo} mediaId={experience.imageMediaId} className="experience-photo" /> : <ExperiencePhoto name={photos[index]} />;
  }
  useEffect(() => {
    const targets = sections.map(([id]) => document.getElementById(`experience-${id}`)).filter((item): item is HTMLElement => !!item);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id.replace("experience-", ""));
    }, { rootMargin: "-5% 0px -65% 0px", threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [packageId]);
  function showPhoto(index: number, opener: HTMLElement) {
    galleryOpener.current = opener;
    setGalleryIndex(index);
    setGalleryOpen(true);
  }
  function discussRequirements() {
    const field = document.querySelector<HTMLTextAreaElement>("#experience-enquiry textarea");
    field?.focus({ preventScroll: true });
    document.getElementById("experience-enquiry")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  return <main className="experience-page">
    <div className="experience-container">
      <div className="experience-topline">
        <nav className="experience-breadcrumb" aria-label="Breadcrumb"><a href="/">{cmsText("experience-detail:3a78695388b3", "Home")}</a><span>/</span><a href="/travel-packages">{cmsText("experience-detail:7b8c86d56da1", "Travel Packages & Experiences")}</a><span>/</span><span aria-current="page">{experience.name}</span></nav>
        <a className="experience-back" href="/travel-packages"><ArrowLeft /> {cmsText("experience-detail:c77a70be4209", "Back to All Experiences")}</a>
      </div>
      <section className="experience-hero" aria-labelledby="experience-title">
        <div className="experience-hero-copy">
          <p className="experience-eyebrow">{cmsText("experience-detail:834d04476877", "Explore with The Mud House")}</p>
          <h1 id="experience-title">{experience.name}</h1>
          <span className="experience-badge">{cmsText("experience-detail:3c19e96922d2", "Concept package")}</span>
          <p className="experience-description">{details.description}</p>
          <p className="experience-caption">{cmsText("experience-detail:8c83a54755cc", "This is a concept package and details are awaiting confirmation.")}</p>
          <div className="experience-hero-actions"><a className="experience-button" href="#experience-enquiry">{cmsText("experience-detail:2ced7aca0c6b", "Enquire About This Package ")}<ArrowRight /></a><a className="experience-button experience-button-outline" href="#experience-itinerary">{cmsText("experience-detail:f5134133578a", "View Itinerary ")}<ArrowDown /></a></div>
        </div>
        <div className="experience-hero-collage">
          {photos.map((photo, index) => <button type="button" className={`experience-hero-photo experience-hero-photo-${index}`} key={photo} onClick={(event) => showPhoto(index, event.currentTarget)} aria-label={`Enlarge ${experience.name} photograph ${index + 1}`}>{renderGalleryPhoto(index)}<span>{index === 0 ? "Concept imagery — for illustrative purposes only" : "Concept imagery"}</span></button>)}
        </div>
      </section>
      <div className="experience-intro-grid">
        <div className="experience-intro-main">
          <section className="experience-glance" aria-labelledby="experience-glance-title"><h2 id="experience-glance-title">{cmsText("experience-detail:f3ff071dcf32", "Experience at a Glance")}</h2><dl>{glance.map(([label, Icon]) => <div key={label}><Icon aria-hidden="true" /><dt>{label}</dt><dd>{label === "Duration" && experience.duration ? experience.duration : cmsText("experience-detail:091fd6e9850c", "To confirm")}</dd></div>)}</dl></section>
          <nav className="experience-sections" aria-label="Experience sections">{sections.map(([id, label]) => <a href={`#experience-${id}`} key={id} aria-current={activeSection === id ? "location" : undefined} onClick={() => setActiveSection(id)}>{label}</a>)}</nav>
          <section className="experience-overview" id="experience-overview"><h2>{cmsText("experience-detail:d4b1ea5708dd", "Overview")}</h2>{details.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
        </div>
        <aside className="experience-quote"><h2>{experience.name}</h2><span className="experience-badge">{cmsText("experience-detail:3c19e96922d2", "Concept package")}</span><h3>{experience.price != null ? formatPrice(experience.price) : cmsText("experience-detail:724f2336bf69", "Request a quote")}</h3><p>{cmsText("experience-detail:f276266324ee", "Pricing basis to confirm")}</p><div className="experience-availability"><CalendarDays /><p><strong>{cmsText("experience-detail:12f67f8539c4", "Availability")}</strong><span>{cmsText("experience-detail:091fd6e9850c", "To confirm")}</span></p></div><a className="experience-button" href="#experience-enquiry">{cmsText("experience-detail:2ced7aca0c6b", "Enquire About This Package ")}<ArrowRight /></a><small>{cmsText("experience-detail:12b21caa1c46", "An enquiry is not a confirmed booking.")}</small></aside>
      </div>
      {details.highlights.length > 0 && <section className="experience-highlights" aria-labelledby="experience-highlights-title"><h2 id="experience-highlights-title">{cmsText("experience-detail:bc8b2b5d84a6", "Experience Highlights ")}<span>{cmsText("experience-detail:2922391b87e0", "(Concept)")}</span></h2><div>{details.highlights.map((highlight, index) => { const Icon = [Sun, University, Leaf][index % 3]; return <article key={highlight.title}><Icon aria-hidden="true" /><div><h3>{highlight.title}<br />{highlight.detail}</h3><p>{cmsText("experience-detail:d0ae0b38eac6", "Awaiting confirmation")}</p></div></article>; })}</div></section>}
      <section className="experience-itinerary" id="experience-itinerary"><div className="experience-section-heading"><h2>{cmsText("experience-detail:88ef4f79ae74", "Illustrative Itinerary")}</h2><p>{cmsText("experience-detail:74643bf764ed", "This is an illustrative structure only. All details are to be confirmed.")}</p></div><ol className="experience-timeline">{details.itinerary.map((step, index) => <li key={step.title}><span className="experience-step-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><ul>{[[Clock3, "Time window: To confirm"], [MapPin, step.description], [FileText, "Description: To confirm"], [Info, "Notes: To confirm"]].map(([Icon, text]) => { const ItemIcon = Icon as typeof Clock3; return <li key={String(text)}><ItemIcon aria-hidden="true" />{String(text)}</li>; })}</ul></div></li>)}</ol></section>
      <section className="experience-practical" id="experience-practical"><div className="experience-section-heading"><h2>{cmsText("experience-detail:6d0230abb44f", "Practical Arrangements")}</h2><p>{cmsText("experience-detail:928c66fb1cd4", "All practical details are to be confirmed.")}</p></div><div className="experience-practical-grid">{arrangements.map(({title, icon:Icon,details:items}) => <article key={title}><h3><Icon aria-hidden="true" />{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>
      <div className="experience-arrangements-grid">
        <section className="experience-inclusions" id="experience-inclusions"><h2>{cmsText("experience-detail:91e32145f3fb", "Inclusions and Exclusions")}</h2><div>{[{title:cmsText("experience-detail:236ee51a0117", "Included in the quoted package"),icon:CheckCircle2,items:experience.includes?.length ? experience.includes : ["Inclusions awaiting confirmation"]},{title:"Not included",icon:CircleX,items:experience.excludes?.length ? experience.excludes : ["Exclusions awaiting confirmation"]}].map(({title,icon:Icon,items}) => <article key={title}><h3><Icon aria-hidden="true" />{title}</h3><ul>{items.map((item,index) => <li key={index}>{item}</li>)}</ul></article>)}</div></section>
        <section className="experience-access"><h2>{cmsText("experience-detail:cf927bbc319c", "Suitability and Access")}</h2><p>{cmsText("experience-detail:8999355b6942", "Details are to be confirmed and may vary.")}</p><dl>{[[Footprints,"Walking"],[PersonStanding,"Standing time"],[Footprints,"Steps"],[Accessibility,"Seating / toilet access"],[Ship,"Boarding (boat etc.)"],[UsersRound,"Access considerations"]].map(([Icon,label]) => {const AccessIcon = Icon as typeof Footprints; return <div key={String(label)}><AccessIcon aria-hidden="true" /><div><dt>{String(label)}</dt><dd>{cmsText("experience-detail:091fd6e9850c", "To confirm")}</dd></div></div>;})}</dl><div className="experience-access-request"><Accessibility aria-hidden="true" /><p>{cmsText("experience-detail:1e4538f4a653", "Have specific access requirements?")}<span>{cmsText("experience-detail:753fd97be068", "Let us know and we’ll be happy to discuss.")}</span></p><button type="button" className="experience-button" onClick={discussRequirements}>{cmsText("experience-detail:4cf38bbb3fb2", "Discuss My Requirements ")}<ArrowRight /></button></div></section>
      </div>
      <div className="experience-planning-grid">
        <div className="experience-planning-left">
          <section className="experience-policies" id="experience-policies"><h2>{cmsText("experience-detail:8f72b969b693", "Rates and Policies")}</h2><h3>{experience.price != null ? formatPrice(experience.price) : cmsText("experience-detail:581f4f329e64", "Request a quote — pricing basis to confirm")}</h3><p>{cmsText("experience-detail:43c00fea4dd4", "Final pricing will depend on group size, season and specific arrangements.")}</p><dl>{["Cancellation and refund terms","Changes to booking","No-shows","Operator disruption"].map((label) => <div key={label}><dt>{label}</dt><dd>{cmsText("experience-detail:091fd6e9850c", "To confirm")}</dd></div>)}</dl><button className="experience-text-link" type="button" onClick={() => onInfo("Cancellation & Refund Policy")}><FileText />{cmsText("experience-detail:c37d749a5861", "Read Cancellation & Refund Policy ")}<ArrowRight /></button></section>
          <section className="experience-faqs" id="experience-faqs"><h2>{cmsText("experience-detail:9856b7433f84", "FAQs")}</h2><div className="experience-faq-list">{details.faqs.map((faq,index) => <div className="experience-faq" key={faq.question}><h3><button type="button" id={`experience-question-${index}`} aria-expanded={openFAQ === index} aria-controls={`experience-answer-${index}`} onClick={() => setOpenFAQ(openFAQ === index ? null : index)}>{faq.question}{openFAQ === index ? <Minus /> : <Plus />}</button></h3><div id={`experience-answer-${index}`} role="region" aria-labelledby={`experience-question-${index}`} hidden={openFAQ !== index}><p>{faq.answer}</p></div></div>)}</div></section>
        </div>
        <div className="experience-planning-right">
          <section className="experience-enquiry" id="experience-enquiry" aria-label={`Enquire about ${experience.name}`}><ExperienceEnquiryForm experience={experience} onInfo={onInfo} /></section>
          {related.length > 0 && <section className="experience-related"><h2>{cmsText("experience-detail:cd4ad679143b", "You may also be interested in")}</h2><div>{related.map((item) => <article key={item.id}><a className="experience-related-photo" href={`/travel-packages/${item.id}`} aria-label={`View ${item.name}`}><TravelPhoto mediaId={item.imageMediaId} name={item.photo} className="experience-photo" /><span className="experience-badge">{cmsText("experience-detail:3c19e96922d2", "Concept package")}</span></a><div className="experience-related-copy"><h3><a href={`/travel-packages/${item.id}`}>{item.name}</a></h3><p>{item.description}</p><p className="experience-caption">{cmsText("experience-detail:55a988cb3ebb", "Details to be confirmed.")}</p><a className="experience-text-link" href={`/travel-packages/${item.id}`}>{cmsText("experience-detail:329526540dd4", "View Experience ")}<ArrowRight /></a></div></article>)}</div></section>}
        </div>
      </div>
    </div>
    <section className="experience-cta"><div className="experience-container experience-cta-inner"><div className="experience-cta-art" aria-hidden="true"><ExperiencePhoto name="cta" /></div><div className="experience-cta-copy"><h2>{cmsText("experience-detail:b1aca73f61a0", "Plan your time in Kashi with The Mud House")}</h2><p>{cmsText("experience-detail:49f563d5378f", "Thoughtful stays, meaningful experiences and a deeper connection to Varanasi.")}</p><div><a className="experience-button experience-button-light" href="#experience-enquiry">{cmsText("experience-detail:2ced7aca0c6b", "Enquire About This Package ")}<ArrowRight /></a><a className="experience-button experience-button-outline" href="/travel-packages">{cmsText("experience-detail:07f838003a8a", "View All Experiences")}</a></div></div><p className="experience-cta-motto">{cmsText("experience-detail:7db20897053b", "People")}<br/>{cmsText("experience-detail:e9463dccf054", "Place")}<br/>{cmsText("experience-detail:c4099180e002", "Possibilities")}<span /></p></div></section>
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}><DialogContent className="experience-gallery" onCloseAutoFocus={(event) => {event.preventDefault();galleryOpener.current?.focus();}} onKeyDown={(event) => {if(event.key === "ArrowRight") {event.preventDefault();setGalleryIndex((index)=>(index+1)%photos.length);} if(event.key === "ArrowLeft") {event.preventDefault();setGalleryIndex((index)=>(index-1+photos.length)%photos.length);}}}><DialogTitle>{experience.name}</DialogTitle><DialogDescription>{cmsText("experience-detail:7c865e2bca22", "Concept imagery — for illustrative purposes only.")}</DialogDescription>{renderGalleryPhoto(galleryIndex)}<div className="experience-gallery-controls"><button type="button" aria-label="Previous photograph" onClick={()=>setGalleryIndex((index)=>(index-1+photos.length)%photos.length)}><ChevronLeft /></button><p aria-live="polite">{galleryIndex+1} / {photos.length}</p><button type="button" aria-label="Next photograph" onClick={()=>setGalleryIndex((index)=>(index+1)%photos.length)}><ChevronRight /></button></div></DialogContent></Dialog>
  </main>;
}

export function ExperienceFooter({brand,onInfo,onGallery,fallback=false}:{brand:ReactNode;onInfo:(title:string)=>void;onGallery:()=>void;fallback?:boolean}) {
  return <footer className="experience-footer"><div className="experience-container experience-footer-main"><div className="experience-footer-brand">{brand}<p>{cmsText("experience-detail:55de1bbc7281", "A boutique stay in the heart of Varanasi.")}<br/>{cmsText("experience-detail:9f0fd9c9b88e", "With a deeper connection to people,")}<br/>{cmsText("experience-detail:939140664f17", "place and possibility.")}</p></div><div className="experience-footer-column"><h3>{cmsText("experience-detail:3b73900b8d29", "Explore")}</h3><a href="/rooms">{cmsText("experience-detail:08fd1de4b04d", "Stay")}</a><a href="/restaurant">{cmsText("experience-detail:e8f3e1ef84f0", "Dine")}</a><a href="/travel-packages">{cmsText("experience-detail:3b73900b8d29", "Explore")}</a><a href="/gallery">{cmsText("experience-detail:352cfc749e55", "Gallery")}</a><a href="/about">{cmsText("experience-detail:4efca0d10c5f", "About")}</a><a href="/contact">{cmsText("experience-detail:2b5c3d26721a", "Contact")}</a></div><div className="experience-footer-column"><h3>{cmsText("experience-detail:1cb0ba125f84", "Information")}</h3><a href="/faqs">{cmsText("experience-detail:9856b7433f84", "FAQs")}</a>{["Cancellation & Refund Policy","Privacy Policy","Terms & Conditions"].map((label)=><a key={label} href={informationHref(label)}>{label}</a>)}</div><div className="experience-footer-column experience-footer-contact"><h3>{cmsText("experience-detail:115e410f01dc", "Get in touch")}</h3><p><MapPin/><span>{getSite()?.settings.address || cmsText("experience-detail:fbb0421af070", "Varanasi, Uttar Pradesh, India")}{!getSite()?.settings.address && <><br/><small>{cmsText("experience-detail:308e69ec6d87", "Address to confirm")}</small></>}</span></p><p><Mail/><span>{cmsText("experience-detail:5b8b6b4b919a", "hello@themudhouse.in")}<br/><small>{cmsText("experience-detail:e695bff7024d", "Contact details to confirm")}</small></span></p><p><Phone/><span>{cmsText("experience-detail:6fc9bf7ea359", "Phone number to confirm")}</span></p></div></div><div className="experience-container experience-footer-bottom"><p>© {new Date().getFullYear()} {cmsText("experience-detail:b25d8d260031", "The Mud House. All rights reserved.")}</p><p>{cmsText("experience-detail:5a7d96ba459a", "A kinder way to see the world ")}<span /></p></div></footer>;
}
