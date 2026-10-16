import { getSite, mediaById } from "../cms/client";
import { ManagedImage, hasManagedImage } from "../cms/managed-image";
export const travelCrops = {
  hero: [357, 48, 367, 249],
  sunrise: [32, 462, 210, 127],
  heritage: [258, 462, 210, 127],
  stay: [484, 462, 210, 127],
  steps: [0, 1308, 279, 326],
  skyline: [373, 1902, 240, 120],
} satisfies Record<string, [number, number, number, number]>;

export type TravelPhotoName = keyof typeof travelCrops;

export const travelPhotoLabels: Record<TravelPhotoName, string> = {
  hero: "Boats beside the historic ghats of Varanasi in the warm evening light",
  sunrise: "A boat silhouetted against the rising sun on the Ganga",
  heritage: "A traveller exploring the narrow stone lanes of Varanasi",
  stay: "A warm guest room overlooking the river and temples of Kashi",
  steps: "Stone steps in Kashi with the words: Different journeys reveal different Kashis",
  skyline: "A silhouette of the Varanasi riverfront and a boat",
};

export function TravelPhoto({
  name,
  mediaId,
  className = "",
  alt,
}: {
  name: TravelPhotoName;
  className?: string;
  mediaId?: string;
  alt?: string;
}) {
  if (hasManagedImage(`travel:${name}`, mediaId)) return <ManagedImage slot={`travel:${name}`} mediaId={mediaId} alt={alt} className={`travel-photo ${className}`} />;
  return (
    <svg
      className={`travel-photo ${className}`}
      viewBox={travelCrops[name].join(" ")}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt ?? travelPhotoLabels[name]}
    >
      <image href="/images/travel-reference.png" width="724" height="2172" />
    </svg>
  );
}

export const travelGallery: TravelPhotoName[] = [
  "hero",
  "sunrise",
  "heritage",
  "stay",
];

export type TravelPackage = {
  id: string;
  imageMediaId?: string;
  price?: number | null;
  duration?: string;
  includes?: string[];
  excludes?: string[];
  bookingOpen?: boolean;
  name: string;
  category: "tour" | "stay-tour";
  photo: TravelPhotoName;
  description: string;
  concept: string;
  itinerary: { title: string; description: string }[];
};

const originalTravelPackages: TravelPackage[] = [
  {
    id: "sunrise-on-the-ganga",
    name: "Sunrise on the Ganga",
    category: "tour",
    photo: "sunrise",
    description: "Experience outline awaiting confirmation.",
    concept:
      "A concept for a quiet morning by the Ganga, taking in the changing light and the life of the riverfront. The route, boat arrangements and timings are awaiting confirmation.",
    itinerary: [
      {
        title: "Plan your morning",
        description:
          "Share your preferred date, traveller count and any access needs. The team will confirm whether this experience can be arranged.",
      },
      {
        title: "Explore the riverfront",
        description:
          "The concept centres on the Ganga at sunrise. Any boat trip, meeting point, route and guiding arrangements must be confirmed before booking.",
      },
      {
        title: "Confirm the details",
        description:
          "Ask for the proposed duration, transport, inclusions, exclusions and a quote for your dates before making plans.",
      },
    ],
  },
  {
    id: "varanasi-heritage-walk",
    name: "Varanasi Heritage Walk",
    category: "tour",
    photo: "heritage",
    description: "Experience outline awaiting confirmation.",
    concept:
      "A concept for discovering Kashi through its old lanes and everyday stories. Specific stops, guide arrangements, walking distance and access details are awaiting confirmation.",
    itinerary: [
      {
        title: "Share what interests you",
        description:
          "Tell us about your interests, preferred pace and any walking or access requirements so the team can discuss a suitable plan.",
      },
      {
        title: "Discover the lanes of Kashi",
        description:
          "This concept explores the city's living heritage. The route, stops, guide and any entry arrangements will be proposed for your review.",
      },
      {
        title: "Review your arrangements",
        description:
          "Confirm the meeting point, duration, group format, inclusions and quote with the team before booking.",
      },
    ],
  },
  {
    id: "stay-explore-kashi",
    name: "Stay & Explore Kashi",
    category: "stay-tour",
    photo: "stay",
    description: "Experience outline awaiting confirmation.",
    concept:
      "A concept combining time at The Mud House with experiences in Varanasi. Accommodation, length of stay, outings and package inclusions are subject to a confirmed proposal.",
    itinerary: [
      {
        title: "Find a stay that fits",
        description:
          "Share your dates, number of travellers and room preferences. Room category and availability will be confirmed by the team.",
      },
      {
        title: "Make space to discover Kashi",
        description:
          "Tell us which local experiences appeal to you. The team can discuss a proposed plan that suits your pace and interests.",
      },
      {
        title: "Confirm your package",
        description:
          "Review the proposed accommodation, experiences, meals, transfers, exclusions and total quote before confirming your booking.",
      },
    ],
  },
];

export const travelPackages: TravelPackage[] = getSite()?.packages.filter(item=>item.enabled).map(item=>({...item,photo:item.photo as TravelPhotoName})) ?? originalTravelPackages;

export const travelFAQs = [
  {
    question: "Is accommodation included in every package?",
    answer:
      "Not necessarily. Some experiences include a stay, while others are day experiences only. Details are subject to confirmation for each package.",
  },
  {
    question: "What does the displayed price cover?",
    answer:
      "Prices are currently awaiting confirmation. Request a quote for your dates and group, and ask the team to confirm the full price, inclusions, exclusions, taxes and any additional charges.",
  },
  {
    question: "Are experiences private or shared?",
    answer:
      "The arrangement for each experience is awaiting confirmation. Share your group size and preference for a private or shared experience in your enquiry.",
  },
  {
    question: "How do I discuss access or group requirements?",
    answer:
      "Add any walking, access, timing or group requirements to the travel enquiry form. Please confirm the route, transport and suitability with the team before booking.",
  },
  {
    question: "When is my booking confirmed?",
    answer:
      "An enquiry is not a confirmed booking. The team will confirm availability, your proposed arrangements, the quote and any booking conditions with you before a booking can be confirmed.",
  },
];
