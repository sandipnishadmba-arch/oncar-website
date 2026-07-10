import type {
  FAQItem,
  NavLink,
  ProcessStep,
  TrustBadge,
} from "@/types";

export const SITE_CONFIG = {
  name: "OnCar",
  tagline: "Apni Car Mein Driving Seekho, Apne Time Par",
  description:
    "Verified instructor aapke ghar/location par aakar aapki own car me confidence driving sikhayega. Surat city ke liye premium driving learning service.",
  url: "https://oncar.in",
  ogImage:
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop",
  phone: "+91 9213466544",
  whatsapp: "+91 9213466544",
  email: "info@oncar.in",
  address: "Surat City, Gujarat, India",
  googleMapsUrl: "https://maps.google.com/?q=Surat,Gujarat",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/#home" },
  { label: "Why OnCar", href: "/#why-oncar" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Plans", href: "/#plans" },
  { label: "Benefits", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export const TRUST_BADGES: TrustBadge[] = [
  {
    title: "Apni Car Practice",
    description: "Learn in the car you actually own and will drive daily",
    icon: "ShieldCheck",
  },
  {
    title: "Apne Time Par",
    description: "Schedule sessions at your convenience, no fixed timings",
    icon: "Clock",
  },
  {
    title: "Verified Instructors",
    description: "Professional, background-verified guidance at your doorstep",
    icon: "Award",
  },
  {
    title: "Home Pick & Drop",
    description: "Instructor picks you up from your doorstep in Surat",
    icon: "MapPin",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Plan Choose Karo",
    description: "Select trial or standard packages from our listing",
    icon: "CalendarCheck",
  },
  {
    step: 2,
    title: "WhatsApp Booking",
    description: "Book instantly via WhatsApp with auto-filled plan details",
    icon: "Search",
  },
  {
    step: 3,
    title: "Instructor Pickup",
    description: "Verified instructor reaches your location in Surat",
    icon: "MapPin",
  },
  {
    step: 4,
    title: "Confidence Build",
    description: "Master steering control, reverse parking, and city road driving",
    icon: "HardHat",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Kya meri own car me sikhayenge?",
    answer: "Haan, hum sirf aapki apni (own) car me hi driving sikhate hain taaki aapko apni car chalane me real-world confidence mile.",
  },
  {
    question: "Instructor ghar par aayega?",
    answer: "Haan, verified instructor aapke ghar ya preferred location par aakar aapko pick up karega.",
  },
  {
    question: "Trial class available hai?",
    answer: "Haan, Trial Class sirf ₹399 me available hai jisme aap 1 hour ki driving confidence check aur instructor guidance le sakte hain.",
  },
  {
    question: "Automatic car ke liye available hai?",
    answer: "Haan, hum Manual aur Automatic dono types ki cars ke liye driving training provide karte hain.",
  },
  {
    question: "Surat me kaunse areas cover hain?",
    answer: "Hum Surat ke sabhi major areas cover karte hain jaise Adajan, Vesu, Pal, Piplod, Katargam, Varachha, Jahangirpura, etc.",
  },
  {
    question: "Payment kaise hoga?",
    answer: "Aap booking confirm hone ke baad online UPI ya cash ke through instructor ko direct payment kar sakte hain.",
  },
];

export const FOOTER_QUICK_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Why OnCar", href: "/#why-oncar" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Plans", href: "/#plans" },
  { label: "FAQ", href: "/faq" },
];

export const GALLERY_ITEMS: any[] = [];
