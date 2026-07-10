import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/db";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/admin");
  }

  const categories = getCategories();

  return <CategoriesManager initialCategories={categories} />;
}
