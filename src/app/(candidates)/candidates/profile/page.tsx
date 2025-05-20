import { HydrateClient } from "@/trpc/server";
import { ProfileView } from "@/modules/candidates/ui/views/profile-view";
import { trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";
export default async function ProfilePage() {
    void trpc.resume.getList.prefetch();
    void trpc.candidates.getProfile.prefetch();
    return <HydrateClient>
        <ProfileView />
    </HydrateClient>
}