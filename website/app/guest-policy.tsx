import { cmsText } from "../cms/client";
import { useId } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { GuestBreadcrumb } from "./guest-shared";
import { policyPages, type PolicySlug } from "./guest-policy-data";
import "./guest-policy.css";

type PolicyProps = { slug: PolicySlug };

const contactCopy: Record<PolicySlug, { title: string; description: string }> = {
  "privacy-policy": {
    title: cmsText("guest-policy:a65a9c9d4f3a", "Have a question about your details?"),
    description: cmsText("guest-policy:c21b0a5eb750", "Ask the team about the hotel's approved privacy policy and how your enquiry will be handled."),
  },
  "terms-and-conditions": {
    title: cmsText("guest-policy:18b7a3a59ae1", "Make your plans with a clear understanding."),
    description: cmsText("guest-policy:ec2655a1d691", "Ask for the current booking conditions and any details that matter to your visit."),
  },
  "cancellation-refund-policy": {
    title: cmsText("guest-policy:2a93c0bc21f5", "Need to discuss a change?"),
    description: cmsText("guest-policy:c7f2d5f7e165", "Contact the team with your existing booking details, or ask about the conditions before you book."),
  },
  "house-rules": {
    title: cmsText("guest-policy:4a5e6cb98f8b", "Let's make the arrangements clear."),
    description: cmsText("guest-policy:51666ec69b37", "Tell the team what matters to your stay and ask for the property's current guidance."),
  },
};

export function PolicyContent({ slug, compact = false }: PolicyProps & { compact?: boolean }) {
  const page = policyPages[slug];
  const instance = useId().replace(/:/g, "");
  const anchorPrefix = compact ? `policy-dialog-${instance}` : slug;
  const contact = contactCopy[slug];
  const sectionLink = (id: string) => `${anchorPrefix}-${id}`;
  const readingLinkProps = compact ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <div className={`guest-reading${compact ? " guest-reading--compact" : ""}`}>
      <header className="guest-reading-hero">
        {!compact && <p className="guest-eyebrow">{page.eyebrow}</p>}
        {!compact && <h1>{page.title}</h1>}
        <p className="guest-reading-intro">{page.intro}</p>
        <p className="guest-reading-status"><span aria-hidden="true" />{page.status}</p>
      </header>

      <div className="guest-reading-layout">
        {!compact && (
          <aside className="guest-reading-sidebar">
            <nav aria-label={`${page.title} contents`}>
              <p>{cmsText("guest-policy:b5658fc8edda", "On this page")}</p>
              {page.sections.map((section, index) => (
                <a key={section.id} href={`#${sectionLink(section.id)}`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <div className="guest-reading-body">
          {page.sections.map((section) => (
            <section key={section.id} id={sectionLink(section.id)} aria-labelledby={`${sectionLink(section.id)}-title`}>
              <h2 id={`${sectionLink(section.id)}-title`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </section>
          ))}

          <section className="guest-reading-contact" aria-labelledby={`${anchorPrefix}-contact-title`}>
            <p className="guest-eyebrow">{cmsText("guest-policy:cdcadfe34a91", "HERE TO HELP")}</p>
            <h2 id={`${anchorPrefix}-contact-title`}>{contact.title}</h2>
            <p>{contact.description}</p>
            <a className="guest-text-link" href="/contact?topic=general" {...readingLinkProps}>
              {cmsText("guest-policy:0b599e1aabed", "Contact The Mud House")}{compact ? <><ExternalLink aria-hidden="true" /><span className="guest-reading-sr-only"> {cmsText("guest-policy:1d1833565142", "(opens in a new tab)")}</span></> : <ArrowRight aria-hidden="true" />}
            </a>
          </section>

          {compact ? (
            <div className="guest-reading-standalone">
              <a className="guest-text-link" href={`/${slug}`} target="_blank" rel="noopener noreferrer">
                {cmsText("guest-policy:c816c084434a", "Open the full information page ")}<ExternalLink aria-hidden="true" />
                <span className="guest-reading-sr-only"> {cmsText("guest-policy:1d1833565142", "(opens in a new tab)")}</span>
              </a>
              <p>{cmsText("guest-policy:71d6040102d2", "Opens in a new tab so you can keep your enquiry here.")}</p>
            </div>
          ) : (
            <nav className="guest-reading-related" aria-label="Related guest information">
              <p className="guest-eyebrow">{cmsText("guest-policy:8f9c8ce2077f", "MORE INFORMATION FOR YOUR VISIT")}</p>
              <div>{Object.entries(policyPages).filter(([otherSlug]) => otherSlug !== slug).map(([otherSlug, otherPage]) => (
                <a key={otherSlug} href={`/${otherSlug}`}>{otherPage.title}<ArrowRight aria-hidden="true" /></a>
              ))}</div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export function PolicyPage({ slug }: PolicyProps) {
  return (
    <main className="guest-page guest-policy-page">
      <GuestBreadcrumb current={policyPages[slug].title} />
      <div className="guest-container"><PolicyContent slug={slug} /></div>
    </main>
  );
}
