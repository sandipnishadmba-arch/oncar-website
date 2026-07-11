import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServices, getCategories } from "@/lib/db";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/admin");
  }

  const services = await getServices();
  const categories = await getCategories();

  return <ServicesManager initialServices={services} categories={categories} />;
}
