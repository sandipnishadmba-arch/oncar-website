import { cookies } from "next/headers";
import { getSession } from "./db";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) return null;

  const session = await getSession(sessionCookie.value);
  if (!session) return null;

  return {
    id: session.user_id,
    email: session.email,
  };
}

export async function isAuthenticated() {
  const user = await getAuthUser();
  return !!user;
}
