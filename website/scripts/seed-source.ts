import { roomCatalog, roomCrops } from "../app/rooms-data";
import { roomDetails } from "../app/room-detail-data";
import { travelPackages, travelCrops } from "../app/travel-data";
import { restaurantCrops } from "../app/restaurant-data";
import { foodMenuCategories, foodMenuCrops } from "../app/food-menu-data";
import { experienceCrops } from "../app/experience-data";
import { aboutCrops } from "../app/about";
import { guestFAQs } from "../app/guest-faq-data";
import { photographs } from "../app/guest-gallery";
import type { CmsState, ImageSlot } from "../cms/types";

export const seed: CmsState = {
  revision: 1, updatedAt: new Date().toISOString(),
  settings: { name: "The Mud House", tagline: "VARANASI", email: "hello@themudhouse.in", phone: "", whatsapp: "", address: "Varanasi, Uttar Pradesh, India · Exact address to confirm", mapUrl: "", accentColor: "#581b15", backgroundColor: "#f8f5f0", logoMediaId: "", bookingsOpen: true, staysOpen: true, diningOpen: true, experiencesOpen: true, closedMessage: "Online booking requests are currently paused. Please contact the team for assistance.", currency: "INR" },
  content: {}, images: {}, media: [],
  rooms: roomCatalog.map((room) => ({id:`${room.image}-room`, name:room.name, image:room.image, description:room.description, overview:roomDetails[`${room.image}-room`].overview, caption:room.caption, guests:room.guests, beds:room.beds, bedDetail:room.bedDetail, features:room.features, rate:null, enabled:true, bookingOpen:true, blockedDates:[], imageMediaId:""})),
  packages: travelPackages.map((item) => ({...item,price:null,duration:"To confirm",includes:[],excludes:[],enabled:true,bookingOpen:true,blockedDates:[],imageMediaId:""})),
  menu:foodMenuCategories.flatMap((category)=>category.dishes.map((dish)=>({...dish,category:category.id,price:null,serving:"To confirm",dietary:"Please ask the team",enabled:true,imageMediaId:""}))),
  faqs:guestFAQs.map(faq=>({...faq,enabled:true})),
  gallery:photographs.map(photo=>({...photo,mediaId:"",enabled:true})),
};
const homeCrops = {lounge:[420,335,264,167],stay:[42,515,203,86],food:[261,515,203,86],boat:[480,515,203,86],deluxe:[43,790,201,100],premium:[262,790,201,100],family:[481,790,201,100],restaurant:[43,1085,288,165],curry:[341,1085,112,165],sunrise:[43,1329,201,84],walk:[262,1329,201,84],ghats:[481,1329,201,84]} as Record<string,[number,number,number,number]>;
export const imageSlots: ImageSlot[] = [{id:"home:hero",label:"Homepage hero",source:"Home",src:"/images/hero.png"}];
for (const [source,file,crops] of [["home","reference",homeCrops],["about","about-reference",aboutCrops],["rooms","rooms-reference",roomCrops],["travel","travel-reference",travelCrops],["restaurant","restaurant-reference",restaurantCrops],["experience","experience-reference",experienceCrops],["food-menu","food-menu-reference",foodMenuCrops]] as const) {
  for(const [name,crop] of Object.entries(crops)) imageSlots.push({id:`${source}:${name}`,label:`${source} · ${name}`,source,src:`/images/${file}.png`,crop:crop as [number,number,number,number]});
}
for(const room of Object.values(roomDetails)) for(const photo of [room.hero,...room.photos,room.accessPhoto]) if(!imageSlots.some(item=>item.id===`room-detail:${photo.id}`)) imageSlots.push({id:`room-detail:${photo.id}`,label:photo.alt,source:"Room detail",src:photo.src,crop:photo.crop});
