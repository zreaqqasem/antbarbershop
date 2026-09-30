const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const img = (name: string) => `${BASE}/images/${name}.jpg`;

export const HERO_IMAGE =
  img("atb-hero-01");

export const BOOKING_URL = "http://atbarbershopsalonhlqrby.booksy.com/k/";

export const MAP_EMBED =
  "https://www.google.com/maps?q=The%20Colony%2C%20TX%2075056&output=embed";

export const SERVICE_IMAGES = [
  img("atb-cut-01"),
  img("atb-cut-02"),
  img("atb-cut-03"),
  img("atb-cut-04"),
  img("atb-cut-05"),
  img("atb-cut-06"),
];

export const BARBER_IMAGES = [
  img("atb-barber-01"),
  img("atb-barber-02"),
  img("atb-barber-03"),
  img("atb-barber-04"),
  img("atb-barber-05"),
  img("atb-barber-06"),
];