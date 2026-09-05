import { z } from "zod";

export const intakeSchema = z.object({
  domains: z.array(z.string()).min(1, "Select at least one domain"),
  skills: z.array(z.string()).min(1, "Provide at least one skill"),
  teamSize: z.number().min(1).max(4),
  durationWeeks: z.number().min(4).max(16),
  targetOutcome: z.enum(["MVP", "Research Paper", "Industry Capstone"]),
});

export type IntakeForm = z.infer<typeof intakeSchema>;

export interface ProjectIdea {
  title: string;
  tagline: string;
  noveltyScore: number;
  feasibilityScore: number;
  problemStatement: string;
  targetUsers: string;
  techStack: string[];
  weeklyRoadmap: { week: number; task: string }[];
  facultyDefense: { question: string; answer: string }[];
}
