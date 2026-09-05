import { NextRequest, NextResponse } from "next/server";
import { intakeSchema } from "@/lib/validation";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = intakeSchema.parse(body);

    const prompt = `Generate 3 distinct final-year capstone project ideas based on:
    Domains: ${validated.domains.join(", ")}
    Skills: ${validated.skills.join(", ")}
    Team Size: ${validated.teamSize}
    Duration: ${validated.durationWeeks} weeks
    Target Outcome: ${validated.targetOutcome}
    
    Ensure strict JSON adherence.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              tagline: { type: "string" },
              noveltyScore: { type: "number" },
              feasibilityScore: { type: "number" },
              problemStatement: { type: "string" },
              targetUsers: { type: "string" },
              techStack: { type: "array", items: { type: "string" } },
              weeklyRoadmap: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    week: { type: "number" },
                    task: { type: "string" },
                  },
                },
              },
              facultyDefense: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    answer: { type: "string" },
                  },
                },
              },
            },
            required: ["title", "tagline", "noveltyScore", "feasibilityScore", "problemStatement", "targetUsers", "techStack", "weeklyRoadmap", "facultyDefense"],
          },
        },
      },
    });

    const ideas = JSON.parse(response.text || "[]");
    return NextResponse.json({ ideas });
  } catch (error: unknown) {
    console.error(error);
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
