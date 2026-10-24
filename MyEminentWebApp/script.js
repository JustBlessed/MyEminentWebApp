"use strict";

/*
 * Eminent Protocol and Event Services — application logic.
 * Public API references: https://open-meteo.com/en/docs and
 * https://open-meteo.com/en/docs/geocoding-api and https://countries.dev/docs/api/name
 * External data is displayed with textContent, never untrusted HTML.
 */

const CONTACT_EMAIL = "eminentprotocolandeventservice@gmail.com";
const DRAFT_KEY = "eminent-booking-draft-v1";

const services = [
  {
    id: "airport-protocol", title: "Airport Protocol Services", category: "travel", featured: true,
    short: "Eminent Protocol and Event Services is registered with the Federal Airports Authority of Nigeria (FAAN) Passenger Support Services. Clients can access a protocol officer for assistance with airport processes at 22 commercial airports in Nigeria, subject to the procedures and requirements of each airport.",
    description: "We support clients with passenger processes for arrivals and departures. Our protocol officers help travellers navigate applicable airport procedures at 22 commercial airports across Nigeria, subject to airport regulations and local operational arrangements. Please provide your airport, date, flight details and the type of assistance required in your enquiry (do not submit passport numbers).",
    features: ["Airport processes and passenger assistance for arrivals or departures", "Protocol officer support at 22 commercial airports across Nigeria, subject to airport procedures", "Assistance tailored to the journey and local airport requirements"]
  },
  {
    id: "event-personnel", title: "Ushers, Waiters and Greeters", category: "events", featured: true,
    short: "Professional event personnel to welcome attendees, assist with guest seating and support hospitality at corporate and social occasions. Our ushers, waiters and greeters help your guests feel informed, comfortable and well looked after throughout your event.",
    description: "Eminent provides ushers, waiters and greeters for conferences, corporate functions, weddings and social celebrations. Our team can assist with arrivals, guest registration, seating and directions, hospitality service and general guest-facing support. Tell us the venue, event date, expected number of attendees and staffing needs so we can discuss suitable arrangements.",
    features: ["Ushers for guest registration, directions and seating", "Waiters for event hospitality and serving support", "Greeters to welcome attendees and support guest flow"]
  },
  {
    id: "flight-hotel", title: "Flight and Hotel Reservations", category: "travel",
    short: "Travel and accommodation arrangements for individuals and organisations.",
    description: "We work with travel agencies and hotels to assist individuals and organisations with flight and hotel reservation enquiries.",
    features: ["Travel agency coordination", "Hotel reservation assistance", "Individual and group travel enquiries"]
  },
  {
    id: "event-planning", title: "Event Planning and Management", category: "events",
    short: "From the first idea to on-the-day coordination, with connections to event vendors in Abuja.",
    description: "Eminent helps clients plan and manage corporate and social events, including concept development, budgets, venue planning, supplier coordination and event-day operations. We also act as an agent, connecting clients with relevant event vendors in Abuja according to their needs.",
    features: ["Event concepts, budgets, schedules and venue planning", "Introductions to suitable event vendors in Abuja", "Supplier coordination, staffing and on-the-day event management"]
  },
  {
    id: "promotional-models", title: "Brand Promotion", category: "talent",
    short: "Promotion support for products, services, exhibitions and brand activities.",
    description: "We help businesses organise brand promotion activities, product showcases and event-based marketing support.",
    features: ["Brand awareness and promotional events", "Product launches and corporate showcases", "Promotional staffing and campaign coordination"]
  },
  {
    id: "tailored-services", title: "Tailored Service Packages", category: "events",
    short: "Combine relevant protocol and event services around your needs.",
    description: "Tell us about your occasion and we can discuss a tailored combination of our services to meet your requirements.",
    features: ["Combine airport protocol and event staffing", "Discuss bespoke coordination needs", "Request a tailored proposal"]
  }
];

const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];
/* Photographs allocated by the business owner — originals copied unchanged. */
const servicePhotos = {
  "airport-protocol": [
    { file: "airport.jpg", alt: "Eminent protocol officer assisting a traveller with their luggage in an airport terminal.", caption: "Airport Protocol Services" }
  ],
  "event-personnel": [
    { file: "ushers.jpg", alt: "Eminent event ushers in blue uniforms supporting guest registration and providing event materials.", caption: "Ushers, Waiters and Greeters" }
  ],
  "flight-hotel": [
    { file: "flight-hotel.png", alt: "Purple and gold flight and hotel reservations promotional design with boarding pass, suitcase and hotel imagery.", caption: "Flight and hotel reservations" }
  ],
  "tailored-services": [
    { file: "tailored-services.png", alt: "Purple and gold tailored service packages design with hospitality planning clipboard, flowers and concierge bell.", caption: "Tailored service packages" }
  ],
  "event-planning": [
    { file: "events-1.jpg", alt: "Event organisers coordinating paperwork and activities outdoors.", caption: "Event coordination" },
    { file: "events-2.jpg", alt: "A member of the team being measured as part of an event preparation session.", caption: "Event preparation" },
    { file: "events-3.jpg", alt: "Eminent team preparing a registration desk at the National Aviation Conference.", caption: "Guest registration" }
  ],
  "promotional-models": [
    { file: "brand-1.jpg", alt: "Eminent brand-promotion team in black attire at a National Aviation Conference backdrop.", caption: "Brand promotion team" },
    { file: "brand-2.jpg", alt: "Eminent brand-promotion team wearing coordinated blue uniforms at a National Aviation Conference backdrop.", caption: "Event brand ambassadors" }
  ]
};

const serviceGrid = qs("#service-grid");
const serviceCount = qs("#service-count");
const serviceSearch = qs("#service-search");
const dialog = qs("#service-dialog");
const bookingForm = qs("#booking-form");
let activeFilter = "all";
let chosenService = null;

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function categoryLabel(category) {
  return ({ travel: "Airport and travel", events: "Events and hospitality", talent: "Brand promotion" })[category] || "Service";
}

function createServiceCard(service) {
  const card = makeElement("article", service.featured ? "service-card featured" : "service-card");
  // The first two services still receive prominent layouts, without a visible "main service" label.
  if (service.id === "flight-hotel" || service.id === "tailored-services") card.classList.add("illustrated-service");
  card.append(makeElement("p", "card-category", categoryLabel(service.category)));
  card.append(makeElement("h3", "", service.title));
  card.append(makeElement("p", "card-description", service.short));
  if (service.featured) {
    const benefits = makeElement("ul", "card-features");
    service.features.forEach(item => benefits.append(makeElement("li", "", item)));
    card.append(benefits);
  }
  /* Each photograph opens at its full original aspect ratio using an accessible dialog. */
  if (servicePhotos[service.id]) {
    const photos = servicePhotos[service.id];
    const media = makeElement("div", `service-photo-grid service-photo-grid--${photos.length}`);
    photos.forEach(photo => {
      const figure = makeElement("figure", "service-photo");
      const open = makeElement("button", "feature-photo-open");
      open.type = "button";
      open.dataset.featurePhoto = `assets/website/${photo.file}`;
      open.dataset.featureCaption = photo.caption;
      open.setAttribute("aria-label", `Enlarge photo: ${photo.caption}`);
      const image = makeElement("img");
      image.src = `assets/website/${photo.file}`;
      image.alt = photo.alt;
      image.loading = "lazy";
      image.decoding = "async";
      const hint = makeElement("span", "photo-enlarge-hint", "View full photo");
      hint.setAttribute("aria-hidden", "true");
      open.append(image, hint);
      figure.append(open);
      media.append(figure);
    });
    card.append(media);
  }
  const actions = makeElement("div", "service-card-actions");
  const details = makeElement("button", "card-action", "View details →");
  details.type = "button";
  details.setAttribute("aria-label", `View details for ${service.title}`);
  details.addEventListener("click", () => openServiceDetails(service.id));
  const book = makeElement("button", "card-book", "Select service +");
  book.type = "button";
  book.setAttribute("aria-label", `Select ${service.title} for a booking enquiry`);
  book.addEventListener("click", () => chooseService(service.id));
  actions.append(details, book);
  card.append(actions);
  return card;
}

function showServices() {
  const term = serviceSearch.value.trim().toLocaleLowerCase();
  const visible = services.filter(service =>
    (activeFilter === "all" || activeFilter === service.category) &&
    `${service.title} ${service.short} ${service.description} ${service.features.join(" ")}`.toLocaleLowerCase().includes(term)
  );
  const fragment = document.createDocumentFragment();
  visible.forEach(service => fragment.append(createServiceCard(service)));
  serviceGrid.replaceChildren(fragment);
  serviceCount.textContent = `${visible.length} of ${services.length} services shown`;
  qs("#no-services").hidden = visible.length !== 0;
}

function populateBookingServices() {
  const select = qs("#booking-service");
  services.forEach(service => {
    const option = document.createElement("option");
    option.value = service.id;
    option.textContent = service.title;
    select.append(option);
  });
}

function chooseService(id) {
  const found = services.find(service => service.id === id);
  if (!found) return;
  qs("#booking-service").value = found.id;
  if (dialog.open) dialog.close();
  qs("#booking").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  qs("#booking-service").focus({ preventScroll: true });
}

function openServiceDetails(id) {
  const service = services.find(item => item.id === id);
  if (!service) return;
  chosenService = service.id;
  qs("#dialog-category").textContent = categoryLabel(service.category);
  qs("#dialog-title").textContent = service.title;
  qs("#dialog-description").textContent = service.description;
  const features = document.createDocumentFragment();
  service.features.forEach(text => features.append(makeElement("li", "", text)));
  qs("#dialog-features").replaceChildren(features);
  dialog.showModal();
  qs("#dialog-close").focus();
}

function initializeServices() {
  populateBookingServices();
  showServices();
  serviceSearch.addEventListener("input", showServices);
  qsa(".filter-button").forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    qsa(".filter-button").forEach(item => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    showServices();
  }));
  qs("#dialog-close").addEventListener("click", () => dialog.close());
  qs("#dialog-book").addEventListener("click", () => chooseService(chosenService));
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
}

function initializeMenu() {
  const toggle = qs("#menu-toggle");
  const nav = qs("#primary-navigation");
  const close = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  };
  toggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute("aria-label", opened ? "Close navigation menu" : "Open navigation menu");
  });
  qsa("a", nav).forEach(link => link.addEventListener("click", close));
  window.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
}

function isoLocalDate(date) {
  const local = new Date(date.getTime());
  return [local.getFullYear(), String(local.getMonth() + 1).padStart(2,"0"), String(local.getDate()).padStart(2,"0")].join("-");
}
function offsetDays(date, days) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + days);
  return result;
}
function initialiseDates() {
  const now = new Date();
  const today = isoLocalDate(now);
  qs("#booking-date").min = today;
  qs("#weather-date").min = today;
  qs("#weather-date").max = isoLocalDate(offsetDays(now, 15));
  qs("#weather-date").value = isoLocalDate(offsetDays(now, 1));
  qs("#copyright-year").textContent = now.getFullYear();
}

function buildBookingEmail() {
  const data = new FormData(bookingForm);
  const selected = services.find(service => service.id === data.get("service"));
  const lines = [
    "EMINENT — BOOKING ENQUIRY (NOT A CONFIRMED BOOKING)",
    "",
    `Customer: ${String(data.get("fullName") || "").trim()}`,
    `Email: ${String(data.get("email") || "").trim()}`,
    `Telephone: ${String(data.get("phone") || "").trim() || "Not provided"}`,
    `Preferred response: ${data.get("contactMethod")}`,
    "",
    `Service: ${selected?.title || "Not selected"}`,
    `Requested date: ${data.get("date")}`,
    `City / venue: ${String(data.get("city") || "").trim()}`,
    `Guests / travellers: ${data.get("guests") || "Not specified"}`,
    "",
    "Details:", String(data.get("details") || "").trim(),
    "",
    "Please let me know about suitability, availability, pricing and the next steps.",
    "This message was prepared using the Eminent web application."
  ];
  return { subject: `Service enquiry: ${selected?.title || "Eminent"} — ${data.get("date")}`, body: lines.join("\n") };
}

const feedback = qs("#booking-feedback");
function setBookingFeedback(message, kind = "") {
  feedback.textContent = message;
  feedback.className = `form-feedback ${kind}`.trim();
  if (message) feedback.focus({ preventScroll: true });
}

function validateBooking() {
  qsa("[aria-invalid]", bookingForm).forEach(element => element.removeAttribute("aria-invalid"));
  if (!bookingForm.checkValidity()) {
    const invalid = qsa("input, select, textarea", bookingForm).find(element => !element.checkValidity());
    if (invalid) {
      invalid.setAttribute("aria-invalid", "true");
      invalid.focus();
      setBookingFeedback("Please complete the required fields and correct any invalid entries.", "error");
    }
    return false;
  }
  if (qs("#contact-method").value === "Phone" && !qs("#phone").value.trim()) {
    qs("#phone").setAttribute("aria-invalid", "true");
    qs("#phone").focus();
    setBookingFeedback("Please include a telephone number if you prefer to be contacted by phone.", "error");
    return false;
  }
  if (qs("#booking-date").value < isoLocalDate(new Date())) {
    qs("#booking-date").setAttribute("aria-invalid", "true");
    qs("#booking-date").focus();
    setBookingFeedback("Please choose today or a future date.", "error");
    return false;
  }
  return true;
}

function draftFields() {
  return ["fullName", "email", "phone", "contactMethod", "service", "date", "city", "guests", "details"];
}
function saveDraft() {
  const draft = {};
  const data = new FormData(bookingForm);
  draftFields().forEach(name => { draft[name] = String(data.get(name) || ""); });
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setBookingFeedback("Draft saved on this device only. On a shared device, delete it when finished.", "success");
  } catch {
    setBookingFeedback("Your browser could not save this draft. You can still prepare an email enquiry.", "error");
  }
}
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) { setBookingFeedback("There is no saved draft on this device."); return; }
    const data = JSON.parse(raw);
    draftFields().forEach(name => {
      const control = bookingForm.elements.namedItem(name);
      if (control && typeof data[name] === "string") control.value = data[name];
    });
    qs("#consent").checked = false; // Consent must be given each time.
    setBookingFeedback("Draft restored. Review the information and tick the consent box before preparing an email.", "success");
  } catch { setBookingFeedback("This saved draft could not be read.", "error"); }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
    setBookingFeedback("Saved draft deleted from this device.", "success");
  } catch { setBookingFeedback("The saved draft could not be deleted in this browser.", "error"); }
}
function initializeBooking() {
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateBooking()) return;
    const enquiry = buildBookingEmail();
    qs("#email-preview-text").textContent = `To: ${CONTACT_EMAIL}\nSubject: ${enquiry.subject}\n\n${enquiry.body}`;
    qs("#email-preview").hidden = false;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(enquiry.subject)}&body=${encodeURIComponent(enquiry.body)}`;
    setBookingFeedback("Enquiry prepared. Your email application should open. Review the message and press Send there; this website has NOT sent or confirmed your booking.", "success");
    window.location.href = mailto;
  });
  qs("#save-draft").addEventListener("click", saveDraft);
  qs("#load-draft").addEventListener("click", loadDraft);
  qs("#clear-draft").addEventListener("click", clearDraft);
  qs("#copy-enquiry").addEventListener("click", async () => {
    const text = qs("#email-preview-text").textContent;
    try {
      await navigator.clipboard.writeText(text);
      setBookingFeedback("Enquiry copied. You can paste it into an email and send it to Eminent.", "success");
    } catch {
      qs("#email-preview-text").focus();
      setBookingFeedback("Your browser could not copy automatically. Select and copy the preview text manually.", "error");
    }
  });
}

/* Reusable safe API fetching with clear error and timeout handling. */
async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) throw new Error(response.status === 404 ? "No matching destination was found." : `Data provider returned HTTP ${response.status}.`);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw new Error("The request took too long. Please try again.");
    throw error;
  } finally { clearTimeout(timeout); }
}
function showApiMessage(node, text, isError = false) {
  node.replaceChildren(makeElement("p", "", text));
  node.classList.toggle("error", isError);
}
function addDefinition(dl, label, value) {
  const wrap = document.createElement("div");
  wrap.append(makeElement("dt", "", label), makeElement("dd", "", String(value)));
  dl.append(wrap);
}
const weatherDescriptions = new Map([
  [0, "Clear sky"], [1, "Mainly clear"], [2, "Partly cloudy"], [3, "Overcast"],
  [45, "Fog"], [48, "Freezing fog"], [51, "Light drizzle"], [53, "Drizzle"],
  [55, "Heavy drizzle"], [61, "Light rain"], [63, "Rain"], [65, "Heavy rain"],
  [71, "Light snow"], [73, "Snow"], [75, "Heavy snow"], [80, "Rain showers"],
  [81, "Rain showers"], [82, "Heavy rain showers"], [95, "Thunderstorm"],
  [96, "Thunderstorm with hail"], [99, "Thunderstorm with heavy hail"]
]);

function renderWeather(data, city, date) {
  const days = data?.daily?.time || [];
  const index = days.indexOf(date);
  if (index < 0) throw new Error("A forecast for that date is not available yet. Try a nearer date.");
  const max = data.daily.temperature_2m_max?.[index];
  const min = data.daily.temperature_2m_min?.[index];
  const rain = data.daily.precipitation_probability_max?.[index];
  const code = data.daily.weather_code?.[index];
  const result = qs("#weather-results");
  result.classList.remove("error");
  const fragment = document.createDocumentFragment();
  fragment.append(makeElement("p", "data-title", `${city} · ${date}`));
  fragment.append(makeElement("span", "weather-badge", weatherDescriptions.get(code) || "Weather outlook"));
  const formatTemp = number => typeof number === "number" ? `${Math.round(number)}°C` : "Not available";
  fragment.append(makeElement("p", "data-big", formatTemp(max)));
  const dl = document.createElement("dl");
  addDefinition(dl, "Minimum temperature", formatTemp(min));
  addDefinition(dl, "Precipitation chance", typeof rain === "number" ? `${rain}%` : "Not available");
  fragment.append(dl);
  if (typeof rain === "number") {
    const tip = rain >= 50 ? "Planning note: consider indoor or covered arrangements for outdoor activities." : "Planning note: keep checking forecasts as your event date approaches.";
    fragment.append(makeElement("p", "forecast-note", tip));
  }
  result.replaceChildren(fragment);
}

async function onWeatherSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const city = qs("#weather-city").value.trim();
  const date = qs("#weather-date").value;
  const result = qs("#weather-results");
  const button = qs("#weather-button");
  if (date < isoLocalDate(new Date()) || date > qs("#weather-date").max) {
    showApiMessage(result, "Choose a date within the next 16 calendar days. Longer-range forecasts are unavailable.", true);
    return;
  }
  button.disabled = true;
  button.textContent = "Checking forecast…";
  showApiMessage(result, "Looking up the city and the latest available weather forecast…");
  try {
    const geo = await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`);
    if (!Array.isArray(geo.results) || geo.results.length === 0) throw new Error("City not found. Try including a more specific city name.");
    const place = geo.results[0];
    const params = new URLSearchParams({
      latitude: String(place.latitude), longitude: String(place.longitude),
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto", forecast_days: "16"
    });
    const forecast = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`);
    renderWeather(forecast, `${place.name}, ${place.country || place.country_code || ""}`.replace(/, $/, ""), date);
  } catch (error) {
    showApiMessage(result, `${error.message || "Weather data is unavailable."} Check the city and your connection, then try again.`, true);
  } finally {
    button.disabled = false;
    button.textContent = "Check forecast ↗";
  }
}

function renderCountry(country) {
  const result = qs("#country-results");
  result.classList.remove("error");
  const fragment = document.createDocumentFragment();
  // countries.dev uses plain strings for names and capitals, and arrays for languages/currencies.
  const name = typeof country.name === "string" ? country.name : country.name?.common;
  fragment.append(makeElement("p", "data-title", name || "Destination information"));
  const dl = document.createElement("dl");
  addDefinition(dl, "Capital", Array.isArray(country.capital) ? country.capital.join(", ") : (country.capital || "Not listed"));
  addDefinition(dl, "Region", country.region || "Not listed");
  const languages = Array.isArray(country.languages)
    ? country.languages.map(item => item.name).filter(Boolean).join(", ")
    : country.languages ? Object.values(country.languages).join(", ") : "";
  addDefinition(dl, "Languages", languages || "Not listed");
  const currencies = Array.isArray(country.currencies)
    ? country.currencies.map(item => `${item.code || ""} (${item.name || "currency"})`).join(", ")
    : country.currencies ? Object.entries(country.currencies).map(([code, info]) => `${code} (${info.name || "currency"})`).join(", ") : "";
  addDefinition(dl, "Currencies", currencies || "Not listed");
  addDefinition(dl, "Time zones", Array.isArray(country.timezones) ? country.timezones.join(", ") : "Not listed");
  fragment.append(dl);
  fragment.append(makeElement("p", "forecast-note", "Destination facts are informational, not visa or immigration advice."));
  result.replaceChildren(fragment);
}
async function onCountrySubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const countryName = qs("#country-name").value.trim();
  const button = qs("#country-button");
  const result = qs("#country-results");
  button.disabled = true;
  button.textContent = "Finding destination…";
  showApiMessage(result, "Looking up destination facts…");
  try {
    // No API key is needed. See https://countries.dev/docs/api/name
    const candidates = await fetchJson(`https://countries.dev/name/${encodeURIComponent(countryName)}`);
    if (!Array.isArray(candidates) || candidates.length === 0) throw new Error("No matching country was found.");
    const exact = candidates.find(c => {
      const name = typeof c.name === "string" ? c.name : c.name?.common;
      return name?.toLowerCase() === countryName.toLowerCase();
    });
    renderCountry(exact || candidates[0]);
  } catch (error) {
    showApiMessage(result, `${error.message || "Country data is unavailable."} Please check your spelling and connection.`, true);
  } finally {
    button.disabled = false;
    button.textContent = "Explore destination ↗";
  }
}

function initialize() {
  initializeMenu();
  initializeServices();
  initialiseDates();
  initializeBooking();
  qs("#weather-form").addEventListener("submit", onWeatherSubmit);
  qs("#country-form").addEventListener("submit", onCountrySubmit);
}
initialize();
