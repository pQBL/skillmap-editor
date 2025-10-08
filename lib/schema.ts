import { z } from "zod";

// A skill is a specific learning target
export const skillSchema = z.string();

// An objective groups related skills under a common goal
export const objectiveSchema = z.object({
  goal: z.string(),
  skills: z.array(skillSchema),
});

// A skillmap module represents one course module
export const skillmapModuleSchema = z.object({
  title: z.string(),
  objectives: z.array(objectiveSchema),
});

// The complete skillmap structure
export const skillmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.array(skillmapModuleSchema),
});

export type Skill = z.infer<typeof skillSchema>;
export type Objective = z.infer<typeof objectiveSchema>;
export type SkillmapModule = z.infer<typeof skillmapModuleSchema>;
export type Skillmap = z.infer<typeof skillmapSchema>;
