import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LogoutPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (sessionCookie) {
    // Delete session from SQLite database
    try {
      deleteSession(sessionCookie.value);
    } catch (e) {
      console.error("Failed to delete session from DB:", e);
    }
    // Delete session cookie
    cookieStore.delete("session");
  }

  redirect("/admin");
}
