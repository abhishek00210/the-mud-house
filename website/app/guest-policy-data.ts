import { cmsText } from "../cms/client";
export type PolicySlug =
  | "privacy-policy"
  | "terms-and-conditions"
  | "cancellation-refund-policy"
  | "house-rules";

export interface PolicyPage {
  title: string;
  eyebrow: string;
  intro: string;
  status: string;
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
}

export const policyPages: Record<PolicySlug, PolicyPage> = {
  "privacy-policy": {
    title: "Privacy Policy",
    eyebrow: "YOUR DETAILS, WITH CLARITY",
    intro:
      cmsText("guest-policy-data:da0a700e834c", "Understand what happens when you prepare an enquiry on this website, and what still needs confirmation from the hotel."),
    status: cmsText("guest-policy-data:1cb0ae2b381f", "Hotel data-handling policy awaiting confirmation"),
    sections: [
      {
        id: "details-you-share",
        title: cmsText("guest-policy-data:434c1724085c", "The details you choose to share"),
        paragraphs: [
          cmsText("guest-policy-data:8fe36cb103cd", "Our request forms ask for information relevant to your plans, including your name, contact details, dates, guest numbers, room or experience choice and message. Submitted requests are available only to authenticated hotel staff."),
          cmsText("guest-policy-data:98e455984fee", "You can review and edit your enquiry before sending it to the hotel. Include only the personal details you want to share with the team."),
        ],
      },
      {
        id: "how-enquiries-work",
        title: "How website enquiries work",
        paragraphs: [
          cmsText("guest-policy-data:716066b7b950", "Preparing a request keeps your entries on the current page for review. Choosing Send request to hotel saves the details in the hotel\u2019s protected enquiry inbox; it does not confirm a booking."),
          cmsText("guest-policy-data:ca17a3579ea2", "If you choose the optional email fallback, a draft opens in your email application using the hotel\u2019s configured email address. You decide whether to send that email."),
          cmsText("guest-policy-data:cbd3327ae6cf", "The website does not provide a saved-draft account. Reloading or leaving the page may clear information you have entered."),
        ],
      },
      {
        id: "website-and-other-services",
        title: cmsText("guest-policy-data:fa59fb528d0a", "The website and other services"),
        paragraphs: [
          cmsText("guest-policy-data:a61eff24d182", "The website stores submitted requests on the hotel\u2019s server so authorised staff can respond. Admin sign-in uses a session cookie. Form drafts are not saved in browser storage, and this site does not take online payments."),
          cmsText("guest-policy-data:edb1d7395f43", "Your browser, email provider and website hosting services may process information separately. Their handling of that information is not described or guaranteed by this page."),
        ],
      },
      {
        id: "after-you-send",
        title: "After you send an enquiry",
        paragraphs: [
          cmsText("guest-policy-data:d41fe454f7fb", "The hotel's arrangements for handling received enquiries, retention periods, access to information and any sharing with service providers are awaiting confirmation. Those details will need to be supplied in the hotel's approved privacy policy."),
          cmsText("guest-policy-data:aff13785544c", "If you need to correct information you have already sent or ask how it will be handled, contact the team through your enquiry correspondence. This page does not promise a particular retention period or response time."),
        ],
      },
    ],
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    eyebrow: "PLAN YOUR VISIT WITH CLARITY",
    intro:
      cmsText("guest-policy-data:e7e6e379b083", "A guide to using this website and requesting arrangements. The hotel's booking terms are still awaiting confirmation."),
    status: cmsText("guest-policy-data:3e8435b371aa", "Hotel booking terms awaiting confirmation"),
    sections: [
      {
        id: "enquiry-and-confirmation",
        title: cmsText("guest-policy-data:c27b96085cee", "An enquiry starts a conversation"),
        paragraphs: [
          cmsText("guest-policy-data:88a7338cd63b", "Choosing dates, completing a form or sending an email requests information. It does not reserve a room, table, dormitory bed or travel experience."),
          cmsText("guest-policy-data:36b0626cba2a", "Before treating an arrangement as confirmed, ask the team for written details covering availability, the agreed service, the total price and the applicable conditions."),
        ],
      },
      {
        id: "images-and-information",
        title: cmsText("guest-policy-data:c881a4b7de9b", "Images and information on this website"),
        paragraphs: [
          cmsText("guest-policy-data:eeccbb2e5e70", "Images labelled as concept or illustrative show the intended look and feel. They are not verification of an actual room, view, dish or experience."),
          cmsText("guest-policy-data:0c15f7b28cd3", "Where details are marked as awaiting confirmation, ask the team before relying on them when making plans. Room facilities, menus, itineraries and access arrangements may need individual confirmation."),
        ],
      },
      {
        id: "your-quote",
        title: cmsText("guest-policy-data:d406d3c840b3", "What to confirm with your quote"),
        paragraphs: [
          cmsText("guest-policy-data:4dd5fa1afa9a", "The information below is a planning checklist, not a statement of the hotel's final terms. Ask for the details that apply to your request before proceeding."),
        ],
        bullets: [
          cmsText("guest-policy-data:6e99f96bd69c", "Dates, guest numbers and the room, meal or experience requested."),
          cmsText("guest-policy-data:3c046c9d06c6", "Total cost, taxes, inclusions and any additional charges."),
          cmsText("guest-policy-data:45ea55be8013", "Payment arrangements and when the booking becomes confirmed."),
          cmsText("guest-policy-data:1637f4fb19d6", "Changes, cancellation, refunds and any no-show conditions."),
          cmsText("guest-policy-data:cbe83af5935f", "Arrival arrangements and any access or other specific requirements."),
        ],
      },
      {
        id: "approved-terms",
        title: "The hotel's approved terms",
        paragraphs: [
          cmsText("guest-policy-data:f0d879d463bc", "Formal booking conditions, payment deadlines and other contractual terms have not yet been provided for this website. This information page does not create replacement terms or set fees."),
          cmsText("guest-policy-data:b9dc55722c25", "Ask the team to provide the current terms with your proposed arrangements, and keep a copy of the confirmation you receive."),
        ],
      },
    ],
  },
  "cancellation-refund-policy": {
    title: "Cancellation & Refund Policy",
    eyebrow: "WHEN PLANS CHANGE",
    intro:
      cmsText("guest-policy-data:6db3c895e173", "The conditions for changing or cancelling an arrangement need to be confirmed with the team before you book."),
    status: cmsText("guest-policy-data:d0bd6da7c875", "Cancellation and refund terms awaiting confirmation"),
    sections: [
      {
        id: "before-you-book",
        title: "Before you book",
        paragraphs: [
          cmsText("guest-policy-data:aeeefe5f2e30", "Cancellation windows, refund amounts, fees and processing times have not yet been supplied for this website. No refund entitlement or free-cancellation period is being offered here."),
          cmsText("guest-policy-data:7f83cba80d55", "Ask for the conditions that apply to your particular room, dining arrangement or experience as part of the written quote or booking confirmation."),
        ],
      },
      {
        id: "questions-to-confirm",
        title: cmsText("guest-policy-data:45be5ca28318", "A few useful details to confirm"),
        paragraphs: [
          cmsText("guest-policy-data:d2b7c6cc0089", "Clear written arrangements make it easier to understand your options if plans change."),
        ],
        bullets: [
          cmsText("guest-policy-data:204caf288632", "How and when a cancellation or date-change request must be made."),
          cmsText("guest-policy-data:ae720c41a213", "Whether a payment is refundable and which deductions, if any, apply."),
          cmsText("guest-policy-data:ea22557a7166", "Conditions for late arrival, early departure or not arriving."),
          cmsText("guest-policy-data:fbcece36d9af", "What happens if an experience or service cannot go ahead."),
          cmsText("guest-policy-data:1ebbc575fda5", "How an agreed refund would be returned and the expected timing."),
        ],
      },
      {
        id: "requesting-a-change",
        title: cmsText("guest-policy-data:bf233cc453be", "If you need to change an arrangement"),
        paragraphs: [
          cmsText("guest-policy-data:590a28176b96", "Contact the team through your existing booking correspondence and include your name, booking reference if available, original dates and the change you would like to request."),
          cmsText("guest-policy-data:965d76778b9b", "A message asking for a change is not confirmation that it has been accepted. Ask the team to confirm the outcome and any revised price or conditions in writing."),
        ],
      },
      {
        id: "website-enquiries",
        title: cmsText("guest-policy-data:073632e0d277", "If you have only prepared an enquiry"),
        paragraphs: [
          cmsText("guest-policy-data:025881c00429", "An unsent email draft or a completed website form does not create a booking. You can edit your enquiry before sending it, or discard it in your email application."),
          cmsText("guest-policy-data:ed4075df3e41", "If you already sent an enquiry and your plans have changed, reply to that correspondence so the team has your latest preferences."),
        ],
      },
    ],
  },
  "house-rules": {
    title: "House Rules",
    eyebrow: "A CONSIDERED STAY",
    intro:
      cmsText("guest-policy-data:de5279dfeb12", "A few questions to settle before your visit, so the arrangements suit you and everyone travelling with you."),
    status: cmsText("guest-policy-data:c981a3339976", "Property rules awaiting confirmation"),
    sections: [
      {
        id: "arrival-and-guests",
        title: "Arrival and guest details",
        paragraphs: [
          cmsText("guest-policy-data:f34589498aee", "The hotel's check-in and check-out times, identification requirements and guest-registration arrangements are awaiting confirmation."),
          cmsText("guest-policy-data:95486a048af6", "Share your expected arrival time and ask what you need to bring. If you need an early arrival, late departure or luggage arrangements, include that in your enquiry so the team can discuss what is possible."),
        ],
      },
      {
        id: "rooms-and-shared-spaces",
        title: "Rooms and shared spaces",
        paragraphs: [
          cmsText("guest-policy-data:44297643aa67", "Ask the team to explain any property rules relevant to your stay. The questions below do not imply that a particular activity is permitted or restricted."),
        ],
        bullets: [
          cmsText("guest-policy-data:bec64d64c95e", "What are the arrangements for visitors and additional overnight guests?"),
          cmsText("guest-policy-data:0dce519b7c08", "What is the current smoking policy?"),
          cmsText("guest-policy-data:42cd0e1c2e12", "Are pets accommodated, and are there any conditions?"),
          cmsText("guest-policy-data:d420d50d0202", "Are there quiet hours or guidance for shared spaces?"),
          cmsText("guest-policy-data:dea088dac6be", "What arrangements apply to children, extra beds and room occupancy?"),
        ],
      },
      {
        id: "dormitory-stays",
        title: cmsText("guest-policy-data:2849325ec63a", "Before choosing a dormitory stay"),
        paragraphs: [
          cmsText("guest-policy-data:268e13c0cbed", "Confirm the sleeping arrangement and shared facilities before booking a dormitory bed. Bed allocation, guest eligibility, bathroom access, luggage storage and locker arrangements are not yet verified on this website."),
          cmsText("guest-policy-data:3880f6e8ffd0", "Tell the team about any privacy, access or group preferences. Ask for the applicable shared-room rules and any items you will need to bring."),
        ],
      },
      {
        id: "your-requirements",
        title: cmsText("guest-policy-data:59ea0fcd12e3", "Help the team understand your needs"),
        paragraphs: [
          cmsText("guest-policy-data:db0b1293b42b", "Mention any access, mobility, dietary, sleeping or arrival requirements that matter to your visit. Ask the team to confirm the relevant facilities and arrangements before you book."),
          cmsText("guest-policy-data:d8f25b7a52e5", "An enquiry records your request; it does not guarantee that a particular arrangement can be provided. The property's approved house rules will be added when confirmed by the hotel."),
        ],
      },
    ],
  },
};

export function isPolicySlug(value: string): value is PolicySlug {
  return Object.prototype.hasOwnProperty.call(policyPages, value);
}

const policyLabels: Record<string, PolicySlug> = {
  "privacy policy": "privacy-policy",
  "privacy notice": "privacy-policy",
  "terms and conditions": "terms-and-conditions",
  "terms conditions": "terms-and-conditions",
  "cancellation and refund policy": "cancellation-refund-policy",
  "cancellation refund policy": "cancellation-refund-policy",
  "cancellation policy": "cancellation-refund-policy",
  "refund policy": "cancellation-refund-policy",
  "house rules": "house-rules",
};

export function policyHref(title: string): string | undefined {
  const label = title
    .toLowerCase()
    .replace(/&amp;|&/g, " and ")
    .replace(/-/g, " ")
    .replace(/^read\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
  const slug = Object.prototype.hasOwnProperty.call(policyLabels, label)
    ? policyLabels[label]
    : undefined;
  return slug ? `/${slug}` : undefined;
}
