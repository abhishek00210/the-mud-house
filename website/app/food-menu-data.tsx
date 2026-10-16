import { getSite, mediaById } from "../cms/client";
import { ManagedImage, hasManagedImage } from "../cms/managed-image";
export const foodMenuCrops = {
  hero: [362, 92, 335, 195],
  starters: [208, 444, 120, 100],
  mainCourse: [208, 796, 120, 100],
  breadsRice: [208, 1139, 120, 99],
  desserts: [208, 1371, 120, 100],
  beverages: [208, 1602, 120, 100],
} satisfies Record<string, [number, number, number, number]>;

export type FoodMenuPhotoName = keyof typeof foodMenuCrops;

const foodMenuPhotoLabels: Record<FoodMenuPhotoName, string> = {
  hero: "A bowl of curry with flatbread at a candlelit table, a concept food image",
  starters: "Paneer with herbs in a ceramic bowl, a concept starter",
  mainCourse: "Seasonal vegetable curry in a warm earthenware bowl, a concept main course",
  breadsRice: "Freshly baked flatbread in a woven basket, a concept bread selection",
  desserts: "Indian sweets in a patterned brass bowl, a concept dessert",
  beverages: "Steaming masala chai in a terracotta cup, a concept beverage",
};

export function FoodMenuPhoto({
  name,
  className = "",
}: {
  name: FoodMenuPhotoName;
  className?: string;
}) {
  if (hasManagedImage(`food-menu:${name}`, undefined)) return <ManagedImage slot={`food-menu:${name}`} mediaId={undefined} className={`food-menu-photo ${className}`} />;
  return (
    <svg
      className={`food-menu-photo ${className}`}
      viewBox={foodMenuCrops[name].join(" ")}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={foodMenuPhotoLabels[name]}
    >
      <image href="/images/food-menu-reference.png" width="724" height="2172" />
    </svg>
  );
}

export type FoodMenuDish = {
  price?: number | null;
  serving?: string;
  dietary?: string;
  imageMediaId?: string;
  id: string;
  name: string;
  description: string;
};

export type FoodMenuCategory = {
  id: string;
  name: string;
  photo: FoodMenuPhotoName;
  dishes: FoodMenuDish[];
};

const originalFoodMenuCategories: FoodMenuCategory[] = [
  {
    id: "starters",
    name: "Starters",
    photo: "starters",
    dishes: [
      {
        id: "paneer-tikka",
        name: "Paneer Tikka (Style to confirm)",
        description: "Marinated cottage cheese, grilled to perfection (serving style to confirm).",
      },
      {
        id: "seasonal-vegetable-tikka",
        name: "Seasonal Vegetable Tikka",
        description: "Selection of seasonal vegetables, marinated and grilled (style to confirm).",
      },
      {
        id: "soup-of-the-day",
        name: "Soup of the Day",
        description: "Freshly prepared soup with seasonal ingredients (recipe to confirm).",
      },
    ],
  },
  {
    id: "main-course",
    name: "Main Course",
    photo: "mainCourse",
    dishes: [
      {
        id: "seasonal-vegetable-curry",
        name: "Seasonal Vegetable Curry",
        description: "A flavourful curry made with seasonal vegetables (recipe to confirm).",
      },
      {
        id: "paneer-butter-masala",
        name: "Paneer Butter Masala (Style to confirm)",
        description: "Classic preparation with rich, aromatic gravy (style to confirm).",
      },
      {
        id: "dal-of-the-day",
        name: "Dal of the Day",
        description: "A traditional lentil preparation (recipe to confirm).",
      },
    ],
  },
  {
    id: "breads-rice",
    name: "Breads & Rice",
    photo: "breadsRice",
    dishes: [
      {
        id: "house-flatbread",
        name: "House Flatbread",
        description: "Freshly baked bread (varieties to confirm).",
      },
      {
        id: "saffron-rice",
        name: "Saffron Rice",
        description: "Fragrant basmati rice with subtle saffron (recipe to confirm).",
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    photo: "desserts",
    dishes: [
      {
        id: "something-sweet",
        name: "A Taste of Something Sweet",
        description: "A traditional dessert (variety to confirm).",
      },
      {
        id: "seasonal-dessert",
        name: "Seasonal Dessert",
        description: "Chef’s special sweet (details to confirm).",
      },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    photo: "beverages",
    dishes: [
      {
        id: "masala-chai",
        name: "Masala Chai",
        description: "Aromatic spiced tea (recipe to confirm).",
      },
      {
        id: "fresh-lime-soda",
        name: "Fresh Lime Soda",
        description: "Refreshing beverage (variety to confirm).",
      },
    ],
  },
];

export const foodMenuCategories: FoodMenuCategory[] = originalFoodMenuCategories.map(category => ({...category,dishes: getSite()?.menu.filter(dish=>dish.enabled && dish.category===category.id) ?? category.dishes})).filter(category=>category.dishes.length);
