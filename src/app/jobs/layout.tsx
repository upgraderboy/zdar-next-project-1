import { HomeLayout } from "@/components/HomeLayout";
import Footer from "@/components/Footer";
import { auth } from "@clerk/nextjs/server";
interface HomeLayoutProps {
    children: React.ReactNode;
}

const JobLayout = async ({ children }: HomeLayoutProps) => {
    const { sessionClaims, userId } = await auth();
    return (
        <>
            <HomeLayout role={sessionClaims?.metadata.role} userId={userId || undefined}>
                {children}
            <Footer />
            </HomeLayout>
        </>
    )
}

export default JobLayout;