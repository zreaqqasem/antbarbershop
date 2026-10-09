import reviewData from "./reviews.json";

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

// Every review on the Booksy profile, verbatim, pulled from Booksy's review API.
// Empty and placeholder ("N/A", ".") texts are left out of `reviews` but still
// count toward `count`, `breakdown` and `byBarber`.
export const REVIEW_DATA = reviewData as {
  count: number;
  average: number;
  breakdown: Record<string, number>;
  byBarber: Record<string, { count: number; average: number }>;
  reviews: {
    name: string;
    date: string;
    rating: number;
    service: string;
    staffer: string;
    text: string;
  }[];
};
