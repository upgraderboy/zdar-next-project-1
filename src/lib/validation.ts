import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));
export const optionalNumber = z.number().optional();

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;
export const experienceLevelEnum = z.enum(["Entry Level", "Mid Level", "Senior Level"]);
export const jobTypeEnum = z.enum(["Full-Time", "Part-Time", "Internship"]);
export const genderEnum = z.enum(["Male", "Female", "Other"]);
export const disabilityEnum = z.enum(["Yes", "No"]);
export const skillTypeEnum = z.enum(["TECH", "NON-TECH"]);

export const personalInfoSchema = z.object({
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  summary: optionalString,
  age: z.coerce.number().min(0).optional(),
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
  lat: optionalNumber,
  lng: optionalNumber,
  experienceLevel: experienceLevelEnum.optional(),
  jobType: jobTypeEnum.optional(),
  gender: genderEnum.optional(),
  disability: disabilityEnum.optional(),
  skillType: skillTypeEnum.optional(),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number];

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

export const skillsSchema = z.object({
  softSkills: z.array(z.string().trim()).optional(),
  hardSkills: z.array(z.string().trim()).optional(),
});

export type SkillsValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryValues = z.infer<typeof summarySchema>;

export const resumeSchema = z.object({
  id: z.string().optional(),
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
  experienceLevel: z.enum(["Entry Level", "Mid Level", "Senior Level"]).optional(),
  jobType: z.enum(["Full-Time", "Part-Time", "Internship"]).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  disability: z.enum(["Yes", "No"]).optional(),
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: string | null;
};

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;

export const generateSkillsSchema = z.object({
  skills: z
    .array(z.string().trim())
    .min(1, "Required")
    .max(10, "Must be at most 10 skills"),
});

export type GenerateSkillsInput = z.infer<typeof generateSkillsSchema>;