import { getOffers, getCategories, getServiceDiscounts, getServices } from "@/lib/db";
import { OffersManager } from "@/components/admin/OffersManager";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/admin");
  }

  const offers = getOffers();
  const categories = getCategories();
  const discounts = getServiceDiscounts();
  const services = getServices();

  return (
    <OffersManager 
      initialOffers={offers} 
      categories={categories} 
      initialDiscounts={discounts}
      services={services}
    />
  );
}
