import { ManagedImage } from "../cms/managed-image";
import { cmsText, getSite, mediaById } from "../cms/client";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { GuestBreadcrumb, GuestCTA, GuestHero, GuestPhoto } from "./guest-shared";
import "./guest-gallery.css";

const categories = ["All", "Rooms", "Dining", "Spaces", "Varanasi"] as const;
type GalleryCategory = (typeof categories)[number];
type GalleryImage = {
  mediaId?: string;
  id: string;
  category: Exclude<GalleryCategory, "All">;
  source: "about" | "rooms" | "restaurant" | "travel" | "experience";
  photo: string;
  title: string;
  alt: string;
  href: string;
  link: string;
};

export const photographs: GalleryImage[] = [
  { id: "deluxe", category: "Rooms", source: "rooms", photo: "deluxe", title: cmsText("guest-gallery:dc64b334946e", "Room to unwind"), alt: "Deluxe room concept with a wooden bed, warm lighting and a balcony", href: "/rooms/deluxe-room", link: "Explore Deluxe Room" },
  { id: "restaurant", category: "Dining", source: "restaurant", photo: "setting", title: cmsText("guest-gallery:6dd1c9903908", "Come together"), alt: "Restaurant concept with wooden tables, plants and warm natural finishes", href: "/restaurant", link: "Discover dining" },
  { id: "sunrise", category: "Varanasi", source: "travel", photo: "sunrise", title: cmsText("guest-gallery:e15fae22532d", "The river at first light"), alt: "Illustrative scene of a boat silhouetted against sunrise on the Ganga", href: "/travel-packages/sunrise-on-the-ganga", link: "Sunrise on the Ganga" },
  { id: "reception", category: "Spaces", source: "about", photo: "reception", title: cmsText("guest-gallery:0e9ca26776ca", "A quiet corner"), alt: "Shared lounge concept with warm wooden seating and cushions", href: "/about", link: "About our spaces" },
  { id: "table", category: "Dining", source: "restaurant", photo: "table", title: cmsText("guest-gallery:a72fd5419f47", "Around our table"), alt: "Concept dining table with candles, plates and a vase of greenery", href: "/restaurant#table-request", link: "Plan a meal" },
  { id: "heritage", category: "Varanasi", source: "travel", photo: "heritage", title: cmsText("guest-gallery:96d1f3cf2f50", "The lanes of Kashi"), alt: "Illustrative scene of a traveller walking through narrow historic lanes in Kashi", href: "/travel-packages/varanasi-heritage-walk", link: "Explore the heritage walk" },
  { id: "premium", category: "Rooms", source: "rooms", photo: "premium", title: cmsText("guest-gallery:23d2e8978d1d", "A little more space"), alt: "Premium guest room concept with a large bed and warm earthy interiors", href: "/rooms/premium-room", link: "Explore Premium Room" },
  { id: "entrance", category: "Spaces", source: "about", photo: "entrance", title: cmsText("guest-gallery:17a75bd0bf4e", "A warm welcome"), alt: "Concept hotel entrance with an arched doorway, lanterns and leafy plants", href: "/about", link: "Get to know The Mud House" },
  { id: "family", category: "Rooms", source: "rooms", photo: "family", title: cmsText("guest-gallery:3acd6f25168d", "Time together"), alt: "Family room concept with two beds, soft lighting and a balcony", href: "/rooms/family-room", link: "Explore Family Room" },
  { id: "ghats", category: "Varanasi", source: "travel", photo: "hero", title: cmsText("guest-gallery:5c3a6a7a3113", "A different rhythm"), alt: "Illustrative scene of boats beside Varanasi's riverfront ghats in warm evening light", href: "/explore-varanasi", link: "Get to know Kashi" },
  { id: "dormitory", category: "Rooms", source: "rooms", photo: "dormitory", title: cmsText("guest-gallery:442a212d0249", "Room for new stories"), alt: "Shared dormitory concept with multiple bunk beds and warm wooden floors", href: "/rooms/dormitory-room", link: "Explore Dormitory Room" },
  { id: "bathroom", category: "Spaces", source: "about", photo: "bathroom", title: cmsText("guest-gallery:0eb65344dab4", "Thoughtful details"), alt: "Bathroom design concept with a stone basin, mirror and brass fixtures", href: "/about#practical", link: "Explore the hotel" },
];

function initialCategory(): GalleryCategory {
  const requested = new URLSearchParams(window.location.search).get("category")?.toLowerCase();
  return categories.find((category) => category.toLowerCase() === requested) ?? "All";
}

function GalleryPhoto({ photograph, className = "" }: { photograph: GalleryImage; className?: string }) {
  if (photograph.mediaId && mediaById(photograph.mediaId)) return <ManagedImage mediaId={photograph.mediaId} alt={photograph.alt} className={className} />;
  return <GuestPhoto source={photograph.source} name={photograph.photo} alt={photograph.alt} className={className} />;
}

export function GalleryPage() {
  const galleryPhotos = getSite()?.gallery.filter(photo=>photo.enabled) ?? photographs;
  const [category, setCategory] = useState<GalleryCategory>(initialCategory);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const galleryOpener = useRef<HTMLButtonElement | null>(null);
  const visiblePhotos = useMemo(() => galleryPhotos.filter((photo) => category === "All" || photo.category === category), [category, galleryPhotos]);
  const selectedIndex = visiblePhotos.findIndex((photo) => photo.id === selectedId);
  const selected = visiblePhotos[selectedIndex];
  const changePhoto = (direction: number) => {
    setSelectedId((current) => {
      const index = visiblePhotos.findIndex((photo) => photo.id === current);
      return visiblePhotos[(index + direction + visiblePhotos.length) % visiblePhotos.length].id;
    });
  };

  return <main className="guest-page guest-gallery-page" id="main-content">
    <GuestBreadcrumb current="Gallery" />
    <GuestHero
      eyebrow={cmsText("guest-gallery:67054ca2ea61", "The spaces. The little things.")}
      title={<>{cmsText("guest-gallery:e7a1fd07adbb", "A closer look")}<br />{cmsText("guest-gallery:6871f14c2aca", "at The Mud House.")}</>}
      description={cmsText("guest-gallery:0cde75ed16bb", "Warm spaces, thoughtful details and a city full of stories. Picture a little of your time with us.")}
      photo={<div className="guest-gallery-hero-collage">
        <figure className="guest-gallery-hero-photo"><GuestPhoto source="about" name="entrance" alt="Concept hotel entrance with plants and an arched doorway" /><figcaption>{cmsText("guest-gallery:a3119f65f64a", "Concept photography")}</figcaption></figure>
        <figure className="guest-gallery-hero-photo"><GuestPhoto source="rooms" name="deluxe" alt="Warm Deluxe Room design concept" /></figure>
        <figure className="guest-gallery-hero-photo"><GuestPhoto source="restaurant" name="table" alt="Candlelit dining table design concept" /></figure>
      </div>}
    >
      <a className="guest-button" href="#gallery-photographs">{cmsText("guest-gallery:d3408e8a355c", "Explore the gallery ")}<ArrowRight aria-hidden="true" /></a>
      <a className="guest-button guest-button--outline" href="/contact?topic=stay">{cmsText("guest-gallery:ee96fa8dd108", "Plan your stay")}</a>
    </GuestHero>

    <section className="guest-gallery-section" id="gallery-photographs" aria-labelledby="gallery-section-title">
      <div className="guest-container">
        <div className="guest-gallery-toolbar"><div><p className="guest-eyebrow">{cmsText("guest-gallery:e9589186c903", "Find your perspective")}</p><h2 className="guest-section-heading" id="gallery-section-title">{cmsText("guest-gallery:7a043753d855", "A sense of place.")}</h2></div>
          <div className="guest-gallery-filters" aria-label="Filter photographs by category">{categories.map((filter) => <button key={filter} type="button" aria-pressed={category === filter} onClick={() => setCategory(filter)}>{filter === "All" ? "All photographs" : filter}</button>)}</div>
        </div>
        <p className="guest-gallery-count" role="status" aria-live="polite">{visiblePhotos.length} {cmsText("guest-gallery:89055d1d294e", "photographs")}{category !== "All" ? ` · ${category}` : " · Every side of your visit"}</p>
        <div className="guest-gallery-grid">
          {visiblePhotos.map((photograph) => <article className="guest-gallery-item" key={photograph.id}>
            <button className="guest-gallery-photo-button" type="button" aria-label={`Enlarge ${photograph.title}`} onClick={(event) => { galleryOpener.current = event.currentTarget; setSelectedId(photograph.id); }}>
              <GalleryPhoto photograph={photograph} /><span className="guest-gallery-expand" aria-hidden="true"><Expand /></span>
            </button>
            <h3>{photograph.title}</h3>
            <p>{photograph.category} · {mediaById(photograph.mediaId)?.caption || (photograph.mediaId ? "Hotel photography" : photograph.category === "Varanasi" ? "Illustrative destination image" : "Concept photography")}</p>
            <a className="guest-text-link" href={photograph.href}>{photograph.link} <ArrowRight aria-hidden="true" /></a>
          </article>)}
        </div>
        <p className="guest-note guest-gallery-caption">{cmsText("guest-gallery:e8ab8afb3019", "These concept photographs illustrate the atmosphere of the design. Actual room features, views and property spaces are subject to confirmation.")}</p>
      </div>
    </section>

    <GuestCTA title={cmsText("guest-gallery:2120385ce59d", "Your stay starts with a conversation.")} description={cmsText("guest-gallery:d4488cca2bea", "Tell us about your plans. We’ll help you with the details.")} href="/contact?topic=stay" label={cmsText("guest-gallery:d6021798887b", "Make an enquiry")} />

    <Dialog open={selectedId !== null} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
      <DialogContent className="guest-gallery-dialog"
        onCloseAutoFocus={(event) => { event.preventDefault(); galleryOpener.current?.focus(); }}
        onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); changePhoto(1); } else if (event.key === "ArrowLeft") { event.preventDefault(); changePhoto(-1); } }}
      >
        <DialogTitle>{selected?.title ?? "The Mud House gallery"}</DialogTitle>
        <DialogDescription>{selected?.category === "Varanasi" ? "Illustrative destination photography." : "Concept photography. Property details and views require confirmation."}</DialogDescription>
        {selected && <>
          <div className="guest-gallery-dialog-image"><GalleryPhoto photograph={selected} /></div>
          <div className="guest-gallery-dialog-controls"><button type="button" onClick={() => changePhoto(-1)} aria-label="Previous photograph"><ChevronLeft aria-hidden="true" /></button><p aria-live="polite" aria-atomic="true">{selectedIndex + 1} / {visiblePhotos.length}<span>{category === "All" ? "All photographs" : category}</span></p><button type="button" onClick={() => changePhoto(1)} aria-label="Next photograph"><ChevronRight aria-hidden="true" /></button></div>
          <a className="guest-text-link guest-gallery-dialog-link" href={selected.href}>{selected.link} <ArrowRight aria-hidden="true" /></a>
        </>}
      </DialogContent>
    </Dialog>
  </main>;
}
