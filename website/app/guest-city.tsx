import { cmsText } from "../cms/client";
import { ArrowRight, ExternalLink, MapPin } from "lucide-react";
import { GuestBreadcrumb, GuestCTA, GuestPhoto } from "./guest-shared";
import "./guest-city.css";

const sources = {
  ghats: "https://varanasi.nic.in/tourist-place/ganga-ghat/",
  assi: "https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi/assi-ghat",
  dashashwamedh: "https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi/dashashwamedh-ghat",
  varanasi: "https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi",
};

const pointers = [
  { title: cmsText("guest-city:5968831c05c4", "Choose your pace"), text: "Share how you like to travel, and any walking or access requirements, before settling on an experience." },
  { title: cmsText("guest-city:d28ff95320ed", "Confirm the practical details"), text: "Ask about meeting points, transfers, duration and what your proposed experience includes. Check current local guidance before setting out." },
  { title: cmsText("guest-city:32cf39fe5f9a", "Be a considerate guest"), text: "Follow local guidance and ask permission before photographing people, private spaces or ceremonies." },
  { title: cmsText("guest-city:9179cf397813", "Leave room for the unexpected"), text: "Plan some breathing space between experiences, and discuss weather, river conditions or changes with your local organiser." },
];

function OfficialLink({ href, children }: { href: string; children: string }) {
  return <a className="guest-city-source" href={href} target="_blank" rel="noreferrer">{children} <ExternalLink aria-hidden="true" /><span className="sr-only"> {cmsText("guest-city:1d1833565142", "(opens in a new tab)")}</span></a>;
}

export function ExploreVaranasiPage() {
  return <main className="guest-page guest-city-page" id="main-content">
    <GuestBreadcrumb current="Explore Varanasi" />
    <section className="guest-city-hero" aria-labelledby="city-title">
      <GuestPhoto source="travel" name="hero" alt="Illustrative view of boats and Varanasi's riverfront ghats in warm evening light" className="guest-city-hero-photo" />
      <div className="guest-container guest-city-hero-copy"><p className="guest-eyebrow">{cmsText("guest-city:02dfbb424f52", "A city to discover, at your pace")}</p><h1 id="city-title">{cmsText("guest-city:3669b37245e3", "The many")}<br />{cmsText("guest-city:eb379e3c488e", "layers of Kashi.")}</h1><p>{cmsText("guest-city:47e55d87bbd5", "Begin by the river. Wander through the lanes. Make room for the quieter moments in between.")}</p><a className="guest-button" href="#city-inspiration">{cmsText("guest-city:49133d24b1ef", "Find your inspiration ")}<ArrowRight aria-hidden="true" /></a></div>
      <p className="guest-city-hero-caption">{cmsText("guest-city:365a82ce8ff8", "Concept destination image · Illustrative")}</p>
    </section>

    <section className="guest-city-section" id="city-inspiration" aria-labelledby="city-inspiration-title"><div className="guest-container">
      <div className="guest-city-section-header"><div><p className="guest-eyebrow">{cmsText("guest-city:3072db3df209", "Three ways to begin")}</p><h2 className="guest-section-heading" id="city-inspiration-title">{cmsText("guest-city:6edfe114b15b", "Follow what draws you in.")}</h2></div><p>{cmsText("guest-city:70ef614a71e7", "A little inspiration for your visit. Routes, timings and practical arrangements are yours to discuss with the team.")}</p></div>
      <div className="guest-city-themes">
        <article><a className="guest-city-theme-photo" href="/travel-packages/sunrise-on-the-ganga" aria-label="Explore Sunrise on the Ganga"><GuestPhoto source="travel" name="sunrise" alt="Illustrative scene of a boat on the Ganga at sunrise" /></a><p className="guest-city-photo-label">{cmsText("guest-city:c40641450096", "Illustrative destination image")}</p><h3>{cmsText("guest-city:ca82759f622d", "The river & the ghats")}</h3><p>{cmsText("guest-city:17ecfc968fcb", "Varanasi’s ghats are the steps that lead down to the Ganga. Begin with the riverfront and its changing light.")}</p><OfficialLink href={sources.ghats}>{cmsText("guest-city:0633bdb8f519", "About the ghats · District Varanasi")}</OfficialLink><a className="guest-text-link" href="/travel-packages/sunrise-on-the-ganga">{cmsText("guest-city:f14112af2d00", "Explore the sunrise concept ")}<ArrowRight aria-hidden="true" /></a></article>
        <article><a className="guest-city-theme-photo" href="/travel-packages/varanasi-heritage-walk" aria-label="Explore Varanasi Heritage Walk"><GuestPhoto source="travel" name="heritage" alt="Illustrative scene of a traveller in the historic lanes of Kashi" /></a><p className="guest-city-photo-label">{cmsText("guest-city:c40641450096", "Illustrative destination image")}</p><h3>{cmsText("guest-city:531938652b5b", "Stories in the lanes")}</h3><p>{cmsText("guest-city:0105e53daf60", "Look a little closer at the architecture, everyday details and life of the old city. Share your interests and preferred pace with the team.")}</p><a className="guest-text-link" href="/travel-packages/varanasi-heritage-walk">{cmsText("guest-city:de8bd12601ff", "Explore the heritage walk ")}<ArrowRight aria-hidden="true" /></a></article>
        <article><a className="guest-city-theme-photo" href="/restaurant" aria-label="Discover dining at The Mud House"><GuestPhoto source="restaurant" name="table" alt="Concept photograph of a candlelit dining table at The Mud House" /></a><p className="guest-city-photo-label">{cmsText("guest-city:022760eaf47b", "Restaurant concept photography")}</p><h3>{cmsText("guest-city:a6e8c52b861a", "A moment at the table")}</h3><p>{cmsText("guest-city:f2ee9aeb53eb", "Come back to warm surroundings and make time for a meal and conversation. Discuss menu choices and table arrangements with the team.")}</p><a className="guest-text-link" href="/restaurant">{cmsText("guest-city:45dd678d59fe", "Discover dining ")}<ArrowRight aria-hidden="true" /></a></article>
      </div>
    </div></section>

    <section className="guest-city-places-section" aria-labelledby="city-places-title"><div className="guest-container guest-city-places-layout">
      <div className="guest-city-places-intro"><p className="guest-eyebrow">{cmsText("guest-city:ddc028410bb3", "A few places to know")}</p><h2 className="guest-section-heading" id="city-places-title">{cmsText("guest-city:e6dc46c084c0", "A starting point")}<br />{cmsText("guest-city:6e7b6f5983dd", "for your plans.")}</h2><p>{cmsText("guest-city:82b7d83b5ac0", "Explore the official visitor information for these places, then decide what fits your time and interests.")}</p><a className="guest-text-link" href="/contact?topic=travel">{cmsText("guest-city:19bde0013147", "Help me plan ")}<ArrowRight aria-hidden="true" /></a><figure className="guest-city-place-photo"><GuestPhoto source="experience" name="temple" alt="Illustrative riverfront temple scene in Varanasi; not a photograph of a named attraction" /><figcaption>{cmsText("guest-city:8e64a6031c5d", "Illustrative Varanasi scene")}</figcaption></figure></div>
      <div className="guest-city-places">
        <article><MapPin aria-hidden="true" /><div><h3>{cmsText("guest-city:00d0951e2a06", "Assi Ghat")}</h3><p>{cmsText("guest-city:65cbc877784d", "At the southern end of Varanasi’s riverfront, Assi Ghat is known for its morning cultural and spiritual gatherings.")}</p><OfficialLink href={sources.assi}>{cmsText("guest-city:b7f769a902d4", "Explore Assi Ghat · Incredible India")}</OfficialLink></div></article>
        <article><MapPin aria-hidden="true" /><div><h3>{cmsText("guest-city:34709d3a563c", "Dashashwamedh Ghat")}</h3><p>{cmsText("guest-city:f2231c8c1648", "This riverfront ghat is associated with the Ganga Aarti. Check current arrangements and local guidance before planning your visit.")}</p><OfficialLink href={sources.dashashwamedh}>{cmsText("guest-city:696e72eafb8c", "Explore Dashashwamedh · Incredible India")}</OfficialLink></div></article>
        <article><MapPin aria-hidden="true" /><div><h3>{cmsText("guest-city:f9e7d32bff31", "Sarnath")}</h3><p>{cmsText("guest-city:d6b3e5c58d09", "Near Varanasi, Sarnath is an important Buddhist site associated with the Buddha’s first sermon after enlightenment.")}</p><OfficialLink href={sources.varanasi}>{cmsText("guest-city:121185d0f727", "Read about Sarnath · Incredible India")}</OfficialLink></div></article>
      </div>
    </div></section>

    <section className="guest-city-section guest-city-practical" id="practical" aria-labelledby="city-practical-title"><div className="guest-container"><p className="guest-eyebrow">{cmsText("guest-city:da2a63224a5b", "Thoughtful ways to explore")}</p><h2 className="guest-section-heading" id="city-practical-title">{cmsText("guest-city:929a1b570fef", "Leave a little room in your plans.")}</h2><div className="guest-city-pointers">{pointers.map((pointer, index) => <article key={pointer.title}><span aria-hidden="true">0{index + 1}</span><div><h3>{pointer.title}</h3><p>{pointer.text}</p></div></article>)}</div><div className="guest-city-access-note"><p>{cmsText("guest-city:cec6acd2c6cc", "Have access, timing or group requirements?")}</p><a className="guest-button guest-button--outline" href="/contact?topic=accessibility">{cmsText("guest-city:560b709368ed", "Discuss your requirements ")}<ArrowRight aria-hidden="true" /></a></div></div></section>

    <section className="guest-city-section" aria-labelledby="city-stay-title"><div className="guest-container guest-city-stay"><figure className="guest-city-stay-photo"><GuestPhoto source="travel" name="stay" alt="Concept room overlooking the river and temples of Kashi" /><figcaption>{cmsText("guest-city:fe5e901ab3b5", "Concept room and view · Details to confirm")}</figcaption></figure><div><p className="guest-eyebrow">{cmsText("guest-city:1e5300e93919", "Stay a little. Discover a little more.")}</p><h2 className="guest-section-heading" id="city-stay-title">{cmsText("guest-city:c23e52e353d3", "Make The Mud House")}<br />{cmsText("guest-city:56692b233092", "part of your story.")}</h2><p>{cmsText("guest-city:e17611d755b7", "Explore a stay-and-tour concept, or choose the individual experience that speaks to you. The team will help you discuss availability, arrangements and a quote.")}</p><div className="guest-city-stay-actions"><a className="guest-button" href="/travel-packages/stay-explore-kashi">{cmsText("guest-city:dd7a00a5eb23", "Stay & Explore Kashi ")}<ArrowRight aria-hidden="true" /></a><a className="guest-text-link" href="/travel-packages">{cmsText("guest-city:1bbcb232e2fb", "All experiences ")}<ArrowRight aria-hidden="true" /></a></div><p className="guest-note">{cmsText("guest-city:56532c596357", "Package concepts, photography and itineraries are illustrative. Inclusions, access, timings and prices require confirmation.")}</p></div></div></section>

    <GuestCTA title={cmsText("guest-city:0a9a55cec250", "Your Kashi story starts here.")} description={cmsText("guest-city:665e77cc0c3a", "Tell us what interests you, and we’ll help you plan a visit at your pace.")} href="/contact?topic=travel" label={cmsText("guest-city:95eb97cb9d65", "Plan your visit")} />
  </main>;
}
