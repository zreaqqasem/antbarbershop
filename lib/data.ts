const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const img = (name: string) => `${BASE}/images/${name}.jpg`;

export const HERO_IMAGE = img("hero-taher");

export const BOOKING_URL = "http://atbarbershopsalonhlqrby.booksy.com/k/";
export const BOOKSY_PROFILE_URL =
  "https://booksy.com/en-us/1750310_a-t-barbershop-hlq-rby_barber-shop_36549_the-colony";
export const INSTAGRAM_URL = "https://www.instagram.com/at.barbershop90/";
export const MAPS_URL = "https://share.google/HHEA2Yhp6lejQDIPB";
export const PHONE_TEL = "tel:+12144078899";

export const MAP_EMBED =
  "https://www.google.com/maps?q=A%26T%20Barbershop%2C%203805%20Main%20St%20Ste%20102%2C%20The%20Colony%2C%20TX%2075056&output=embed";

// Rating and count as shown on the Booksy profile, October 2026.
export const RATING = "5.0";
export const REVIEW_COUNT = 171;

// Paired by index with t.services.items.
export const SERVICE_IMAGES = [
  img("work-09"),
  img("work-01"),
  img("work-07"),
  img("work-04"),
  img("work-05"),
  img("work-08"),
];

// Paired by index with t.gallery.items.
export const GALLERY_IMAGES = [
  img("work-01"),
  img("work-02"),
  img("work-03"),
  img("work-04"),
  img("work-05"),
  img("work-06"),
  img("work-07"),
  img("work-08"),
  img("work-09"),
];

export type Barber = { name: string; image: string; owner?: boolean; quote?: string };

export const BARBERS: Barber[] = [
  { name: "Taher", image: img("barber-taher"), owner: true },
  {
    name: "Amro",
    image: img("barber-amro"),
    owner: true,
    quote: "It’s more than a haircut – it’s confidence, crafted.",
  },
  { name: "Feras", image: img("barber-feras") },
  { name: "Flavio", image: img("barber-flavio") },
  { name: "Edwin", image: img("barber-edwin") },
  { name: "Richard", image: img("barber-richard") },
  { name: "Ahmad", image: img("barber-ahmad") },
  { name: "Anna", image: img("barber-anna") },
];

// Verbatim from confirmed-client reviews on Booksy; all rated 5 stars.
export const REVIEWS = [
  {
    name: "Greg",
    service: "Haircut",
    staffer: "Amro",
    text: "Prior to discovering A&T Barbershop, I was always let down in some way by other barbershops or barbers themselves. I am so thankful that I’ve found A&T! If you are looking for great customer service, a clean and welcoming environment, and individuals that are pro’s at their job, I’d honestly say look no farther! Personally, Amro is my go to guy because he executes flawlessly every time. No matter who ends up taking care of you though, it’s going to be great!",
  },
  {
    name: "Patrick",
    service: "Haircut",
    staffer: "Amro",
    text: "Every appointment is an excellent experience; it's why this has been my go-to barbershop for over a year. The crew here is always friendly, polite, and professional, not to mention fast! Their service is second to none.",
  },
  {
    name: "Tommy",
    service: "Haircut & beard",
    staffer: "Amro",
    text: "I’ve been going here for a while now. This barbershop is a great environment. Amro is a great barber. He’s very professional and clean. Always leaves my hair looking fresh.",
  },
  {
    name: "Kendrick",
    service: "Haircut",
    staffer: "Richard",
    text: "My experience was positive! Richard is 10/10 with the clippers. I will definitely be back for my next cut.",
  },
  {
    name: "Elliseo",
    service: "Haircut",
    staffer: "Amro",
    text: "Amro did a very good job had me looking crisper than ever i will going here again",
  },
  {
    name: "Jameel",
    service: "Haircut & beard",
    staffer: "Amro",
    text: "Make sure book by amro, hes a beast",
  },
];
