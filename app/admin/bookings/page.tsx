import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBookings } from "@/lib/db";
import { BookingsManager } from "@/components/admin/BookingsManager";

export const dynamic = "force-dynamic";

export default async function BookingsLogPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/admin");
  }

  const bookings = await getBookings();

  return <BookingsManager initialBookings={bookings} />;
}
