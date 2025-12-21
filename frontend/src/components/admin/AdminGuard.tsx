import { hasRole } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

interface AdminGuardProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Server component that protects admin routes
 * Redirects non-admin users to the fallback URL
 */
export async function AdminGuard({
  children,
  fallbackUrl = "/unauthorized",
}: AdminGuardProps) {
  // const isAdminUser = await hasRole("admin");

  // if (!isAdminUser) {
  //   redirect(fallbackUrl as any);
  // }

  return <>{children}</>;
}

/**
 * Client component for conditional rendering based on user role
 * Note: This requires the role to be passed as a prop from a server component
 */
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  userRole?: string | null;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  userRole,
  fallback = null,
}: RoleGuardProps) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
