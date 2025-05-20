import { db } from "@/db";
import { companies, jobs, resumes } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";

export const analysisRouter = createTRPCRouter({
    candidateAnalysis: protectedProcedure.query(async () => {
        const data = await db.select().from(resumes);
        console.log("data: ", data)
        return data;
    }),
    companyAnalysis: protectedProcedure.query(async () => {
        const data = await db.select().from(companies).rightJoin(jobs, eq(companies.id, jobs.companyId));
        console.log("data: ", data)
        return data;
    })
});
