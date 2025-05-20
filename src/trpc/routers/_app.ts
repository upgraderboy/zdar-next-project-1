import { candidatesRouter } from '@/modules/candidates/server/procedure';
import { createTRPCRouter } from '../init';
import { resumeRouter } from '@/modules/resumes/server/procedure';
import { companyRouter } from '@/modules/companies/server/procedure';
import { jobRouter } from '@/modules/jobs/server/procedure';
import { analysisRouter } from '@/modules/analysis/server/procedure';
import '@/app/globals.css';
export const appRouter = createTRPCRouter({
    candidates: candidatesRouter,
    companies: companyRouter,
    resume: resumeRouter,
    job: jobRouter,
    analysis: analysisRouter
});

export type AppRouter = typeof appRouter;