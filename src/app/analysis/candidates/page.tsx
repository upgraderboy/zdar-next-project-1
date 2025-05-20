// import { DashboardPage } from "@/modules/analysis/candidates/ui/sections/dashboard"
import { trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"
export default function AnalysisPage() {
    void trpc.analysis.candidateAnalysis.prefetch()
    return <div>
        {/* <DashboardPage /> */}
    </div>
}