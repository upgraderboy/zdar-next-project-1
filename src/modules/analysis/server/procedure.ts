import { db } from "@/db";
import { companies, jobs, resumes } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";





// Inferred types for selected data
type Company = typeof companies.$inferSelect;
type Job = typeof jobs.$inferSelect;

type CompanyWithJobs = Company & {
    jobs: Job[];
};
export const analysisRouter = createTRPCRouter({
    candidateAnalysis: protectedProcedure.query(async () => {
        const data = await db.select().from(resumes);
        console.log("data: ", data)
        return data;
    }),
    companyAnalysis: protectedProcedure.query(async () => {
        const data = await db
            .select({
                company: companies,
                job: jobs,
            })
            .from(companies)
            .leftJoin(jobs, eq(companies.id, jobs.companyId));
        const companyMap = new Map<string, CompanyWithJobs>();

        for (const row of data) {
            const companyId = row.company.id;

            if (!companyMap.has(companyId)) {
                companyMap.set(companyId, {
                    ...row.company,
                    jobs: [],
                });
            }

            if (row.job) {
                companyMap.get(companyId)?.jobs.push(row.job);
            }
        }

        const companiesWithJobs: CompanyWithJobs[] = Array.from(companyMap.values());
        console.log("data: ", companiesWithJobs)
        return companiesWithJobs;
    })
});
