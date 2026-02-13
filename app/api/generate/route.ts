import { NextResponse } from "next/server";

import { llm } from "../../lib/llm";
import { Prisma, PrismaClient }  from "@prisma/client";


const prisma = new PrismaClient();

export async function POST(request: Request) {
     try {
   const { goal, users, constraints, teamSize, timeframe } =await request.json();


     if (!goal || !users || !constraints || !teamSize || !timeframe) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
const prompt = `
You are a product and engineering planning assistant.

First, check whether the input below is meaningful and describes a real feature idea.
If the input is unclear, random, or meaningless, respond ONLY with:

INVALID_INPUT

Otherwise, generate user stories and engineering tasks.

Input:
Goal: ${goal}
Users: ${users}
Constraints: ${constraints}
Team size: ${teamSize}
Timeframe: ${timeframe}

If valid, format exactly like this:

USER STORIES:
- As a user, I want ...

TASKS:
- Task 1
- Task 2
- Task 3
`;


    const completion = await llm.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    const text = completion.choices[0].message.content ?? "";
     if (text === "INVALID_INPUT") {
      return NextResponse.json(
        { error: "Input does not describe a meaningful feature idea." },
        { status: 400 }
      );
    }
    const spec = await prisma.spec.create({
      data: {
        goal,
        users,
        constraints,
        stories: text,
        tasks: text,
      },
    });
     return NextResponse.json(spec);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate tasks" },
      { status: 500 }
    );
  }
}

