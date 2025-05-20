import { HomeLayout } from "@/components/HomeLayout";
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-screen">{children}</div>
        </HomeLayout>
    );
}