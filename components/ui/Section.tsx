import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  background?: "white" | "surface" | "primary";
}

const backgroundStyles = {
  white: "bg-background",
  surface: "bg-surface",
  primary: "bg-primary text-white",
};

export function Section({
  id,
  children,
  className,
  background = "white",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24 lg:py-28", backgroundStyles[background], className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
