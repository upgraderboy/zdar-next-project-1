import { candidateProcedure } from "@/trpc/init";
import { createTRPCRouter } from "@/trpc/init";
import { db } from "@/db";
import { jobs, candidates, resumes, workExperiences, educations } from "@/db/schema";
import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { jobFavorites } from "@/db/schema";
import { z } from "zod";
export type CandidateType = typeof candidates.$inferSelect;
export type ResumeType = typeof resumes.$inferSelect;
export type WorkExperienceType = typeof workExperiences.$inferSelect;
export type EducationType = typeof educations.$inferSelect;

export type CandidateWithResume = CandidateType & {
  resumeData: ResumeType & {
    workExperiences: WorkExperienceType[];
    educations: EducationType[];
  } | null;
};
export const favoritesRouter = createTRPCRouter({
   getFavoriteJobs: candidateProcedure.input(z.object({
       search: z.string().optional(),
       sortBy: z.enum(["name", "email", "createdAt"]).default("createdAt"),
       sortOrder: z.enum(["asc", "desc"]).default("desc"),
     }).optional()).query(async ({ ctx, input }) => {
       const { search, sortBy = "createdAt", sortOrder = "desc" } = input || {};
       console.log(search, sortBy, sortOrder)
       const candidateId = ctx.user.id;
       const favoriteJobs = await db
       .select({ job: jobs }) // sirf job object
       .from(jobFavorites)
       .innerJoin(jobs, eq(jobFavorites.jobId, jobs.id))
       .where(eq(jobFavorites.candidateId, candidateId))
       .orderBy(sortOrder === "asc" ? asc(jobs.createdAt) : desc(jobs.createdAt));
   
     return favoriteJobs.map((item) => item.job);
     }),
     getFavoriteCandidates: candidateProcedure.input(z.object({
         search: z.string().optional(),
         sortBy: z.enum(["name", "email", "createdAt"]).default("createdAt"),
         sortOrder: z.enum(["asc", "desc"]).default("desc"),
       }).optional()).query(async ({ ctx, input }) => {
        const candidateId = ctx.user.id;
        const { search, sortBy = "createdAt", sortOrder = "desc" } = input || {};
    
        // Step 1: Get job IDs from favorite list
        const favoriteJobEntries = await db
          .select({ job: jobs })
          .from(jobFavorites)
          .innerJoin(jobs, eq(jobFavorites.jobId, jobs.id))
          .where(eq(jobFavorites.candidateId, candidateId))
          .orderBy(sortOrder === "asc" ? asc(jobs.createdAt) : desc(jobs.createdAt));
    
        const jobIds = favoriteJobEntries.map((item) => item.job.id);
    
        if (!jobIds.length) return [];
    
        // Step 2: Prepare sort logic
        const sortField = {
          name: candidates.name,
          email: candidates.email,
          createdAt: candidates.createdAt,
        }[sortBy];
        const orderClause = sortOrder === "asc" ? asc(sortField) : desc(sortField);
    
        // Step 3: Query candidates + resume for those job IDs (assuming each job has many candidates)
        const result = await db
          .select({
            job: jobs,
            candidate: candidates,
            resume: resumes,
            workExperiences: workExperiences,
            educations: educations,
          })
          .from(jobs)
          .innerJoin(jobFavorites, eq(jobs.id, jobFavorites.jobId))
          .innerJoin(candidates, eq(jobFavorites.candidateId, candidates.id))
          .leftJoin(resumes, eq(candidates.defaultResumeId, resumes.id))
          .leftJoin(workExperiences, eq(workExperiences.resumeId, resumes.id))
          .leftJoin(educations, eq(educations.resumeId, resumes.id))
          .where(
            and(
              jobIds.length ? inArray(jobs.id, jobIds) : undefined,
              search
                ? or(
                    ilike(candidates.name, `%${search}%`),
                    ilike(candidates.email, `%${search}%`)
                  )
                : undefined
            )
          )
          .orderBy(orderClause);
    
        console.log(result)
        if (!result.length) return [];
    
        // Step 4: Format the result for grouped resume data
        const candidateMap = new Map<string, CandidateWithResume>();

for (const row of result) {
  const candidateId = row.candidate.id;

  if (!candidateMap.has(candidateId)) {
    candidateMap.set(candidateId, {
      ...row.candidate,
      resumeData: row.resume
        ? {
            ...row.resume,
            workExperiences: [],
            educations: [],
          }
        : null,
    });
  }

  const candidateEntry = candidateMap.get(candidateId)!;

  if (row.workExperiences?.id) {
    candidateEntry.resumeData?.workExperiences.push(row.workExperiences);
  }

  if (row.educations?.id) {
    candidateEntry.resumeData?.educations.push(row.educations);
  }
}

const favCandidates: CandidateWithResume[] = Array.from(candidateMap.values());
return favCandidates;
       })
})