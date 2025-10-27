import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SetDefaultSchema = z.object({ id: z.string().min(1) });

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = SetDefaultSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { id } = parsed.data;

  // Ensure the address belongs to the current user
  const owned = await prisma.address.findFirst({ where: { id, userId: session.user.id }, select: { id: true } });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  const updated = await prisma.address.update({ where: { id }, data: { isDefault: true } });

  return NextResponse.json({ address: updated });
}
