import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

const UpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  addressLine: z.string().min(3).optional(),
  city: z.string().min(1).optional(),
  district: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;
  const body = await req.json().catch(() => ({}));
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Check ownership
  const owned = await prisma.address.findFirst({ where: { id, userId: session.user.id }, select: { id: true } });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = parsed.data;
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const updated = await prisma.address.update({ where: { id }, data: { ...data } });
  return NextResponse.json({ address: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;
  // Check ownership
  const owned = await prisma.address.findFirst({ where: { id, userId: session.user.id }, select: { id: true } });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
