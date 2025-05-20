import { JobFormSection } from "../sections/jobFormSection";

export function JobFormView({ jobId }: { jobId?: string }) {
    console.log("jobId", jobId)
  return (
    <>
      <JobFormSection jobId={jobId} />
    </>
  )
}