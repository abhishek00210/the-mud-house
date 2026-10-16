import { cmsText, getSite, formatPrice } from "../cms/client";
import { useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ConciergeBell,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  UsersRound,
  Utensils,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RestaurantPhoto,
  RestaurantDishPhoto,
  restaurantGallery,
  restaurantPhotoLabels as photoLabels,
  dishes,
  restaurantFAQs,
  type RestaurantPhotoName,
} from "./restaurant-data";
import { TableRequestForm } from "./restaurant-request";
import "./restaurant.css";

type RestaurantProps = {
  onInfo: (title: string) => void;
  onContact: (title: string) => void;
};

function DiningPhotoButton({
  name,
  className = "",
  onOpen,
}: {
  name: RestaurantPhotoName;
  className?: string;
  onOpen: (name: RestaurantPhotoName, opener: HTMLElement) => void;
}) {
  return (
    <button
      type="button"
      className={`dining-photo-button ${className}`}
      aria-label={`View ${photoLabels[name]}`}
      onClick={(event) => onOpen(name, event.currentTarget)}
    >
      <RestaurantPhoto name={name} alt={photoLabels[name]} />
      <span className="dining-photo-caption">
        {cmsText("restaurant:e46c30e26f8d", "Concept image · Restaurant photograph to confirm.")}</span>
    </button>
  );
}

function DiningFact({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="dining-fact">
      {icon}
      <div>
        <strong>{title}</strong>
        <span>{children}</span>
      </div>
    </div>
  );
}

function DiningArch({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`dining-arch ${className}`}
      viewBox="0 0 80 160"
      fill="none"
      aria-hidden="true"
    >
      <path d="M10 158V42a30 30 0 0 1 60 0v116H10Z" stroke="currentColor" />
      <path d="M17 158V42a23 23 0 0 1 46 0v116" stroke="currentColor" />
    </svg>
  );
}

export function RestaurantContent({ onInfo, onContact }: RestaurantProps) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [openFAQs, setOpenFAQs] = useState<number[]>(restaurantFAQs.length ? [0] : []);
  const galleryOpener = useRef<HTMLElement | null>(null);
  const menuOpener = useRef<HTMLElement | null>(null);
  const requestMenuAfterClose = useRef(false);
  const menuDishes = selectedDish
    ? dishes.filter((dish) => dish.id === selectedDish)
    : dishes;

  function openGallery(name: RestaurantPhotoName, opener: HTMLElement) {
    galleryOpener.current = opener;
    const index = restaurantGallery.indexOf(name);
    setGalleryIndex(index < 0 ? 0 : index);
  }

  function moveGallery(direction: number) {
    setGalleryIndex((current) =>
      current === null
        ? null
        : (current + direction + restaurantGallery.length) %
          restaurantGallery.length,
    );
  }

  function openMenu(opener: HTMLElement, dishId: string | null = null) {
    menuOpener.current = opener;
    setSelectedDish(dishId);
    setMenuOpen(true);
  }

  function requestCurrentMenu() {
    requestMenuAfterClose.current = true;
    setMenuOpen(false);
  }

  return (
    <main className="restaurant-page">
      <section className="dining-hero" aria-labelledby="dining-title">
        <div className="dining-hero-content">
          <nav className="dining-breadcrumb" aria-label="Breadcrumb">
            <a href="/">{cmsText("restaurant:3a78695388b3", "Home")}</a>
            <span>/</span>
            <span aria-current="page">{cmsText("restaurant:1212ea9e2094", "Restaurant")}</span>
          </nav>
          <div className="dining-hero-copy">
            <p className="dining-eyebrow">{cmsText("restaurant:262b43831e80", "Dine at The Mud House")}</p>
            <h1 id="dining-title">{cmsText("restaurant:8eb4e02e7524", "Dining at The Mud House")}</h1>
            <h2>{cmsText("restaurant:225953b02820", "Good food. Unhurried moments.")}</h2>
            <p>
              {cmsText("restaurant:8ebc51c82bcd", "Explore our menu, get to know the setting, and plan a memorable meal at The Mud House — a place to savour good food and warm hospitality in Varanasi.")}</p>
            <div className="dining-hero-actions">
              <a href="#table-request" className="dining-button">
                {cmsText("restaurant:fde6c6c3f0cb", "Request a Table ")}<ArrowRight aria-hidden="true" />
              </a>
              <a
                href="/food-menu"
                className="dining-button dining-button-outline"
              >
                {cmsText("restaurant:7420908456e4", "View Menu")}</a>
            </div>
          </div>
          <div className="dining-hero-decoration" aria-hidden="true">
            <DiningArch />
            <span>
              {cmsText("restaurant:07c6e70a6447", "Good food")}<br />
              {cmsText("restaurant:c74927dbdcd5", "brings")}<br />
              {cmsText("restaurant:4fe17c19c0a1", "people together")}</span>
          </div>
        </div>
        <DiningPhotoButton
          name="hero"
          className="dining-hero-photo"
          onOpen={openGallery}
        />
      </section>

      <div
        className="dining-container dining-fact-strip"
        aria-label="Dining at a glance"
      >
        <DiningFact icon={<Utensils aria-hidden="true" />} title={cmsText("restaurant:6814ffa9a348", "Cuisine")}>
          {cmsText("restaurant:587c82bf1dee", "To confirm.")}</DiningFact>
        <DiningFact icon={<Clock3 aria-hidden="true" />} title={cmsText("restaurant:7f7f0eff888d", "Service hours")}>
          {cmsText("restaurant:587c82bf1dee", "To confirm.")}</DiningFact>
        <DiningFact
          icon={<UsersRound aria-hidden="true" />}
          title={cmsText("restaurant:2a4424cf596a", "Dining arrangement")}
        >
          {cmsText("restaurant:587c82bf1dee", "To confirm.")}</DiningFact>
        <DiningFact
          icon={<UsersRound aria-hidden="true" />}
          title={cmsText("restaurant:f4a2f8cb7c58", "Non-resident guests")}
        >
          {cmsText("restaurant:75b77934c1e6", "Please contact us to confirm.")}</DiningFact>
      </div>

      <section
        className="dining-container dining-story"
        aria-labelledby="dining-story-title"
      >
        <DiningPhotoButton
          name="table"
          className="dining-story-photo"
          onOpen={openGallery}
        />
        <div className="dining-story-copy">
          <p className="dining-eyebrow">{cmsText("restaurant:a72fd5419f47", "Around our table")}</p>
          <h2 id="dining-story-title" className="dining-title">
            {cmsText("restaurant:f8739be89bc3", "A little about the dining experience.")}</h2>
          <p>
            {cmsText("restaurant:57ba4b86d886", "The restaurant at The Mud House offers a warm and welcoming space to enjoy good food in the heart of Varanasi. Our menu and dining experience are designed to reflect the spirit of the city — authentic, thoughtful and unhurried.")}</p>
          <p>
            {cmsText("restaurant:848c735925b0", "Our cuisine and menu approach are to be confirmed, with a focus on fresh ingredients and flavours that celebrate local and regional influences.")}</p>
          <p>
            {cmsText("restaurant:5a10fee262fd", "The dining atmosphere is relaxed and elegant, with natural textures, earthy tones and a setting that invites you to linger a little longer.")}</p>
          <a
            href="/food-menu"
            className="dining-text-link"
          >
            {cmsText("restaurant:f92cbb83e592", "Explore the Menu ")}<ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <section
        className="dining-menu-section"
        id="dining-menu"
        aria-labelledby="dining-menu-title"
      >
        <div className="dining-container">
          <p className="dining-eyebrow">{cmsText("restaurant:667d70169dc9", "From our kitchen")}</p>
          <h2 id="dining-menu-title" className="dining-title">
            {cmsText("restaurant:6410c5b6ef0b", "A closer look at the menu.")}</h2>
          <div className="dining-dish-grid">
            {dishes.map((dish) => (
              <button
                type="button"
                className="dining-dish-card"
                key={dish.id}
                onClick={(event) => openMenu(event.currentTarget, dish.id)}
                aria-label={`Preview ${dish.name}`}
              >
                <div className="dining-dish-photo">
                  <RestaurantDishPhoto dish={dish} />
                  <span className="dining-photo-caption">
                    {cmsText("restaurant:9106c5eed8bb", "Concept food image · Menu item to confirm.")}</span>
                </div>
                <div className="dining-dish-copy">
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  {dish.price != null && <p className="cms-managed-price">{formatPrice(dish.price)}</p>}
                  <span>{dish.note}</span>
                </div>
              </button>
            ))}
          </div>
          {dishes.length === 0 && <p>Our menu is being updated. Please contact the team for current dining options.</p>}
          <div className="dining-menu-action">
            <a
              href="/food-menu"
              className="dining-button"
            >
              {cmsText("restaurant:9801a467085a", "View Full Menu ")}<ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        className="dining-container dining-setting"
        id="restaurant-gallery"
        aria-labelledby="dining-setting-title"
      >
        <p className="dining-eyebrow">{cmsText("restaurant:0c47bb9021d4", "The setting")}</p>
        <h2 id="dining-setting-title" className="dining-title">
          {cmsText("restaurant:6ce317479ba9", "Get a feel for the space.")}</h2>
        <div className="dining-setting-layout">
          <div>
            <div className="dining-setting-grid">
              <DiningPhotoButton
                name="setting"
                className="dining-setting-main"
                onOpen={openGallery}
              />
              <DiningPhotoButton
                name="flowers"
                className="dining-setting-top"
                onOpen={openGallery}
              />
              <DiningPhotoButton
                name="lounge"
                className="dining-setting-bottom"
                onOpen={openGallery}
              />
              <DiningPhotoButton
                name="entrance"
                className="dining-setting-entrance"
                onOpen={openGallery}
              />
            </div>
            <button
              type="button"
              className="dining-text-link"
              onClick={(event) => openGallery("setting", event.currentTarget)}
            >
              {cmsText("restaurant:0a9f9328ad51", "View Restaurant Gallery ")}<ArrowRight aria-hidden="true" />
            </button>
          </div>
          <aside className="dining-options">
            <h3>{cmsText("restaurant:893012e609e9", "Dining options")}</h3>
            <span className="dining-small-rule" />
            <ConciergeBell aria-hidden="true" />
            <p>{cmsText("restaurant:affb3db42585", "Dining options — details awaiting confirmation.")}</p>
          </aside>
        </div>
      </section>

      <section
        className="dining-visit-section"
        aria-labelledby="dining-visit-title"
      >
        <div className="dining-container">
          <p className="dining-eyebrow">{cmsText("restaurant:95eb97cb9d65", "Plan your visit")}</p>
          <h2 id="dining-visit-title" className="dining-title">
            {cmsText("restaurant:dea57600d5b9", "Before you join us.")}</h2>
          <div className="dining-visit-layout">
            <div className="dining-visit-grid">
              <article className="dining-visit-fact">
                <h3>
                  <Clock3 aria-hidden="true" />
                  {cmsText("restaurant:2ca29236be6e", "Service Hours")}</h3>
                <p>
                  {cmsText("restaurant:b590e18f0bc5", "Service hours — to confirm.")}<br />
                  {cmsText("restaurant:35cdc3a706c2", "Operating days — to confirm.")}<br />
                  {cmsText("restaurant:4b216639d3eb", "Last orders — to confirm.")}</p>
              </article>
              <article className="dining-visit-fact">
                <h3>
                  <UsersRound aria-hidden="true" />
                  {cmsText("restaurant:f8e219c443b8", "Visiting without staying?")}</h3>
                <p>
                  {cmsText("restaurant:34fe46cffea4", "Non-resident dining policy to confirm. Please contact the team before planning a visit.")}</p>
              </article>
              <article className="dining-visit-fact">
                <h3>
                  <MapPin aria-hidden="true" />
                  {cmsText("restaurant:d20d8eac6aed", "Location & Access")}</h3>
                <p>
                  {getSite()?.settings.address || cmsText("restaurant:5d64412e9cd3", "Restaurant address — to confirm.")}<br />
                  {cmsText("restaurant:c7e27840d725", "Entrance details — to confirm.")}<br />
                  {cmsText("restaurant:c8b39daef505", "Parking or vehicle drop-off — to confirm.")}<br />
                  {cmsText("restaurant:e732463eb2c9", "Steps/lift/route information — to confirm.")}<br />
                  {cmsText("restaurant:247b8b1391ac", "Dining-space accessibility details — to confirm.")}</p>
              </article>
            </div>
            <div className="dining-map-card">
              <div className="dining-map">
                <RestaurantPhoto name="map" alt={photoLabels.map} />
                <div>
                  <MapPin aria-hidden="true" />
                  <span>{cmsText("restaurant:2a4ec91eb246", "Map location to confirm.")}</span>
                </div>
              </div>
              <div className="dining-map-actions">
                {getSite()?.settings.mapUrl ? <a className="dining-button dining-button-outline" href={getSite()?.settings.mapUrl} target="_blank" rel="noreferrer">{cmsText("restaurant:8dc7f40a22bb", "Get Directions")}</a> : <button
                  type="button"
                  className="dining-button dining-button-outline"
                  onClick={() => onContact("Restaurant directions")}
                >
                  {cmsText("restaurant:8dc7f40a22bb", "Get Directions")}</button>}
                <button
                  type="button"
                  className="dining-button dining-button-outline"
                  onClick={() => onContact("Restaurant access requirements")}
                >
                  {cmsText("restaurant:377065d5f57a", "Ask About Access")}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="dining-container dining-table-layout"
        id="table-request"
        aria-labelledby="dining-table-title"
      >
        <div className="dining-table-intro">
          <p className="dining-eyebrow">{cmsText("restaurant:74347619f0b1", "Join us at the table")}</p>
          <h2 id="dining-table-title" className="dining-title">
            {cmsText("restaurant:293c5b1b2432", "Plan your meal with us.")}</h2>
          <p>
            {cmsText("restaurant:af5cf86158ca", "Share a few details about your preferred date and time, and the team will confirm whether your request can be accommodated.")}</p>
        </div>
        <TableRequestForm onInfo={onInfo} />
      </section>

      <section
        className="dining-container dining-faq-section"
        id="restaurant-faq"
        aria-labelledby="dining-faq-title"
      >
        <div className="dining-faq-layout">
          <div className="dining-faq-intro">
            <h2 id="dining-faq-title" className="dining-title">
              {cmsText("restaurant:6e7397ee6623", "A few things before your visit.")}</h2>
            <div className="dining-quote">
              <RestaurantPhoto name="vase" alt={photoLabels.vase} />
              <blockquote>
                {cmsText("restaurant:d40dc9ce5af9", "“Good food,")}<br />
                {cmsText("restaurant:5efbfd94c538", "brighter conversations,")}<br />
                {cmsText("restaurant:fb7ee6fe3eb1", "happier journeys.”")}<span />
              </blockquote>
            </div>
          </div>
          <div>
            <div className="dining-faq-list">
              {restaurantFAQs.map((faq, index) => (
                <details key={faq.question} open={openFAQs.includes(index)}>
                  <summary
                    onClick={(event) => {
                      event.preventDefault();
                      setOpenFAQs((current) =>
                        current.includes(index)
                          ? current.filter((item) => item !== index)
                          : [...current, index],
                      );
                    }}
                  >
                    <span>{faq.question}</span>
                    <Plus className="dining-faq-plus" aria-hidden="true" />
                    <Minus className="dining-faq-minus" aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
            {restaurantFAQs.length > 0 && <div className="dining-faq-action">
              <button
                type="button"
                className="dining-text-link"
                onClick={() =>
                  setOpenFAQs(
                    openFAQs.length === restaurantFAQs.length
                      ? [0]
                      : restaurantFAQs.map((_, index) => index),
                  )
                }
              >
                {openFAQs.length === restaurantFAQs.length
                  ? "Show Fewer FAQs"
                  : "View All FAQs"}{" "}
                <ArrowRight aria-hidden="true" />
              </button>
            </div>}
          </div>
        </div>
      </section>

      <section className="dining-final-cta" aria-labelledby="dining-cta-title">
        <div className="dining-container dining-cta-inner">
          <DiningArch className="dining-cta-arch" />
          <div className="dining-cta-copy">
            <h2 id="dining-cta-title">
              {cmsText("restaurant:3231726cde88", "Make time for a meal at The Mud House.")}</h2>
            <p>
              {cmsText("restaurant:c8f76a33df3e", "Explore our menu or share when you would like to visit, and our team will be in touch to confirm your table.")}</p>
          </div>
          <div className="dining-cta-actions">
            <a
              href="#table-request"
              className="dining-button dining-button-gold"
            >
              {cmsText("restaurant:fde6c6c3f0cb", "Request a Table ")}<ArrowRight aria-hidden="true" />
            </a>
            <a
              href="/food-menu"
              className="dining-button dining-button-outline"
            >
              {cmsText("restaurant:7420908456e4", "View Menu")}</a>
          </div>
          <div className="dining-cta-motto" aria-hidden="true">
            <DiningArch />
            <span>
              {cmsText("restaurant:c939327ca16d", "Good")}<br />
              {cmsText("restaurant:c1f026582fe6", "food")}<br />
              {cmsText("restaurant:472d858d6693", "brighter")}<br />
              {cmsText("restaurant:ab51004e9d71", "days")}</span>
          </div>
        </div>
      </section>

      <Dialog
        open={galleryIndex !== null}
        onOpenChange={(open) => {
          if (!open) setGalleryIndex(null);
        }}
      >
        <DialogContent
          className="dining-gallery-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            galleryOpener.current?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveGallery(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              moveGallery(1);
            }
          }}
        >
          <DialogTitle>{cmsText("restaurant:ad8738ab8d36", "Restaurant gallery")}</DialogTitle>
          <DialogDescription>
            {cmsText("restaurant:3e61716a59ac", "A feel for the space. These are concept images; actual restaurant photographs are pending confirmation.")}</DialogDescription>
          {galleryIndex !== null && (
            <>
              <RestaurantPhoto
                name={restaurantGallery[galleryIndex]}
                className="dining-gallery-image"
                alt={photoLabels[restaurantGallery[galleryIndex]]}
              />
              <div className="dining-gallery-controls">
                <button
                  type="button"
                  className="dining-button dining-button-outline"
                  aria-label="Previous restaurant photograph"
                  onClick={() => moveGallery(-1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <p aria-live="polite">
                  {galleryIndex + 1} {cmsText("restaurant:4acb731c0d11", "of ")}{restaurantGallery.length} ·{" "}
                  {photoLabels[restaurantGallery[galleryIndex]]}
                </p>
                <button
                  type="button"
                  className="dining-button dining-button-outline"
                  aria-label="Next restaurant photograph"
                  onClick={() => moveGallery(1)}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent
          className="dining-menu-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            menuOpener.current?.focus();
            if (requestMenuAfterClose.current) {
              requestMenuAfterClose.current = false;
              onContact("Current restaurant menu");
            }
          }}
        >
          <DialogTitle>
            {selectedDish ? menuDishes[0]?.name : "A taste of The Mud House"}
          </DialogTitle>
          <DialogDescription>
            {cmsText("restaurant:673ed2f890ff", "Menu preview · Dishes, availability, prices and dietary information are to be confirmed with our team.")}</DialogDescription>
          <div
            className={`dining-menu-preview ${selectedDish ? "dining-menu-preview-single" : ""}`}
          >
            {menuDishes.map((dish) => (
              <article key={dish.id}>
                <RestaurantDishPhoto dish={dish} />
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                {dish.price != null && <p className="cms-managed-price">{formatPrice(dish.price)}</p>}
                <small>{dish.note}</small>
              </article>
            ))}
          </div>
          <div className="dining-menu-dialog-actions">
            {selectedDish && (
              <a
                href="/food-menu"
                className="dining-button dining-button-outline"
              >
                {cmsText("restaurant:50473b4b4751", "Explore All Dishes")}</a>
            )}
            <button
              type="button"
              className="dining-button"
              onClick={requestCurrentMenu}
            >
              {cmsText("restaurant:d9779c9361d7", "Request the Current Menu ")}<ArrowRight aria-hidden="true" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export function RestaurantFooter({
  brand,
  onInfo,
}: {
  brand: ReactNode;
  onInfo: (title: string) => void;
}) {
  return (
    <footer className="dining-footer">
      <div className="dining-container dining-footer-main">
        <div className="dining-footer-brand">
          {brand}
          <p>
            {cmsText("restaurant:6b3cb947c6f3", "A welcoming stay in the heart of Varanasi, with comfortable rooms, warm hospitality and a deeper connection to the city.")}</p>
        </div>
        <div className="dining-footer-column">
          <h3>{cmsText("restaurant:3b73900b8d29", "Explore")}</h3>
          <a href="/rooms">{cmsText("restaurant:c14bcb47fccc", "Rooms & Suites")}</a>
          <a href="/rooms/dormitory-room">{cmsText("restaurant:b43de3caa9b9", "AC Dormitory")}</a>
          <a href="/restaurant">{cmsText("restaurant:1212ea9e2094", "Restaurant")}</a>
          <a href="/food-menu">{cmsText("restaurant:5ca82dd533e0", "Food Menu")}</a>
          <a href="/travel-packages">{cmsText("restaurant:cd03931583f9", "Travel Packages")}</a>
          <a href="/explore-varanasi">{cmsText("restaurant:b00680485f5a", "Explore Varanasi")}</a>
        </div>
        <div className="dining-footer-column">
          <h3>{cmsText("restaurant:1cb0ba125f84", "Information")}</h3>
          <a href="/about">{cmsText("restaurant:58cb20ad5e4d", "About Our Hotel")}</a>
          <a href="/gallery">{cmsText("restaurant:352cfc749e55", "Gallery")}</a>
          <a href="/faqs">{cmsText("restaurant:9856b7433f84", "FAQs")}</a>
          <a href="/contact">{cmsText("restaurant:2b5c3d26721a", "Contact")}</a>
        </div>
        <div className="dining-footer-column dining-footer-contact">
          <h3>{cmsText("restaurant:2b5c3d26721a", "Contact")}</h3>
          <p>
            <MapPin aria-hidden="true" />
            <span>
              {getSite()?.settings.address || cmsText("restaurant:c6727b58e2fe", "Address to be confirmed.")}<br />
              {cmsText("restaurant:980252cc2b5c", "Varanasi, India.")}</span>
          </p>
          <p>
            <Phone aria-hidden="true" />
            <span>{cmsText("restaurant:82bb6575d05f", "Phone number to confirm.")}</span>
          </p>
          <p>
            <Mail aria-hidden="true" />
            <span>{getSite()?.settings.email || cmsText("restaurant:7176c9a6871c", "Email address to confirm.")}</span>
          </p>
          <p>
            <MessageCircle aria-hidden="true" />
            <span>{getSite()?.settings.whatsapp || cmsText("restaurant:36ba6c598823", "WhatsApp number to confirm.")}</span>
          </p>
        </div>
      </div>
      <div className="dining-container dining-footer-bottom">
        <p>© {new Date().getFullYear()} {cmsText("restaurant:b25d8d260031", "The Mud House. All rights reserved.")}</p>
        <div>
          <a href="/privacy-policy">{cmsText("restaurant:506ff3946215", "Privacy Policy")}</a>
          <a href="/terms-and-conditions">{cmsText("restaurant:173f5f9f26b4", "Terms & Conditions")}</a>
          <a href="/cancellation-refund-policy">{cmsText("restaurant:d5a3fb28c95e", "Cancellation & Refund Policy")}</a>
        </div>
      </div>
    </footer>
  );
}
