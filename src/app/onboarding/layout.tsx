import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { HydrateClient, trpc } from "@/trpc/server";
import { CandidateProfileView } from "@/modules/candidates/ui/views/profile-view";
import { CompanyProfileFormView } from "@/modules/companies/views/home-view";
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
        <CandidateProfileView />
    </HydrateClient>
  }
  if (sessionClaims?.metadata.role === "COMPANY" && sessionClaims?.metadata.onboardingComplete === false) {
    return <HydrateClient>
        <CompanyProfileFormView />
    </HydrateClient>
  }

  return <>{children}</>
}