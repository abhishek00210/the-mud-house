import { cmsText, getSite, formatPrice, mediaById } from "../cms/client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Info,
  Leaf,
  Search,
  Sprout,
  Utensils,
  X,
} from "lucide-react";
import { FoodMenuPhoto, foodMenuCategories, type FoodMenuDish } from "./food-menu-data";
import "./food-menu.css";

type FoodMenuProps = {
  onContact: (title: string) => void;
};

function MenuDish({ dish }: { dish: FoodMenuDish }) {
  return (
    <article className="food-menu-item" aria-labelledby={`dish-${dish.id}`}>
      {dish.imageMediaId && mediaById(dish.imageMediaId) && <img src={mediaById(dish.imageMediaId)!.url} alt={mediaById(dish.imageMediaId)!.alt || dish.name} style={{width:100,height:80,objectFit:"cover",float:"right",marginLeft:16}} />}
      <h3 id={`dish-${dish.id}`}>{dish.name}</h3>
      <p className="food-menu-description">{dish.description}</p>
      <div className="food-menu-serving-price">
        <span>{dish.serving ? `Serving: ${dish.serving}` : cmsText("food-menu:ac02b5ec4ee1", "Serving: To confirm")}</span>
        <strong>{dish.price != null ? formatPrice(dish.price) : cmsText("food-menu:8b68986c2879", "Price to confirm")}</strong>
      </div>
      <div className="food-menu-item-notes">
        <span><Leaf aria-hidden="true" /> {dish.dietary || cmsText("food-menu:92eef2522b2a", "Dietary information to confirm.")}</span>
        <span><Info aria-hidden="true" /> {cmsText("food-menu:296e10a15332", "Availability to confirm.")}</span>
      </div>
    </article>
  );
}

export function FoodMenuContent({ onContact }: FoodMenuProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(foodMenuCategories[0]?.id ?? "");
  const searchInput = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredCategories = useMemo(
    () => foodMenuCategories
      .map((category) => ({
        ...category,
        dishes: category.dishes.filter((dish) =>
          `${dish.name} ${dish.description}`.toLocaleLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.dishes.length > 0),
    [normalizedQuery],
  );
  const resultsCount = filteredCategories.reduce((total, category) => total + category.dishes.length, 0);

  useEffect(() => {
    if (filteredCategories.length === 0) {
      setActiveCategory("");
      return;
    }

    let frame = 0;
    function updateActiveCategory() {
      frame = 0;
      const readingLine = Math.max(120, Math.min(window.innerHeight * 0.25, 180));
      let current = filteredCategories[0].id;
      for (const category of filteredCategories) {
        const section = document.getElementById(category.id);
        if (section && section.getBoundingClientRect().top <= readingLine) current = category.id;
      }
      setActiveCategory(current);
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateActiveCategory);
    }

    updateActiveCategory();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [filteredCategories]);

  function clearSearch() {
    setQuery("");
    searchInput.current?.focus();
  }

  return (
    <main className="food-menu-page">
      <div className="food-menu-container food-menu-topline">
        <nav className="food-menu-breadcrumb" aria-label="Breadcrumb">
          <a href="/">{cmsText("food-menu:3a78695388b3", "Home")}</a><span aria-hidden="true">/</span>
          <a href="/restaurant">{cmsText("food-menu:1212ea9e2094", "Restaurant")}</a><span aria-hidden="true">/</span>
          <span aria-current="page">{cmsText("food-menu:5ca82dd533e0", "Food Menu")}</span>
        </nav>
        <a className="food-menu-back" href="/restaurant"><ArrowLeft aria-hidden="true" /> {cmsText("food-menu:65be6c505260", "Back to Restaurant")}</a>
      </div>

      <section className="food-menu-container food-menu-hero" aria-labelledby="food-menu-title">
        <div className="food-menu-hero-copy">
          <p className="food-menu-eyebrow">{cmsText("food-menu:748ec7f61421", "From the kitchen")}</p>
          <h1 id="food-menu-title">{cmsText("food-menu:5ca82dd533e0", "Food Menu")}</h1>
          <h2>{cmsText("food-menu:5af672760db4", "Find something to savour.")}</h2>
          <p className="food-menu-intro">{cmsText("food-menu:d3f299e07cc9", "Browse our menu for a taste of The Mud House. From familiar comforts to regional flavours, plan your next meal with us.")}</p>
          <div className="food-menu-actions">
            <a className="food-menu-button" href="#menu-categories">{cmsText("food-menu:11fccbaa9100", "Browse Categories ")}<ArrowDown aria-hidden="true" /></a>
            <a className="food-menu-button food-menu-button-outline" href="/restaurant#table-request">{cmsText("food-menu:f15cb5f4fd2a", "Request a Table")}</a>
          </div>
          <p className="food-menu-note">{cmsText("food-menu:6c5f0bdef5a3", "Illustrative menu layout — dishes, prices, and dietary details await restaurant approval.")}</p>
        </div>
        <figure className="food-menu-hero-photo">
          <FoodMenuPhoto name="hero" />
          <figcaption>{cmsText("food-menu:1355b2b8cd8f", "Concept food image — menu item to confirm.")}</figcaption>
        </figure>
      </section>

      <div className="food-menu-facts" aria-label="Menu information">
        <div className="food-menu-container">
          <div className="food-menu-fact"><CalendarDays aria-hidden="true" /><span>{cmsText("food-menu:721130c8cbde", "Menu update date to confirm.")}</span></div>
          <div className="food-menu-fact"><FileText aria-hidden="true" /><span>{cmsText("food-menu:ba8cda14f218", "Tax and charge information")}<br /> {cmsText("food-menu:a44014d57331", "to confirm.")}</span></div>
          <div className="food-menu-fact"><Clock3 aria-hidden="true" /><span>{cmsText("food-menu:ea8922279803", "Availability information")}<br /> {cmsText("food-menu:a44014d57331", "to confirm.")}</span></div>
        </div>
      </div>

      <div className="food-menu-container food-menu-catalog" id="menu-categories">
        <aside className="food-menu-sidebar" aria-label="Find a dish">
          <div className="food-menu-sidebar-inner">
            <label className="food-menu-search-label" htmlFor="food-menu-search">{cmsText("food-menu:fc7f50b0fcff", "Search the menu")}</label>
            <div className="food-menu-search-field">
              <Search aria-hidden="true" />
              <input
                ref={searchInput}
                id="food-menu-search"
                type="search"
                placeholder="Search dishes or descriptions"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
              />
              {query && <button type="button" aria-label="Clear menu search" onClick={clearSearch}><X aria-hidden="true" /></button>}
            </div>
            <nav className="food-menu-category-nav" aria-label="Menu categories">
              <h2>{cmsText("food-menu:ad712d1503b0", "Menu Categories")}</h2>
              <div className="food-menu-category-links">
              {foodMenuCategories.map((category) => {
                const available = filteredCategories.some((item) => item.id === category.id);
                return (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className={`food-menu-category-link${activeCategory === category.id ? " is-active" : ""}`}
                    aria-current={activeCategory === category.id ? "location" : undefined}
                    aria-disabled={!available || undefined}
                    tabIndex={available ? undefined : -1}
                    onClick={(event) => {
                      if (!available) event.preventDefault();
                      else setActiveCategory(category.id);
                    }}
                  >
                    {category.name}
                  </a>
                );
              })}
              </div>
            </nav>
          </div>
          <blockquote className="food-menu-quote"><Sprout aria-hidden="true" /><p>{cmsText("food-menu:07c6e70a6447", "Good food")}<br />{cmsText("food-menu:4393fc0ca353", "brings people")}<br />{cmsText("food-menu:25e3d2254208", "together.")}</p></blockquote>
        </aside>

        <div className="food-menu-groups" aria-label="Illustrative food menu">
          <p className={normalizedQuery ? "food-menu-results" : "sr-only"} role="status" aria-live="polite" aria-atomic="true">
            {normalizedQuery
              ? `${resultsCount} ${resultsCount === 1 ? "dish" : "dishes"} found for “${query.trim()}”.`
              : `${resultsCount} dishes across ${foodMenuCategories.length} menu categories.`}
          </p>
          {filteredCategories.length === 0 ? (
            <section className="food-menu-empty" aria-labelledby="food-menu-empty-title">
              <Search aria-hidden="true" />
              <h2 id="food-menu-empty-title">{cmsText("food-menu:768c6286b5a3", "No dishes found.")}</h2>
              <p>{cmsText("food-menu:771b6477fe6d", "Try another dish or ingredient, or browse the complete illustrative menu.")}</p>
              <button className="food-menu-button food-menu-button-outline" type="button" onClick={clearSearch}>{cmsText("food-menu:3b7ea51793e9", "Clear search")}</button>
            </section>
          ) : filteredCategories.map((category) => (
            <section key={category.id} id={category.id} className="food-menu-group" aria-labelledby={`category-${category.id}`}>
              <header className="food-menu-group-header">
                <h2 id={`category-${category.id}`}>{category.name}</h2>
                <small>{cmsText("food-menu:a28538321822", "Illustrative menu – items await approval")}</small>
              </header>
              <div className="food-menu-group-body">
                <figure className="food-menu-category-photo">
                  <FoodMenuPhoto name={category.photo} />
                  <figcaption>{cmsText("food-menu:1355b2b8cd8f", "Concept food image — menu item to confirm.")}</figcaption>
                </figure>
                <div className="food-menu-items">{category.dishes.map((dish) => <MenuDish key={dish.id} dish={dish} />)}</div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="food-menu-container food-menu-dietary" aria-labelledby="food-menu-dietary-title">
        <Sprout aria-hidden="true" />
        <div><h2 id="food-menu-dietary-title">{cmsText("food-menu:edb8f50f3cbc", "Have a dietary requirement?")}</h2><p>{cmsText("food-menu:6bac3e48e4f3", "Please speak with our restaurant team about ingredients and preparation before ordering. Our team will be happy to guide you.")}</p></div>
        <button className="food-menu-button" type="button" onClick={() => onContact("Ask About the Menu")}>{cmsText("food-menu:c6aba98251e7", "Ask About the Menu")}</button>
      </section>

      <section className="food-menu-cta" aria-labelledby="food-menu-cta-title">
        <div className="food-menu-container">
          <Utensils aria-hidden="true" />
          <div className="food-menu-cta-copy"><h2 id="food-menu-cta-title">{cmsText("food-menu:bdb6010fbe2b", "Bring your appetite. We’ll help plan the table.")}</h2><p>{cmsText("food-menu:c35a125f566f", "Explore our restaurant or send a request for your preferred date and time.")}</p></div>
          <div className="food-menu-cta-actions">
            <div className="food-menu-actions"><a className="food-menu-button food-menu-button-gold" href="/restaurant#table-request">{cmsText("food-menu:fde6c6c3f0cb", "Request a Table ")}<ArrowRight aria-hidden="true" /></a><a className="food-menu-button food-menu-button-outline" href="/restaurant">{cmsText("food-menu:5d88652907c8", "Explore the Restaurant")}</a></div>
            <p>{cmsText("food-menu:e146ccd3a09e", "A table request is not a confirmed reservation.")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
