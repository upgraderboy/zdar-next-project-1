import JobLayout from "@/modules/jobs/layouts/form-layout";

export default function JobsLayout({ children }: { children: React.ReactNode }) {
    return (
        <JobLayout>{children}</JobLayout>
    )
}