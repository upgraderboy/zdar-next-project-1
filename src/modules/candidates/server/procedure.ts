import { db } from "@/db";
import { candidates, educations, jobFavorites, jobs, resumes, workExperiences } from "@/db/schema";
import { candidateProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
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
export const candidatesRouter = createTRPCRouter({
  getAllCandidates: protectedProcedure.input(
      z.object({
        search: z.string().optional(),
        sortBy: z.enum(["name", "email", "createdAt"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }).optional()).query(async ({ input }) => {
      const { search, sortBy = "createdAt", sortOrder = "desc" } = input || {};

      // Safe sort field fallback
      const sortField = {
        name: candidates.name,
        email: candidates.email,
        createdAt: candidates.createdAt,
      }[sortBy];

      const orderClause = sortOrder === "asc" ? asc(sortField) : desc(sortField);

      const result = await db
        .select({
          candidate: candidates,
          resume: resumes,
          workExperiences: workExperiences,
          educations: educations,
        })
        .from(candidates)
        .leftJoin(resumes, eq(candidates.defaultResumeId, resumes.id))
        .leftJoin(workExperiences, eq(workExperiences.resumeId, resumes.id))
        .leftJoin(educations, eq(educations.resumeId, resumes.id))
        .where(
          search
            ? or(
              ilike(candidates.name, `%${search}%`),
              ilike(candidates.email, `%${search}%`)
            )
            : undefined
        )
        .orderBy(orderClause);

      if (!result.length) {
        // Instead of throwing error, return empty array
        return [];
      }

      // Format result to remove duplication
      const candidatesMap = new Map<string, CandidateWithResume>();

      for (const row of result) {
        const candidateId = row.candidate.id;

        if (!candidatesMap.has(candidateId)) {
          candidatesMap.set(candidateId, {
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

        const candidateData = candidatesMap.get(candidateId)!;

        if (row.workExperiences && row.workExperiences.id) {
          candidateData.resumeData?.workExperiences.push(row.workExperiences);
        }
        if (row.educations && row.educations.id) {
          candidateData.resumeData?.educations.push(row.educations);
        }
      }

      const candidatesArray = Array.from(candidatesMap.values());
      console.log("✅ Formatted Candidates:", candidatesArray);

      return candidatesArray;
    }),
  getProfile: candidateProcedure.query(async ({ ctx }) => {

    const result = await db
      .select({
        candidate: candidates,
        resume: resumes,
        workExperiences: workExperiences,
        educations: educations,
      })
      .from(candidates)
      .leftJoin(resumes, eq(candidates.defaultResumeId, resumes.id))
      .leftJoin(workExperiences, eq(workExperiences.resumeId, resumes.id))
      .leftJoin(educations, eq(educations.resumeId, resumes.id))
      .where(eq(candidates.id, ctx.user.id));
    console.log("result: ", result)
    if (!result.length) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Candidate not found" });
    }
    // 🧹 Now format the data properly
    const candidateData = {
      ...result[0].candidate,
      resumeData: result[0].resume
        ? {
          ...result[0].resume,
          workExperiences: [] as typeof workExperiences.$inferSelect[],
          educations: [] as typeof educations.$inferSelect[],
        }
        : null,
    };
    for (const row of result) {
      if (row.workExperiences && row.workExperiences.id) {
        candidateData.resumeData?.workExperiences?.push(row.workExperiences);
      }
      if (row.educations && row.educations.id) {
        candidateData.resumeData?.educations?.push(row.educations);
      }
    }
    console.log("candidateData: ", candidateData)
    return candidateData;
  }),
  getCandidate: protectedProcedure.input(z.object({ candidateId: z.string() })).query(async ({ input }) => {
    const { candidateId } = input;
    console.log("candidateId: ", candidateId)
    const result = await db
      .select({
        candidate: candidates,
        resume: resumes,
        workExperiences: workExperiences,
        educations: educations,
      })
      .from(candidates)
      .leftJoin(resumes, eq(candidates.defaultResumeId, resumes.id))
      .leftJoin(workExperiences, eq(workExperiences.resumeId, resumes.id))
      .leftJoin(educations, eq(educations.resumeId, resumes.id))
      .where(eq(candidates.id, candidateId));
    console.log("result: ", result)
    if (!result.length) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Candidate not found" });
    }
    // 🧹 Now format the data properly
    const candidateData = {
      ...result[0].candidate,
      resumeData: result[0].resume
        ? {
          ...result[0].resume,
          workExperiences: [] as typeof workExperiences.$inferSelect[],
          educations: [] as typeof educations.$inferSelect[],
        }
        : null,
    };
    for (const row of result) {
      if (row.workExperiences && row.workExperiences.id) {
        candidateData.resumeData?.workExperiences?.push(row.workExperiences);
      }
      if (row.educations && row.educations.id) {
        candidateData.resumeData?.educations?.push(row.educations);
      }
    }
    console.log("candidateData: ", candidateData)
    return candidateData;
  }),
  updateProfile: protectedProcedure.mutation(() => {
    return {
      name: "Candidate"
    }
  }),
  toggleFavorite: candidateProcedure.input(z.object({
    jobId: z.string().uuid(),
  }))
    .mutation(async ({ ctx, input }) => {
      const candidateId = ctx.user.id; // 🧠 Assuming ctx.user.id is candidateId

      // ✅ Check if already favorited
      const existing = await db
        .select()
        .from(jobFavorites)
        .where(
          and(
            eq(jobFavorites.candidateId, candidateId),
            eq(jobFavorites.jobId, input.jobId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // ✅ Already favorited ➔ REMOVE
        await db
          .delete(jobFavorites)
          .where(
            and(
              eq(jobFavorites.candidateId, candidateId),
              eq(jobFavorites.jobId, input.jobId)
            )
          );

        return { success: true, action: "removed" };
      } else {
        // ✅ Not favorited yet ➔ ADD
        await db
          .insert(jobFavorites)
          .values({
            candidateId,
            jobId: input.jobId,
          });

        return { success: true, action: "added" };
      }
    }),
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
  })
})