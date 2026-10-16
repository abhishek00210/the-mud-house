import { getSite } from "../cms/client";
import { ManagedImage, hasManagedImage } from "../cms/managed-image";
export type StaySelection = {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  unit?: "rooms" | "beds";
};
export type RoomPhotoName =
  "hero" | "deluxe" | "premium" | "family" | "dormitory";
export const roomCrops: Record<
  RoomPhotoName,
  [number, number, number, number]
> = {
  hero: [340, 43, 381, 209],
  deluxe: [37, 464, 258, 202],
  premium: [37, 707, 258, 206],
  family: [37, 953, 258, 208],
  dormitory: [37, 1202, 258, 213],
};
export function RoomPhoto({
  name,
  className = "",
  alt,
}: {
  name: RoomPhotoName;
  className?: string;
  alt?: string;
}) {
  if (hasManagedImage(`rooms:${name}`, getSite()?.rooms.find(room => room.image === name)?.imageMediaId)) return <ManagedImage slot={`rooms:${name}`} mediaId={getSite()?.rooms.find(room => room.image === name)?.imageMediaId} alt={alt} className={`room-photo ${className}`} />;
  const [x, y, w, h] = roomCrops[name];
  return (
    <svg
      className={`room-photo ${className}`}
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={
        alt ??
        `${name === "hero" ? "Riverside guest room" : name + " room"} concept photograph`
      }
    >
      <image href="/images/rooms-reference.png" width="724" height="2172" />
    </svg>
  );
}
const originalRoomCatalog = [
  {
    name: "Deluxe Room",
    image: "deluxe" as RoomPhotoName,
    description:
      "A comfortable and stylish room with thoughtful amenities for a relaxing and rejuvenating stay.",
    caption: "A cosy and elegant space for a relaxing getaway.",
    guests: 2,
    occupancy: "Up to 2 guests",
    beds: "King / Queen",
    bedDetail: "Bed",
    features: [
      "AC",
      "Ensuite bathroom",
      "Wi-Fi",
      "Tea/Coffee maker",
      "Wardrobe",
      "Work desk",
    ],
    detail:
      "A restful retreat for a couple or a solo traveller. Settle into warm interiors, take a moment over tea, and enjoy a comfortable base for your time in Varanasi.",
  },
  {
    name: "Premium Room",
    image: "premium" as RoomPhotoName,
    description:
      "A larger room with extra space, ideal for families, couples or travellers who enjoy a little more.",
    caption: "Spacious comfort with a touch of luxury.",
    guests: 3,
    occupancy: "Up to 3 guests",
    beds: "King Bed",
    bedDetail: "or Twin Beds",
    features: [
      "AC",
      "Ensuite bathroom",
      "Wi-Fi",
      "Mini fridge",
      "Seating area",
      "Work desk",
    ],
    detail:
      "Make room for a slower stay, with a seating area and space to unwind. Contact our team to confirm your preferred bed arrangement and the facilities for your dates.",
  },
  {
    name: "Family Room",
    image: "family" as RoomPhotoName,
    description:
      "A versatile room perfect for families, with comfortable space for everyone to relax, reconnect and feel at home.",
    caption: "Room for everyone, and memories that last.",
    guests: 4,
    occupancy: "Up to 4 guests",
    beds: "2 Queen Beds",
    bedDetail: "or 1 King + 2 Singles",
    features: [
      "AC",
      "Ensuite bathroom",
      "Wi-Fi",
      "Extra bedding (on request)",
      "Seating area",
    ],
    detail:
      "Stay together in a room designed around shared time and everyday comfort. Bed arrangements and extra bedding depend on availability; please share your family's needs when enquiring.",
  },
  {
    name: "Dormitory Room",
    image: "dormitory" as RoomPhotoName,
    description:
      "A comfortable and affordable option, ideal for groups or budget travellers. Share the vibe, make new friends, and experience more together.",
    caption: "Concept image · Shared dormitory room with multiple bunk beds.",
    guests: 1,
    occupancy: "1 guest per bed",
    beds: "Bunk Bed Style",
    bedDetail: "Two-tier",
    features: [
      "AC",
      "Multiple bunk beds",
      "Bathroom access",
      "Lockers (unconfirmed)",
      "Wi-Fi",
    ],
    detail:
      "A shared room with individual bunk beds for travellers and groups. Please enquire for bed availability, bathroom arrangements, locker details and any group requirements before booking.",
  },
];
export const roomCatalog = originalRoomCatalog.map(room => {
  const managed = getSite()?.rooms.find(item => item.id === `${room.image}-room`);
  return { ...room, ...managed, image: room.image, detail: managed?.overview ?? room.detail,
    occupancy: managed ? `Up to ${managed.guests} guests` : room.occupancy,
    enabled: managed?.enabled ?? true, bookingOpen: managed?.bookingOpen ?? true, rate: managed?.rate ?? null };
});

export const roomFAQs = [
  {
    question: "Is a dormitory room available at The Mud House?",
    answer:
      "Our room selection includes a shared dormitory with multiple bunk beds, air conditioning and bathroom access. It’s an option for groups or budget travellers. Please enquire for bed availability and group stays.",
  },
  {
    question: "Are all rooms air-conditioned?",
    answer:
      "Air conditioning is listed for each room category. Our team can confirm the facilities in your allocated room before you book.",
  },
  {
    question: "Is breakfast included in the room rate?",
    answer:
      "Breakfast inclusion is not yet confirmed and may depend on your room and rate plan. Please check what is included when requesting your quote.",
  },
  {
    question: "Can I book multiple rooms for a group?",
    answer:
      "Yes, you can enquire about several rooms together. Share your dates, guest count and preferred room types, and our team will help you explore the available options.",
  },
  {
    question: "Do you offer long-stay discounts?",
    answer:
      "Ask our team for a quote based on your dates and length of stay. Any extended-stay rates are subject to availability and confirmation.",
  },
];
