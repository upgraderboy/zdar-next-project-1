import { HomeLayout } from "@/components/HomeLayout";
import Footer from "@/components/Footer";
interface HomeLayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: HomeLayoutProps) => {
    return (
        <>
            <HomeLayout>
                {children}
            <Footer />
            </HomeLayout>
        </>
    )
}
export default Layout;