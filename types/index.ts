export interface NavLink {
  label: string;
  href: string;
}

export interface TrustBadge {
  title: string;
  description: string;
  icon: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  image: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  before: string;
  after: string;
  category: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface ServicePageData {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  benefits: Benefit[];
  gallery: GalleryItem[];
  faq: FAQItem[];
  keywords: string[];
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";
