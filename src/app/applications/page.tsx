import { HydrateClient } from "@/trpc/server";

export default function ApplicationsPage() {
    return (
        <HydrateClient>
            <div>
                <h1>Applications</h1>
            </div>
        </HydrateClient>
    )
}