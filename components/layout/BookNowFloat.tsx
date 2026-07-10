"use client";

import { usePathname, useRouter } from "next/navigation";

export function BookNowFloat() {
  const pathname = usePathname();
  const router = useRouter();

  const handleScrollToPlans = () => {
    if (pathname === "/") {
      const plansSection = document.getElementById("plans");
      if (plansSection) {
        plansSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/#plans");
    }
  };

  return (
    <button
      type="button"
      onClick={handleScrollToPlans}
      className="fixed bottom-[88px] lg:bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-primary text-white font-extrabold px-6 py-3.5 shadow-lg shadow-primary/20 hover:scale-105 active:scale-[0.98] transition-all duration-300 border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label="Scroll to plans"
    >
      Book Now
    </button>
  );
}
