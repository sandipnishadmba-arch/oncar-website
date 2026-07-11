import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSettings } from "@/lib/db";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/admin");
  }

  const settings = await getSettings();

  return <SettingsManager initialSettings={settings} />;
}
