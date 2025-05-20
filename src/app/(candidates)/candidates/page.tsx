import CandidatesView from "@/modules/candidates/ui/views/candidates-list-view";
import { HydrateClient } from "@/trpc/server";
export const dynamic = "force-dynamic";
import { trpc } from "@/trpc/server";
export default async function ProfilePage() {
    void trpc.candidates.getAllCandidates.prefetch({
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    return <HydrateClient>
        <CandidatesView />
    </HydrateClient>
}