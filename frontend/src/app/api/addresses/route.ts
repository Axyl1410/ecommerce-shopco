import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const AddressSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  addressLine: z.string().min(3),
  city: z.string().min(1),
  district: z.string().optional(),
  province: z.string().min(1),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = AddressSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;

  // Use transaction for atomic operations
  const created = await prisma.$transaction(async (tx) => {
    // If this is default, reset others first
    if (data.isDefault) {
      await tx.address.updateMany({ 
        where: { userId: session.user.id }, 
        data: { isDefault: false } 
      });
    }

    // Create new address with minimal select for faster response
    return tx.address.create({
      data: { 
        userId: session.user.id, 
        name: data.name,
        phone: data.phone,
        addressLine: data.addressLine,
        city: data.city,
        district: data.district || "",
        province: data.province,
        postalCode: data.postalCode,
        isDefault: !!data.isDefault 
      },
      select: {
        id: true,
        name: true,
        phone: true,
        addressLine: true,
        city: true,
        district: true,
        province: true,
        postalCode: true,
        isDefault: true
      }
    });
  });

  return NextResponse.json({ address: created }, { status: 201 });
}
