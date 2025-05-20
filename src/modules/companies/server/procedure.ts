import * as z from "zod";
import { companyProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { companies, companySchema, favoriteCandidates } from "@/db/schema";

import { and, eq, ilike, asc, desc } from "drizzle-orm";  
export const companyRouter = createTRPCRouter({
    getAllCompanies: protectedProcedure.input(
        z.object({
          search: z.string().optional(),
          sortBy: z.enum(["companyName", "createdAt"]).default("createdAt"),
          sortOrder: z.enum(["asc", "desc"]).default("desc"),
        }).optional()
      ).query(async ({ input }) => {
        const { search, sortOrder = "desc" } = input || {};
        const companiesList = await db.select().from(companies).where(
            and(
              ilike(companies.companyName, `%${search}%`)
            )
          ).orderBy(
            sortOrder === "asc" ? asc(companies.createdAt) : desc(companies.createdAt)
          );
        // console.log(profile)
        return companiesList;
    }),
    getProfile: companyProcedure.query(async ({ ctx }) => {
        const { user } = ctx;
        const [profile] = await db.select().from(companies).where(eq(companies.id, user.id));
        // console.log(profile)
        return profile;
    }),
    companyProfile: companyProcedure.input(z.object({ companyId: z.string() })).query(async ({ input }) => {
        const { companyId } = input;
        const [profile] = await db.select().from(companies).where(eq(companies.id, companyId));
        // console.log(profile)
        return profile;
    }),
    updateProfile: companyProcedure.input(
        companySchema
    ).mutation(async ({ input }) => {
        console.log(input)
        const [company] = await db.update(companies).set(input).returning();
        console.log(company)
        return company;
    }),
    toggleFavorite: companyProcedure
    .input(z.object({
        candidateId: z.string().uuid(),
      }))
      .mutation(async ({ ctx, input }) => {
        const companyId = ctx.user.id;
  
        // ✅ Check if already favorited
        const existing = await db
          .select()
          .from(favoriteCandidates)
          .where(
            and(
              eq(favoriteCandidates.companyId, companyId),
              eq(favoriteCandidates.candidateId, input.candidateId)
            )
          )
          .limit(1);
  
        if (existing.length > 0) {
          // ✅ Already exists ➔ DELETE it
          await db
            .delete(favoriteCandidates)
            .where(
              and(
                eq(favoriteCandidates.companyId, companyId),
                eq(favoriteCandidates.candidateId, input.candidateId)
              )
            );
  
          return { success: true, action: "removed" };
        } else {
          // ✅ Not exists ➔ INSERT it
          await db
            .insert(favoriteCandidates)
            .values({
              companyId,
              candidateId: input.candidateId,
            });
  
          return { success: true, action: "added" };
        }
      })
})
