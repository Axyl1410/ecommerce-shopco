import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No session", session: null });
    }

    // Get user from database to check role
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({
      session: session,
      sessionUser: session.user,
      sessionUserRole: (session.user as any).role,
      dbUser: dbUser,
      dbRole: dbUser?.role,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
