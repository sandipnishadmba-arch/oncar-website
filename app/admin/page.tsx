import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAuthUser();

  if (user) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
