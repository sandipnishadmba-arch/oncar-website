import { getIcon } from "@/lib/icons";
import { TRUST_BADGES } from "@/lib/constants";

export function TrustBadges() {
  return (
    <section className="bg-surface border-y border-border py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {TRUST_BADGES.map((badge) => {
            const Icon = getIcon(badge.icon);
            return (
              <div 
                key={badge.title} 
                className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-border shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-secondary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="text-left overflow-hidden">
                  <h4 className="text-xs font-bold text-primary truncate">{badge.title}</h4>
                  <p className="text-[10px] text-muted truncate">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
