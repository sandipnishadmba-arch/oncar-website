import { Star } from "lucide-react";
import type { Review } from "@/types";

interface TestimonialCardProps {
  review: Review;
}

export function TestimonialCard({ review }: TestimonialCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-8">
      <div className="mb-4 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star
            key={i}
            className="h-5 w-5 fill-secondary text-secondary"
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="flex-1 text-text leading-relaxed">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className="mt-6 border-t border-border pt-6">
        <p className="font-semibold text-primary">{review.name}</p>
        <p className="mt-1 text-sm text-muted">
          {review.location} · {review.service}
        </p>
      </footer>
    </article>
  );
}
