import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const UpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  addressLine: z.string().min(3).optional(),
  city: z.string().min(1).optional(),
  district: z.string().optional(),
  province: z.string().min(1).optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export async function PATCH(req: Request, segmentData: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await segmentData.params;
  const id = params.id;
  const body = await req.json().catch(() => ({}));
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  
  // Use transaction for atomic operations (faster + safer)
  const updated = await prisma.$transaction(async (tx) => {
    // Check ownership and update in single query using updateMany with where condition
    // This is faster than separate findFirst + update
    const result = await tx.address.updateMany({
      where: { id, userId: session.user.id },
      data: { ...data },
    });
    
    // If no rows updated, address doesn't exist or user doesn't own it
    if (result.count === 0) {
      throw new Error("Not found");
    }
    
    // Handle isDefault logic inside transaction
    if (data.isDefault) {
      // Reset all other addresses to not default (exclude current one)
      await tx.address.updateMany({ 
        where: { userId: session.user.id, id: { not: id } }, 
        data: { isDefault: false } 
      });
    }
    
    // Return the updated address (minimal select for performance)
    return tx.address.findUnique({ 
      where: { id },
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

  return NextResponse.json({ address: updated });
}

export async function DELETE(_req: Request, segmentData: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = await segmentData.params;
  const id = params.id;
  
  // Optimize: Use deleteMany with where condition instead of separate findFirst
  // This combines ownership check and delete in single query
  const result = await prisma.address.deleteMany({ 
    where: { id, userId: session.user.id } 
  });
  
  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
