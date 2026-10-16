export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const invalid = (message) => { throw new HttpError(400, message); };
export function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(`${label} must be an object.`);
  if (Object.keys(value).some(key => ['__proto__', 'constructor', 'prototype'].includes(key))) invalid(`${label} has an invalid field.`);
  return value;
}
export function string(value, label, max = 5000, required = false) {
  if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) invalid(`${label} must be text of at most ${max} characters.`);
  if (required && !value.trim()) invalid(`${label} is required.`);
  return value;
}
const bool = (value, label) => { if (typeof value !== 'boolean') invalid(`${label} must be true or false.`); return value; };
const number = (value, label, min, max) => { if (!Number.isFinite(value) || value < min || value > max) invalid(`${label} must be between ${min} and ${max}.`); return value; };
const integer = (value, label, min, max) => { number(value, label, min, max); if (!Number.isInteger(value)) invalid(`${label} must be a whole number.`); return value; };
const choice = (value, choices, label) => { if (!choices.includes(value)) invalid(`${label} is invalid.`); return value; };
const array = (value, label, max = 500) => { if (!Array.isArray(value) || value.length > max) invalid(`${label} must be a list of at most ${max} entries.`); return value; };
const slug = (value, label) => { string(value, label, 100, true); if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || ['constructor', 'prototype', '__proto__'].includes(value)) invalid(`${label} must contain lowercase words separated by hyphens.`); return value; };
const list = (value, label) => array(value, label, 50).map(item => string(item, label, 2000));
const price = (value, label) => value === null ? null : number(value, label, 0, 100000000);
export function date(value, label) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(`${value}T00:00:00Z`)) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) invalid(`${label} must be a valid date.`);
  return value;
}
function blocks(value) {
  return array(value, 'Blocked dates', 500).map(item => {
    object(item, 'Date block'); const from = date(item.from, 'Start date'); const to = date(item.to, 'End date');
    if (to < from) invalid('Blocked date end must not precede its start.');
    return { from, to };
  });
}
const href = (value, label, httpsOnly = false) => {
  string(value, label, 2000);
  if (!value) return value;
  if (!httpsOnly && /^\/(?!\/)[^\\\s]*$/.test(value)) return value;
  try { const url = new URL(value); if (url.protocol === 'https:' && !url.username && !url.password) return value; } catch {}
  invalid(`${label} must be a site path or an HTTPS address.`);
};

export function validateSite(input, { media, roomIds, contentKeys, imageKeys }) {
  const value = object(input, 'Site'); const s = object(value.settings, 'Settings');
  const mediaIds = new Set(media.map(item => item.id));
  const mediaId = (id, label) => { string(id, label, 100); if (id && !mediaIds.has(id)) invalid(`${label} refers to a missing image.`); return id; };
  const hex = (value, label) => { if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) invalid(`${label} must be a six-digit hex color.`); return value; };
  const settings = {
    name: string(s.name, 'Hotel name', 160, true), tagline: string(s.tagline, 'Tagline', 300),
    email: string(s.email, 'Email', 254), phone: string(s.phone, 'Phone', 80), whatsapp: string(s.whatsapp, 'WhatsApp', 80),
    address: string(s.address, 'Address', 1000), mapUrl: href(s.mapUrl, 'Map URL', true),
    accentColor: hex(s.accentColor, 'Accent color'), backgroundColor: hex(s.backgroundColor, 'Background color'),
    logoMediaId: mediaId(s.logoMediaId, 'Logo image'), bookingsOpen: bool(s.bookingsOpen, 'Bookings open'),
    staysOpen: bool(s.staysOpen, 'Stays open'), diningOpen: bool(s.diningOpen, 'Dining open'), experiencesOpen: bool(s.experiencesOpen, 'Experiences open'),
    closedMessage: string(s.closedMessage, 'Closed message', 1000), currency: string(s.currency, 'Currency', 3, true),
  };
  if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) invalid('Enter a valid contact email.');
  if (!/^[A-Z]{3}$/.test(settings.currency)) invalid('Currency must use three uppercase letters.');
  const content = Object.fromEntries(Object.entries(object(value.content, 'Content')).map(([key, text]) => {
    if (!/^[a-zA-Z0-9_.:-]{1,200}$/.test(key)) invalid('Content key is invalid.');
    if (contentKeys && !contentKeys.has(key)) invalid('This page content field does not exist. Reload the editor.');
    return [key, string(text, 'Page content', 30000)];
  }));
  if (Object.keys(content).length > 5000) invalid('Too many content entries.');
  const images = Object.fromEntries(Object.entries(object(value.images, 'Images')).map(([key, item]) => {
    if (!/^[a-zA-Z0-9_.:-]{1,200}$/.test(key)) invalid('Image key is invalid.');
    if (imageKeys && !imageKeys.has(key)) invalid('This image placement does not exist. Reload the editor.');
    object(item, 'Image override'); const position = string(item.position, 'Image position', 60);
    if (!/^(?:(?:left|center|right|top|bottom)|(?:\d{1,3}(?:\.\d+)?%))(?: (?:left|center|right|top|bottom|\d{1,3}(?:\.\d+)?%))?$/.test(position)) invalid('Image position must use percentages or alignment keywords.');
    return [key, { mediaId: mediaId(item.mediaId, 'Image override'), alt: string(item.alt, 'Image description', 500), position }];
  }));
  if (Object.keys(images).length > 2000) invalid('Too many image overrides.');
  const unique = (entries, label) => { const ids = entries.map(item => item.id); if (new Set(ids).size !== ids.length) invalid(`${label} contains duplicate IDs.`); return entries; };
  const rooms = unique(array(value.rooms, 'Rooms', 4).map(item => {
    object(item, 'Room'); return {
      id: slug(item.id, 'Room ID'), name: string(item.name, 'Room name', 160, true), image: choice(item.image, ['deluxe', 'premium', 'family', 'dormitory'], 'Room image'),
      description: string(item.description, 'Room description'), overview: string(item.overview, 'Room overview', 15000), caption: string(item.caption, 'Room caption', 500),
      guests: integer(item.guests, 'Room guests', 1, 100), beds: string(item.beds, 'Room beds', 200), bedDetail: string(item.bedDetail, 'Bed detail', 500),
      features: list(item.features, 'Room features'), rate: price(item.rate, 'Room rate'), enabled: bool(item.enabled, 'Room enabled'), bookingOpen: bool(item.bookingOpen, 'Room booking open'),
      blockedDates: blocks(item.blockedDates), imageMediaId: mediaId(item.imageMediaId, 'Room image'),
    };
  }), 'Rooms');
  if (rooms.length !== roomIds.length || rooms.some(item => !roomIds.includes(item.id))) invalid('The four room category IDs must be preserved.');
  const packages = unique(array(value.packages, 'Packages', 100).map(item => {
    object(item, 'Package'); return {
      id: slug(item.id, 'Package ID'), name: string(item.name, 'Package name', 160, true), category: choice(item.category, ['tour', 'stay-tour'], 'Package category'),
      photo: choice(item.photo, ['hero', 'sunrise', 'heritage', 'stay', 'steps', 'skyline'], 'Package photo'), description: string(item.description, 'Package description'), concept: string(item.concept, 'Package concept', 1000),
      itinerary: array(item.itinerary, 'Itinerary', 50).map(step => { object(step, 'Itinerary step'); return { title: string(step.title, 'Step title', 250, true), description: string(step.description, 'Step description', 5000) }; }),
      price: price(item.price, 'Package price'), duration: string(item.duration, 'Duration', 500), includes: list(item.includes, 'Inclusions'), excludes: list(item.excludes, 'Exclusions'),
      enabled: bool(item.enabled, 'Package enabled'), bookingOpen: bool(item.bookingOpen, 'Package booking open'), blockedDates: blocks(item.blockedDates), imageMediaId: mediaId(item.imageMediaId, 'Package image'),
    };
  }), 'Packages');
  const menu = unique(array(value.menu, 'Menu', 500).map(item => {
    object(item, 'Menu item'); return { id: slug(item.id, 'Dish ID'), category: choice(item.category, ['starters', 'main-course', 'breads-rice', 'desserts', 'beverages'], 'Dish category'), name: string(item.name, 'Dish name', 160, true), description: string(item.description, 'Dish description'), price: price(item.price, 'Dish price'), serving: string(item.serving, 'Serving', 500), dietary: string(item.dietary, 'Dietary information', 1000), enabled: bool(item.enabled, 'Dish enabled'), imageMediaId: mediaId(item.imageMediaId, 'Dish image') };
  }), 'Menu');
  const faqs = unique(array(value.faqs, 'FAQs', 500).map(item => {
    object(item, 'FAQ'); return { id: slug(item.id, 'FAQ ID'), category: choice(item.category, ['stay', 'dining', 'experiences', 'arrival', 'enquiries'], 'FAQ category'), question: string(item.question, 'Question', 1000, true), answer: string(item.answer, 'Answer', 10000, true), ...(item.href !== undefined ? { href: href(item.href, 'FAQ link') } : {}), ...(item.linkLabel !== undefined ? { linkLabel: string(item.linkLabel, 'FAQ link label', 200) } : {}), enabled: bool(item.enabled, 'FAQ enabled') };
  }), 'FAQs');
  const gallery = unique(array(value.gallery, 'Gallery', 500).map(item => {
    object(item, 'Gallery image');
    if (imageKeys && !imageKeys.has(`${item.source}:${item.photo}`)) invalid('Choose an existing gallery photo or a valid fallback image.');
    return { id: slug(item.id, 'Gallery ID'), category: choice(item.category, ['Rooms', 'Dining', 'Spaces', 'Varanasi'], 'Gallery category'), source: choice(item.source, ['about', 'rooms', 'restaurant', 'travel', 'experience'], 'Gallery source'), photo: string(item.photo, 'Gallery photo', 100), title: string(item.title, 'Image title', 250, true), alt: string(item.alt, 'Image description', 500), href: href(item.href, 'Gallery link'), link: string(item.link, 'Gallery link label', 200), mediaId: mediaId(item.mediaId, 'Gallery image'), enabled: bool(item.enabled, 'Gallery enabled') };
  }), 'Gallery');
  return { revision: 0, updatedAt: '', settings, content, images, media, rooms, packages, menu, faqs, gallery };
}

export function validateBooking(input, site, { manual = false, now = Date.now(), today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now)) } = {}) {
  const v = object(input, 'Enquiry');
  if (v.website) invalid('Unable to submit this enquiry.');
  const result = {
    type: choice(v.type, ['stay', 'dining', 'experience', 'general'], 'Enquiry type'), name: string(v.name, 'Guest name', 160, true).trim(),
    contact: string(v.contact, 'Contact details', 254, true).trim(), method: choice(v.method, ['Email', 'Phone', 'WhatsApp'], 'Contact method'),
    message: string(v.message, 'Message', 10000), consent: bool(v.consent, 'Privacy consent'), requestId: string(v.requestId, 'Request ID', 100, true),
  };
  if (!/^[a-zA-Z0-9_-]{8,100}$/.test(result.requestId)) invalid('Request ID is invalid.');
  if (!result.consent) invalid('Please accept the privacy notice to send an enquiry.');
  if (result.method === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.contact)) invalid('Enter a valid email address.');
  if (result.method !== 'Email' && (!/^\+?[\d .()-]{6,40}$/.test(result.contact) || result.contact.replace(/\D/g, '').length < 7 || result.contact.replace(/\D/g, '').length > 15)) invalid('Enter a valid phone number with 7–15 digits.');
  if (v.itemId) result.itemId = slug(v.itemId, 'Selected item');
  if (v.date) result.date = date(v.date, 'Preferred date');
  if (v.endDate) result.endDate = date(v.endDate, 'End date');
  if (v.time) { if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time)) invalid('Preferred time is invalid.'); result.time = v.time; }
  if (v.guests !== undefined) result.guests = integer(v.guests, 'Guests', 1, 200);
  if (v.rooms !== undefined) result.rooms = integer(v.rooms, 'Rooms', 1, 100);
  if (result.endDate && !result.date) invalid('A start date is required with an end date.');
  if (result.endDate && result.endDate < result.date) invalid('End date must not precede start date.');
  if (!manual && result.date && result.date < today) invalid('Please choose today or a future date.');
  if (result.type === 'stay' && (!result.date || !result.endDate || result.endDate <= result.date)) invalid('Please choose valid check-in and check-out dates.');
  if (['experience', 'dining'].includes(result.type) && !result.date) invalid('Please choose a preferred date.');
  if (!manual && result.type === 'dining' && (!result.time || Date.parse(`${result.date}T${result.time}:00+05:30`) <= now)) invalid('Please choose a future dining time in India Standard Time.');
  const item = result.type === 'stay' ? site.rooms.find(item => item.id === result.itemId) : result.type === 'experience' ? site.packages.find(item => item.id === result.itemId) : undefined;
  if (['stay', 'experience'].includes(result.type) && result.itemId && !item) invalid('The selected room or package is unavailable.');
  if (!['stay', 'experience'].includes(result.type) && result.itemId) invalid('This enquiry type cannot contain a room or package.');
  if (!manual) {
    const sectionOpen = { stay: site.settings.staysOpen, dining: site.settings.diningOpen, experience: site.settings.experiencesOpen, general: true }[result.type];
    if (result.type !== 'general' && (!site.settings.bookingsOpen || !sectionOpen)) throw new HttpError(409, site.settings.closedMessage || 'Enquiries are currently closed. Please contact the hotel.');
    if (item && (!item.enabled || !item.bookingOpen)) throw new HttpError(409, 'This room or package is not accepting requests. Please choose another option.');
    if (item && result.date && item.blockedDates.some(block => result.type === 'stay' ? result.date <= block.to && result.endDate > block.from : result.date <= block.to && (result.endDate || result.date) >= block.from)) throw new HttpError(409, 'Your selected dates are unavailable. Please choose different dates.');
  }
  return result;
}

export const bookingStatuses = ['new', 'contacted', 'confirmed', 'cancelled', 'completed'];
export function validateBookingUpdate(input) {
  const value = object(input, 'Booking update');
  return { status: choice(value.status, bookingStatuses, 'Booking status'), notes: string(value.notes, 'Internal notes', 20000) };
}
