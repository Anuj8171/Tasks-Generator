import { NextResponse } from "next/server";
import { llm } from "../../lib/llm";
import { Prisma, PrismaClient }  from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
   let db = "OK";
   let llmStatus = "OK";
   try{
    await prisma.spec.findFirst();
   }catch{
    db = "Error";
   }


   try {
     await llm.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    });
   }catch{
    llmStatus = "Error";
   }


   return NextResponse.json({
    backend: "OK",
    database: db,
    llm: llmStatus,
  });

}