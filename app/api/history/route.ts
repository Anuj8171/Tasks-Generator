// pages/api/specs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const specs = await prisma.spec.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json(specs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch specs" }, { status: 500 });
  }
}
