import { ManagedImage, hasManagedImage } from "../cms/managed-image";
import { cmsText, getSite } from "../cms/client";
import { FoodMenuPhoto, type FoodMenuPhotoName } from "./food-menu-data";
export const restaurantCrops = {
  hero: [372, 50, 350, 217],
  table: [28, 353, 293, 170],
  curry: [39, 618, 202, 122],
  paneer: [261, 618, 202, 122],
  dessert: [483, 618, 203, 122],
  setting: [28, 963, 241, 190],
  flowers: [275, 963, 118, 82],
  lounge: [275, 1069, 118, 85],
  entrance: [399, 963, 138, 190],
  map: [552, 1252, 145, 64],
  vase: [28, 1681, 91, 138],
} satisfies Record<string, [number, number, number, number]>;
export type RestaurantPhotoName = keyof typeof restaurantCrops;
export const restaurantPhotoLabels: Record<RestaurantPhotoName, string> = {
  hero: "Warm restaurant interior with wooden tables, leafy plants and an arched alcove",
  table: "A thoughtfully set dining table with candles and a vase of greenery",
  curry: "Seasonal vegetable curry in a copper bowl, illustrated menu concept",
  paneer: "Paneer with herbs and vegetables, illustrated menu concept",
  dessert: "Indian sweets in a brass bowl, illustrated menu concept",
  setting: "Restaurant seating with plants, natural finishes and warm lighting",
  flowers: "Dining table with flowers and glasses",
  lounge: "A quiet dining corner with cushioned seating",
  entrance: "Arched restaurant entrance with a menu chalkboard",
  map: "Illustrative map with a location pin; restaurant location is awaiting confirmation",
  vase: "A ceramic vase with greenery in a sunlit corner",
};
export function RestaurantPhoto({
  name,
  className = "",
  alt,
  mediaId,
}: {
  name: RestaurantPhotoName;
  className?: string;
  alt?: string;
  mediaId?: string;
}) {
  if (hasManagedImage(`restaurant:${name}`, mediaId)) return <ManagedImage slot={`restaurant:${name}`} mediaId={mediaId} alt={alt ?? restaurantPhotoLabels[name]} className={`dining-photo ${className}`} />;
  return (
    <svg
      className={`dining-photo ${className}`}
      viewBox={restaurantCrops[name].join(" ")}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt ?? restaurantPhotoLabels[name]}
    >
      <image
        href="/images/restaurant-reference.png"
        width="724"
        height="2172"
      />
    </svg>
  );
}
export const restaurantGallery: RestaurantPhotoName[] = [
  "setting",
  "flowers",
  "lounge",
  "entrance",
  "hero",
  "table",
];
type RestaurantDish = {
  id: string;
  name: string;
  description: string;
  note: string;
  photo: RestaurantPhotoName;
  categoryPhoto?: FoodMenuPhotoName;
  imageMediaId?: string;
  price?: number | null;
};
const originalDishes: RestaurantDish[] = [
  {
    id: "vegetable-curry",
    name: "Seasonal Vegetable Curry",
    description:
      cmsText("restaurant-data:5eed7f5a185b", "A flavourful curry made with fresh, seasonal ingredients. Menu details to confirm."),
    note: "Dietary information to confirm.",
    photo: "curry",
  },
  {
    id: "paneer",
    name: "Paneer Tikka (Style to confirm)",
    description:
      cmsText("restaurant-data:f5c54a3a8776", "A classic favourite, prepared with fresh ingredients and traditional flavours."),
    note: "Dietary information to confirm.",
    photo: "paneer",
  },
  {
    id: "something-sweet",
    name: "A Taste of Something Sweet",
    description:
      cmsText("restaurant-data:7f9389ccb4ff", "A traditional Indian dessert, with the menu item and preparation to be confirmed."),
    note: "Dietary information to confirm.",
    photo: "dessert",
  },
];
// Keep the restaurant preview varied; the full menu lists every enabled dish.
const menuPhotoByCategory: Record<string, FoodMenuPhotoName> = {
  starters: "starters", "main-course": "mainCourse", "breads-rice": "breadsRice",
  desserts: "desserts", beverages: "beverages",
};
const previewCategories = ["main-course", "starters", "desserts"];
const managedMenu = getSite()?.menu.filter(dish => dish.enabled);
const featuredMenu = managedMenu && [
  ...previewCategories.flatMap(category => managedMenu.find(dish => dish.category === category) ?? []),
  ...managedMenu.filter(dish => !previewCategories.some(category => managedMenu.find(item => item.category === category)?.id === dish.id)),
].slice(0, 3);
export const dishes: RestaurantDish[] = featuredMenu?.map(dish => ({
  id: dish.id, name: dish.name, description: dish.description,
  note: dish.dietary || "Dietary information to confirm.",
  imageMediaId: dish.imageMediaId, price: dish.price,
  photo: dish.category === "main-course" ? "curry" : dish.category === "desserts" ? "dessert" : "paneer",
  categoryPhoto: menuPhotoByCategory[dish.category],
})) ?? originalDishes;

export function RestaurantDishPhoto({ dish }: { dish: RestaurantDish }) {
  if (hasManagedImage(`restaurant:${dish.photo}`, dish.imageMediaId)) {
    return <RestaurantPhoto name={dish.photo} mediaId={dish.imageMediaId} alt={dish.name} />;
  }
  if (dish.categoryPhoto && !["starters", "mainCourse", "desserts"].includes(dish.categoryPhoto)) {
    return <FoodMenuPhoto name={dish.categoryPhoto} className="dining-photo" />;
  }
  return <RestaurantPhoto name={dish.photo} alt={dish.name} />;
}

const originalRestaurantFAQs = [
  {
    question: cmsText("restaurant-data:25c076a16cf1", "Can I dine without staying at the hotel?"),
    answer:
      cmsText("restaurant-data:ee9dc1d3cd72", "Our non-resident dining policy is awaiting confirmation. Please contact the team before planning a visit."),
  },
  {
    question: cmsText("restaurant-data:3349dfcf4532", "What cuisine is served?"),
    answer:
      cmsText("restaurant-data:45496aebedb9", "Our cuisine and menu approach are still to be confirmed. Explore the food concepts above, then ask the team for the current menu and available dishes."),
  },
  {
    question: cmsText("restaurant-data:f975b4030833", "What are the restaurant’s service hours?"),
    answer:
      cmsText("restaurant-data:b647a1ec12cc", "Service hours, operating days and last orders are awaiting confirmation. Include your preferred date and time in a table request and the team will advise."),
  },
  {
    question: cmsText("restaurant-data:04d330fc42a5", "How do table requests work?"),
    answer:
      cmsText("restaurant-data:06ba40f57bd8", "Share your preferred date, time and guest count, review your details, and send your request to our team. A reference number confirms that it was received. Your table is reserved only when the team confirms availability with you."),
  },
  {
    question: cmsText("restaurant-data:6fc576923e28", "How can I discuss dietary or access requirements?"),
    answer:
      cmsText("restaurant-data:922322fd63b3", "Add your dietary, access or seating needs to the request form. Please confirm ingredients, allergens and access arrangements directly with the team before your visit; accommodations are subject to confirmation."),
  },
];

export const restaurantFAQs = getSite()?.faqs.filter(faq => faq.enabled && faq.category === "dining") ?? originalRestaurantFAQs;
