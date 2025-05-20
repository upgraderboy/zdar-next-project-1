import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { HydrateClient, trpc } from "@/trpc/server";
import { ProfileView } from "@/modules/candidates/ui/views/profile-view";
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth()
  console.log(sessionClaims)
  if (sessionClaims?.metadata.onboardingComplete === true) {
    redirect('/')
  }
  if (sessionClaims?.metadata.role === "CANDIDATE" && sessionClaims?.metadata.onboardingComplete === false) {
    void trpc.resume.getList.prefetch();
    void trpc.candidates.getProfile.prefetch();
    return <HydrateClient>
        <ProfileView />
    </HydrateClient>
  }
  if (sessionClaims?.metadata.role === "COMPANY" && sessionClaims?.metadata.onboardingComplete === false) {
    return <HydrateClient>
        <ProfileView />
    </HydrateClient>
  }

  return <>{children}</>
}