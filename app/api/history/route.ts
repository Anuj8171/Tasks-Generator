import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const specs = await prisma.spec.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json(specs);
}
