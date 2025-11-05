import ProfileClient from "./ProfileClient";
import { headers, cookies } from "next/headers";

export default async function ProfileRoutePage() {
  // Build absolute URL and forward cookies for authenticated SSR fetches
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join("; ");

  // Server-side fetch for first paint without placeholders
  const [profileRes, addressRes, activityRes] = await Promise.all([
    fetch(`${base}/api/profile`, { cache: "no-store", headers: { cookie: cookieHeader } }),
    fetch(`${base}/api/addresses`, { cache: "no-store", headers: { cookie: cookieHeader } }),
    fetch(`${base}/api/profile/activity`, { cache: "no-store", headers: { cookie: cookieHeader } }),
  ]);

  const profileData = profileRes.ok ? await profileRes.json() : { user: null };
  const user = profileData.user
    ? {
        name: profileData.user.name as string,
        email: profileData.user.email as string,
        avatarUrl: (profileData.user.image as string) || "",
      }
    : { name: "Người dùng", email: "user@example.com", avatarUrl: "" };

  const addressesData = addressRes.ok ? await addressRes.json() : { addresses: [] };
  const activityData = activityRes.ok ? await activityRes.json() : { orders: [], reviews: [] };

  return (
    <ProfileClient
      initialUser={user}
      initialAddresses={addressesData.addresses || []}
      initialOrders={activityData.orders || []}
      initialReviews={activityData.reviews || []}
    />
  );
}
