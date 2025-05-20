import { ReactNode } from "react";
import { HomeLayout } from "@/components/HomeLayout";

interface HomeLayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: HomeLayoutProps) => {
    return (
        <>
            <HomeLayout>
                {children}
            </HomeLayout>
        </>
    )
}
export default Layout;