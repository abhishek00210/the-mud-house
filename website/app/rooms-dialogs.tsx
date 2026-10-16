import { cmsText } from "../cms/client";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Ruler,
  UsersRound,
} from "lucide-react";
import { RoomPhoto, roomCatalog } from "./rooms-data";

export function RoomDetailContent({
  index,
  onEnquire,
}: {
  index: number;
  onEnquire: (title: string) => void;
}) {
  const room = roomCatalog[index];
  return (
    <div className="stay-room-detail">
      <div className="stay-detail-photo">
        <RoomPhoto name={room.image} alt={`${room.name} concept photograph`} />
      </div>
      <p className="form-note">
        {cmsText("rooms-dialogs:2a9cf3987405", "Concept photograph · Final room and bed arrangements are subject to availability.")}</p>
      <p>{room.detail}</p>
      <div className="stay-detail-facts">
        <span>
          <UsersRound />
          {room.occupancy}
        </span>
        <span>
          <BedDouble />
          {room.beds} {room.bedDetail}
        </span>
      </div>
      <h3>{cmsText("rooms-dialogs:972b26163e12", "Room facilities")}</h3>
      <ul className="stay-detail-facilities">
        {room.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <p className="form-note">
        {cmsText("rooms-dialogs:ca39f3eecf72", "Breakfast inclusion is unconfirmed. Ask our team for the rate, inclusions and cancellation terms for your dates.")}</p>
      <button
        className="button"
        onClick={() => onEnquire(`${room.name} — rates and availability`)}
      >
        <CalendarDays />
        {cmsText("rooms-dialogs:b5008cc6f7cb", "Enquire About This Room ")}<ArrowRight />
      </button>
    </div>
  );
}

export function FloorPlanContent({
  index,
  onEnquire,
}: {
  index: number;
  onEnquire: (title: string) => void;
}) {
  const room = roomCatalog[index];
  return (
    <div className="stay-floor-notice">
      <Ruler aria-hidden="true" />
      <h3>{cmsText("rooms-dialogs:cb74d4917cd6", "Make room for a little clarity.")}</h3>
      <p>
        {cmsText("rooms-dialogs:6a8cae682386", "A verified floor plan for the ")}{room.name.toLowerCase()} {cmsText("rooms-dialogs:783e6bb3353d", "is not available yet. Our team can help confirm the layout, bed arrangement and dimensions before you book.")}</p>
      <p className="form-note">
        {cmsText("rooms-dialogs:22c313c67d55", "For access requirements, please also ask about door widths, steps and bathroom arrangements.")}</p>
      <button
        className="button"
        onClick={() => onEnquire(`${room.name} — floor plan and dimensions`)}
      >
        {cmsText("rooms-dialogs:92e081611384", "Request Floor Plan ")}<ArrowRight />
      </button>
    </div>
  );
}
