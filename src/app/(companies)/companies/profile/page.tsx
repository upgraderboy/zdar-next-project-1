import { ProfileFormView } from "@/modules/companies/views/home-view"
import { HydrateClient, trpc } from "@/trpc/server"
export const dynamic = "force-dynamic"
export default async function ProfilePage(){

    void trpc.companies.getProfile.prefetch();
    return (
        <>
            <HydrateClient>
                <ProfileFormView />
            </HydrateClient>
        </>
    )
}

