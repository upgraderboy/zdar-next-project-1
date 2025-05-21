"use client"
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { HomeNavBar } from "./HomeNavBar";
import { NavigationSidebar } from "./NavigationSidebar";
import { Roles } from "../../types/globals";

interface HomeLayoutProps {
    children: ReactNode;
    role?: Roles;
    userId?: string;
}



export const HomeLayout = ({ children, role, userId }: HomeLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="w-full">
                <HomeNavBar />
                <div className="flex min-h-screen pt-[4rem]">
                    <NavigationSidebar role={role} userId={userId} />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}