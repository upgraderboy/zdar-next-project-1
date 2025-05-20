import { HomeLayout } from "@/components/HomeLayout";

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
    return <HomeLayout>
        {children}
    </HomeLayout>
}