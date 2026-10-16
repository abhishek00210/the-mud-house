import { ManagedImage, hasManagedImage } from "../cms/managed-image";
import { cmsText, getSite, mediaById } from "../cms/client";
import { roomCatalog, roomCrops, type StaySelection } from "./rooms-data";

export type DetailPhoto = {
  id: string;
  src: string;
  crop: [number, number, number, number];
  alt: string;
  label: string;
};
export type RoomDetailData = {
  slug: string;
  name: string;
  category: string;
  intro: string;
  overview: string;
  bed: string;
  occupancy: string;
  extraBed: string;
  bathroom: string;
  view: string;
  hero: DetailPhoto;
  photos: DetailPhoto[];
  accessPhoto: DetailPhoto;
  amenities: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
  isDormitory: boolean;
};

function photo(
  id: string,
  source: string,
  crop: DetailPhoto["crop"],
  alt: string,
  label = "Concept photograph · Final room may vary",
): DetailPhoto {
  return { id, src: `/images/${source}.png`, crop, alt, label };
}
const deluxeHero = photo(
  "deluxe-hero",
  "room-detail-reference",
  [319, 75, 378, 172],
  "Deluxe bedroom with warm wood furniture and a sunlit balcony",
);
const deluxeBedroom = photo(
  "deluxe-bedroom",
  "room-detail-reference",
  [33, 280, 175, 127],
  "Deluxe bedroom with patterned bed runner and balcony doors",
);
const dormitorySecond = photo(
  "dormitory-bunks-alternate",
  "room-detail-reference",
  [592, 1396, 102, 85],
  "Shared dormitory concept with wooden bunk beds",
);
const deluxeBathroom = photo(
  "deluxe-bathroom",
  "room-detail-reference",
  [34, 1294, 185, 173],
  "Concept bathroom with glass shower, stone basin and round mirror",
  "Bathroom concept · Arrangement to confirm",
);
const desk = photo(
  "deluxe-desk",
  "room-detail-reference",
  [396, 280, 148, 128],
  "Wooden writing desk with a table lamp and greenery",
);
const premiumSecond = photo(
  "premium-bedroom-alternate",
  "reference",
  [262, 790, 201, 100],
  "Premium bedroom concept with a seating area by the window",
);
const familySecond = photo(
  "family-bedroom-alternate",
  "reference",
  [481, 790, 201, 100],
  "Family bedroom concept with two beds and warm lighting",
);
const basin = photo(
  "bathroom-detail",
  "about-reference",
  [518, 975, 171, 124],
  "Stone washbasin and brass tap in a warm bathroom",
  "Bathroom detail concept · Arrangement to confirm",
);
const reception = photo(
  "shared-reception",
  "about-reference",
  [289, 811, 177, 126],
  "Comfortable shared reception with cushioned seating",
  "Shared reception · Concept photograph",
);
const lounge = photo(
  "shared-lounge",
  "reference",
  [420, 335, 264, 167],
  "Quiet shared lounge with soft cushions and greenery",
  "Shared lounge · Concept photograph",
);
const entrance = photo(
  "hotel-entrance",
  "about-reference",
  [35, 811, 244, 288],
  "Arched hotel entrance framed by plants and lanterns",
  "Hotel entrance · Concept photograph",
);
const restaurant = photo(
  "shared-restaurant",
  "reference",
  [43, 1085, 288, 165],
  "Warm restaurant interior with wooden dining tables",
  "Hotel restaurant · Concept photograph",
);
const river = photo(
  "varanasi-river",
  "reference",
  [481, 1329, 201, 84],
  "Varanasi ghats beside the Ganga",
  "Around Varanasi · Room view to confirm",
);

function categoryHero(index: number) {
  const room = roomCatalog[index];
  return photo(
    `${room.image}-bedroom`,
    "rooms-reference",
    roomCrops[room.image],
    `${room.name} interior with warm light and natural materials`,
  );
}

const commonFAQs = [
  {
    question: cmsText("room-detail-data:c728d2aad267", "What is the room size?"),
    answer:
      cmsText("room-detail-data:e0c16c5d7514", "The measured room area is awaiting confirmation. Ask our team for dimensions and a verified layout before booking."),
  },
  {
    question: cmsText("room-detail-data:0b728d0566fd", "Are there any accessibility features?"),
    answer:
      cmsText("room-detail-data:006fbbb769ea", "Please tell us your access needs. The team can confirm floor level, lift or step access, door widths and bathroom arrangements for the room offered."),
  },
  {
    question: cmsText("room-detail-data:01130273eb67", "What is included in the room rate?"),
    answer:
      cmsText("room-detail-data:7f6517386a00", "Request a quote for your dates. Breakfast, taxes, payment terms and cancellation conditions will be explained with the rate; inclusions are not yet confirmed."),
  },
];

export const roomDetails: Record<string, RoomDetailData> = {
  "deluxe-room": {
    slug: "deluxe-room",
    name: "Deluxe Room",
    category: "Private room",
    intro:
      cmsText("room-detail-data:95493bb58002", "A comfortable and thoughtfully designed room for a relaxing stay in the heart of Varanasi, with warm interiors and modern comforts."),
    overview:
      cmsText("room-detail-data:8131fc410d94", "The Deluxe Room offers a calm and comfortable space to unwind after a day of exploring Varanasi. Warm, earthy tones and thoughtful details bring together everyday comforts and a sense of place for a relaxed stay."),
    bed: "King / Queen bed",
    occupancy: "Up to 2 guests",
    extraBed: "On request · To confirm",
    bathroom: "Ensuite · Details to confirm",
    view: "Awaiting confirmation",
    hero: deluxeHero,
    photos: [deluxeBedroom, deluxeBathroom, desk, river],
    accessPhoto: deluxeBathroom,
    amenities: [
      "Air conditioning",
      "Wi-Fi",
      "Tea / coffee maker",
      "In-room safe · To confirm",
      "Work desk",
      "Comfortable bedding",
      "Television · To confirm",
      "Wardrobe",
      "Seating · To confirm",
      "Housekeeping · To confirm",
    ],
    faqs: [
      commonFAQs[0],
      {
        question: cmsText("room-detail-data:12e5bdbb2035", "Can an extra bed be arranged?"),
        answer:
          cmsText("room-detail-data:d8da9d659644", "Extra bedding depends on space and availability. Share the age and number of additional guests so the team can advise on the best room."),
      },
      {
        question: cmsText("room-detail-data:56c85d5d4960", "Is the room suitable for families with children?"),
        answer:
          cmsText("room-detail-data:fcd98c7505ee", "The Deluxe category is listed for up to two guests. For children or additional sleeping space, ask about an extra bed or explore the Family Room."),
      },
      commonFAQs[1],
      commonFAQs[2],
    ],
    related: ["premium-room", "dormitory-room"],
    isDormitory: false,
  },
  "premium-room": {
    slug: "premium-room",
    name: "Premium Room",
    category: "Spacious private room",
    intro:
      cmsText("room-detail-data:064f64f678bb", "A little more room to slow down. Warm textures, comfortable seating and a restful bed make a welcoming base for your time in Kashi."),
    overview:
      cmsText("room-detail-data:8b5e3b2012ff", "The Premium Room brings a more spacious feel to your stay, with room to sit, read and unwind. Suitable for couples or a small family, it offers a comfortable setting for unhurried mornings and quiet evenings after exploring the city."),
    bed: "King bed or twin beds",
    occupancy: "Up to 3 guests",
    extraBed: "On request · To confirm",
    bathroom: "Attached · Details to confirm",
    view: "Awaiting confirmation",
    hero: categoryHero(1),
    photos: [categoryHero(1), premiumSecond, basin, reception],
    accessPhoto: basin,
    amenities: [
      "Air conditioning",
      "Wi-Fi",
      "Mini fridge",
      "Tea / coffee maker · To confirm",
      "Work desk",
      "Comfortable bedding",
      "Television · To confirm",
      "Wardrobe · To confirm",
      "Seating area",
      "Housekeeping · To confirm",
    ],
    faqs: [
      commonFAQs[0],
      {
        question: cmsText("room-detail-data:e8112dd997bd", "Can I request twin beds?"),
        answer:
          cmsText("room-detail-data:33a1efbe4ede", "The Premium category lists king or twin bed arrangements. Please include your preference in the enquiry; the team will confirm the available setup for your dates."),
      },
      {
        question: cmsText("room-detail-data:134dcfff2701", "Can three guests stay together?"),
        answer:
          cmsText("room-detail-data:9f938e6f1500", "The category is listed for up to three guests. The third guest’s sleeping arrangement, any extra bedding and related charges need to be confirmed with your quote."),
      },
      commonFAQs[1],
      commonFAQs[2],
    ],
    related: ["deluxe-room", "family-room"],
    isDormitory: false,
  },
  "family-room": {
    slug: "family-room",
    name: "Family Room",
    category: "Private family room",
    intro:
      cmsText("room-detail-data:cb9c1d9ecf41", "Space to stay close and settle in together. A welcoming room for shared stories, relaxed mornings and family time in Varanasi."),
    overview:
      cmsText("room-detail-data:f78688bdbc84", "The Family Room is designed around time together, with sleeping arrangements for up to four guests and a place to relax between outings. Let us know the ages of your children and your preferred bed setup so our team can help plan a comfortable stay."),
    bed: "2 Queens or King + 2 Singles",
    occupancy: "Up to 4 guests",
    extraBed: "Subject to room capacity",
    bathroom: "Ensuite · Details to confirm",
    view: "Awaiting confirmation",
    hero: categoryHero(2),
    photos: [categoryHero(2), familySecond, lounge, entrance],
    accessPhoto: deluxeBathroom,
    amenities: [
      "Air conditioning",
      "Wi-Fi",
      "Extra bedding · On request",
      "Tea / coffee maker · To confirm",
      "Storage · To confirm",
      "Flexible bed arrangements",
      "Television · To confirm",
      "Ensuite bathroom",
      "Seating area",
      "Housekeeping · To confirm",
    ],
    faqs: [
      commonFAQs[0],
      {
        question: cmsText("room-detail-data:0cee434ac067", "Which bed arrangements are available?"),
        answer:
          cmsText("room-detail-data:dea763843627", "The listed options are two queen beds or one king bed with two singles. Your preferred arrangement is a request and will be confirmed by the team before booking."),
      },
      {
        question: cmsText("room-detail-data:a8b9baac1533", "Can we request bedding for a child?"),
        answer:
          cmsText("room-detail-data:88f06e931737", "Please share your children’s ages and sleeping needs. Extra bedding is subject to room capacity and availability; the team will explain any additional charges."),
      },
      commonFAQs[1],
      commonFAQs[2],
    ],
    related: ["premium-room", "deluxe-room"],
    isDormitory: false,
  },
  "dormitory-room": {
    slug: "dormitory-room",
    name: "Dormitory Room",
    category: "Shared room · Individual bed",
    intro:
      cmsText("room-detail-data:c16e3c76118a", "A friendly, affordable base for curious travellers. Settle into your own bunk, meet fellow guests and explore more of Varanasi together."),
    overview:
      cmsText("room-detail-data:2d0fac6a97b3", "Our shared dormitory offers individual bunk beds for solo travellers, friends and groups. Enquire by the number of beds you need, and tell us about your group so the team can confirm availability, room arrangements and the facilities for your stay."),
    bed: "Individual two-tier bunk",
    occupancy: "1 guest per bed",
    extraBed: "Request additional bunk beds",
    bathroom: "Access and sharing to confirm",
    view: "Awaiting confirmation",
    hero: categoryHero(3),
    photos: [categoryHero(3), dormitorySecond, restaurant, entrance],
    accessPhoto: basin,
    amenities: [
      "Air conditioning",
      "Wi-Fi",
      "Individual bunk bed",
      "Lockers · To confirm",
      "Charging points · To confirm",
      "Bedding · To confirm",
      "Bathroom access",
      "Luggage storage · To confirm",
      "Shared hotel spaces",
      "Housekeeping · To confirm",
    ],
    faqs: [
      {
        question: cmsText("room-detail-data:edef0b7cebee", "Am I enquiring for a bed or a whole room?"),
        answer:
          cmsText("room-detail-data:1335e6630f99", "Dormitory enquiries are for individual beds, with one guest per bed. To request the entire dormitory for a group, mention this in your enquiry and the team will confirm the options."),
      },
      {
        question: cmsText("room-detail-data:16a634ec3223", "Can our group stay in the same dormitory?"),
        answer:
          cmsText("room-detail-data:92268e33adf1", "Please provide your dates, guest count and number of beds. The team will confirm whether your group can be accommodated together; this is subject to availability."),
      },
      {
        question: cmsText("room-detail-data:0be7d232f80a", "Are bathrooms shared and are lockers provided?"),
        answer:
          cmsText("room-detail-data:a23e37e5500a", "Bathroom arrangements and locker availability are awaiting confirmation. Ask about these details, along with any privacy preferences, before booking."),
      },
      commonFAQs[1],
      commonFAQs[2],
    ],
    related: ["deluxe-room", "family-room"],
    isDormitory: true,
  },
};

for (const managed of getSite()?.rooms ?? []) {
  const room = roomDetails[managed.id];
  if (!room) continue;
  if (!managed.enabled) { delete roomDetails[managed.id]; continue; }
  Object.assign(room, {name:managed.name, intro:managed.description, overview:managed.overview,
    bed:[managed.beds,managed.bedDetail].filter(Boolean).join(" · "), occupancy:`Up to ${managed.guests} guests`, amenities:managed.features});
}

export function DetailPhotoView({
  photo,
  className = "",
}: {
  photo: DetailPhoto;
  className?: string;
}) {
  const managedRoom = getSite()?.rooms.find(room => [room.image + "-hero", room.image + "-bedroom"].includes(photo.id));
  if (hasManagedImage(`room-detail:${photo.id}`, managedRoom?.imageMediaId)) return <ManagedImage slot={`room-detail:${photo.id}`} mediaId={managedRoom?.imageMediaId} alt={photo.alt} className={`rd-photo ${className}`} />;
  return (
    <svg
      className={`rd-photo ${className}`}
      viewBox={photo.crop.join(" ")}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={photo.alt}
    >
      <image href={photo.src} width="724" height="2172" />
    </svg>
  );
}

export function normalizeStayForRoom(
  slug: string,
  selection: StaySelection,
): StaySelection {
  const target = Object.hasOwn(roomDetails, slug)
    ? roomDetails[slug]
    : undefined;
  if (!target) return selection;
  const sourceUnit = selection.unit ?? "rooms";
  const targetUnit = target.isDormitory ? "beds" : "rooms";
  const capacity =
    roomCatalog.find((room) => `${room.image}-room` === slug)?.guests ?? 2;
  const count =
    sourceUnit === targetUnit
      ? selection.rooms
      : target.isDormitory
        ? selection.guests
        : Math.ceil(selection.guests / capacity);
  return {
    ...selection,
    rooms: target.isDormitory
      ? Math.max(selection.guests, Math.min(12, count))
      : Math.max(1, Math.min(6, count)),
    unit: targetUnit,
  };
}

export function roomDetailHref(slug: string, selection?: StaySelection) {
  const params = new URLSearchParams();
  if (selection) {
    selection = normalizeStayForRoom(slug, selection);
    if (selection.checkIn) params.set("checkIn", selection.checkIn);
    if (selection.checkOut) params.set("checkOut", selection.checkOut);
    if (selection.guests) params.set("guests", String(selection.guests));
    if (selection.rooms) params.set("rooms", String(selection.rooms));
    params.set("unit", selection.unit ?? "rooms");
  }
  return `/rooms/${slug}${params.size ? `?${params}` : ""}`;
}

export function readStaySelection(defaultGuests = 2): StaySelection {
  const params = new URLSearchParams(window.location.search);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const date = (key: string) => {
    const value = params.get(key) ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < today) return "";
    const parsed = new Date(`${value}T12:00:00`);
    return !Number.isNaN(parsed.getTime()) &&
      parsed.getFullYear() === Number(value.slice(0, 4)) &&
      parsed.getMonth() + 1 === Number(value.slice(5, 7)) &&
      parsed.getDate() === Number(value.slice(8, 10))
      ? value
      : "";
  };
  const count = (key: string, fallback: number, max: number) => {
    const value = Number(params.get(key));
    return Number.isInteger(value) && value >= 1 && value <= max
      ? value
      : fallback;
  };
  const checkIn = date("checkIn");
  const checkOut = date("checkOut");
  const selection: StaySelection = {
    checkIn,
    checkOut: checkIn && checkOut > checkIn ? checkOut : "",
    guests: count("guests", defaultGuests, 12),
    rooms: count("rooms", 1, 12),
    unit: params.get("unit") === "beds" ? "beds" : "rooms",
  };
  const slug = window.location.pathname.split("/").filter(Boolean)[1] ?? "";
  return normalizeStayForRoom(slug, selection);
}
