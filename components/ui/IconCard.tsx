import { getIcon } from "@/lib/icons";
import type { TrustBadge, WhyChooseItem, Benefit } from "@/types";

interface IconCardProps {
  title: string;
  description: string;
  icon: string;
  variant?: "default" | "compact" | "benefit";
}

export function IconCard({
  title,
  description,
  icon,
  variant = "default",
}: IconCardProps) {
  const Icon = getIcon(icon);

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
          <Icon className="h-7 w-7 text-secondary" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>
    );
  }

  if (variant === "benefit") {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:border-secondary/30 hover:shadow-lg">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Icon className="h-6 w-6 text-secondary" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
        <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-primary">{title}</h3>
      <p className="mt-3 text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}

export function TrustBadgeCard({ badge }: { badge: TrustBadge }) {
  return (
    <IconCard
      title={badge.title}
      description={badge.description}
      icon={badge.icon}
      variant="compact"
    />
  );
}

export function WhyChooseCard({ item }: { item: WhyChooseItem }) {
  return (
    <IconCard
      title={item.title}
      description={item.description}
      icon={item.icon}
    />
  );
}

export function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <IconCard
      title={benefit.title}
      description={benefit.description}
      icon={benefit.icon}
      variant="benefit"
    />
  );
}
