import { ManagedImage, hasManagedImage } from "../cms/managed-image";
import { cmsText, getSite, mediaById } from "../cms/client";
import { TravelPhoto, travelPackages, type TravelPackage } from "./travel-data";

// Viewports retain the supplied image unchanged and leave its caption strips
// outside the photographs so the page can provide readable HTML captions.
export const experienceCrops = {
  main: [335, 87, 231, 193],
  temple: [571, 87, 129, 91],
  diya: [571, 197, 129, 83],
  cta: [0, 1880, 184, 94],
} satisfies Record<string, [number, number, number, number]>;

export type ExperiencePhotoName = keyof typeof experienceCrops | "heritage" | "stay";

const photoLabels: Record<ExperiencePhotoName, string> = {
  main: "Concept image of a small boat on the Ganga beside the ghats at sunrise",
  temple: "Concept image of the Varanasi riverfront and temples in the morning light",
  diya: "Concept image of a glowing diya beside the Ganga with boats in the distance",
  heritage: "Concept image of a traveller in the historic stone lanes of Varanasi",
  stay: "Concept image of a warm guest room overlooking the river and temples of Kashi",
  cta: "Gold line illustration of the Varanasi ghats and a boat",
};

export function ExperiencePhoto({
  name,
  mediaId,
  className = "",
  alt,
}: {
  name: ExperiencePhotoName;
  className?: string;
  mediaId?: string;
  alt?: string;
}) {
  if (hasManagedImage(`experience:${name}`, mediaId)) return <ManagedImage slot={`experience:${name}`} mediaId={mediaId} alt={alt} className={`experience-photo ${className}`} />;
  if (name === "heritage" || name === "stay") {
    return <TravelPhoto name={name} className={`experience-photo ${className}`} alt={alt ?? photoLabels[name]} />;
  }

  return (
    <svg
      className={`experience-photo ${className}`}
      viewBox={experienceCrops[name].join(" ")}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt ?? photoLabels[name]}
    >
      <image href="/images/experience-reference.png" width="724" height="2172" />
    </svg>
  );
}

export type ExperienceDetails = {
  travelPackage: TravelPackage;
  description: string;
  overview: string[];
  highlights: { title: string; detail: string }[];
  itinerary: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};

type ExperienceContent = Omit<ExperienceDetails, "travelPackage">;

const sharedFAQs = [
  {
    question: cmsText("experience-data:9ca1d3c6fe93", "Is transport provided?"),
    answer: cmsText("experience-data:020f5a68717d", "Transport and any transfers are awaiting confirmation. Please ask the team to confirm the meeting point, mode of transport and what is included in your quote."),
  },
  {
    question: cmsText("experience-data:0107d2dd537f", "Will a guide be included?"),
    answer: cmsText("experience-data:63e685a62603", "Guide arrangements and available languages are to be confirmed. Let us know your preferences when you enquire."),
  },
  {
    question: cmsText("experience-data:1a31631847c2", "Are meals included?"),
    answer: cmsText("experience-data:3cd6e0da1132", "Meals and refreshments are awaiting confirmation. Your proposal will need to specify any food or drinks included in the quoted package."),
  },
  {
    question: cmsText("experience-data:e23b0261c6ac", "What happens if arrangements change?"),
    answer: cmsText("experience-data:61a39a5a8f00", "Changes, cancellation terms and any arrangements for operator disruption are to be confirmed with the team before booking."),
  },
  {
    question: cmsText("experience-data:4df91d01f31f", "When is the booking confirmed?"),
    answer: cmsText("experience-data:ffecf4b8ff79", "Sending an enquiry does not confirm a booking. The team will discuss availability, the proposed arrangements, a quote and the applicable booking conditions with you."),
  },
];

const content: Record<string, ExperienceContent> = {
  "sunrise-on-the-ganga": {
    description: cmsText("experience-data:63dfe53f9d2c", "An early morning experience on the sacred Ganga, with iconic views, cultural sights and a different side of Varanasi."),
    overview: [
      "Witness the timeless beauty of Varanasi as the city awakens on the banks of the Ganga. This concept experience offers a peaceful and immersive way to see the ghats, life on the river and the morning rituals that make Kashi so special.",
      "Details are awaiting confirmation, and this is an indicative experience, not a confirmed itinerary.",
    ],
    highlights: [
      { title: cmsText("experience-data:bd1db132c3dc", "A unique perspective"), detail: cmsText("experience-data:adb279a4f814", "of Varanasi from the river") },
      { title: cmsText("experience-data:44a6cb3a4567", "Views of iconic ghats"), detail: cmsText("experience-data:12cd0c763f06", "and morning life") },
      { title: cmsText("experience-data:c1c0bcde3b42", "A peaceful and"), detail: cmsText("experience-data:bf0b818074cf", "enriching cultural experience") },
    ],
    itinerary: [
      { title: cmsText("experience-data:3a750f92b289", "Meeting arrangements"), description: cmsText("experience-data:aece99d7b967", "Meeting point / transfer details: To confirm") },
      { title: cmsText("experience-data:20f540df1ed6", "Experience programme"), description: cmsText("experience-data:b5e62b8b8ad5", "Programme details: To confirm") },
      { title: cmsText("experience-data:47ef5b210567", "Finish and onward arrangements"), description: cmsText("experience-data:0e8a4b1ad0df", "Drop-off / onward transfer details: To confirm") },
    ],
    faqs: [
      {
        question: cmsText("experience-data:d42f158c074f", "Where does the experience begin and end?"),
        answer: cmsText("experience-data:390dbf2b5c34", "The exact meeting point, start time and end point are to be confirmed. Details will be shared at the time of enquiry."),
      },
      ...sharedFAQs.slice(0, 3),
      {
        question: cmsText("experience-data:78839464e41b", "What are the access requirements?"),
        answer: cmsText("experience-data:6e51dd5ab35e", "Walking, steps, boat boarding, seating and toilet access are awaiting confirmation. Share your requirements so the team can discuss the proposed arrangements before you book."),
      },
      ...sharedFAQs.slice(3),
    ],
  },
  "varanasi-heritage-walk": {
    description: cmsText("experience-data:9515adb82cc4", "A concept walk through the old lanes of Kashi, with time for its living heritage, local stories and everyday details."),
    overview: [
      "Discover a different rhythm of Varanasi through its narrow lanes and the stories of the city. This concept centres on a thoughtful walk, with space to notice architecture, neighbourhood life and the details that give Kashi its character.",
      "The route, stops, walking distance and guide arrangements are awaiting confirmation. Share your interests and preferred pace so the team can discuss a suitable proposal.",
    ],
    highlights: [
      { title: cmsText("experience-data:c9673b841556", "The old lanes of Kashi"), detail: cmsText("experience-data:8d1e36286862", "and the stories they hold") },
      { title: cmsText("experience-data:43569de67746", "A closer look at"), detail: cmsText("experience-data:2c0408e4006a", "the city's living heritage") },
      { title: cmsText("experience-data:391a2794fb8f", "Time for the details"), detail: cmsText("experience-data:da638b7e7d1b", "at a pace to be discussed") },
    ],
    itinerary: [
      { title: cmsText("experience-data:54eb7ff8cfb6", "Meet and share your interests"), description: cmsText("experience-data:be8f5a778793", "Meeting point, walking pace and route briefing: To confirm") },
      { title: cmsText("experience-data:6e8114c8da4b", "Explore the lanes of Kashi"), description: cmsText("experience-data:475bb479a2c3", "Walking route, stops and guide arrangements: To confirm") },
      { title: cmsText("experience-data:c178ec7242ca", "Finish your walk"), description: cmsText("experience-data:d2e85b8fa10c", "End point and onward arrangements: To confirm") },
    ],
    faqs: [
      {
        question: cmsText("experience-data:3604996507f7", "Where does the walk begin and end?"),
        answer: cmsText("experience-data:2b24a30b1e5a", "The meeting point, proposed start time and end point are awaiting confirmation. The team will share the suggested route with your proposal."),
      },
      ...sharedFAQs.slice(0, 3),
      {
        question: cmsText("experience-data:a7aefdb4cb2c", "How much walking is involved?"),
        answer: cmsText("experience-data:5f80a76aa589", "The distance, duration, surfaces, steps and rest opportunities are to be confirmed. Let the team know your preferred pace and any access requirements before agreeing to a route."),
      },
      ...sharedFAQs.slice(3),
    ],
  },
  "stay-explore-kashi": {
    description: cmsText("experience-data:28fd719b2e38", "A concept combining a stay at The Mud House with time to discover Varanasi, shaped around your interests and your pace."),
    overview: [
      "Make room for both rest and discovery. This concept brings together time at The Mud House and experiences in Kashi, with a proposed plan that can be discussed around your dates, room preferences and interests.",
      "Accommodation, length of stay, outings, transfers and package inclusions are awaiting confirmation. Your enquiry starts a conversation about the arrangements that may suit your visit.",
    ],
    highlights: [
      { title: cmsText("experience-data:c2ad4f05051e", "A space to return to"), detail: cmsText("experience-data:d9d7052571f8", "between your time in the city") },
      { title: cmsText("experience-data:85db7ca5d744", "A deeper look at Kashi"), detail: cmsText("experience-data:17c7e7660c32", "through experiences to be discussed") },
      { title: cmsText("experience-data:954752472753", "Time for your interests"), detail: cmsText("experience-data:df6eba0ce05b", "with a proposed plan for your visit") },
    ],
    itinerary: [
      { title: cmsText("experience-data:5f2b0df30535", "Plan your arrival and stay"), description: cmsText("experience-data:50c969cd6302", "Room category, arrival and transfer arrangements: To confirm") },
      { title: cmsText("experience-data:1f0491aded4d", "Make time to explore Kashi"), description: cmsText("experience-data:1771c114a0f8", "Experience choices, schedule and local arrangements: To confirm") },
      { title: cmsText("experience-data:c91fb0acabc8", "Departure and onward plans"), description: cmsText("experience-data:b775ef9f2982", "Check-out, departure and onward transfers: To confirm") },
    ],
    faqs: [
      {
        question: cmsText("experience-data:eae0c476145d", "What accommodation does the package include?"),
        answer: cmsText("experience-data:be10db884448", "Room category, number of nights and accommodation availability are to be confirmed in your proposal. Share your dates, group size and room preferences when you enquire."),
      },
      ...sharedFAQs.slice(0, 3),
      {
        question: cmsText("experience-data:db152732e170", "Can I discuss room and experience access needs?"),
        answer: cmsText("experience-data:fd2410926707", "Yes. Add any room, bathroom, walking, seating or transport requirements to your enquiry. The team will need to confirm the suitability of both the stay and the proposed experiences before booking."),
      },
      ...sharedFAQs.slice(3),
    ],
  },
};

export function getExperienceDetails(id: string): ExperienceDetails | undefined {
  const travelPackage = travelPackages.find((item) => item.id === id);
  const details = content[id];
  if (!travelPackage) return undefined;
  const managed = getSite()?.packages.find(item=>item.id===id);
  const result = details ?? {description:travelPackage.description,overview:[travelPackage.concept],highlights:[],itinerary:travelPackage.itinerary,faqs:sharedFAQs};
  return {travelPackage,...result,...(managed ? {description:managed.description,overview:[managed.concept],itinerary:managed.itinerary,highlights:managed.includes.map(title=>({title,detail:cmsText("experience-data:de5de760c064", "Included in this package")}))} : {})};
}
