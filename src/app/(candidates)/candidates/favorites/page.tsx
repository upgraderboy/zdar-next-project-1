import { HydrateClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import FavoriteJobsView from "@/modules/favorites/views/favorite-jobs-list-view";
export const dynamic = "force-dynamic";
export default async function ProfilePage() {
    void trpc.favorites.getFavoriteJobs.prefetch({
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    return <HydrateClient>
        <FavoriteJobsView />
    </HydrateClient>
}