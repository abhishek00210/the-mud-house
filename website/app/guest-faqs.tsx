import { cmsText } from "../cms/client";
import { useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { GuestBreadcrumb, GuestCTA, GuestHero, GuestPhoto } from "./guest-shared";
import { categories, filterGuestFAQs, guestFAQs, type FAQCategory } from "./guest-faq-data";
import "./guest-faqs.css";

export function FAQsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FAQCategory>("all");
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(() => new Set(guestFAQs[0] ? [guestFAQs[0].id] : []));
  const searchRef = useRef<HTMLInputElement>(null);
  const results = filterGuestFAQs(query, category);
  const groups = categories.filter((item) => item.id !== "all").map((item) => ({ ...item, questions: results.filter((faq) => faq.category === item.id) })).filter((group) => group.questions.length);

  function reset() {
    setQuery("");
    setCategory("all");
    searchRef.current?.focus({ preventScroll: true });
  }

  function toggle(id: string) {
    setOpenQuestions((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  return <main className="guest-page guest-faq-page">
    <GuestBreadcrumb current="FAQs" />
    <GuestHero eyebrow={cmsText("guest-faqs:2b2a1e6d14c2", "A little clarity before your visit")} title={<>{cmsText("guest-faqs:36eeb8ea7481", "Good questions.")}<br />{cmsText("guest-faqs:828a34080229", "Thoughtful answers.")}</>} description={cmsText("guest-faqs:e945d9539ce4", "Find a starting point for your plans, from rooms and dining to exploring Varanasi.")} compact photo={<figure className="guest-faq-hero-photo"><GuestPhoto source="restaurant" name="table" alt="A candlelit table set with plates and greenery — concept photograph" /><figcaption>{cmsText("guest-faqs:c531936f74fc", "Concept photography · Illustrative")}</figcaption></figure>}>
      <div className="guest-faq-search"><Search aria-hidden="true" /><input type="search" ref={searchRef} aria-label="Search frequently asked questions" placeholder="Search your question…" value={query} onChange={(event) => setQuery(event.target.value)} aria-controls="guest-faq-results" />{query && <button type="button" aria-label="Clear question search" onClick={() => { setQuery(""); searchRef.current?.focus(); }}><X aria-hidden="true" /></button>}</div>
    </GuestHero>
    <section className="guest-faq-content"><div className="guest-container guest-faq-layout">
      <aside className="guest-faq-sidebar"><p className="guest-eyebrow">{cmsText("guest-faqs:7ec00d70557d", "Find your answer")}</p><div className="guest-faq-categories" role="group" aria-label="Question categories">{categories.map((item) => <button type="button" key={item.id} aria-pressed={category === item.id} aria-controls="guest-faq-results" onClick={() => setCategory(item.id)}><span>{item.label}</span><span className="guest-faq-category-count" aria-hidden="true">{item.id === "all" ? guestFAQs.length : guestFAQs.filter((faq) => faq.category === item.id).length}</span></button>)}</div><blockquote>{cmsText("guest-faqs:e2593654433e", "Make yourself")}<br />{cmsText("guest-faqs:674e15a277fd", "a little more")}<br />{cmsText("guest-faqs:e73fdebac5bd", "at home.")}</blockquote><a className="guest-text-link" href="/contact">{cmsText("guest-faqs:0d5530b46c8e", "Ask the team ")}<ArrowRight aria-hidden="true" /></a></aside>
      <div id="guest-faq-results" className="guest-faq-results"><p className="guest-faq-result-count" role="status" aria-live="polite" aria-atomic="true">{results.length} {results.length === 1 ? "question" : "questions"}{query.trim() ? ` matching “${query.trim()}”` : category !== "all" ? ` about ${categories.find((item) => item.id === category)?.label.toLowerCase()}` : " to help you plan"}</p>
        {groups.length ? groups.map((group) => <section key={group.id} className="guest-faq-group" aria-labelledby={`faq-category-${group.id}`}><h2 id={`faq-category-${group.id}`}>{group.label}</h2>{group.questions.map((faq) => {
          const open = openQuestions.has(faq.id);
          return <article className="guest-faq-item" key={faq.id}><h3><button type="button" id={`faq-question-${faq.id}`} aria-expanded={open} aria-controls={`faq-answer-${faq.id}`} onClick={() => toggle(faq.id)}>{faq.question}<span aria-hidden="true">{open ? "−" : "+"}</span></button></h3><div id={`faq-answer-${faq.id}`} aria-labelledby={`faq-question-${faq.id}`} hidden={!open}><p>{faq.answer}</p>{faq.href && <a className="guest-text-link" href={faq.href}>{faq.linkLabel ?? "Find out more"} <ArrowRight aria-hidden="true" /></a>}</div></article>;
        })}</section>) : <div className="guest-faq-empty"><Search aria-hidden="true" /><h2>{cmsText("guest-faqs:d31ff6ea4fed", "Let’s try another question.")}</h2><p>{cmsText("guest-faqs:313c7a0062da", "No questions match your search")}{category !== "all" ? " in this category" : ""}{cmsText("guest-faqs:b7ba2b28a818", ". Try “breakfast”, “arrival” or “group”, or ask the team about your plans.")}</p><div><button type="button" className="guest-button" onClick={reset}>{cmsText("guest-faqs:c60f1796a0a5", "Clear search & filters")}</button><a className="guest-button guest-button--outline" href="/contact">{cmsText("guest-faqs:a1859fae379e", "Ask a question ")}<ArrowRight aria-hidden="true" /></a></div></div>}
      </div>
    </div></section>
    <section className="guest-faq-journeys"><div className="guest-container"><p className="guest-eyebrow">{cmsText("guest-faqs:d66064b6de8f", "Make time for your visit")}</p><div className="guest-faq-journey-links"><a href="/rooms"><span>{cmsText("guest-faqs:886961b8dc0d", "Somewhere to settle in")}</span><h2>{cmsText("guest-faqs:4da509fba5df", "Find your room.")}</h2><span className="guest-text-link">{cmsText("guest-faqs:380d9e6d500b", "Rooms & suites ")}<ArrowRight aria-hidden="true" /></span></a><a href="/restaurant"><span>{cmsText("guest-faqs:9e6de5c71f24", "Good food. Good company.")}</span><h2>{cmsText("guest-faqs:a4a816488dd0", "Come to the table.")}</h2><span className="guest-text-link">{cmsText("guest-faqs:8535d74b2abd", "Explore dining ")}<ArrowRight aria-hidden="true" /></span></a><a href="/travel-packages"><span>{cmsText("guest-faqs:e7a40c70277d", "A different side of Kashi")}</span><h2>{cmsText("guest-faqs:9f6dddc70067", "Make a little time.")}</h2><span className="guest-text-link">{cmsText("guest-faqs:45e8ad9e7f28", "Travel experiences ")}<ArrowRight aria-hidden="true" /></span></a></div></div></section>
    <GuestCTA title={cmsText("guest-faqs:d2fc49f7ecd7", "Still have something on your mind?")} description={cmsText("guest-faqs:d4488cca2bea", "Tell us about your plans. We’ll help you with the details.")} href="/contact" label={cmsText("guest-faqs:d6021798887b", "Make an enquiry")} />
  </main>;
}
