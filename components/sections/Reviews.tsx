import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

interface ReviewsProps {
  reviews: Review[];
  showAllLink?: boolean;
}

export function Reviews({ reviews, showAllLink = false }: ReviewsProps) {
  const items = reviews || [];

  return (
    <Section id="reviews">
      <SectionHeader
        eyebrow="Testimonials"
        title="What Our Customers Say"
        description="Real reviews from homeowners across Surat who trusted us for their worker on demand needs."
      />
      {items.length === 0 ? (
        <p className="text-center text-muted">No reviews yet.</p>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
          {showAllLink && (
            <div className="text-center mt-6">
              <Link 
                href="/reviews"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary/80 bg-primary px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Read All Verified Reviews
              </Link>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
